import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const bookingId = searchParams.get("id");
    const session = await getSession();

    // Lookup by ID for checkout page & voucher (sanitized public output)
    if (bookingId) {
      const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: {
          trip: {
            include: {
              vehicleType: true,
              hotel: true,
              days: {
                include: {
                  items: {
                    include: {
                      destination: true,
                      activity: true,
                    },
                  },
                },
                orderBy: { dayNumber: "asc" },
              },
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
          assignedGuide: {
            select: {
              id: true,
              name: true,
              phone: true,
            },
          },
          payments: {
            select: {
              id: true,
              amount: true,
              currency: true,
              status: true,
              paymentType: true,
              paidAt: true,
            },
          },
          // Only include internal expenses if admin or finance or assigned guide
          expenses: !!(
            session && (session.role === "admin" || session.role === "finance" || session.role === "guide")
          ),
          costLines: !!(session && (session.role === "admin" || session.role === "finance")),
          commission: !!(session && (session.role === "admin" || session.role === "finance")),
        },
      });

      if (!booking) return NextResponse.json({ bookings: [] });

      // If user is guest/public customer, strip private pricing internals
      const isPrivileged = !!(session && (session.role === "admin" || session.role === "finance"));
      const sanitizedBooking: any = {
        ...booking,
      };
      if (booking.trip) {
        sanitizedBooking.trip = {
          ...booking.trip,
          marginTargetAmount: isPrivileged ? (booking.trip as any).marginTargetAmount : undefined,
          commissionReserveAmount: isPrivileged ? (booking.trip as any).commissionReserveAmount : undefined,
          gatewayFeeAmount: isPrivileged ? (booking.trip as any).gatewayFeeAmount : undefined,
        };
      }

      return NextResponse.json({ bookings: [sanitizedBooking] });
    }

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const where: any = {};
    if (session.role === "customer") {
      where.userId = session.id;
    } else if (session.role === "guide") {
      where.assignedGuideId = session.id;
    } else if (session.role === "agent") {
      const agent = await prisma.agent.findUnique({ where: { userId: session.id } });
      where.agentId = agent ? agent.id : "no-match";
    }

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        trip: {
          include: {
            vehicleType: true,
            hotel: true,
            days: {
              include: {
                items: {
                  include: {
                    destination: true,
                    activity: true,
                  },
                },
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        assignedGuide: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
        payments: true,
        expenses: session.role === "admin" || session.role === "finance" || session.role === "guide",
        costLines: session.role === "admin" || session.role === "finance",
        commission: session.role === "admin" || session.role === "finance" || session.role === "agent",
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ bookings });
  } catch (error) {
    console.error("Fetch bookings error:", error);
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { tripId, customerName, customerEmail, customerPhone } = body;

    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      include: { vehicleType: true, lead: true },
    });

    if (!trip) {
      return NextResponse.json({ error: "Trip not found" }, { status: 404 });
    }

    const midtransOrderId = `ITN-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const booking = await prisma.booking.create({
      data: {
        tripId: trip.id,
        userId: trip.userId,
        agentId: trip.agentId || null,
        totalAmount: trip.totalAmount,
        currency: "IDR",
        status: "pending",
        customerName: customerName || "Guest Customer",
        customerEmail: customerEmail || "",
        customerPhone: customerPhone || "",
        midtransOrderId,
      },
      include: { trip: true },
    });

    // If trip is tied to a lead, advance status to "booked" and log activity
    if (trip.leadId) {
      await prisma.lead.update({
        where: { id: trip.leadId },
        data: {
          status: "booked",
          lastAgentActivityAt: new Date(),
        },
      });

      await prisma.leadActivity.create({
        data: {
          leadId: trip.leadId,
          type: "status_change",
          body: `Booking dibuat (${booking.midtransOrderId}). Status lead berubah menjadi 'booked'.`,
          meta: { bookingId: booking.id, midtransOrderId: booking.midtransOrderId },
        },
      });
    }

    return NextResponse.json({ success: true, booking });
  } catch (error) {
    console.error("Create booking error:", error);
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
  }
}
