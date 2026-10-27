import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const region = searchParams.get("region");
    const activeOnly = searchParams.get("active") !== "false";

    const where: any = {};
    if (activeOnly) where.isActive = true;
    if (region) where.region = region;

    const destinations = await prisma.destination.findMany({
      where,
      include: { activities: true },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ destinations });
  } catch (error) {
    console.error("Fetch destinations error:", error);
    return NextResponse.json({ error: "Failed to fetch destinations" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (session && session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const destination = await prisma.destination.create({
      data: {
        name: body.name,
        region: body.region || "Bromo",
        lat: parseFloat(body.lat || -7.9425),
        lng: parseFloat(body.lng || 112.953),
        category: body.category || "sight",
        description: body.description,
        ticketPrice: parseFloat(body.ticketPrice || 0),
        imageUrl: body.imageUrl || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
        rating: body.rating ? parseFloat(body.rating) : 4.8,
        reviewCount: body.reviewCount ? parseInt(body.reviewCount) : 100,
        googleMapsUrl: body.googleMapsUrl || `https://maps.google.com/?q=${encodeURIComponent(body.name + " " + (body.region || "East Java"))}`,
        isActive: body.isActive !== false,
      },
    });

    return NextResponse.json({ success: true, destination });
  } catch (error) {
    console.error("Create destination error:", error);
    return NextResponse.json({ error: "Failed to create destination" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...data } = body;
    if (!id) return NextResponse.json({ error: "Destination ID required" }, { status: 400 });

    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.region !== undefined) updateData.region = data.region;
    if (data.lat !== undefined) updateData.lat = parseFloat(data.lat);
    if (data.lng !== undefined) updateData.lng = parseFloat(data.lng);
    if (data.category !== undefined) updateData.category = data.category;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.ticketPrice !== undefined) updateData.ticketPrice = parseFloat(data.ticketPrice);
    if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl;
    if (data.rating !== undefined) updateData.rating = parseFloat(data.rating);
    if (data.reviewCount !== undefined) updateData.reviewCount = parseInt(data.reviewCount);
    if (data.googleMapsUrl !== undefined) updateData.googleMapsUrl = data.googleMapsUrl;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;

    const destination = await prisma.destination.update({
      where: { id },
      data: updateData,
    });
    return NextResponse.json({ success: true, destination });
  } catch (error) {
    console.error("Update destination error:", error);
    return NextResponse.json({ error: "Failed to update destination" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Destination ID required" }, { status: 400 });

    await prisma.destination.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete destination error:", error);
    return NextResponse.json({ error: "Failed to delete destination" }, { status: 500 });
  }
}

