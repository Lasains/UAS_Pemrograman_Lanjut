# Penjelasan Modul 03: Database Seeder & Data Demo
## Panduan Pemula — Sistem Inventaris Kafe

> **Untuk Siapa**: Tim mahasiswa yang baru pertama kali memahami konsep Seeder di Laravel.  
> **Pendekatan**: Analogi mempersiapkan kafe sebelum pertama kali buka.  
> **Kaitan dengan Kode**: [`docs/Plan Backend/PLAN_03_DATABASE_SEEDER.md`](../Plan%20Backend/PLAN_03_DATABASE_SEEDER.md)

---

## Konsep Dasar: "Seeder = Persiapan Rak Gudang Sebelum Kafe Pertama Buka"

Bayangkan sebuah kafe yang baru saja selesai dibangun. Semua rak gudang, lemari pendingin, dan meja kasir sudah siap — tapi **masih kosong total**. Belum ada bahan, belum ada karyawan terdaftar, belum ada catatan apapun.

Kalau kita langsung buka aplikasinya sekarang dan login, yang kita temukan hanya layar kosong. Tidak seru untuk dipresentasikan ke dosen!

**Seeder** adalah seperti **tim persiapan yang datang sehari sebelum kafe buka** untuk:
- 👤 Mendaftarkan semua karyawan (Pak Budi, Ibu Sari, Andi) ke sistem
- 🗄️ Mengisi katalog bahan baku (susu, kopi, sirup, dll.)
- 📦 Menaruh stok awal di rak gudang dengan berbagai tanggal kadaluwarsa
- 📋 Menuliskan beberapa catatan pemakaian contoh
- 🗑️ Membuat beberapa tiket pemusnahan contoh untuk demo

Setelah seeder dijalankan dengan satu perintah (`php artisan db:seed`), aplikasi langsung punya data yang kaya dan realistis untuk dipresentasikan.

---

## Mengapa Seeder Penting untuk Presentasi?

Tanpa seeder, saat dosen menguji aplikasi:
- ❌ Login tidak bisa karena tidak ada akun
- ❌ Dashboard kosong — tidak ada yang bisa dilihat
- ❌ Tidak bisa demo fitur FEFO karena tidak ada batch
- ❌ Tidak bisa demo early warning karena tidak ada data expiry

Dengan seeder yang baik:
- ✅ Login langsung berhasil dengan `barista@kafe.com / password`
- ✅ Dashboard langsung menampilkan batch merah/kuning/hijau
- ✅ Dosen bisa lihat langsung algoritma FEFO bekerja
- ✅ Semua skenario bisnis sudah ada datanya

---

## Tentang `firstOrCreate()` — Seeder yang Aman Diulang

Seeder dirancang menggunakan `firstOrCreate()` bukan `create()` biasa. Apa bedanya?

```
create()         → Selalu buat baru. Jika dijalankan 2x → ada 2 Pak Budi!
firstOrCreate()  → Cek dulu: "Sudah ada?" Jika sudah ada → skip. Jika belum → buat baru.
```

Ini disebut **idempotent** (aman dijalankan berulang). Sangat berguna saat development ketika kita sering reset dan re-seed database.

---

## Mengapa Tanggal Tidak Di-Hardcode?

Semua tanggal kadaluwarsa menggunakan formula seperti `Carbon::now()->addDays(2)` bukan tanggal spesifik seperti `'2026-11-02'`.

**Kenapa?** Karena sistem early warning kita berbasis selisih dari **hari ini**:
- Kalau kita hardcode `'2026-11-02'`, bulan depan tanggal itu sudah lewat → semua batch jadi expired
- Dengan `Carbon::now()->addDays(2)`, kapanpun seeder dijalankan → data selalu **2 hari dari hari ini**

Hasilnya: **demo selalu relevan** baik hari ini, bulan depan, atau saat presentasi ujian.

---

## Penjelasan Per-Seeder

---

### `UserSeeder` — Mendaftarkan 3 Karyawan Demo

#### Tujuan
Membuat 3 akun karyawan dengan level akses berbeda sehingga saat presentasi, dosen bisa melihat tampilan aplikasi dari sudut pandang 3 peran yang berbeda.

#### Data yang Dibuat

| Akun | Email | Password | Jabatan |
|------|-------|----------|---------|
| Pak Budi | `owner@kafe.com` | `password` | Owner — lihat laporan finansial |
| Ibu Sari | `supervisor@kafe.com` | `password` | Supervisor — kelola stok & approve |
| Andi | `barista@kafe.com` | `password` | Barista — catat pemakaian harian |

#### Kenapa Password Di-Hash?

Password tidak boleh disimpan sebagai teks biasa di database. `Hash::make('password')` mengubah kata "password" menjadi kode acak panjang seperti `$2y$10$abc...xyz`. Saat login, sistem akan verifikasi kode ini — bukan teks aslinya.

#### Hasil yang Terlihat di UI
Setelah seeder ini dijalankan, halaman login akan menerima ketiga kombinasi email/password di atas.

---

### `CategorySeeder` — Membuat 4 Rak Gudang

#### Tujuan
Membuat 4 kelompok bahan baku yang akan digunakan sebagai filter dan pengelompokan di halaman master data.

#### Data yang Dibuat
- 🥛 **Dairy Products** (slug: `dairy`) — susu dan produk turunannya
- ☕ **Coffee Beans** (slug: `beans`) — berbagai jenis biji kopi
- 🍯 **Syrups & Flavoring** (slug: `syrups`) — sirup dan perisa
- 🥐 **Bakery & Food** (slug: `bakery`) — makanan dan roti

#### Apa itu `slug`?
Slug adalah versi URL-friendly dari nama. Contoh: nama `"Syrups & Flavoring"` jadi slug `"syrups"` yang lebih bersih untuk digunakan di URL seperti `/kategori/syrups`.

#### Hasil yang Terlihat di UI
Dropdown filter "Pilih Kategori" di halaman master data bahan akan berisi 4 pilihan ini.

---

### `IngredientSeeder` — Mengisi Katalog 6 Bahan Baku

#### Tujuan
Membuat daftar master bahan baku dengan konfigurasi batas minimum stok dan hari peringatan yang berbeda-beda. Ini menunjukkan fleksibilitas sistem dalam menangani bahan dengan karakteristik berbeda.

#### Data yang Dibuat

| Bahan | Kategori | Min Stok | Warning Days | Alasan Konfigurasi |
|-------|----------|----------|-------------|-------------------|
| Fresh Milk Diamond 1L | Dairy | 5 botol | 3 hari | Susu segar paling sensitif |
| UHT Full Cream 1L | Dairy | 10 karton | 3 hari | Stok besar karena sering dipakai |
| Espresso Beans Arabica 1kg | Beans | 2 kg | 7 hari | Kopi mahal, warning lebih lama |
| Caramel Syrup Monin 1L | Syrups | 3 botol | 5 hari | Sirup perasa, tahan menengah |
| Vanilla Latte Syrup 750ml | Syrups | 2 botol | 5 hari | Sirup perasa, tahan menengah |
| Croissant Frozen | Bakery | 20 pcs | 2 hari | Frozen food sangat sensitif |

#### Cara Mengambil ID Kategori dengan Aman

```php
// Di dalam IngredientSeeder, ID kategori diambil berdasarkan slug
// (bukan hardcode angka seperti 1, 2, 3, 4)
$dairyId = Category::where('slug', 'dairy')->value('id');
```

Kenapa begini? Karena di MySQL, ID auto-increment bisa berubah jika tabel di-reset. Dengan mencari berdasarkan `slug` yang sudah kita tentukan sendiri, kita selalu dapat ID yang benar.

#### Hasil yang Terlihat di UI
Halaman "Master Data Bahan" akan menampilkan daftar 6 bahan ini dengan informasinya. Halaman dashboard akan menampilkan alert untuk bahan yang stoknya di bawah minimum.

---

### `IngredientBatchSeeder` ⭐ — Mengisi Stok Aktual dengan Semua Skenario

#### Tujuan
Ini adalah seeder terpenting. Membuat 10 batch dengan variasi status yang memperlihatkan **semua kemungkinan skenario** yang bisa dosen tanyakan.

#### Peta 10 Batch yang Dibuat

```
FRESH MILK DIAMOND (3 batch — demo traffic light lengkap):
  🔴 MILK-A-KRITIS    → expiry +2 hari  → current_stock: 3 botol
  🟡 MILK-B-WARNING   → expiry +5 hari  → current_stock: 8 botol
  🟢 MILK-C-AMAN      → expiry +15 hari → current_stock: 12 botol

ESPRESSO BEANS (1 batch — bahan tahan lama):
  🟢 BEANS-A-AMAN     → expiry +30 hari → current_stock: 5 kg

CARAMEL SYRUP (2 batch — demo status exhausted):
  🟡 CARAMEL-A-WARNING → expiry +4 hari → current_stock: 2 botol
  💨 CARAMEL-B-HABIS   → status: exhausted → current_stock: 0

VANILLA SYRUP (1 batch — demo alert stok menipis):
  🟢 VANILLA-A-AMAN   → expiry +20 hari → current_stock: 1 (< minimum: 2!)

UHT FULL CREAM (1 batch — aman, stok cukup):
  🟢 UHT-A-AMAN       → expiry +60 hari → current_stock: 18

CROISSANT FROZEN (2 batch — demo status expired & disposed):
  🔴 CROISSANT-A-EXPIRED  → status: expired (lewat 3 hari lalu)
  🗑️  CROISSANT-B-DISPOSED → status: disposed (resmi dimusnahkan)
```

#### Mengapa Perlu 4 Status Batch Berbeda?

| Status | Arti | Tujuan Demo |
|--------|------|-------------|
| `active` | Masih bisa dipakai | Status normal, digunakan barista setiap hari |
| `exhausted` | Stok habis terpakai | Menunjukkan batch yang sudah dihabiskan secara normal |
| `expired` | Lewat tanggal kadaluwarsa | Memicu alert merah — harus segera ditangani |
| `disposed` | Resmi dimusnahkan | Bukti pemusnahan yang sudah disetujui supervisor |

#### Demo FEFO di Ujian

Ketika dosen bertanya "Bagaimana sistem memilih batch untuk digunakan?", demonstrasikan ini:

```
Barista pilih bahan "Fresh Milk Diamond 1L"
→ Sistem menampilkan daftar batch, urut dari yang PALING DEKAT expired:
  1. 🔴 MILK-A-KRITIS  (2 hari lagi) ← [★ REKOMENDASI FEFO]
  2. 🟡 MILK-B-WARNING (5 hari lagi)
  3. 🟢 MILK-C-AMAN    (15 hari lagi)
```

#### Hasil yang Terlihat di UI
- Dashboard menampilkan 4 batch dalam zona merah/kuning
- Halaman "Pemakaian Bahan" menampilkan MILK-A di posisi teratas dengan badge rekomendasi
- Halaman "Semua Batch" menampilkan semua 10 batch dengan status dan warna berbeda

---

### `StockUsageSeeder` — 5 Riwayat Pemakaian

#### Tujuan
Membuat riwayat pemakaian yang menggambarkan dua situasi: barista yang **nurut** rekomendasi FEFO dan barista yang **tidak nurut** (tapi dengan alasan valid yang tercatat).

#### Skenario yang Dibuat

**Pemakaian #1 (✅ FEFO Compliant)**  
Barista Andi memakai MILK-A-KRITIS (yang paling dekat expired) — sesuai rekomendasi sistem.

**Pemakaian #2 (⚠️ Deviasi FEFO)**  
Barista Andi memilih MILK-C-AMAN (yang expired lebih lama) karena MILK-B sudah dibuka lebih dulu di bar. Sistem merekam alasannya. Ini contoh bahwa sistem tidak memaksa — tapi selalu mencatat.

**Pemakaian #3 (✅ Supervisor input)**  
Ibu Sari (supervisor) yang input pemakaian saat Andi sakit. Menunjukkan bahwa supervisor juga bisa mencatat.

**Pemakaian #4 & #5**  
Pemakaian biji kopi dan sirup karamel — menunjukkan sistem bekerja untuk berbagai jenis bahan.

#### Hasil yang Terlihat di UI
Halaman "Riwayat Pemakaian" akan menampilkan 5 baris, dengan pemakaian #2 memiliki badge atau tanda khusus "Deviasi FEFO" dan alasannya.

---

### `WasteLogSeeder` — 3 Tiket Pemusnahan

#### Tujuan
Mendemonstrasikan workflow approval dua tahap: laporan dulu, baru disetujui/ditolak. Ini adalah salah satu fitur paling menarik untuk dipresentasikan karena melibatkan proses bisnis yang nyata.

#### Skenario yang Dibuat

**Tiket #1 (⏳ Pending)**  
Andi melaporkan MILK-A yang berbau asam. Tiket ini **menunggu review Ibu Sari**. Di dashboard supervisor akan muncul notifikasi "Ada 1 laporan menunggu persetujuan".

**Tiket #2 (✅ Approved)**  
Croissant yang berjamur sudah disetujui Ibu Sari untuk dimusnahkan. Kerugian finansial otomatis tercatat:
```
15 pcs × Rp 14.000 = Rp 210.000
```
Angka ini akan muncul di laporan kerugian Pak Budi (Owner).

**Tiket #3 (❌ Rejected)**  
Laporan sirup caramel ditolak karena setelah dicek langsung, ternyata kondisinya masih baik. Laporan tetap ada di sistem (tidak dihapus) sebagai bukti audit.

#### Kenapa `approved_by` dan `financial_loss` Diisi dengan Cara Berbeda?

```php
// Cara BIASA (untuk kolom yang ada di $fillable):
WasteLog::create(['reason' => '...', 'status' => 'approved']);

// Cara KHUSUS (untuk kolom yang TIDAK ada di $fillable):
$log->approved_by    = $supervisor->id;   // Direct assignment
$log->financial_loss = 15 * 14000;        // Dihitung manual
$log->save();                             // Simpan
```

Kolom `approved_by` dan `financial_loss` sengaja tidak ada di `$fillable` untuk keamanan — agar tidak bisa diisi langsung dari form. Di production, kedua kolom ini diisi oleh Service class saat supervisor klik tombol "Approve".

#### Hasil yang Terlihat di UI
- Tab "Pending" di dashboard supervisor: ada 1 tiket menunggu
- Tab "Approved" di riwayat: ada 1 tiket dengan nominal Rp 210.000
- Laporan finansial owner: total kerugian bulan ini Rp 210.000

---

## Urutan Eksekusi Seeder

```
php artisan db:seed
       ↓
  1. UserSeeder      → Daftarkan 3 karyawan
       ↓
  2. CategorySeeder  → Buat 4 rak gudang
       ↓
  3. IngredientSeeder → Isi katalog 6 bahan
       ↓
  4. IngredientBatchSeeder → Taruh stok di rak (10 batch)
       ↓                              ↓
  5. StockUsageSeeder         6. WasteLogSeeder
     (5 riwayat pemakaian)       (3 tiket pemusnahan)
```

Urutan ini **tidak boleh dibalik** karena:
- Ingredient perlu tahu ID Kategori → CategorySeeder harus duluan
- Batch perlu tahu ID Ingredient → IngredientSeeder harus duluan
- StockUsage perlu ID Batch dan User → keduanya harus duluan

---

## Perintah yang Perlu Diingat

```bash
# Reset total + seed ulang (untuk development)
php artisan migrate:fresh --seed

# Hanya seed tanpa reset (lebih aman, pakai firstOrCreate)
php artisan db:seed

# Cek hasil di terminal interaktif
php artisan tinker
```

---

## Dokumentasi Teknis Per Fungsi Seeder (Sesuai Konvensi AGENTS.md)

Berikut dokumentasi terstruktur untuk fungsi `run()` pada masing-masing seeder:

---

### 1. Seeder: `DatabaseSeeder` (`database/seeders/DatabaseSeeder.php`)

#### Fungsi: `run()`
* **Tujuan**: Sebagai dirigen utama (*master orchestrator*) yang memanggil seluruh seeder lain secara berurutan sesuai dependensi Foreign Key agar tidak terjadi galat *integrity constraint*.
* **Input / Parameter**: Tidak menerima parameter langsung.
* **Alur Logika Bisnis (Langkah demi Langkah)**:
  1. Komputer menyiapkan array daftar class seeder: `UserSeeder`, `CategorySeeder`, `IngredientSeeder`, `IngredientBatchSeeder`, `StockUsageSeeder`, `WasteLogSeeder`.
  2. Komputer memanggil `$this->call(...)` untuk mengeksekusi seeder satu per satu secara berurutan.
* **Output / Return Value**: `void`.
* **Kaitan dengan Bagian Lain**: Dijalankan secara otomatis saat developer mengetik `php artisan db:seed` atau `php artisan migrate:fresh --seed`.

---

### 2. Seeder: `UserSeeder` (`database/seeders/UserSeeder.php`)

#### Fungsi: `run()`
* **Tujuan**: Mempersiapkan 3 akun demo dasar dengan hak akses berbeda (Owner, Supervisor, Barista) agar aplikasi langsung dapat diuji login tanpa perlu registrasi manual.
* **Input / Parameter**: Tidak menerima parameter langsung.
* **Alur Logika Bisnis (Langkah demi Langkah)**:
  1. Komputer memeriksa apakah email `owner@kafe.com` sudah ada di tabel `users`.
  2. Jika belum, komputer membuat user baru dengan nama `'Pak Budi (Owner)'`, hash password `'password'`, dan role `'owner'`.
  3. Komputer mengulangi pengecekan dan pembuatan untuk `supervisor@kafe.com` (`'Ibu Sari (Supervisor)'`, role `'supervisor'`).
  4. Komputer mengulangi pengecekan dan pembuatan untuk `barista@kafe.com` (`'Andi (Barista)'`, role `'barista'`).
* **Output / Return Value**: `void` (3 record akun tersimpan di tabel `users`).
* **Kaitan dengan Bagian Lain**: Digunakan pada modul autentikasi dan otorisasi menu dashboard berbasis RBAC.

---

### 3. Seeder: `CategorySeeder` (`database/seeders/CategorySeeder.php`)

#### Fungsi: `run()`
* **Tujuan**: Mengisi master kategori bahan baku kafe (rak gudang) yang dibutuhkan sebelum bahan baku dapat didaftarkan.
* **Input / Parameter**: Tidak menerima parameter langsung.
* **Alur Logika Bisnis (Langkah demi Langkah)**:
  1. Komputer menyiapkan data 4 kategori: Dairy Products (`dairy`), Coffee Beans (`beans`), Syrups & Flavoring (`syrups`), Bakery & Food (`bakery`).
  2. Mengiterasi setiap kategori dan mengecek kolom `slug` melalui `Category::firstOrCreate()`.
  3. Jika slug belum ada, record disimpan ke database.
* **Output / Return Value**: `void` (4 record di tabel `categories`).
* **Kaitan dengan Bagian Lain**: Menjadi parent Foreign Key bagi tabel `ingredients`.

---

### 4. Seeder: `IngredientSeeder` (`database/seeders/IngredientSeeder.php`)

#### Fungsi: `run()`
* **Tujuan**: Mendaftarkan 6 master bahan baku kafe beserta ambang batas peringatan stok (`minimum_stock`) dan hari peringatan kedaluwarsa (`warning_days`).
* **Input / Parameter**: Tidak menerima parameter langsung.
* **Alur Logika Bisnis (Langkah demi Langkah)**:
  1. Komputer mengambil `id` kategori terkait dari tabel `categories` berdasarkan `slug`.
  2. Komputer menyusun daftar 6 bahan: Susu Segar, Susu UHT, Biji Kopi Arabica, Sirup Karamel, Sirup Vanilla, dan Croissant Beku.
  3. Menggunakan `Ingredient::firstOrCreate()` dengan kombinasi kunci `['name', 'category_id']`.
* **Output / Return Value**: `void` (6 record di tabel `ingredients`).
* **Kaitan dengan Bagian Lain**: Menjadi master katalog bahan untuk form restock dan dasar relasi batch fisik.

---

### 5. Seeder: `IngredientBatchSeeder` (`database/seeders/IngredientBatchSeeder.php`)

#### Fungsi: `run()`
* **Tujuan**: Menyediakan 10 variasi batch stok bahan dengan tanggal kedaluwarsa dinamis (`Carbon::now()->addDays(N)`) untuk mendemonstrasikan algoritma FEFO dan visualisasi indikator lampu lalu lintas (merah, kuning, hijau).
* **Input / Parameter**: Tidak menerima parameter langsung.
* **Alur Logika Bisnis (Langkah demi Langkah)**:
  1. Mengambil ID masing-masing bahan master dari tabel `ingredients`.
  2. Menyiapkan daftar 10 batch dengan variasi:
     - 🔴 **Kritis** (< 3 hari): `MILK-A-KRITIS` (+2 hari) dan `CROISSANT-A-EXPIRED` (-3 hari).
     - 🟡 **Warning** (3-7 hari): `MILK-B-WARNING` (+5 hari) dan `CARAMEL-A-WARNING` (+4 hari).
     - 🟢 **Aman** (> 7 hari): `MILK-C-AMAN` (+15 hari), `BEANS-A-AMAN` (+30 hari), `VANILLA-A-AMAN` (+20 hari), `UHT-A-AMAN` (+60 hari).
     - 💨 **Exhausted** (stok habis): `CARAMEL-B-HABIS`.
     - 🗑️ **Disposed** (dimusnahkan): `CROISSANT-B-DISPOSED`.
  3. Menyimpan setiap batch via `IngredientBatch::firstOrCreate()` berdasarkan `batch_code`.
* **Output / Return Value**: `void` (10 record di tabel `ingredient_batches`).
* **Kaitan dengan Bagian Lain**: Diurutkan oleh `scopeFefoOrder()` untuk rekomendasi racikan barista dan dibaca oleh widget *Early Warning Dashboard*.

---

### 6. Seeder: `StockUsageSeeder` (`database/seeders/StockUsageSeeder.php`)

#### Fungsi: `run()`
* **Tujuan**: Menyediakan contoh data transaksi pemakaian harian untuk membuktikan transparansi audit kepatuhan FEFO (*compliance vs deviation*).
* **Input / Parameter**: Tidak menerima parameter langsung.
* **Alur Logika Bisnis (Langkah demi Langkah)**:
  1. Mengambil user barista dan supervisor, serta batch-batch terkait.
  2. Menyiapkan 5 record transaksi:
     - 4 pemakaian berstatus `is_fefo_compliant = true`.
     - 1 pemakaian berstatus `is_fefo_compliant = false` lengkap dengan alasan operasional (`deviation_reason`) pada pemakaian batch `MILK-C-AMAN`.
  3. Menyimpan data melalui `StockUsage::firstOrCreate()`.
* **Output / Return Value**: `void` (5 record di tabel `stock_usages`).
* **Kaitan dengan Bagian Lain**: Ditampilkan pada tabel riwayat pemakaian stok dan laporan kepatuhan FEFO untuk Owner.

---

### 7. Seeder: `WasteLogSeeder` (`database/seeders/WasteLogSeeder.php`)

#### Fungsi: `run()`
* **Tujuan**: Menyediakan data pengujian untuk 3 cabang status workflow persetujuan pemusnahan barang rusak/kedaluwarsa (*pending*, *approved*, *rejected*).
* **Input / Parameter**: Tidak menerima parameter langsung.
* **Alur Logika Bisnis (Langkah demi Langkah)**:
  1. Menyiapkan 3 tiket pemusnahan:
     - Tiket 1 (`MILK-A-KRITIS`): status `pending`, belum ada approver dan nilai kerugian.
     - Tiket 2 (`CROISSANT-B-DISPOSED`): status `approved`, diisi nilai `approved_by` (ID supervisor) dan `financial_loss` dihitung otomatis: `15 × Rp 14.000 = Rp 210.000`.
     - Tiket 3 (`CARAMEL-A-WARNING`): status `rejected`, ditolak supervisor karena kualitas fisik masih dinilai baik.
  2. Menyimpan data dengan penanganan khusus: kolom non-fillable (`approved_by`, `financial_loss`) diisi melalui *direct property assignment* lalu disimpan via `$approvedLog->save()`.
* **Output / Return Value**: `void` (3 record di tabel `waste_logs`).
* **Kaitan dengan Bagian Lain**: Tampil pada antrean *Approval Center* supervisor dan kartu metrik *Financial Spoilage Loss* dasbor Owner.

---

*Dokumen ini mendampingi spesifikasi teknis lengkap di [`PLAN_03_DATABASE_SEEDER.md`](../Plan%20Backend/PLAN_03_DATABASE_SEEDER.md). Untuk kode PHP lengkap setiap seeder, lihat dokumen teknis tersebut.*
