# Penjelasan Modul 04: Autentikasi & RBAC Middleware
## Panduan Pemula — Sistem Inventaris Kafe

> **Untuk Siapa**: Tim mahasiswa yang baru belajar konsep keamanan aplikasi web di Laravel.  
> **Pendekatan**: Analogi sistem keamanan gedung kafe dengan kartu akses berlevel.  
> **Kaitan dengan Kode**: [`docs/Plan Backend/PLAN_04_AUTH_RBAC_MIDDLEWARE.md`](../Plan%20Backend/PLAN_04_AUTH_RBAC_MIDDLEWARE.md)

---

## Konsep Dasar: "Keamanan Kafe = Tiga Lapis Penjaga"

Bayangkan kafe kita seperti **gedung kantor modern** yang punya tiga lapis keamanan:

```
🚪 Pintu Utama    → Satpam 1: "Punya ID card? Boleh masuk."
                    (= Middleware auth: sudah login?)

🗝️ Ruangan Khusus → Satpam 2: "ID card kamu level berapa?"
                    (= Middleware role:X: role cocok?)

📋 Lemari Arsip   → Satpam 3: "File ini memang boleh kamu ambil?"
                    (= Laravel Policy: kondisi bisnis valid?)
```

Kenapa harus tiga lapis? Karena satu lapis saja tidak cukup:

- Satpam 1 saja → Semua karyawan bisa masuk ke ruangan siapa saja
- Satpam 2 saja → Orang luar bisa masuk jika tahu kode level
- Satpam 3 saja → Tidak ada yang jaga pintu utama

---

## Lapis 1: Middleware `auth` — "Punya ID Card?"

### Tujuan
Memastikan **hanya pengguna yang sudah login** yang bisa akses halaman-halaman aplikasi.

### Cara Kerja
Setiap request ke server, middleware `auth` otomatis cek: "Ada sesi login di browser ini?" Jika tidak → langsung diarahkan ke halaman login.

### Analogi Kafe
Ibarat **satpam di pintu masuk** yang cek kartu karyawan. Tanpa kartu? Balik ke luar.

```php
// Di routes/web.php — semua rute di dalam grup ini perlu login
Route::middleware(['auth'])->group(function () {
    Route::get('/inventory', ...);  // Tidak bisa diakses tanpa login
    Route::get('/waste-logs', ...); // Tidak bisa diakses tanpa login
});
```

---

## Lapis 2: `RoleMiddleware` — "Kartu Kamu Level Berapa?"

### Tujuan
Setelah dipastikan sudah login, middleware ini mengecek **jabatan (role)** pengguna. Hanya role tertentu yang boleh masuk ke area tertentu.

### Analogi Kafe
Ibarat **kartu akses berlevel** di gedung:
- 🏆 Kartu Gold (Owner) → masuk ke ruang laporan keuangan
- 🔑 Kartu Silver (Supervisor) → masuk ke ruang gudang, bisa approve dokumen
- ☕ Kartu Bronze (Barista) → masuk ke area bar, tidak bisa ke ruang keuangan

### Cara Kerja dalam Kode

```php
// Supervisor bisa akses /ingredients (CRUD bahan baku)
Route::middleware(['role:supervisor'])->group(function () {
    Route::resource('ingredients', IngredientController::class);
});

// Supervisor DAN Barista bisa akses /batches/create (input restock)
Route::middleware(['role:barista,supervisor'])->group(function () {
    Route::post('/batches', [IngredientBatchController::class, 'store']);
});

// Hanya Owner yang bisa akses /analytics
Route::middleware(['role:owner'])->group(function () {
    Route::get('/analytics', [DashboardController::class, 'analytics']);
});
```

### Apa yang Terjadi Jika Role Salah?

Jika barista mencoba akses `/analytics` langsung dari URL bar:
1. Browser kirim request ke server
2. Middleware `auth` → ✅ sudah login
3. Middleware `role:owner` → ❌ role barista, bukan owner
4. **Server balas: 403 Forbidden** (akses ditolak)

Barista tidak bisa bypass ini meskipun tahu URL-nya — keamanan ada di server, bukan di browser.

---

## Fungsi: `RoleMiddleware::handle()`

### Tujuan
Satu middleware universal yang bisa dipakai untuk semua kombinasi role.

### Input / Parameter
- `$request` — Data request HTTP yang masuk
- `$next` — Fungsi untuk lanjutkan ke tujuan jika lolos
- `...$roles` — Satu atau lebih nama role yang diizinkan

### Alur Logika Bisnis

1. Cek: apakah user sudah login? (jika tidak → redirect ke login)
2. Ambil role user yang sedang login
3. Cek: apakah role user ada dalam daftar role yang diizinkan?
4. Jika **ada** → lanjutkan request ke Controller
5. Jika **tidak ada** → stop, balas dengan error 403 Forbidden

### Output / Return Value
- Berhasil: `$next($request)` — lanjutkan ke Controller
- Gagal: `abort(403)` — hentikan request dengan pesan error

### Analogi Kafe
Ibarat **mesin card reader di pintu** yang:
1. Baca chip kartu karyawan
2. Bandingkan dengan daftar level yang diizinkan di database
3. Bip hijau (masuk) atau bip merah + pintu tidak terbuka (tolak)

---

## Lapis 3: Laravel Policy — "File Ini Memang Boleh Kamu Ambil?"

### Tujuan
Policy adalah cek keamanan **paling spesifik** — memvalidasi kondisi bisnis pada level satu resource tunggal.

### Analogi Kafe
Berbeda dari kartu akses (yang hanya cek jabatan), Policy ibarat **prosedur audit dokumen**:
- "Apakah dokumen ini memang statusnya bisa disetujui?" (masih `pending`?)
- "Apakah kamu tidak menyetujui dokumen yang kamu sendiri yang buat?"

### Contoh Nyata: `WasteLogPolicy::approve()`

```
SKENARIO: Ibu Sari (Supervisor) ingin approve tiket pemusnahan

Cek 1: Apakah Ibu Sari seorang Supervisor?
        → ✅ Ya

Cek 2: Apakah tiket ini masih berstatus 'pending'?
        → ✅ Ya (belum ada yang approve)

Cek 3: Apakah tiket ini BUKAN buatan Ibu Sari sendiri?
        → ✅ Benar (yang buat adalah Andi si Barista)

HASIL: ✅ Approve diizinkan
```

Vs. skenario yang ditolak:

```
SKENARIO: Ibu Sari coba approve tiket yang dia sendiri yang buat

Cek 3: Apakah tiket ini BUKAN buatan Ibu Sari sendiri?
        → ❌ Tidak — ini tiket buatannya sendiri!

HASIL: ❌ 403 Forbidden — "four-eyes principle" dilanggar
```

### Mengapa Perlu "Four-Eyes Principle"?

> *"Empat mata lebih baik dari dua mata"*

Dalam akuntansi dan manajemen keuangan, tidak boleh ada satu orang yang bisa **membuat sekaligus menyetujui** transaksi. Ini mencegah kecurangan (fraud). Jika Ibu Sari bisa approve tiket buatannya sendiri, dia bisa:
1. Buat tiket "musnahkan 100 pcs croissant" (padahal masih bagus)
2. Approve sendiri
3. Ambil croissantnya untuk kepentingan pribadi
4. Tidak ada yang tahu!

Dengan four-eyes principle, harus ada orang lain yang approve → lebih sulit untuk berbuat curang.

---

## Redirect Login Berdasarkan Role

### Tujuan
Setelah login berhasil, setiap role langsung diarahkan ke halaman yang paling relevan untuk pekerjaannya. Tidak semua orang perlu ke halaman yang sama.

### Analogi Kafe
Ibarat **lift otomatis** yang tahu lantai tujuan berdasarkan ID card karyawan:
- Pak Budi (Owner) → langsung ke lantai 3 (ruang laporan)
- Ibu Sari (Supervisor) → langsung ke lantai 2 (ruang gudang)
- Andi (Barista) → langsung ke lantai 1 (area bar)

### Alur Logika Bisnis

1. User input email + password → klik Login
2. Laravel verifikasi kredensial
3. Berhasil → ambil data user yang login
4. `match($user->role)` → cocokkan role dengan halaman tujuan
5. Redirect ke halaman yang sesuai

```
Owner      → /dashboard/owner   (laporan finansial, grafik tren)
Supervisor → /inventory         (daftar batch, stok, early warning)
Barista    → /dashboard/barista (form pemakaian, rekomendasi FEFO)
```

---

## Shared Data untuk Frontend (HandleInertiaRequests)

### Tujuan
Data user (termasuk role) perlu dikirim ke semua halaman React agar UI bisa menyesuaikan tampilan — misalnya menyembunyikan menu yang tidak relevan.

### Analogi Kafe
Ibarat **papan nama di dada karyawan** yang terlihat oleh semua orang. Kasir (frontend) bisa lihat jabatan seseorang dan menyesuaikan pelayanan — tapi tetap tidak bisa memberi akses yang lebih dari yang diizinkan manajer (backend).

### Yang Dikirim ke Semua Halaman

```typescript
// Di setiap halaman React, data ini tersedia via usePage().props
{
  auth: {
    user: {
      id: 3,
      name: "Andi (Barista)",
      email: "barista@kafe.com",
      role: "barista"          // ← Digunakan untuk conditional menu
    }
  },
  flash: {
    success: "Pemakaian berhasil dicatat!", // ← Notifikasi setelah redirect
    error: null,
    info: null
  }
}
```

### Peringatan Penting!

> [!WARNING]
> **Sembunyikan menu di frontend ≠ keamanan sungguhan!**  
> Menyembunyikan tombol "Approve Waste" di navbar hanya membuat UI lebih rapi — tapi tidak mencegah orang yang tahu URL-nya langsung request ke server. Keamanan sesungguhnya ada di **middleware dan policy di backend**.

Analogi: Menyembunyikan tombol lift lantai 3 dari orang yang tidak berkepentingan itu bagus untuk UX. Tapi jika pintu lift lantai 3 tidak dikunci, semua orang tetap bisa masuk. Kunci pintunya (= middleware) adalah keamanan yang nyata.

---

## Ringkasan: Siapa Bisa Akses Apa

```
URL                              | Owner  | Supervisor | Barista
─────────────────────────────────|────────|────────────|─────────
GET  /dashboard/owner            |   ✅   |     ❌     |   ❌
GET  /analytics                  |   ✅   |     ❌     |   ❌
GET  /analytics/export           |   ✅   |     ❌     |   ❌
─────────────────────────────────|────────|────────────|─────────
GET  /ingredients                |   ❌   |     ✅     |   ❌
POST /ingredients                |   ❌   |     ✅     |   ❌
PATCH /waste-logs/{id}/approve   |   ❌   |     ✅*    |   ❌
─────────────────────────────────|────────|────────────|─────────
POST /batches                    |   ❌   |     ✅     |   ✅
POST /stock-usages               |   ❌   |     ✅     |   ✅
POST /waste-logs                 |   ❌   |     ✅     |   ✅
─────────────────────────────────|────────|────────────|─────────
GET  /inventory                  |   ✅   |     ✅     |   ✅
GET  /waste-logs                 |   ✅   |     ✅     |   ✅
GET  /stock-usages               |   ✅   |     ✅     |   ✅

* Supervisor hanya bisa approve tiket yang bukan buatannya sendiri
```

---

*Dokumen ini mendampingi spesifikasi teknis di [`PLAN_04_AUTH_RBAC_MIDDLEWARE.md`](../Plan%20Backend/PLAN_04_AUTH_RBAC_MIDDLEWARE.md). Untuk kode PHP lengkap setiap file, lihat dokumen teknis tersebut.*
