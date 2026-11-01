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

*Dokumen ini mendampingi spesifikasi teknis lengkap di [`PLAN_03_DATABASE_SEEDER.md`](../Plan%20Backend/PLAN_03_DATABASE_SEEDER.md). Untuk kode PHP lengkap setiap seeder, lihat dokumen teknis tersebut.*
