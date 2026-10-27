# Itinerary ID — East Java Custom Tour & Travel Platform

Aplikasi web tour & travel modern yang memungkinkan pelanggan menyusun rencana liburan custom di Jawa Timur (Bromo, Ijen, Tumpak Sewu, Madakaripura, Baluran, Batu Malang) dengan **kalkulasi estimasi biaya transparan real-time**, pembayaran online 100% lunas via **Midtrans**, dan portal operasional internal untuk **Admin**, **CS**, **Tour Guide/Driver**, dan **Finance**.

---

## 🚀 Memulai Pengembangan Lokal

### 1. Masuk ke Folder Proyek
```bash
cd "i:\ITINERARY ID\itinerary-id"
```

### 2. Jalankan Server Development
```bash
pnpm dev
```
Buka browser di: **`http://localhost:3000`**

---

## 👥 Akun Uji Coba (5 Role Siap Pakai)

Sistem telah dilengkapi dengan *Quick Switcher* di navbar atas atau form login di `/login`:

| Role | Email | Password | Akses Utama |
|---|---|---|---|
| **Admin** | `admin@itinerary.id` | `admin123` | `/admin` — Master Armada, POI, Tarif/km, Margin Config, Assign Guide |
| **CS (Customer Support)** | `cs@itinerary.id` | `cs123456` | `/cs` — Inbox Inquiry publik, Follow-up, Convert to Trip |
| **Tour Guide / Driver** | `guide@itinerary.id` | `guide123` | `/guide` — Mobile PWA view, Jadwal per hari, WhatsApp tamu, Catat Expense |
| **Finance** | `finance@itinerary.id` | `finance123` | `/finance` — Rekonsiliasi Midtrans, Approve Expense, Laporan Margin |
| **Customer (Wisatawan)** | `john@example.com` | `customer123` | `/plan` & `/checkout` — Custom Builder, Pesan & Bayar, Voucher |

---

## 🗺️ Peta Halaman & Rute Aplikasi

- **Beranda & Inquiry Form:** `http://localhost:3000/`
- **Custom Itinerary Builder:** `http://localhost:3000/plan`
  - Pilih tanggal & jumlah pax (1–12 orang)
  - Titik jemput (Surabaya Airport / Hotel / Stasiun) & Titik Antar (Pelabuhan Ketapang Bali)
  - Jadwal hari per hari dengan POI Jawa Timur
  - Pilih Armada (Avanza, Hiace, Alphard, Bus) & Kelas Hotel
  - Live Sticky Sidebar dengan transparansi biaya PRD §19
- **Review & Checkout Midtrans:** `http://localhost:3000/checkout`
- **Itinerary Voucher & Success:** `http://localhost:3000/booking/success`
- **Admin Master Panel:** `http://localhost:3000/admin`
- **CS Lead Pipeline:** `http://localhost:3000/cs`
- **Guide / Driver Field App:** `http://localhost:3000/guide`
- **Finance Reconciliation:** `http://localhost:3000/finance`

---

## ⚙️ Skema Database & Formula Harga

- **Database:** Supabase PostgreSQL (`db.hlrxktnnfyecueggeyoy.supabase.co`) tersambung melalui Prisma 6.4.1.
- **Formula Tarif (PRD §19):**
  $$\text{Transport} = \text{jarak\_km} \times \text{rate\_per\_km[kendaraan]}$$
  $$\text{Hotel} = \text{harga\_kamar} \times \text{malam} \times \lceil\text{pax} / 2\rceil$$
  $$\text{Tiket} = \sum \text{tiket\_POI} \times \text{pax}$$
  $$\text{Guide} = \text{Rp } 500.000 \times \text{hari}$$
  $$\text{Subtotal} = \text{Transport} + \text{Hotel} + \text{Tiket} + \text{Makan} + \text{Guide}$$
  $$\text{Margin} = \text{Subtotal} \times \begin{cases} 12\% & (1-2\text{ pax}) \\ 8\% & (3-5\text{ pax}) \\ 5\% & (6-12\text{ pax}) \end{cases}$$
  $$\text{Total} = \text{Subtotal} + \text{Margin}$$

- **Kebijakan Pembatalan (PRD §9.1):** 100% Full Refund jika diajukan $\ge 48$ jam sebelum jadwal penjemputan.
