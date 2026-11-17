# Penjelasan: 4 Halaman Tersendiri untuk Barista BeanFlow

> **Dibuat untuk**: Tim Mahasiswa (Pemula)  
> **Topik**: Arsitektur 4 halaman barista di PLAN_03 (Dasbor + Catat Pemakaian + Penerimaan Batch + Lapor Rusak)  
> **Analogi**: Bayangkan dapur kafe dengan 4 stasiun kerja berbeda — setiap stasiun punya papan tugasnya sendiri.

---

## Mengapa 4 Halaman Tersendiri, Bukan 1 Halaman dengan Banyak Modal?

Sebelumnya, desain lama merencanakan barista hanya punya 1 halaman (Dasbor) + beberapa modal pop-up di atasnya. Masalahnya:

- **Modal di atas modal** = membingungkan. Seperti menempel sticky note di atas sticky note, sulit dibaca.
- **Saat rush hour (jam sibuk bar)**, barista butuh aksi yang langsung bisa dilakukan tanpa banyak klik membuka-tutup modal.
- **Setiap menu sidebar yang ada seharusnya punya tujuan halaman sendiri** — ini standar UX modern.

Sekarang, barista punya **4 halaman tersendiri** yang bisa diakses langsung dari sidebar:

```
SIDEBAR BARISTA:
├── 🏠 Dasbor           → Pages/Barista/Dashboard.tsx
├── ☕ Catat Pemakaian  → Pages/Usage/Index.tsx
├── 📦 Terima Batch     → Pages/Batches/Create.tsx
└── ⚠️  Lapor Rusak     → Pages/Waste/Create.tsx
```

---

## Halaman A: Dasbor Barista (`Pages/Barista/Dashboard.tsx`)

### Komponen: `FefoAlertBanner`
* **Tujuan**: Menampilkan peringatan merah terracotta di paling atas halaman jika ada bahan yang hampir/sudah expired.
* **Input**: Data batch dari props Inertia — batch yang `urgency_status === 'critical'`.
* **Alur Logika**:
  1. Sistem mengecek apakah ada batch dengan sisa hari < 3.
  2. Jika ada, tampilkan banner merah terracotta dengan nama bahan + tombol "Pakai Batch Ini Sekarang".
  3. Jika tidak ada, banner disembunyikan (tidak dirender sama sekali).
* **Output**: Banner merah menyala di atas kanvas, atau null (tidak ada).
* **Kaitan**: Tombol di banner langsung membuka Halaman B (Catat Pemakaian) dengan batch tersebut sudah pre-selected.

### Komponen: `QuickActionCards`
* **Tujuan**: 3 tombol besar touch-friendly yang jadi shortcut utama barista.
* **Input**: Tidak ada props khusus — hanya link navigasi Inertia.
* **Alur Logika**: 
  1. Tombol Espresso (Catat Pemakaian) → `router.visit(route('usage.index'))`
  2. Tombol Parchment (Penerimaan Batch) → `router.visit(route('batches.create'))`
  3. Tombol Amber (Lapor Rusak) → `router.visit(route('waste.create'))`
* **Output**: 3 kartu tombol besar (tinggi minimal 72px) agar mudah ditekan saat tangan basah.
* **Kaitan**: Navigasi ke masing-masing 3 halaman tersendiri.

### Komponen: `QuickIngredientsGrid`
* **Tujuan**: Grid 4 kartu bahan utama bar — barista bisa langsung melihat stok dan status kedaluwarsa sekilas.
* **Input**: `popularIngredients[]` dari props Inertia (dikirim controller).
* **Alur Logika**:
  1. Render setiap bahan sebagai kartu dengan nama, stok tersisa (angka besar), dan badge lampu lalu lintas.
  2. Badge dihitung dari `days_until_expiry` batch terdekat bahan tersebut.
  3. Tombol "Pakai Bahan" di tiap kartu → navigasi ke Halaman B dengan bahan tersebut pre-selected.
* **Output**: Grid 4 kolom kartu bahan.
* **Kaitan**: Tombol "Pakai Bahan" link ke Halaman B dengan query param `?ingredient_id=X`.

---

## Halaman B: Catat Pemakaian & Riwayat FEFO (`Pages/Usage/Index.tsx`)

Analoginya: **Ini seperti buku log bar** — kolom kiri untuk mencatat pemakaian baru, kolom kanan untuk melihat catatan pemakaian hari ini.

### Komponen: `FefoBatchRadioGroup`
* **Tujuan**: Menampilkan daftar batch aktif bahan yang dipilih, terurut dari yang paling dekat expired (FEFO order).
* **Input**: `activeBatches: IngredientBatch[]` — sudah difilter `status === 'active' && current_stock > 0` dan diurutkan `expiry_date ASC`.
* **Alur Logika**:
  1. Render tiap batch sebagai kartu radio button.
  2. Batch pertama (index 0) otomatis terpilih dan diberi badge `[★ REKOMENDASI FEFO]` berlatar espresso gelap.
  3. Jika barista memilih batch lain (bukan index 0) → trigger `DeviationInlineWarning`.
* **Output**: Daftar kartu radio interaktif, batch[0] terpilih default.
* **Kaitan**: Nilai terpilih dikirim ke form `ingredient_batch_id`.

### Komponen: `DeviationInlineWarning`
* **Tujuan**: Menampilkan peringatan amber langsung di dalam halaman (bukan modal pop-up baru) saat barista memilih batch bukan rekomendasi.
* **Input**: `isVisible: boolean`, `onReasonChange: (reason: string) => void`.
* **Alur Logika**:
  1. Muncul otomatis di bawah RadioGroup jika `selectedBatch.id !== activeBatches[0].id`.
  2. Menampilkan textarea untuk isi alasan deviasi (minimal 5 karakter).
  3. Tombol submit tetap disabled sampai alasan valid.
* **Output**: Kotak peringatan amber inline yang bisa expand/collapse, atau null jika tidak deviasi.
* **Kaitan**: Nilai `deviation_reason` dan `is_fefo_compliant: false` dikirim ke form.

### Komponen: `TodayUsageLog` (Kolom Kanan)
* **Tujuan**: Menampilkan riwayat pemakaian bahan yang sudah dicatat hari ini oleh barista yang sedang login.
* **Input**: `recentUsagesToday[]` dari props Inertia (data fresh dari controller setiap halaman dimuat).
* **Alur Logika**:
  1. Render sebagai tabel bersih: Jam | Bahan | Batch | Qty | FEFO?
  2. Kolom FEFO: jika `is_fefo_compliant === true` → badge hijau "✓ FEFO", jika false → badge amber "⚠ Deviasi".
  3. Jika array kosong → tampilkan empty state.
* **Output**: Tabel riwayat atau empty state.
* **Kaitan**: Data diambil dari tabel `stock_usages` via `StockUsageController`.

---

## Halaman C: Penerimaan Batch Baru (`Pages/Batches/Create.tsx`)

Analoginya: **Ini seperti formulir penerimaan barang dari supplier** — barista/supervisor mengisi data faktur batch yang baru datang.

### Komponen: `BatchCodeInput` + Auto-Generate
* **Tujuan**: Input kode batch dengan opsi generate otomatis agar tidak perlu mengarang kode sendiri.
* **Input**: `received_date` (untuk bagian tanggal di kode).
* **Alur Logika**:
  1. Barista klik tombol `[↻ Auto-Generate]`.
  2. Sistem membuat kode format `BCH-{YYYYMMDD}-{4 huruf random}` → misalnya `BCH-20241026-A3F2`.
  3. Kode masuk ke input teks (barista masih bisa edit manual).
* **Output**: String kode batch yang unik.
* **Kaitan**: Nilai dikirim ke form field `batch_code`.

### Komponen: `ExpiryDatePickerWithPreview`
* **Tujuan**: DatePicker tanggal kedaluwarsa yang langsung menampilkan preview status (Aman/Warning/Kritis).
* **Input**: `expiry_date` yang dipilih, `received_date`.
* **Alur Logika**:
  1. Validasi: `expiry_date` harus setelah `received_date` (tidak bisa terbalik).
  2. Hitung selisih hari dari **hari ini** (bukan dari received_date):
     - > 7 hari → badge hijau "✓ Aman: X hari lagi"
     - 3–7 hari → badge amber "⚠ Warning: X hari"
     - < 3 hari → badge merah "🔴 Kritis: X hari"
  3. Preview badge muncul real-time saat tanggal diubah.
* **Output**: DatePicker + badge preview status.
* **Kaitan**: Membantu barista sadar jika salah input expiry date.

### Komponen: `LiveTotalCalculator`
* **Tujuan**: Menampilkan total nilai rupiah batch secara real-time (seperti kalkulator di kasir).
* **Input**: `initial_stock: number`, `cost_per_unit: number`.
* **Alur Logika**: 
  1. `total_nilai = initial_stock × cost_per_unit`.
  2. Update setiap kali salah satu input berubah.
  3. Format: `Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' })`.
* **Output**: Kartu "Total Nilai Batch: Rp X.XXX.XXX" dengan angka tebal terracotta.
* **Kaitan**: Nilai ini hanya untuk display — yang disimpan ke database adalah `initial_stock` dan `cost_per_unit` secara terpisah.

### Komponen: `RecentBatchesLog` (Kolom Kanan)
* **Tujuan**: Menampilkan 5 batch terakhir yang diterima sistem — sebagai referensi barista.
* **Input**: `recentBatches[]` dari props Inertia.
* **Output**: Tabel singkat 5 baris dengan badge status kedaluwarsa.

---

## Halaman D: Lapor Bahan Rusak & Status Tiket (`Pages/Waste/Create.tsx`)

Analoginya: **Ini seperti formulir laporan kejadian di kafe** — barista melaporkan bahan yang rusak/basi ke supervisor, dan bisa memantau status laporannya.

### Komponen: `BatchSelectorWithInfo`
* **Tujuan**: Combobox pilih batch + tampilkan info batch setelah dipilih (sisa stok, status kedaluwarsa).
* **Input**: `activeBatches[]` dari props Inertia.
* **Alur Logika**:
  1. Barista pilih batch dari dropdown.
  2. Di bawah combobox muncul kartu mini: nama bahan, kode batch, `current_stock`, badge status kedaluwarsa.
  3. Info ini membantu barista mengisi `waste_quantity` yang tidak melebihi stok.
* **Output**: Combobox + kartu info batch.
* **Kaitan**: `batch_id` terpilih dikirim ke form.

### Komponen: `WasteQuantityInput`
* **Tujuan**: Input jumlah bahan yang dilaporkan rusak dengan validasi real-time.
* **Input**: `waste_quantity`, `current_stock` dari batch terpilih.
* **Alur Logika**:
  1. Jika `waste_quantity > current_stock` → border merah terracotta + pesan "Melebihi sisa stok batch".
  2. Tombol submit disabled jika invalid.
* **Output**: Input angka + indikator validasi.

### Komponen: `MyWasteTicketsLog` (Kolom Kanan)
* **Tujuan**: Tabel status semua tiket laporan yang pernah dikirim barista ini.
* **Input**: `myWasteLogs[]` dari props Inertia (difilter `user_id === auth.user.id`).
* **Alur Logika**:
  1. Render tiap tiket dengan status badge:
     - `pending` → badge kuning amber "🟡 Menunggu Supervisor"
     - `approved` → badge hijau "🟢 Pemusnahan Disetujui"
     - `rejected` → badge abu perkamen "⚪ Ditolak" + expand alasan penolakan supervisor
  2. Jika kosong → empty state ikon `ShieldCheck` hijau + "Kafe aman! Belum ada laporan kerusakan."
* **Output**: Tabel tiket atau empty state apresiasi.
* **Kaitan**: Data dari tabel `waste_logs` via `WasteController`.

---

## Ringkasan Alur Navigasi Barista

```
Login sebagai Barista
        ↓
[ Dasbor Barista ] ← Halaman pertama setelah login
        ↓
Klik sidebar atau Quick Action Cards
        ↓
┌──────────────────────────────────────────────────────┐
│  [☕ Catat Pemakaian]  →  Halaman B (Usage/Index)    │
│  [📦 Terima Batch]    →  Halaman C (Batches/Create)  │
│  [⚠️ Lapor Rusak]     →  Halaman D (Waste/Create)    │
└──────────────────────────────────────────────────────┘
```

> **Catatan Ponytail**: Komponen `SmartWarningDialog.tsx` yang ada di kode lama (Section 3.4 PLAN_03) masih bisa digunakan sebagai fallback — tapi arsitektur baru memprioritaskan `DeviationInlineWarning` yang tidak membuka modal baru. Komponen dialog lama bisa dibuang saat implementasi untuk mengurangi kompleksitas.
