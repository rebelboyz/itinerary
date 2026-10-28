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
      include: {
        trip: true,
        commission: true,
      },
    });

    if (!booking) {
      console.warn("Booking not found for order_id:", order_id);
      return NextResponse.json({ message: "Booking not found, notification noted" });
    }

    // Idempotency: Check if this exact transaction and status was already processed
    if (transaction_id) {
      const existingPayment = await prisma.payment.findFirst({
        where: {
          bookingId: booking.id,
          midtransTransactionId: transaction_id,
          status: transaction_status,
        },
      });
      if (existingPayment) {
        return NextResponse.json({ success: true, message: "Duplicate notification ignored" });
      }
    }

    // Determine target booking status
    let newBookingStatus = "pending";
    if (transaction_status === "capture") {
      newBookingStatus = fraud_status === "accept" ? "confirmed" : "pending";
    } else if (transaction_status === "settlement") {
      newBookingStatus = "confirmed";
    } else if (
      transaction_status === "cancel" ||
      transaction_status === "deny" ||
      transaction_status === "expire"
    ) {
      newBookingStatus = "cancelled";
    } else if (transaction_status === "refund") {
      newBookingStatus = "refunded";
    }

    // State machine guard: Do not regress from confirmed/in_progress/completed back to pending
    const statusPriority: Record<string, number> = {
      pending: 1,
      cancelled: 2,
      refunded: 2,
      confirmed: 3,
      in_progress: 4,
      completed: 5,
    };

    const currentPriority = statusPriority[booking.status] || 0;
    const targetPriority = statusPriority[newBookingStatus] || 0;

    const finalStatus =
      newBookingStatus === "cancelled" || newBookingStatus === "refunded"
        ? newBookingStatus
        : targetPriority >= currentPriority
        ? newBookingStatus
        : booking.status;

    // Record Payment
    await prisma.payment.create({
      data: {
        bookingId: booking.id,
        amount: parseFloat(gross_amount),
        currency: "IDR",
        status: transaction_status,
        midtransTransactionId: transaction_id || null,
        paymentType: payment_type || null,
        paidAt: finalStatus === "confirmed" ? new Date() : null,
        rawPayload: payload,
      },
    });

    // Update Booking status
    await prisma.booking.update({
      where: { id: booking.id },
      data: {
        status: finalStatus,
        paymentType: payment_type || booking.paymentType,
        paidAt: finalStatus === "confirmed" ? new Date() : booking.paidAt,
      },
    });

    // Update Trip status
    await prisma.trip.update({
      where: { id: booking.tripId },
      data: {
        status: finalStatus === "confirmed" ? "confirmed" : booking.trip.status,
      },
    });

    // Commission & Lead Handling
    const agentId = booking.agentId || booking.trip.agentId;

    if (finalStatus === "confirmed") {
      // 1. Advance lead to "paid" if linked
      if (booking.trip.leadId) {
        await prisma.lead.update({
          where: { id: booking.trip.leadId },
          data: { status: "paid" },
        });

        await prisma.leadActivity.create({
          data: {
            leadId: booking.trip.leadId,
            type: "status_change",
            body: `Pembayaran lunas via Midtrans (${gross_amount} IDR). Status lead menjadi 'paid'.`,
            meta: { bookingId: booking.id, order_id, transaction_id },
          },
        });
      }

      // 2. Automatically generate Commission record (AC5, AC6)
      if (agentId && !booking.commission) {
        const agent = await prisma.agent.findUnique({
          where: { id: agentId },
          include: { commissionRule: true },
        });

        if (agent) {
          const basisAmount = parseFloat(booking.trip.commissionReserveAmount.toString()) || 0;
          let payoutShare = 1.0;

          if (agent.commissionRule) {
            payoutShare = parseFloat(agent.commissionRule.payoutShare.toString());
          } else {
            // Default: 100% for agent, 50% for affiliate
            payoutShare = agent.tier === "affiliate" ? 0.5 : 1.0;
          }

          const commissionAmount = Math.round(basisAmount * payoutShare);

          await prisma.commission.create({
            data: {
              bookingId: booking.id,
              agentId: agent.id,
              leadId: booking.trip.leadId,
              basisAmount,
              rateApplied: payoutShare,
              amount: commissionAmount,
              currency: "IDR",
              status: "pending",
              ruleSnapshot: {
                ruleId: agent.commissionRuleId || "default",
                tier: agent.tier,
                rateApplied: payoutShare,
                basisAmount,
              },
            },
          });
        }
      }
    } else if (finalStatus === "cancelled" || finalStatus === "refunded") {
      // Void or clawback commission if booking is cancelled/refunded
      if (booking.commission) {
        if (booking.commission.status === "paid") {
          await prisma.commission.update({
            where: { id: booking.commission.id },
            data: {
              status: "clawback",
              voidReason: `Pembayaran ${finalStatus} oleh Midtrans`,
            },
          });
        } else if (booking.commission.status === "pending" || booking.commission.status === "approved") {
          await prisma.commission.update({
            where: { id: booking.commission.id },
            data: {
              status: "void",
              voidReason: `Pembayaran ${finalStatus} oleh Midtrans`,
            },
          });
        }
      }
    }

    return NextResponse.json({ success: true, message: "Notification handled" });
  } catch (error) {
    console.error("Midtrans webhook error:", error);
    return NextResponse.json({ error: "Failed to process webhook" }, { status: 500 });
  }
}
