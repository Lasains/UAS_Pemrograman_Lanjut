# Dokumentasi Perbaikan & Integrasi Penuh Sistem Inventaris Kafe

Dokumen ini menjelaskan setiap fungsi dan komponen yang diperbaiki atau ditambahkan agar seluruh modul backend dan frontend berjalan sinkron dengan database MySQL dan aturan bisnis kafe.

---

## 1. Model `IngredientBatch` (`app/Models/IngredientBatch.php`)

### Fungsi: `getDaysUntilExpiryAttribute()`
* **Tujuan**: Menghitung sisa hari menuju tanggal kedaluwarsa secara akurat (bernilai negatif jika sudah lewat hari ini).
* **Input / Parameter**: Menggunakan properti `$this->expiry_date` pada model batch.
* **Alur Logika Bisnis (Langkah demi Langkah)**:
  1. Mengambil tanggal hari ini pada pukul 00:00 (`Carbon::today()`).
  2. Menormalisasi tanggal kedaluwarsa ke pukul 00:00 (`startOfDay()`).
  3. Menghitung selisih hari bertanda (`diffInDays(..., false)`) agar Carbon 3 mengembalikan angka negatif untuk barang kedaluwarsa dan positif untuk barang yang masih aman.
* **Output / Return Value**: `int` (contoh: `-2` untuk lewat 2 hari, `0` untuk hari ini, `5` untuk 5 hari lagi).
* **Kaitan dengan Bagian Lain**: Digunakan oleh `ExpiryBadge` dan `getExpiryStatusAttribute()` untuk menyalakan lampu lalu lintas hijau/kuning/merah.

### Fungsi: `getUrgencyStatusAttribute()`
* **Tujuan**: Menyamakan nama atribut status kedaluwarsa antara backend (`expiry_status`) dan tipe TypeScript frontend (`urgency_status`).
* **Output / Return Value**: `string` (`'safe' | 'warning' | 'critical'`).

---

## 2. Master Data (`CategoryController` & `IngredientController`)

### Fungsi: `CategoryController::store(Request $request)` & `destroy(Category $category)`
* **Tujuan**: Menambah kategori bahan (seperti Dairy, Syrup) dan mencegah penghapusan kategori yang masih dipakai oleh bahan baku.
* **Alur Logika Bisnis (Langkah demi Langkah)**:
  1. `store`: Memvalidasi nama kategori unik, lalu membuat `slug` otomatis dengan `Str::slug()`.
  2. `destroy`: Mengecek apakah masih ada bahan baku pada kategori tersebut; jika masih ada, penghapusan ditolak dengan pesan error yang ramah.
* **Kaitan dengan Bagian Lain**: Melayani halaman `Ingredients/Index.tsx` milik Supervisor.

### Fungsi: `IngredientController::index()`, `store()`, `update()`, `destroy()`
* **Tujuan**: Menampilkan dan mengelola daftar master bahan baku beserta total stok aktifnya.
* **Alur Logika Bisnis (Langkah demi Langkah)**:
  1. `index`: Mengambil seluruh bahan beserta kategori dan menjumlahkan stok batch yang berstatus `'active'`.
  2. `store` & `update`: Memvalidasi nama unik, satuan (`ml`, `gram`, `pcs`), stok minimum, dan batas hari peringatan.
  3. `destroy`: Menolak penghapusan jika bahan sudah memiliki riwayat batch agar jejak audit tidak hilang.

---

## 3. Pemakaian Stok FEFO (`StockUsageController`)

### Fungsi: `StockUsageController::index()`
* **Tujuan**: Menyajikan daftar bahan dan batch aktifnya yang sudah diurutkan berdasarkan kedaluwarsa terdekat (FEFO), seperti menaruh kotak susu paling lama di rak paling depan chiller.
* **Output / Return Value**: Merender `Usage/Index.tsx` dengan props `ingredients` (batch pertama ditandai `is_fefo_recommended = true`) dan `recentUsages`.

### Fungsi: `StockUsageController::store(Request $request)`
* **Tujuan**: Mencatat pemakaian bahan barista, memotong stok secara aman, dan mewajibkan alasan jika barista tidak mengambil batch prioritas FEFO.
* **Input / Parameter**: `ingredient_batch_id`, `quantity_used`, `deviation_reason` (opsional jika patuh FEFO), `notes`.
* **Alur Logika Bisnis (Langkah demi Langkah)**:
  1. Membungkus proses dalam `DB::transaction` dan mengunci baris batch (`lockForUpdate()`) agar tidak terjadi bentrok stok jika dua barista mencatat bersamaan.
  2. Memastikan stok batch mencukupi; jika kurang, transaksi dibatalkan dengan pesan validasi.
  3. Membandingkan batch pilihan dengan batch FEFO teratas; jika berbeda dan alasan deviasi kosong, validasi menolak permintaan.
  4. Mengurangi `current_stock` dan mengubah status batch menjadi `'exhausted'` bila stok mencapai 0.

---

## 4. Pelaporan & Persetujuan Bahan Rusak (`WasteLogController`)

### Fungsi: `WasteLogController::store(Request $request)`
* **Tujuan**: Mencatat laporan bahan rusak dari Barista dengan status awal `'pending'` tanpa langsung memotong stok gudang.
* **Alur Logika Bisnis**: Memvalidasi jumlah rusak tidak melebihi stok aktif, menghitung estimasi `financial_loss`, lalu menyimpan tiket laporan.

### Fungsi: `WasteLogController::approve(Request $request, WasteLog $wasteLog)` & `reject()`
* **Tujuan**: Memberikan keputusan Supervisor atas laporan bahan rusak.
* **Alur Logika Bisnis (Langkah demi Langkah)**:
  1. `approve`: Di dalam `DB::transaction`, memverifikasi tiket masih `'pending'`, menghitung kerugian final (`waste_quantity * cost_per_unit`), mengubah status tiket menjadi `'approved'`, lalu memotong `current_stock` batch menjadi `0` dan menandai status batch `'disposed'` (tanpa hard delete).
  2. `reject`: Mengubah status tiket menjadi `'rejected'` tanpa menyentuh stok batch.

---

## 5. Dasbor & Analitik (`DashboardController`)

### Fungsi: `barista()`, `owner()`, `analytics()`, `export()`
* **Tujuan**: Menyediakan ringkasan operasional untuk Barista serta metrik finansial dan ekspor CSV untuk Owner.
* **Kaitan dengan Bagian Lain**: Terhubung ke `Barista/Dashboard.tsx`, `Dashboard.tsx` (Owner), dan `Analytics/Index.tsx`.

---

## 6. Komponen Halaman Frontend (`resources/js/Pages/**`)

### Komponen: `UsageIndex`, `BatchesCreate`, `WasteCreate`, `WasteIndex`, `Dashboard`, `AnalyticsIndex`, `IngredientsIndex`, `BatchesEdit`, `BatchesShow`, `InventoryIndex`
* **Tujuan**: Menghubungkan seluruh antarmuka React/Inertia ke backend Laravel menggunakan `useForm` dan `router` (menggantikan data dummy lokal), memperbaiki rute navigasi di `AuthenticatedLayout.tsx`, serta memotong string tanggal ISO-8601 (`slice(0, 10)`) pada tampilan `Inventory/Index.tsx` agar tampil ringkas dalam format `yyyy-mm-dd(x hari)`.
* **Alur Logika Bisnis**: Setiap form mengirim request HTTP ke route Laravel, menampilkan error validasi dari backend melalui `InputError`, dan memperbarui tampilan otomatis via Inertia props.

---

## Bugfix #18 — Route `/stock-usages/create` (404 Fix)

**Tanggal:** 28 November 2026  
**Ditemukan via:** Playwright E2E Test

### Fungsi: `Route::get('/stock-usages/create', fn() => redirect()->route('stock-usages.index'))`

* **Tujuan**: Mencegah error 404 ketika pengguna mengakses `/stock-usages/create` langsung (misalnya dari bookmark atau link lama), karena form FEFO terintegrasi di halaman index (`/stock-usages`), bukan di halaman terpisah.
* **Input / Parameter**: HTTP GET request ke `/stock-usages/create`
* **Alur Logika Bisnis**:
  1. Laravel menerima request GET ke `/stock-usages/create`
  2. Closure langsung memanggil `redirect()->route('stock-usages.index')`
  3. Browser mendapat HTTP 302 → redirect ke `/stock-usages`
  4. Pengguna landing di halaman form FEFO yang benar
* **Output / Return Value**: HTTP 302 Redirect ke `stock-usages.index`
* **Kaitan dengan Bagian Lain**: Alias safety net untuk `stock-usages.index`. Tidak mengubah logika apapun.

**Analogi Kafe**: Seperti menambahkan tanda panah di pintu gudang "Kalau mau catat pemakaian, masuk dari pintu depan" — pengguna tidak perlu tahu pintu mana yang "resmi".

---

## Bugfix #19 — Perbaikan Link Aksi Batch di Inventory & Quick-Login Barista

**Tanggal:** 28 November 2026  
**Ditemukan via:** Playwright E2E CRUD Test

### 1. Komponen: `Index` (`resources/js/Pages/Inventory/Index.tsx`)
* **Tujuan**: Memperbaiki tautan tombol aksi di daftar rincian batch agar tidak mengarah ke URL 404, serta menyediakan tombol **Edit Batch** bagi Supervisor.
* **Input / Parameter**: Props `ingredients`, `summaryStats`, serta data user login dari `usePage().props.auth.user`.
* **Alur Logika Bisnis**:
  1. Membaca `role` user yang sedang login untuk menentukan apakah pengguna adalah `supervisor` (`isSupervisor`).
  2. Mengarahkan tombol **"Pakai di Bar"** ke `route('stock-usages.index', { batch_id: batch.id })` (menggantikan `/usage/create` yang 404).
  3. Mengarahkan tombol **"Lapor Basi"** ke `route('waste-logs.create', { batch_id: batch.id })` (menggantikan `/waste/create` yang 404).
  4. Menampilkan tombol **"Edit Batch"** ke `route('batches.edit', batch.id)` khusus untuk Supervisor agar dapat mengoreksi stok/catatan/tanggal batch langsung dari UI.
* **Output / Return Value**: JSX halaman Monitoring Inventaris dengan seluruh tombol aksi yang valid.
* **Kaitan dengan Bagian Lain**: Terhubung ke `StockUsageController@index`, `WasteLogController@create`, dan `IngredientBatchController@edit`.

### 2. Komponen: `Login` & `handleQuickLogin` (`resources/js/Pages/Auth/Login.tsx`)
* **Tujuan**: Menyelaraskan kredensial kartu demo 1-Klik akun Barista dengan `UserSeeder.php`.
* **Input / Parameter**: Objek `DemoAccount` yang berisi `email` dan `password` masing-masing role.
* **Alur Logika Bisnis**:
  1. Menambahkan properti `password` di array `DEMO_ACCOUNTS` (`@AnGgA123` untuk Barista, `password` untuk Supervisor dan Owner).
  2. Menjadikan `'@AnGgA123'` sebagai nilai awal form (karena default pilihan kartu adalah Barista).
  3. Saat kartu demo diklik, `handleQuickLogin` mengirim `account.email` dan `account.password` ke route `login`.
* **Output / Return Value**: Request POST login dengan kredensial yang sesuai database seeder.
* **Kaitan dengan Bagian Lain**: Terhubung ke `UserSeeder.php` dan `AuthenticatedSessionController@store`.

---

## Bugfix #20 — Pembatasan Akses `/inventory` (Barista Forbidden 403)

**Tanggal:** 28 November 2026

### 1. Route: `GET /inventory` (`routes/web.php`)
* **Tujuan**: Memastikan hanya `supervisor` dan `owner` yang dapat mengakses halaman Monitoring Inventaris & Kedaluwarsa (`/inventory`), sedangkan `barista` ditolak (`403 Forbidden`).
* **Input / Parameter**: Middleware `role:supervisor,owner`.
* **Alur Logika Bisnis**:
  1. Setiap request `GET /inventory` melewati middleware `auth` lalu `role:supervisor,owner`.
  2. Jika role pengguna adalah `barista`, `RoleMiddleware` langsung mengembalikan HTTP `403 Forbidden`.
  3. `supervisor` dan `owner` tetap dapat mengakses halaman seperti biasa.
* **Output / Return Value**: Render halaman `Inventory/Index` untuk Supervisor & Owner, atau `403` untuk Barista.
* **Kaitan dengan Bagian Lain**: Terhubung ke `RoleMiddleware` dan sidebar `AuthenticatedLayout.tsx`.

### 2. Fungsi: `IngredientBatchController::store(StoreBatchRequest $request)` (`app/Http/Controllers/IngredientBatchController.php`)
* **Tujuan**: Mencegah Barista terkena error `403` setelah berhasil menyimpan penerimaan batch baru.
* **Input / Parameter**: Data batch tervalidasi dari `StoreBatchRequest` dan user yang sedang login (`$request->user()`).
* **Alur Logika Bisnis**:
  1. Menyimpan batch baru ke `ingredient_batches` dalam `DB::transaction`.
  2. Mengecek role pengguna: jika `barista`, redirect ke `dashboard.barista`; jika `supervisor`/`owner`, redirect ke `inventory.index`.
* **Output / Return Value**: `RedirectResponse` ke dashboard sesuai role dengan pesan sukses.
* **Kaitan dengan Bagian Lain**: Selaras dengan tombol navigasi pada komponen `BatchesCreate` (`resources/js/Pages/Batches/Create.tsx`).

---

## Bugfix #21 — Redirect Barista dari `/inventory` ke Dasbor Barista

**Tanggal:** 28 November 2026

### Fungsi: `IngredientBatchController::index(Request $request)` (`app/Http/Controllers/IngredientBatchController.php`)
* **Tujuan**: Mengarahkan pengguna dengan role `barista` yang mencoba membuka `/inventory` langsung ke halaman `dashboard.barista` alih-alih menampilkan error `403`.
* **Input / Parameter**: `Request $request` yang membawa user login (`$request->user()`).
* **Alur Logika Bisnis**:
  1. Memeriksa role pengguna di awal method `index()`.
  2. Jika `$request->user()?->role === 'barista'`, langsung mengembalikan `redirect()->route('dashboard.barista')`.
  3. Untuk `supervisor` dan `owner`, melanjutkan query stok bahan & batch FEFO lalu me-render `Inventory/Index`.
* **Output / Return Value**: `RedirectResponse` ke `dashboard.barista` untuk Barista, atau `Inertia\Response` untuk Supervisor & Owner.
* **Kaitan dengan Bagian Lain**: Berjalan bersama `routes/web.php` dan `DashboardController::barista()`.
