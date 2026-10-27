import { calculatePricingPure, marginTier, calcRooms } from "../src/lib/pricing";

console.log("=== UNIT TEST PRICING ENGINE (PRD §7 & §19) ===");

// 1. Margin tiers check
console.assert(marginTier(1) === 0.12, "Solo margin should be 12%");
console.assert(marginTier(2) === 0.12, "Duo margin should be 12%");
console.assert(marginTier(4) === 0.08, "4 pax margin should be 8%");
console.assert(marginTier(8) === 0.05, "8 pax margin should be 5%");
console.log("✓ Margin tiers verified (1-2: 12%, 3-5: 8%, 6-12: 5%)");

// 2. Room calculations
console.assert(calcRooms(1, 2) === 1, "1 pax needs 1 room");
console.assert(calcRooms(2, 2) === 1, "2 pax needs 1 room");
console.assert(calcRooms(3, 2) === 2, "3 pax needs 2 rooms");
console.assert(calcRooms(4, 2) === 2, "4 pax needs 2 rooms");
console.assert(calcRooms(7, 2) === 4, "7 pax needs 4 rooms");
console.log("✓ Room calculations verified (ceil(pax / pax_per_room))");

// 3. Scenario: Bromo - Ijen 3D2N with 8 pax in Hiace
// Hiace rate = 9.000 Rp/km. Total roundtrip distance approx 500 km.
// Guide = 500.000 * 3 = 1.500.000
// Tickets = 400.000 per person * 8
// Hotel = Standard (850.000 * 2 nights * 4 rooms) = 6.800.000
const result = calculatePricingPure(500, {
  numPax: 8,
  tripDaysCount: 3,
  vehicleRatePerKm: 9000,
  hotelPricePerNight: 850000,
  hotelPaxPerRoom: 2,
  ticketsTotalPerPerson: 400000,
  guideRatePerDay: 500000,
});

console.log("\nScenario: 8 Pax Hiace 3D2N (500 km):");
console.log("- Distance:", result.distanceKm, "km");
console.log("- Transport:", result.transportCost, "(500 * 9.000)");
console.log("- Hotel (2 nights, 4 rooms):", result.hotelCost);
console.log("- Tickets (8 pax):", result.ticketsCost);
console.log("- Guide (3 days):", result.guideCost);
console.log("- Subtotal:", result.subtotal);
console.log("- Margin (5%):", result.marginAmount);
console.log("- Total:", result.totalAmount);
console.log("- Price Per Pax:", result.pricePerPax);

console.assert(result.transportCost === 4500000, "Transport cost should be 4.500.000");
console.assert(result.guideCost === 1500000, "Guide cost should be 1.500.000");
console.assert(result.hotelCost === 6800000, "Hotel cost should be 6.800.000");
console.assert(result.ticketsCost === 3200000, "Tickets cost should be 3.200.000");
console.assert(result.marginPercent === 0.05, "Margin percent should be 5%");

console.log("\n✅ ALL PRICING CALCULATIONS PASSED ACCORDING TO PRD §19!");

