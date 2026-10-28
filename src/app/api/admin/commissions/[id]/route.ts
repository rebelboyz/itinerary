import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || (session.role !== "admin" && session.role !== "finance")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();
    const { status, voidReason, reason } = body;

    const existingCommission = await prisma.commission.findUnique({
      where: { id },
    });

    if (!existingCommission) {
      return NextResponse.json({ error: "Commission not found" }, { status: 404 });
    }

    const updateData: any = {};
    if (status) {
      updateData.status = status;
      if (status === "approved" && existingCommission.status === "pending") {
        updateData.approvedAt = new Date();
      }
      if (status === "void") {
        if (!voidReason && !reason) {
          return NextResponse.json({ error: "Alasan pembatalan (voidReason) wajib diisi" }, { status: 400 });
        }
        updateData.voidReason = voidReason || reason;
      }
    }

    const updated = await prisma.commission.update({
      where: { id },
      data: updateData,
    });

    // Write AuditLog
    await prisma.auditLog.create({
      data: {
        actorId: session.id,
        action: "commission.edit",
        entity: "Commission",
        entityId: id,
        reason: reason || voidReason || `Status changed to ${status}`,
        meta: { previousStatus: existingCommission.status, newStatus: status },
      },
    });

    return NextResponse.json({ success: true, commission: updated });
  } catch (error) {
    console.error("Update commission error:", error);
    return NextResponse.json({ error: "Failed to update commission" }, { status: 500 });
  }
}

