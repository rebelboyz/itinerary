import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const bookingId = searchParams.get("bookingId");

    const where: any = {};
    if (bookingId) where.bookingId = bookingId;

    if (session.role === "guide") {
      where.submittedById = session.id;
    }

    const expenses = await prisma.expense.findMany({
      where,
      include: {
        booking: { include: { trip: true } },
        submittedBy: true,
        approvedBy: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ expenses });
  } catch (error) {
    console.error("Fetch expenses error:", error);
    return NextResponse.json({ error: "Failed to fetch expenses" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || (session.role !== "guide" && session.role !== "admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const { bookingId, category, amount, note, receiptUrl } = body;

    if (!bookingId || !category || !amount) {
      return NextResponse.json({ error: "Data pengeluaran tidak lengkap" }, { status: 400 });
    }

    const expense = await prisma.expense.create({
      data: {
        bookingId,
        submittedById: session.id,
        category,
        amount: parseFloat(amount),
        note: note || null,
        receiptUrl: receiptUrl || null,
        status: "submitted",
      },
    });

    return NextResponse.json({ success: true, expense });
  } catch (error) {
    console.error("Create expense error:", error);
    return NextResponse.json({ error: "Failed to create expense" }, { status: 500 });
  }
}

