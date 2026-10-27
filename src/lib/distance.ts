export interface GeoPoint {
  lat: number;
  lng: number;
  name?: string;
}

/**
 * Known geographical anchors for East Java tourist routes
 */
export const KNOWN_LOCATIONS: Record<string, { lat: number; lng: number }> = {
  surabaya: { lat: -7.3798, lng: 112.7876 },
  juanda: { lat: -7.3798, lng: 112.7876 },
  malang: { lat: -7.9797, lng: 112.6304 },
  batu: { lat: -7.8885, lng: 112.5292 },
  bromo: { lat: -7.9425, lng: 112.953 },
  madakaripura: { lat: -7.8542, lng: 113.1467 },
  ijen: { lat: -8.0583, lng: 114.2425 },
  banyuwangi: { lat: -8.2192, lng: 114.3692 },
  ketapang: { lat: -8.1489, lng: 114.3986 },
  "tumpak sewu": { lat: -8.2312, lng: 112.9178 },
  baluran: { lat: -7.8389, lng: 114.3917 },
  bali: { lat: -8.7482, lng: 115.1672 },
};

/**
 * Resolves approximate GPS coordinates from name if missing
 */
export function resolveLocationCoordinates(
  name?: string,
  fallbackLat?: number | null,
  fallbackLng?: number | null
): { lat: number; lng: number } {
  if (fallbackLat && fallbackLng && (fallbackLat !== 0 || fallbackLng !== 0)) {
    return { lat: fallbackLat, lng: fallbackLng };
  }
  const lower = (name || "").toLowerCase();
  for (const [key, coords] of Object.entries(KNOWN_LOCATIONS)) {
    if (lower.includes(key)) {
      return coords;
    }
  }
  // Default to Surabaya Juanda Airport
  return { lat: -7.3798, lng: 112.7876 };
}

/**
 * Formats realistic driving duration based on distance & East Java mountain road winding
 */
export function formatDriveTime(distanceKm: number, locale: string = "id"): string {
  if (distanceKm <= 0) return locale === "zh" ? "到达" : locale === "en" ? "Arrived" : "Tiba";
  // Average speeds considering winding mountain and toll conditions
  const speed = distanceKm < 30 ? 32 : distanceKm < 80 ? 42 : 48;
  const totalMinutes = Math.max(15, Math.round((distanceKm / speed) * 60));
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;

  if (locale === "zh") {
    if (hours === 0) return `约 ${mins} 分钟车程`;
    if (mins === 0) return `约 ${hours} 小时车程`;
    return `约 ${hours} 小时 ${mins} 分钟车程`;
  }
  if (locale === "en") {
    if (hours === 0) return `~${mins} mins drive`;
    if (mins === 0) return `~${hours} hrs drive`;
    return `~${hours}h ${mins}m drive`;
  }
  // id
  if (hours === 0) return `~${mins} menit perjalanan`;
  if (mins === 0) return `~${hours} jam perjalanan`;
  return `~${hours} jam ${mins} mnt perjalanan`;
}

/**
 * Generates Google Maps Turn-by-Turn Driving Directions Link
 */
export function buildGoogleMapsDirectionUrl(
  origin: { lat: number; lng: number } | string,
  destination: { lat: number; lng: number } | string
): string {
  const origStr =
    typeof origin === "string"
      ? encodeURIComponent(origin)
      : `${origin.lat.toFixed(5)},${origin.lng.toFixed(5)}`;
  const destStr =
    typeof destination === "string"
      ? encodeURIComponent(destination)
      : `${destination.lat.toFixed(5)},${destination.lng.toFixed(5)}`;
  return `https://www.google.com/maps/dir/?api=1&origin=${origStr}&destination=${destStr}&travelmode=driving`;
}

/**
 * Calculates distance in kilometers between two GPS coordinates using Haversine formula
 * multiplied by a standard road winding factor (1.35x for Indonesian mountain & highway roads).
 */
export function haversineDistanceKm(p1: GeoPoint, p2: GeoPoint, roadFactor = 1.35): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((p2.lat - p1.lat) * Math.PI) / 180;
  const dLon = ((p2.lng - p1.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((p1.lat * Math.PI) / 180) *
      Math.cos((p2.lat * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const straightLine = R * c;
  return Math.round(straightLine * roadFactor * 10) / 10;
}

/**
 * Parameters for building hotel-centric realistic tour circuit
 */
export interface HotelCentricParams {
  pickup: GeoPoint;
  dropoff: GeoPoint;
  hotel?: (GeoPoint & { name?: string }) | null;
  days: Array<{
    dayNumber: number;
    destinations: Array<GeoPoint & { name?: string; imageUrl?: string; rating?: number; reviewCount?: number; googleMapsUrl?: string }>;
  }>;
}

/**
 * Builds realistic waypoint order where Hotel acts as the operational Hub:
 * Day 1: Pickup -> Hotel Check-in & Refresh -> Day 1 Dests -> Return to Hotel for Night Rest
 * Day 2..N-1: Depart Hotel -> Day Dests -> Return to Hotel to shower & rest
 * Day N: Checkout Hotel -> On-the-way Dests -> Dropoff Point
 */
export function buildHotelCentricWaypoints(params: HotelCentricParams): GeoPoint[] {
  const { pickup, dropoff, hotel, days } = params;
  const waypoints: GeoPoint[] = [];

  // Fallback: If no hotel is selected (Day trip / transit without hotel stay)
  if (!hotel || !hotel.lat || !hotel.lng) {
    waypoints.push(pickup);
    for (const d of days) {
      for (const dest of d.destinations || []) {
        waypoints.push(dest);
      }
    }
    waypoints.push(dropoff);
    return waypoints;
  }

  // --- HOTEL-CENTRIC INTELLIGENT CIRCUIT ---
  // 1. Pickup from Airport/Station
  waypoints.push(pickup);

  // 2. Day 1: Transfer from Airport to Hotel for Check-in & Refresh
  const hotelPoint: GeoPoint = {
    lat: hotel.lat,
    lng: hotel.lng,
    name: `${hotel.name || "Hotel"} (Check-in & Refresh)`,
  };
  waypoints.push(hotelPoint);

  const totalDays = days.length;

  days.forEach((day, idx) => {
    const isFirstDay = idx === 0;
    const isLastDay = idx === totalDays - 1;
    const dests = day.destinations || [];

    if (isFirstDay) {
      // Day 1: After check-in & shower, visit Day 1 afternoon/evening attractions
      if (dests.length > 0) {
        for (const dest of dests) {
          waypoints.push(dest);
        }
        // Return to Hotel for dinner and overnight rest
        waypoints.push({
          lat: hotel.lat,
          lng: hotel.lng,
          name: `${hotel.name || "Hotel"} (Kembali Istirahat Malam)`,
        });
      }
    } else if (!isLastDay) {
      // Intermediate Day (Day 2..N-1): Full day tour starting from Hotel lobby
      waypoints.push({
        lat: hotel.lat,
        lng: hotel.lng,
        name: `${hotel.name || "Hotel"} (Berangkat Tour)`,
      });
      for (const dest of dests) {
        waypoints.push(dest);
      }
      // Return to hotel to freshen up & rest
      waypoints.push({
        lat: hotel.lat,
        lng: hotel.lng,
        name: `${hotel.name || "Hotel"} (Kembali Mandi & Istirahat)`,
      });
    } else {
      // Last Day: Checkout from hotel with luggage
      waypoints.push({
        lat: hotel.lat,
        lng: hotel.lng,
        name: `${hotel.name || "Hotel"} (Checkout & Muat Bagasi)`,
      });
      // If there are on-the-way attractions on departure day:
      for (const dest of dests) {
        waypoints.push(dest);
      }
    }
  });

  // Final transfer to Drop-off point (Airport / Port)
  waypoints.push(dropoff);

  return waypoints;
}

/**
 * Calculates total route distance across ordered waypoints:
 * Pickup -> Stop 1 -> Stop 2 -> ... -> Dropoff
 */
export async function calculateRouteDistanceKm(points: GeoPoint[]): Promise<number> {
  if (!points || points.length < 2) return 0;

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  if (apiKey) {
    try {
      // Optional Google Distance Matrix API call if API key provided
      let totalMeters = 0;
      for (let i = 0; i < points.length - 1; i++) {
        const origin = `${points[i].lat},${points[i].lng}`;
        const destination = `${points[i + 1].lat},${points[i + 1].lng}`;
        const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin}&destinations=${destination}&key=${apiKey}`;

        const res = await fetch(url);
        const data = await res.json();
        if (data.status === "OK" && data.rows?.[0]?.elements?.[0]?.status === "OK") {
          totalMeters += data.rows[0].elements[0].distance.value;
        } else {
          // Fallback if segment failed
          totalMeters += haversineDistanceKm(points[i], points[i + 1]) * 1000;
        }
      }
      return Math.round((totalMeters / 1000) * 10) / 10;
    } catch (err) {
      console.warn("Google Maps Distance Matrix call failed, using intelligent road fallback:", err);
    }
  }

  // Fallback: Haversine distance with road winding factor
  let totalKm = 0;
  for (let i = 0; i < points.length - 1; i++) {
    totalKm += haversineDistanceKm(points[i], points[i + 1]);
  }
  return Math.round(totalKm * 10) / 10;
}

