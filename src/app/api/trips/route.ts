import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { calculatePricingPure, getPriceConfigRates } from "@/lib/pricing";
import { calculateRouteDistanceKm, buildHotelCentricWaypoints, resolveLocationCoordinates, GeoPoint } from "@/lib/distance";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tripId = searchParams.get("id");
    const idsParam = searchParams.get("ids");
    const session = await getSession();

    // Lookup by ID for checkout page (sanitized public output)
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
          booking: {
            select: {
              id: true,
              status: true,
              customerName: true,
              customerEmail: true,
              totalAmount: true,
              currency: true,
              paidAt: true,
            },
          },
        },
      });

      if (!trip) return NextResponse.json({ trips: [] });

      // If user is guest/public, sanitize sensitive internal amounts
      if (!session || (session.role !== "admin" && session.id !== trip.userId)) {
        const sanitizedTrip = {
          ...trip,
          marginTargetAmount: undefined,
          commissionReserveAmount: undefined,
          gatewayFeeAmount: undefined,
        };
        return NextResponse.json({ trips: [sanitizedTrip] });
      }

      return NextResponse.json({ trips: [trip] });
    }

    // Lookup by multiple IDs (guest saved trips in browser)
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
          booking: {
            select: {
              id: true,
              status: true,
              totalAmount: true,
              currency: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      // Sanitize internal margins for guests
      const sanitized = trips.map((t) => ({
        ...t,
        marginTargetAmount: undefined,
        commissionReserveAmount: undefined,
        gatewayFeeAmount: undefined,
      }));

      return NextResponse.json({ trips: sanitized });
    }

    if (!session) {
      return NextResponse.json({ trips: [] });
    }

    let where: any = { userId: session.id };
    if (session.role === "admin") {
      where = {};
    } else if (session.role === "agent") {
      const agent = await prisma.agent.findUnique({ where: { userId: session.id } });
      where = {
        OR: [
          { userId: session.id },
          ...(agent ? [{ agentId: agent.id }] : []),
        ],
      };
    }

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
    const session = await getSession();
    const body = await req.json();

    // 1. Resolve customer / guest user
    let userId = session?.id;
    if (!userId) {
      const guestEmail = (body.customerEmail || `guest_${Date.now()}@itinerary.id`).toLowerCase().trim();
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

    // 2. Resolve Agent and Lead
    let agentId: string | null = null;
    let leadId: string | null = body.leadId || null;

    if (session?.role === "agent") {
      const agent = await prisma.agent.findUnique({ where: { userId: session.id } });
      if (agent) agentId = agent.id;
    }

    if (leadId) {
      const lead = await prisma.lead.findUnique({ where: { id: leadId } });
      if (lead) {
        if (!agentId && lead.agentId) {
          agentId = lead.agentId;
        }
      } else {
        leadId = null;
      }
    }

    // 3. Server-side recalculation of pricing (Anti-tampering PRD §5.2 & §5.3)
    const numPax = Math.max(1, parseInt(body.numPax || 2));
    const rawDays = body.days || [];
    const tripDaysCount = Math.max(1, rawDays.length || 1);

    // Vehicle
    let vehicleRatePerKm = 5000;
    if (body.vehicleTypeId) {
      const v = await prisma.vehicleType.findUnique({ where: { id: body.vehicleTypeId } });
      if (v) vehicleRatePerKm = parseFloat(v.ratePerKm.toString());
    }

    // Hotel (Only applicable if trip duration > 1 day)
    let hotelPricePerNight = 0;
    let hotelPaxPerRoom = 2;
    let hotelData: any = null;
    let finalHotelId: string | null = null;
    if (body.hotelId && tripDaysCount > 1) {
      const h = await prisma.hotel.findUnique({ where: { id: body.hotelId } });
      if (h) {
        hotelPricePerNight = parseFloat(h.pricePerRoomPerNight.toString());
        hotelPaxPerRoom = h.paxPerRoom;
        hotelData = h;
        finalHotelId = h.id;
      }
    }

    // Collect destination & activity IDs from structured days
    const destinationIds: string[] = [];
    const activityIds: string[] = [];
    rawDays.forEach((d: any) => {
      (d.items || []).forEach((item: any) => {
        if (item.destinationId) destinationIds.push(item.destinationId);
        if (item.activityId) activityIds.push(item.activityId);
      });
      if (d.destinationIds) destinationIds.push(...d.destinationIds);
      if (d.activityIds) activityIds.push(...d.activityIds);
    });

    let ticketsTotalPerPerson = 0;
    const destMap = new Map<string, any>();
    if (destinationIds.length > 0) {
      const destinations = await prisma.destination.findMany({
        where: { id: { in: destinationIds } },
      });
      destinations.forEach((d) => {
        destMap.set(d.id, d);
        ticketsTotalPerPerson += parseFloat(d.ticketPrice.toString());
      });
    }

    if (activityIds.length > 0) {
      const activities = await prisma.activity.findMany({
        where: { id: { in: activityIds } },
      });
      activities.forEach((a) => {
        ticketsTotalPerPerson += parseFloat(a.ticketPrice.toString());
      });
    }

    // Waypoints for distance with accurate GPS coordinates resolution
    const pickupPointName = body.pickupPoint || "Surabaya Juanda Airport";
    const dropoffPointName = body.dropoffPoint || pickupPointName;
    const pickupCoords = resolveLocationCoordinates(pickupPointName, body.pickupLat, body.pickupLng);
    const dropoffCoords = resolveLocationCoordinates(dropoffPointName, body.dropoffLat, body.dropoffLng);

    const pickupGeo: GeoPoint = {
      lat: pickupCoords.lat,
      lng: pickupCoords.lng,
      name: pickupPointName,
    };
    const dropoffGeo: GeoPoint = {
      lat: dropoffCoords.lat,
      lng: dropoffCoords.lng,
      name: dropoffPointName,
    };
    const hotelGeo = hotelData
      ? { lat: hotelData.lat || -7.925, lng: hotelData.lng || 112.9972, name: hotelData.name }
      : null;

    const structuredDays = rawDays.map((d: any, idx: number) => {
      const dayDests: any[] = [];
      const itemDestIds = (d.items || [])
        .map((i: any) => i.destinationId)
        .concat(d.destinationIds || [])
        .filter(Boolean);

      itemDestIds.forEach((id: string) => {
        const dest = destMap.get(id);
        if (dest) dayDests.push({ lat: dest.lat, lng: dest.lng, name: dest.name, id: dest.id });
      });

      return {
        dayNumber: d.dayNumber || idx + 1,
        destinations: dayDests,
      };
    });

    const waypoints = buildHotelCentricWaypoints({
      pickup: pickupGeo,
      dropoff: dropoffGeo,
      hotel: hotelGeo,
      days: structuredDays,
    });

    const distanceKm = await calculateRouteDistanceKm(waypoints);
    const rates = await getPriceConfigRates(numPax);
    const includeGuide = body.withGuide !== false && body.includeGuide !== false;

    // Server-side pure pricing calculation
    const calculatedPricing = calculatePricingPure(distanceKm, {
      numPax,
      tripDaysCount,
      vehicleRatePerKm,
      hotelPricePerNight,
      hotelPaxPerRoom,
      ticketsTotalPerPerson,
      mealsTotalPerPerson: 0,
      guideRatePerDay: rates.guideRatePerDay,
      includeGuide,
      marginTargetRate: rates.marginTargetRate,
      commissionReserveRate: rates.commissionReserveRate,
      gatewayRate: rates.gatewayRate,
    });

    // 4. Create or Update Trip record with server-verified amounts
    const editTripId = body.tripId || body.id;
    let trip;

    if (editTripId) {
      const existingTrip = await prisma.trip.findUnique({
        where: { id: editTripId },
        include: { booking: { include: { payments: true } } },
      });

      if (!existingTrip) {
        return NextResponse.json({ error: "Trip not found" }, { status: 404 });
      }

      // Check if settled payment already exists
      const hasSettledPayment = existingTrip.booking?.payments?.some(
        (p) => p.status === "settlement" || p.status === "capture"
      );
      if (hasSettledPayment) {
        return NextResponse.json(
          { error: "Trip sudah dibayar lunas dan tidak dapat diubah langsung" },
          { status: 400 }
        );
      }

      // Clear old days & items for this trip
      await prisma.tripItem.deleteMany({
        where: { tripDay: { tripId: existingTrip.id } },
      });
      await prisma.tripDay.deleteMany({
        where: { tripId: existingTrip.id },
      });

      trip = await prisma.trip.update({
        where: { id: existingTrip.id },
        data: {
          title: body.title || existingTrip.title,
          tripType: body.tripType || existingTrip.tripType,
          startDate: new Date(body.startDate || existingTrip.startDate),
          endDate: new Date(body.endDate || Date.now() + 86400000),
          numPax,
          vehicleTypeId: body.vehicleTypeId,
          hotelId: finalHotelId,
          pickupPoint: body.pickupPoint || "Surabaya Juanda Airport",
          pickupLat: pickupCoords.lat,
          pickupLng: pickupCoords.lng,
          dropoffPoint: body.dropoffPoint || "Surabaya Juanda Airport",
          dropoffLat: dropoffCoords.lat,
          dropoffLng: dropoffCoords.lng,
          totalDistanceKm: calculatedPricing.distanceKm,
          transportCost: calculatedPricing.transportCost,
          hotelCost: calculatedPricing.hotelCost,
          ticketsCost: calculatedPricing.ticketsCost,
          mealsCost: calculatedPricing.mealsCost,
          guideCost: calculatedPricing.guideCost,
          withGuide: includeGuide,
          marginAmount: calculatedPricing.platformFeeAmount,
          platformFeeAmount: calculatedPricing.platformFeeAmount,
          marginTargetAmount: calculatedPricing.marginTargetAmount,
          commissionReserveAmount: calculatedPricing.commissionReserveAmount,
          gatewayFeeAmount: calculatedPricing.gatewayFeeAmount,
          totalAmount: calculatedPricing.totalAmount,
          pricePerPax: calculatedPricing.pricePerPax,
          currency: "IDR",
          days: {
            create: rawDays.map((d: any, idx: number) => ({
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
          vehicleType: true,
          hotel: true,
        },
      });

      // If existing trip has a booking, keep booking totalAmount in sync
      if (existingTrip.booking) {
        await prisma.booking.update({
          where: { id: existingTrip.booking.id },
          data: {
            totalAmount: calculatedPricing.totalAmount,
          },
        });
      }
    } else {
      trip = await prisma.trip.create({
        data: {
          userId,
          leadId,
          agentId,
          title: body.title || "East Java Custom Adventure",
          tripType: body.tripType || "private",
          startDate: new Date(body.startDate || Date.now()),
          endDate: new Date(body.endDate || Date.now() + 86400000),
          numPax,
          vehicleTypeId: body.vehicleTypeId,
          hotelId: finalHotelId,
          pickupPoint: body.pickupPoint || "Surabaya Juanda Airport",
          pickupLat: pickupCoords.lat,
          pickupLng: pickupCoords.lng,
          dropoffPoint: body.dropoffPoint || "Surabaya Juanda Airport",
          dropoffLat: dropoffCoords.lat,
          dropoffLng: dropoffCoords.lng,
          status: "draft",
          totalDistanceKm: calculatedPricing.distanceKm,
          transportCost: calculatedPricing.transportCost,
          hotelCost: calculatedPricing.hotelCost,
          ticketsCost: calculatedPricing.ticketsCost,
          mealsCost: calculatedPricing.mealsCost,
          guideCost: calculatedPricing.guideCost,
          withGuide: includeGuide,
          marginAmount: calculatedPricing.platformFeeAmount,
          platformFeeAmount: calculatedPricing.platformFeeAmount,
          marginTargetAmount: calculatedPricing.marginTargetAmount,
          commissionReserveAmount: calculatedPricing.commissionReserveAmount,
          gatewayFeeAmount: calculatedPricing.gatewayFeeAmount,
          totalAmount: calculatedPricing.totalAmount,
          pricePerPax: calculatedPricing.pricePerPax,
          currency: "IDR",
          days: {
            create: rawDays.map((d: any, idx: number) => ({
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
          vehicleType: true,
          hotel: true,
        },
      });
    }

    // 5. If created from Lead, advance lead to "quoted" and log activity
    if (leadId) {
      await prisma.lead.update({
        where: { id: leadId },
        data: {
          status: "quoted",
          lastAgentActivityAt: new Date(),
        },
      });

      await prisma.leadActivity.create({
        data: {
          leadId,
          authorId: session?.id || null,
          type: "quote_sent",
          body: `Penawaran trip "${trip.title}" (${calculatedPricing.totalAmount.toLocaleString()} IDR) dibuat.`,
          meta: { tripId: trip.id, totalAmount: calculatedPricing.totalAmount },
        },
      });
    }

    return NextResponse.json({ success: true, trip });
  } catch (error) {
    console.error("Create trip error:", error);
    return NextResponse.json({ error: "Failed to create trip" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Trip ID required" }, { status: 400 });

    const trip = await prisma.trip.findUnique({
      where: { id },
      include: { booking: { include: { payments: true } } },
    });

    if (!trip) {
      return NextResponse.json({ error: "Trip not found" }, { status: 404 });
    }

    // Authorization check
    if (session.role !== "admin" && trip.userId !== session.id) {
      return NextResponse.json({ error: "Forbidden: Cannot delete other user's trip" }, { status: 403 });
    }

    // Do not hard delete trips with settled payments
    const hasSettledPayment = trip.booking?.payments?.some(
      (p) => p.status === "settlement" || p.status === "capture"
    );
    if (hasSettledPayment) {
      return NextResponse.json(
        { error: "Trip tidak dapat dihapus karena sudah memiliki pembayaran lunas" },
        { status: 400 }
      );
    }

    // Safe deletion: only draft trips without payments or mark as cancelled
    if (trip.status === "draft" && !trip.booking) {
      await prisma.tripItem.deleteMany({ where: { tripDay: { tripId: id } } });
      await prisma.tripDay.deleteMany({ where: { tripId: id } });
      await prisma.trip.delete({ where: { id } });
    } else {
      // Soft cancel
      await prisma.trip.update({
        where: { id },
        data: { status: "cancelled" },
      });
      if (trip.booking) {
        await prisma.booking.update({
          where: { id: trip.booking.id },
          data: { status: "cancelled" },
        });
      }
    }

    return NextResponse.json({ success: true, message: "Trip successfully cancelled/deleted" });
  } catch (error) {
    console.error("Delete trip error:", error);
    return NextResponse.json({ error: "Failed to delete trip" }, { status: 500 });
  }
}
