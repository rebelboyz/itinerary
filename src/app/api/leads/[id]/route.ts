import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const lead = await prisma.lead.findUnique({
      where: { id },
      include: {
        agent: true,
        assignedTo: { select: { id: true, name: true, email: true } },
        activities: { orderBy: { createdAt: "desc" } },
        trips: {
          include: {
            booking: true,
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    // Role check: Admin, CS, or the owner Agent
    if (session.role === "agent") {
      const agent = await prisma.agent.findUnique({ where: { userId: session.id } });
      if (!agent || lead.agentId !== agent.id) {
        return NextResponse.json({ error: "Forbidden: Lead belongs to another agent" }, { status: 403 });
      }
    } else if (session.role !== "admin" && session.role !== "cs") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ success: true, lead });
  } catch (error) {
    console.error("Fetch lead error:", error);
    return NextResponse.json({ error: "Failed to fetch lead" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    const existingLead = await prisma.lead.findUnique({ where: { id } });
    if (!existingLead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    const updateData: any = {};
    const activitiesToCreate: any[] = [];

    // Agent can update status (only allowed stages), notes, and next follow-up date
    if (session.role === "agent") {
      const agent = await prisma.agent.findUnique({ where: { userId: session.id } });
      if (!agent || existingLead.agentId !== agent.id) {
        return NextResponse.json({ error: "Forbidden: Not your lead" }, { status: 403 });
      }

      // AC8: Status booked/paid/completed cannot be changed manually by agent
      if (body.status) {
        const allowedAgentStatuses = ["new", "contacted", "negotiating", "lost"];
        if (!allowedAgentStatuses.includes(body.status)) {
          return NextResponse.json(
            { error: "Status booked, paid, dan completed hanya dapat diturunkan otomatis oleh sistem." },
            { status: 400 }
          );
        }
        if (body.status === "lost" && !body.lostReason) {
          return NextResponse.json({ error: "Alasan (lostReason) wajib diisi untuk status lost." }, { status: 400 });
        }

        updateData.status = body.status;
        if (body.lostReason) updateData.lostReason = body.lostReason;

        activitiesToCreate.push({
          leadId: id,
          authorId: session.id,
          type: "status_change",
          body: `Agen mengubah status lead menjadi '${body.status}'${body.lostReason ? ` (Alasan: ${body.lostReason})` : ""}`,
        });
      }

      if (body.nextFollowUpAt !== undefined) {
        updateData.nextFollowUpAt = body.nextFollowUpAt ? new Date(body.nextFollowUpAt) : null;
      }
      updateData.lastAgentActivityAt = new Date();
    } else if (session.role === "cs" || session.role === "admin") {
      // CS / Admin updates (e.g. reassigning owner requires reason and logs to AuditLog - AC9)
      if (body.status) {
        updateData.status = body.status;
      }
      if (body.assignedToId !== undefined) {
        updateData.assignedToId = body.assignedToId;
      }

      // Ownership override (agentId change)
      if (body.agentId !== undefined && body.agentId !== existingLead.agentId) {
        if (!body.reason) {
          return NextResponse.json(
            { error: "Override kepemilikan agen wajib menyertakan alasan (reason)." },
            { status: 400 }
          );
        }
        updateData.agentId = body.agentId || null;

        // Log to AuditLog (AC9)
        await prisma.auditLog.create({
          data: {
            actorId: session.id,
            action: "lead.override_owner",
            entity: "Lead",
            entityId: id,
            reason: body.reason,
            meta: {
              previousAgentId: existingLead.agentId,
              newAgentId: body.agentId,
            },
          },
        });

        activitiesToCreate.push({
          leadId: id,
          authorId: session.id,
          type: "reassign",
          body: `Kepemilikan agen diubah oleh ${session.role}. Alasan: ${body.reason}`,
        });
      }
    } else {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Add note activity if note was sent
    if (body.note) {
      activitiesToCreate.push({
        leadId: id,
        authorId: session.id,
        type: "note",
        body: body.note,
      });
      updateData.lastAgentActivityAt = new Date();
    }

    const lead = await prisma.lead.update({
      where: { id },
      data: updateData,
    });

    for (const act of activitiesToCreate) {
      await prisma.leadActivity.create({ data: act });
    }

    return NextResponse.json({ success: true, lead });
  } catch (error) {
    console.error("Update lead error:", error);
    return NextResponse.json({ error: "Failed to update lead" }, { status: 500 });
  }
}
