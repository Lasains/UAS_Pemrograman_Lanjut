# Penjelasan Modul 05: BatchController & Alur Penerimaan Restock
## Panduan Pemula — Sistem Inventaris Kafe

> **Untuk Siapa**: Tim mahasiswa yang baru belajar Controller dan Form Request di Laravel.  
> **Pendekatan**: Analogi proses penerimaan kiriman barang dari supplier di gudang kafe.  
> **Kaitan dengan Kode**: [`docs/Plan Backend/PLAN_05_BATCH_RESTOCK_CONTROLLER.md`](../Plan%20Backend/PLAN_05_BATCH_RESTOCK_CONTROLLER.md)

---

## Konsep Dasar: "Controller = Manajer Gudang yang Terima & Catat Kiriman"

Bayangkan proses penerimaan kiriman susu dari supplier:

```
1. 🚚 Truk supplier datang — Barista terima kiriman
2. 📋 Barista isi formulir: nama bahan, tanggal expired, jumlah, harga
3. ✅ Formulir dicek: apakah data masuk akal? (tanggal valid? jumlah > 0?)
4. 🏷️ Sistem buat label/kode untuk batch ini
5. 📦 Batch dicatat di sistem — stok bertambah
6. 🎉 Selesai — stok tersedia untuk digunakan
```

Dalam kode Laravel:
```
1. Barista buka form → Controller::create() kirim form ke browser
2. Barista isi form → Browser kirim data ke server (POST /batches)
3. Form Request → Validasi semua input secara otomatis
4. Controller::store() → Generate batch code jika perlu
5. DB::transaction → Simpan ke database
6. Redirect → Notifikasi sukses di halaman inventory
```

---

## Apa itu Form Request?

### Analogi Kafe
Form Request ibarat **petugas penerima dokumen di kantor** yang cek formulir sebelum diserahkan ke manajer:
- "Nama bahan sudah dipilih? ✅"
- "Tanggal expired di masa depan? ✅"
- "Jumlah lebih dari 0? ✅"
- "Kode batch belum dipakai orang lain? ✅"

Jika ada yang tidak beres, dokumen **dikembalikan ke barista** dengan catatan "kolom X perlu diperbaiki" — manajer (Controller) tidak perlu tahu soal ini sama sekali.

### Mengapa Tidak Validasi di Controller Langsung?

```php
// ❌ CARA LAMA — validasi di dalam Controller (kotor, susah ditest)
public function store(Request $request)
{
    $request->validate([
        'ingredient_id' => 'required|exists:ingredients,id',
        'expiry_date'   => 'required|date|after:today',
        // ... 10 aturan lagi
    ]);
    // ... logic store
}

// ✅ CARA BARU — pakai Form Request (bersih, terpisah, bisa ditest mandiri)
public function store(StoreBatchRequest $request)
{
    // $request SUDAH pasti valid saat masuk sini
    // Tidak perlu validasi lagi!
    IngredientBatch::create([...]);
}
```

---

## Penjelasan Per-Fungsi: `StoreBatchRequest`

---

### Fungsi: `rules()`

#### Tujuan
Mendefinisikan semua aturan validasi untuk setiap field di form penerimaan batch.

#### Input / Parameter
Tidak ada — mengambil data dari `$this->input(...)` secara internal.

#### Aturan-Aturan Penting dan Alasannya

**`ingredient_id`: `exists:ingredients,id`**
- Memastikan ID bahan yang dikirim dari form benar-benar ada di database
- Mencegah barista mengirim ID sembarangan via manipulasi form

**`batch_code`: `nullable` + `unique:ingredient_batches`**
- `nullable` → boleh kosong, nanti sistem auto-generate
- `unique` → jika diisi manual, harus belum ada yang pakai
- Mencegah dua batch punya kode yang sama (kacau saat FEFO)

**`expiry_date`: `after:received_date` + `after:today`**
- Aturan GANDA yang penting:
  - `after:received_date` → masa expired HARUS setelah barang diterima (logika dasar)
  - `after:today` → tidak masuk akal menerima barang yang sudah expired!

```
Contoh yang DITOLAK:
  received_date: 2026-10-31 (hari ini)
  expiry_date:   2026-10-30 (kemarin) ← ❌ after:received_date GAGAL

  received_date: 2026-10-31 (hari ini)
  expiry_date:   2026-10-31 (hari ini) ← ❌ after:today GAGAL (harus SETELAH hari ini)

Contoh yang DITERIMA:
  received_date: 2026-10-31 (hari ini)
  expiry_date:   2026-11-15 (15 hari lagi) ← ✅ Lolos semua
```

#### Output
- Lolos: Controller `store()` bisa dieksekusi
- Gagal: Browser mendapatkan daftar error per-field, barista lihat pesan dalam Bahasa Indonesia

---

### Fungsi: `prepareForValidation()`

#### Tujuan
Mempersiapkan dan membersihkan data SEBELUM validasi dijalankan.

#### Input / Parameter
Tidak ada — modifikasi data request langsung via `$this->merge([...])`.

#### Alur Logika Bisnis

1. **Cek `received_date`**: Jika barista tidak mengisi tanggal terima (sering terjadi karena "ya hari ini lah"), sistem otomatis isi dengan `now()->toDateString()`
2. **Bersihkan `batch_code`**: Jika diisi, hapus spasi di awal/akhir dan jadikan huruf besar (MILK-001, bukan " milk-001 ")

#### Analogi Kafe
Ibarat **formulir dengan nilai default**: kolom "Tanggal Terima" sudah terisi hari ini secara default — barista tidak perlu isi kalau memang diterima hari ini.

---

## Penjelasan Per-Fungsi: `IngredientBatchController`

---

### Fungsi: `index(Request $request)`

#### Tujuan
Menampilkan daftar semua batch dengan kemampuan filter dan pencarian.

#### Input / Parameter
`$request` — bisa berisi query string filter:
- `?ingredient_id=1` → tampilkan hanya batch Fresh Milk
- `?status=active` → hanya batch yang aktif
- `?expiry=critical` → hanya batch yang akan expired dalam 3 hari
- `?search=MILK` → cari berdasarkan kode atau nama bahan

#### Alur Logika Bisnis

1. Mulai query dari semua batch (termasuk relasi ingredient dan kategori)
2. Jika ada filter → tambahkan kondisi WHERE ke query
3. Sort default: expiry_date ASC (batch yang paling dekat expired tampil duluan — FEFO!)
4. Paginate 15 item per halaman
5. Attach accessor ke setiap batch (expiry_status, days_until_expiry, total_value)
6. Hitung summary statistik (berapa batch kritis, warning, dsb.)
7. Kirim semua data ke halaman React via Inertia

#### Output
Halaman `Batches/Index` dengan daftar batch, filter aktif, dan kartu summary.

#### Analogi Kafe
Ibarat **papan display gudang** yang menampilkan semua stok — supervisor bisa filter "tampilkan hanya yang mau expired minggu ini" atau cari "batch mana yang susu".

---

### Fungsi: `create()`

#### Tujuan
Mengirim data yang diperlukan oleh form tambah batch baru ke frontend.

#### Alur Logika Bisnis

1. Ambil semua bahan dari database (untuk dropdown "Pilih Bahan")
2. Siapkan tanggal hari ini untuk pre-fill field "Tanggal Terima"
3. Preview kode batch yang akan di-generate (transparansi ke barista)
4. Kirim ke halaman `Batches/Create`

#### Analogi Kafe
Ibarat manajer yang **menyiapkan formulir kosong** sebelum diberikan ke barista — formulir sudah ada daftar bahan di dropdown dan tanggal hari ini sudah terisi.

---

### Fungsi: `store(StoreBatchRequest $request)`

#### Tujuan
Menyimpan data batch baru ke database setelah validasi berhasil.

#### Input / Parameter
`$request` — Sudah **dijamin valid** oleh `StoreBatchRequest`. Controller tidak perlu cek ulang.

#### Alur Logika Bisnis

1. **Tentukan batch code**: jika user isi → pakai itu. Jika kosong → generate otomatis
2. **DB::transaction** — bungkus operasi database dalam transaksi:
   - Jika berhasil → commit (data tersimpan permanen)
   - Jika gagal di tengah jalan → rollback (tidak ada data setengah tersimpan)
3. Buat record `IngredientBatch` baru:
   - `current_stock` = `initial_stock` (stok sisa = stok yang diterima, belum ada yang pakai)
   - `status` = `'active'` (baru diterima = aktif)
4. Jika ada konflik kode batch (race condition) → tangkap error, minta user coba lagi
5. Redirect ke halaman inventory dengan notifikasi sukses

#### Aturan Bisnis Kritis: `current_stock = initial_stock`

```php
IngredientBatch::create([
    'initial_stock' => $request->input('initial_stock'),  // Misal: 24 botol
    'current_stock' => $request->input('initial_stock'),  // Juga 24 botol — SENGAJA SAMA
    // ...
]);
```

Kenapa harus sama? Karena:
- `initial_stock` = jumlah yang **diterima dari supplier** (tidak pernah berubah)
- `current_stock` = jumlah yang **tersisa sekarang** (berkurang tiap pemakaian)
- Saat pertama dibuat, belum ada yang pakai → keduanya harus sama

#### Output / Return Value
- Sukses → `redirect → /inventory` + notifikasi "Batch MILK-A berhasil ditambahkan"
- Gagal validasi → `redirect back` + error per-field tampil di form
- Gagal database → `redirect back` + pesan error umum

---

### Fungsi: `destroy(IngredientBatch $batch)` — Bukan Hapus Sungguhan!

#### Tujuan
"Menghapus" batch dari tampilan aktif — tapi **tanpa benar-benar menghapus data** dari database.

#### Mengapa Tidak Boleh Hard Delete?

```
Bayangkan skenario ini:
  1. Batch "MILK-A-001" sudah dipakai 5 kali (ada di tabel stock_usages)
  2. Supervisor hapus batch ini → data batch hilang dari database
  3. Catatan stock_usages sekarang "yatim piatu" — merujuk batch yang tidak ada
  4. Laporan pemakaian untuk Pak Budi (Owner) menjadi kacau/error
```

Ini adalah business rule yang sudah ditentukan sejak PLAN_01: **data batch tidak pernah dihapus**.

#### Alur Logika Bisnis

1. **Guard 1**: Cek apakah batch ini sudah punya riwayat pemakaian (`stockUsages()->exists()`)
   - Jika ada → tolak, tampilkan pesan "gunakan jalur pemusnahan resmi"
2. **Guard 2**: Cek apakah batch ini sudah berstatus `disposed`
   - Jika sudah → tidak perlu diulang
3. **Action**: Update `status` = `'disposed'` (bukan `delete()`)

#### Analogi Kafe
Ibarat **mengarsipkan berkas** ke gudang arsip — berkasnya masih ada, tapi tidak tampil di rak aktif. Bisa dicari jika perlu audit, tapi tidak mengganggu operasional sehari-hari.

---

### Fungsi Private: `generateBatchCode()`

#### Tujuan
Membuat kode batch otomatis yang unik berdasarkan tanggal + nomor urut harian.

#### Alur Logika Bisnis

1. Buat prefix: `"BATCH-"` + tanggal hari ini `"20261031"` + `"-"`
   → Hasilnya: `"BATCH-20261031-"`

2. Cari di database: sudah ada batch dengan prefix ini hari ini?
   - Tidak ada → kode pertama hari ini = `"BATCH-20261031-01"`
   - Ada (misal terakhir `"BATCH-20261031-04"`) → ambil "04", +1 = 5 → `"BATCH-20261031-05"`

3. Pad dengan nol di depan: `5` → `"05"` (selalu 2 digit)

#### Output / Return Value
String kode batch unik, contoh: `"BATCH-20261031-01"`, `"BATCH-20261031-07"`

#### Analogi Kafe
Ibarat **mesin nomor antrian** di teller bank — setiap hari mulai dari 01, bertambah otomatis, tidak perlu barista hitung manual.

---

## Ringkasan Alur Lengkap

```
BARISTA TERIMA KIRIMAN SUSU 24 BOTOL
        ↓
Buka /batches/create
        ↓
Controller::create() → kirim form ke browser
(dropdown bahan sudah ada, tanggal hari ini sudah terisi)
        ↓
Barista pilih "Fresh Milk Diamond 1L"
Isi: Jumlah=24, Harga=18500, Expired=15 Nov 2026
Kode batch dikosongkan (biarkan sistem generate)
        ↓
Klik "Simpan Batch" → POST /batches
        ↓
StoreBatchRequest::prepareForValidation()
→ received_date diisi otomatis: "2026-10-31"

StoreBatchRequest::rules()
→ ingredient_id ada? ✅
→ expiry_date (15 Nov) after today (31 Okt)? ✅
→ initial_stock (24) > 0? ✅
→ Semua valid!
        ↓
Controller::store()
→ batch_code kosong → generateBatchCode() → "BATCH-20261031-04"
→ DB::transaction → IngredientBatch::create([
    batch_code:    "BATCH-20261031-04",
    initial_stock: 24,
    current_stock: 24,  ← sama dengan initial_stock!
    status:        'active',
    ...
  ])
→ commit!
        ↓
redirect /inventory + "Batch BATCH-20261031-04 berhasil ditambahkan"
        ↓
FEFO dashboard kini menampilkan batch baru
```

---

*Dokumen ini mendampingi spesifikasi teknis di [`PLAN_05_BATCH_RESTOCK_CONTROLLER.md`](../Plan%20Backend/PLAN_05_BATCH_RESTOCK_CONTROLLER.md). Untuk kode PHP lengkap, lihat dokumen teknis tersebut.*
