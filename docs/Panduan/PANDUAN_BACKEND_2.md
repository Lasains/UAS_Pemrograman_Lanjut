# PANDUAN KERJA KHUSUS: BACKEND DEVELOPER 2 (BE 2)

> **Peran**: Backend Developer 2 (Security, Quality, Waste & Financial Analytics Specialist)  
> **Tingkat Tim**: Pemula (Beginner-Friendly Environment)  
> **Fokus Utama**: Autentikasi Backend & Middleware RBAC, Master Data Bahan & Kategori, Sistem Peringatan Dini Kedaluwarsa (*Early Warning*), Alur Tiket & Approval Pemusnahan Bahan Rusak, serta Kueri Agregasi Finansial Dasbor Owner.  
> **Rujukan Dokumen Rencana**: `docs/Plan Backend/PLAN_04`, `PLAN_07`, dan `PLAN_08`

---

## 1. File & Folder Tanggung Jawab Anda
* `app/Http/Middleware/RoleMiddleware.php` & `app/Services/RoleRedirectService.php` (Keamanan Rute & RBAC)
* `app/Http/Controllers/CategoryController.php` & `app/Http/Controllers/IngredientController.php` (CRUD Master Data)
* `app/Services/ExpiryEvaluationService.php` (Layanan evaluasi hari kedaluwarsa & lampu lalu lintas)
* `app/Http/Controllers/WasteLogController.php` & `app/Http/Requests/StoreWasteLogRequest.php` & `app/Actions/ApproveWasteAction.php` & `app/Policies/WasteLogPolicy.php` (Modul Pemusnahan Limbah Rusak)
* `app/Http/Controllers/DashboardController.php` & `app/Http/Controllers/AnalyticsController.php` & `app/Actions/ExportAnalyticsCsvAction.php` (Dasbor Eksekutif & Kueri Metrik Finansial)

---

## 2. Rincian Tugas Bertahap Mingguan

### 📌 MINGGU 1: Keamanan RBAC, Master Data Bahan & Service Early Warning

#### Task 1: Keamanan Rute & Middleware RBAC (Rujukan: `PLAN_04_AUTH_RBAC_MIDDLEWARE.md`)
* Buat middleware `RoleMiddleware.php`:
  * Menerima parameter role: `handle($request, Closure $next, ...$roles)`.
  * Memeriksa apakah pengguna yang aktif memiliki salah satu peran yang diizinkan (`in_array(auth()->user()->role, $roles)`).
  * Jika belum login, redirect ke halaman `/login`. Jika role tidak cocok, lempar respon HTTP `403 Forbidden`.
* Buat service `RoleRedirectService.php`:
  * Mengarahkan pengguna setelah berhasil login berdasarkan perannya:
    * `owner` -> `/dashboard/analytics`
    * `supervisor` -> `/inventory`
    * `barista` -> `/barista/dashboard`

#### Task 2: Controller CRUD Master Data Kategori & Bahan
* **`CategoryController`**:
  * `index`: Tampilkan daftar kategori bahan.
  * `store` & `update`: Validasi nama kategori dan slug unik.
  * `destroy`: Larang penghapusan jika kategori masih memiliki relasi bahan aktif di database.
* **`IngredientController`**:
  * Menampilkan katalog bahan beserta total kuantitas stok aktif (hasil sum dari seluruh batch aktif).
  * Input parameter: nama bahan, kategori, satuan (`ml`/`gram`/`pcs`), `minimum_stock`, dan ambang `warning_days` (default 3).
  * Kembalikan data via Inertia:
    ```php
    return Inertia::render('Master/IngredientsIndex', [
        'ingredients' => $ingredients,
        'categories' => $categories,
    ]);
    ```

#### Task 3: Layanan Peringatan Dini Kedaluwarsa (`ExpiryEvaluationService.php`)
Buat class service untuk mengelompokkan urgensi batch berdasarkan tanggal hari ini:
```php
namespace App\Services;

use Carbon\Carbon;
use App\Models\IngredientBatch;

class ExpiryEvaluationService
{
    public function evaluateBatch(IngredientBatch $batch): array
    {
        $today = Carbon::today();
        $expiry = Carbon::parse($batch->expiry_date);
        $diffDays = (int) $today->diffInDays($expiry, false);

        if ($diffDays < 3) {
            $status = 'critical'; // Merah (< 3 hari atau sudah lewat)
        } elseif ($diffDays <= 7) {
            $status = 'warning';  // Kuning (3 sampai 7 hari)
        } else {
            $status = 'safe';     // Hijau (> 7 hari)
        }

        return [
            'days_until_expiry' => $diffDays,
            'urgency_status' => $status,
        ];
    }
}
```

---

### 📌 MINGGU 2: Modul Pemusnahan Bahan Rusak (Waste Approval Two-Tier)

#### Task 4: Controller & Alur Pemusnahan Bahan Rusak (Rujukan: `PLAN_07_WASTE_DISPOSAL_CONTROLLER.md`)
* **File**: `app/Http/Controllers/WasteLogController.php`, `app/Http/Requests/StoreWasteLogRequest.php`, `app/Actions/ApproveWasteAction.php`, `app/Policies/WasteLogPolicy.php`.
* **Aturan Ketat Bisnis**: **DILARANG MELAKUKAN HARD DELETE!** Bahan basi harus tercatat permanen untuk transparansi audit keuangan kafe.
* **Endpoint 1: Pelaporan Tiket Bahan Rusak oleh Barista (`POST /waste-logs`)**:
  * Validasi `StoreWasteLogRequest`: `ingredient_batch_id`, `waste_quantity` (tidak boleh melebihi stok batch), `reason` (contoh: "Susu asam/menggumpal").
  * Simpan tiket dengan status `'pending'` dan `reported_by = Auth::id()`.
  * Estimasi nilai kerugian modal dihitung sementara tanpa memotong saldo stok batch.
* **Endpoint 2: Persetujuan Tiket oleh Supervisor (`POST /waste-logs/{id}/approve`)**:
  * Gunakan Policy `WasteLogPolicy` atau RoleMiddleware untuk memastikan hanya role `supervisor` atau `owner` yang bisa menyetujui pemusnahan.
  * Eksekusi di dalam class aksi `ApproveWasteAction`:
    ```php
    DB::transaction(function () use ($wasteLog, $supervisorId) {
        $batch = $wasteLog->ingredientBatch;
        
        // 1. Hitung kerugian finansial riil berdasarkan harga modal batch
        $financialLoss = $wasteLog->waste_quantity * $batch->cost_per_unit;
        
        // 2. Potong stok batch fisik
        $batch->current_stock = max(0, $batch->current_stock - $wasteLog->waste_quantity);
        if ($batch->current_stock == 0) {
            $batch->status = 'disposed';
        }
        $batch->save();
        
        // 3. Update status tiket
        $wasteLog->update([
            'status' => 'approved',
            'approved_by' => $supervisorId,
            'financial_loss' => $financialLoss,
        ]);
    });
    ```
* **Endpoint 3: Penolakan Tiket oleh Supervisor (`POST /waste-logs/{id}/reject`)**:
  * Ubah status tiket menjadi `'rejected'` dengan menyertakan catatan alasan penolakan. Stok batch tidak dipotong.

---

### 📌 MINGGU 3: Agregasi Metrik Finansial & Dasbor Owner

#### Task 5: Controller Dasbor & Analisis Finansial (Rujukan: `PLAN_08_DASHBOARD_ANALYTICS_CONTROLLER.md`)
* **File**: `app/Http/Controllers/DashboardController.php`, `app/Http/Controllers/AnalyticsController.php`, `app/Actions/ExportAnalyticsCsvAction.php`.
* **Kueri Metrik Finansial Eksekutif (Khusus Owner)**:
  1. `total_asset_value`: Total rupiah seluruh stok bahan aktif di kafe:
     $$\sum (\text{current\_stock} \times \text{cost\_per\_unit})$$
  2. `critical_asset_value`: Total rupiah dari bahan yang berada di masa kritis (< 3 hari sebelum kedaluwarsa).
  3. `monthly_waste_loss`: Total rupiah dari tabel `waste_logs` bulan ini yang berstatus `'approved'`:
     $$\sum (\text{financial\_loss})$$
* **Kueri Format Grafik Batang Recharts**:
  * Kelompokkan perbandingan pemakaian bahan vs limbah basi selama 6 bulan terakhir:
    ```json
    [
      { "month": "Mei", "usage_cost": 2400000, "waste_loss": 180000 },
      { "month": "Jun", "usage_cost": 2800000, "waste_loss": 95000 }
    ]
    ```
* **Fitur Export Laporan CSV (`ExportAnalyticsCsvAction.php`)**:
  * Export rekap tiket limbah dan kerugian finansial ke file CSV untuk bahan lampiran laporan tugas akhir.

---

### 📌 MINGGU 4: Code Freeze, Uji Alur Finansial & Demo UAS
* Uji skenario audit lengkap bersama seluruh tim:
  * Barista lapor 500ml susu basi -> pastikan belum mengurangi stok.
  * Supervisor klik Approve -> verifikasi stok batch berkurang dan angka kerugian di dasbor Owner otomatis bertambah.
* Siapkan penjelasan kueri agregasi finansial untuk sesi tanya jawab bersama dosen penguji.

---

## 3. Do's and Don'ts untuk BE 2
* ✅ **DO**: Selalu hitung kerugian finansial dari harga beli asli batch terkait (`batch->cost_per_unit`), bukan harga perkiraan.
* ✅ **DO**: Pasang pengecekan otorisasi ketat (`WasteLogPolicy` atau middleware) agar Barista tidak bisa menyetujui tiket buatannya sendiri.
* ✅ **DO**: Tuliskan dokumentasi fungsi yang Anda buat di folder `docs/explanations/`.
* ❌ **DON'T**: Jangan pernah melakukan *Hard Delete* pada tabel `waste_logs`. Seluruh jejak limbah wajib tersimpan untuk transparansi keuangan kafe.
