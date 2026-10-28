import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || (session.role !== "agent" && session.role !== "admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const agent = await prisma.agent.findFirst({
      where: session.role === "agent" ? { userId: session.id } : {},
      include: {
        user: { select: { id: true, name: true, email: true, phone: true } },
        commissionRule: true,
      },
    });

    if (!agent) {
      return NextResponse.json({ error: "Profil agen tidak ditemukan" }, { status: 404 });
    }

    // Aggregate stats
    const leadsCount = await prisma.lead.count({ where: { agentId: agent.id } });
    const activeLeadsCount = await prisma.lead.count({
      where: {
        agentId: agent.id,
        status: { in: ["new", "contacted", "quoted", "negotiating"] },
      },
    });

    const commissions = await prisma.commission.findMany({
      where: { agentId: agent.id },
    });

    let pendingCommission = 0;
    let approvedCommission = 0;
    let paidCommission = 0;

    commissions.forEach((c) => {
      const amt = parseFloat(c.amount.toString());
      if (c.status === "pending") pendingCommission += amt;
      else if (c.status === "approved" || c.status === "payable") approvedCommission += amt;
      else if (c.status === "paid") paidCommission += amt;
    });

    const origin = req.nextUrl.origin || "https://itinerary.id";
    const referralLink = `${origin}/?ref=${agent.refCode}`;

    return NextResponse.json({
      success: true,
      agent: {
        id: agent.id,
        name: agent.user.name,
        email: agent.user.email,
        phone: agent.user.phone,
        companyName: agent.companyName,
        country: agent.country,
        refCode: agent.refCode,
        referralLink,
        tier: agent.tier,
        status: agent.status,
        payoutMethod: agent.payoutMethod,
        agreementVersion: agent.agreementVersion,
        agreementAcceptedAt: agent.agreementAcceptedAt,
        commissionRule: agent.commissionRule,
      },
      stats: {
        totalLeads: leadsCount,
        activeLeads: activeLeadsCount,
        pendingCommission,
        approvedCommission,
        paidCommission,
      },
    });
  } catch (error) {
    console.error("Agent profile fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch agent profile" }, { status: 500 });
  }
}

