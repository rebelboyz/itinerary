import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized: Admin only" }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();
    const { status, tier, commissionRuleId, refCode, reason } = body;

    const existingAgent = await prisma.agent.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!existingAgent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    const updateData: any = {};
    if (status) {
      updateData.status = status;
      if (status === "active" && existingAgent.status === "pending") {
        updateData.approvedById = session.id;
        updateData.approvedAt = new Date();
      }
    }

    if (tier) {
      updateData.tier = tier;
    }

    if (commissionRuleId !== undefined) {
      updateData.commissionRuleId = commissionRuleId || null;
    }

    if (refCode && refCode !== existingAgent.refCode) {
      // Check collision
      const checkCode = await prisma.agent.findUnique({
        where: { refCode: refCode.toUpperCase().trim() },
      });
      if (checkCode && checkCode.id !== id) {
        return NextResponse.json({ error: "Kode referral sudah dipakai agen lain" }, { status: 400 });
      }
      updateData.refCode = refCode.toUpperCase().trim();
    }

    const updatedAgent = await prisma.agent.update({
      where: { id },
      data: updateData,
    });

    // Write to AuditLog
    await prisma.auditLog.create({
      data: {
        actorId: session.id,
        action: "agent.update",
        entity: "Agent",
        entityId: id,
        reason: reason || `Updated agent status/tier/rule to: ${status || existingAgent.status} / ${tier || existingAgent.tier}`,
        meta: { previous: existingAgent, updated: updateData },
      },
    });

    return NextResponse.json({ success: true, agent: updatedAgent });
  } catch (error) {
    console.error("Update agent error:", error);
    return NextResponse.json({ error: "Failed to update agent" }, { status: 500 });
  }
}

