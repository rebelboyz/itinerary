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
    return NextResponse.json(
      { error: "Failed to fetch price config" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized: Admin only" }, { status: 403 });
    }

    const { key, value, description, reason } = await req.json();

    const previousConfig = await prisma.priceConfig.findUnique({ where: { key } });

    const config = await prisma.priceConfig.upsert({
      where: { key },
      update: { value: String(value), description },
      create: { key, value: String(value), description },
    });

    // Write to AuditLog (AC15)
    await prisma.auditLog.create({
      data: {
        actorId: session.id,
        action: "price_config.update",
        entity: "PriceConfig",
        entityId: config.id,
        reason: reason || `Updated price config ${key} to ${value}`,
        meta: {
          key,
          previousValue: previousConfig?.value,
          newValue: String(value),
        },
      },
    });

    return NextResponse.json({ success: true, config });
  } catch (error) {
    console.error("Update price config error:", error);
    return NextResponse.json({ error: "Failed to update price config" }, { status: 500 });
  }
}
