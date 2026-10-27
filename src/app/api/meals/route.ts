import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const activeOnly = req.nextUrl.searchParams.get("active") !== "false";
    const meals = await prisma.mealOption.findMany({
      where: activeOnly ? { isActive: true } : {},
      orderBy: { pricePerPax: "asc" },
    });
    return NextResponse.json({ meals });
  } catch (error) {
    console.error("Fetch meals error:", error);
    return NextResponse.json({ error: "Failed to fetch meals" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const meal = await prisma.mealOption.create({
      data: {
        name: body.name,
        pricePerPax: parseFloat(body.pricePerPax || 0),
        description: body.description,
        isActive: body.isActive !== false,
      },
    });

    return NextResponse.json({ meal });
  } catch (error) {
    console.error("Create meal error:", error);
    return NextResponse.json({ error: "Failed to create meal" }, { status: 500 });
  }
}

