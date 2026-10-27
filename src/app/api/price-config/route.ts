import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const configs = await prisma.priceConfig.findMany({
      orderBy: { key: "asc" },
    });
    return NextResponse.json({ configs });
  } catch (error) {
    console.error("Fetch price config error:", error);
    return NextResponse.json({ error: "Failed to fetch price config" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { key, value, description } = await req.json();

    const config = await prisma.priceConfig.upsert({
      where: { key },
      update: { value: String(value), description },
      create: { key, value: String(value), description },
    });

    return NextResponse.json({ config });
  } catch (error) {
    console.error("Update price config error:", error);
    return NextResponse.json({ error: "Failed to update price config" }, { status: 500 });
  }
}

