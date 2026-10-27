import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const destinationId = searchParams.get("destinationId");
    const activeOnly = searchParams.get("active") !== "false";

    const where: any = {};
    if (activeOnly) where.isActive = true;
    if (destinationId) where.destinationId = destinationId;

    const activities = await prisma.activity.findMany({
      where,
      include: { destination: true },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ activities });
  } catch (error) {
    console.error("Fetch activities error:", error);
    return NextResponse.json({ error: "Failed to fetch activities" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const activity = await prisma.activity.create({
      data: {
        name: body.name,
        destinationId: body.destinationId || null,
        ticketPrice: parseFloat(body.ticketPrice || 0),
        description: body.description,
        isActive: body.isActive !== false,
      },
    });

    return NextResponse.json({ activity });
  } catch (error) {
    console.error("Create activity error:", error);
    return NextResponse.json({ error: "Failed to create activity" }, { status: 500 });
  }
}

