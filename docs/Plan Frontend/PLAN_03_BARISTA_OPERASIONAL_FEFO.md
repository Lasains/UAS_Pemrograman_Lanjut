# RENCANA SPESIFIKASI DESAIN FRONTEND (PLAN 03)
## Modul 03: Halaman Operasional Bar Barista (4 Halaman Tersendiri)
**Target File Implementasi**:  
- `resources/js/Pages/Barista/Dashboard.tsx` — Dasbor ringkasan bar barista  
- `resources/js/Pages/Usage/Index.tsx` — Catat Pemakaian & Riwayat FEFO  
- `resources/js/Pages/Batches/Create.tsx` — Penerimaan Batch Baru  
- `resources/js/Pages/Waste/Create.tsx` — Lapor Bahan Rusak & Status Tiket  
- `resources/js/Components/SmartWarningDialog.tsx` — Komponen bersama deviasi FEFO  
**Referensi Kontrak**: [Desain.md](file:///home/lasains/ssd2/matkul/pemograman%20lanjut/projek/Desain.md), [PRD.md](file:///home/lasains/ssd2/matkul/pemograman%20lanjut/projek/PRD.md), dan [inventory.d.ts](file:///home/lasains/ssd2/matkul/pemograman%20lanjut/projek/resources/js/types/inventory.d.ts)

---

## 1. RINGKASAN ALUR KERJA BARISTA & LOGIKA BISNIS FEFO SEMI-OTOMATIS

### 1.1 Persona Barista & Kebutuhan Antarmuka Cepat
Barista bertugas meracik minuman di stasiun espresso pada jam sibuk (*rush hour*). Dalam kondisi tangan basah, antrean pelanggan panjang, dan ritme kerja cepat:
1. **Prinsip 1-Detik (Glanceable UI)**: Barista harus memahami sisa stok susu segar atau biji kopi dan status kedaluwarsanya dalam 1 detik pandang.
2. **Minimasi Klik (Frictionless)**: Tombol aksi utama harus besar (*touch-friendly*), aksi pemakaian bahan harus dapat diselesaikan dalam maksimal 3 langkah cepat.
3. **Mengapa FEFO Semi-Otomatis (Bukan Full Otomatis)?**
   - *Full Otomatis (Sistem Memaksa Potong Batch Terlama)*: Sering kali gagal di dunia nyata kafe karena barista fisik bisa jadi sudah membuka karton susu lain di chiller bar. Jika sistem memaksakan batch terlama secara kaku tanpa konfirmasi fisik, data inventaris di sistem akan meleset dari kondisi fisik (*inventory drift*).
   - *Semi-Otomatis dengan Smart Warning*: Sistem otomatis memilih dan merekomendasikan batch terdekat kedaluwarsa secara default, namun memberi keleluasaan barista memilih batch fisik lain dengan syarat wajib memasukkan **Alasan Deviasi**.

---

### 1.2 Diagram Alur Logika FEFO & Smart Warning

```mermaid
flowchart TD
    Start([Barista Klik '+ Catat Pemakaian' atau 'Pakai Bahan Ini']) --> OpenDrawer[Buka Slide-Over Drawer Pemakaian di Sisi Kanan]
    OpenDrawer --> FetchBatches{Ambil Batch Aktif Stok > 0 & Urutkan FEFO ASC}
    
    FetchBatches -->|Tidak Ada Batch| EmptyState[Tampilkan Peringatan: Stok Kosong / Perlu Restock]
    FetchBatches --> RecommendTop["Tandai Batch Teratas:<br/>[★ REKOMENDASI FEFO]<br/>(Otomatis Terpilih / Checked Default)"]
    
    RecommendTop --> BaristaChoice{Pilihan Batch oleh Barista}
    
    BaristaChoice -->|Pilih Batch #0 FEFO| ModeNormal[is_fefo_compliant = true<br/>deviation_reason = null<br/>(Form Deviasi Tersembunyi)]
    BaristaChoice -->|Pilih Batch Lain| ModeDeviasi["Inline Warning Terbuka di Drawer:<br/>Warna Amber #C88242<br/>Field Alasan Deviasi Terbuka Otomatis (Wajib >= 5 char)"]
    
    ModeNormal --> InputQty[Input Kuantitas Pemakaian: misal 250 ml]
    ModeDeviasi --> InputReason[Isi Alasan Deviasi] --> InputQty
    
    InputQty --> SubmitCheck{Kuantitas <= current_stock?}
    SubmitCheck -->|Lebih Besar| ErrorQty[Error: Kuantitas Melebihi Sisa Stok Batch]
    SubmitCheck -->|Valid| SubmitPost[Kirim POST /usage via Inertia useForm]
    SubmitPost --> CloseDrawer[Tutup Drawer & Tampilkan Flash Message Sukses]
```

---

## 2. SPESIFIKASI MOCKUP STITCH UI & BLUEPRINT 4 HALAMAN BARISTA

Seluruh mockup visual antarmuka kerja Barista telah selesai dibuat dan diunduh dari proyek Google Stitch (ID: `3585613475449128159`), tersimpan lokal di direktori `docs/stitch/`:

| Halaman Barista | Screen ID Stitch | File HTML Mockup | File Screenshot Mockup |
| :--- | :--- | :--- | :--- |
| **Dasbor Operasional Barista** | `ba7f0f7359a44246b578995efb06bc63` | [barista_dasbor_operasional.html](file:///home/lasains/ssd2/matkul/pemograman%20lanjut/projek/docs/stitch/barista_dasbor_operasional.html) | [barista_dasbor_operasional.png](file:///home/lasains/ssd2/matkul/pemograman%20lanjut/projek/docs/stitch/barista_dasbor_operasional.png) |
| **Catat Pemakaian Bahan FEFO** | `ec5b573afea8418ab17d86a9ea4a8ed8` | [barista_catat_pemakaian_fefo.html](file:///home/lasains/ssd2/matkul/pemograman%20lanjut/projek/docs/stitch/barista_catat_pemakaian_fefo.html) | [barista_catat_pemakaian_fefo.png](file:///home/lasains/ssd2/matkul/pemograman%20lanjut/projek/docs/stitch/barista_catat_pemakaian_fefo.png) |
| **Penerimaan Batch Baru** | `17b9448dbc244fff84caa5c85867a957` | [barista_penerimaan_batch.html](file:///home/lasains/ssd2/matkul/pemograman%20lanjut/projek/docs/stitch/barista_penerimaan_batch.html) | [barista_penerimaan_batch.png](file:///home/lasains/ssd2/matkul/pemograman%20lanjut/projek/docs/stitch/barista_penerimaan_batch.png) |
| **Lapor Bahan Rusak/Basi** | `7409d85472024dfab7bfb8d5ca61f2e6` | [barista_lapor_bahan_rusak.html](file:///home/lasains/ssd2/matkul/pemograman%20lanjut/projek/docs/stitch/barista_lapor_bahan_rusak.html) | [barista_lapor_bahan_rusak.png](file:///home/lasains/ssd2/matkul/pemograman%20lanjut/projek/docs/stitch/barista_lapor_bahan_rusak.png) |

---

### 2.1 Halaman A: Dasbor Operasional Barista (`Pages/Barista/Dashboard.tsx`)
**Route**: `dashboard.barista`  
**Mockup Acuan**: [barista_dasbor_operasional.html](file:///home/lasains/ssd2/matkul/pemograman%20lanjut/projek/docs/stitch/barista_dasbor_operasional.html)

#### Struktur Kanvas & Komponen Utama:
1. **Header Dasbor & Status Shift**:
   - Judul Halaman: `"Dasbor Operasional Barista"` (`text-2xl font-bold tracking-tight text-[#241408]`)
   - Badge Status Shift: `"Shift Pagi Aktif • Bar Utama"` (`bg-emerald-50 text-emerald-800 border-emerald-200`)
   - Jam Operasional Real-time (`font-mono text-sm font-semibold text-[#5C3A21]`).
2. **Banner Peringatan Aktif & Prioritas FEFO (`UrgentFefoBanner.tsx`)**:
   - Wadah kontainer berlatar terracotta lembut: `bg-[#FDF2F0] border border-[#F8C6BF] rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4`.
   - Menyorot batch bahan paling mendesak yang harus segera dihabiskan shift ini (misal: *Fresh Milk Diamond Batch #BCH-20241026-A3F2 sisa 2.500 ml kedaluwarsa BESOK*).
   - Tombol Aksi Cepat: `[Pakai Batch Prioritas Ini]` (`bg-[#8C3D2B] hover:bg-[#733122] text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-sm`) yang mengarahkan ke halaman Catat Pemakaian dengan batch tersebut telah terisi otomatis.
3. **Tiga Kartu Sentuh Aksi Cepat (`QuickActionStrip.tsx`)**:
   - `grid grid-cols-1 sm:grid-cols-3 gap-4`:
     - **Tombol 1 (Espresso)**: `Link` ke `route('usage.create')` berlatar `bg-[#4A2C11] text-white hover:bg-[#241408] p-4 rounded-xl flex items-center gap-3.5 shadow-sm font-bold text-sm`.
     - **Tombol 2 (Parchment)**: `Link` ke `route('batches.create')` berlatar `bg-[#EDE4DC] text-[#241408] border border-[#EDE4DC] hover:bg-[#EDE4DC]/80 p-4 rounded-xl flex items-center gap-3.5 font-bold text-sm`.
     - **Tombol 3 (Amber)**: `Link` ke `route('waste.create')` berlatar `bg-[#FFF7ED] text-[#C88242] border border-[#FED7AA] hover:bg-[#FEEBC8] p-4 rounded-xl flex items-center gap-3.5 font-bold text-sm`.
4. **Ringkasan Kesehatan Inventaris Meja Bar (`BarHealthGrid.tsx`)**:
   - `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4`:
   - Kartu bahan utama (Fresh Milk 1L, Oatside 1L, Espresso Blend, Monin Syrup, Cup 8oz).
   - Menampilkan total sisa stok bar, countdown hari kedaluwarsa batch terdekat, dan indikator lampu lalu lintas (🟢 Aman > 7 hari, 🟡 Peringatan 3–7 hari, 🔴 Kritis < 3 hari).
5. **Ringkasan Aktivitas Terkini Shift Pagi (`ShiftActivityTimeline.tsx`)**:
   - Log kronologis 5 transaksi terakhir barista saat ini (pemakaian bahan dan penerimaan batch).

---

### 2.2 Halaman B: Catat Pemakaian Bahan FEFO (`Pages/Usage/Index.tsx`)
**Route**: `usage.create` | `usage.index`  
**Mockup Acuan**: [barista_catat_pemakaian_fefo.html](file:///home/lasains/ssd2/matkul/pemograman%20lanjut/projek/docs/stitch/barista_catat_pemakaian_fefo.html)  
**Layout Model**: **Split Workspace 2-Kolom (60% Form Input : 40% Live History Stream)**

#### Kolom Kiri: Form Interaktif Pemakaian FEFO (`lg:col-span-7 space-y-6 bg-[#F5EFEB] p-6 rounded-2xl border border-[#EDE4DC]`):
1. **Pilih Bahan Baku (`IngredientSelect.tsx`)**:
   - Input combobox dengan live filter kategori (`Dairy`, `Coffee Beans`, `Syrup`, dll.).
   - Menampilkan saldo total stok fisik di chiller bar (misal: *Total stok: 8.700 ml dari 3 batch aktif*).
2. **Daftar Kartu Radio Batch Terurut FEFO (`FefoBatchSelector.tsx`)**:
   - Batch diurutkan secara kaku dari `expiry_date` terdekat (ASC).
   - **Batch #0 (Teratas)**:
     - Terpilih secara default (`checked`).
     - Memiliki border tebal `#4A2C11`, latar `#F5EFEB`, dan kapsul gelap tebal `[★ REKOMENDASI FEFO]`.
     - Ditandai lokasi penyimpanan fisiknya (misal: *"Karton Depan Chiller Utama"*).
   - **Batch Lainnya (Bukan #0)**:
     - Kartu berlatar putih dengan border tipis `#EDE4DC`.
     - Jika barista mengklik batch ini, sistem mendeteksi **Deviasi FEFO**.
3. **Smart Warning Inline Deviasi FEFO (`DeviationWarningCard.tsx`)**:
   - Otomatis muncul secara mulus di bawah kartu batch jika barista memilih batch fisik selain batch rekomendasi #0.
   - Kotak peringatan bernuansa amber: `bg-[#FFF7ED] border border-[#FED7AA] p-4 rounded-xl space-y-3`.
   - Pesan peringatan: *"Perhatian: Anda memilih batch yang kedaluwarsanya lebih lama. Mohon konfirmasi alasan fisik."*
   - Field input wajib: `deviation_reason` (Textarea minimal 5 karakter, misal: *"Karton depan chiller sudah terbuka segelnya oleh shift sebelumnya"*).
4. **Input Kuantitas Pemakaian & Presets (`UsageQuantityInput.tsx`)**:
   - Input angka besar tebal (`text-xl font-bold font-mono`).
   - Tombol preset cepat sentuh: `[+200 ml]`, `[+500 ml]`, `[+1.000 ml]` (1 kotak), `[Habiskan Sisa Batch]`.
   - Real-time sisa stok preview setelah pengurangan.
5. **Tombol Submit Pemakaian**:
   - Tombol full-width espresso pekat: `[Catat Pemakaian Sekarang]` (`bg-[#4A2C11] text-white hover:bg-[#241408] py-3.5 rounded-xl font-bold text-sm shadow-md`).

#### Kolom Kanan: Log Pemakaian Hari Ini (`lg:col-span-5 bg-[#F5EFEB] p-6 rounded-2xl border border-[#EDE4DC]`):
- **Daftar Transaksi Sesi Aktif (`TodayUsageList.tsx`)**:
  - Menampilkan riwayat pemakaian shift hari ini.
  - Setiap baris dilengkapi status kepatuhan:
    - Patuh FEFO: Badge hijau `✓ FEFO Patuh` (`bg-emerald-50 text-emerald-800 border-emerald-200`).
    - Deviasi: Badge amber `⚠ Deviasi` (`bg-amber-50 text-amber-800 border-amber-200`) dengan tooltip alasan deviasi.

---

### 2.3 Halaman C: Penerimaan Batch Baru (`Pages/Batches/Create.tsx`)
**Route**: `batches.create`  
**Mockup Acuan**: [barista_penerimaan_batch.html](file:///home/lasains/ssd2/matkul/pemograman%20lanjut/projek/docs/stitch/barista_penerimaan_batch.html)  
**Layout Model**: **Split Workspace 2-Kolom (60% Form Input Penerimaan : 40% 5 Batch Terakhir Masuk)**

#### Kolom Kiri: Form Penerimaan Batch Baru (`lg:col-span-7 bg-[#F5EFEB] p-6 rounded-2xl border border-[#EDE4DC] space-y-5`):
1. **Pilih Bahan Baku Masuk**: Combobox bahan baku dengan kategori dan SKU vendor.
2. **Nomor Batch / Lot Supplier**: Input teks kode batch (misal: `BCH-20241028-MK01`) atau tombol generate otomatis.
3. **Tanggal Kedaluwarsa & Kalkulator Umur Simpan**:
   - Date picker `expiry_date`.
   - Preview dinamis badge lampu lalu lintas umur simpan (misal: `🟢 Aman: 14 hari simpan`).
4. **Jumlah Stok Masuk & Biaya Satuan**:
   - `initial_stock` (angka + satuan unit otomatis: `ml`, `gram`, `pcs`).
   - `cost_per_unit` (harga beli per satuan unit dalam Rupiah).
   - Kalkulasi otomatis total nilai batch: `initial_stock * cost_per_unit` (misal: *"Total Nilai Aset Masuk: Rp 125.000"*).
5. **Tombol Simpan**: `[Simpan & Masukkan Batch ke Inventaris]` (`bg-[#4A2C11] text-white`).

#### Kolom Kanan: 5 Batch Terakhir Diterima (`lg:col-span-5 bg-[#F5EFEB] p-6 rounded-2xl border border-[#EDE4DC]`):
- Tabel riwayat penerimaan batch terakhir: Kode Batch, Bahan, Qty Masuk, Tanggal Penerimaan, dan Status Umur Simpan.

---

### 2.4 Halaman D: Lapor Bahan Rusak / Basi (`Pages/Waste/Create.tsx`)
**Route**: `waste.create`  
**Mockup Acuan**: [barista_lapor_bahan_rusak.html](file:///home/lasains/ssd2/matkul/pemograman%20lanjut/projek/docs/stitch/barista_lapor_bahan_rusak.html)  
**Layout Model**: **Split Workspace 2-Kolom (50% Form Pelaporan : 50% Status Tiket Saya)**

#### Kolom Kiri: Form Pelaporan Bahan Rusak (`lg:col-span-6 bg-[#F5EFEB] p-6 rounded-2xl border border-[#EDE4DC] space-y-5`):
1. **Pilih Batch Rusak**: Dropdown batch aktif yang tersedia di bar. Setelah dipilih, muncul kartu mini: kode batch, sisa stok, dan tanggal kedaluwarsa.
2. **Kuantitas Rusak (`waste_quantity`)**: Validasi otomatis `waste_quantity <= current_stock`.
3. **Alasan Kerusakan (`reason`)**:
   - Dropdown pilihan terstandarisasi: `Kadaluwarsa di Rak`, `Kemasan Rusak / Bocor`, `Bau Asam / Rasa Berubah`, `Kontaminasi Fisik`, `Lainnya`.
4. **Catatan Tambahan (`notes`)**: Textarea kondisi fisik bahan di lapangan.
5. **Tombol Pengajuan Amber**: `[Kirim Laporan ke Supervisor]` (`bg-[#C88242] hover:bg-[#B37033] text-white font-bold py-3 rounded-xl shadow-sm`).
   - Dilengkapi catatan transparan: *"Stok belum dipotong secara permanen hingga diverifikasi fisik oleh supervisor."*

#### Kolom Kanan: Status Tiket Laporan Barista (`lg:col-span-6 bg-[#F5EFEB] p-6 rounded-2xl border border-[#EDE4DC]`):
- Daftar tiket pengajuan barista login saat ini:
  - 🟡 `pending`: *"Menunggu Verifikasi Supervisor"* (`bg-amber-50 text-amber-800 border-amber-200`)
  - 🟢 `approved`: *"Disetujui & Stok Dihapus"* (`bg-emerald-50 text-emerald-800 border-emerald-200`)
  - ⚪ `rejected`: *"Ditolak"* (`bg-stone-100 text-stone-700 border-stone-300`) dengan alasan penolakan supervisor.
    * Batch diurutkan kronologis tanggal kedaluwarsa terdekat.
    * Batch teratas otomatis terpilih dan diberi badge mencolok: `[★ REKOMENDASI FEFO]` berlatar espresso pekat `#4A2C11`.
  - **Inline Warning Deviasi (Tanpa Modal Baru)**:
    * Jika barista memilih batch di bawah rekomendasi teratas, secara otomatis di dalam drawer muncul kotak peringatan amber:
      - Border `border-[#FED7AA] bg-[#FFF7ED] rounded-lg p-3.5 mt-3`.
      - Ikon peringatan + teks: *"Deviasi FEFO Terdeteksi: Anda memilih batch yang lebih lama kedaluwarsa. Wajib isi alasan fisik pengambilan:"*
      - Textarea alasan deviasi terintegrasi langsung di bawahnya (minimal 5 karakter).
  - **Input Kuantitas Pemakaian**:
    * Kotak input angka besar (`h-12 text-xl font-bold text-center bg-surface-canvas border-surface-border rounded-lg`).
    * Indikator sisa stok real-time (contoh: *"Sisa setelah pakai: 750 ml"*).
  - **Tombol Konfirmasi**:
    * `[Konfirmasi & Kurangi Stok]` (`bg-brand-primary hover:bg-brand-primary-hover text-white w-full h-12 rounded-lg font-bold`).

---

### 2.3 Teks Prompt Siap Pakai untuk Google Stitch

#### Prompt Bahasa Indonesia (In-Shell Content View)
```text
Buatkan desain antarmuka kerja dalam kanvas (In-Shell Content View) untuk Dasbor Operasional Barista FEFO pada aplikasi kafe "BeanFlow" bernuansa warm artisan coffee (espresso, karamel, oat milk):

PENTING: Jangan membuat sidebar kiri atau header atas. Desain ini adalah isi konten halaman di dalam slot utama (viewport kanvas susu hangat #FAF7F2).

Elemen Konten yang Ditampilkan:
1. Paling Atas: Banner Peringatan Kritis FEFO warna terracotta lembut (#FDF2F0 dengan border #F8C6BF). Teks tebal: "Prioritas Pakai: Fresh Milk Diamond Batch #B-01 expired BESOK (26 Okt)!" dilengkapi tombol terracotta "#8C3D2B" "Pakai Batch Ini".
2. Tiga Tombol Aksi Cepat Barista (Tinggi 72px, touch-friendly):
   - Tombol Espresso #4A2C11: "+ Catat Pemakaian Bahan" (ikon Flame/Coffee).
   - Tombol Parchment #EDE4DC: "+ Penerimaan Batch Baru" (ikon PackagePlus).
   - Tombol Amber #FFF7ED border #FED7AA: "! Lapor Bahan Rusak/Basi" (ikon AlertTriangle).
3. Grid 4 Kartu Bahan Cepat Bar (Fresh Milk, Oat Milk, Espresso Blend, Sirup Karamel):
   - Desain kartu oat latte #F5EFEB, border halus #EDE4DC, rounded-xl.
   - Angka stok besar tebal "4.200 ml", badge lampu lalu lintas kedaluwarsa (Hijau Aman 14 Hari, Kuning Warning 4 Hari, Merah Kritis 1 Hari), dan tombol sentuh "Pakai Bahan".
4. Di sisi kanan layar sedang aktif: Sebuah Slide-Over Action Drawer (lebar 480px, latar #F5EFEB) dengan judul "Catat Pemakaian FEFO":
   - Menampilkan kartu batch teratas dengan badge emas/espresso "[★ REKOMENDASI FEFO]".
   - Terdapat kotak peringatan amber deviasi FEFO yang terbuka secara inline dengan input alasan deviasi.
   - Input kuantitas angka besar dan tombol espresso pekat "Konfirmasi & Kurangi Stok".

Desain sangat bersih, ergonomis untuk barista jam sibuk, kontras tinggi, elegan ala coffee shop modern.
```

#### English Prompt (High-Fidelity for Stitch AI)
```text
An in-shell content view for a Barista FEFO Operational Console in a specialty coffee inventory SaaS ("BeanFlow"), set in a warm artisan coffee aesthetic.
IMPORTANT: Do not render an outer sidebar or top navigation bar. This design is strictly the interior workspace canvas (background #FAF7F2).

Layout Components:
1. Top Urgent FEFO Alert Strip: Soft terracotta banner (#FDF2F0 with #F8C6BF border). Text: "Urgent Shelf-Life Alert: Fresh Milk Diamond Batch #B-01 expires TOMORROW!" with a solid terracotta button "#8C3D2B" "Use Batch Now".
2. Three Large Touch Action Cards (72px height, touch-friendly):
   - Deep roasted espresso "#4A2C11": "+ Record Ingredient Usage"
   - Unbleached parchment "#EDE4DC": "+ Receive Batch Restock"
   - Warm spun amber "#FFF7ED" with border "#FED7AA": "! Report Spoiled Goods"
3. Quick-Bar Ingredient Grid (4 columns: Fresh Milk, Oatside Oat Milk, House Espresso Beans, Monin Caramel):
   - Warm oat latte cards (#F5EFEB, rounded-xl, #EDE4DC border).
   - Large stock typography "4,200 ml", traffic-light expiry capsules (Green Safe >7d, Amber Warning 3-7d, Red Critical <3d), and an instant "Use Now" action button.
4. Active Right Slide-Over Action Drawer (480px wide, #F5EFEB surface):
   - Header "Record FEFO Usage".
   - Batch cards ordered by earliest expiry with top card marked "[★ FEFO RECOMMENDATION]".
   - An inline spun amber warning box displaying "FEFO Deviation Detected: Non-recommended batch chosen" with a required inline reason textarea.
   - Large numeric quantity input and a full-width deep espresso submit button.
High contrast, clean typography (Plus Jakarta Sans/Figtree), modern touch-ergonomic POS design.
```

---

## 3. ARSITEKTUR TEKNIS FRONTEND (REACT + INERTIA)

### 3.1 Lokasi File & Relasi Komponen
```text
resources/js/
├── Pages/
│   ├── Barista/
│   │   └── Dashboard.tsx               # Halaman A: Dasbor ringkasan bar barista
│   ├── Usage/
│   │   └── Index.tsx                   # Halaman B: Catat Pemakaian & Riwayat FEFO
│   ├── Batches/
│   │   └── Create.tsx                  # Halaman C: Penerimaan Batch Baru dari Supplier
│   └── Waste/
│       └── Create.tsx                  # Halaman D: Lapor Bahan Rusak & Status Tiket Saya
├── Components/
│   └── Barista/
│       ├── FefoAlertBanner.tsx         # Banner peringatan kedaluwarsa kritis (Halaman A)
│       ├── QuickActionCards.tsx        # 3 Tombol aksi cepat bar (Halaman A)
│       ├── QuickIngredientsGrid.tsx    # Grid kartu bahan favorit bar (Halaman A)
│       ├── FefoBatchRadioGroup.tsx     # RadioGroup batch FEFO terurut (Halaman B)
│       ├── DeviationInlineWarning.tsx  # Kotak amber deviasi FEFO inline (Halaman B)
│       ├── LiveTotalCalculator.tsx     # Kalkulasi total nilai batch real-time (Halaman C)
│       ├── MyWasteTicketsLog.tsx       # Tabel status tiket milik barista (Halaman D)
│       └── SmartWarningDialog.tsx      # Dialog konfirmasi deviasi FEFO (komponen bersama)
```

---

### 3.2 Kontrak Tipe Data TypeScript

Mengacu pada [`resources/js/types/inventory.d.ts`](file:///home/lasains/ssd2/matkul/pemograman%20lanjut/projek/resources/js/types/inventory.d.ts):

```typescript
// resources/js/types/usage.ts
import { Ingredient, IngredientBatch } from '@/types/inventory';

export interface BaristaDashboardProps {
    popularIngredients: (Ingredient & {
        nearest_batch?: IngredientBatch;
        active_batches_count: number;
    })[];
    recentUsagesToday: {
        id: number;
        ingredient_name: string;
        batch_code: string;
        quantity: number;
        unit: string;
        time_ago: string;
        is_fefo_compliant: boolean;
    }[];
}

export interface StockUsageFormData {
    ingredient_batch_id: number | null;
    quantity_used: number | '';
    is_fefo_compliant: boolean;
    deviation_reason: string;
    notes: string;
}
```

---

### 3.3 Logika Deteksi Deviasi & Form Handling Inertia

```typescript
// resources/js/Pages/Usage/CreateUsageModal.tsx
import { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { Ingredient, IngredientBatch } from '@/types/inventory';
import { SmartWarningDialog } from '@/Components/SmartWarningDialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/Components/ui/dialog';
import { Button } from '@/Components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/Components/ui/radio-group';
import { Label } from '@/Components/ui/label';
import { Input } from '@/Components/ui/input';
import { cn } from '@/lib/utils';
import { Flame, Check, AlertCircle } from 'lucide-react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    ingredients: Ingredient[];
    preselectedIngredientId?: number;
}

export function CreateUsageModal({ isOpen, onClose, ingredients, preselectedIngredientId }: Props) {
    const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);
    const [activeBatches, setActiveBatches] = useState<IngredientBatch[]>([]);
    const [warningDialogOpen, setWarningDialogOpen] = useState(false);
    const [pendingBatchId, setPendingBatchId] = useState<number | null>(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        ingredient_batch_id: null as number | null,
        quantity_used: '' as number | '',
        is_fefo_compliant: true,
        deviation_reason: '',
        notes: '',
    });

    // Otomatis urutkan batch berdasarkan tanggal kedaluwarsa terdekat (FEFO Order)
    useEffect(() => {
        if (selectedIngredient && selectedIngredient.batches) {
            const sorted = [...selectedIngredient.batches]
                .filter((b) => b.status === 'active' && b.current_stock > 0)
                .sort((a, b) => new Date(a.expiry_date).getTime() - new Date(b.expiry_date).getTime());

            setActiveBatches(sorted);

            if (sorted.length > 0) {
                // Batch #0 otomatis terpilih sebagai rekomendasi FEFO default
                setData('ingredient_batch_id', sorted[0].id);
                setData('is_fefo_compliant', true);
                setData('deviation_reason', '');
            }
        }
    }, [selectedIngredient]);

    // Handler saat barista memilih batch fisik di RadioGroup
    const handleBatchSelection = (batchId: number) => {
        const fefoRecommendedBatch = activeBatches[0];

        if (fefoRecommendedBatch && batchId !== fefoRecommendedBatch.id) {
            // TERDETEKSI DEVIASI: Barista memilih batch bukan rekomendasi pertama
            setPendingBatchId(batchId);
            setWarningDialogOpen(true);
        } else {
            // Sesuai Rekomendasi FEFO
            setData((prev) => ({
                ...prev,
                ingredient_batch_id: batchId,
                is_fefo_compliant: true,
                deviation_reason: '',
            }));
        }
    };

    // Konfirmasi dari Smart Warning Dialog
    const handleConfirmDeviation = (reason: string) => {
        if (pendingBatchId) {
            setData((prev) => ({
                ...prev,
                ingredient_batch_id: pendingBatchId,
                is_fefo_compliant: false,
                deviation_reason: reason,
            }));
        }
        setWarningDialogOpen(false);
        setPendingBatchId(null);
    };

    // Batal deviasi -> Kembali ke batch rekomendasi FEFO
    const handleCancelDeviation = () => {
        if (activeBatches.length > 0) {
            setData((prev) => ({
                ...prev,
                ingredient_batch_id: activeBatches[0].id,
                is_fefo_compliant: true,
                deviation_reason: '',
            }));
        }
        setWarningDialogOpen(false);
        setPendingBatchId(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('usage.store'), {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    // ... Render form modal & sub-komponen
}
```

---

### 3.4 Komponen Smart Warning Dialog

```typescript
// resources/js/Components/SmartWarningDialog.tsx
import { useState } from 'react';
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
} from '@/Components/ui/alert-dialog';
import { Button } from '@/Components/ui/button';
import { Textarea } from '@/Components/ui/textarea';
import { AlertTriangle } from 'lucide-react';
import { IngredientBatch } from '@/types/inventory';

interface SmartWarningProps {
    isOpen: boolean;
    fefoBatch?: IngredientBatch;
    selectedBatch?: IngredientBatch;
    onConfirm: (reason: string) => void;
    onCancel: () => void;
}

export function SmartWarningDialog({
    isOpen,
    fefoBatch,
    selectedBatch,
    onConfirm,
    onCancel,
}: SmartWarningProps) {
    const [reason, setReason] = useState('');
    const isValidReason = reason.trim().length >= 5;

    return (
        <AlertDialog open={isOpen}>
            <AlertDialogContent className="max-w-md border-amber-300 bg-amber-50/70">
                <AlertDialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="rounded-full bg-[#FFF7ED] p-2 text-[#C88242]">
                            <AlertTriangle className="h-6 w-6" />
                        </div>
                        <AlertDialogTitle className="text-content-high font-bold text-lg">
                            Peringatan Deviasi FEFO
                        </AlertDialogTitle>
                    </div>
                    <AlertDialogDescription className="text-content-medium text-sm pt-2">
                        Anda memilih batch <strong>{selectedBatch?.batch_code}</strong> (Exp: {selectedBatch?.expiry_date}), 
                        padahal ada batch <strong>{fefoBatch?.batch_code}</strong> yang kedaluwarsa lebih dekat 
                        (<strong>Exp: {fefoBatch?.expiry_date}</strong>).
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <div className="my-3 space-y-2">
                    <label className="text-xs font-semibold text-content-high uppercase tracking-wide">
                        Alasan Deviasi Fisik (Wajib):
                    </label>
                    <Textarea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Contoh: Kemasan batch ini sudah terlanjur dibuka di bar chiller..."
                        className="bg-surface-canvas border-surface-border text-content-high text-sm focus:ring-brand-secondary"
                        rows={3}
                    />
                    <div className="flex justify-between text-xs">
                        <span className={isValidReason ? 'text-emerald-800 font-medium' : 'text-brand-tertiary font-medium'}>
                            {isValidReason ? '✓ Alasan valid' : '* Minimal 5 karakter'}
                        </span>
                        <span className="text-content-subtle">{reason.trim().length}/5 min</span>
                    </div>
                </div>

                <AlertDialogFooter className="gap-2 sm:gap-0">
                    <Button variant="outline" onClick={onCancel} className="text-content-medium border-surface-border hover:bg-surface-container-high">
                        Batal & Gunakan FEFO
                    </Button>
                    <Button
                        disabled={!isValidReason}
                        onClick={() => onConfirm(reason)}
                        className="bg-brand-secondary hover:bg-brand-secondary-hover text-white font-semibold disabled:opacity-50"
                    >
                        Tetap Gunakan Batch Ini
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
```

---

## 4. EDGE CASES & ERROR HANDLING

### 4.1 Kuantitas Melebihi `current_stock`
- **Pengecekan di Klien (*Client-Side Guard*)**:
  Saat barista mengetik angka pemakaian, sistem langsung menghitung sisa stok:
  ```typescript
  const selectedBatch = activeBatches.find(b => b.id === data.ingredient_batch_id);
  const isOverStock = Number(data.quantity_used) > (selectedBatch?.current_stock ?? 0);
  ```
  Jika `isOverStock === true`:
  - Input border menjadi terakota tebal (`border-brand-tertiary focus:ring-brand-tertiary`).
  - Muncul teks peringatan: *"Kuantitas (xxx) melebihi stok fisik batch yang tersedia (yyy)"* (`text-brand-tertiary`).
  - Tombol Submit dinonaktifkan (`disabled={isOverStock || processing}`).

### 4.2 Kasus Bahan Tanpa Batch Aktif (Stok Habis Total)
- Jika bahan yang dipilih memiliki `activeBatches.length === 0`:
  - RadioGroup disembunyikan.
  - Tampilkan kartu *Empty State*: Box abu-abu dengan ikon `PackageX`, teks *"Semua batch bahan ini sudah habis atau kedaluwarsa"*.
  - Tampilkan tombol cepat `[+ Restock Batch Baru]` yang langsung mengarahkan ke modal penerimaan barang.

### 4.3 Barista Menutup Dialog Peringatan Tanpa Mengisi Alasan
- Jika barista menekan tombol silang (X), menekan area luar (*backdrop click*), atau menekan `Escape`:
  - Dialog tertutup secara otomatis dan state `ingredient_batch_id` langsung **dibalikkan (*revert*)** ke ID batch nomor 1 (`activeBatches[0].id`).
  - Barista tidak akan pernah bisa menyimpan data non-FEFO tanpa melewati pencatatan alasan deviasi.

### 4.4 Dukungan Angka Desimal
- Untuk bahan dengan satuan berat/volume presisi (seperti *Espresso Beans* dalam satuan gram), input mendukung angka desimal dengan atribut `step="0.1"` atau `step="any"` agar barista dapat mencatat dosis *espresso basket* yang presisi (misal: `18.5 gram`).

---

## 5. REKOMENDASI TAHAPAN IMPLEMENTASI KODING

1. **Langkah 1**: Buat komponen `SmartWarningDialog.tsx` di `resources/js/Components/`.
2. **Langkah 2**: Buat modal form `CreateUsageModal.tsx` dengan RadioGroup batch dan validasi kuantitas stok.
3. **Langkah 3**: Buat halaman `resources/js/Pages/Barista/Dashboard.tsx` yang memuat kartu aksi cepat dan grid bahan favorit bar.
4. **Langkah 4**: Pastikan controller backend `StockUsageController.php` memvalidasi input di dalam transaksi database (`DB::transaction`) dan menyimpan kolom `is_fefo_compliant` serta `deviation_reason` dengan tepat.

---
