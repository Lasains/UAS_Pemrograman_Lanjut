# PANDUAN KERJA KHUSUS: BACKEND DEVELOPER 1 (BE 1)

> **Peran**: Backend Developer 1 (Database Architect & Core Inventory Engine Specialist)  
> **Tingkat Tim**: Pemula (Beginner-Friendly Environment)  
> **Fokus Utama**: Arsitektur Basis Data Utuh (Semua Migrasi & Model), Seeder Akun & Data Kafe, Controller Restock Batch, serta Mesin Algoritma Pemotongan Stok FEFO.  
> **Rujukan Dokumen Rencana**: `docs/Plan Backend/PLAN_01`, `PLAN_02`, `PLAN_03`, `PLAN_05`, dan `PLAN_06`

---

## 1. File & Folder Tanggung Jawab Anda
* `database/migrations/` (Seluruh 6 File Migrasi Database):
  * `xxxx_xx_xx_xxxxxx_add_role_to_users_table.php`
  * `xxxx_xx_xx_xxxxxx_create_categories_table.php`
  * `xxxx_xx_xx_xxxxxx_create_ingredients_table.php`
  * `xxxx_xx_xx_xxxxxx_create_ingredient_batches_table.php`
  * `xxxx_xx_xx_xxxxxx_create_stock_usages_table.php`
  * `xxxx_xx_xx_xxxxxx_create_waste_logs_table.php`
* `app/Models/` (Seluruh 6 Model Eloquent & Relasi):
  * `User.php`
  * `Category.php`
  * `Ingredient.php`
  * `IngredientBatch.php` (scopes: `active()`, `fefoOrdered()`, `nearExpiry()`)
  * `StockUsage.php`
  * `WasteLog.php`
* `database/seeders/` (Seeder Akun & Data Uji):
  * `DatabaseSeeder.php` (Orkestrator seeder utama)
  * `UserSeeder.php` (Akun demo 3 role)
  * `CategorySeeder.php`, `IngredientSeeder.php`, `IngredientBatchSeeder.php`
* `app/Http/Controllers/BatchController.php` & `app/Http/Requests/StoreBatchRequest.php` & `app/Services/BatchCodeGenerator.php` (Penerimaan Restock)
* `app/Http/Controllers/StockUsageController.php` & `app/Http/Requests/RecordUsageRequest.php` & `app/Actions/DeductStockAction.php` (Mesin Algoritma FEFO)

---

## 2. Rincian Tugas Bertahap Mingguan

### 📌 MINGGU 1: Arsitektur Database Utuh, Model Eloquent & Seeder Akun

#### Task 1: Seluruh Migrasi Database 6 Tabel (Rujukan: `PLAN_01_MIGRATIONS_SCHEMA.md`)
Buat seluruh skema tabel database kafe dalam 6 file migrasi dengan urutan foreign key yang benar:
1. **Alter `users` Table**: Tambahkan kolom `role` bertipe enum (`'owner'`, `'supervisor'`, `'barista'`) default `'barista'`.
2. **Tabel `categories`**: `id`, `name` (string 50), `slug` (string 60, unik), `timestamps`.
3. **Tabel `ingredients`**:
   * `id`, `category_id` (foreignId -> `categories` -> `cascadeOnDelete`).
   * `name` (string 100), `unit` (string: `'ml'`, `'gram'`, `'pcs'`).
   * `minimum_stock` (decimal 10,2), `warning_days` (integer, default 3).
4. **Tabel `ingredient_batches`**:
   * `id`, `ingredient_id` (foreignId -> `ingredients` -> `cascadeOnDelete`).
   * `batch_code` (string 50, unik), `initial_stock` (decimal 10,2), `current_stock` (decimal 10,2).
   * `received_date` (date), `expiry_date` (date).
   * `cost_per_unit` (decimal 12,2).
   * `status` (enum: `'active'`, `'exhausted'`, `'expired'`, `'disposed'`, default `'active'`).
   * *Index komposit*: `['ingredient_id', 'status', 'expiry_date']` untuk optimasi pencarian FEFO.
5. **Tabel `stock_usages`**:
   * `id`, `ingredient_batch_id` (foreignId -> `ingredient_batches` -> `restrictOnDelete`).
   * `user_id` (foreignId -> `users` -> `cascadeOnDelete`).
   * `quantity_used` (decimal 10,2), `usage_date` (date).
   * `is_fefo_compliant` (boolean, default true).
   * `deviation_reason` (string, nullable), `notes` (text, nullable).
6. **Tabel `waste_logs`**:
   * `id`, `ingredient_batch_id` (foreignId -> `ingredient_batches` -> `restrictOnDelete`).
   * `reported_by` (foreignId -> `users` -> `cascadeOnDelete`).
   * `approved_by` (foreignId -> `users` -> `nullOnDelete`, nullable).
   * `waste_quantity` (decimal 10,2), `financial_loss` (decimal 12,2, nullable saat pending).
   * `reason` (string 255), `notes` (text, nullable).
   * `status` (enum: `'pending'`, `'approved'`, `'rejected'`, default `'pending'`).

#### Task 2: Seluruh Model Eloquent & Relasi (Rujukan: `PLAN_02_MODELS_ELOQUENT.md`)
Deklarasikan relasi, fillable, dan query scope pada seluruh model:
* **`User`**: `$fillable = ['name', 'email', 'password', 'role']`, relasi `hasMany(StockUsage::class)`.
* **`Category`**: `hasMany(Ingredient::class)`.
* **`Ingredient`**: `belongsTo(Category::class)`, `hasMany(IngredientBatch::class)`, `hasManyThrough(StockUsage::class, IngredientBatch::class)`.
* **`IngredientBatch`**:
  * `belongsTo(Ingredient::class)`, `hasMany(StockUsage::class)`, `hasMany(WasteLog::class)`.
  * *Query Scope FEFO*:
    ```php
    public function scopeFefoOrdered($query) {
        return $query->orderBy('expiry_date', 'asc')->orderBy('created_at', 'asc');
    }
    public function scopeActive($query) {
        return $query->where('status', 'active')->where('current_stock', '>', 0);
    }
    ```
* **`StockUsage`**: `belongsTo(IngredientBatch::class)`, `belongsTo(User::class)`.
* **`WasteLog`**: `belongsTo(IngredientBatch::class)`, `belongsTo(User::class, 'reported_by')`, `belongsTo(User::class, 'approved_by')`.

#### Task 3: Database Seeder & Data Uji Kafe (Rujukan: `PLAN_03_DATABASE_SEEDER.md`)
Buat data akun demo dan contoh stok bahan di `database/seeders/`:
* **UserSeeder**:
  * Owner: `owner@kafe.com` (role: `owner`)
  * Supervisor: `spv@kafe.com` (role: `supervisor`)
  * Barista: `barista@kafe.com` (role: `barista`)
  * Password default seluruh akun: `password`
* **Data Awal Kafe**:
  * Kategori: *Dairy*, *Coffee Beans*, *Syrup*.
  * Bahan: *Fresh Milk 1L* (`ml`), *Espresso Blend* (`gram`), *Vanilla Syrup* (`ml`).
  * Buat minimal 3 batch susu dengan tanggal berbeda: 1 batch kritis (< 3 hari), 1 batch warning (4-7 hari), dan 1 batch aman (> 7 hari).

---

### 📌 MINGGU 2: Controller Restock Barang Masuk & Mesin Logika FEFO

#### Task 4: Controller Restock Batch (Rujukan: `PLAN_05_BATCH_RESTOCK_CONTROLLER.md`)
* **File**: `app/Http/Controllers/BatchController.php`, `app/Http/Requests/StoreBatchRequest.php`, `app/Services/BatchCodeGenerator.php`.
* **Validasi `StoreBatchRequest`**:
  * `ingredient_id` wajib ada di tabel ingredients.
  * `expiry_date` wajib tanggal setelah `received_date` (`after:received_date`).
  * `initial_stock` numerik > 0.
  * `cost_per_unit` numerik >= 0.
* **Service Generator Kode Batch (`BatchCodeGenerator.php`)**:
  * Format otomatis jika dikosongkan: `BATCH-YYYYMMDD-XXXX`.
* **Alur `BatchController@store`**:
  * Set `current_stock = initial_stock` dan `status = 'active'`.
  * Simpan menggunakan `DB::transaction`.
  * Redirect kembali dengan pesan kilat (*flash message*): `"Batch bahan berhasil ditambahkan ke inventaris!"`.

#### Task 5: Mesin Pemotongan Stok FEFO (Rujukan: `PLAN_06_STOCK_USAGE_FEFO_CONTROLLER.md`)
* **File**: `app/Http/Controllers/StockUsageController.php`, `app/Http/Requests/RecordUsageRequest.php`, `app/Actions/DeductStockAction.php`.
* **Validasi `RecordUsageRequest`**:
  * Pastikan kuantitas pemakaian (`quantity_used`) tidak boleh melebihi `current_stock` dari batch terpilih.
* **Algoritma Deteksi Kepatuhan FEFO**:
  1. Cari batch rekomendasi prioritas utama (expired terdekat):
     ```php
     $fefoBatch = IngredientBatch::where('ingredient_id', $ingredientId)
         ->active()
         ->fefoOrdered()
         ->first();
     ```
  2. Bandingkan ID batch yang dipilih barista dengan `$fefoBatch->id`.
  3. **Jika sama**: `is_fefo_compliant = true`, `deviation_reason = null`.
  4. **Jika beda (Deviasi)**: `is_fefo_compliant = false`, **wajibkan** string `deviation_reason` tidak boleh kosong!
* **Pemotongan Stok via `DeductStockAction`**:
  * Gunakan `DB::transaction`.
  * Kurangi `current_stock`. Jika stok tersisa = 0, ubah status batch menjadi `'exhausted'`.
  * Catat riwayat ke tabel `stock_usages`.

---

### 📌 MINGGU 3: Integrasi Data Pemakaian ke Frontend & Uji Skenario
* Hubungkan endpoint `GET /stock-usages/create` dan `POST /stock-usages` dengan modal FE 2 (`CreateUsageModal.tsx`).
* Pastikan endpoint mengembalikan daftar batch aktif terurut FEFO sehingga frontend langsung menandai rekomendasi bintang `[★ REKOMENDASI FEFO]`.
* Lakukan uji bersama BE 2 untuk memastikan bahwa stok yang dipotong oleh transaksi pemakaian tidak mengganggu tabel `waste_logs`.

---

### 📌 MINGGU 4: Code Freeze, Uji Kasus Ekstrim & Demo UAS
* Uji kasus batas (*edge cases*):
  * Barista mencoba memakai stok melebihi saldo batch (harus gagal validasi).
  * Barista memilih batch bukan rekomendasi tanpa mengisi alasan deviasi (harus gagal validasi).
* Siapkan penjelasan teknis mengenai algoritma FEFO dan `DB::transaction` untuk sesi tanya jawab penguji UAS.

---

## 3. Panduan Mengatasi Error Umum Backend (Troubleshooting Guide)

Ketika Anda menemui error saat ngoding backend, **jangan panik!** Error adalah hal normal dalam pemrograman. Ikuti langkah diagnosis dan penanganan berikut:

### 1. Kamus Kode Status HTTP (500, 404, 403, 419, 422) & Cara Mengatasinya

#### 🔴 Error 500 — Internal Server Error (Kodingan Backend Crash)
* **Artinya**: Terjadi kesalahan fatal di script PHP backend (misal: memanggil fungsi pada variabel yang bernilai `null`, query database error, atau logika program terputus).
* **Cara Cek**:
  1. Buka file log: `storage/logs/laravel.log` di VS Code.
  2. Gulir (*scroll*) ke baris paling bawah.
  3. Cari baris yang diawali kata `[YYYY-MM-DD HH:MM:SS] local.ERROR: ...`. Di situ tertera nama file dan nomor baris persis di mana error terjadi.
* **Cara Mengatasi**: Buka file dan baris yang ditunjukkan pada log, periksa apakah ada variabel yang belum didefinisikan, relasi tabel yang salah panggil, atau data database yang kosong.

#### 🟡 Error 404 — Not Found (Rute URL atau Data Tidak Ditemukan)
* **Artinya**: Alamat URL yang diakses browser tidak terdaftar di sistem rute, atau ID data di database tidak ditemukan (*Model Not Found*).
* **Cara Cek**:
  1. Periksa alamat URL di browser.
  2. Buka terminal dan jalankan:
     ```bash
     php artisan route:list
     ```
     Periksa apakah rute tersebut benar-benar ada dan method-nya sesuai (`GET`/`POST`).
* **Cara Mengatasi**:
  * Jika rute belum terdaftar: Tambahkan rute di file `routes/web.php`.
  * Jika menggunakan Route Model Binding (misal: `/batches/{batch}`): Pastikan ID batch yang dipanggil memang ada di tabel database.

#### ⛔ Error 403 — Forbidden (Akses Ditolak / Peran Tidak Cocok)
* **Artinya**: Pengguna sudah login, tetapi tidak memiliki izin peran (*Role-Based Access Control*) untuk membuka halaman tersebut.
* **Cara Cek**: Periksa middleware rute di `routes/web.php` (contoh: rute diproteksi `role:owner,supervisor`, tetapi Anda login sebagai `barista`).
* **Cara Mengatasi**:
  * Login ulang menggunakan akun demo yang memiliki izin sesuai (misal ganti login sebagai Supervisor).
  * Periksa logika verifikasi di `app/Http/Middleware/RoleMiddleware.php`.

#### ⚠️ Error 419 — Page Expired / CSRF Token Mismatch (Sesi Berakhir)
* **Artinya**: Sesi login browser telah habis (*timeout*) atau form dikirim tanpa menyertakan token keamanan CSRF Laravel.
* **Cara Cek**: Biasanya terjadi saat form disubmit setelah laptop lama ditinggal atau form HTML dikirim secara manual tanpa Inertia.
* **Cara Mengatasi**:
  * Muat ulang halaman browser (`F5` atau `Ctrl+R`) lalu login kembali.
  * Pastikan seluruh form frontend dikirim menggunakan helper `useForm` dari `@inertiajs/react` (karena Inertia otomatis mengurus token CSRF).

#### 📋 Error 422 — Unprocessable Content (Validasi Form Gagal)
* **Artinya**: Backend menolak data yang dikirim karena tidak lolos aturan validasi (misal: kuantitas bernilai minus, tanggal kedaluwarsa lampau, atau alasan deviasi belum diisi).
* **Cara Cek**:
  1. Di browser, klik kanan di sembarang tempat -> pilih **Inspect** (atau tekan tombol `F12`).
  2. Klik tab **Network**.
  3. Lakukan submit form hingga muncul baris request berwarna merah (status `422`).
  4. Klik request tersebut, lalu buka sub-tab **Response** untuk membaca daftar field mana saja yang gagal beserta alasannya.
* **Cara Mengatasi**: Buka file Form Request terkait (misal `StoreBatchRequest.php` atau `RecordUsageRequest.php`), dan sesuaikan aturan pada method `rules()`.

### 2. Error: *"Foreign key constraint is incorrectly formed"*
* **Penyebab**: Urutan pembuatan tabel terbalik (misal: tabel `ingredient_batches` mencoba memanggil `ingredient_id`, padahal tabel `ingredients` belum dibuat).
* **Solusi**: Periksa tanggal/waktu pada nama file di `database/migrations/`. Pastikan urutannya:
  1. `users` (tambah kolom role)
  2. `categories`
  3. `ingredients` (merujuk ke categories)
  4. `ingredient_batches` (merujuk ke ingredients)
  5. `stock_usages` (merujuk ke ingredient_batches)
  6. `waste_logs` (merujuk ke ingredient_batches)

### 3. Error: *"Add [nama_kolom] to fillable property to allow mass assignment"*
* **Penyebab**: Anda menyimpan data menggunakan `Model::create($request->all())` tetapi kolom tersebut belum didaftarkan di Model Eloquent.
* **Solusi**: Buka file model terkait di `app/Models/NamaModel.php`, lalu tambahkan nama kolom tersebut ke dalam array:
  ```php
  protected $fillable = ['kolom_1', 'kolom_2', 'nama_kolom'];
  ```

### 4. Error: *"Class 'App\Models\...' not found"*
* **Penyebab**: Anda baru saja membuat file PHP baru atau ada salah ketik huruf besar/kecil (*case-sensitive*) pada namespace.
* **Solusi**: 
  1. Pastikan nama file sama persis dengan nama class (contoh: file `IngredientBatch.php` harus berisi `class IngredientBatch`).
  2. Jalankan perintah refresh autoload di terminal:
     ```bash
     composer dump-autoload
     ```

### 5. Database Mengalami Kerusakan Data Uji / Ingin Reset Bersih
* **Penyebab**: Saat mencoba-coba kodingan, saldo stok menjadi minus atau data dummy menjadi berantakan.
* **Solusi**: Jalankan perintah sakti ini untuk menghapus dan membangun ulang seluruh database beserta data awal secara otomatis:
  ```bash
  php artisan migrate:fresh --seed
  ```

---

## 4. Do's and Don'ts untuk BE 1
* ✅ **DO**: Selalu bungkus setiap pemotongan stok dan penyimpanan batch di dalam `DB::transaction(...)`.
* ✅ **DO**: Uji coba perintah `php artisan migrate:fresh --seed` di komputer lokal sebelum membuat Pull Request.
* ✅ **DO**: Tuliskan dokumentasi fungsi yang Anda buat di folder `docs/explanations/`.
* ❌ **DON'T**: Jangan mengubah struktur kolom tabel database tanpa berkoordinasi dengan BE 2 dan tim Frontend!
