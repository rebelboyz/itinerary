import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || (session.role !== "finance" && session.role !== "admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const costLines = await prisma.bookingCostLine.findMany({
      include: {
        booking: {
          select: {
            id: true,
            midtransOrderId: true,
            status: true,
            paidAt: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Grouping by component
    const componentStats: Record<
      string,
      { component: string; totalListed: number; totalActual: number; marginSpread: number; marginPercent: number; count: number }
    > = {};

    costLines.forEach((line) => {
      const comp = line.component;
      if (!componentStats[comp]) {
        componentStats[comp] = {
          component: comp,
          totalListed: 0,
          totalActual: 0,
          marginSpread: 0,
          marginPercent: 0,
          count: 0,
        };
      }

      const listed = parseFloat(line.listedAmount.toString());
      const actual = parseFloat(line.actualCost.toString());

      componentStats[comp].totalListed += listed;
      componentStats[comp].totalActual += actual;
      componentStats[comp].marginSpread += listed - actual;
      componentStats[comp].count += 1;
    });

    Object.values(componentStats).forEach((stat) => {
      stat.marginPercent = stat.totalListed > 0 ? (stat.marginSpread / stat.totalListed) * 100 : 0;
    });

    const overallListed = Object.values(componentStats).reduce((sum, c) => sum + c.totalListed, 0);
    const overallActual = Object.values(componentStats).reduce((sum, c) => sum + c.totalActual, 0);
    const overallSpread = overallListed - overallActual;
    const overallPercent = overallListed > 0 ? (overallSpread / overallListed) * 100 : 0;

    return NextResponse.json({
      success: true,
      summary: {
        totalListed: overallListed,
        totalActual: overallActual,
        totalSpread: overallSpread,
        overallMarginPercent: overallPercent,
      },
      byComponent: Object.values(componentStats),
      costLines,
    });
  } catch (error) {
    console.error("Supplier margin fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch supplier margin report" }, { status: 500 });
  }
}

