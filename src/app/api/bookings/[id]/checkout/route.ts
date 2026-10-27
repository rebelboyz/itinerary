import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createSnapTransaction } from "@/lib/midtrans";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: { trip: { include: { vehicleType: true } } },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const orderId = booking.midtransOrderId || `ITN-${booking.id.substring(0, 8)}-${Date.now()}`;
    const amount = parseFloat(booking.totalAmount.toString());

    const snapResult = await createSnapTransaction({
      orderId,
      grossAmount: amount,
      customerName: booking.customerName || undefined,
      customerEmail: booking.customerEmail || undefined,
      customerPhone: booking.customerPhone || undefined,
      itemDetails: [
        {
          id: booking.tripId,
          price: amount,
          quantity: 1,
          name: `${booking.trip.title} (${booking.trip.numPax} Pax)`,
        },
      ],
    });

    return NextResponse.json({
      success: true,
      token: snapResult.token,
      redirect_url: snapResult.redirect_url,
      isMock: snapResult.isMock,
      orderId,
    });
  } catch (error) {
    console.error("Booking checkout error:", error);
    return NextResponse.json({ error: "Failed to create checkout transaction" }, { status: 500 });
  }
}

