import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || (session.role !== "agent" && session.role !== "admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const agent = await prisma.agent.findUnique({
      where: { userId: session.id },
    });

    if (!agent) {
      return NextResponse.json({ error: "Profil agen tidak ditemukan" }, { status: 404 });
    }

    const commissions = await prisma.commission.findMany({
      where: { agentId: agent.id },
      include: {
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
        payout: {
          select: {
            id: true,
            reference: true,
            paidAt: true,
            proofUrl: true,
            method: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, commissions });
  } catch (error) {
    console.error("Agent fetch commissions error:", error);
    return NextResponse.json({ error: "Failed to fetch commissions" }, { status: 500 });
  }
}

