import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || (session.role !== "finance" && session.role !== "admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id: bookingId } = await params;
    const costLines = await prisma.bookingCostLine.findMany({
      where: { bookingId },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({ success: true, costLines });
  } catch (error) {
    console.error("Fetch cost lines error:", error);
    return NextResponse.json({ error: "Failed to fetch cost lines" }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || (session.role !== "finance" && session.role !== "admin")) {
      return NextResponse.json({ error: "Unauthorized: Finance only" }, { status: 403 });
    }

    const { id: bookingId } = await params;
    const body = await req.json();
    const { component, listedAmount, actualCost, supplierName, note } = body;

    if (!component || listedAmount === undefined || actualCost === undefined) {
      return NextResponse.json(
        { error: "Komponen, harga tercatat (listedAmount), dan biaya aktual (actualCost) wajib diisi" },
        { status: 400 }
      );
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking tidak ditemukan" }, { status: 404 });
    }

    const costLine = await prisma.bookingCostLine.create({
      data: {
        bookingId,
        component,
        listedAmount: parseFloat(listedAmount),
        actualCost: parseFloat(actualCost),
        supplierName: supplierName || null,
        note: note || null,
        enteredById: session.id,
      },
    });

    return NextResponse.json({ success: true, costLine });
  } catch (error) {
    console.error("Create cost line error:", error);
    return NextResponse.json({ error: "Gagal menyimpan rincian biaya aktual" }, { status: 500 });
  }
}

