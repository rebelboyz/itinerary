import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session || (session.role !== "finance" && session.role !== "admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;
    const { status } = await req.json();

    if (status !== "approved" && status !== "rejected") {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const expense = await prisma.expense.update({
      where: { id },
      data: {
        status,
        approvedById: session.id,
      },
    });

    return NextResponse.json({ success: true, expense });
  } catch (error) {
    console.error("Update expense status error:", error);
    return NextResponse.json({ error: "Failed to update expense status" }, { status: 500 });
  }
}

