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

*Dokumen ini adalah panduan pemula yang mendampingi spesifikasi teknis di [`PLAN_02_MODELS_ELOQUENT.md`](../Plan%20Backend/PLAN_02_MODELS_ELOQUENT.md). Untuk kode PHP lengkap setiap model, lihat dokumen teknis tersebut.*
