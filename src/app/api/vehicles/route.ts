import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const pax = searchParams.get("pax");
    const activeOnly = searchParams.get("active") !== "false";

    const where: any = {};
    if (activeOnly) where.isActive = true;

    let vehicles = await prisma.vehicleType.findMany({
      where,
      orderBy: { capacityMin: "asc" },
    });

    if (pax) {
      const paxNum = parseInt(pax);
      // Sort so recommended vehicle comes first
      vehicles = vehicles.sort((a, b) => {
        const aFit = paxNum >= a.capacityMin && paxNum <= a.capacityMax;
        const bFit = paxNum >= b.capacityMin && paxNum <= b.capacityMax;
        if (aFit && !bFit) return -1;
        if (!aFit && bFit) return 1;
        return a.capacityMin - b.capacityMin;
      });
    }

    return NextResponse.json({ vehicles });
  } catch (error) {
    console.error("Fetch vehicles error:", error);
    return NextResponse.json({ error: "Failed to fetch vehicles" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (session && session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const vehicle = await prisma.vehicleType.create({
      data: {
        name: body.name,
        capacityMin: parseInt(body.capacityMin || 1),
        capacityMax: parseInt(body.capacityMax || 5),
        ratePerKm: parseFloat(body.ratePerKm || 5000),
        description: body.description,
        imageUrl: body.imageUrl || "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80",
        rating: body.rating ? parseFloat(body.rating) : 4.9,
        reviewCount: body.reviewCount ? parseInt(body.reviewCount) : 50,
        googleMapsUrl: body.googleMapsUrl || "https://maps.google.com/?q=Surabaya+Juanda+Airport",
        isActive: body.isActive !== false,
      },
    });

    return NextResponse.json({ success: true, vehicle });
  } catch (error) {
    console.error("Create vehicle error:", error);
    return NextResponse.json({ error: "Failed to create vehicle" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...data } = body;
    if (!id) return NextResponse.json({ error: "Vehicle ID required" }, { status: 400 });

    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.capacityMin !== undefined) updateData.capacityMin = parseInt(data.capacityMin);
    if (data.capacityMax !== undefined) updateData.capacityMax = parseInt(data.capacityMax);
    if (data.ratePerKm !== undefined) updateData.ratePerKm = parseFloat(data.ratePerKm);
    if (data.description !== undefined) updateData.description = data.description;
    if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl;
    if (data.rating !== undefined) updateData.rating = parseFloat(data.rating);
    if (data.reviewCount !== undefined) updateData.reviewCount = parseInt(data.reviewCount);
    if (data.googleMapsUrl !== undefined) updateData.googleMapsUrl = data.googleMapsUrl;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;

    const vehicle = await prisma.vehicleType.update({
      where: { id },
      data: updateData,
    });
    return NextResponse.json({ success: true, vehicle });
  } catch (error) {
    console.error("Update vehicle error:", error);
    return NextResponse.json({ error: "Failed to update vehicle" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Vehicle ID required" }, { status: 400 });

    await prisma.vehicleType.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete vehicle error:", error);
    return NextResponse.json({ error: "Failed to delete vehicle" }, { status: 500 });
  }
}

