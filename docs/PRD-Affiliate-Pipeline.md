# PRD — Upgrade Lead Pipeline menjadi Affiliate + Pipeline (Agent Program)

**Produk:** Itinerary ID (`rebelboyz/itinerary`)
**Versi:** 1.0 — keputusan produk dan struktur harga dikunci; angka konfigurasi dan beberapa keputusan hukum masih terbuka (§13)
**Basis dokumen:** dibaca langsung dari kode (Next.js 16, React 19, Prisma 6.4.1 + Supabase Postgres, Midtrans, auth cookie custom). Rujukan `file:baris` ada di Lampiran A.
**Dokumen induk:** `docs/PRD-Itinerary-ID.md` (v1.1). PRD ini menambah dan, di bagian harga (§5), **menggantikan** aturan margin 12/8/5% di dokumen induk §7 dan §19.

---

## 0. Ringkasan

Agen mitra di luar negeri (China, Eropa, USA, dll.) bergabung sebagai **agen resmi Itinerary ID**. Mereka (1) membawa lead lewat link/kode referral atau input manual, (2) mem-follow-up lead mereka sendiri di dalam pipeline, (3) mengirim penawaran berupa trip dari builder yang sudah ada, dan (4) menerima **komisi** setelah booking lunas dan trip selesai. Pelanggan membayar langsung ke Itinerary ID lewat Midtrans; **agen tidak pernah memegang uang pelanggan**. Harga sama untuk semua kanal.

Bersamaan dengan itu, struktur harga disesuaikan (§5): hotel dan tiket dijual di harga publik, armada sendiri di-markup per km, dan markup operasional lama diganti satu baris **Biaya Platform** yang membiayai komisi, biaya gateway, dan margin target.

---

## 1. Kondisi saat ini (as-is, dari kode)

| Area | Kondisi nyata |
|---|---|
| Lead | Model `Lead` berdiri sendiri: `name, email, phone, country, message, tripPreferences, status, assignedToId`. Status: `new/contacted/won/lost`. **Tidak ada relasi ke Trip/Booking, tidak ada sumber/referral.** |
| Lead masuk | `POST /api/leads` publik tanpa auth, tanpa rate limit. Satu-satunya sumber: form di beranda. |
| Lead → pelanggan | Tombol "Convert to Trip" di `/cs` hanya `Link` ke `/plan?customer_email=…&customer_name=…`. **Halaman `/plan` tidak membaca parameter itu** (0 pemakaian `useSearchParams`). Loop lead → booking **belum tertutup**. |
| Role | 5 role (`customer, admin, cs, guide, finance`) hardcoded di `SessionUser`, `middleware.ts`, dan login redirect. |
| Harga | `lib/pricing.ts`: margin otomatis 12% (1–2 pax), 8% (3–5), 5% (6–12) dari subtotal, **ditampilkan ke pelanggan** sebagai baris "Operational Markup (x%)" di builder. Tidak ada komponen biaya gateway. |
| Klaim beranda | Kartu fitur menjanjikan "No hidden route markups" (EN) / "Tidak ada markup rute tersembunyi" (ID). |
| Pembayaran | Midtrans, 100% lunas di muka, IDR saja. Refund penuh jika batal ≥48 jam sebelum jemput. |
| Pengukuran margin | Halaman Finance menghitung margin terealisasi = `totalRevenue − totalApprovedExpenses`; `Expense` hanya pengeluaran lapangan guide. **Biaya hotel/kendaraan/tiket tidak tercatat**, jadi margin nyata dari pemasok tidak bisa diukur. |
| Penyelesaian trip | `in_progress` dan `completed` ada di komentar skema, tetapi **tidak ada kode yang pernah menyetelnya**; tidak ada endpoint ubah status booking atau assign guide. |

### 1.1 Temuan yang harus diselesaikan SEBELUM fitur ini (Fase 0)

Fitur komisi menyangkut uang dan akun pihak luar. Hal-hal di bawah membuatnya tidak aman jika dibangun di atas kondisi sekarang:

1. **Session cookie tidak ditandatangani.** Token = `base64url(JSON)` tanpa HMAC/enkripsi (`lib/auth.ts`, `middleware.ts`). Siapa pun bisa membuat cookie `{"role":"admin",...}` dan lolos middleware serta semua `getSession()`.
2. **Data booking/trip bocor lewat ID.** `GET /api/bookings?id=` dan `GET /api/trips?id=` publik, mengembalikan `user`, `payments`, `expenses`, dan detail trip.
3. **Harga dipercaya dari klien.** `POST /api/trips` menyimpan `totalAmount`, `marginAmount`, dst. dari `body.pricing` tanpa hitung ulang di server.
4. **`DELETE /api/trips?id=` tanpa auth** dan ikut menghapus `payments` dan `bookings`.
5. **Webhook Midtrans tidak idempoten.** Tiap notifikasi membuat baris `Payment` baru, status bisa maju-mundur, dan verifikasi signature dilewati jika `MIDTRANS_SERVER_KEY` mengandung `test-key`/`placeholder`.
6. **Belum ada pemicu "trip selesai"** (lihat §5.4).

---

## 2. Tujuan, non-tujuan, metrik

### 2.1 Tujuan
- G1. Setiap lead dan booking dapat **diatribusikan** ke satu agen dengan aturan kepemilikan yang jelas.
- G2. Agen dapat mengelola pipeline lead miliknya sampai terbentuk trip dan link pembayaran.
- G3. Komisi tercatat otomatis, bisa diaudit, dan tidak dibayar untuk booking yang batal/refund.
- G4. Admin/Finance punya kendali penuh: onboarding, konfigurasi harga dan komisi, override kepemilikan, payout.
- G5. Harga ke pelanggan kompetitif terhadap platform lain pada komponen yang bisa dibandingkan (hotel, tiket).

### 2.2 Non-tujuan (Fase 1)
- Agen mengatur harga/margin sendiri.
- Agen menerima pembayaran pelanggan.
- Payout otomatis lintas negara.
- Struktur bertingkat agen → affiliate (disiapkan di data, diaktifkan di Fase 2, lihat §3.1).
- Materi promosi/white-label per agen.

### 2.3 Metrik keberhasilan (target diisi pemilik bisnis)
| Metrik | Definisi | Target |
|---|---|---|
| Agen aktif | Agen `active` dengan ≥1 lead dalam 30 hari | _isi_ |
| Lead per agen/bulan | Median | _isi_ |
| Lead → booking lunas | Per agen, per kohort 90 hari | _isi_ |
| Komisi / revenue agen | Total komisi ÷ total `totalAmount` booking agen | = cadangan komisi (§5) |
| Margin pemasok terealisasi | Σ(`listedAmount − actualCost`) ÷ Σ`listedAmount`, per komponen, per bulan | pantau; asumsi awal 15–20% (belum terverifikasi) |
| Waktu respons agen | `new` → `contacted` | _isi_ (usul: <24 jam) |
| Sengketa kepemilikan | Override admin per 100 lead | pantau |

**Gerbang ke Fase 2:** Fase 1 menghasilkan booking lunas dari agen nyata. Angka minimum diputuskan pemilik bisnis sebelum Fase 1 (usulan: ≥3 agen pilot, ≥5 booking lunas dalam 8 minggu).

---

## 3. Model program: dua tingkat dalam satu role

| | **Affiliate** | **Agent** |
|---|---|---|
| Link/kode referral | Ya | Ya |
| Melihat lead & komisi sendiri | Ya (read-only) | Ya |
| Input lead manual | Tidak | Ya |
| Mengelola pipeline (status, catatan, follow-up) | Tidak (CS menangani) | Ya, untuk lead miliknya |
| Membuat trip/penawaran dan mengirim link checkout | Tidak | Ya |

Semua agen otomatis memiliki hak affiliate; affiliate baru menjadi agen setelah admin menaikkan `tier`-nya. Semua orang mulai sebagai affiliate **kecuali** admin langsung menetapkan `agent` saat approve (untuk mitra yang sudah bekerja sama, misalnya agen China yang ada). Pembagian dua tingkat ini opsional: jika semua kandidat sudah dibriefing, semua bisa langsung `agent`.

### 3.1 Agen merekrut affiliate (disiapkan, belum diaktifkan)
Usulan: agen mempunyai affiliate di bawahnya dan menangani lead mereka. Hanya **satu tingkat** (agen → affiliate; affiliate tidak merekrut), komisi **hanya dari booking lunas**, tanpa bonus rekrutmen. Karena struktur bertingkat menimbulkan risiko hukum (skema piramida/MLM; aturan Indonesia dan China berbeda dan perlu diverifikasi) dan menambah pembagian komisi, Fase 1 hanya menyiapkan kolom data (`Agent.parentAgentId`, `Lead.sourceAgentId` dan `Lead.handlerAgentId`). Diaktifkan di Fase 2 jika hasil hukum dan ekonominya jelas.

---

## 4. Alur utama

### 4.1 Onboarding agen
1. Calon agen mengisi `/become-agent` (nama, perusahaan opsional, negara, kanal promosi, kontak) → `Agent.status = pending`. Mitra yang sudah bekerja sama dapat dibuat langsung oleh admin.
2. Admin meninjau di `/admin/agents` → approve/reject, set `tier` dan aturan komisi.
3. Agen login pertama kali → **wajib menyetujui Perjanjian Agen (versi tercatat)** dan mengisi data payout.
4. Sistem membuat `refCode` unik. Agen mendapat dashboard dan link `https://…/?ref=KODE`.

### 4.2 Masuknya lead (tiga jalur)
| Jalur | Mekanisme | Catatan |
|---|---|---|
| A. Link referral | `/?ref=KODE` disimpan di cookie 30 hari; form inquiry mengirim `refCode` | Hanya untuk lead baru, bukan email yang sudah dikunci agen lain |
| B. Input manual agen | Agen mengisi lead dari percakapan WhatsApp/WeChat/email miliknya (`source=agent_manual`) | Kemungkinan jalur utama; link saja tidak cukup untuk agen yang menjual lewat chat |
| C. Direct + kode | Pelanggan memasukkan kode agen di form/checkout | Fallback |

### 4.3 Pipeline (kompatibel dengan data lama)
```
new → contacted → quoted → negotiating → booked → paid → completed
                                  ↘ lost (dari tahap mana pun, wajib alasan)
```
- Nilai lama `new/contacted/won/lost` tetap valid; `won` lama dipetakan ke `booked` lewat migrasi.
- `booked`, `paid`, `completed` **diturunkan otomatis** dari Trip/Booking tertaut. Agen tidak boleh mengisinya manual.
- Setiap perubahan status dan catatan masuk `LeadActivity` (tak bisa diedit).

### 4.4 Dari lead ke pembayaran
1. Agen membuka lead → **Buat Penawaran** → `/plan?lead=<leadId>`.
2. `/plan` membaca `lead`, memverifikasi hak agen atas lead, dan mengisi data pelanggan.
3. Saat disimpan, `Trip.leadId` dan `Trip.agentId` terisi; lead pindah ke `quoted`.
4. Agen menyalin **link checkout** dan mengirimnya ke pelanggan lewat kanal sendiri.
5. Pelanggan membayar langsung via Midtrans; webhook memajukan status dan membuat komisi.

### 4.5 Siklus komisi
```
pending ──(trip completed + masa tunggu)──▶ approved ──(masuk batch payout)──▶ payable ──(finance bayar)──▶ paid
   │
   └──(batal/refund sebelum approved)──▶ void          paid ──(refund pasca-bayar)──▶ clawback (dikurangkan dari payout berikutnya)
```

---

## 5. Struktur harga dan sumber komisi (keputusan terkunci)

### 5.1 Keputusan produk
| Komponen | Perlakuan | Sumber margin |
|---|---|---|
| **Transport (armada sendiri)** | Rate per km per jenis kendaraan **sudah memuat markup**; tidak ada baris markup transport terpisah | Selisih rate vs biaya operasional |
| **Hotel** | **Harga publik**, tanpa markup | Komisi/diskon pemasok (asumsi 15–20% dari harga listing, **fluktuatif**), tidak ditampilkan ke pelanggan |
| **Tiket/atraksi** | **Harga publik**, tanpa markup | Idem, jika berlaku |
| Guide, makan | Tidak berubah dari PRD induk | — |
| **Biaya Platform** | Satu baris di harga, menggantikan "Operational Markup" | Margin target + cadangan komisi + estimasi biaya gateway |

Alasan: komponen yang bisa dibandingkan pelanggan (hotel, tiket) dijaga sama dengan harga publik sehingga tidak ada alasan membandingkan dan menyimpulkan "lebih murah di tempat lain"; margin berasal dari komponen yang tidak punya patokan publik yang jelas dan dari komisi pemasok.

### 5.2 Rumus
```
Subtotal         = Transport + Hotel + Tiket + Makan + Guide
MarginTarget     = Subtotal × marginTargetRate(pax)        # config
CadanganKomisi   = Subtotal × commissionReserveRate(pax)   # config
Total            = (Subtotal + MarginTarget + CadanganKomisi) / (1 − gatewayRate)
BiayaGateway     = Total × gatewayRate
BiayaPlatform    = MarginTarget + CadanganKomisi + BiayaGateway     # = Total − Subtotal
```
- `gatewayRate` = estimasi biaya Midtrans dalam persen dari Total (satu nilai default; dapat diperluas per metode bayar). Karena biaya gateway dihitung dari total yang dibayar, Total dihitung dengan **gross-up** seperti di atas.
- `marginTargetRate` dan `commissionReserveRate` per tier pax (1–2, 3–5, 6–12) di `PriceConfig`. Tier lama 12/8/5% **dihapus** dan digantikan oleh dua set angka ini.
- Semua angka di `PriceConfig` agar bisa diubah tanpa deploy.

### 5.3 Sumber komisi
- Komisi agen = `CadanganKomisi` booking × `payoutShare` (default 100%, dapat dibedakan untuk affiliate dan agen lewat `CommissionRule`). Dasar komisi adalah angka yang **pasti dan dapat diaudit**; spread pemasok yang fluktuatif **tidak** menjadi dasar komisi dan tidak diketahui agen.
- Harga sama untuk semua kanal. Pada booking langsung (tanpa agen), `CadanganKomisi` tetap menjadi margin perusahaan (atau dipakai untuk promosi), sehingga tidak ada insentif bagi pelanggan untuk melewati agen.
- Komisi dihitung **di server** dari katalog dan `calculatePricingPure()`; `body.pricing` dari klien tidak dipercaya.

### 5.4 Pemicu komisi `approved` (keputusan terbuka)
Usulan: `approved` = trip `completed` + 7 hari tanpa klaim. Pemicu `completed` **belum ada di kode** dan dibangun di Fase 0 (`PUT /api/bookings/:id/status` + UI admin). Kondisi alam/cuaca tidak memicu refund (PRD induk §9.1), jadi risiko clawback pasca-trip kecil.

### 5.5 Ilustrasi
Contoh dari angka kalibrasi PRD induk §7.5 (Bromo–Ijen 3D2N, Hiace, 6 pax; subtotal ≈ Rp 10,4 jt). **Semua rate di bawah placeholder, bukan keputusan** (D1):

| Komponen | Asumsi | Nilai |
|---|---|---|
| Subtotal | | ≈ Rp 10,40 jt |
| MarginTarget | 2% dari subtotal | ≈ Rp 208 rb |
| CadanganKomisi | 3% dari subtotal | ≈ Rp 312 rb |
| Gateway | 2,5% dari total (**harus diverifikasi**, kartu internasional biasanya lebih mahal) | ≈ Rp 280 rb |
| **Biaya Platform** | | **≈ Rp 800 rb** (≈ 7,7% dari subtotal) |
| **Total** | | ≈ Rp 11,20 jt |
| Komisi agen | 100% dari cadangan | ≈ Rp 312 rb |

Spread pemasok pada hotel/tiket **tidak** masuk perhitungan ini. Ia menjadi tambahan margin yang diukur terpisah (§5.7).

### 5.6 Penyesuaian di aplikasi
| Perubahan | Lokasi |
|---|---|
| Rumus baru dan field hasil (`marginTargetAmount`, `commissionReserveAmount`, `gatewayFeeAmount`, `platformFeeAmount`) | `src/lib/pricing.ts` (`calculatePricingPure`, `calculateTrip`); hapus `marginTier()` |
| Config baru: `margin_target_1_2/3_5/6_12`, `commission_reserve_1_2/3_5/6_12`, `gateway_fee_rate`; hapus `margin_1_2/3_5/6_12` | `prisma/seed.ts`, `/api/price-config`, halaman admin |
| Baris harga di builder: ganti "Operational Markup (x%)" dengan **Biaya Platform** (satu angka, tanpa persen) | `src/app/plan/page.tsx` |
| Label i18n `marginLabel` → `platformFeeLabel` | `src/i18n/translations.ts` (EN "Platform Fee", ID "Biaya Platform", ZH "平台服务费", terjemahan perlu ditinjau penutur asli) |
| Klaim beranda | `translations.ts`, `card1Desc` EN dan ID (§5.8) |
| Harga hotel/tiket di katalog = **harga publik**, dengan tanggal pengecekan | `Hotel`, `Destination`, `Activity` + kolom `publicPriceCheckedAt` |
| Uji formula untuk semua tier pax, termasuk gross-up gateway | `scripts/test-pricing.ts` |

### 5.7 Mengukur margin pemasok
Karena spread 15–20% fluktuatif dan belum terukur, Finance mencatat biaya aktual per komponen setelah trip (model `BookingCostLine`, §6). Laporan bulanan menampilkan margin pemasok terealisasi per komponen. `MarginTarget` **tidak diturunkan ke nol** sebelum data minimal 2–3 bulan menunjukkan spread yang stabil; hasil pengukuran juga dipakai untuk menentukan seberapa besar `commissionReserveRate` dapat dinaikkan.

### 5.8 Klaim ke pelanggan
- Hapus janji "tidak ada markup tersembunyi" karena tidak lagi benar. Pengganti yang selalu benar (usulan):
  - EN: "Group transport is calculated per group from the actual route distance. One all-inclusive price, with no extra charges after checkout."
  - ID: "Transport dihitung per grup berdasarkan jarak rute aktual. Satu harga all-inclusive, tanpa biaya tambahan setelah checkout."
- Biaya Platform adalah biaya nyata yang tercantum di total; jangan dijelaskan sebagai biaya pihak ketiga. Deskripsi singkat yang netral (platform pemesanan, koordinasi layanan, pemrosesan pembayaran) dipakai sebagai tooltip.
- Komisi agen tidak pernah ditampilkan ke pelanggan.
- Klaim harga pada iklan tunduk aturan masing-masing negara sasaran; tinjau hukum (§9).

---

## 6. Perubahan skema database (Prisma)

Mengikuti gaya yang ada: `String` untuk status, `Decimal(12,2)` untuk uang, `@@map` snake_case. Ini **usulan**; gunakan `prisma migrate`, bukan `db push`, karena README menunjuk satu DB Supabase yang juga berisi akun demo; pastikan DB staging terpisah sebelum Fase 0.

```prisma
model Agent {
  id                  String    @id @default(uuid())
  userId              String    @unique
  user                User      @relation(fields: [userId], references: [id])
  refCode             String    @unique
  tier                String    @default("affiliate") // "affiliate" | "agent"
  status              String    @default("pending")   // "pending" | "active" | "suspended" | "terminated"
  parentAgentId       String?   // disiapkan untuk Fase 2 (§3.1); tidak dipakai di Fase 1
  parent              Agent?    @relation("AgentTree", fields: [parentAgentId], references: [id])
  children            Agent[]   @relation("AgentTree")
  companyName         String?
  country             String
  channels            Json?
  commissionRuleId    String?
  commissionRule      CommissionRule? @relation(fields: [commissionRuleId], references: [id])
  payoutMethod        String?   // "bank_transfer" | "wise" | "paypal"
  payoutDetailsEnc    String?   // terenkripsi di level aplikasi; jangan simpan mentah
  agreementVersion    String?
  agreementAcceptedAt DateTime?
  approvedById        String?
  approvedAt          DateTime?

  leads       Lead[]
  trips       Trip[]
  commissions Commission[]
  payouts     Payout[]

  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  @@map("agents")
}

model CommissionRule {
  id          String   @id @default(uuid())
  name        String
  payoutShare Decimal  @default(1.0000) @db.Decimal(5, 4) // porsi CadanganKomisi yang dibayarkan ke agen
  isDefault   Boolean  @default(false)
  agents      Agent[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  @@map("commission_rules")
}

model Commission {
  id            String    @id @default(uuid())
  bookingId     String    @unique        // satu komisi per booking → idempotensi
  booking       Booking   @relation(fields: [bookingId], references: [id])
  agentId       String
  agent         Agent     @relation(fields: [agentId], references: [id])
  leadId        String?
  basisAmount   Decimal   @db.Decimal(12, 2) // = CadanganKomisi hasil hitung ulang server
  rateApplied   Decimal   @db.Decimal(5, 4)  // = payoutShare
  amount        Decimal   @db.Decimal(12, 2)
  currency      String    @default("IDR")
  status        String    @default("pending") // "pending" | "approved" | "payable" | "paid" | "void" | "clawback"
  ruleSnapshot  Json
  approvedAt    DateTime?
  paidAt        DateTime?
  voidReason    String?
  payoutId      String?
  payout        Payout?   @relation(fields: [payoutId], references: [id])
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  @@map("commissions")
}

model Payout {
  id          String    @id @default(uuid())
  agentId     String
  agent       Agent     @relation(fields: [agentId], references: [id])
  totalAmount Decimal   @db.Decimal(12, 2)
  currency    String    @default("IDR")
  fxRate      Decimal?  @db.Decimal(14, 6)
  method      String
  reference   String?
  proofUrl    String?
  status      String    @default("draft")    // "draft" | "paid" | "failed"
  paidAt      DateTime?
  createdById String
  commissions Commission[]
  createdAt   DateTime  @default(now())
  @@map("payouts")
}

model BookingCostLine {
  id           String   @id @default(uuid())
  bookingId    String
  booking      Booking  @relation(fields: [bookingId], references: [id], onDelete: Cascade)
  component    String   // "hotel" | "vehicle" | "ticket" | "meal" | "guide" | "other"
  listedAmount Decimal  @db.Decimal(12, 2) // yang ditagih ke pelanggan untuk komponen ini
  actualCost   Decimal  @db.Decimal(12, 2) // biaya nyata ke pemasok, diisi Finance
  supplierName String?
  note         String?
  enteredById  String
  createdAt    DateTime @default(now())
  @@map("booking_cost_lines")
}

model LeadActivity {
  id        String   @id @default(uuid())
  leadId    String
  lead      Lead     @relation(fields: [leadId], references: [id], onDelete: Cascade)
  authorId  String?
  type      String   // "note" | "status_change" | "contact" | "quote_sent" | "reassign"
  body      String?
  meta      Json?
  createdAt DateTime @default(now())
  @@map("lead_activities")
}

model AuditLog {
  id        String   @id @default(uuid())
  actorId   String
  action    String   // "lead.override_owner" | "commission.edit" | "agent.approve" | "price_config.update" ...
  entity    String
  entityId  String
  reason    String?
  meta      Json?
  createdAt DateTime @default(now())
  @@map("audit_logs")
}
```

**Perubahan model yang ada:**
| Model | Tambahan |
|---|---|
| `Lead` | `agentId?`, `source` (`direct`/`agent_link`/`agent_manual`), `refCode?`, `sourceAgentId?`, `handlerAgentId?` (disiapkan Fase 2), `normalizedEmail`, `normalizedPhone?`, `lockedUntil?`, `lastAgentActivityAt?`, `nextFollowUpAt?`, `lostReason?`, relasi `trips Trip[]`, `activities LeadActivity[]`; indeks pada `normalizedEmail`, `agentId`, `status` |
| `Trip` | `leadId?`, `agentId?`; `marginTargetAmount`, `commissionReserveAmount`, `gatewayFeeAmount`, `platformFeeAmount`. Kolom `marginAmount` yang ada diisi sama dengan `platformFeeAmount` agar UI lama tidak rusak |
| `Booking` | `agentId?` (snapshot saat dibuat), relasi `commission Commission?`, `costLines BookingCostLine[]` |
| `Hotel`, `Destination`, `Activity` | `publicPriceCheckedAt DateTime?` |
| `User` | relasi `agent Agent?`; role baru `"agent"` |

---

## 7. API

Semua endpoint baru memakai `getSession()` **setelah** session ditandatangani (Fase 0). Penyaringan kepemilikan terjadi di query server.

| Endpoint | Akses | Fungsi |
|---|---|---|
| `POST /api/agents/apply` | publik (rate-limited) | Pendaftaran calon agen |
| `GET/PUT /api/agents`, `/api/agents/:id` | admin | Daftar, approve, ubah tier/aturan, suspend |
| `GET /api/agent/me` | agent | Profil, `refCode`, ringkasan |
| `POST /api/agent/agreement` | agent | Catat persetujuan perjanjian (versi + waktu) |
| `GET/POST /api/agent/leads` | agent | Daftar lead miliknya; input lead manual (deteksi duplikat) |
| `GET/PUT /api/agent/leads/:id` | agent | Detail, catatan, jadwal follow-up, status yang diizinkan |
| `POST /api/agent/leads/:id/quote` | agent (tier `agent`) | Buat trip bertaut lead, kembalikan link checkout |
| `GET /api/agent/commissions` | agent | Komisi milik sendiri |
| `POST /api/leads` *(ubah)* | publik | Terima `refCode`; normalisasi + cek duplikat + terapkan kunci; rate limit + captcha |
| `PUT /api/leads/:id` *(ubah)* | cs, admin | Override kepemilikan (wajib `reason`, tulis `AuditLog`) |
| `GET /api/admin/commissions`, `PUT …/:id` | admin, finance | Tinjau, setujui, void |
| `POST /api/finance/payouts` | finance | Buat batch payout dari komisi `approved`; tandai `paid` + bukti |
| `POST /api/bookings/:id/costs` *(baru)* | finance | Input `BookingCostLine` (biaya aktual) |
| `GET /api/finance/supplier-margin` *(baru)* | finance, admin | Laporan margin pemasok per komponen per bulan |
| `PUT /api/bookings/:id/status` *(baru)* | admin | Tandai trip `completed` (pemicu §5.4) |
| `PUT /api/price-config` *(ubah)* | admin | Terima key baru §5.6; tulis `AuditLog` untuk tiap perubahan |
| `POST /api/trips`, `/api/trips/calculate` *(ubah)* | sesuai role | Hitung ulang harga di server dengan rumus §5.2; abaikan `body.pricing` |
| `POST /api/midtrans/notification` *(ubah)* | webhook | Idempoten (unik per `transaction_id`+status), status hanya maju, buat `Commission` sekali |
| `GET /api/bookings`, `/api/trips` *(ubah)* | sesuai role | Hapus akses publik per-ID; gantikan dengan token checkout |

---

## 8. Antarmuka

| Rute | Pengguna | Isi |
|---|---|---|
| `/become-agent` | publik | Form pendaftaran |
| `/agent` | agent | Ringkasan: lead aktif, follow-up jatuh tempo hari ini, komisi pending/approved/paid, link referral + tombol salin |
| `/agent/leads` | agent | Daftar/Kanban per tahap; filter; **Tambah Lead** |
| `/agent/leads/[id]` | agent | Detail, timeline `LeadActivity`, follow-up berikutnya, **Buat Penawaran**, salin link checkout |
| `/agent/commissions` | agent | Tabel komisi + status + estimasi mata uang lokal (label "estimasi") |
| `/agent/profile` | agent | Data payout, perjanjian, bahasa |
| `/admin/agents` | admin | Antrian apply, kelola tier/aturan, suspend |
| `/admin/commissions` | admin/finance | Tinjau, void, ekspor |
| `/admin` price-config *(ubah)* | admin | Edit margin target, cadangan komisi per tier, gateway rate; riwayat perubahan |
| `/finance/payouts` | finance | Buat batch, unggah bukti, tandai paid, kelola clawback |
| `/finance` *(ubah)* | finance | Form biaya aktual per booking; laporan margin pemasok terealisasi |
| `/cs` *(ubah)* | cs | Kolom agen pemilik, indikator kunci/stale, pemisah lead langsung vs agen |
| `/plan` *(ubah)* | agent/cs/customer | Membaca `?lead=`; baris **Biaya Platform** menggantikan markup; menyimpan `leadId`/`agentId` |

UI agen mengikuti prinsip PRD induk: responsive/PWA, EN default dengan auto-detect (agen China mendapat Mandarin lebih dulu).

---

## 9. Keamanan, hukum, kepatuhan

| Area | Kebutuhan | Status |
|---|---|---|
| Autentikasi | Session ditandatangani (JWT HS256 atau `iron-session`, atau Supabase Auth yang sudah ada di dependensi), cookie `httpOnly`, rotasi secret | **Prasyarat Fase 0** |
| Otorisasi | Middleware bukan satu-satunya penjaga; tiap route handler memvalidasi role + kepemilikan | Prasyarat |
| Data payout agen | Enkripsi level aplikasi, tidak muncul di log | Dibangun |
| Perjanjian agen | Teks, versi, bukti persetujuan | **Butuh penasihat hukum** |
| Perizinan usaha | Apakah izin pariwisata Itinerary ID mencakup penjualan lewat agen luar negeri; siapa menanggung jika agen menjanjikan hal di luar paket | **Verifikasi hukum** |
| Pajak | Komisi ke individu/badan non-residen (pemotongan, tax treaty) | **Verifikasi konsultan pajak** |
| Data pribadi | Lead UE tunduk GDPR; akses agen ke data pelanggan perlu dasar hukum dan perjanjian pemrosesan data; UU PDP Indonesia berlaku | **Verifikasi hukum** |
| Klaim harga | Pencantuman "Biaya Platform", klaim "all-inclusive", dan bandingan harga di negara sasaran | **Verifikasi hukum** |
| Struktur bertingkat | Legalitas komisi atas hasil affiliate bawahan di Indonesia dan China | **Verifikasi hukum sebelum Fase 2** |
| Pengungkapan afiliasi | Beberapa yurisdiksi (mis. FTC di AS) mewajibkan agen mengungkap hubungan komersial | Masukkan ke perjanjian |
| Perjanjian pemasok | Syarat komisi/diskon hotel dan tiket; ada tidaknya klausul kesetaraan harga dengan OTA | **Verifikasi kontrak** |
| Pembayaran lintas negara | Metode payout realistis per negara, biaya transfer, minimum payout | **Verifikasi** |
| Anti-fraud | Rate limit `POST /api/leads` dan `/api/agents/apply`; deteksi self-referral; batas lead manual per hari | Dibangun |

---

## 10. Risiko dan asumsi yang belum terbukti

| # | Asumsi / risiko | Cara memeriksa |
|---|---|---|
| R1 | Agen luar negeri mau dan mampu **follow-up sendiri**, bukan hanya membagikan link | Pilot 3–5 agen; ukur lead → `contacted` ≤24 jam dan rasio lead manual vs link |
| R2 | Spread pemasok 15–20% **stabil dan berlaku di semua pemasok** | `BookingCostLine` selama 2–3 bulan; catat spread terendah |
| R3 | Agen menerima komisi yang dibayar **setelah trip selesai** | Tanyakan kandidat sebelum perjanjian dikunci |
| R4 | Kandidat agen **sudah menyatakan setuju** dengan skema komisi tertentu | Daftar kandidat + persetujuan tertulis sebelum Fase 1 |
| R5 | Pelanggan tidak melewati agen (kontak langsung) | Aturan kunci §5.1 (kepemilikan) + harga sama semua kanal |
| R6 | Selisih kurs dan biaya transfer menggerus komisi bersih | Kebijakan: siapa menanggung, minimum payout |
| R7 | Agen menjanjikan hal di luar paket | Batasi tier `agent` ke yang sudah dibriefing; perjanjian jelas |
| R8 | Beban operasional tim kecil (tinjau agen, sengketa, payout manual) | Payout bulanan manual, batas jumlah agen pilot |
| R9 | **Harga publik hotel/tiket berubah**; katalog basi membuat harga kita lebih mahal atau menggerus margin | `publicPriceCheckedAt`, tinjau bulanan, tandai data lebih dari X hari |
| R10 | Pelanggan membandingkan **total paket**, bukan komponen | Uji A/B tampilan harga; pantau konversi |
| R11 | Baris Biaya Platform menurunkan konversi dibanding harga yang terlihat all-in | Uji tampilan; pertimbangkan melebur ke komponen jika terbukti |

---

## 11. Fase dan urutan implementasi

### Fase 0 — Prasyarat keamanan, integritas, dan harga *(blokir, ±2 minggu)*
1. Session bertanda tangan + perbaiki `middleware.ts`.
2. Tutup akses publik per-ID di `/api/bookings` dan `/api/trips`; pakai token checkout.
3. Hitung ulang harga di server pada `POST /api/trips`.
4. Beri auth pada `DELETE /api/trips`; ganti penghapusan keras dengan pembatalan.
5. Webhook Midtrans idempoten, status hanya maju, signature wajib diverifikasi.
6. `PUT /api/bookings/:id/status` + UI admin untuk `completed`; implementasi assign guide yang dijanjikan README.
7. Tutup loop lead → trip: `Trip.leadId`, `/plan?lead=`.
8. **Refactor harga** (§5.6): rumus baru, config baru, baris Biaya Platform, `test-pricing.ts`.
9. **Audit katalog:** hotel dan tiket diisi harga publik dengan `publicPriceCheckedAt`.
10. **Ganti klaim beranda dan label markup** (§5.8).

### Fase 1 — MVP Agent Program *(validasi model)*
- Skema §6 (`Agent`, `CommissionRule`, `Commission`, `Payout`, `BookingCostLine`, `LeadActivity`, `AuditLog`, kolom baru).
- Onboarding + perjanjian + `refCode`; atribusi jalur A/B/C; aturan kunci §5.1.
- Portal `/agent`: lead (daftar, tambah, catatan, status), **Buat Penawaran**, link checkout, komisi read-only.
- Komisi dari webhook; `approved` setelah trip selesai; **payout manual bulanan** dari `/finance/payouts`.
- Input biaya aktual dan laporan margin pemasok.
- `/cs` menampilkan kepemilikan agen.

### Fase 2 *(hanya jika gerbang §2.3 tercapai)*
- Struktur agen → affiliate (§3.1) bila hukum dan ekonomi mendukung.
- Penyesuaian `MarginTarget` dan `CadanganKomisi` berdasarkan data spread.
- Kanban dengan pengingat follow-up (email/WhatsApp), SLA respons.
- Dashboard performa admin (konversi per agen, per negara).
- Clawback otomatis, laporan pajak.

### Fase 3
- Materi promosi, halaman landing per agen, multi-bahasa lanjutan.
- Payout otomatis lintas negara.

---

## 12. Kriteria penerimaan (Fase 0 dan 1)

- **AC1.** Cookie sesi yang dimodifikasi ditolak di middleware dan semua route handler.
- **AC2.** Agen A tidak dapat membaca/mengubah lead, trip, booking, atau komisi agen B lewat UI maupun API (diuji dengan ID tebakan).
- **AC3.** Lead dengan email/telepon yang sama dengan lead terkunci tidak membuat kepemilikan ganda; tercatat di `LeadActivity`.
- **AC4.** `Trip` dari `/plan?lead=ID` menyimpan `leadId` dan `agentId`; lead pindah ke `quoted`.
- **AC5.** Notifikasi Midtrans yang sama dikirim dua kali menghasilkan satu `Payment` efektif dan satu `Commission`.
- **AC6.** Komisi = `CadanganKomisi` hasil hitung ulang server × `payoutShare`; manipulasi `body.pricing` tidak mengubah komisi.
- **AC7.** Booking yang batal/refund sebelum `approved` membuat komisi `void`; setelah `paid` menghasilkan `clawback`.
- **AC8.** Status `booked/paid/completed` pada lead tidak bisa diubah manual oleh agen.
- **AC9.** Override kepemilikan oleh admin menolak permintaan tanpa `reason` dan menulis `AuditLog`.
- **AC10.** Admin dapat meng-ekspor komisi `approved` per agen untuk payout; finance dapat menandai `paid` dengan bukti.
- **AC11.** `scripts/test-pricing.ts` lulus untuk semua tier pax: `Total = (Subtotal + MarginTarget + CadanganKomisi) / (1 − gatewayRate)` dan `BiayaPlatform = Total − Subtotal`, termasuk pembulatan.
- **AC12.** Builder dan checkout menampilkan satu baris **Biaya Platform** (tanpa persen dan kata "markup") di EN, ID, dan ZH; klaim "tanpa markup tersembunyi" tidak ada di locale mana pun.
- **AC13.** Hotel dan tiket pada katalog bertanda tanggal pengecekan harga publik; item lewat batas yang ditetapkan ditandai di admin.
- **AC14.** Finance dapat memasukkan biaya aktual per komponen dan melihat margin pemasok terealisasi per bulan.
- **AC15.** Perubahan `PriceConfig` tercatat di `AuditLog` dan tidak mengubah harga booking yang sudah dibuat.

---

## 13. Keputusan

### 13.1 Terkunci
| # | Keputusan |
|---|---|
| L1 | Rumus harga: `Total = (Subtotal + MarginTarget + CadanganKomisi) / (1 − gatewayRate)` |
| L2 | Armada sendiri: markup masuk ke rate per km, tanpa baris markup transport terpisah |
| L3 | Hotel dan tiket: harga publik tanpa markup; komisi/diskon pemasok menjadi margin tambahan yang tidak ditampilkan |
| L4 | Markup operasional diganti satu baris **Biaya Platform** ke pelanggan |
| L5 | Dasar komisi = `CadanganKomisi` (angka pasti), bukan spread pemasok |
| L6 | Harga sama di semua kanal; komisi agen tidak ditampilkan ke pelanggan |
| L7 | Agen tidak memegang uang pelanggan; pembayaran langsung via Midtrans |
| L8 | Struktur bertingkat agen → affiliate tidak di Fase 1 (kolom data disiapkan) |

### 13.2 Perlu diisi pemilik bisnis
| # | Keputusan | Usulan default |
|---|---|---|
| D1 | `marginTargetRate`, `commissionReserveRate` per tier pax, dan `gatewayRate` | Isi setelah biaya Midtrans aktual diketahui; `MarginTarget` jangan nol sebelum data spread 2–3 bulan |
| D2 | `payoutShare` affiliate vs agen | Agen 100% dari cadangan; affiliate (jika CS yang menangani follow-up) lebih kecil |
| D3 | Pemicu `approved` | Trip `completed` + 7 hari |
| D4 | Lama kunci lead dan batas stale | 60 hari / 14 hari tanpa aktivitas |
| D5 | Siapa menanggung selisih kurs dan biaya transfer | Dipotong dari payout; minimum payout _isi_ |
| D6 | Eksklusivitas wilayah/negara per agen | Tidak eksklusif di Fase 1 |
| D7 | Jumlah agen pilot dan gerbang Fase 2 | 3–5 agen, ≥5 booking lunas/8 minggu |
| D8 | Penyusun perjanjian agen dan peninjau hukum/pajak/GDPR | Penasihat hukum + konsultan pajak sebelum agen pertama aktif |
| D9 | Batas umur data harga publik sebelum ditandai basi | Usulan: 30 hari |
| D10 | Apakah agen China yang sudah bekerja sama sudah punya jaringan affiliate siap jalan | Menentukan apakah §3.1 diprioritaskan |
| D11 | Konfirmasi syarat komisi/diskon dengan pemasok (tertulis atau lisan, ada klausul kesetaraan harga atau tidak) | Cek kontrak 5 hotel terbesar |

---

## Lampiran A — Rujukan kode

| Temuan | Lokasi |
|---|---|
| Token sesi = base64 JSON tanpa tanda tangan | `src/lib/auth.ts` (`createSessionToken`, `verifySessionToken`); `src/middleware.ts` |
| `POST /api/leads` publik, tanpa referral/dedupe | `src/app/api/leads/route.ts` (POST) |
| Model `Lead` tanpa relasi ke Trip/Booking | `prisma/schema.prisma` (`model Lead`) |
| "Convert to Trip" hanya link ke `/plan`; parameter diabaikan | `src/app/cs/page.tsx`; `src/app/plan/page.tsx` tidak memakai `useSearchParams` |
| Lookup publik per ID mengembalikan `user`, `payments`, `expenses` | `src/app/api/bookings/route.ts` (GET `id`); `src/app/api/trips/route.ts` (GET `id`/`ids`) |
| Harga dari `body.pricing` tanpa hitung ulang | `src/app/api/trips/route.ts` (POST) |
| `DELETE` trip tanpa auth, menghapus payments/bookings | `src/app/api/trips/route.ts` (DELETE) |
| Webhook membuat `Payment` baru tiap notifikasi; signature dilewati untuk key `test-key`/`placeholder` | `src/app/api/midtrans/notification/route.ts` |
| Tidak ada kode yang menyetel `completed`/`in_progress`; tidak ada PUT booking/trip | pencarian `src/` |
| Tier margin 12/8/5% | `src/lib/pricing.ts` (`marginTier`), `prisma/seed.ts` (`PriceConfig`) |
| Baris markup ditampilkan ke pelanggan | `src/app/plan/page.tsx` (baris `t.builder.marginLabel`) |
| Label "Operational Markup" / "Markup Operasional" / "运营服务费率" | `src/i18n/translations.ts` (`marginLabel`, EN/ID/ZH) |
| Klaim "No hidden route markups" / "Tidak ada markup rute tersembunyi" | `src/i18n/translations.ts` (`card1Desc`, EN dan ID) |
| Margin terealisasi = revenue − pengeluaran lapangan | `src/app/finance/page.tsx` (`netRealizedMargin`) |
| Guest user dibuat otomatis saat trip dibuat tanpa login | `src/app/api/trips/route.ts` (POST) |
| Role hardcoded 5 nilai | `src/lib/auth.ts` (`SessionUser`), `src/middleware.ts`, `src/app/login/page.tsx` |
