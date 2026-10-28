import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      email,
      password,
      phone,
      country,
      companyName,
      channels,
      payoutMethod,
    } = body;

    if (!name || !email || !country) {
      return NextResponse.json({ error: "Nama, email, dan negara wajib diisi" }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists
    let user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (user && user.role !== "customer" && user.role !== "agent") {
      return NextResponse.json(
        { error: "Email sudah terdaftar sebagai staf internal" },
        { status: 400 }
      );
    }

    if (!user) {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password || "Agent@12345", salt);

      user = await prisma.user.create({
        data: {
          name,
          email: normalizedEmail,
          passwordHash,
          role: "agent",
          phone: phone || null,
          country,
        },
      });
    }

    // Check if agent record already exists
    const existingAgent = await prisma.agent.findUnique({ where: { userId: user.id } });
    if (existingAgent) {
      return NextResponse.json(
        { error: "Pendaftaran kemitraan dengan email ini sudah pernah diajukan", status: existingAgent.status },
        { status: 400 }
      );
    }

    // Generate unique refCode
    const baseCode = (companyName || name).replace(/[^a-zA-Z0-9]/g, "").toUpperCase().slice(0, 8);
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const refCode = `${baseCode || "AGENT"}-${randomSuffix}`;

    // Get default commission rule
    const defaultRule = await prisma.commissionRule.findFirst({
      where: { isDefault: true },
    });

    const agent = await prisma.agent.create({
      data: {
        userId: user.id,
        refCode,
        tier: "affiliate", // Defaults to affiliate unless admin elevates to agent
        status: "pending",
        country,
        companyName: companyName || null,
        channels: channels || null,
        payoutMethod: payoutMethod || "bank_transfer",
        commissionRuleId: defaultRule?.id || null,
      },
    });

    // Log to AuditLog
    await prisma.auditLog.create({
      data: {
        actorId: user.id,
        action: "agent.apply",
        entity: "Agent",
        entityId: agent.id,
        reason: "Pendaftaran mitra baru melalui /become-agent",
        meta: { companyName, country, refCode },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Aplikasi kemitraan agen Anda telah kami terima dan sedang ditinjau tim Admin.",
      agent: {
        id: agent.id,
        refCode: agent.refCode,
        status: agent.status,
      },
    });
  } catch (error) {
    console.error("Agent apply error:", error);
    return NextResponse.json({ error: "Gagal memproses pendaftaran agen" }, { status: 500 });
  }
}

