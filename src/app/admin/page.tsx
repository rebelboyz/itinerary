"use client";

import React, { useEffect, useState } from "react";
import {
  Compass,
  Car,
  MapPin,
  Hotel as HotelIcon,
  DollarSign,
  Users,
  Shield,
  CheckCircle2,
  Clock,
  Edit,
  Save,
  Plus,
  Trash2,
  ExternalLink,
  Star,
  Image as ImageIcon,
  X,
  Layers,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { formatIDR } from "@/lib/utils";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"bookings" | "vehicles" | "hotels" | "destinations" | "pricing">("bookings");
  const [bookings, setBookings] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [hotels, setHotels] = useState<any[]>([]);
  const [destinations, setDestinations] = useState<any[]>([]);
  const [priceConfigs, setPriceConfigs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit price configs
  const [margin12, setMargin12] = useState("0.12");
  const [margin35, setMargin35] = useState("0.08");
  const [margin612, setMargin612] = useState("0.05");
  const [guideRate, setGuideRate] = useState("500000");
  const [savingConfig, setSavingConfig] = useState(false);

  // Add Modals
  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);
  const [showAddHotelModal, setShowAddHotelModal] = useState(false);
  const [showAddDestModal, setShowAddDestModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit Modals
  const [editingVehicle, setEditingVehicle] = useState<any | null>(null);
  const [editingHotel, setEditingHotel] = useState<any | null>(null);
  const [editingDestination, setEditingDestination] = useState<any | null>(null);

  // Google Maps / Places Sync state
  const [isSyncingGoogle, setIsSyncingGoogle] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // New Vehicle form state
  const [newVeh, setNewVeh] = useState({
    name: "",
    capacityMin: 1,
    capacityMax: 5,
    ratePerKm: 5000,
    description: "",
    imageUrl: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80",
    rating: 4.9,
    reviewCount: 75,
    googleMapsUrl: "https://maps.google.com/?q=Surabaya+Juanda+Airport",
  });

  // New Hotel form state
  const [newHotel, setNewHotel] = useState({
    name: "",
    region: "Bromo",
    hotelClass: "standard",
    pricePerRoomPerNight: 750000,
    paxPerRoom: 2,
    description: "",
    imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
    rating: 4.8,
    reviewCount: 90,
    googleMapsUrl: "https://maps.google.com/?q=Bromo+Hotel",
    lat: -7.925,
    lng: 112.9972,
  });

  // New Destination form state
  const [newDest, setNewDest] = useState({
    name: "",
    region: "Bromo",
    lat: -7.9425,
    lng: 112.953,
    category: "mountain",
    ticketPrice: 50000,
    description: "",
    imageUrl: "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=800&q=80",
    rating: 4.9,
    reviewCount: 150,
    googleMapsUrl: "https://maps.google.com/?q=Gunung+Bromo",
  });

  useEffect(() => {
    loadAllAdminData();
  }, []);

  async function loadAllAdminData() {
    setLoading(true);
    try {
      const [bRes, vRes, hRes, dRes, pRes] = await Promise.all([
        fetch("/api/bookings").then((r) => r.json()),
        fetch("/api/vehicles?active=false").then((r) => r.json()),
        fetch("/api/hotels?active=false").then((r) => r.json()),
        fetch("/api/destinations?active=false").then((r) => r.json()),
        fetch("/api/price-config").then((r) => r.json()),
      ]);

      setBookings(bRes.bookings || []);
      setVehicles(vRes.vehicles || []);
      setHotels(hRes.hotels || []);
      setDestinations(dRes.destinations || []);

      const configs = pRes.configs || [];
      setPriceConfigs(configs);

      configs.forEach((c: any) => {
        if (c.key === "margin_1_2") setMargin12(c.value);
        if (c.key === "margin_3_5") setMargin35(c.value);
        if (c.key === "margin_6_12") setMargin612(c.value);
        if (c.key === "guide_rate_per_day") setGuideRate(c.value);
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  // Google Places Sync
  const handleSyncGoogle = async (target: "newHotel" | "editHotel" | "newDest" | "editDest") => {
    let query = "";
    let googleMapsUrl = "";

    if (target === "newHotel") {
      query = newHotel.name;
      googleMapsUrl = newHotel.googleMapsUrl;
    } else if (target === "editHotel") {
      query = editingHotel?.name || "";
      googleMapsUrl = editingHotel?.googleMapsUrl || "";
    } else if (target === "newDest") {
      query = newDest.name;
      googleMapsUrl = newDest.googleMapsUrl;
    } else if (target === "editDest") {
      query = editingDestination?.name || "";
      googleMapsUrl = editingDestination?.googleMapsUrl || "";
    }

    if (!query && !googleMapsUrl) {
      alert("Harap masukkan nama tempat atau link Google Maps terlebih dahulu untuk sinkronisasi.");
      return;
    }

    setIsSyncingGoogle(true);
    setSyncFeedback(null);

    try {
      const res = await fetch("/api/google-places/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, googleMapsUrl }),
      });
      const result = await res.json();

      if (res.ok && result.success && result.data) {
        const d = result.data;
        if (target === "newHotel") {
          setNewHotel((prev) => ({
            ...prev,
            name: d.name || prev.name,
            rating: d.rating ?? prev.rating,
            reviewCount: d.reviewCount ?? prev.reviewCount,
            lat: d.lat ?? prev.lat,
            lng: d.lng ?? prev.lng,
            googleMapsUrl: d.googleMapsUrl || prev.googleMapsUrl,
          }));
        } else if (target === "editHotel") {
          setEditingHotel((prev: any) => ({
            ...prev,
            name: d.name || prev.name,
            rating: d.rating ?? prev.rating,
            reviewCount: d.reviewCount ?? prev.reviewCount,
            lat: d.lat ?? prev.lat,
            lng: d.lng ?? prev.lng,
            googleMapsUrl: d.googleMapsUrl || prev.googleMapsUrl,
          }));
        } else if (target === "newDest") {
          setNewDest((prev) => ({
            ...prev,
            name: d.name || prev.name,
            rating: d.rating ?? prev.rating,
            reviewCount: d.reviewCount ?? prev.reviewCount,
            lat: d.lat ?? prev.lat,
            lng: d.lng ?? prev.lng,
            googleMapsUrl: d.googleMapsUrl || prev.googleMapsUrl,
          }));
        } else if (target === "editDest") {
          setEditingDestination((prev: any) => ({
            ...prev,
            name: d.name || prev.name,
            rating: d.rating ?? prev.rating,
            reviewCount: d.reviewCount ?? prev.reviewCount,
            lat: d.lat ?? prev.lat,
            lng: d.lng ?? prev.lng,
            googleMapsUrl: d.googleMapsUrl || prev.googleMapsUrl,
          }));
        }
        setSyncFeedback({ type: "success", text: result.message || "Berhasil disinkronkan dari Google!" });
      } else {
        setSyncFeedback({ type: "error", text: result.error || "Gagal sinkronkan Google Maps." });
      }
    } catch (err) {
      console.error(err);
      setSyncFeedback({ type: "error", text: "Terjadi kesalahan koneksi saat sinkronisasi Google." });
    } finally {
      setIsSyncingGoogle(false);
    }
  };

  // Create Vehicle
  const handleCreateVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/vehicles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newVeh),
      });
      if (res.ok) {
        setShowAddVehicleModal(false);
        setNewVeh({
          name: "",
          capacityMin: 1,
          capacityMax: 5,
          ratePerKm: 5000,
          description: "",
          imageUrl: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80",
          rating: 4.9,
          reviewCount: 75,
          googleMapsUrl: "https://maps.google.com/?q=Surabaya+Juanda+Airport",
        });
        loadAllAdminData();
      } else {
        alert("Gagal menambahkan armada.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update Vehicle (Edit ratePerKm, name, capacities, etc.)
  const handleUpdateVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVehicle) return;
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/vehicles", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingVehicle),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setEditingVehicle(null);
        await loadAllAdminData();
        alert("Data armada & tarif per km berhasil diperbarui!");
      } else {
        alert(data.error || "Gagal memperbarui armada.");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan sistem saat memperbarui armada.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Vehicle
  const handleDeleteVehicle = async (id: string) => {
    if (!confirm("Hapus armada ini dari sistem?")) return;
    try {
      await fetch(`/api/vehicles?id=${id}`, { method: "DELETE" });
      loadAllAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  // Create Hotel
  const handleCreateHotel = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/hotels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newHotel),
      });
      if (res.ok) {
        setShowAddHotelModal(false);
        setSyncFeedback(null);
        setNewHotel({
          name: "",
          region: "Bromo",
          hotelClass: "standard",
          pricePerRoomPerNight: 750000,
          paxPerRoom: 2,
          description: "",
          imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
          rating: 4.8,
          reviewCount: 90,
          googleMapsUrl: "https://maps.google.com/?q=Bromo+Hotel",
          lat: -7.925,
          lng: 112.9972,
        });
        loadAllAdminData();
      } else {
        alert("Gagal menambahkan pilihan hotel.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update Hotel (Edit pricePerRoomPerNight, rating, lat/lng, etc.)
  const handleUpdateHotel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingHotel) return;
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/hotels", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingHotel),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setEditingHotel(null);
        setSyncFeedback(null);
        await loadAllAdminData();
        alert("Data hotel & tarif per malam berhasil diperbarui!");
      } else {
        alert(data.error || "Gagal memperbarui hotel.");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan sistem saat memperbarui hotel.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Hotel
  const handleDeleteHotel = async (id: string) => {
    if (!confirm("Hapus hotel ini dari sistem?")) return;
    try {
      await fetch(`/api/hotels?id=${id}`, { method: "DELETE" });
      loadAllAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  // Create Destination
  const handleCreateDestination = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/destinations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newDest),
      });
      if (res.ok) {
        setShowAddDestModal(false);
        setSyncFeedback(null);
        setNewDest({
          name: "",
          region: "Bromo",
          lat: -7.9425,
          lng: 112.953,
          category: "mountain",
          ticketPrice: 50000,
          description: "",
          imageUrl: "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=800&q=80",
          rating: 4.9,
          reviewCount: 150,
          googleMapsUrl: "https://maps.google.com/?q=Gunung+Bromo",
        });
        loadAllAdminData();
      } else {
        alert("Gagal menambahkan destinasi.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update Destination (Edit ticketPrice, coordinates, category, etc.)
  const handleUpdateDestination = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDestination) return;
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/destinations", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingDestination),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setEditingDestination(null);
        setSyncFeedback(null);
        await loadAllAdminData();
        alert("Data destinasi wisata & tiket masuk berhasil diperbarui!");
      } else {
        alert(data.error || "Gagal memperbarui destinasi.");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan sistem saat memperbarui destinasi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Destination
  const handleDeleteDestination = async (id: string) => {
    if (!confirm("Hapus destinasi ini dari sistem?")) return;
    try {
      await fetch(`/api/destinations?id=${id}`, { method: "DELETE" });
      loadAllAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  // Save Margin & Guide configs
  const handleSavePriceConfigs = async () => {
    setSavingConfig(true);
    try {
      await Promise.all([
        fetch("/api/price-config", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key: "margin_1_2", value: margin12 }),
        }),
        fetch("/api/price-config", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key: "margin_3_5", value: margin35 }),
        }),
        fetch("/api/price-config", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key: "margin_6_12", value: margin612 }),
        }),
        fetch("/api/price-config", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key: "guide_rate_per_day", value: guideRate }),
        }),
      ]);
      alert("Konfigurasi harga dan margin berhasil diperbarui!");
      loadAllAdminData();
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan konfigurasi.");
    } finally {
      setSavingConfig(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded">
              Backoffice Internal
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Admin Master Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Kelola pesanan pelanggan, edit tarif armada & biaya hotel, update tiket destinasi, serta sinkronkan review asli Google Maps.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadAllAdminData}
            className="px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-900 hover:bg-slate-50 transition shadow-sm"
          >
            Refresh Data
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-500 font-medium">Total Pesanan</span>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">{bookings.length}</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-500 font-medium">Armada Aktif</span>
          <div className="text-2xl font-extrabold text-emerald-600 mt-1">{vehicles.length} Unit</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-500 font-medium">Pilihan Hotel</span>
          <div className="text-2xl font-extrabold text-teal-600 mt-1">{hotels.length} Properti</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-500 font-medium">Daftar Destinasi</span>
          <div className="text-2xl font-extrabold text-indigo-600 mt-1">{destinations.length} POI</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 space-x-6 text-xs font-bold overflow-x-auto">
        <button
          onClick={() => setActiveTab("bookings")}
          className={`pb-3 border-b-2 whitespace-nowrap transition ${
            activeTab === "bookings"
              ? "border-emerald-600 text-emerald-700"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Daftar Pesanan ({bookings.length})
        </button>
        <button
          onClick={() => setActiveTab("vehicles")}
          className={`pb-3 border-b-2 whitespace-nowrap transition ${
            activeTab === "vehicles"
              ? "border-emerald-600 text-emerald-700"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Armada Kendaraan ({vehicles.length})
        </button>
        <button
          onClick={() => setActiveTab("hotels")}
          className={`pb-3 border-b-2 whitespace-nowrap transition ${
            activeTab === "hotels"
              ? "border-emerald-600 text-emerald-700"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Pilihan Hotel ({hotels.length})
        </button>
        <button
          onClick={() => setActiveTab("destinations")}
          className={`pb-3 border-b-2 whitespace-nowrap transition ${
            activeTab === "destinations"
              ? "border-emerald-600 text-emerald-700"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Daftar Destinasi ({destinations.length})
        </button>
        <button
          onClick={() => setActiveTab("pricing")}
          className={`pb-3 border-b-2 whitespace-nowrap transition ${
            activeTab === "pricing"
              ? "border-emerald-600 text-emerald-700"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Konfigurasi Margin & Guide
        </button>
      </div>

      {/* Tab 1: Bookings List */}
      {activeTab === "bookings" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Pesanan Masuk (Midtrans & Custom Trip)
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                <tr>
                  <th className="p-3.5">ID / Midtrans</th>
                  <th className="p-3.5">Pemesan</th>
                  <th className="p-3.5">Rencana Perjalanan</th>
                  <th className="p-3.5">Total Biaya</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Tanggal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/50">
                    <td className="p-3.5 font-mono text-[11px] font-bold text-slate-900">
                      {b.midtransOrderId || b.id.substring(0, 8)}
                    </td>
                    <td className="p-3.5">
                      <div className="font-semibold text-slate-900">{b.customerName || b.user?.name}</div>
                      <div className="text-[11px] text-slate-400">{b.customerEmail || b.user?.email}</div>
                    </td>
                    <td className="p-3.5">
                      <div className="font-medium text-slate-800">{b.trip?.title}</div>
                      <div className="text-[11px] text-slate-400">
                        {b.trip?.numPax} Pax • {b.trip?.vehicleType?.name}
                      </div>
                    </td>
                    <td className="p-3.5 font-bold text-slate-900">
                      {formatIDR(b.totalAmount)}
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          b.status === "confirmed" || b.status === "paid"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-400">
                      {new Date(b.createdAt).toLocaleDateString("id-ID")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Vehicles Management */}
      {activeTab === "vehicles" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Katalog Armada Kendaraan Wisata</h3>
              <p className="text-xs text-slate-500">
                Informasi foto, review ulasan, kapasitas, tarif per km, dan titik lokasi garasi Google Maps.
              </p>
            </div>
            <button
              onClick={() => setShowAddVehicleModal(true)}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-sm shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Armada Baru</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {vehicles.map((v) => (
              <div
                key={v.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between hover:border-slate-300 transition"
              >
                <div>
                  {/* Photo with Overlay */}
                  <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                    {v.imageUrl ? (
                      <img
                        src={v.imageUrl}
                        alt={v.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <Car className="w-10 h-10 stroke-[1.5]" />
                      </div>
                    )}
                    <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg text-xs font-bold text-slate-800 flex items-center gap-1 shadow-sm">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <span>{v.rating || 4.9}</span>
                      <span className="text-[10px] text-slate-500 font-normal">({v.reviewCount || 85} ulasan)</span>
                    </span>
                    <span className="absolute top-3 right-3 bg-emerald-600 text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                      {v.capacityMin} - {v.capacityMax} Pax
                    </span>
                  </div>

                  <div className="p-4 space-y-2">
                    <div className="flex items-start justify-between">
                      <h4 className="font-bold text-sm text-slate-900">{v.name}</h4>
                      <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        {formatIDR(v.ratePerKm)}/km
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {v.description || "Kendaraan prima dengan fasilitas AC, driver profesional, BBM & tol."}
                    </p>

                    {v.googleMapsUrl && (
                      <a
                        href={v.googleMapsUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-700 hover:underline pt-1"
                      >
                        <MapPin className="w-3.5 h-3.5 text-blue-500" />
                        <span>Titik Pool/Garasi (Google Maps)</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>

                <div className="p-4 pt-0 border-t border-slate-100 flex items-center justify-between mt-2">
                  <div className="flex items-center gap-1.5">
                    {v.isActive ? (
                      <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Aktif di Builder</span>
                      </span>
                    ) : (
                      <span className="text-[11px] font-semibold text-slate-400">Nonaktif</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setEditingVehicle({ ...v })}
                      className="px-2.5 py-1 rounded-lg text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition flex items-center gap-1 text-xs font-bold"
                      title="Edit Armada & Tarif / Km"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteVehicle(v.id)}
                      className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition"
                      title="Hapus Armada"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Hotels Management */}
      {activeTab === "hotels" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Katalog Pilihan Hotel & Akomodasi</h3>
              <p className="text-xs text-slate-500">
                Pilihan penginapan budget, standard, hingga resort luxury lengkap dengan foto, ulasan Google & tarif per malam.
              </p>
            </div>
            <button
              onClick={() => {
                setSyncFeedback(null);
                setShowAddHotelModal(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-sm shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Hotel Baru</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {hotels.map((h) => (
              <div
                key={h.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between hover:border-slate-300 transition"
              >
                <div>
                  <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                    {h.imageUrl ? (
                      <img
                        src={h.imageUrl}
                        alt={h.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <HotelIcon className="w-10 h-10 stroke-[1.5]" />
                      </div>
                    )}
                    <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg text-xs font-bold text-slate-800 flex items-center gap-1 shadow-sm">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <span>{h.rating || 4.8}</span>
                      <span className="text-[10px] text-slate-500 font-normal">({h.reviewCount || 95} ulasan)</span>
                    </span>
                    <span className="absolute top-3 right-3 bg-teal-600 text-white px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                      {h.hotelClass}
                    </span>
                  </div>

                  <div className="p-4 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-sm text-slate-900">{h.name}</h4>
                        <div className="text-[11px] text-slate-400">{h.region} • Kapasitas {h.paxPerRoom} Orang/Kamar</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-extrabold text-teal-700">
                          {formatIDR(h.pricePerRoomPerNight)}
                        </div>
                        <div className="text-[10px] text-slate-400">/kamar/malam</div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {h.description || "Akomodasi nyaman dan strategis untuk istirahat optimal selama liburan."}
                    </p>

                    <div className="flex items-center justify-between pt-1">
                      {h.lat && h.lng ? (
                        <span className="text-[10px] font-mono text-slate-400">
                          📍 {h.lat.toFixed(4)}, {h.lng.toFixed(4)}
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400 italic">Koordinat default</span>
                      )}
                      {h.googleMapsUrl && (
                        <a
                          href={h.googleMapsUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                        >
                          <MapPin className="w-3.5 h-3.5 text-blue-500" />
                          <span>Google Maps</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0 border-t border-slate-100 flex items-center justify-between mt-2">
                  <div className="flex items-center gap-1.5">
                    {h.isActive ? (
                      <span className="text-[11px] font-semibold text-teal-600 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Tersedia di Trip</span>
                      </span>
                    ) : (
                      <span className="text-[11px] font-semibold text-slate-400">Nonaktif</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setSyncFeedback(null);
                        setEditingHotel({ ...h });
                      }}
                      className="px-2.5 py-1 rounded-lg text-teal-700 bg-teal-50 hover:bg-teal-100 transition flex items-center gap-1 text-xs font-bold"
                      title="Edit Hotel & Tarif per Malam"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteHotel(h.id)}
                      className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition"
                      title="Hapus Hotel"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Destinations Management */}
      {activeTab === "destinations" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Katalog Objek Wisata & Destinasi Jawa Timur</h3>
              <p className="text-xs text-slate-500">
                Data destinasi lengkap dengan koordinat latitude & longitude, tiket masuk, review Google Maps, dan navigasi.
              </p>
            </div>
            <button
              onClick={() => {
                setSyncFeedback(null);
                setShowAddDestModal(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-sm shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Destinasi Baru</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {destinations.map((d) => (
              <div
                key={d.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between hover:border-slate-300 transition"
              >
                <div>
                  <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                    {d.imageUrl ? (
                      <img
                        src={d.imageUrl}
                        alt={d.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <MapPin className="w-10 h-10 stroke-[1.5]" />
                      </div>
                    )}
                    <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg text-xs font-bold text-slate-800 flex items-center gap-1 shadow-sm">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <span>{d.rating || 4.9}</span>
                      <span className="text-[10px] text-slate-500 font-normal">({d.reviewCount || 120} ulasan)</span>
                    </span>
                    <span className="absolute top-3 right-3 bg-indigo-600 text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                      {d.category}
                    </span>
                  </div>

                  <div className="p-4 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-sm text-slate-900">{d.name}</h4>
                        <div className="text-[11px] text-slate-400">{d.region}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-extrabold text-indigo-700">
                          {d.ticketPrice > 0 ? formatIDR(d.ticketPrice) : "Gratis / Transit"}
                        </div>
                        <div className="text-[10px] text-slate-400">per orang</div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {d.description || "Destinasi wisata unggulan Jawa Timur dengan keindahan alam mempesona."}
                    </p>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] font-mono text-slate-400">
                        📍 {d.lat?.toFixed(4)}, {d.lng?.toFixed(4)}
                      </span>
                      {d.googleMapsUrl && (
                        <a
                          href={d.googleMapsUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                        >
                          <span>Peta Google Maps</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0 border-t border-slate-100 flex items-center justify-between mt-2">
                  <div className="flex items-center gap-1.5">
                    {d.isActive ? (
                      <span className="text-[11px] font-semibold text-indigo-600 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Dapat Dipilih</span>
                      </span>
                    ) : (
                      <span className="text-[11px] font-semibold text-slate-400">Nonaktif</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setSyncFeedback(null);
                        setEditingDestination({ ...d });
                      }}
                      className="px-2.5 py-1 rounded-lg text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition flex items-center gap-1 text-xs font-bold"
                      title="Edit Destinasi & Tiket Masuk"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteDestination(d.id)}
                      className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition"
                      title="Hapus Destinasi"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Pricing & Margin Config */}
      {activeTab === "pricing" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6 max-w-2xl">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-900">
              Konfigurasi Margin Otomatis per Pax (PRD §7.3) & Tarif Guide
            </h3>
            <p className="text-xs text-slate-500">
              Nilai persentase markup operasional yang diterapkan secara otomatis oleh sistem kalkulasi.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Margin untuk Solo & Duo (1–2 Pax) — Default 12% (0.12)
              </label>
              <input
                type="number"
                step="0.01"
                value={margin12}
                onChange={(e) => setMargin12(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-mono font-bold text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none shadow-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Margin untuk Private Group (3–5 Pax) — Default 8% (0.08)
              </label>
              <input
                type="number"
                step="0.01"
                value={margin35}
                onChange={(e) => setMargin35(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-mono font-bold text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none shadow-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Margin untuk Rombongan Besar (6–12 Pax) — Default 5% (0.05)
              </label>
              <input
                type="number"
                step="0.01"
                value={margin612}
                onChange={(e) => setMargin612(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-mono font-bold text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none shadow-sm"
              />
            </div>

            <div className="pt-2 border-t border-slate-100">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tarif Pemandu Wisata / Guide (per Hari, per Grup) — Default Rp 500.000
              </label>
              <input
                type="number"
                step="50000"
                value={guideRate}
                onChange={(e) => setGuideRate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-mono font-bold text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none shadow-sm"
              />
            </div>

            <button
              onClick={handleSavePriceConfigs}
              disabled={savingConfig}
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center gap-2 transition disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{savingConfig ? "Menyimpan..." : "Simpan Perubahan Konfigurasi"}</span>
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* ADD VEHICLE MODAL */}
      {/* ======================================================== */}
      {showAddVehicleModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <Car className="w-5 h-5 text-emerald-600" />
                <span>Tambah Armada Baru</span>
              </h3>
              <button
                onClick={() => setShowAddVehicleModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateVehicle} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Jenis Armada *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Toyota Hiace Premio Luxury"
                  value={newVeh.name}
                  onChange={(e) => setNewVeh({ ...newVeh, name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Pax Min</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={newVeh.capacityMin}
                    onChange={(e) => setNewVeh({ ...newVeh, capacityMin: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Pax Max</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={newVeh.capacityMax}
                    onChange={(e) => setNewVeh({ ...newVeh, capacityMax: parseInt(e.target.value) || 5 })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tarif / Km (Rp) *</label>
                  <input
                    type="number"
                    required
                    step={500}
                    value={newVeh.ratePerKm}
                    onChange={(e) => setNewVeh({ ...newVeh, ratePerKm: parseFloat(e.target.value) || 5000 })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Rating Review (0 - 5.0)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={newVeh.rating}
                    onChange={(e) => setNewVeh({ ...newVeh, rating: parseFloat(e.target.value) || 4.9 })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Jumlah Ulasan / Review</label>
                  <input
                    type="number"
                    value={newVeh.reviewCount}
                    onChange={(e) => setNewVeh({ ...newVeh, reviewCount: parseInt(e.target.value) || 50 })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">URL Foto Armada *</label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={newVeh.imageUrl}
                  onChange={(e) => setNewVeh({ ...newVeh, imageUrl: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Link Titik Pool / Garasi (Google Maps)</label>
                <input
                  type="url"
                  placeholder="https://maps.google.com/?q=..."
                  value={newVeh.googleMapsUrl}
                  onChange={(e) => setNewVeh({ ...newVeh, googleMapsUrl: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Deskripsi Fasilitas</label>
                <textarea
                  rows={2}
                  placeholder="Fasilitas AC dingin, jok captain seat, audio bluetooth, reclining seats."
                  value={newVeh.description}
                  onChange={(e) => setNewVeh({ ...newVeh, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddVehicleModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20"
                >
                  {isSubmitting ? "Menyimpan..." : "Simpan Armada"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* EDIT VEHICLE MODAL (Edit Rate per KM, Capacities, etc.)  */}
      {/* ======================================================== */}
      {editingVehicle && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <Edit className="w-5 h-5 text-emerald-600" />
                <span>Edit Armada & Tarif per Km</span>
              </h3>
              <button
                onClick={() => setEditingVehicle(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateVehicle} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Jenis Armada *</label>
                <input
                  type="text"
                  required
                  value={editingVehicle.name || ""}
                  onChange={(e) => setEditingVehicle({ ...editingVehicle, name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200/80 rounded-2xl">
                <label className="block text-xs font-extrabold text-emerald-950 mb-1">
                  💰 Tarif per Kilometer (Rate / Km) *
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    required
                    step={250}
                    value={editingVehicle.ratePerKm ?? 5000}
                    onChange={(e) =>
                      setEditingVehicle({ ...editingVehicle, ratePerKm: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-emerald-300 bg-white text-emerald-900 font-mono font-extrabold text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none shadow-inner"
                  />
                  <div className="shrink-0 text-xs font-bold text-emerald-800">
                    {formatIDR(editingVehicle.ratePerKm || 0)} / km
                  </div>
                </div>
                <p className="text-[11px] text-emerald-800/80 mt-1">
                  Nilai tarif ini akan langsung dipakai oleh rumus kalkulator custom trip saat customer merencanakan rute.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Kapasitas Pax Min</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={editingVehicle.capacityMin || 1}
                    onChange={(e) =>
                      setEditingVehicle({ ...editingVehicle, capacityMin: parseInt(e.target.value) || 1 })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Kapasitas Pax Max</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={editingVehicle.capacityMax || 5}
                    onChange={(e) =>
                      setEditingVehicle({ ...editingVehicle, capacityMax: parseInt(e.target.value) || 5 })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Rating Review (0 - 5.0)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={editingVehicle.rating || 4.9}
                    onChange={(e) =>
                      setEditingVehicle({ ...editingVehicle, rating: parseFloat(e.target.value) || 4.9 })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Jumlah Ulasan / Review</label>
                  <input
                    type="number"
                    value={editingVehicle.reviewCount || 50}
                    onChange={(e) =>
                      setEditingVehicle({ ...editingVehicle, reviewCount: parseInt(e.target.value) || 50 })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">URL Foto Armada *</label>
                <input
                  type="url"
                  required
                  value={editingVehicle.imageUrl || ""}
                  onChange={(e) => setEditingVehicle({ ...editingVehicle, imageUrl: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Link Pool/Garasi Google Maps</label>
                <input
                  type="url"
                  value={editingVehicle.googleMapsUrl || ""}
                  onChange={(e) => setEditingVehicle({ ...editingVehicle, googleMapsUrl: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Deskripsi Fasilitas</label>
                <textarea
                  rows={2}
                  value={editingVehicle.description || ""}
                  onChange={(e) => setEditingVehicle({ ...editingVehicle, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="vehIsActive"
                  checked={editingVehicle.isActive !== false}
                  onChange={(e) => setEditingVehicle({ ...editingVehicle, isActive: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                />
                <label htmlFor="vehIsActive" className="text-xs font-bold text-slate-800 cursor-pointer">
                  Aktif dan tampil dalam pilihan armada trip pelanggan
                </label>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingVehicle(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20"
                >
                  {isSubmitting ? "Menyimpan..." : "Simpan Perubahan Armada"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* ADD HOTEL MODAL (With Google Places Sync)                 */}
      {/* ======================================================== */}
      {showAddHotelModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <HotelIcon className="w-5 h-5 text-teal-600" />
                <span>Tambah Pilihan Hotel Baru</span>
              </h3>
              <button
                onClick={() => {
                  setShowAddHotelModal(false);
                  setSyncFeedback(null);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Google Places Review Sync Banner */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 rounded-2xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Star className="w-4 h-4 fill-amber-300 text-amber-300" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1">
                    <span>Google Reviews & Maps Sync</span>
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                      Live / Curated
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Auto-fetch rating bintang, jumlah ulasan & koordinat GPS asli Google Maps.
                  </div>
                </div>
              </div>
              <button
                type="button"
                disabled={isSyncingGoogle}
                onClick={() => handleSyncGoogle("newHotel")}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5 transition shrink-0"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncingGoogle ? "animate-spin" : ""}`} />
                <span>{isSyncingGoogle ? "Sinkron..." : "Tarik Data Google"}</span>
              </button>
            </div>

            {syncFeedback && (
              <div
                className={`p-2.5 rounded-xl text-xs font-medium ${
                  syncFeedback.type === "success"
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                    : "bg-rose-50 text-rose-800 border border-rose-200"
                }`}
              >
                {syncFeedback.text}
              </div>
            )}

            <form onSubmit={handleCreateHotel} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Hotel / Resor *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Plataran Bromo Resort & Spa"
                  value={newHotel.name}
                  onChange={(e) => setNewHotel({ ...newHotel, name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Wilayah / Kota *</label>
                  <select
                    value={newHotel.region}
                    onChange={(e) => setNewHotel({ ...newHotel, region: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  >
                    <option value="Bromo">Bromo / Probolinggo</option>
                    <option value="Banyuwangi">Banyuwangi / Ijen</option>
                    <option value="Malang">Malang / Kota Batu</option>
                    <option value="Surabaya">Surabaya City</option>
                    <option value="Lumajang">Lumajang (Tumpak Sewu)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Kelas Akomodasi *</label>
                  <select
                    value={newHotel.hotelClass}
                    onChange={(e) => setNewHotel({ ...newHotel, hotelClass: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  >
                    <option value="budget">Budget (Homestay Bersih)</option>
                    <option value="standard">Standard (Hotel Bintang 3-4)</option>
                    <option value="premium">Premium / Luxury Resort</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Harga / Kamar / Malam (Rp) *</label>
                  <input
                    type="number"
                    required
                    step={50000}
                    value={newHotel.pricePerRoomPerNight}
                    onChange={(e) => setNewHotel({ ...newHotel, pricePerRoomPerNight: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tamu per Kamar</label>
                  <input
                    type="number"
                    min={1}
                    value={newHotel.paxPerRoom}
                    onChange={(e) => setNewHotel({ ...newHotel, paxPerRoom: parseInt(e.target.value) || 2 })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Rating Review (0 - 5.0)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={newHotel.rating}
                    onChange={(e) => setNewHotel({ ...newHotel, rating: parseFloat(e.target.value) || 4.8 })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Jumlah Ulasan / Review</label>
                  <input
                    type="number"
                    value={newHotel.reviewCount}
                    onChange={(e) => setNewHotel({ ...newHotel, reviewCount: parseInt(e.target.value) || 80 })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">URL Foto Hotel *</label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={newHotel.imageUrl}
                  onChange={(e) => setNewHotel({ ...newHotel, imageUrl: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Link Lokasi Google Maps Hotel</label>
                <input
                  type="url"
                  placeholder="https://maps.google.com/?q=..."
                  value={newHotel.googleMapsUrl}
                  onChange={(e) => setNewHotel({ ...newHotel, googleMapsUrl: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">GPS Latitude (Lintang)</label>
                  <input
                    type="number"
                    step="0.0001"
                    placeholder="-7.9250"
                    value={newHotel.lat}
                    onChange={(e) => setNewHotel({ ...newHotel, lat: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">GPS Longitude (Bujur)</label>
                  <input
                    type="number"
                    step="0.0001"
                    placeholder="112.9972"
                    value={newHotel.lng}
                    onChange={(e) => setNewHotel({ ...newHotel, lng: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Deskripsi Hotel & Fasilitas</label>
                <textarea
                  rows={2}
                  placeholder="View pegunungan spektakuler, air hangat, sarapan prasmanan lezat."
                  value={newHotel.description}
                  onChange={(e) => setNewHotel({ ...newHotel, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddHotelModal(false);
                    setSyncFeedback(null);
                  }}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-md shadow-teal-600/20"
                >
                  {isSubmitting ? "Menyimpan..." : "Simpan Hotel"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* EDIT HOTEL MODAL (Edit Price/Night, GPS, Google Review)   */}
      {/* ======================================================== */}
      {editingHotel && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <Edit className="w-5 h-5 text-teal-600" />
                <span>Edit Hotel & Tarif per Malam</span>
              </h3>
              <button
                onClick={() => {
                  setEditingHotel(null);
                  setSyncFeedback(null);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Google Places Review Sync Banner */}
            <div className="bg-gradient-to-r from-blue-50 to-teal-50 border border-blue-200/80 rounded-2xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Star className="w-4 h-4 fill-amber-300 text-amber-300" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1">
                    <span>Google Reviews & Maps Sync</span>
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                      Live / Curated
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Tarik rating bintang, jumlah ulasan & koordinat GPS asli Google Maps.
                  </div>
                </div>
              </div>
              <button
                type="button"
                disabled={isSyncingGoogle}
                onClick={() => handleSyncGoogle("editHotel")}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5 transition shrink-0"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncingGoogle ? "animate-spin" : ""}`} />
                <span>{isSyncingGoogle ? "Sinkron..." : "Tarik Data Google"}</span>
              </button>
            </div>

            {syncFeedback && (
              <div
                className={`p-2.5 rounded-xl text-xs font-medium ${
                  syncFeedback.type === "success"
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                    : "bg-rose-50 text-rose-800 border border-rose-200"
                }`}
              >
                {syncFeedback.text}
              </div>
            )}

            <form onSubmit={handleUpdateHotel} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Hotel / Resor *</label>
                <input
                  type="text"
                  required
                  value={editingHotel.name || ""}
                  onChange={(e) => setEditingHotel({ ...editingHotel, name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              {/* Price Per Room Per Night */}
              <div className="p-3 bg-teal-50 border border-teal-200/80 rounded-2xl">
                <label className="block text-xs font-extrabold text-teal-950 mb-1">
                  🏨 Biaya Hotel per Malam (per Kamar) *
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    required
                    step={25000}
                    value={editingHotel.pricePerRoomPerNight ?? 500000}
                    onChange={(e) =>
                      setEditingHotel({
                        ...editingHotel,
                        pricePerRoomPerNight: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-teal-300 bg-white text-teal-900 font-mono font-extrabold text-sm focus:ring-2 focus:ring-teal-600 focus:outline-none shadow-inner"
                  />
                  <div className="shrink-0 text-xs font-bold text-teal-800">
                    {formatIDR(editingHotel.pricePerRoomPerNight || 0)} / mlm
                  </div>
                </div>
                <p className="text-[11px] text-teal-800/80 mt-1">
                  Digunakan otomatis saat perhitungan hotel pada durasi malam menginap di Custom Trip.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Wilayah / Kota *</label>
                  <select
                    value={editingHotel.region || "Bromo"}
                    onChange={(e) => setEditingHotel({ ...editingHotel, region: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  >
                    <option value="Bromo">Bromo / Probolinggo</option>
                    <option value="Banyuwangi">Banyuwangi / Ijen</option>
                    <option value="Malang">Malang / Kota Batu</option>
                    <option value="Surabaya">Surabaya City</option>
                    <option value="Lumajang">Lumajang (Tumpak Sewu)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Kelas Akomodasi *</label>
                  <select
                    value={editingHotel.hotelClass || "standard"}
                    onChange={(e) => setEditingHotel({ ...editingHotel, hotelClass: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  >
                    <option value="budget">Budget (Homestay Bersih)</option>
                    <option value="standard">Standard (Hotel Bintang 3-4)</option>
                    <option value="premium">Premium / Luxury Resort</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tamu per Kamar (Pax)</label>
                  <input
                    type="number"
                    min={1}
                    value={editingHotel.paxPerRoom || 2}
                    onChange={(e) =>
                      setEditingHotel({ ...editingHotel, paxPerRoom: parseInt(e.target.value) || 2 })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Rating Review (0 - 5.0)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={editingHotel.rating || 4.8}
                    onChange={(e) =>
                      setEditingHotel({ ...editingHotel, rating: parseFloat(e.target.value) || 4.8 })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Jumlah Ulasan / Review</label>
                  <input
                    type="number"
                    value={editingHotel.reviewCount || 80}
                    onChange={(e) =>
                      setEditingHotel({ ...editingHotel, reviewCount: parseInt(e.target.value) || 80 })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">URL Foto Hotel</label>
                  <input
                    type="url"
                    value={editingHotel.imageUrl || ""}
                    onChange={(e) => setEditingHotel({ ...editingHotel, imageUrl: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Link Google Maps Hotel</label>
                <input
                  type="url"
                  value={editingHotel.googleMapsUrl || ""}
                  onChange={(e) => setEditingHotel({ ...editingHotel, googleMapsUrl: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">GPS Latitude (Lintang)</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={editingHotel.lat ?? ""}
                    onChange={(e) =>
                      setEditingHotel({ ...editingHotel, lat: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold text-xs font-mono focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">GPS Longitude (Bujur)</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={editingHotel.lng ?? ""}
                    onChange={(e) =>
                      setEditingHotel({ ...editingHotel, lng: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold text-xs font-mono focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Deskripsi Hotel & Fasilitas</label>
                <textarea
                  rows={2}
                  value={editingHotel.description || ""}
                  onChange={(e) => setEditingHotel({ ...editingHotel, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="hotelIsActive"
                  checked={editingHotel.isActive !== false}
                  onChange={(e) => setEditingHotel({ ...editingHotel, isActive: e.target.checked })}
                  className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
                />
                <label htmlFor="hotelIsActive" className="text-xs font-bold text-slate-800 cursor-pointer">
                  Tersedia untuk dipilih pelanggan di Custom Trip Builder
                </label>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditingHotel(null);
                    setSyncFeedback(null);
                  }}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-md shadow-teal-600/20"
                >
                  {isSubmitting ? "Menyimpan..." : "Simpan Perubahan Hotel"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* ADD DESTINATION MODAL (With Google Places Sync)           */}
      {/* ======================================================== */}
      {showAddDestModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-indigo-600" />
                <span>Tambah Destinasi Baru</span>
              </h3>
              <button
                onClick={() => {
                  setShowAddDestModal(false);
                  setSyncFeedback(null);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Google Places Review Sync Banner */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 rounded-2xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Star className="w-4 h-4 fill-amber-300 text-amber-300" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1">
                    <span>Google Reviews & Maps Sync</span>
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                      Live / Curated
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Auto-fetch rating bintang, jumlah ulasan & koordinat GPS asli Google Maps.
                  </div>
                </div>
              </div>
              <button
                type="button"
                disabled={isSyncingGoogle}
                onClick={() => handleSyncGoogle("newDest")}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5 transition shrink-0"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncingGoogle ? "animate-spin" : ""}`} />
                <span>{isSyncingGoogle ? "Sinkron..." : "Tarik Data Google"}</span>
              </button>
            </div>

            {syncFeedback && (
              <div
                className={`p-2.5 rounded-xl text-xs font-medium ${
                  syncFeedback.type === "success"
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                    : "bg-rose-50 text-rose-800 border border-rose-200"
                }`}
              >
                {syncFeedback.text}
              </div>
            )}

            <form onSubmit={handleCreateDestination} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Destinasi Wisata *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Kawah Wurung Bondowoso"
                  value={newDest.name}
                  onChange={(e) => setNewDest({ ...newDest, name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Wilayah / Daerah *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Bondowoso / Ijen"
                    value={newDest.region}
                    onChange={(e) => setNewDest({ ...newDest, region: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Kategori Wisata *</label>
                  <select
                    value={newDest.category}
                    onChange={(e) => setNewDest({ ...newDest, category: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="mountain">Mountain / Sunrise Peak</option>
                    <option value="crater">Volcano / Crater</option>
                    <option value="waterfall">Waterfall</option>
                    <option value="beach">Beach / Coast</option>
                    <option value="city">City / Theme Park</option>
                    <option value="park">National Park</option>
                    <option value="transit">Transit / Station / Airport</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Latitude *</label>
                  <input
                    type="number"
                    step="0.0001"
                    required
                    value={newDest.lat}
                    onChange={(e) => setNewDest({ ...newDest, lat: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold text-xs font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Longitude *</label>
                  <input
                    type="number"
                    step="0.0001"
                    required
                    value={newDest.lng}
                    onChange={(e) => setNewDest({ ...newDest, lng: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold text-xs font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tiket / Orang (Rp)</label>
                  <input
                    type="number"
                    step={5000}
                    value={newDest.ticketPrice}
                    onChange={(e) => setNewDest({ ...newDest, ticketPrice: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Rating Review (0 - 5.0)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={newDest.rating}
                    onChange={(e) => setNewDest({ ...newDest, rating: parseFloat(e.target.value) || 4.9 })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Jumlah Ulasan / Review</label>
                  <input
                    type="number"
                    value={newDest.reviewCount}
                    onChange={(e) => setNewDest({ ...newDest, reviewCount: parseInt(e.target.value) || 100 })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">URL Foto Destinasi *</label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={newDest.imageUrl}
                  onChange={(e) => setNewDest({ ...newDest, imageUrl: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Link Lokasi Google Maps</label>
                <input
                  type="url"
                  placeholder="https://maps.google.com/?q=..."
                  value={newDest.googleMapsUrl}
                  onChange={(e) => setNewDest({ ...newDest, googleMapsUrl: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Deskripsi Objek Wisata</label>
                <textarea
                  rows={2}
                  placeholder="Pemandangan perbukitan savana hijau mirip New Zealand, udara segar dan spot foto estetik."
                  value={newDest.description}
                  onChange={(e) => setNewDest({ ...newDest, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddDestModal(false);
                    setSyncFeedback(null);
                  }}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20"
                >
                  {isSubmitting ? "Menyimpan..." : "Simpan Destinasi"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* EDIT DESTINATION MODAL (Edit Ticket Price, GPS, Google)  */}
      {/* ======================================================== */}
      {editingDestination && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <Edit className="w-5 h-5 text-indigo-600" />
                <span>Edit Destinasi & Tiket Masuk</span>
              </h3>
              <button
                onClick={() => {
                  setEditingDestination(null);
                  setSyncFeedback(null);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Google Places Review Sync Banner */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 rounded-2xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Star className="w-4 h-4 fill-amber-300 text-amber-300" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1">
                    <span>Google Reviews & Maps Sync</span>
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                      Live / Curated
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Tarik rating bintang, total ulasan & koordinat GPS asli Google Maps.
                  </div>
                </div>
              </div>
              <button
                type="button"
                disabled={isSyncingGoogle}
                onClick={() => handleSyncGoogle("editDest")}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5 transition shrink-0"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncingGoogle ? "animate-spin" : ""}`} />
                <span>{isSyncingGoogle ? "Sinkron..." : "Tarik Data Google"}</span>
              </button>
            </div>

            {syncFeedback && (
              <div
                className={`p-2.5 rounded-xl text-xs font-medium ${
                  syncFeedback.type === "success"
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                    : "bg-rose-50 text-rose-800 border border-rose-200"
                }`}
              >
                {syncFeedback.text}
              </div>
            )}

            <form onSubmit={handleUpdateDestination} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Destinasi Wisata *</label>
                <input
                  type="text"
                  required
                  value={editingDestination.name || ""}
                  onChange={(e) => setEditingDestination({ ...editingDestination, name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              {/* Ticket Price Box */}
              <div className="p-3 bg-indigo-50 border border-indigo-200/80 rounded-2xl">
                <label className="block text-xs font-extrabold text-indigo-950 mb-1">
                  🎟️ Harga Tiket Masuk per Orang (Rp) *
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    required
                    step={5000}
                    value={editingDestination.ticketPrice ?? 0}
                    onChange={(e) =>
                      setEditingDestination({
                        ...editingDestination,
                        ticketPrice: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-indigo-300 bg-white text-indigo-900 font-mono font-extrabold text-sm focus:ring-2 focus:ring-indigo-600 focus:outline-none shadow-inner"
                  />
                  <div className="shrink-0 text-xs font-bold text-indigo-800">
                    {editingDestination.ticketPrice > 0
                      ? `${formatIDR(editingDestination.ticketPrice)} / org`
                      : "Gratis / Transit"}
                  </div>
                </div>
                <p className="text-[11px] text-indigo-800/80 mt-1">
                  Dikalikan dengan jumlah peserta (Pax) secara otomatis oleh kalkulator biaya trip.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Wilayah / Daerah *</label>
                  <input
                    type="text"
                    required
                    value={editingDestination.region || ""}
                    onChange={(e) => setEditingDestination({ ...editingDestination, region: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Kategori Wisata *</label>
                  <select
                    value={editingDestination.category || "mountain"}
                    onChange={(e) => setEditingDestination({ ...editingDestination, category: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="mountain">Mountain / Sunrise Peak</option>
                    <option value="crater">Volcano / Crater</option>
                    <option value="waterfall">Waterfall</option>
                    <option value="beach">Beach / Coast</option>
                    <option value="city">City / Theme Park</option>
                    <option value="park">National Park</option>
                    <option value="transit">Transit / Station / Airport</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Latitude (Lintang) *</label>
                  <input
                    type="number"
                    step="0.0001"
                    required
                    value={editingDestination.lat ?? ""}
                    onChange={(e) =>
                      setEditingDestination({ ...editingDestination, lat: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold text-xs font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Longitude (Bujur) *</label>
                  <input
                    type="number"
                    step="0.0001"
                    required
                    value={editingDestination.lng ?? ""}
                    onChange={(e) =>
                      setEditingDestination({ ...editingDestination, lng: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold text-xs font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Rating Review (0 - 5.0)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={editingDestination.rating || 4.9}
                    onChange={(e) =>
                      setEditingDestination({
                        ...editingDestination,
                        rating: parseFloat(e.target.value) || 4.9,
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Jumlah Ulasan / Review</label>
                  <input
                    type="number"
                    value={editingDestination.reviewCount || 100}
                    onChange={(e) =>
                      setEditingDestination({
                        ...editingDestination,
                        reviewCount: parseInt(e.target.value) || 100,
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">URL Foto Destinasi</label>
                <input
                  type="url"
                  value={editingDestination.imageUrl || ""}
                  onChange={(e) => setEditingDestination({ ...editingDestination, imageUrl: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Link Lokasi Google Maps</label>
                <input
                  type="url"
                  value={editingDestination.googleMapsUrl || ""}
                  onChange={(e) =>
                    setEditingDestination({ ...editingDestination, googleMapsUrl: e.target.value })
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Deskripsi Objek Wisata</label>
                <textarea
                  rows={2}
                  value={editingDestination.description || ""}
                  onChange={(e) =>
                    setEditingDestination({ ...editingDestination, description: e.target.value })
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="destIsActive"
                  checked={editingDestination.isActive !== false}
                  onChange={(e) =>
                    setEditingDestination({ ...editingDestination, isActive: e.target.checked })
                  }
                  className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                />
                <label htmlFor="destIsActive" className="text-xs font-bold text-slate-800 cursor-pointer">
                  Tersedia untuk dimasukkan dalam agenda rute destinasi pelanggan
                </label>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditingDestination(null);
                    setSyncFeedback(null);
                  }}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20"
                >
                  {isSubmitting ? "Menyimpan..." : "Simpan Perubahan Destinasi"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
