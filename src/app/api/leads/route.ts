import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    let where: any = {};
    if (status && status !== "all") {
      where.status = status;
    }

    if (session.role === "agent") {
      const agent = await prisma.agent.findUnique({ where: { userId: session.id } });
      where.agentId = agent ? agent.id : "no-match";
    } else if (session.role !== "cs" && session.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const leads = await prisma.lead.findMany({
      where,
      include: {
        agent: true,
        assignedTo: { select: { id: true, name: true, email: true } },
        activities: {
          take: 3,
          orderBy: { createdAt: "desc" },
        },
        trips: {
          select: {
            id: true,
            title: true,
            totalAmount: true,
            status: true,
            booking: { select: { id: true, status: true, paidAt: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ leads });
  } catch (error) {
    console.error("Fetch leads error:", error);
    return NextResponse.json({ error: "Failed to fetch leads" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const cookieStore = await cookies();
    const { name, email, phone, country, message, tripPreferences } = body;

    if (!name || !email) {
      return NextResponse.json({ error: "Nama dan email wajib diisi" }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const normalizedPhone = phone ? phone.replace(/[^0-9+]/g, "") : null;

    // Check refCode from body or from 30-day tracking cookie
    const refCode = (body.refCode || cookieStore.get("refCode")?.value || "").toUpperCase().trim();
    let agentId: string | null = null;
    let source = "direct";

    if (refCode) {
      const agent = await prisma.agent.findUnique({
        where: { refCode },
      });
      if (agent && agent.status === "active") {
        agentId = agent.id;
        source = "agent_link";
      }
    }

    // Deduplication & Lead Locking Check (PRD §4.2, §5.1, AC3)
    const existingLockedLead = await prisma.lead.findFirst({
      where: {
        normalizedEmail,
        lockedUntil: { gt: new Date() },
      },
      include: { agent: true },
    });

    if (existingLockedLead) {
      // AC3: Lead with same email locked by an agent does NOT create double ownership.
      // Append activity to the existing lead.
      await prisma.leadActivity.create({
        data: {
          leadId: existingLockedLead.id,
          type: "contact",
          body: `Inquiry baru masuk dari kontak sama (${name}): "${message || "Tanpa pesan"}". Kepemilikan tetap pada agen saat ini.`,
          meta: { refCodeAttempted: refCode || null },
        },
      });

      return NextResponse.json({
        success: true,
        message: "Inquiry berhasil dicatat.",
        lead: existingLockedLead,
        isExisting: true,
      });
    }

    // Default lock duration: 60 days (D4)
    const lockedUntil = agentId
      ? new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
      : null;

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
        source,
        refCode: refCode || null,
        agentId,
        lockedUntil,
        lastAgentActivityAt: agentId ? new Date() : null,
      },
      include: { agent: true },
    });

    // Create initial activity log
    await prisma.leadActivity.create({
      data: {
        leadId: lead.id,
        type: "status_change",
        body: `Lead baru dibuat via ${source}${agentId ? ` (Ref: ${refCode})` : ""}.`,
      },
    });

    return NextResponse.json({ success: true, lead });
  } catch (error) {
    console.error("Create lead error:", error);
    return NextResponse.json({ error: "Failed to create lead" }, { status: 500 });
  }
}
