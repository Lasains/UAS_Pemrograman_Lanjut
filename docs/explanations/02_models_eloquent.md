# Penjelasan Modul 02: Eloquent Models & Relasi
## Panduan Pemula — Sistem Inventaris Kafe

> **Untuk Siapa**: Tim mahasiswa yang baru pertama kali belajar Eloquent ORM di Laravel.  
> **Pendekatan**: Setiap konsep dijelaskan dengan analogi kafe yang nyata.  
> **Kaitan dengan Kode**: [`docs/Plan Backend/PLAN_02_MODELS_ELOQUENT.md`](../Plan%20Backend/PLAN_02_MODELS_ELOQUENT.md)

---

## Konsep Dasar: "Model = Perwakilan Resmi Sebuah Baris di Database"

Bayangkan tabel database seperti **lemari arsip** berisi ribuan map. Setiap map adalah satu baris data (satu batch susu, satu catatan pemakaian, dst.).

**Model Eloquent** adalah seperti **asisten kantor yang bertanggung jawab atas satu jenis map**. Ketika kamu minta data batch susu nomor 42, asisten ini yang pergi ke lemari, ambil map-nya, dan bawakan ke kamu dalam bentuk objek PHP yang bisa kamu manipulasi.

```
Database (lemari arsip)
├── Laci "ingredient_batches"   ← diurus oleh Model IngredientBatch
├── Laci "stock_usages"         ← diurus oleh Model StockUsage  
├── Laci "waste_logs"           ← diurus oleh Model WasteLog
└── dst...
```

Tanpa Model, kamu harus tulis SQL mentah setiap saat:
```sql
SELECT * FROM ingredient_batches WHERE status = 'active' ORDER BY expiry_date ASC;
```

Dengan Model Eloquent, cukup:
```php
IngredientBatch::active()->fefoOrder()->get();
```

Jauh lebih bersih, lebih mudah dibaca, dan lebih aman!

---

## Tiga Properti Wajib di Setiap Model

Sebelum masuk ke penjelasan per-model, pahami dulu tiga properti yang wajib ada:

### 1. `$fillable` — "Daftar Kolom yang Boleh Diisi dari Form"

Ibarat **formulir resmi** di kafe. Hanya kolom yang terdaftar di `$fillable` yang boleh diisi langsung dari request/form pengguna. Kolom sensitif seperti `financial_loss` (yang harus dihitung sistem, bukan diinput user) sengaja tidak dimasukkan ke sini.

```php
// Contoh: WasteLog model
protected $fillable = [
    'ingredient_batch_id',
    'reported_by',
    'waste_quantity',
    'reason',
    // 'financial_loss' → TIDAK ADA DI SINI
    // karena nilai ini dihitung sistem, bukan diinput barista
];
```

### 2. `$casts` — "Penerjemah Tipe Data"

Database MySQL menyimpan semua data sebagai teks/angka mentah. `$casts` adalah **penerjemah otomatis** yang mengubahnya jadi tipe PHP yang tepat saat model dibaca.

```php
protected function casts(): array
{
    return [
        'expiry_date'      => 'date',      // "2026-02-15" → Carbon object
        'is_fefo_compliant'=> 'boolean',   // 1/0 → true/false
        'current_stock'    => 'decimal:2', // "6.5" → 6.50 (2 desimal pasti)
    ];
}
```

### 3. `$hidden` — "Data Rahasia yang Tidak Boleh Bocor"

Kolom yang **tidak boleh tampil** ketika model dikonversi ke JSON atau array (misalnya dikirim ke frontend). Di model `User`, password dan token autentikasi selalu disembunyikan:

```php
protected $hidden = [
    'password',       // Tidak pernah tampil di response API
    'remember_token', // Token sesi internal Laravel
];
```

---

## Penjelasan Per-Model

---

### Model `User` — Kartu Identitas Karyawan Kafe

#### Tujuan
Model ini merepresentasikan setiap karyawan yang bisa login ke sistem. Sudah ada di Laravel secara default, kita modifikasi untuk menambah kolom `role` dan relasi ke tabel lain.

#### Kolom `role` dan Helper Methods

```
🏆 owner     → Bisa baca semua laporan keuangan
🔑 supervisor → Bisa CRUD bahan, approve pemusnahan
☕ barista    → Bisa input pemakaian harian dan lapor bahan rusak
```

Tiga helper method `isOwner()`, `isSupervisor()`, `isBarista()` dibuat agar pengecekan role di Controller lebih rapi:

```php
// Tanpa helper (kurang rapi):
if ($user->role === 'supervisor') { ... }

// Dengan helper (lebih ekspresif):
if ($user->isSupervisor()) { ... }
```

#### Relasi `reportedWasteLogs()` vs `approvedWasteLogs()`

Ini adalah situasi unik: satu model (`User`) punya **dua relasi berbeda ke tabel yang sama** (`waste_logs`), karena satu user bisa jadi pelapor SEKALIGUS bisa jadi approver untuk laporan orang lain.

```
User (Dini/Barista) ──── membuat laporan ──→ waste_logs.reported_by
User (Rina/Supervisor) ── menyetujui ───────→ waste_logs.approved_by
```

---

### Model `Category` — Rak Gudang

#### Tujuan
Paling sederhana. Ibarat **papan nama rak** di gudang: "Rak Dairy", "Rak Sirup", "Rak Kopi".

#### Relasi `ingredients()`

```
Satu kategori (rak) → bisa punya BANYAK bahan (barang di rak itu)
Category::hasMany(Ingredient::class)
```

**Cara pakai**:
```php
$category = Category::with('ingredients')->find(1);
// $category->ingredients → koleksi semua bahan di kategori ini
```

---

### Model `Ingredient` — Kartu Produk Bahan Baku

#### Tujuan
Mendefinisikan **identitas sebuah bahan**: namanya, satuannya, batas minimum stok, dan berapa hari peringatan sebelum expired.

> Ingat: model ini TIDAK menyimpan berapa stok yang ada sekarang. Stok aktual ada di `IngredientBatch`.

#### Relasi `batches()`

```
Satu bahan (Fresh Milk) → bisa punya BANYAK batch kiriman
Ingredient::hasMany(IngredientBatch::class)
```

**Cara pakai**:
```php
$ingredient = Ingredient::with('batches')->find(1);
// $ingredient->batches → semua kiriman susu dari berbagai tanggal
```

---

### Fungsi (Scope): `scopeBelowMinimumStock()`

#### Tujuan
Menjawab pertanyaan: **"Bahan apa saja yang stoknya sudah menipis dan perlu restock?"**

#### Input / Parameter
Tidak ada input. Dipanggil langsung di query chain.

#### Alur Logika Bisnis

1. Untuk setiap bahan, hitung total `current_stock` dari SEMUA batch yang masih `active`
2. Bandingkan total itu dengan `minimum_stock` yang sudah diset supervisor untuk bahan tersebut
3. Jika total stok < minimum, bahan ini masuk ke hasil query

#### Output / Return Value
Koleksi `Ingredient` yang stoknya di bawah minimum.

#### Analogi Kafe
Ibarat **supervisor yang rutin cek papan stok** — melihat setiap bahan, mengecek semua wadahnya yang masih ada, lalu tandai bahan yang totalnya sudah hampir habis.

```php
// Cara pakai:
$lowStockIngredients = Ingredient::belowMinimumStock()->with('category')->get();
// Hasilnya: daftar bahan yang perlu segera dipesan ulang
```

---

### Model `IngredientBatch` ⭐ — Label Wadah Bahan

#### Tujuan
**Tabel dan model paling penting**. Setiap baris adalah satu kiriman dari supplier. Ibarat **label yang ditempel di setiap wadah bahan** saat diterima: tanggal terima, tanggal expired, harga, dan berapa sisa isinya sekarang.

#### Relasi

```
Satu batch → milik satu bahan (ingredient)
Satu batch → bisa punya banyak catatan pemakaian (stockUsages)
Satu batch → bisa punya banyak laporan pemusnahan (wasteLogs)
```

---

### Fungsi (Scope): `scopeActive()`

#### Tujuan
Menyaring hanya batch yang **masih bisa digunakan**: statusnya `active` DAN masih ada stoknya (`current_stock > 0`).

#### Alur Logika
1. Cek kolom `status` = `'active'` (bukan exhausted/expired/disposed)
2. DAN cek `current_stock` > 0 (ada sisa isinya)

#### Kenapa Dua Kondisi?
Bisa saja sebuah batch statusnya masih `'active'` tapi stoknya sudah 0 karena supervisor belum sempat update status. Pengecekan ganda ini adalah **jaring pengaman** agar barista tidak disuruh ambil dari wadah yang sudah kosong.

#### Analogi Kafe
Ibarat barista yang cek dua hal sebelum ambil bahan: (1) apakah labelnya bilang "masih aktif", dan (2) apakah isinya masih ada kalau dilihat/ditimbang.

```php
IngredientBatch::active()->get(); // Hanya batch yang benar-benar bisa dipakai
```

---

### Fungsi (Scope): `scopeFefoOrder()`

#### Tujuan
Mengurutkan batch berdasarkan tanggal kadaluwarsa **terdekat lebih dulu** (dari yang paling lama → paling baru). Ini adalah **inti algoritma FEFO**.

#### Alur Logika
Cukup satu baris: `ORDER BY expiry_date ASC`. Yang `expiry_date`-nya paling kecil (paling lama kadaluwarsa) ada di posisi pertama.

#### Analogi Kafe
Ibarat rak kulkas yang tertata dengan benar: **bahan yang paling dekat kedaluwarsanya ditaruh paling depan** agar pasti diambil lebih dulu. Scope ini yang "menata" urutan batch untuk barista.

```php
IngredientBatch::forIngredient(1)->active()->fefoOrder()->get();
// Batch[0] = yang paling dekat expired → REKOMENDASIKAN INI ke barista
// Batch[1] = yang expired-nya berikutnya
// dst...
```

---

### Fungsi (Scope): `scopeCriticalExpiry($days = 7)`

#### Tujuan
Menjawab pertanyaan: **"Batch mana saja yang akan expired dalam N hari ke depan?"** Digunakan untuk dashboard early warning (traffic light system).

#### Input / Parameter
`$days` (integer, default: 7) — rentang hari ke depan yang dicek.

#### Alur Logika
1. Ambil tanggal sekarang, tambahkan N hari → dapat tanggal batas
2. Filter batch yang `expiry_date`-nya ≤ tanggal batas tersebut
3. Batch yang sudah expired (tanggal lewat) otomatis masuk karena nilainya lebih kecil

#### Output
Koleksi batch yang akan atau sudah expired dalam rentang N hari.

#### Analogi Kafe
Ibarat supervisor yang setiap pagi **cek kalender expiry** — "Mana yang akan kadaluwarsa dalam 7 hari? Itu perlu saya pantau dan segera dipakai atau dimusnahkan."

```php
IngredientBatch::active()->criticalExpiry(7)->get();  // 🟡 Warning (7 hari)
IngredientBatch::active()->criticalExpiry(3)->get();  // 🔴 Critical (3 hari)
```

---

### Fungsi (Scope): `scopeForIngredient($ingredientId)`

#### Tujuan
Filter batch hanya untuk **satu jenis bahan** tertentu.

#### Alur Logika
`WHERE ingredient_id = $ingredientId` — hanya batch dari bahan yang dipilih.

#### Analogi Kafe
Ibarat barista yang sudah memilih "saya mau ambil Fresh Milk" — scope ini **membatasi pencarian** hanya ke wadah-wadah yang berisi Fresh Milk saja, tidak tercampur dengan bahan lain.

```php
// "Tampilkan semua batch Fresh Milk (ID=1) yang aktif, urut FEFO"
IngredientBatch::forIngredient(1)->active()->fefoOrder()->get();
```

---

### Computed Property (Accessor): `days_until_expiry`

#### Tujuan
Menghitung **berapa hari lagi** sebuah batch akan kadaluwarsa (atau sudah berapa hari kadaluwarsa jika sudah lewat).

#### Cara Akses
```php
$batch = IngredientBatch::find(42);
echo $batch->days_until_expiry; // Misal: 5
```

#### Alur Logika
1. Ambil tanggal hari ini (Carbon::today())
2. Ambil tanggal expired batch
3. Hitung selisihnya dalam hari
4. Jika expired sudah lewat → return nilai negatif

#### Output
| Nilai | Artinya |
|-------|---------|
| `5` | Masih 5 hari sebelum expired |
| `0` | Expired hari ini |
| `-2` | Sudah 2 hari lewat expired |

#### Analogi Kafe
Ibarat **stiker countdown** yang otomatis hitung mundur di label wadah. Kamu tidak perlu hitung sendiri, model yang hitung!

---

### Computed Property (Accessor): `expiry_status`

#### Tujuan
Menerjemahkan `days_until_expiry` menjadi **label traffic light** yang mudah dipahami UI.

#### Cara Akses
```php
echo $batch->expiry_status; // Misal: 'warning'
```

#### Alur Logika Bisnis
```
days_until_expiry > 7  → 'safe'     (🟢 Aman)
days_until_expiry 3-7  → 'warning'  (🟡 Peringatan)
days_until_expiry < 3  → 'critical' (🔴 Kritis)
(termasuk negatif / sudah expired)
```

#### Analogi Kafe
Ibarat sistem **lampu lalu lintas di rak gudang**. Supervisor tidak perlu ngitung tanggal manual — tinggal lihat warna, langsung tahu mana yang perlu tindakan segera.

---

### Computed Property (Accessor): `total_value`

#### Tujuan
Menghitung **nilai finansial** stok yang masih tersisa di batch ini.

#### Cara Akses
```php
echo $batch->total_value; // Misal: 185000.00 (Rp 185.000)
```

#### Alur Logika
`current_stock × cost_per_unit`

Contoh: 10 Liter × Rp 18.500/Liter = Rp 185.000

#### Analogi Kafe
Ibarat **kalkulator aset** otomatis. Owner bisa langsung tahu: "Kalau batch susu ini expired dan dibuang, kerugiannya Rp 185.000."

---

### Model `StockUsage` — Buku Log Pemakaian Harian

#### Tujuan
Setiap kali barista mencatat pemakaian bahan, satu baris baru muncul di tabel ini. Ibarat **buku harian barista** yang detail: pakai bahan dari batch mana, berapa banyak, apakah sesuai FEFO.

#### Kolom Penting

| Kolom | Penjelasan Kafe |
|-------|----------------|
| `is_fefo_compliant` | Apakah barista pakai batch yang direkomendasikan sistem (FEFO)? |
| `deviation_reason` | Kalau tidak nurut FEFO, harus tulis alasannya (untuk audit) |
| `usage_date` | Tanggal pakai — bisa berbeda dari tanggal input jika barista telat catat |

#### Relasi

```
Satu stock_usage → milik satu batch (dari mana stok diambil)
Satu stock_usage → dicatat oleh satu user (siapa yang mencatat)
```

---

### Model `WasteLog` — Berita Acara Pemusnahan

#### Tujuan
Mendokumentasikan proses pemusnahan bahan rusak/basi dari awal laporan hingga persetujuan. Ibarat **berita acara resmi** yang harus ada dua tanda tangan: pelapor dan yang menyetujui.

#### Kolom yang Sengaja TIDAK di `$fillable`

Dua kolom ini **tidak ada di `$fillable`** karena harus diisi sistem, bukan pengguna:

| Kolom | Kenapa Tidak di $fillable |
|-------|--------------------------|
| `approved_by` | Diisi sistem saat supervisor klik "Approve", bukan dari form |
| `financial_loss` | Dihitung sistem: waste_quantity × cost_per_unit, bukan diinput manual |

Ini penting untuk keamanan — mencegah barista nakal yang mengisi `financial_loss = 0` agar kerugian tidak tercatat.

#### Relasi Ganda ke User

```
WasteLog → reporter()  → User (barista yang lapor)
WasteLog → approver()  → User (supervisor yang setuju) ← bisa null!
```

Ketika memanggil `$wasteLog->approver`, hasilnya bisa `null` jika laporan masih `pending`. Gunakan `optional chaining` di PHP:
```php
$approverName = $wasteLog->approver?->name ?? 'Belum disetujui';
```

---

## Ringkasan: Cara Kerja Semua Model Bersama

```
SKENARIO: Barista Dini mencatat pemakaian susu

1. Controller memanggil: IngredientBatch::forIngredient(1)->active()->fefoOrder()->get()
   └── scopeForIngredient() → filter batch susu saja
   └── scopeActive() → hanya yang statusnya active DAN ada stoknya
   └── scopeFefoOrder() → urut dari yang paling dekat expired

2. Frontend tampilkan daftar batch ke Dini
   └── Tiap batch punya: $batch->expiry_status dan $batch->days_until_expiry
   └── Batch pertama ditandai [★ REKOMENDASI FEFO]

3. Dini pilih batch (anggap sesuai rekomendasi) dan isi kuantitas
   └── Controller buat: StockUsage::create([..., 'is_fefo_compliant' => true])
   └── Service update: $batch->decrement('current_stock', $quantity)

4. Jika stok batch = 0, Service update: $batch->update(['status' => 'exhausted'])
```

---

## Dokumentasi Teknis Per Fungsi & Method Model (Sesuai Konvensi AGENTS.md)

Berikut adalah rincian teknis per method pada seluruh Model Eloquent yang telah dibuat dan dimodifikasi:

---

### 1. Model: `User` (`app/Models/User.php`)

#### Fungsi: `stockUsages()`
* **Tujuan**: Menghubungkan user ke semua transaksi pemakaian bahan yang pernah dicatat oleh user tersebut.
* **Input / Parameter**: Tidak ada.
* **Alur Logika Bisnis (Langkah demi Langkah)**:
  1. Mengaitkan primary key `users.id` dengan foreign key `stock_usages.user_id`.
  2. Menghasilkan relasi `HasMany` ke model `StockUsage`.
* **Output / Return Value**: Instance `Illuminate\Database\Eloquent\Relations\HasMany`.
* **Kaitan dengan Bagian Lain**: Digunakan pada profil barista atau laporan audit untuk melihat siapa yang mencatat pemakaian.

#### Fungsi: `reportedWasteLogs()`
* **Tujuan**: Mengambil seluruh laporan bahan rusak/kedaluwarsa yang dilaporkan oleh user ini.
* **Input / Parameter**: Tidak ada.
* **Alur Logika Bisnis (Langkah demi Langkah)**:
  1. Menghubungkan `users.id` ke kolom foreign key kustom `waste_logs.reported_by`.
* **Output / Return Value**: Instance `HasMany` ke model `WasteLog`.
* **Kaitan dengan Bagian Lain**: Digunakan di dasbor barista untuk melihat status draf laporan waste miliknya.

#### Fungsi: `approvedWasteLogs()`
* **Tujuan**: Mengambil seluruh laporan bahan rusak yang disetujui (*approved*) oleh supervisor/owner ini.
* **Input / Parameter**: Tidak ada.
* **Alur Logika Bisnis (Langkah demi Langkah)**:
  1. Menghubungkan `users.id` ke kolom foreign key kustom `waste_logs.approved_by`.
* **Output / Return Value**: Instance `HasMany` ke model `WasteLog`.
* **Kaitan dengan Bagian Lain**: Digunakan untuk jejak audit supervisor di Approval Center.

#### Fungsi: `isOwner(): bool`
* **Tujuan**: Memeriksa secara cepat apakah user memiliki wewenang Owner.
* **Input / Parameter**: Tidak ada.
* **Alur Logika Bisnis (Langkah demi Langkah)**:
  1. Memeriksa nilai atribut `$this->role`.
  2. Mengevaluasi apakah bernilai `'owner'`.
* **Output / Return Value**: `true` jika owner, `false` jika bukan.
* **Kaitan dengan Bagian Lain**: Digunakan di middleware `CheckRole`, Gate/Policy, dan navigasi menu Owner.

#### Fungsi: `isSupervisor(): bool`
* **Tujuan**: Memeriksa apakah user adalah Supervisor.
* **Input / Parameter**: Tidak ada.
* **Alur Logika Bisnis (Langkah demi Langkah)**:
  1. Mengevaluasi kondisi `$this->role === 'supervisor'`.
* **Output / Return Value**: `boolean`.
* **Kaitan dengan Bagian Lain**: Otorisasi approval waste dan CRUD master data bahan.

#### Fungsi: `isBarista(): bool`
* **Tujuan**: Memeriksa apakah user adalah Barista.
* **Input / Parameter**: Tidak ada.
* **Alur Logika Bisnis (Langkah demi Langkah)**:
  1. Mengevaluasi kondisi `$this->role === 'barista'`.
* **Output / Return Value**: `boolean`.
* **Kaitan dengan Bagian Lain**: Otorisasi form pemakaian bahan FEFO dan draf laporan waste.

---

### 2. Model: `Category` (`app/Models/Category.php`)

#### Fungsi: `ingredients()`
* **Tujuan**: Menghubungkan kategori rak bahan ke daftar semua bahan baku di dalamnya.
* **Input / Parameter**: Tidak ada.
* **Alur Logika Bisnis (Langkah demi Langkah)**:
  1. Menghubungkan `categories.id` ke `ingredients.category_id`.
* **Output / Return Value**: Instance `HasMany` ke model `Ingredient`.
* **Kaitan dengan Bagian Lain**: Digunakan untuk dropdown filter kategori pada daftar master bahan.

---

### 3. Model: `Ingredient` (`app/Models/Ingredient.php`)

#### Fungsi: `category()`
* **Tujuan**: Mengambil data kategori induk dari suatu bahan.
* **Input / Parameter**: Tidak ada.
* **Alur Logika Bisnis (Langkah demi Langkah)**:
  1. Menghubungkan `ingredients.category_id` ke `categories.id`.
* **Output / Return Value**: Instance `BelongsTo` ke model `Category`.
* **Kaitan dengan Bagian Lain**: Menampilkan nama rak/kategori di tabel inventaris.

#### Fungsi: `batches()`
* **Tujuan**: Mengambil seluruh batch fisik (riwayat kiriman) dari bahan ini.
* **Input / Parameter**: Tidak ada.
* **Alur Logika Bisnis (Langkah demi Langkah)**:
  1. Menghubungkan `ingredients.id` ke `ingredient_batches.ingredient_id`.
* **Output / Return Value**: Instance `HasMany` ke model `IngredientBatch`.
* **Kaitan dengan Bagian Lain**: Menghitung total stok fisik bahan dari akumulasi batch aktif.

#### Fungsi: `scopeBelowMinimumStock(Builder $query)`
* **Tujuan**: Menyaring bahan yang total stok aktifnya berada di bawah ambang `minimum_stock`.
* **Input / Parameter**: Instance query builder `$query`.
* **Alur Logika Bisnis (Langkah demi Langkah)**:
  1. Menjalankan subquery `SELECT COALESCE(SUM(current_stock), 0) FROM ingredient_batches WHERE status = 'active'`.
  2. Membandingkan hasil penjumlahan tersebut: `< ingredients.minimum_stock`.
* **Output / Return Value**: Builder query yang telah terpasang klausa `whereRaw`.
* **Kaitan dengan Bagian Lain**: Menampilkan kartu peringatan *Low Stock Alert* di dasbor supervisor/owner.

---

### 4. Model: `IngredientBatch` (`app/Models/IngredientBatch.php`)

#### Fungsi: `ingredient()`
* **Tujuan**: Mengambil informasi master bahan dari batch ini.
* **Input / Parameter**: Tidak ada.
* **Alur Logika Bisnis (Langkah demi Langkah)**:
  1. Menghubungkan `ingredient_batches.ingredient_id` ke `ingredients.id`.
* **Output / Return Value**: Instance `BelongsTo` ke `Ingredient`.
* **Kaitan dengan Bagian Lain**: Eager loading nama dan satuan bahan saat menampilkan batch.

#### Fungsi: `stockUsages()` & `wasteLogs()`
* **Tujuan**: Mengambil riwayat pemakaian dan riwayat pemusnahan yang bersumber dari batch ini.
* **Input / Parameter**: Tidak ada.
* **Alur Logika Bisnis (Langkah demi Langkah)**:
  1. Menghubungkan `ingredient_batches.id` ke tabel `stock_usages` dan `waste_logs`.
* **Output / Return Value**: Instance `HasMany`.
* **Kaitan dengan Bagian Lain**: Audit trail pelacakan batch dari awal datang sampai habis.

#### Fungsi: `scopeActive(Builder $query)`
* **Tujuan**: Membatasi query hanya pada batch yang berstatus `'active'` dan masih memiliki sisa stok (`current_stock > 0`).
* **Input / Parameter**: Query builder `$query`.
* **Alur Logika Bisnis (Langkah demi Langkah)**:
  1. Menambahkan `where('status', 'active')`.
  2. Menambahkan `where('current_stock', '>', 0)`.
* **Output / Return Value**: Builder query terfilter.
* **Kaitan dengan Bagian Lain**: Fondasi pemilihan bahan di form operasional barista.

#### Fungsi: `scopeFefoOrder(Builder $query)`
* **Tujuan**: Mengurutkan batch berdasarkan tanggal kedaluwarsa terdekat (FEFO - *First Expired, First Out*).
* **Input / Parameter**: Query builder `$query`.
* **Alur Logika Bisnis (Langkah demi Langkah)**:
  1. Memasang `orderBy('expiry_date', 'asc')`.
* **Output / Return Value**: Builder query dengan batch terdekat expired di posisi paling atas (index 0).
* **Kaitan dengan Bagian Lain**: Memberikan tanda rekomendasi `[★ REKOMENDASI FEFO]` pada antarmuka barista.

#### Fungsi: `scopeCriticalExpiry(Builder $query, int $days = 7)`
* **Tujuan**: Menyaring batch yang akan kedaluwarsa dalam rentang `$days` hari ke depan.
* **Input / Parameter**: `$days` (default 7 hari).
* **Alur Logika Bisnis (Langkah demi Langkah)**:
  1. Menghitung batas waktu: `Carbon::now()->addDays($days)`.
  2. Menyaring: `expiry_date <= batas waktu`.
* **Output / Return Value**: Builder query terfilter.
* **Kaitan dengan Bagian Lain**: Widget *Early Warning* pada dasbor pemantauan stok.

#### Fungsi: `scopeForIngredient(Builder $query, int $ingredientId)`
* **Tujuan**: Memfilter batch berdasarkan jenis bahan tertentu.
* **Input / Parameter**: `$ingredientId` (ID master bahan).
* **Alur Logika Bisnis (Langkah demi Langkah)**:
  1. Menambahkan klausa `where('ingredient_id', $ingredientId)`.
* **Output / Return Value**: Builder query.
* **Kaitan dengan Bagian Lain**: Menampilkan daftar batch saat barista memilih bahan di form pemakaian.

#### Fungsi: `getDaysUntilExpiryAttribute(): int`
* **Tujuan**: Menghitung selisih hari antara hari ini dengan tanggal kedaluwarsa batch.
* **Input / Parameter**: Mengakses atribut `$this->expiry_date`.
* **Alur Logika Bisnis (Langkah demi Langkah)**:
  1. Mengambil tanggal hari ini (`today`) dan tanggal kedaluwarsa (`expiry`).
  2. Jika tanggal kedaluwarsa sudah lewat (`isPast()`), mengembalikan nilai negatif (`-1 * diffInDays`).
  3. Jika belum lewat, mengembalikan jumlah hari positif.
* **Output / Return Value**: Integer sisa hari (misal: `5`, `0`, atau `-2`).
* **Kaitan dengan Bagian Lain**: Ditampilkan pada tooltip dan kolom tabel inventaris.

#### Fungsi: `getExpiryStatusAttribute(): string`
* **Tujuan**: Menentukan kategori warna lampu lalu lintas status kedaluwarsa.
* **Input / Parameter**: Membaca `$this->days_until_expiry`.
* **Alur Logika Bisnis (Langkah demi Langkah)**:
  1. Jika sisa hari > 7: return `'safe'` (hijau).
  2. Jika sisa hari antara 3 s/d 7: return `'warning'` (kuning).
  3. Jika sisa hari < 3 atau sudah lewat: return `'critical'` (merah).
* **Output / Return Value**: String (`'safe'`, `'warning'`, atau `'critical'`).
* **Kaitan dengan Bagian Lain**: Pewarnaan badge status kedaluwarsa di antarmuka frontend Inertia.

#### Fungsi: `getTotalValueAttribute(): float`
* **Tujuan**: Menghitung nilai rupiah dari sisa stok batch saat ini.
* **Input / Parameter**: `$this->current_stock` dan `$this->cost_per_unit`.
* **Alur Logika Bisnis (Langkah demi Langkah)**:
  1. Mengalikan `current_stock` dengan `cost_per_unit`.
* **Output / Return Value**: Nilai desimal float (rupiah).
* **Kaitan dengan Bagian Lain**: Valuasi aset gudang pada kartu metrik keuangan Owner.

---

### 5. Model: `StockUsage` (`app/Models/StockUsage.php`)

#### Fungsi: `batch()` & `user()`
* **Tujuan**: Menghubungkan log pemakaian ke batch sumber dan barista pencatatnya.
* **Input / Parameter**: Tidak ada.
* **Alur Logika Bisnis (Langkah demi Langkah)**:
  1. Mengaitkan foreign key `ingredient_batch_id` ke `IngredientBatch` dan `user_id` ke `User`.
* **Output / Return Value**: Instance `BelongsTo`.
* **Kaitan dengan Bagian Lain**: Eager loading detail pemakaian bahan pada laporan audit.

---

### 6. Model: `WasteLog` (`app/Models/WasteLog.php`)

#### Fungsi: `batch()`, `reporter()`, `approver()`
* **Tujuan**: Menghubungkan berita acara pemusnahan ke batch bahan, user pelapor (barista), dan user penyetujui (supervisor).
* **Input / Parameter**: Tidak ada.
* **Alur Logika Bisnis (Langkah demi Langkah)**:
  1. `batch()` mengaitkan `ingredient_batch_id` ke `IngredientBatch`.
  2. `reporter()` mengaitkan `reported_by` ke `User`.
  3. `approver()` mengaitkan `approved_by` ke `User` (bersifat nullable).
* **Output / Return Value**: Instance `BelongsTo`.
* **Kaitan dengan Bagian Lain**: Menampilkan alur tanda tangan dua arah (Pelapor & Penyetuju) di Waste Approval Center.

---

*Dokumen ini adalah panduan pemula yang mendampingi spesifikasi teknis di [`PLAN_02_MODELS_ELOQUENT.md`](../Plan%20Backend/PLAN_02_MODELS_ELOQUENT.md). Untuk kode PHP lengkap setiap model, lihat dokumen teknis tersebut.*
