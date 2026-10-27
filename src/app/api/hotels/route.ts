import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const region = searchParams.get("region");
    const hotelClass = searchParams.get("class");
    const activeOnly = searchParams.get("active") !== "false";

    const where: any = {};
    if (activeOnly) where.isActive = true;
    if (region) where.region = region;
    if (hotelClass) where.hotelClass = hotelClass;

    const hotels = await prisma.hotel.findMany({
      where,
      orderBy: { pricePerRoomPerNight: "asc" },
    });

    return NextResponse.json({ hotels });
  } catch (error) {
    console.error("Fetch hotels error:", error);
    return NextResponse.json({ error: "Failed to fetch hotels" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (session && session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const hotel = await prisma.hotel.create({
      data: {
        name: body.name,
        region: body.region || "Bromo",
        hotelClass: body.hotelClass || "standard",
        pricePerRoomPerNight: parseFloat(body.pricePerRoomPerNight || 500000),
        paxPerRoom: parseInt(body.paxPerRoom || 2),
        description: body.description,
        imageUrl: body.imageUrl || "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
        rating: body.rating ? parseFloat(body.rating) : 4.8,
        reviewCount: body.reviewCount ? parseInt(body.reviewCount) : 80,
        googleMapsUrl: body.googleMapsUrl || `https://maps.google.com/?q=${encodeURIComponent(body.name + " " + (body.region || "East Java"))}`,
        lat: body.lat ? parseFloat(body.lat) : null,
        lng: body.lng ? parseFloat(body.lng) : null,
        isActive: body.isActive !== false,
      },
    });

    return NextResponse.json({ success: true, hotel });
  } catch (error) {
    console.error("Create hotel error:", error);
    return NextResponse.json({ error: "Failed to create hotel" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...data } = body;
    if (!id) return NextResponse.json({ error: "Hotel ID required" }, { status: 400 });

    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.region !== undefined) updateData.region = data.region;
    if (data.hotelClass !== undefined) updateData.hotelClass = data.hotelClass;
    if (data.pricePerRoomPerNight !== undefined) updateData.pricePerRoomPerNight = parseFloat(data.pricePerRoomPerNight);
    if (data.paxPerRoom !== undefined) updateData.paxPerRoom = parseInt(data.paxPerRoom);
    if (data.description !== undefined) updateData.description = data.description;
    if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl;
    if (data.rating !== undefined) updateData.rating = parseFloat(data.rating);
    if (data.reviewCount !== undefined) updateData.reviewCount = parseInt(data.reviewCount);
    if (data.googleMapsUrl !== undefined) updateData.googleMapsUrl = data.googleMapsUrl;
    if (data.lat !== undefined) updateData.lat = data.lat ? parseFloat(data.lat) : null;
    if (data.lng !== undefined) updateData.lng = data.lng ? parseFloat(data.lng) : null;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;

    const hotel = await prisma.hotel.update({
      where: { id },
      data: updateData,
    });
    return NextResponse.json({ success: true, hotel });
  } catch (error) {
    console.error("Update hotel error:", error);
    return NextResponse.json({ error: "Failed to update hotel" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Hotel ID required" }, { status: 400 });

    await prisma.hotel.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete hotel error:", error);
    return NextResponse.json({ error: "Failed to delete hotel" }, { status: 500 });
  }
}

