# PANDUAN KERJA KHUSUS: BACKEND DEVELOPER 1 (BE 1)

**Fokus Utama**: Arsitektur Basis Data, Migrasi & Model Eloquent, Seeder Awal, Controller Restock Batch, dan Logika Inti Pengurangan Stok FEFO.

---

## 1. File & Folder Tanggung Jawab Anda
* `database/migrations/*` (File-file migrasi tabel)
* `database/seeders/*` (Data awal user dan bahan kafe)
* `app/Models/*` (Semua model Eloquent dan relasinya)
* `app/Http/Controllers/BatchController.php` (Input restock batch baru)
* `app/Http/Controllers/StockUsageController.php` (Pemotongan stok FEFO)

---

## 2. Rincian Tugas Bertahap

### 📌 Minggu 1 (Tugas Fondasi)

#### Task 1: Skema Database & Migrations
Buat migration tabel-tabel berikut dengan urutan yang benar (agar tidak error foreign key):
1. Tambahkan kolom `role` pada tabel `users`: enum (`'owner'`, `'supervisor'`, `'barista'`) default `'barista'`.
2. Tabel `categories`: `id`, `name`, `slug`, `timestamps`.
3. Tabel `ingredients`:
   * `id`, `category_id` (foreignId -> categories -> cascadeOnDelete),
   * `name` (string), `unit` (string: ml, gram, pcs),
   * `minimum_stock` (decimal 10,2), `warning_days` (integer, default 3).
4. Tabel `ingredient_batches`:
   * `id`, `ingredient_id` (foreignId -> ingredients -> cascadeOnDelete),
   * `batch_code` (string, unik),
   * `initial_stock` (decimal 10,2), `current_stock` (decimal 10,2),
   * `received_date` (date), `expiry_date` (date),
   * `cost_per_unit` (decimal 12,2),
   * `status` (enum: `'active'`, `'exhausted'`, `'expired'`, `'disposed'`, default `'active'`).
5. Tabel `stock_usages`:
   * `id`, `ingredient_batch_id` (foreignId -> ingredient_batches),
   * `user_id` (foreignId -> users),
   * `quantity_used` (decimal 10,2), `usage_date` (date),
   * `is_fefo_compliant` (boolean, default true),
   * `deviation_reason` (string, nullable), `notes` (text, nullable).
6. Tabel `waste_logs`:
   * `id`, `ingredient_batch_id` (foreignId -> ingredient_batches),
   * `reported_by` (foreignId -> users), `approved_by` (foreignId -> users, nullable),
   * `waste_quantity` (decimal 10,2), `financial_loss` (decimal 12,2),
   * `reason` (string), `status` (enum: `'pending'`, `'approved'`, `'rejected'`, default `'pending'`).

#### Task 2: Relasi Model Eloquent
Deklarasikan relasi pada setiap model di folder `app/Models/`:
* `Category` -> `hasMany(Ingredient::class)`
* `Ingredient` -> `belongsTo(Category::class)`, `hasMany(IngredientBatch::class)`
* `IngredientBatch` -> `belongsTo(Ingredient::class)`, `hasMany(StockUsage::class)`, `hasMany(WasteLog::class)`
* `StockUsage` -> `belongsTo(IngredientBatch::class)`, `belongsTo(User::class)`
* `WasteLog` -> `belongsTo(IngredientBatch::class)`, `belongsTo(User::class, 'reported_by')`, `belongsTo(User::class, 'approved_by')`

#### Task 3: Database Seeder
Di file `database/seeders/DatabaseSeeder.php`, buat data akun dummy:
* Owner: `owner@kafe.com` (role: `owner`)
* Supervisor: `spv@kafe.com` (role: `supervisor`)
* Barista: `barista@kafe.com` (role: `barista`)
* Password default: `password`
* Buat 2-3 kategori (Dairy, Coffee Beans, Syrup) dan 3 contoh bahan (Fresh Milk 1L, Espresso Blend 1kg, Vanilla Syrup 750ml).

---

### 📌 Minggu 2 (Core Feature & FEFO Engine)

#### Task 4: Batch Restock Controller (`BatchController@store`)
* Validasi input: `expiry_date` harus lebih besar dari `received_date`.
* Auto-generate nomor batch unik jika tidak diisi manual: `BATCH-YYYYMMDD-XX`.
* Set `current_stock = initial_stock`.
* Simpan ke database menggunakan transaksi `DB::transaction`.

#### Task 5: Logika Pengurangan Stok FEFO (`StockUsageController@store`)
* Validasi kuantitas yang diminta tidak boleh melebihi `current_stock` dari batch terpilih.
* **Cek Kepatuhan FEFO**:
  1. Cari batch aktif dari bahan tersebut yang tanggal expired-nya paling dekat:
     ```php
     $fefoBatch = IngredientBatch::where('ingredient_id', $ingredientId)
         ->where('status', 'active')
         ->where('current_stock', '>', 0)
         ->orderBy('expiry_date', 'asc')
         ->first();
     ```
  2. Bandingkan ID batch yang dipilih barista dengan `$fefoBatch->id`.
  3. Jika sama: `is_fefo_compliant = true`, `deviation_reason = null`.
  4. Jika beda: `is_fefo_compliant = false`, wajib validasi bahwa `deviation_reason` tidak boleh kosong!
* Kurangi `current_stock`. Jika sisa stok = 0, ubah status batch menjadi `'exhausted'`.

---

## 3. Do's and Don'ts untuk BE 1
* ✅ **DO**: Selalu gunakan `DB::transaction` saat memotong stok agar saldo tidak selisih jika terjadi error jaringan.
* ✅ **DO**: Selalu uji coba dengan perintah `php artisan migrate:fresh --seed` sebelum melakukan commit.
* ❌ **DON'T**: Jangan mengubah struktur nama kolom tabel tanpa berkoordinasi dengan PM dan BE 2.
