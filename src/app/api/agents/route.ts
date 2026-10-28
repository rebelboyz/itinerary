import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || (session.role !== "admin" && session.role !== "cs")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    const where: any = {};
    if (status && status !== "all") {
      where.status = status;
    }

    const agents = await prisma.agent.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true, phone: true } },
        commissionRule: true,
        _count: {
          select: {
            leads: true,
            commissions: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const commissionRules = await prisma.commissionRule.findMany();

    return NextResponse.json({ success: true, agents, commissionRules });
  } catch (error) {
    console.error("Admin fetch agents error:", error);
    return NextResponse.json({ error: "Failed to fetch agents" }, { status: 500 });
  }
}

