import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Itinerary ID database...");

  // 1. Price Configs (PRD §5.2 & §5.6)
  const priceConfigs = [
    { key: "margin_target_1_2", value: "0.02", description: "Margin target perusahaan untuk 1-2 pax (2%)" },
    { key: "margin_target_3_5", value: "0.02", description: "Margin target perusahaan untuk 3-5 pax (2%)" },
    { key: "margin_target_6_12", value: "0.02", description: "Margin target perusahaan untuk 6-12 pax (2%)" },
    { key: "commission_reserve_1_2", value: "0.03", description: "Cadangan komisi agen untuk 1-2 pax (3%)" },
    { key: "commission_reserve_3_5", value: "0.03", description: "Cadangan komisi agen untuk 3-5 pax (3%)" },
    { key: "commission_reserve_6_12", value: "0.03", description: "Cadangan komisi agen untuk 6-12 pax (3%)" },
    { key: "gateway_fee_rate", value: "0.025", description: "Estimasi biaya payment gateway Midtrans (2.5%)" },
    { key: "guide_rate_per_day", value: "500000", description: "Tarif standar guide profesional per hari (IDR)" },
  ];

  for (const config of priceConfigs) {
    await prisma.priceConfig.upsert({
      where: { key: config.key },
      update: config,
      create: config,
    });
  }
  console.log("✅ Price configs seeded.");

  // 2. Vehicle Types (PRD §7.4)
  const vehicleTypes = [
    {
      name: "Avanza / Innova",
      capacityMin: 1,
      capacityMax: 5,
      ratePerKm: 5000,
      description: "Ideal untuk solo, duo, atau keluarga kecil hingga 5 orang. Termasuk BBM & tol.",
    },
    {
      name: "Hiace",
      capacityMin: 6,
      capacityMax: 10,
      ratePerKm: 9000,
      description: "Minivan komuter luas dan nyaman untuk grup 6-10 pax. Termasuk BBM & tol.",
    },
    {
      name: "Alphard / Lexus",
      capacityMin: 1,
      capacityMax: 5,
      ratePerKm: 15000,
      description: "Kendaraan mewah premium dengan kenyamanan maksimal untuk 1-5 pax.",
    },
    {
      name: "Bus medium",
      capacityMin: 11,
      capacityMax: 20,
      ratePerKm: 18000,
      description: "Bus pariwisata medium untuk rombongan besar hingga 20 pax.",
    },
  ];

  for (const v of vehicleTypes) {
    const existing = await prisma.vehicleType.findFirst({ where: { name: v.name } });
    if (!existing) {
      await prisma.vehicleType.create({ data: v });
    }
  }
  console.log("✅ Vehicle types seeded.");

  // 3. Destinations (Jawa Timur POIs)
  const destinations = [
    {
      name: "Mount Bromo Sunrise (Penanjakan)",
      region: "Bromo",
      lat: -7.9425,
      lng: 112.953,
      category: "mountain",
      ticketPrice: 250000,
      description: "Titik pandang sunrise legendaris Bromo dengan latar kaldera dan Gunung Semeru.",
    },
    {
      name: "Bromo Crater & Whispering Sands",
      region: "Bromo",
      lat: -7.935,
      lng: 112.96,
      category: "crater",
      ticketPrice: 50000,
      description: "Kawah aktif Bromo dan hamparan pasir berbisik yang ikonik.",
    },
    {
      name: "Ijen Crater & Blue Fire",
      region: "Ijen",
      lat: -8.0583,
      lng: 114.2425,
      category: "crater",
      ticketPrice: 150000,
      description: "Danau kawah asam toska terbesar di dunia dan fenomena api biru langka.",
    },
    {
      name: "Tumpak Sewu Waterfall",
      region: "Lumajang",
      lat: -8.2312,
      lng: 112.9167,
      category: "waterfall",
      ticketPrice: 50000,
      description: "Air terjun megah berbentuk tirai setengah lingkaran diapit tebing purba.",
    },
    {
      name: "Madakaripura Waterfall",
      region: "Probolinggo",
      lat: -7.8543,
      lng: 113.0035,
      category: "waterfall",
      ticketPrice: 45000,
      description: "Air terjun abadi tempat pertapaan Mahapatih Gajah Mada dalam ngarai tinggi.",
    },
    {
      name: "Batu Malang Eco Green / Jatim Park",
      region: "Malang",
      lat: -7.8978,
      lng: 112.5539,
      category: "city",
      ticketPrice: 120000,
      description: "Kawasan wisata edukasi keluarga dan pegunungan sejuk di Kota Wisata Batu.",
    },
    {
      name: "Baluran National Park",
      region: "Situbondo",
      lat: -7.8389,
      lng: 114.3889,
      category: "park",
      ticketPrice: 150000,
      description: "Savana terluas di Jawa (Little Africa in Java) dengan satwa banteng & rusa.",
    },
    {
      name: "Surabaya Juanda Airport (SUB)",
      region: "Surabaya",
      lat: -7.3798,
      lng: 112.7876,
      category: "transit",
      ticketPrice: 0,
      description: "Gerbang utama penjemputan dan kepulangan penerbangan internasional & domestik.",
    },
    {
      name: "Ketapang Ferry Port (Banyuwangi)",
      region: "Banyuwangi",
      lat: -8.1485,
      lng: 114.3985,
      category: "transit",
      ticketPrice: 0,
      description: "Titik drop-off penyeberangan kapal ferry menuju pulau Bali.",
    },
  ];

  for (const d of destinations) {
    const existing = await prisma.destination.findFirst({ where: { name: d.name } });
    if (!existing) {
      await prisma.destination.create({ data: d });
    }
  }
  console.log("✅ Destinations seeded.");

  // 4. Hotels per Region
  const hotels = [
    // Bromo
    {
      name: "Bromo Homestay Eco",
      region: "Bromo",
      hotelClass: "budget",
      pricePerRoomPerNight: 350000,
      paxPerRoom: 2,
      description: "Penginapan bersih dan hangat dekat gerbang masuk TNBTS.",
    },
    {
      name: "Lava View Lodge Bromo",
      region: "Bromo",
      hotelClass: "standard",
      pricePerRoomPerNight: 850000,
      paxPerRoom: 2,
      description: "Hotel di bibir kaldera dengan pemandangan langsung ke kawah Bromo.",
    },
    {
      name: "Jiwa Jawa Resort Bromo",
      region: "Bromo",
      hotelClass: "premium",
      pricePerRoomPerNight: 2200000,
      paxPerRoom: 2,
      description: "Resort butik mewah dengan galeri seni dan taman pegunungan asri.",
    },
    // Banyuwangi / Ijen
    {
      name: "Ijen Backpacker Lodge",
      region: "Ijen",
      hotelClass: "budget",
      pricePerRoomPerNight: 300000,
      paxPerRoom: 2,
      description: "Homestay ramah dan nyaman untuk istirahat sebelum pendakian dini hari.",
    },
    {
      name: "Ketapang Indah Hotel",
      region: "Ijen",
      hotelClass: "standard",
      pricePerRoomPerNight: 800000,
      paxPerRoom: 2,
      description: "Resort tepi pantai dengan kolam renang tropis dan akses mudah ke Ijen & ferry.",
    },
    {
      name: "Dialoog Banyuwangi",
      region: "Ijen",
      hotelClass: "premium",
      pricePerRoomPerNight: 2500000,
      paxPerRoom: 2,
      description: "Hotel bintang 5 menghadap Selat Bali dengan arsitektur modern minimalis.",
    },
    // Malang / Batu
    {
      name: "Malang Boutique Inn",
      region: "Malang",
      hotelClass: "budget",
      pricePerRoomPerNight: 350000,
      paxPerRoom: 2,
      description: "Hotel praktis di pusat kota Malang dengan akses kuliner lokal.",
    },
    {
      name: "Santika Premiere Malang",
      region: "Malang",
      hotelClass: "standard",
      pricePerRoomPerNight: 850000,
      paxPerRoom: 2,
      description: "Hotel bintang 4 dengan fasilitas lengkap dan sarapan hidangan tradisional istimewa.",
    },
    {
      name: "The Shalimar Boutique Hotel",
      region: "Malang",
      hotelClass: "premium",
      pricePerRoomPerNight: 1900000,
      paxPerRoom: 2,
      description: "Hotel warisan kolonial mewah berkelas di kawasan elit Malang.",
    },
  ];

  for (const h of hotels) {
    const existing = await prisma.hotel.findFirst({ where: { name: h.name } });
    if (!existing) {
      await prisma.hotel.create({ data: h });
    }
  }
  console.log("✅ Hotels seeded.");

  // 5. Activities & Add-ons
  const activities = [
    {
      name: "Sewa Hardtop Jeep 4x4 Bromo (Roundtrip)",
      ticketPrice: 650000,
      description: "Jeep 4x4 wajib untuk melintasi lautan pasir dan naik ke titik sunrise.",
    },
    {
      name: "Perlengkapan Ijen (Gas Mask, Headlamp, Surat Kesehatan)",
      ticketPrice: 75000,
      description: "Standard safety kit wajib dari dinas kesehatan untuk mendaki kawah Ijen.",
    },
    {
      name: "Pemandu Lokal Blue Fire Kawah Ijen",
      ticketPrice: 200000,
      description: "Guide lokal tersertifikasi menuruni bibir kawah menuju fenomena api biru.",
    },
    {
      name: "Local Ranger & Safety Guide Tumpak Sewu",
      ticketPrice: 150000,
      description: "Pemandu lokal menuruni tebing air terjun dan menyusuri Goa Tetes.",
    },
  ];

  for (const a of activities) {
    const existing = await prisma.activity.findFirst({ where: { name: a.name } });
    if (!existing) {
      await prisma.activity.create({ data: a });
    }
  }
  console.log("✅ Activities seeded.");

  // 6. Meal Options
  const mealOptions = [
    {
      name: "Paket Makan Standar Lokal (Prasmanan / Set Menu)",
      pricePerPax: 65000,
      description: "Hidangan lezat khas Jawa Timur (Ayam goreng, sayur asem, sambal, buah segar).",
    },
    {
      name: "Paket Makan Spesial (Seafood / Resto Wisata Pilihan)",
      pricePerPax: 150000,
      description: "Menu premium di restoran terkemuka dengan variasi kuliner lengkap.",
    },
  ];

  for (const m of mealOptions) {
    const existing = await prisma.mealOption.findFirst({ where: { name: m.name } });
    if (!existing) {
      await prisma.mealOption.create({ data: m });
    }
  }
  console.log("✅ Meal options seeded.");

  // 7. Seed Demo Users for all 5 roles
  const users = [
    {
      name: "Administrator",
      email: "admin@itinerary.id",
      password: "admin123",
      role: "admin",
      phone: "+6281110001",
      country: "Indonesia",
    },
    {
      name: "Customer Support (CS)",
      email: "cs@itinerary.id",
      password: "cs123456",
      role: "cs",
      phone: "+6281110002",
      country: "Indonesia",
    },
    {
      name: "Guide Budi Santoso",
      email: "guide@itinerary.id",
      password: "guide123",
      role: "guide",
      phone: "+6281110003",
      country: "Indonesia",
    },
    {
      name: "Finance Manager",
      email: "finance@itinerary.id",
      password: "finance123",
      role: "finance",
      phone: "+6281110004",
      country: "Indonesia",
    },
    {
      name: "John Traveler (Customer)",
      email: "john@example.com",
      password: "customer123",
      role: "customer",
      phone: "+14155552671",
      country: "United States",
      preferredLanguage: "en",
      preferredCurrency: "USD",
    },
    {
      name: "Li Wei (Mitra Agen Shanghai)",
      email: "agent@example.com",
      password: "agent123",
      role: "agent",
      phone: "+8613800138000",
      country: "China",
      preferredLanguage: "zh",
      preferredCurrency: "CNY",
    },
  ];

  for (const u of users) {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(u.password, salt);

    await prisma.user.upsert({
      where: { email: u.email },
      update: {
        name: u.name,
        role: u.role,
        passwordHash,
        phone: u.phone,
        country: u.country,
      },
      create: {
        name: u.name,
        email: u.email,
        role: u.role,
        passwordHash,
        phone: u.phone,
        country: u.country,
      },
    });
  }
  console.log("✅ Demo users for all roles seeded.");

  // Commission Rules & Agent Seeding
  const defaultRule = await prisma.commissionRule.upsert({
    where: { id: "rule-agent-100" },
    update: { payoutShare: 1.0 },
    create: {
      id: "rule-agent-100",
      name: "Standard Agent (100% Cadangan Komisi)",
      payoutShare: 1.0,
      isDefault: true,
    },
  });

  await prisma.commissionRule.upsert({
    where: { id: "rule-affiliate-50" },
    update: { payoutShare: 0.5 },
    create: {
      id: "rule-affiliate-50",
      name: "Standard Affiliate (50% Cadangan Komisi)",
      payoutShare: 0.5,
      isDefault: false,
    },
  });

  const agentUser = await prisma.user.findUnique({ where: { email: "agent@example.com" } });
  if (agentUser) {
    await prisma.agent.upsert({
      where: { userId: agentUser.id },
      update: { status: "active", tier: "agent" },
      create: {
        userId: agentUser.id,
        refCode: "SHANGHAI-WEI",
        tier: "agent",
        status: "active",
        country: "China",
        companyName: "Shanghai Silk Road Travel",
        commissionRuleId: defaultRule.id,
        payoutMethod: "wise",
      },
    });
  }
  console.log("✅ Commission rules and demo Agent seeded.");

  console.log("🎉 Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

