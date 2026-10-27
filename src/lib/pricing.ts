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
  marginPercent: number;
  marginAmount: number;
  totalAmount: number;
  pricePerPax: number;
}

/**
 * PRD §19: Automated margin tier per pax count:
 * 1–2 pax = 12% (0.12)
 * 3–5 pax = 8%  (0.08)
 * 6–12 pax = 5% (0.05)
 */
export function marginTier(pax: number): number {
  if (pax <= 2) return 0.12;
  if (pax <= 5) return 0.08;
  return 0.05;
}

/**
 * PRD §19: Calculate room count needed based on pax and room capacity (default 2 pax/room).
 */
export function calcRooms(pax: number, paxPerRoom = 2): number {
  return Math.max(1, Math.ceil(pax / (paxPerRoom || 2)));
}

/**
 * PRD §19: Pure pricing calculation function.
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
    customMargin,
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

  // 7. Margin
  const marginPercent = customMargin !== undefined ? customMargin : marginTier(pax);
  const marginAmount = Math.round(subtotal * marginPercent);

  // 8. Total & Price Per Pax
  const totalAmount = subtotal + marginAmount;
  const pricePerPax = Math.round(totalAmount / pax);

  return {
    distanceKm,
    transportCost,
    hotelCost,
    ticketsCost,
    mealsCost,
    guideCost,
    subtotal,
    marginPercent,
    marginAmount,
    totalAmount,
    pricePerPax,
  };
}

/**
 * Calculates complete trip pricing dynamically from input coordinates & configs.
 */
export async function calculateTrip(input: PricingInput): Promise<PricingResult> {
  const distanceKm = await calculateRouteDistanceKm(input.points);

  const ticketsTotalPerPerson = (input.ticketPricesPerPax || []).reduce((sum, p) => sum + p, 0);
  const mealsTotalPerPerson = (input.mealPricesPerPax || []).reduce((sum, p) => sum + p, 0);

  let guideRatePerDay = input.guideRatePerDay;
  if (!guideRatePerDay) {
    try {
      const config = await prisma.priceConfig.findUnique({ where: { key: "guide_rate_per_day" } });
      guideRatePerDay = config ? parseFloat(config.value) : 500000;
    } catch {
      guideRatePerDay = 500000;
    }
  }

  return calculatePricingPure(distanceKm, {
    numPax: input.numPax,
    tripDaysCount: input.tripDaysCount,
    vehicleRatePerKm: input.vehicleRatePerKm,
    hotelPricePerNight: input.hotelPricePerNight,
    hotelPaxPerRoom: input.hotelPaxPerRoom,
    ticketsTotalPerPerson,
    mealsTotalPerPerson,
    guideRatePerDay,
    includeGuide: input.includeGuide !== false,
    customMargin: input.customMarginTier,
  });
}

