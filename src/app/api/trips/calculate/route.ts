import { NextRequest, NextResponse } from "next/server";
import { calculatePricingPure, marginTier } from "@/lib/pricing";
import { calculateRouteDistanceKm, buildHotelCentricWaypoints, GeoPoint } from "@/lib/distance";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      numPax = 2,
      tripDaysCount = 1,
      vehicleTypeId,
      hotelId,
      destinationIds = [],
      activityIds = [],
      mealOptionIds = [],
      pickupPoint,
      pickupLat,
      pickupLng,
      dropoffPoint,
      dropoffLat,
      dropoffLng,
      includeGuide = true,
    } = body;

    // 1. Vehicle rate
    let vehicleRatePerKm = 5000;
    if (vehicleTypeId) {
      const v = await prisma.vehicleType.findUnique({ where: { id: vehicleTypeId } });
      if (v) vehicleRatePerKm = parseFloat(v.ratePerKm.toString());
    }

    // 2. Hotel
    let hotelPricePerNight = 0;
    let hotelPaxPerRoom = 2;
    let hotelData: any = null;
    if (hotelId) {
      const h = await prisma.hotel.findUnique({ where: { id: hotelId } });
      if (h) {
        hotelPricePerNight = parseFloat(h.pricePerRoomPerNight.toString());
        hotelPaxPerRoom = h.paxPerRoom;
        hotelData = h;
      }
    }

    // 3. Destinations & Structured Waypoints
    let ticketsTotalPerPerson = 0;
    const destMap = new Map<string, any>();
    if (destinationIds.length > 0) {
      const destinations = await prisma.destination.findMany({
        where: { id: { in: destinationIds } },
      });
      destinations.forEach((d) => destMap.set(d.id, d));
      destinations.forEach((d) => {
        ticketsTotalPerPerson += parseFloat(d.ticketPrice.toString());
      });
    }

    // Build structured days for hotel-centric circuit
    const inputDays: any[] = body.days || [];
    const structuredDays: Array<{
      dayNumber: number;
      destinations: Array<GeoPoint & { id?: string; name: string }>;
    }> = [];

    if (inputDays.length > 0) {
      inputDays.forEach((d, idx) => {
        const dayDests: any[] = [];
        (d.destinationIds || []).forEach((id: string) => {
          const dest = destMap.get(id);
          if (dest) {
            dayDests.push({ lat: dest.lat, lng: dest.lng, name: dest.name, id: dest.id });
          }
        });
        structuredDays.push({
          dayNumber: d.dayNumber || idx + 1,
          destinations: dayDests,
        });
      });
    } else {
      // Distribute destinationIds across tripDaysCount
      const daysCountInt = Math.max(1, parseInt(tripDaysCount || 1));
      for (let i = 0; i < daysCountInt; i++) {
        structuredDays.push({ dayNumber: i + 1, destinations: [] });
      }
      destinationIds.forEach((id: string, idx: number) => {
        const dest = destMap.get(id);
        if (dest) {
          const targetDay = idx % daysCountInt;
          structuredDays[targetDay].destinations.push({
            lat: dest.lat,
            lng: dest.lng,
            name: dest.name,
            id: dest.id,
          });
        }
      });
    }

    const pickupGeo: GeoPoint = {
      lat: pickupLat || -7.3798,
      lng: pickupLng || 112.7876,
      name: pickupPoint || "Surabaya Juanda Airport",
    };

    const dropoffGeo: GeoPoint = {
      lat: dropoffLat || (dropoffPoint?.includes("Ketapang") ? -8.1485 : pickupGeo.lat),
      lng: dropoffLng || (dropoffPoint?.includes("Ketapang") ? 114.3985 : pickupGeo.lng),
      name: dropoffPoint || "Dropoff Point",
    };

    const hotelGeo = hotelData
      ? {
          lat: hotelData.lat || -7.925,
          lng: hotelData.lng || 112.9972,
          name: hotelData.name,
        }
      : null;

    // Hotel-centric realistic waypoint sequence:
    // Pickup -> Hotel Check-in -> Day 1 Dests -> Return to Hotel -> Day 2 Dests -> Return to Hotel -> Dropoff
    const waypoints = buildHotelCentricWaypoints({
      pickup: pickupGeo,
      dropoff: dropoffGeo,
      hotel: hotelGeo,
      days: structuredDays,
    });

    // 4. Activities
    if (activityIds.length > 0) {
      const activities = await prisma.activity.findMany({
        where: { id: { in: activityIds } },
      });
      const actMap = new Map(activities.map((a) => [a.id, a]));
      activityIds.forEach((id: string) => {
        const a = actMap.get(id);
        if (a) {
          ticketsTotalPerPerson += parseFloat(a.ticketPrice.toString());
        }
      });
    }

    // 5. Meals
    let mealsTotalPerPerson = 0;
    if (mealOptionIds.length > 0) {
      const meals = await prisma.mealOption.findMany({
        where: { id: { in: mealOptionIds } },
      });
      const mealMap = new Map(meals.map((m) => [m.id, m]));
      mealOptionIds.forEach((id: string) => {
        const m = mealMap.get(id);
        if (m) {
          mealsTotalPerPerson += parseFloat(m.pricePerPax.toString());
        }
      });
    }

    // 6. Guide rate config
    let guideRatePerDay = 500000;
    const guideConfig = await prisma.priceConfig.findUnique({ where: { key: "guide_rate_per_day" } });
    if (guideConfig) guideRatePerDay = parseFloat(guideConfig.value);

    // 7. Calculate Distance
    const distanceKm = await calculateRouteDistanceKm(waypoints);

    // 8. Calculate Pricing
    const pricing = calculatePricingPure(distanceKm, {
      numPax,
      tripDaysCount,
      vehicleRatePerKm,
      hotelPricePerNight,
      hotelPaxPerRoom,
      ticketsTotalPerPerson,
      mealsTotalPerPerson,
      guideRatePerDay,
      includeGuide: includeGuide !== false,
    });

    return NextResponse.json({
      success: true,
      pricing,
      waypoints,
      includeGuide: includeGuide !== false,
      guideRatePerDay,
    });
  } catch (error) {
    console.error("Trip calculation error:", error);
    return NextResponse.json({ error: "Failed to calculate trip pricing" }, { status: 500 });
  }
}
