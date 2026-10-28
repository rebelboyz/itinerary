import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || (session.role !== "admin" && session.role !== "finance")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    const where: any = {};
    if (status && status !== "all") {
      where.status = status;
    }

    const commissions = await prisma.commission.findMany({
      where,
      include: {
        agent: {
          include: {
            user: { select: { id: true, name: true, email: true, phone: true } },
          },
        },
        booking: {
          select: {
            id: true,
            midtransOrderId: true,
            status: true,
            paidAt: true,
            totalAmount: true,
            currency: true,
            customerName: true,
            trip: {
              select: {
                id: true,
                title: true,
                startDate: true,
                endDate: true,
                numPax: true,
              },
            },
          },
        },
        payout: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, commissions });
  } catch (error) {
    console.error("Admin fetch commissions error:", error);
    return NextResponse.json({ error: "Failed to fetch commissions" }, { status: 500 });
  }
}

