import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || (session.role !== "admin" && session.role !== "cs")) {
      return NextResponse.json({ error: "Forbidden: Admin or CS access required" }, { status: 403 });
    }

    const { id: bookingId } = await params;
    const body = await req.json();
    const { status, assignedGuideId, note } = body;

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { trip: true, commission: true },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const updateData: any = {};
    if (status) {
      updateData.status = status;
    }
    if (assignedGuideId !== undefined) {
      updateData.assignedGuideId = assignedGuideId || null;
    }

    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: updateData,
    });

    // Update associated trip status
    if (status) {
      await prisma.trip.update({
        where: { id: booking.tripId },
        data: { status },
      });
    }

    // If marked "completed", advance lead to completed and trigger commission approval schedule
    if (status === "completed") {
      if (booking.trip.leadId) {
        await prisma.lead.update({
          where: { id: booking.trip.leadId },
          data: { status: "completed" },
        });

        await prisma.leadActivity.create({
          data: {
            leadId: booking.trip.leadId,
            authorId: session.id,
            type: "status_change",
            body: `Trip telah selesai dilaksanakan (completed).`,
          },
        });
      }

      // Schedule or approve commission
      if (booking.commission && booking.commission.status === "pending") {
        // D3 recommendation: approved after trip completed + 7 days
        // Or if admin confirms completion without claim:
        await prisma.commission.update({
          where: { id: booking.commission.id },
          data: {
            status: "approved",
            approvedAt: new Date(),
          },
        });
      }
    }

    // If cancelled or refunded before approved, void the commission
    if (status === "cancelled" || status === "refunded") {
      if (booking.commission) {
        if (booking.commission.status === "pending" || booking.commission.status === "approved") {
          await prisma.commission.update({
            where: { id: booking.commission.id },
            data: {
              status: "void",
              voidReason: note || `Booking diubah ke status ${status}`,
            },
          });
        } else if (booking.commission.status === "paid") {
          // If already paid, mark for clawback
          await prisma.commission.update({
            where: { id: booking.commission.id },
            data: {
              status: "clawback",
              voidReason: `Refund pasca-bayar: ${note || status}`,
            },
          });
        }
      }
    }

    // Log in AuditLog
    await prisma.auditLog.create({
      data: {
        actorId: session.id,
        action: "booking.status_update",
        entity: "Booking",
        entityId: bookingId,
        reason: note || `Status changed to ${status || "unchanged"}`,
        meta: { previousStatus: booking.status, newStatus: status, assignedGuideId },
      },
    });

    return NextResponse.json({ success: true, booking: updatedBooking });
  } catch (error) {
    console.error("Update booking status error:", error);
    return NextResponse.json({ error: "Failed to update booking status" }, { status: 500 });
  }
}

