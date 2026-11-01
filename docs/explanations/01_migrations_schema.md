# Penjelasan Modul 01: Database & Skema Tabel
## Panduan Pemula — Sistem Inventaris Kafe

> **Untuk Siapa Dokumen Ini**: Tim mahasiswa yang baru pertama kali melihat database relasional dalam konteks proyek nyata.  
> **Pendekatan**: Setiap tabel dijelaskan dengan analogi dunia nyata kafe ☕, bukan dengan jargon teknis.  
> **Kaitan dengan Kode**: [`docs/Plan Backend/PLAN_01_MIGRATIONS_SCHEMA.md`](../Plan%20Backend/PLAN_01_MIGRATIONS_SCHEMA.md)

---

## Gambaran Besar: "Database Ini Ibarat Sistem Pembukuan Kafe"

Bayangkan sebuah kafe maju yang punya **buku-buku catatan** yang rapi di meja kasir dan gudang. Setiap buku punya tujuan yang berbeda:

- 📒 **Buku Karyawan** → Tabel `users`  
- 📗 **Buku Katalog Bahan** → Tabel `categories` + `ingredients`  
- 📦 **Label di Setiap Wadah Bahan** → Tabel `ingredient_batches`  
- 📋 **Catatan Pemakaian Harian Barista** → Tabel `stock_usages`  
- 🗑️ **Berita Acara Pemusnahan Bahan** → Tabel `waste_logs`

Database kita pada dasarnya adalah versi digital dari seluruh sistem pembukuan itu. Mari kita bahas satu per satu.

---

## Tabel 1: `users` — Buku Data Karyawan

### Tujuan Tabel Ini

Ibarat **buku data karyawan** yang disimpan HRD. Setiap orang yang boleh login ke aplikasi ini tercatat di sini: siapa namanya, email mereka untuk login, kata sandi terenkripsi, dan **jabatan** mereka di kafe.

### Kolom-Kolom Penting dan Artinya

| Kolom | Analogi Kafe | Contoh Nilai |
|-------|-------------|-------------|
| `id` | Nomor induk karyawan | `1`, `2`, `42` |
| `name` | Nama lengkap di ID card | `"Rina Supervisor"` |
| `email` | Email untuk absensi/login | `"rina@kafe.com"` |
| `password` | PIN kartu akses (tersimpan terenkripsi) | `"$2y$10$..."` (hash) |
| `role` | Jabatan/Level akses | `"owner"`, `"supervisor"`, `"barista"` |

### Tentang Kolom `role`

Ini kolom **paling penting** di tabel ini. Ada 3 level jabatan:
- 🏆 **`owner`**: Pemilik kafe. Bisa lihat semua laporan keuangan, tapi tidak ikut-ikutan input stok.
- 🔑 **`supervisor`**: Kepala gudang. Bisa approve pemusnahan, CRUD bahan baku, lihat semua.
- ☕ **`barista`**: Pekerja bar. Bisa input pemakaian harian dan lapor bahan rusak.

### Hubungan dengan Tabel Lain

```
users ──── mencatat siapa yang ────→ stock_usages (user_id)
users ──── melaporkan siapa yang ──→ waste_logs (reported_by)
users ──── menyetujui siapa yang ──→ waste_logs (approved_by)
```

---

## Tabel 2: `categories` — Buku Katalog Kelompok Bahan

### Tujuan Tabel Ini

Ibarat **rak-rak berlebel di gudang**. Sebelum mencatat bahan apa saja yang ada, kita perlu menyiapkan rak-raknya dulu: "Rak Susu & Dairy", "Rak Sirup & Topping", "Rak Biji Kopi", dst.

Tabel ini sederhana — hanya daftar nama-nama kelompok bahan.

### Kolom-Kolom Penting dan Artinya

| Kolom | Analogi Kafe | Contoh Nilai |
|-------|-------------|-------------|
| `id` | Nomor rak di gudang | `1`, `2`, `3` |
| `name` | Tulisan di papan nama rak | `"Dairy & Susu"`, `"Sirup & Topping"` |
| `slug` | Kode singkat untuk URL | `"dairy-susu"`, `"sirup-topping"` |

> 💡 **Apa itu `slug`?** Slug adalah versi "ramah URL" dari nama. Contoh: nama `"Biji Kopi & Espresso"` jadi slug `"biji-kopi-espresso"`. Ini digunakan di alamat web agar lebih bersih, seperti `/kategori/biji-kopi-espresso`.

### Hubungan dengan Tabel Lain

```
categories ──── mengelompokkan ────→ ingredients (category_id)
```

Satu kategori bisa punya banyak bahan. Tapi satu bahan hanya masuk satu kategori.

---

## Tabel 3: `ingredients` — Buku Master Daftar Bahan Baku

### Tujuan Tabel Ini

Ibarat **daftar menu belanja tetap** yang ada di buku catatan supervisor. Ini bukan catatan stok (berapa yang ada sekarang), tapi **definisi** dari tiap bahan: namanya apa, satuannya apa, batas minimum stok yang harus dijaga, dan berapa hari sebelum kedaluwarsa perlu mulai waspada.

### Kolom-Kolom Penting dan Artinya

| Kolom | Analogi Kafe | Contoh Nilai |
|-------|-------------|-------------|
| `id` | Kode bahan di daftar belanja | `1` |
| `category_id` | Bahan ini masuk rak mana | `2` (rak Dairy) |
| `name` | Nama lengkap bahan | `"Fresh Milk Full Cream 1L"` |
| `unit` | Satuan ukurannya | `"Liter"`, `"Kilogram"`, `"Botol"` |
| `minimum_stock` | Batas minimum — jika di bawah ini, perlu restock | `5.00` (artinya: jika stok < 5 Liter, alert!) |
| `warning_days` | Berapa hari sebelum expired mulai waspada | `3` (default) atau `7` untuk bahan sensitif |

### Tentang `minimum_stock` vs Stok Aktual

> [!IMPORTANT]
> Tabel `ingredients` **TIDAK menyimpan berapa stok yang ada sekarang**. Stok aktual ada di tabel `ingredient_batches`. Tabel `ingredients` hanya menyimpan **definisi dan aturan** tentang bahan tersebut.

### Hubungan dengan Tabel Lain

```
categories ──────→ ingredients ──────→ ingredient_batches
  (satu rak)       (satu bahan)         (banyak kiriman)
```

---

## Tabel 4: `ingredient_batches` — Label di Setiap Wadah Bahan ⭐

### Tujuan Tabel Ini

Ini adalah **tabel paling penting** dalam seluruh sistem.

Ibarat **label yang ditempel di setiap wadah/karton bahan saat diterima dari supplier**. Ketika kafe menerima 10 karton susu, label itu berisi: dari mana, tanggal terima, tanggal kadaluwarsa, harga beli, dan berapa sisa isinya sekarang.

Kenapa penting? Karena **FEFO (First Expired, First Out)** bekerja di sini. Sistem membaca semua label, mengurutkan berdasarkan tanggal kadaluwarsa terdekat, lalu menampilkan ke barista: "Pakai yang ini dulu!"

### Kolom-Kolom Penting dan Artinya

| Kolom | Analogi Kafe | Contoh Nilai |
|-------|-------------|-------------|
| `id` | Nomor label | `42` |
| `ingredient_id` | Label ini untuk bahan apa | `1` (Fresh Milk) |
| `batch_code` | Nomor faktur/kode pengiriman | `"MILK-20260131-001"` |
| `initial_stock` | Isi awal saat diterima (tidak berubah) | `10.00` (10 Liter) |
| `current_stock` | Sisa isi sekarang (berkurang tiap pakai) | `6.50` (masih 6,5 Liter) |
| `received_date` | Tanggal terima dari supplier | `2026-01-15` |
| `expiry_date` | ⚠️ Tanggal kadaluwarsa di kemasan | `2026-02-15` |
| `cost_per_unit` | Harga beli per 1 unit | `18500.00` (Rp 18.500/Liter) |
| `status` | Kondisi batch sekarang | `"active"`, `"exhausted"`, `"expired"`, `"disposed"` |

### Tentang Kolom `status`

Status ini mengikuti perjalanan hidup sebuah batch:

```
[Diterima] ──→ active ──→ exhausted (habis terpakai) ✅
                      ──→ expired   (lewat tanggal)   ⚠️
                      ──→ disposed  (dimusnahkan)     🗑️
```

> 💡 Perhatikan: tidak ada tombol "hapus" (delete) untuk batch. Data batch **tidak pernah dihapus** — hanya statusnya yang berubah. Ini penting untuk audit keuangan.

### Mengapa Ada Dua Index Khusus di Tabel Ini?

Bayangkan kafe punya 500 batch bahan berbeda. Setiap kali barista klik "catat pemakaian", komputer harus mencari dari 500 baris itu: "mana batch susu yang aktif dan paling dekat expired?" 

Tanpa index, komputer harus cek satu per satu — lambat. Dengan **index `(ingredient_id, status, expiry_date)`**, komputer bisa langsung melompat ke data yang relevan — seperti mencari kata di kamus yang sudah diurutkan alfabetis vs. kamus acak.

### Hubungan dengan Tabel Lain

```
ingredients ──────→ ingredient_batches ──────→ stock_usages
(jenis bahan)       (setiap kiriman)           (pemakaian)
                         │
                         └─────────────────────→ waste_logs
                                                 (pemusnahan)
```

---

## Tabel 5: `stock_usages` — Catatan Pemakaian Harian Barista

### Tujuan Tabel Ini

Ibarat **buku log pemakaian** yang ditulis barista setiap hari: "Tadi pagi saya pakai 2 Liter susu dari batch MILK-001 untuk buat 40 gelas latte."

Setiap kali barista mencatat pemakaian, satu baris baru muncul di tabel ini. Baris ini juga mencatat apakah barista mengikuti rekomendasi FEFO atau tidak.

### Kolom-Kolom Penting dan Artinya

| Kolom | Analogi Kafe | Contoh Nilai |
|-------|-------------|-------------|
| `id` | Nomor catatan | `157` |
| `ingredient_batch_id` | Dari batch/wadah mana | `42` (batch susu tadi) |
| `user_id` | Siapa yang mencatat | `8` (barista Dini) |
| `quantity_used` | Berapa yang dipakai | `2.50` (2,5 Liter) |
| `usage_date` | Tanggal pemakaian | `2026-01-20` |
| `is_fefo_compliant` | Apakah nurut rekomendasi FEFO? | `true` atau `false` |
| `deviation_reason` | Kalau tidak nurut, kenapa? | `"Batch MILK-001 sudah terbuka kemarin"` |
| `notes` | Catatan bebas opsional | `"Untuk menu special Valentines"` |

### Tentang FEFO Compliance

> [!NOTE]
> Kolom `is_fefo_compliant` dan `deviation_reason` adalah fitur audit yang cerdas. Sistem tidak memaksa barista harus selalu pakai batch tertua — kadang ada alasan logis seperti "batch lain sudah keburu dibuka". Yang penting ada alasan yang tercatat. Ini yang disebut **Smart Warning** di PRD.

### Hubungan dengan Tabel Lain

```
ingredient_batches ──────→ stock_usages ←────── users
   (batch yang dipakai)    (catatan ini)     (siapa yang catat)
```

---

## Tabel 6: `waste_logs` — Berita Acara Pemusnahan Bahan

### Tujuan Tabel Ini

Ibarat **Berita Acara Pemusnahan** yang harus ditandatangani dua pihak: yang melaporkan dan yang menyetujui.

Ketika barista menemukan susu basi di chiller, dia tidak langsung buang — dia buat laporan dulu. Supervisor datang periksa, baru setujui. Proses ini ada untuk mencegah penyalahgunaan dan memastikan kerugian finansial tercatat dengan benar untuk dilaporkan ke owner.

### Kolom-Kolom Penting dan Artinya

| Kolom | Analogi Kafe | Contoh Nilai |
|-------|-------------|-------------|
| `id` | Nomor berita acara | `23` |
| `ingredient_batch_id` | Batch bahan mana yang dimusnahkan | `42` |
| `reported_by` | Siapa yang melapor (barista/supervisor) | `8` (Dini) |
| `approved_by` | Siapa yang approve (supervisor) — kosong dulu | `null` → `3` (Rina) |
| `waste_quantity` | Berapa yang dimusnahkan | `1.50` (1,5 Liter) |
| `financial_loss` | Kerugian dalam rupiah — dihitung saat approved | `null` → `27750.00` |
| `reason` | Alasan pemusnahan | `"Susu menggumpal dan berbau asam"` |
| `status` | Status laporan | `"pending"` → `"approved"` / `"rejected"` |

### Alur Perjalanan Sebuah Laporan Pemusnahan

```
1. Barista lapor → status: "pending", approved_by: null, financial_loss: null
         ↓
2. Supervisor review fisik
         ↓ (bisa dua arah)
3a. Supervisor setuju → status: "approved"
    System otomatis hitung: financial_loss = 1.5 Liter × Rp18.500 = Rp27.750
    approved_by diisi dengan ID supervisor
         ↓
   Data masuk laporan kerugian untuk Owner

3b. Supervisor tolak → status: "rejected"
    financial_loss tetap null
```

> [!CAUTION]
> **Tidak ada hard-delete!** Data waste log tidak pernah dihapus meskipun statusnya `rejected`. Ini adalah catatan audit permanen untuk pertanggungjawaban keuangan kafe.

### Mengapa `approved_by` Bisa NULL?

Karena saat laporan pertama dibuat, belum ada yang menyetujui. Ini adalah contoh kolom yang **sengaja nullable karena mengikuti proses bisnis yang bertahap** — bukan karena data tidak penting.

### Hubungan dengan Tabel Lain

```
ingredient_batches ──────→ waste_logs ←────── users (reported_by)
   (batch yang rusak)     (laporan ini) ←────── users (approved_by)
```

---

## Ringkasan: Bagaimana Semua Tabel Bekerja Bersama

Berikut skenario lengkap dari pagi hingga malam di kafe:

```
PAGI - Supervisor terima kiriman susu baru dari supplier:
  → Buat baris baru di: ingredient_batches (status: active)

SIANG - Barista Dini catat pemakaian susu untuk latte:
  → Sistem baca: ingredient_batches (FEFO query)
  → Buat baris baru di: stock_usages (is_fefo_compliant: true)
  → Update: ingredient_batches.current_stock berkurang

SORE - Barista Anton temukan susu basi di chiller:
  → Buat baris baru di: waste_logs (status: pending)

SORE - Supervisor Rina cek dan setuju pemusnahan:
  → Update: waste_logs.status → 'approved'
  → Update: waste_logs.financial_loss → dihitung otomatis
  → Update: ingredient_batches.status → 'disposed'

MALAM - Owner buka dashboard:
  → Baca dari: waste_logs (total kerugian hari ini)
  → Baca dari: ingredient_batches (bahan yang mau expired)
  → Baca dari: stock_usages (riwayat pemakaian)
```

---

*Dokumen ini dibuat untuk mendukung pemahaman tim sebelum mengeksekusi migration. Untuk spesifikasi teknis lengkap dengan kode PHP, lihat [`PLAN_01_MIGRATIONS_SCHEMA.md`](../Plan%20Backend/PLAN_01_MIGRATIONS_SCHEMA.md).*
