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

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    const where: any = { agentId: agent.id };
    if (status && status !== "all") {
      where.status = status;
    }

    const leads = await prisma.lead.findMany({
      where,
      include: {
        activities: {
          take: 5,
          orderBy: { createdAt: "desc" },
        },
        trips: {
          select: {
            id: true,
            title: true,
            totalAmount: true,
            status: true,
            booking: {
              select: {
                id: true,
                status: true,
                midtransOrderId: true,
                paidAt: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, leads });
  } catch (error) {
    console.error("Agent fetch leads error:", error);
    return NextResponse.json({ error: "Failed to fetch agent leads" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
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

    // PRD §3: Only tier 'agent' can manually create leads (affiliates use link only)
    if (agent.tier !== "agent" && session.role !== "admin") {
      return NextResponse.json(
        { error: "Tingkat akun Anda adalah 'affiliate'. Fitur input lead manual hanya tersedia untuk mitra berstatus 'agent'." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { name, email, phone, country, message, tripPreferences, nextFollowUpAt } = body;

    if (!name || !email) {
      return NextResponse.json({ error: "Nama dan email wisatawan wajib diisi" }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const normalizedPhone = phone ? phone.replace(/[^0-9+]/g, "") : null;

    // Deduplication check: Is this email already locked by another agent? (AC3)
    const existingLocked = await prisma.lead.findFirst({
      where: {
        normalizedEmail,
        lockedUntil: { gt: new Date() },
      },
      include: { agent: true },
    });

    if (existingLocked) {
      if (existingLocked.agentId === agent.id) {
        return NextResponse.json(
          { message: "Lead dengan email ini sudah ada dalam pipeline Anda.", lead: existingLocked },
          { status: 200 }
        );
      }
      return NextResponse.json(
        { error: "Wisatawan dengan email ini sedang dalam periode kunci eksklusif mitra lain." },
        { status: 409 }
      );
    }

    // 60-day lock duration (D4)
    const lockedUntil = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000);

    const lead = await prisma.lead.create({
      data: {
        name,
        email: normalizedEmail,
        normalizedEmail,
        phone: phone || null,
        normalizedPhone,
        country: country || null,
        message: message || null,
        tripPreferences: tripPreferences || null,
        status: "new",
        source: "agent_manual",
        refCode: agent.refCode,
        agentId: agent.id,
        lockedUntil,
        lastAgentActivityAt: new Date(),
        nextFollowUpAt: nextFollowUpAt ? new Date(nextFollowUpAt) : null,
      },
    });

    // Create activity record
    await prisma.leadActivity.create({
      data: {
        leadId: lead.id,
        authorId: session.id,
        type: "status_change",
        body: `Lead dibuat secara manual oleh agen ${agent.companyName || agent.refCode} (sumber: chat/direct).`,
      },
    });

    return NextResponse.json({ success: true, lead });
  } catch (error) {
    console.error("Agent create lead error:", error);
    return NextResponse.json({ error: "Gagal membuat lead manual" }, { status: 500 });
  }
}

