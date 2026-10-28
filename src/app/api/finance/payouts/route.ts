import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || (session.role !== "finance" && session.role !== "admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const payouts = await prisma.payout.findMany({
      include: {
        agent: {
          include: {
            user: { select: { id: true, name: true, email: true } },
          },
        },
        commissions: {
          include: {
            booking: { select: { id: true, midtransOrderId: true, totalAmount: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Also get all approved commissions ready to be batched
    const approvedCommissions = await prisma.commission.findMany({
      where: { status: "approved" },
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
            totalAmount: true,
            status: true,
            customerName: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, payouts, approvedCommissions });
  } catch (error) {
    console.error("Finance fetch payouts error:", error);
    return NextResponse.json({ error: "Failed to fetch payouts" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || (session.role !== "finance" && session.role !== "admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const {
      agentId,
      commissionIds = [],
      method = "bank_transfer",
      reference,
      proofUrl,
      fxRate,
      note,
    } = body;

    if (!agentId || commissionIds.length === 0) {
      return NextResponse.json(
        { error: "agentId dan daftar komisi (commissionIds) wajib diisi" },
        { status: 400 }
      );
    }

    // Verify all commissions belong to this agent and are approved
    const commissions = await prisma.commission.findMany({
      where: {
        id: { in: commissionIds },
        agentId,
        status: "approved",
      },
    });

    if (commissions.length !== commissionIds.length) {
      return NextResponse.json(
        { error: "Sebagian komisi tidak ditemukan, bukan milik agen, atau belum berstatus approved" },
        { status: 400 }
      );
    }

    const totalAmount = commissions.reduce((sum, c) => sum + parseFloat(c.amount.toString()), 0);

    // Create payout batch and mark as paid
    const payout = await prisma.payout.create({
      data: {
        agentId,
        totalAmount,
        currency: "IDR",
        fxRate: fxRate ? parseFloat(fxRate) : null,
        method,
        reference: reference || `PAYOUT-${Date.now()}`,
        proofUrl: proofUrl || null,
        status: "paid",
        paidAt: new Date(),
        createdById: session.id,
      },
    });

    // Update commissions to paid and link to payout
    await prisma.commission.updateMany({
      where: { id: { in: commissionIds } },
      data: {
        status: "paid",
        payoutId: payout.id,
        paidAt: new Date(),
      },
    });

    // Write to AuditLog
    await prisma.auditLog.create({
      data: {
        actorId: session.id,
        action: "payout.create",
        entity: "Payout",
        entityId: payout.id,
        reason: note || `Batch payout komisi agen sebesar Rp ${totalAmount.toLocaleString()}`,
        meta: { agentId, totalAmount, commissionCount: commissionIds.length, method, reference },
      },
    });

    return NextResponse.json({ success: true, payout });
  } catch (error) {
    console.error("Create payout error:", error);
    return NextResponse.json({ error: "Gagal membuat batch payout" }, { status: 500 });
  }
}

