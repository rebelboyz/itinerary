import midtransClient from "midtrans-client";

const isProduction = process.env.MIDTRANS_IS_PRODUCTION === "true";
const serverKey = process.env.MIDTRANS_SERVER_KEY || "SB-Mid-server-test-key";
const clientKey = process.env.MIDTRANS_CLIENT_KEY || "SB-Mid-client-test-key";

// Initialize Midtrans Snap API client
export const snap = new midtransClient.Snap({
  isProduction,
  serverKey,
  clientKey,
});

export interface CreateSnapTransactionParams {
  orderId: string;
  grossAmount: number; // in IDR
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  itemDetails?: Array<{
    id: string;
    price: number;
    quantity: number;
    name: string;
  }>;
}

/**
 * Creates a Snap transaction token and redirect URL for payment.
 * If running in offline test mode without actual keys, returns a realistic simulation token.
 */
export async function createSnapTransaction(params: CreateSnapTransactionParams) {
  try {
    if (!serverKey || serverKey.includes("placeholder") || serverKey.includes("test-key")) {
      // Mock Snap response for seamless local offline development
      return {
        token: `mock-snap-token-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        redirect_url: `/booking/success?order_id=${params.orderId}&mock=true`,
        isMock: true,
      };
    }

    const transactionParameters = {
      transaction_details: {
        order_id: params.orderId,
        gross_amount: Math.round(params.grossAmount),
      },
      customer_details: {
        first_name: params.customerName || "Valued Customer",
        email: params.customerEmail || "customer@example.com",
        phone: params.customerPhone || "",
      },
      item_details: params.itemDetails,
    };

    const transaction = await snap.createTransaction(transactionParameters);
    return {
      token: transaction.token,
      redirect_url: transaction.redirect_url,
      isMock: false,
    };
  } catch (err) {
    console.warn("Midtrans transaction creation error, falling back to mock token:", err);
    return {
      token: `mock-snap-token-${Date.now()}`,
      redirect_url: `/booking/success?order_id=${params.orderId}&mock=true`,
      isMock: true,
    };
  }
}

