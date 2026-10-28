import { prisma } from "./db";
import { calculateRouteDistanceKm, GeoPoint } from "./distance";

export interface PricingInput {
  numPax: number;
  tripDaysCount: number;
  vehicleRatePerKm: number;
  points: GeoPoint[];
  hotelPricePerNight?: number;
  hotelPaxPerRoom?: number;
  ticketPricesPerPax?: number[];
  mealPricesPerPax?: number[];
  guideRatePerDay?: number;
  includeGuide?: boolean;
  marginTargetRate?: number;
  commissionReserveRate?: number;
  gatewayRate?: number;
  customMarginTier?: number;
}

export interface PricingResult {
  distanceKm: number;
  transportCost: number;
  hotelCost: number;
  ticketsCost: number;
  mealsCost: number;
  guideCost: number;
  subtotal: number;
  // PRD §5: Platform Fee Components
  marginTargetRate: number;
  marginTargetAmount: number;
  commissionReserveRate: number;
  commissionReserveAmount: number;
  gatewayFeeRate: number;
  gatewayFeeAmount: number;
  platformFeeAmount: number;
  // Backward compatibility
  marginPercent: number;
  marginAmount: number;
  totalAmount: number;
  pricePerPax: number;
}

export const DEFAULT_GATEWAY_FEE_RATE = 0.025; // 2.5% Midtrans

/**
 * Default Margin Target Rate per pax tier (PRD §5 & §13.2 default = 2%)
 */
export function defaultMarginTargetRate(pax: number): number {
  if (pax <= 2) return 0.02;
  if (pax <= 5) return 0.02;
  return 0.02;
}

/**
 * @deprecated Legacy alias for margin target rate (PRD §5.6)
 */
export function marginTier(pax: number): number {
  return defaultMarginTargetRate(pax);
}

/**
 * Default Commission Reserve Rate per pax tier (PRD §5 & §13.2 default = 3%)
 */
export function defaultCommissionReserveRate(pax: number): number {
  if (pax <= 2) return 0.03;
  if (pax <= 5) return 0.03;
  return 0.03;
}

/**
 * Calculate room count needed based on pax and room capacity (default 2 pax/room).
 */
export function calcRooms(pax: number, paxPerRoom = 2): number {
  return Math.max(1, Math.ceil(pax / (paxPerRoom || 2)));
}

/**
 * PRD §5.2: Pure pricing calculation function.
 * Formula:
 * Subtotal       = Transport + Hotel + Tiket + Makan + Guide
 * MarginTarget   = Subtotal * marginTargetRate(pax)
 * CadanganKomisi = Subtotal * commissionReserveRate(pax)
 * Total          = (Subtotal + MarginTarget + CadanganKomisi) / (1 - gatewayRate)
 * BiayaGateway   = Total * gatewayRate
 * BiayaPlatform  = MarginTarget + CadanganKomisi + BiayaGateway (= Total - Subtotal)
 */
export function calculatePricingPure(
  distanceKm: number,
  params: {
    numPax: number;
    tripDaysCount: number;
    vehicleRatePerKm: number;
    hotelPricePerNight?: number;
    hotelPaxPerRoom?: number;
    ticketsTotalPerPerson?: number;
    mealsTotalPerPerson?: number;
    guideRatePerDay?: number;
    includeGuide?: boolean;
    marginTargetRate?: number;
    commissionReserveRate?: number;
    gatewayRate?: number;
    customMargin?: number;
  }
): PricingResult {
  const {
    numPax,
    tripDaysCount,
    vehicleRatePerKm,
    hotelPricePerNight = 0,
    hotelPaxPerRoom = 2,
    ticketsTotalPerPerson = 0,
    mealsTotalPerPerson = 0,
    guideRatePerDay = 500000,
    includeGuide = true,
  } = params;

  const pax = Math.max(1, numPax);
  const days = Math.max(1, tripDaysCount);
  const nights = Math.max(0, days - 1);

  // 1. Transport (per group/vehicle)
  const transportCost = Math.round(distanceKm * vehicleRatePerKm);

  // 2. Hotel (per room per night)
  const rooms = calcRooms(pax, hotelPaxPerRoom);
  const hotelCost = Math.round(hotelPricePerNight * nights * rooms);

  // 3. Tickets (per person * pax)
  const ticketsCost = Math.round(ticketsTotalPerPerson * pax);

  // 4. Meals (per person * pax)
  const mealsCost = Math.round(mealsTotalPerPerson * pax);

  // 5. Guide (per day per group, Rp 0 if customer opts out)
  const guideCost = includeGuide ? Math.round(guideRatePerDay * days) : 0;

  // 6. Subtotal
  const subtotal = transportCost + hotelCost + ticketsCost + mealsCost + guideCost;

  // 7. Platform Fee Components
  const mRate = params.marginTargetRate !== undefined
    ? params.marginTargetRate
    : defaultMarginTargetRate(pax);
  const cRate = params.commissionReserveRate !== undefined
    ? params.commissionReserveRate
    : defaultCommissionReserveRate(pax);
  const gRate = params.gatewayRate !== undefined
    ? params.gatewayRate
    : DEFAULT_GATEWAY_FEE_RATE;

  const marginTargetAmount = Math.round(subtotal * mRate);
  const commissionReserveAmount = Math.round(subtotal * cRate);

  // Gross-up calculation for total amount
  const totalAmount = Math.round((subtotal + marginTargetAmount + commissionReserveAmount) / (1 - gRate));
  const gatewayFeeAmount = Math.round(totalAmount * gRate);
  const platformFeeAmount = totalAmount - subtotal;
  const pricePerPax = Math.round(totalAmount / pax);

  return {
    distanceKm,
    transportCost,
    hotelCost,
    ticketsCost,
    mealsCost,
    guideCost,
    subtotal,
    marginTargetRate: mRate,
    marginTargetAmount,
    commissionReserveRate: cRate,
    commissionReserveAmount,
    gatewayFeeRate: gRate,
    gatewayFeeAmount,
    platformFeeAmount,
    // Backward compatibility
    marginPercent: subtotal > 0 ? platformFeeAmount / subtotal : 0,
    marginAmount: platformFeeAmount,
    totalAmount,
    pricePerPax,
  };
}

/**
 * Helper to fetch dynamic rates from PriceConfig table with graceful fallback
 */
export async function getPriceConfigRates(pax: number) {
  let marginTargetRate = defaultMarginTargetRate(pax);
  let commissionReserveRate = defaultCommissionReserveRate(pax);
  let gatewayRate = DEFAULT_GATEWAY_FEE_RATE;
  let guideRatePerDay = 500000;

  try {
    const configs = await prisma.priceConfig.findMany();
    const configMap = new Map(configs.map((c) => [c.key, c.value]));

    const paxKey = pax <= 2 ? "1_2" : pax <= 5 ? "3_5" : "6_12";

    const mVal = configMap.get(`margin_target_${paxKey}`);
    if (mVal) marginTargetRate = parseFloat(mVal);

    const cVal = configMap.get(`commission_reserve_${paxKey}`);
    if (cVal) commissionReserveRate = parseFloat(cVal);

    const gVal = configMap.get("gateway_fee_rate");
    if (gVal) gatewayRate = parseFloat(gVal);

    const guideVal = configMap.get("guide_rate_per_day");
    if (guideVal) guideRatePerDay = parseFloat(guideVal);
  } catch {
    // Keep defaults if db lookup fails
  }

  return { marginTargetRate, commissionReserveRate, gatewayRate, guideRatePerDay };
}

/**
 * Calculates complete trip pricing dynamically from input coordinates & configs.
 */
export async function calculateTrip(input: PricingInput): Promise<PricingResult> {
  const distanceKm = await calculateRouteDistanceKm(input.points);

  const ticketsTotalPerPerson = (input.ticketPricesPerPax || []).reduce((sum, p) => sum + p, 0);
  const mealsTotalPerPerson = (input.mealPricesPerPax || []).reduce((sum, p) => sum + p, 0);

  const rates = await getPriceConfigRates(input.numPax);

  return calculatePricingPure(distanceKm, {
    numPax: input.numPax,
    tripDaysCount: input.tripDaysCount,
    vehicleRatePerKm: input.vehicleRatePerKm,
    hotelPricePerNight: input.hotelPricePerNight,
    hotelPaxPerRoom: input.hotelPaxPerRoom,
    ticketsTotalPerPerson,
    mealsTotalPerPerson,
    guideRatePerDay: input.guideRatePerDay || rates.guideRatePerDay,
    includeGuide: input.includeGuide !== false,
    marginTargetRate: input.marginTargetRate !== undefined ? input.marginTargetRate : rates.marginTargetRate,
    commissionReserveRate: input.commissionReserveRate !== undefined ? input.commissionReserveRate : rates.commissionReserveRate,
    gatewayRate: input.gatewayRate !== undefined ? input.gatewayRate : rates.gatewayRate,
  });
}
