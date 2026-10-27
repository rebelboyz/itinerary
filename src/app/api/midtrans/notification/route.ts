import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();

    const {
      order_id,
      status_code,
      gross_amount,
      signature_key,
      transaction_status,
      fraud_status,
      payment_type,
      transaction_id,
    } = payload;

    const serverKey = process.env.MIDTRANS_SERVER_KEY || "";

    // In production or when serverKey is provided, verify SHA512 signature
    if (serverKey && !serverKey.includes("test-key") && !serverKey.includes("placeholder")) {
      const hash = crypto
        .createHash("sha512")
        .update(`${order_id}${status_code}${gross_amount}${serverKey}`)
        .digest("hex");

      if (hash !== signature_key) {
        console.warn("Invalid Midtrans signature:", { order_id, signature_key });
        return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
      }
    }

    const booking = await prisma.booking.findFirst({
      where: { midtransOrderId: order_id },
    });

    if (!booking) {
      console.warn("Booking not found for order_id:", order_id);
      return NextResponse.json({ message: "Booking not found, notification noted" });
    }

    // Determine booking status
    let bookingStatus = "pending";
    if (transaction_status === "capture") {
      bookingStatus = fraud_status === "accept" ? "confirmed" : "pending";
    } else if (transaction_status === "settlement") {
      bookingStatus = "confirmed";
    } else if (
      transaction_status === "cancel" ||
      transaction_status === "deny" ||
      transaction_status === "expire"
    ) {
      bookingStatus = "cancelled";
    } else if (transaction_status === "refund") {
      bookingStatus = "refunded";
    }

    // Record Payment
    await prisma.payment.create({
      data: {
        bookingId: booking.id,
        amount: parseFloat(gross_amount),
        currency: "IDR",
        status: transaction_status,
        midtransTransactionId: transaction_id || null,
        paymentType: payment_type || null,
        paidAt: bookingStatus === "confirmed" ? new Date() : null,
        rawPayload: payload,
      },
    });

    // Update Booking status
    await prisma.booking.update({
      where: { id: booking.id },
      data: {
        status: bookingStatus,
        paymentType: payment_type || booking.paymentType,
        paidAt: bookingStatus === "confirmed" ? new Date() : booking.paidAt,
      },
    });

    // Update Trip status
    await prisma.trip.update({
      where: { id: booking.tripId },
      data: {
        status: bookingStatus === "confirmed" ? "confirmed" : "booked",
      },
    });

    return NextResponse.json({ success: true, message: "Notification handled" });
  } catch (error) {
    console.error("Midtrans webhook error:", error);
    return NextResponse.json({ error: "Failed to process webhook" }, { status: 500 });
  }
}

