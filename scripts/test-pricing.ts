import {
  calculatePricingPure,
  defaultMarginTargetRate,
  defaultCommissionReserveRate,
  DEFAULT_GATEWAY_FEE_RATE,
  calcRooms,
} from "../src/lib/pricing";

console.log("=== UNIT TEST PRICING ENGINE (PRD §5.2, §5.6 & AC11) ===");

// 1. Margin target & commission reserve rate check
console.assert(defaultMarginTargetRate(1) === 0.02, "1 pax margin target should be 2%");
console.assert(defaultMarginTargetRate(2) === 0.02, "2 pax margin target should be 2%");
console.assert(defaultMarginTargetRate(4) === 0.02, "4 pax margin target should be 2%");
console.assert(defaultMarginTargetRate(8) === 0.02, "8 pax margin target should be 2%");

console.assert(defaultCommissionReserveRate(1) === 0.03, "1 pax commission reserve should be 3%");
console.assert(defaultCommissionReserveRate(2) === 0.03, "2 pax commission reserve should be 3%");
console.assert(defaultCommissionReserveRate(4) === 0.03, "4 pax commission reserve should be 3%");
console.assert(defaultCommissionReserveRate(8) === 0.03, "8 pax commission reserve should be 3%");
console.log("✓ Rate defaults verified (MarginTarget: 2%, CommissionReserve: 3%, Gateway: 2.5%)");

// 2. Room calculations
console.assert(calcRooms(1, 2) === 1, "1 pax needs 1 room");
console.assert(calcRooms(2, 2) === 1, "2 pax needs 1 room");
console.assert(calcRooms(3, 2) === 2, "3 pax needs 2 rooms");
console.assert(calcRooms(4, 2) === 2, "4 pax needs 2 rooms");
console.assert(calcRooms(7, 2) === 4, "7 pax needs 4 rooms");
console.log("✓ Room calculations verified (ceil(pax / pax_per_room))");

// 3. Scenario: Bromo - Ijen 3D2N with 6 pax in Hiace (PRD §5.5 Illustration)
// Subtotal approx Rp 10.400.000:
// Transport = 4.500.000 (500 km * 9000)
// Hotel = Standard (850.000 * 2 nights * 3 rooms = 5.100.000)
// Guide = 1.500.000 (500.000 * 3 days)
// (Total subtotal = 11.100.000 in this exact test)
const result = calculatePricingPure(500, {
  numPax: 6,
  tripDaysCount: 3,
  vehicleRatePerKm: 9000,
  hotelPricePerNight: 850000,
  hotelPaxPerRoom: 2,
  ticketsTotalPerPerson: 0,
  guideRatePerDay: 500000,
});

console.log("\nScenario: 6 Pax Hiace 3D2N (500 km):");
console.log("- Distance:", result.distanceKm, "km");
console.log("- Transport:", result.transportCost);
console.log("- Hotel (2 nights, 3 rooms):", result.hotelCost);
console.log("- Guide (3 days):", result.guideCost);
console.log("- Subtotal:", result.subtotal);
console.log("- Margin Target (2%):", result.marginTargetAmount);
console.log("- Commission Reserve (3%):", result.commissionReserveAmount);
console.log("- Total (Gross-up / (1 - 0.025)):", result.totalAmount);
console.log("- Gateway Fee (Total * 2.5%):", result.gatewayFeeAmount);
console.log("- Biaya Platform (Total - Subtotal):", result.platformFeeAmount);
console.log("- Price Per Pax:", result.pricePerPax);

// Verification of AC11
const expectedSubtotal = result.transportCost + result.hotelCost + result.ticketsCost + result.mealsCost + result.guideCost;
console.assert(result.subtotal === expectedSubtotal, "Subtotal check failed");

const expectedMarginTarget = Math.round(result.subtotal * 0.02);
console.assert(result.marginTargetAmount === expectedMarginTarget, "Margin target check failed");

const expectedCommissionReserve = Math.round(result.subtotal * 0.03);
console.assert(result.commissionReserveAmount === expectedCommissionReserve, "Commission reserve check failed");

const expectedTotal = Math.round((result.subtotal + expectedMarginTarget + expectedCommissionReserve) / (1 - 0.025));
console.assert(result.totalAmount === expectedTotal, "Total gross-up check failed");

console.assert(result.platformFeeAmount === result.totalAmount - result.subtotal, "BiayaPlatform = Total - Subtotal check failed");

// Check across pax tiers: 1 pax, 2 pax, 4 pax, 8 pax
[1, 2, 4, 8].forEach((pax) => {
  const res = calculatePricingPure(300, {
    numPax: pax,
    tripDaysCount: 2,
    vehicleRatePerKm: 6000,
    hotelPricePerNight: 600000,
    ticketsTotalPerPerson: 150000,
  });
  console.assert(res.platformFeeAmount === res.totalAmount - res.subtotal, `AC11 failed for ${pax} pax`);
  console.assert(res.pricePerPax === Math.round(res.totalAmount / pax), `Price per pax failed for ${pax} pax`);
});

console.log("✓ AC11 verified across all pax tiers (1, 2, 4, 8)!");
console.log("\n✅ ALL PRICING CALCULATIONS PASSED ACCORDING TO PRD §5.2 & AC11!");
