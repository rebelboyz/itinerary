import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || (session.role !== "agent" && session.role !== "admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const version = body.version || "v1.0";

    const agent = await prisma.agent.findUnique({
      where: { userId: session.id },
    });

    if (!agent) {
      return NextResponse.json({ error: "Profil agen tidak ditemukan" }, { status: 404 });
    }

    const updated = await prisma.agent.update({
      where: { id: agent.id },
      data: {
        agreementVersion: version,
        agreementAcceptedAt: new Date(),
      },
    });

    await prisma.auditLog.create({
      data: {
        actorId: session.id,
        action: "agent.agreement_accept",
        entity: "Agent",
        entityId: agent.id,
        reason: `Persetujuan Perjanjian Agen versi ${version}`,
        meta: { version, ip: req.headers.get("x-forwarded-for") || "local" },
      },
    });

    return NextResponse.json({ success: true, agent: updated });
  } catch (error) {
    console.error("Agent agreement accept error:", error);
    return NextResponse.json({ error: "Gagal menyimpan persetujuan perjanjian" }, { status: 500 });
  }
}

