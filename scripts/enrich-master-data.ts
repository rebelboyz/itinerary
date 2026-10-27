import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌟 Enriching vehicles, destinations, and hotels with photos, reviews, and Google Maps...");

  // 1. Vehicles
  const vehicles = [
    {
      name: "Avanza / Innova",
      imageUrl: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80",
      rating: 4.9,
      reviewCount: 142,
      googleMapsUrl: "https://maps.google.com/?q=Surabaya+Juanda+Airport",
    },
    {
      name: "Hiace",
      imageUrl: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80",
      rating: 4.9,
      reviewCount: 98,
      googleMapsUrl: "https://maps.google.com/?q=Surabaya+Juanda+Airport",
    },
    {
      name: "Alphard / Lexus",
      imageUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80",
      rating: 5.0,
      reviewCount: 64,
      googleMapsUrl: "https://maps.google.com/?q=Surabaya+Juanda+Airport",
    },
    {
      name: "Bus medium",
      imageUrl: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80",
      rating: 4.8,
      reviewCount: 37,
      googleMapsUrl: "https://maps.google.com/?q=Surabaya+Juanda+Airport",
    },
  ];

  for (const v of vehicles) {
    await prisma.vehicleType.updateMany({
      where: { name: { contains: v.name.split("/")[0].trim() } },
      data: {
        imageUrl: v.imageUrl,
        rating: v.rating,
        reviewCount: v.reviewCount,
        googleMapsUrl: v.googleMapsUrl,
      },
    });
  }

  // 2. Destinations
  const destUpdates = [
    {
      namePattern: "Bromo",
      imageUrl: "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=800&q=80",
      rating: 4.9,
      reviewCount: 480,
      googleMapsUrl: "https://maps.google.com/?q=Gunung+Bromo+East+Java",
    },
    {
      namePattern: "Ijen",
      imageUrl: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80",
      rating: 4.9,
      reviewCount: 560,
      googleMapsUrl: "https://maps.google.com/?q=Kawah+Ijen+Banyuwangi",
    },
    {
      namePattern: "Tumpak",
      imageUrl: "https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=800&q=80",
      rating: 4.9,
      reviewCount: 390,
      googleMapsUrl: "https://maps.google.com/?q=Air+Terjun+Tumpak+Sewu+Lumajang",
    },
    {
      namePattern: "Madakaripura",
      imageUrl: "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=800&q=80",
      rating: 4.8,
      reviewCount: 210,
      googleMapsUrl: "https://maps.google.com/?q=Air+Terjun+Madakaripura+Probolinggo",
    },
    {
      namePattern: "Malang",
      imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
      rating: 4.7,
      reviewCount: 195,
      googleMapsUrl: "https://maps.google.com/?q=Kota+Wisata+Batu+Malang",
    },
    {
      namePattern: "Baluran",
      imageUrl: "https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&w=800&q=80",
      rating: 4.8,
      reviewCount: 175,
      googleMapsUrl: "https://maps.google.com/?q=Taman+Nasional+Baluran",
    },
    {
      namePattern: "Surabaya",
      imageUrl: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80",
      rating: 4.7,
      reviewCount: 890,
      googleMapsUrl: "https://maps.google.com/?q=Juanda+International+Airport+Surabaya",
    },
    {
      namePattern: "Ketapang",
      imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
      rating: 4.6,
      reviewCount: 410,
      googleMapsUrl: "https://maps.google.com/?q=Pelabuhan+Ketapang+Banyuwangi",
    },
  ];

  for (const d of destUpdates) {
    await prisma.destination.updateMany({
      where: { name: { contains: d.namePattern } },
      data: {
        imageUrl: d.imageUrl,
        rating: d.rating,
        reviewCount: d.reviewCount,
        googleMapsUrl: d.googleMapsUrl,
      },
    });
  }

  // 3. Hotels
  const hotelUpdates = [
    {
      namePattern: "Jiwa",
      imageUrl: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80",
      rating: 4.9,
      reviewCount: 190,
      googleMapsUrl: "https://maps.google.com/?q=Jiwa+Jawa+Resort+Bromo",
      lat: -7.9250,
      lng: 112.9972,
    },
    {
      namePattern: "Bromo",
      imageUrl: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
      rating: 4.8,
      reviewCount: 240,
      googleMapsUrl: "https://maps.google.com/?q=Lava+View+Lodge+Bromo",
      lat: -7.9234,
      lng: 112.9644,
    },
    {
      namePattern: "Ketapang",
      imageUrl: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80",
      rating: 4.8,
      reviewCount: 310,
      googleMapsUrl: "https://maps.google.com/?q=Ketapang+Indah+Hotel+Banyuwangi",
      lat: -8.1751,
      lng: 114.3941,
    },
    {
      namePattern: "Santika",
      imageUrl: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80",
      rating: 4.8,
      reviewCount: 280,
      googleMapsUrl: "https://maps.google.com/?q=Hotel+Santika+Premiere+Malang",
      lat: -7.9691,
      lng: 112.6288,
    },
    {
      namePattern: "Dialoog",
      imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
      rating: 4.9,
      reviewCount: 220,
      googleMapsUrl: "https://maps.google.com/?q=Dialoog+Banyuwangi",
      lat: -8.1824,
      lng: 114.3962,
    },
    {
      namePattern: "Ijen",
      imageUrl: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=800&q=80",
      rating: 4.9,
      reviewCount: 215,
      googleMapsUrl: "https://maps.google.com/?q=Grand+Harvest+Resort+Ijen",
      lat: -8.1878,
      lng: 114.2697,
    },
  ];

  for (const h of hotelUpdates) {
    await prisma.hotel.updateMany({
      where: { name: { contains: h.namePattern } },
      data: {
        imageUrl: h.imageUrl,
        rating: h.rating,
        reviewCount: h.reviewCount,
        googleMapsUrl: h.googleMapsUrl,
        lat: h.lat,
        lng: h.lng,
      },
    });
  }

  // Any remaining without coordinates get good regional defaults
  await prisma.hotel.updateMany({
    where: { lat: null, region: { contains: "Bromo", mode: "insensitive" } },
    data: { lat: -7.9250, lng: 112.9972 },
  });
  await prisma.hotel.updateMany({
    where: { lat: null, region: { contains: "Banyuwangi", mode: "insensitive" } },
    data: { lat: -8.1878, lng: 114.2697 },
  });
  await prisma.hotel.updateMany({
    where: { lat: null, region: { contains: "Malang", mode: "insensitive" } },
    data: { lat: -7.9691, lng: 112.6288 },
  });

  // Any remaining without image get good defaults
  await prisma.vehicleType.updateMany({
    where: { imageUrl: null },
    data: {
      imageUrl: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80",
      rating: 4.8,
      reviewCount: 60,
    },
  });

  await prisma.destination.updateMany({
    where: { imageUrl: null },
    data: {
      imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
      rating: 4.8,
      reviewCount: 120,
    },
  });

  await prisma.hotel.updateMany({
    where: { imageUrl: null },
    data: {
      imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
      rating: 4.7,
      reviewCount: 75,
    },
  });

  console.log("✨ All data enriched with photos, ratings, reviews, and Google Maps links!");
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());

