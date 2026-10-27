import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const bookingId = searchParams.get("id");

    // Public lookup by ID for checkout and success vouchers
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
          user: true,
          assignedGuide: true,
          payments: true,
          expenses: true,
        },
      });
      return NextResponse.json({ bookings: booking ? [booking] : [] });
    }

    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const where: any = {};
    if (session.role === "customer") {
      where.userId = session.id;
    } else if (session.role === "guide") {
      where.assignedGuideId = session.id;
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
        user: true,
        assignedGuide: true,
        payments: true,
        expenses: true,
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
      include: { vehicleType: true },
    });

    if (!trip) {
      return NextResponse.json({ error: "Trip not found" }, { status: 404 });
    }

    const midtransOrderId = `ITN-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const booking = await prisma.booking.create({
      data: {
        tripId: trip.id,
        userId: trip.userId,
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

    return NextResponse.json({ success: true, booking });
  } catch (error) {
    console.error("Create booking error:", error);
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
  }
}

