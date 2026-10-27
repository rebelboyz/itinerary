# PRD — Itinerary ID

> **Versi:** v1.1 (implementation-ready — siap untuk AI coding E2E)
> **Status:** Siap untuk pengembangan MVP
> **Tanggal:** 2026-10-27

---

## 1. Ringkasan Produk

**Itinerary ID** adalah web app milik perusahaan tour & travel yang memungkinkan pelanggan menyusun rencana perjalanan wisata di Indonesia, lalu sistem menghitung estimasi biaya secara otomatis, dan pelanggan melakukan pembayaran untuk memesan.

Perusahaan menyediakan **seluruh kebutuhan** itinerary yang dipesan — akomodasi, transportasi, tiket, makan, guide/driver — termasuk **penjemputan di titik yang ditunjuk** dan pengantaran sesuai itinerary.

### 1.1 Pernyataan masalah
- Pelanggan (khususnya internasional) kesulitan menyusun itinerary Indonesia yang realistis beserta estimasi biayanya.
- Proses inquiry → penawaran → booking saat ini manual, lambat, dan rawan salah hitung biaya (bensin, tol, tiket, akomodasi) sehingga berisiko rugi.

### 1.2 Solusi
- Satu platform untuk **menyusun itinerary**, **menghitung biaya transparan**, **membayar**, dan **mengelola pesanan** dari sisi perusahaan.

---

## 2. Tujuan & Non-Tujuan (Scope MVP)

### 2.1 Tujuan MVP
1. Pelanggan bisa **menyusun itinerary custom** dan melihat **estimasi biaya real-time**.
2. Pelanggan bisa **membayar online 100% lunas** lewat Midtrans.
3. Perusahaan bisa **mengelola pesanan, kendaraan, harga/rate, dan lead** dari dashboard.
4. **Guide/Driver** bisa mengakses itinerary yang ditugaskan dan mencatat pengeluaran lapangan.
5. Cakupan geografis awal: **Jawa Timur** (base perusahaan).

### 2.2 Non-Tujuan (ditunda / di luar MVP)
- **Paket rute jadi** — dikembangkan sebagai konten setelah aplikasi jadi (bukan di-hardcode di MVP).
- **Open trip (join trip)** — masih dijalankan manual untuk pasar lokal; dikembangkan setelah siap pasar global.
- **Aplikasi mobile native** — MVP memakai web mobile-friendly/PWA.
- **CRM lengkap** — MVP cukup pipeline lead sederhana.
- Destinasi di luar Jawa Timur.

---

## 3. Target Pengguna & Persona

### 3.1 Customer (internasional & domestik)
- Fokus awal: **China dan negara Asia lainnya**, lalu **Eropa dan US**.
- Butuh: bahasa asing, tampilan mata uang sesuai negara, alur booking yang jelas.

### 3.2 Persona internal

| Role | Kebutuhan utama |
|------|-----------------|
| **Admin / Backoffice** | Kelola kendaraan, harga/rate, destinasi, hotel, aktivitas; lihat & konfirmasi pesanan; assign guide/driver. |
| **CS (Lead Pipeline)** | Menerima inquiry/lead, follow-up, mengubah lead menjadi booking/pelanggan. |
| **Tour Guide / Driver** | Akses itinerary yang ditugaskan, update status, catat pengeluaran lapangan. |
| **Finance** | Rekonsiliasi pembayaran, validasi pengeluaran lapangan, laporan margin. |

> Catatan: Finance di MVP **minim fitur software** — pekerjaan aktualnya dilakukan tim di lapangan. Sistem cukup menampung pencatatan & approval pengeluaran.

---

## 4. Model Produk: Custom Itinerary (Hybrid)

Aplikasi utama = **penyusun itinerary custom**. Ke depan tersedia **katalog paket jadi** yang bisa dipilih langsung atau dijadikan titik awal untuk dimodifikasi.

**Prioritas MVP: custom itinerary dulu.** Paket rute adalah **konten yang ditambahkan admin setelah aplikasi jadi** — bukan di-hardcode di MVP. Arsitektur tetap mendukung keduanya (hybrid).

### 4.1 Tipe trip

| Tipe | Keterangan | MVP |
|------|-----------|-----|
| Solo | 1 orang | ✅ |
| Duo | 2 orang | ✅ |
| Private | Rombongan tertutup / privat | ✅ |
| Group (tertutup) | Rombongan sendiri (keluarga/teman) | ✅ |
| Group (open trip) | Join trip, jadwal & kuota tetap | Ditunda |

### 4.2 Katalog & rute referensi (katalog lama + price list baru)

| Katalog lama (Bromo Starlight, RMB) | Paket price list baru (IDR) | Status |
|---|---|---|
| Bromo–Ijen 3D2N | Bromo–Ijen 3D2N (#4) | Terpetakan |
| Bromo–Tumpak Sewu 3D2N | Tumpak Sewu–Bromo 3D2N (#2) | Terpetakan |
| Bromo–Sewu–Ijen 4D3N (+Magical Forest) | Bromo–Sewu–Ijen 4D3N (#5) | Mirip; Magical Forest tidak disebut |
| Bromo–Sewu–Ijen–Lovina 5D4N | — (belum ada) | Ditunda (konten admin) |
| — | Bromo Sunrise 1D (#1) | Baru |
| — | Tumpak Sewu–Ijen 3D2N (#3) | Baru |

Perbedaan utama lama → baru:
- Lama: **2–5 pax saja**, RMB, kontak **WeChat**, pembayaran **manual (DP + 2 tahap)**.
- Baru: **1–12 pax** (solo didukung), **IDR + multi-mata uang**, pembayaran **online Midtrans**.

### 4.3 Cakupan layanan (Termasuk / Tidak termasuk)

**Termasuk:**
- Transportasi darat (bensin, parkir, tol)
- Akomodasi hotel + sarapan
- Tiket masuk wisata + pemandu (guide)
- Perlengkapan Ijen (surat kesehatan, masker gas, headlamp, tongkat)
- Penyeberangan ferry / tiket kapal antar pulau

**Tidak termasuk:**
- Tiket pesawat PP & visa
- Makan siang & makan malam
- Jasa tandu / berkuda

---

## 5. Alur Utama (User Flow)

### 5.1 Alur pelanggan menyusun & memesan
1. **Mulai itinerary custom**: pilih destinasi/titik, tanggal, durasi, tipe trip, jumlah orang.
2. Pilih **jenis kendaraan** (Avanza, Hiace, Lexus, dst).
3. Pilih kebutuhan: kelas hotel, aktivitas/tiket, paket makan (opsional).
4. Sistem menampilkan **rincian & total biaya real-time**.
5. Review → isi data → **checkout**.
6. **Pembayaran 100% lunas** via Midtrans (kartu internasional, e-wallet, transfer/VA).
7. Status booking terkonfirmasi → pelanggan menerima **itinerary document** & detail penjemputan.
8. Perusahaan mengeksekusi booking (booking hotel, transportasi, tiket, dll).

### 5.2 Alur lead → pelanggan (CS)
1. Visitor mengirim **inquiry** (form kontak / permintaan trip).
2. Lead masuk ke **inbox CS** dengan status.
3. CS follow-up; jika deal → buat booking → jadi pelanggan.

### 5.3 Alur eksekusi (Guide/Driver)
1. Guide/Driver melihat **itinerary yang ditugaskan** per hari.
2. Eksekusi: jemput di titik, kunjungi destinasi, antar sesuai rencana.
3. Update status (menuju lokasi, tiba, selesai).
4. Catat **pengeluaran lapangan** (bensin, tol, tiket, makan) → ke Finance untuk validasi.

---

## 6. Fitur per Role

### 6.1 Pelanggan
- Itinerary builder (tambah/hapus/urutkan titik & aktivitas per hari).
- Pilih jenis kendaraan, kelas hotel, aktivitas, paket makan.
- Kalkulasi biaya real-time + rincian transparan.
- Booking & pembayaran 100% lunas (Midtrans).
- Riwayat pesanan & dokumen itinerary.

### 6.2 Admin / Backoffice
- Kelola **destinasi/POI**, **jenis kendaraan & rate per km**, **hotel**, **aktivitas/tiket**, **paket makan**.
- Set **margin per pax** (12% / 8% / 5%) dan **tarif guide per hari**.
- Lihat & **konfirmasi/assign** pesanan ke guide/driver.
- Kelola pengguna internal (role & akses).
- (Fase berikutnya) kelola **paket rute jadi**.

### 6.3 CS
- **Inbox lead** (form inquiry masuk).
- Ubah status lead, catat follow-up.
- Konversi lead → booking/pelanggan.

### 6.4 Guide/Driver
- Daftar **tugas/itinerary** yang ditugaskan.
- Detail per hari: titik jemput, destinasi, jam, kontak pelanggan.
- Update status & **catat pengeluaran lapangan**.

### 6.5 Finance
- Lihat **pembayaran masuk** & status (rekonsiliasi Midtrans).
- **Approve pengeluaran lapangan** (bensin, tol, tiket, akomodasi).
- **Laporan sederhana** per pesanan: pendapatan vs biaya aktual (margin).

---

## 7. Model Kalkulasi Biaya

### 7.1 Prinsip
Menggunakan **rate per km** (konsep "rate per mile" yang dibahas; dalam praktik Indonesia satuannya km, seperti Grab/Gojek tapi lebih sederhana). Rate adalah **standar global per jenis kendaraan**, bukan per trip.

### 7.2 Rumus dasar

```
transport_group = jarak_rute × rate_per_km[jenis_kendaraan]
per_orang       = tiket + (hotel/malam × malam) + makan_opsional
subtotal        = transport_group + per_orang × pax + guide(per hari × hari)
total           = subtotal × (1 + margin[pax])
harga_per_orang = total / pax
```

| Komponen | Formula | Catatan |
|----------|---------|---------|
| **Transport** | jarak_rute × rate_per_km[kendaraan] | Per grup/kendaraan; jenis kendaraan **dipilih pelanggan**; bensin & tol sudah termasuk. |
| **Akomodasi** | harga_hotel[kelas] × malam × kamar | Jumlah kamar menyesuaikan jumlah orang. |
| **Aktivitas** | Σ (harga_tiket × jumlah_orang) | Tiket masuk destinasi/aktivitas. |
| **Makan** | harga_makan × jumlah_orang × jumlah_makan | Sarapan sudah termasuk hotel; makan siang & malam tidak termasuk (bisa add-on). |
| **Guide/Driver** | tarif_per_hari × hari | Per grup. |
| **Markup** | % dari subtotal | Margin otomatis per jumlah pax: **1–2 = 12%, 3–5 = 8%, 6–12 = 5%**. |
| **Pesawat/Ferry antar pulau** | tarif per segmen | Estimasi; relevan saat cakupan keluar Jawa Timur. |

### 7.3 Aturan yang sudah dikonfirmasi
- **Transportasi dihitung PER GROUP (per kendaraan), bukan per individu.** Rate per km dikalikan total jarak rute → biaya kendaraan untuk seluruh rombongan; untuk harga per orang, dibagi jumlah pax.
- **Rate per km adalah standar global per jenis kendaraan** (bukan per trip). Selisih biaya antar rute muncul dari perbedaan **jarak**, bukan rate yang berbeda-beda.
- **Jenis kendaraan dipilih pelanggan** (seperti pilih kelas Grab/Gojek). Sistem **merekomendasikan** kendaraan sesuai jumlah pax (1–5 → Avanza/Innova, 6–10 → Hiace, 11–12 → 2 kendaraan/bus), tapi pelanggan bebas mengganti.
- **Margin otomatis per pax**: 1–2 = 12%, 3–5 = 8%, 6–12 = 5%.
- **Solo (1 pax) menanggung seluruh biaya kendaraan** — sejalan dengan keputusan "1 orang pun tetap dilayani".

### 7.4 Estimasi default rate per km (PLACEHOLDER)

Nilai di bawah adalah **patokan awal** (estimasi umum seperti tarif Grab/Gojek); admin bisa mengubahnya di panel konfigurasi. Angka aktual akan dihitung perusahaan belakangan.

| Kendaraan | Default rate (Rp/km) | Kapasitas |
|---|---|---|
| Avanza / Innova | 5.000 | 1–5 pax |
| Hiace | 9.000 | 6–10 pax |
| Alphard / Lexus | 15.000 | 1–5 pax (premium) |
| Bus medium | 18.000 | 11–20 pax |

> Rate sudah mencakup: kendaraan + sopir + bensin + tol. Pemandu (guide) adalah komponen terpisah per hari.

### 7.5 Referensi kalibrasi (hasil analisis price list)

Segmen Hiace, margin 5%, n=6–10:

| Paket | Biaya per orang (V) | Fixed transport+guide (F) |
|-------|--------------------:|--------------------------:|
| Bromo Sunrise 1D | ±250 rb | ±2,6 jt |
| Tumpak Sewu–Bromo 3D2N | ±912 rb | ±4,7 jt |
| Tumpak Sewu–Ijen 3D2N | ±880 rb | ±3,5 jt |
| Bromo–Ijen 3D2N | ±967 rb | ±4,6 jt |
| Bromo–Sewu–Ijen 4D3N | ±1,38 jt | ±5,7 jt |

> Dengan rate global berlaku `F = guide + jarak × rate_per_km`. Angka F berbeda karena jarak rute berbeda.

---

## 8. Bahasa & Lokalisasi

- **Bahasa default: English (EN).**
- Sistem mendeteksi negara akses dan **otomatis mengganti bahasa** sesuai negara yang dilayani (China → Mandarin, negara Asia lain → bahasa masing-masing, lalu Eropa/US).
- **Tampilan mata uang** mengikuti negara (USD, CNY, EUR), namun **transaksi tetap IDR** via Midtrans.

> Konfigurasi tersisa: daftar bahasa & negara yang didukung di MVP (disarankan mulai EN + Mandarin).

---

## 9. Pembayaran (Midtrans)

- Gateway: **Midtrans**.
- Metode: **kartu kredit/debit internasional** (Visa, Mastercard, JCB, Amex) + domestik (e-wallet, transfer bank, VA).
- Data kartu **tidak disimpan** di aplikasi (ditangani Midtrans) — kepatuhan PCI.

### 9.1 Kebijakan pembayaran
- **Pembayaran 100% lunas di muka, tanpa DP.** Satu transaksi penuh via Midtrans.
- **Refundable penuh** jika dibatalkan **≥ 2×24 jam (48 jam) sebelum penjemputan**. Pembatalan kurang dari 48 jam → tidak ada pengembalian dana.
- Kondisi alam/cuaca (miss sunrise / blue fire) → **tidak ada refund**.

---

## 10. Entitas Data Utama

- **User** (role: customer, admin, cs, guide, finance)
- **Lead** (inquiry → status pipeline)
- **Itinerary / Trip** (rencana perjalanan custom)
- **ItineraryDay / ItineraryItem** (jadwal per hari & item)
- **Destination / POI** (titik wisata Jawa Timur)
- **VehicleType** (dengan rate per km)
- **Hotel / Accommodation** (kelas)
- **Activity** (dengan harga tiket)
- **MealOption**
- **PriceConfig** (rate per km, margin per pax, tarif guide)
- **Booking / Order**
- **Payment** (Midtrans)
- **Expense** (pengeluaran lapangan guide/driver)

---

## 11. Kebutuhan Non-Fungsional

- **Responsive / mobile-friendly** (PWA) untuk pelanggan & guide/driver.
- **Keamanan**: HTTPS, autentikasi & otorisasi per role, data pembayaran lewat Midtrans (PCI).
- **i18n / l10n**: multi-bahasa + multi-mata uang (tampilan).
- **Kinerja**: kalkulasi biaya responsif.
- **Ketersediaan** & pencadangan data pesanan.

---

## 12. Roadmap

| Fase | Cakupan |
|------|---------|
| **Fase 1 (MVP)** | Custom itinerary (Jawa Timur), kalkulasi rate/km, booking & Midtrans, lead pipeline, dashboard admin, view guide/driver (web), pencatatan expense. |
| **Fase 2** | Paket rute jadi (konten admin), open trip, perluasan luar Jawa Timur, lebih banyak bahasa & mata uang, integrasi jarak realtime, CRM lebih lengkap. |
| **Fase 3** | Aplikasi mobile native, fitur partner/vendor. |

---

## 13. Ringkasan Keputusan & Sisa Konfigurasi

### 13.1 Keputusan yang sudah dikunci
1. Model produk: **hybrid** (custom itinerary utama + paket jadi belakangan).
2. Tipe trip MVP: **solo, duo, private, group tertutup** (open trip ditunda).
3. Cakupan MVP: **Jawa Timur**.
4. Transportasi: **per group (per kendaraan)**, rate **global per km per jenis kendaraan**, kendaraan **dipilih pelanggan**.
5. Margin otomatis per pax: **1–2 = 12%, 3–5 = 8%, 6–12 = 5%**.
6. Pembayaran: **100% lunas di muka** via Midtrans; **refundable penuh ≥ 48 jam sebelum penjemputan**.
7. Bahasa default **EN**, auto-detect negara; mata uang tampilan per negara, transaksi **IDR**.
8. Branding: **Itinerary ID**.
9. Guide/Driver: **web mobile-friendly (PWA)**, bukan native.
10. Bensin & tol sudah termasuk dalam rate per km.

### 13.2 Sisa yang perlu diisi (konfigurasi, tidak menghalangi MVP)
1. **Sumber jarak** — rekomendasi: Google Maps Distance Matrix (custom trip butuh jarak dinamis).
2. **Daftar bahasa & negara** yang didukung di MVP (disarankan mulai EN + Mandarin).
3. **Nilai rate per km aktual** per kendaraan — saat ini memakai placeholder (§7.4); akan diganti angka aktual perusahaan.

---

*Dokumen final v1.1 — siap digunakan sebagai acuan pengembangan MVP.*

---

# BAGIAN IMPLEMENTASI (untuk AI coding E2E)

Bagian ini menjabarkan detail teknis agar agent AI dapat membangun aplikasi end-to-end tanpa menebak-nebak.

## 14. Tech Stack & Arsitektur

### 14.1 Stack final

| Layer | Teknologi | Versi patokan | Catatan |
|---|---|---|---|
| Framework | **Next.js** (App Router) | 15.x | Full-stack, SSR/SEO, PWA |
| Bahasa | **TypeScript** | 5.x | strict mode |
| UI | **Tailwind CSS + shadcn/ui** | Tailwind 4 | komponen siap pakai |
| Database | **PostgreSQL** | 16 | via Supabase/Neon |
| ORM | **Prisma** | 6.x | schema-first, migrasi |
| Auth | **Auth.js (NextAuth v5)** | 5.x | multi-role, OAuth Google + email |
| Pembayaran | **midtrans-client** | 1.x | SDK resmi Node.js |
| Maps | `@googlemaps/google-maps-services-js` (server) + `@react-google-maps/api` (client) | terbaru | Distance Matrix + Places + Maps JS |
| i18n | **next-intl** | 4.x | locale auto-detect |
| Validasi | **Zod** | 3.x | validasi input |
| Hosting | **Vercel** (app) + **Supabase/Neon** (PostgreSQL) | — | mulai tier gratis |

### 14.2 Struktur project

```
itinerary-id/
├─ prisma/
│  └─ schema.prisma
├─ src/
│  ├─ app/
│  │  ├─ [locale]/
│  │  │  ├─ page.tsx               # landing (multi-bahasa)
│  │  │  ├─ plan/page.tsx          # itinerary builder
│  │  │  ├─ checkout/page.tsx      # checkout & pembayaran
│  │  │  ├─ booking/success/page.tsx
│  │  │  └─ dashboard/page.tsx     # customer: trip & booking saya
│  │  ├─ admin/                    # dashboard admin (config CRUD)
│  │  ├─ cs/                       # inbox lead
│  │  ├─ guide/                    # tugas + expense
│  │  ├─ finance/                  # pembayaran + approval expense
│  │  └─ api/
│  │     ├─ auth/...  ├─ vehicles/...  ├─ destinations/...
│  │     ├─ hotels/...  ├─ activities/...  ├─ meals/...
│  │     ├─ price-config/...  ├─ trips/...
│  │     ├─ bookings/...  ├─ midtrans/notification/...
│  │     ├─ leads/...  └─ expenses/...
│  ├─ components/
│  ├─ lib/
│  │  ├─ db.ts             # prisma client
│  │  ├─ auth.ts           # konfigurasi nextauth + role
│  │  ├─ pricing.ts        # kalkulasi biaya (lihat §19)
│  │  ├─ distance.ts       # google distance matrix → km
│  │  └─ midtrans.ts       # midtrans client (snap)
│  └─ i18n/
│     ├─ request.ts
│     └─ messages/{en,zh,...}.json
├─ middleware.ts            # proteksi route per role
├─ .env.example
└─ package.json
```

### 14.3 Environment variables (.env)

```
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=...
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=...          # login Google (opsional)
GOOGLE_CLIENT_SECRET=...
GOOGLE_MAPS_API_KEY=...       # Places + Maps JS + Distance Matrix
MIDTRANS_SERVER_KEY=...
MIDTRANS_CLIENT_KEY=...
MIDTRANS_IS_PRODUCTION=false
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=...
```

---

## 15. Struktur Database (Schema)

Referensi model (diterjemahkan ke Prisma schema). Tipe: `uuid` untuk id, `timestamptz` untuk timestamp.

```text
users
  id, name, email (unique), password_hash (null jika OAuth)
  role: customer | admin | cs | guide | finance
  phone, country, preferred_language (default 'en'), preferred_currency (default 'USD')
  created_at, updated_at

leads
  id, name, email, phone, country, message
  trip_preferences (json)          # rencana trip yang diminta
  status: new | contacted | won | lost
  assigned_to (user_id, nullable)  # CS yang menangani
  created_at, updated_at

destinations                      # POI / titik wisata
  id, name, region, lat, lng, category
  description, ticket_price (decimal)   # harga tiket per orang
  is_active, created_at, updated_at

vehicle_types
  id, name ('Avanza/Innova', 'Hiace', 'Alphard/Lexus', 'Bus medium')
  capacity_min, capacity_max, rate_per_km (decimal)
  is_active, created_at, updated_at

hotels
  id, name, region, class (budget | standard | premium)
  price_per_room_per_night (decimal), pax_per_room (default 2)
  is_active, created_at, updated_at

activities                        # aktivitas / tiket tambahan
  id, name, destination_id (nullable), ticket_price (decimal)
  description, is_active, created_at, updated_at

meal_options
  id, name, price_per_pax (decimal), is_active

price_configs                     # konfigurasi global (key-value)
  id, key (unique), value (text), description
  # key yang wajib ada:
  #   margin_1_2=0.12, margin_3_5=0.08, margin_6_12=0.05
  #   guide_rate_per_day=500000

trips                             # rencana perjalanan
  id, user_id, title
  trip_type: solo | duo | private | group
  start_date, end_date, num_pax
  vehicle_type_id, hotel_id (nullable)
  pickup_point (text/lat/lng), dropoff_point
  status: draft | booked | confirmed | in_progress | completed | cancelled
  total_amount (decimal), currency ('IDR')
  created_at, updated_at

trip_days
  id, trip_id, day_number, date, note

trip_items                        # item per hari, berurutan
  id, trip_day_id, order_index
  type: destination | activity | meal | pickup | dropoff
  destination_id (nullable), activity_id (nullable)
  start_time, end_time, note

bookings                          # pesanan
  id, trip_id, user_id, total_amount (decimal), currency ('IDR')
  status: pending | paid | confirmed | cancelled | refunded
  midtrans_order_id, payment_type, paid_at
  created_at, updated_at

payments
  id, booking_id, amount, currency, status (pending|settlement|capture|deny|cancel|expire|refund)
  midtrans_transaction_id, payment_type, paid_at, created_at

expenses                          # pengeluaran lapangan guide
  id, booking_id, submitted_by (user_id)
  category: fuel | toll | ticket | accommodation | meal | other
  amount (decimal), note, receipt_url
  status: submitted | approved | rejected
  approved_by (nullable), created_at, updated_at
```

Relasi inti: `users 1—N trips 1—N trip_days 1—N trip_items`; `trips 1—1 bookings 1—N payments`; `bookings 1—N expenses`.

---

## 16. Autentikasi & Otorisasi (Role)

| Role | Akses |
|---|---|
| **customer** | Buat/lihat trip sendiri, booking & bayar, lihat riwayat. |
| **admin** | CRUD config (vehicles, destinations, hotels, activities, meals, price_configs); lihat semua booking; assign guide; kelola user. |
| **cs** | Lihat/buat lead, ubah status, konversi lead → trip. |
| **guide** | Lihat itinerary yang ditugaskan, update status, submit expense. |
| **finance** | Lihat pembayaran, approve/reject expense, lihat laporan margin. |

Proteksi route di `middleware.ts`: redirect ke login jika belum autentikasi; blok akses ke `/admin`, `/cs`, `/guide`, `/finance` sesuai role.

---

## 17. API Endpoint (Next.js Route Handlers)

```text
# Auth
POST /api/auth/register        # customer
POST /api/auth/login           # email/password
GET  /api/auth/session         # info user + role
POST /api/auth/logout

# Config (admin)
GET/POST        /api/vehicles          ; GET/PUT/DELETE /api/vehicles/:id
GET/POST        /api/destinations      ; GET/PUT/DELETE /api/destinations/:id
GET/POST        /api/hotels            ; GET/PUT/DELETE /api/hotels/:id
GET/POST        /api/activities        ; GET/PUT/DELETE /api/activities/:id
GET/POST        /api/meals             ; GET/PUT/DELETE /api/meals/:id
GET/PUT         /api/price-config      # baca/update margin & guide rate

# Trips (customer / admin)
POST /api/trips                # buat trip (draft)
GET  /api/trips                # list (customer: milik sendiri; admin: semua)
GET  /api/trips/:id
PUT  /api/trips/:id            # update item/hari/kendaraan
DELETE /api/trips/:id
POST /api/trips/:id/calculate  # hitung total (sama dengan §19)

# Booking & pembayaran
POST /api/bookings             # buat booking dari trip
POST /api/bookings/:id/checkout   # buat Snap token Midtrans
GET  /api/bookings/:id
POST /api/midtrans/notification   # webhook Midtrans (tanpa auth, verifikasi signature)

# Leads (CS / publik)
POST /api/leads                # form inquiry publik
GET  /api/leads                # CS
PUT  /api/leads/:id            # update status/assign

# Expenses (guide / finance)
POST /api/expenses             # guide submit
GET  /api/expenses             # guide: milik sendiri; finance: semua
PUT  /api/expenses/:id/status  # finance approve/reject
```

---

## 18. Halaman & Rute Frontend

```text
/                      → landing (EN default; auto-redirect [locale])
/[locale]/plan         → itinerary builder (pilih destinasi, kendaraan, hotel, aktivitas)
/[locale]/checkout     → review + pembayaran (Snap redirect)
/[locale]/booking/success
/[locale]/dashboard    → trip & booking customer
/admin                 → ringkasan + navigasi config
/admin/vehicles, /admin/destinations, /admin/hotels, /admin/activities, /admin/meals, /admin/price-config
/cs                    → inbox lead
/guide                 → daftar tugas + form expense
/finance               → pembayaran + approval expense
```

---

## 19. Algoritma Kalkulasi (wajib diikuti)

Implementasi di `lib/pricing.ts`. Pseudocode:

```ts
function marginTier(pax: number): number {
  if (pax <= 2) return 0.12
  if (pax <= 5) return 0.08
  return 0.05
}

function calcRooms(pax: number, paxPerRoom = 2): number {
  return Math.ceil(pax / paxPerRoom)
}

async function calculateTrip(trip): Promise<{
  distanceKm, transport, tickets, hotel, meals, guide, subtotal, margin, total, pricePerPerson
}> {
  // 1. Jarak total (km) — Google Distance Matrix, berurutan:
  //    pickup → item1 → item2 → ... → dropoff (default = kembali ke pickup).
  const points = orderedPoints(trip)          // lat/lng berurutan
  const distanceKm = await totalDistanceKm(points)   // sum jarak antar titik / 1000

  // 2. Transport (per grup/kendaraan)
  const vehicle = trip.vehicleType
  const transport = distanceKm * vehicle.ratePerKm

  // 3. Tiket (per orang)
  const tickets = sum(trip.items.map(i => i.ticketPrice))

  // 4. Hotel (per kamar per malam) — jika hotel dipilih
  const nights = tripDays - 1                 // jumlah malam = hari - 1
  const hotel = trip.hotel
    ? hotel.pricePerRoomPerNight * nights * calcRooms(trip.numPax, hotel.paxPerRoom)
    : 0

  // 5. Makan (opsional, per orang)
  const meals = sum(trip.meals.map(m => m.pricePerPax)) * trip.numPax

  // 6. Guide (per hari, per grup)
  const guide = config.guideRatePerDay * tripDays

  // 7. Total
  const perPerson = tickets * trip.numPax + meals       // komponen per orang
  const subtotal = transport + hotel + perPerson + guide
  const margin = subtotal * marginTier(trip.numPax)
  const total = subtotal + margin

  return { distanceKm, transport, tickets, hotel, meals, guide,
           subtotal, margin, total,
           pricePerPerson: total / trip.numPax }
}
```

**Aturan jarak:** jarak = total km dari titik jemput melewati semua destinasi sesuai urutan hari, lalu kembali ke titik antar (round-trip) kecuali dropoff ditentukan berbeda.

**Aturan refund:**
```ts
function refundDecision(booking, cancelAt, pickupAt): 'full' | 'none' {
  return (pickupAt - cancelAt) >= 48 * 3600 * 1000 ? 'full' : 'none'
}
```

---

## 20. Integrasi Eksternal

### 20.1 Midtrans (Snap)
- Checkout: `POST /snap/v1/transactions` dengan `transaction_details.order_id` (unik), `gross_amount` (total IDR), `customer_details`.
- Dapat `redirect_url`/`token` → redirect pelanggan → setelah bayar, Midtrans memanggil webhook `POST /api/midtrans/notification`.
- Webhook: verifikasi signature, update `payments` + `bookings.status` menjadi `paid` → `confirmed`.
- Refund: `POST /v2/{order_id}/refund` saat booking di-refund (kebijakan §9.1).
- Wajib: `gross_amount` dalam IDR (transaksi selalu IDR; tampilan multi-mata uang hanya di frontend).

### 20.2 Google Maps
- **Distance Matrix API** (server): hitung jarak antar titik (meter) → km untuk rate.
- **Places API** (client): autocomplete pencarian destinasi.
- **Maps JavaScript API** (client): tampilkan rute di builder.

---

## 21. Definisi Selesai (Acceptance Criteria) per Modul

- **Auth & role:** login/logout berfungsi; akses route dibatasi sesuai role; pelanggan hanya melihat data miliknya.
- **Itinerary builder:** bisa tambah/hapus/urutkan destinasi per hari; pilih kendaraan & hotel; total biaya ter-update real-time; angka mengikuti §19.
- **Pembayaran:** checkout Midtrans menghasilkan pembayaran; webhook mengubah status ke `paid`; booking gagal bayar tetap `pending`.
- **Lead:** form inquiry publik masuk ke inbox CS; CS bisa ubah status & konversi jadi trip.
- **Guide:** guide melihat itinerary yang ditugaskan; bisa submit expense dengan kategori & jumlah.
- **Finance:** finance bisa approve/reject expense; lihat pembayaran masuk.
- **i18n:** EN default; ganti locale otomatis sesuai deteksi negara; konten statis & pesan UI tersedia minimal EN + satu bahasa tambahan.
- **PWA:** aplikasi dapat di-install & tetap responsif di mobile.

---

## 22. Urutan Implementasi (E2E — untuk AI coding)

1. **Scaffold:** Next.js + TypeScript + Tailwind + shadcn + Prisma + PostgreSQL; siapkan `.env`.
2. **Database:** definisikan schema Prisma (§15), jalankan migrasi; seed data contoh (vehicles, destinations, hotels, activities, price_configs).
3. **Auth + role:** Auth.js, middleware proteksi route.
4. **Config CRUD (admin):** vehicles, destinations, hotels, activities, meals, price_configs.
5. **Itinerary builder + kalkulasi:** halaman plan, pilih item, hitung jarak (Distance Matrix) & biaya (§19).
6. **Booking + Midtrans:** checkout Snap, webhook, status booking.
7. **Lead → CS:** form publik + inbox + konversi.
8. **Guide & Finance:** view tugas, submit/approve expense.
9. **i18n + PWA + deploy** ke Vercel.

Setiap langkah di atas berakhir dengan Acceptance Criteria §21 yang terpenuhi sebelum lanjut ke langkah berikutnya.
