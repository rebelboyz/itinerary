import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tripId = searchParams.get("id");
    const idsParam = searchParams.get("ids");

    // Public lookup by ID for checkout page
    if (tripId) {
      const trip = await prisma.trip.findUnique({
        where: { id: tripId },
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
          booking: true,
        },
      });
      return NextResponse.json({ trips: trip ? [trip] : [] });
    }

    // Lookup by multiple IDs (e.g. guest saved trips in browser)
    if (idsParam) {
      const idsList = idsParam
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      if (idsList.length === 0) return NextResponse.json({ trips: [] });

      const trips = await prisma.trip.findMany({
        where: { id: { in: idsList } },
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
          booking: true,
        },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json({ trips });
    }

    const session = await getSession();
    if (!session) {
      return NextResponse.json({ trips: [] });
    }

    const where = session.role === "admin" ? {} : { userId: session.id };

    const trips = await prisma.trip.findMany({
      where,
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
        booking: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ trips });
  } catch (error) {
    console.error("Fetch trips error:", error);
    return NextResponse.json({ error: "Failed to fetch trips" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    let session = await getSession();
    const body = await req.json();

    // If customer is not logged in, auto-create guest user or use provided email
    let userId = session?.id;
    if (!userId) {
      const guestEmail = body.customerEmail || `guest_${Date.now()}@itinerary.id`;
      let user = await prisma.user.findUnique({ where: { email: guestEmail } });
      if (!user) {
        user = await prisma.user.create({
          data: {
            email: guestEmail,
            name: body.customerName || "Guest Traveler",
            role: "customer",
            phone: body.customerPhone || null,
          },
        });
      }
      userId = user.id;
    }

    const trip = await prisma.trip.create({
      data: {
        userId,
        title: body.title || "East Java Custom Adventure",
        tripType: body.tripType || "private",
        startDate: new Date(body.startDate || Date.now()),
        endDate: new Date(body.endDate || Date.now() + 86400000),
        numPax: parseInt(body.numPax || 2),
        vehicleTypeId: body.vehicleTypeId,
        hotelId: body.hotelId || null,
        pickupPoint: body.pickupPoint || "Surabaya Juanda Airport",
        pickupLat: body.pickupLat || -7.3798,
        pickupLng: body.pickupLng || 112.7876,
        dropoffPoint: body.dropoffPoint || "Surabaya Juanda Airport",
        dropoffLat: body.dropoffLat || -7.3798,
        dropoffLng: body.dropoffLng || 112.7876,
        status: "draft",
        totalDistanceKm: parseFloat(body.pricing?.distanceKm || 0),
        transportCost: parseFloat(body.pricing?.transportCost || 0),
        hotelCost: parseFloat(body.pricing?.hotelCost || 0),
        ticketsCost: parseFloat(body.pricing?.ticketsCost || 0),
        mealsCost: parseFloat(body.pricing?.mealsCost || 0),
        guideCost: parseFloat(body.pricing?.guideCost || 0),
        withGuide: body.withGuide !== false && body.includeGuide !== false && parseFloat(body.pricing?.guideCost || 0) > 0,
        marginAmount: parseFloat(body.pricing?.marginAmount || 0),
        totalAmount: parseFloat(body.pricing?.totalAmount || 0),
        pricePerPax: parseFloat(body.pricing?.pricePerPax || 0),
        currency: "IDR",
        days: {
          create: (body.days || []).map((d: any, idx: number) => ({
            dayNumber: d.dayNumber || idx + 1,
            title: d.title || `Day ${idx + 1}`,
            note: d.note || "",
            items: {
              create: (d.items || []).map((item: any, itemIdx: number) => ({
                orderIndex: itemIdx,
                type: item.type || "destination",
                destinationId: item.destinationId || null,
                activityId: item.activityId || null,
                note: item.note || "",
              })),
            },
          })),
        },
      },
      include: {
        days: { include: { items: true } },
      },
    });

    return NextResponse.json({ success: true, trip });
  } catch (error) {
    console.error("Create trip error:", error);
    return NextResponse.json({ error: "Failed to create trip" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Trip ID required" }, { status: 400 });

    // Cascade delete any child items first
    await prisma.payment.deleteMany({
      where: { booking: { tripId: id } },
    });
    await prisma.expense.deleteMany({
      where: { booking: { tripId: id } },
    });
    await prisma.booking.deleteMany({
      where: { tripId: id },
    });
    await prisma.tripItem.deleteMany({
      where: { tripDay: { tripId: id } },
    });
    await prisma.tripDay.deleteMany({
      where: { tripId: id },
    });
    await prisma.trip.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete trip error:", error);
    return NextResponse.json({ error: "Failed to delete trip" }, { status: 500 });
  }
}

