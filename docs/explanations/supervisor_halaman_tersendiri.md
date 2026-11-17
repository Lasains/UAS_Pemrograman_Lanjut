# Penjelasan: Halaman Operasional & Pengawasan Supervisor BeanFlow

> **Dibuat untuk**: Tim Mahasiswa (Pemula)  
> **Topik**: Arsitektur halaman khusus Supervisor gudang & bar (Master Data, Monitoring Batch, Approval Waste, dan Riwayat Audit FEFO)  
> **Analogi Kafe**: Bayangkan seorang Kepala Bar / Supervisor Gudang kafe yang memegang kunci gudang dan papan periksa (*clipboard*). Ia bertugas memastikan bahwa data master bahan tidak kacau, stok di rak tidak ada yang kedaluwarsa diam-diam, susu yang dilaporkan asam oleh barista memang benar-benar rusak sebelum dibuang, dan barista disiplin mengambil bahan sesuai urutan kedaluwarsa.

---

## Pembagian Halaman Supervisor

Di dalam App Shell Supervisor (`screen_3_app_shell_supervisor.html`), menu navigasi dibagi menjadi dua kelompok besar:

```
SIDEBAR SUPERVISOR:
├── KELOMPOK 1: MANAJEMEN INVENTARIS & GUDANG
│   ├── ⏳ Monitoring Kedaluwarsa   → Pages/Inventory/Index.tsx
│   ├── 📦 Master Bahan Baku        → Pages/Master/Ingredients/Index.tsx
│   ├── 🏷️ Kategori Bahan Baku     → Pages/Master/Categories/Index.tsx
│   └── ➕ Penerimaan Batch (Restock) → Pages/Batches/Create.tsx
│
└── KELOMPOK 2: OTORISASI & AUDIT
    ├── 🛡️ Approval Pemusnahan      → Pages/Waste/Index.tsx (Ada Badge Counter Pending)
    └── 📜 Riwayat Audit & FEFO     → Pages/Audit/FefoLog.tsx
```

---

## 1. Modul Monitoring Inventaris & Kedaluwarsa (`Pages/Inventory/Index.tsx`)

### Komponen: `ExpiryFilterTabs`
* **Tujuan**: Memfilter ratusan tumpukan bahan di gudang berdasarkan lampu lalu lintas urgensi kedaluwarsa dalam 1 kali klik.
* **Input / Parameter**: `activeTab: 'all' | 'safe' | 'warning' | 'critical'`.
* **Alur Logika Bisnis (Langkah demi Langkah)**:
  1. Supervisor memilih tab (misal: tab `🔴 Kritis`).
  2. Inertia mengirim request filter ke server atau memfilter state daftar batch.
  3. Tabel hanya menampilkan bahan yang memiliki batch dengan sisa hari < 3 hari.
* **Output / Return Value**: Tampilan tabel tersaring rapi.
* **Kaitan**: Menuntun supervisor untuk segera memerintahkan barista memprioritaskan batch tersebut atau membuat promo menu harian.

### Komponen: `ExpandableBatchRow`
* **Tujuan**: Menampilkan detail fisik setiap karton/bungkus batch di dalam satu bahan baku (seperti membuka kardus besar untuk melihat kaleng di dalamnya).
* **Input / Parameter**: `ingredient: Ingredient`, `batches: IngredientBatch[]`.
* **Alur Logika Bisnis (Langkah demi Langkah)**:
  1. Baris utama menampilkan total saldo gabungan bahan (misal: *Fresh Milk Diamond: 4.500 ml*).
  2. Ketika tombol panah expand diklik, baris terbuka ke bawah menampilkan sub-tabel batch fisik:
     - Batch #BCH-01: sisa 2.500 ml, Exp: besok (Badge Kritis Merah).
     - Batch #BCH-02: sisa 2.000 ml, Exp: 10 hari lagi (Badge Aman Hijau).
* **Output / Return Value**: Tampilan hierarki data bahan -> batch.
* **Kaitan**: Mengikuti logika FEFO di mana batch terdekat selalu berada di baris teratas.

---

## 2. Modul Master Bahan Baku (`Pages/Master/Ingredients/Index.tsx`)

### Komponen: `IngredientDrawer` (Slide-Over Panel)
* **Tujuan**: Panel geser dari kanan layar untuk menambah bahan baru atau mengedit batas minimum stok tanpa membuka halaman baru.
* **Input / Parameter**: `ingredientToEdit?: Ingredient`, `categories: Category[]`.
* **Alur Logika Bisnis (Langkah demi Langkah)**:
  1. Supervisor menekan tombol `[+ Tambah Bahan]`.
  2. Drawer terbuka dari sisi kanan (lebar 480px).
  3. Supervisor memilih satuan standar: `ml` untuk cairan, `gram` untuk biji kopi/bubuk, atau `pcs` untuk pastry.
  4. Supervisor memasukkan batas minimal restock (misal: `1.000 ml`) dan hari peringatan dini (misal: `3 hari`).
  5. Data disimpan menggunakan `useForm` Inertia ke `route('ingredients.store')`.
* **Output / Return Value**: Penambahan master bahan baru yang konsisten.
* **Kaitan**: Menjamin bahwa seluruh barista di kasir/bar mencatat dengan satuan unit yang seragam.

---

## 3. Modul Manajemen Kategori (`Pages/Master/Categories/Index.tsx`)

### Komponen: `CategoryCardGrid` & `CategoryFormCard`
* **Tujuan**: Mengelompokkan bahan ke dalam kelompok kerja kafe (*Dairy*, *Beans*, *Syrup*, *Bakery*, *Packaging*).
* **Input / Parameter**: Array `categories: (Category & { ingredients_count: number; active_batches_count: number })[]`.
* **Alur Logika Bisnis (Langkah demi Langkah)**:
  1. Sisi kiri menampilkan form sederhana untuk menambah nama kategori dan memilih warna badge.
  2. Sisi kanan menampilkan grid kartu kategori yang memuat statistik: berapa bahan dan berapa batch aktif yang bernaung di bawah kategori tersebut.
  3. Kategori yang masih memiliki bahan terdaftar dilindungi dari penghapusan (*Protected / Foreign Key Guard*) agar tidak merusak data transaksi.
* **Output / Return Value**: Taksonomi bahan yang tertata rapi.
* **Kaitan**: Memudahkan penyaringan di seluruh modul aplikasi.

---

## 4. Modul Approval Pemusnahan Limbah (`Pages/Waste/Index.tsx`)

### Komponen: `PendingWasteTable`
* **Tujuan**: Pusat verifikasi tiket bahan rusak yang diajukan oleh barista.
* **Input / Parameter**: Array `pendingTickets: WasteLog[]` berstatus `pending`.
* **Alur Logika Bisnis (Langkah demi Langkah)**:
  1. Menampilkan tiket yang dikirim barista: Tanggal lapor, Nama Barista, Nama Bahan, Jumlah Rusak, dan Alasan Kerusakan.
  2. Sistem menghitung secara otomatis estimasi kerugian rupiah:  
     `financial_loss = waste_quantity * cost_per_unit`.
  3. Supervisor pergi mengecek fisik bahan di chiller/rak bar.
  4. Jika bahan memang rusak, Supervisor klik `[Setujui Pemusnahan]`.
  5. Jika salah lapor, Supervisor klik `[Tolak]` dan wajib mengisi alasan penolakan.
* **Output / Return Value**: Aksi eksekusi pemusnahan resmi.
* **Kaitan**: Saat disetujui, backend membungkus transaksi dalam `DB::transaction`: stok batch dinolkan (`current_stock = 0`), status diubah menjadi `disposed`, dan kerugian dibukukan ke laporan Owner.

---

## 5. Modul Riwayat Audit & Deviasi FEFO (`Pages/Audit/FefoLog.tsx`)

### Komponen: `FefoAuditLogTable`
* **Tujuan**: Mengaudit kepatuhan SOP barista — melacak apakah barista selalu patuh mengambil batch terdekat kedaluwarsa atau sering melakukan deviasi.
* **Input / Parameter**: Array `stockUsages: StockUsage[]` dari backend.
* **Alur Logika Bisnis (Langkah demi Langkah)**:
  1. Setiap transaksi pemakaian bahan di meja bar dicatat di tabel ini.
  2. Jika barista mengambil batch rekomendasi sistem, status diberi badge hijau `✓ Patuh FEFO`.
  3. Jika barista memilih batch lain (misalnya karena karton susu lain sudah terlanjur terbuka), status diberi badge amber `⚠ Deviasi FEFO` dan kutipan alasan barista langsung ditampilkan (misal: *"Karton batch #02 sudah terbuka di chiller"*).
  4. Supervisor dapat mengevaluasi: jika deviasi terlalu sering terjadi, berarti penataan letak fisik bahan di bar perlu diperbaiki.
* **Output / Return Value**: Buku log transparansi kepatuhan SOP meja bar.
* **Kaitan**: Mengambil data dari form pencatatan pemakaian bahan barista (`usage.store`).

---

> **Catatan Ponytail**: Modul Supervisor sengaja menggunakan satu halaman terintegrasi untuk Master Bahan + Slide-Over Drawer daripada membuat puluhan halaman CRUD terpisah. Ini menghemat ratusan baris kode dan membuat aplikasi jauh lebih cepat digunakan saat supervisor sedang mobile memeriksa rak gudang.
