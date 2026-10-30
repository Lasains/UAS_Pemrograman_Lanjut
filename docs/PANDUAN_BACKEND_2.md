# PANDUAN KERJA KHUSUS: BACKEND DEVELOPER 2 (BE 2)

**Fokus Utama**: Master Data Bahan & Kategori, Logika Peringatan Dini Kedaluwarsa (*Early Warning*), Alur Approval Pemusnahan (*Waste Disposal*), dan Agregasi Metrik Finansial untuk Dasbor Owner.

---

## 1. File & Folder Tanggung Jawab Anda
* `app/Http/Controllers/CategoryController.php` (CRUD Kategori)
* `app/Http/Controllers/IngredientController.php` (CRUD Master Bahan)
* `app/Http/Controllers/WasteLogController.php` (Tiket & Approval Waste)
* `app/Http/Controllers/DashboardController.php` (Metrik Finansial & Grafik)
* `app/Services/ExpiryEvaluationService.php` (Layanan evaluasi status kedaluwarsa)

---

## 2. Rincian Tugas Bertahap

### 📌 Minggu 1 - 2 (Master Data & Early Warning System)

#### Task 1: Controller CRUD Kategori & Master Bahan
* Buat method:
  * `index`: Menampilkan daftar bahan beserta total stok aktif (hasil sum dari seluruh batch aktifnya).
  * `store`: Menambah bahan baru (nama, kategori, unit: ml/gram/pcs, minimum stock, warning days).
  * `update`: Mengubah parameter bahan (misal mengubah ambang warning days).
  * `destroy`: Menghapus bahan (pastikan tidak bisa dihapus jika masih ada riwayat batch terkait).
* Kembalikan respons menggunakan Inertia:
  ```php
  return Inertia::render('Master/IngredientsIndex', [
      'ingredients' => $ingredients,
      'categories' => $categories,
  ]);
  ```

#### Task 2: Logika Early Warning Kedaluwarsa
Buat fungsi/service helper untuk mengevaluasi sisa hari setiap batch aktif:
```php
use Carbon\Carbon;

$today = Carbon::today();
$expiry = Carbon::parse($batch->expiry_date);
$diffDays = $today->diffInDays($expiry, false); // false agar nilai negatif jika sudah lewat

$batch->days_until_expiry = (int) $diffDays;

if ($diffDays < 3) {
    $batch->urgency_status = 'critical'; // Merah (< 3 hari atau sudah lewat)
} elseif ($diffDays <= 7) {
    $batch->urgency_status = 'warning';  // Kuning (3 - 7 hari)
} else {
    $batch->urgency_status = 'safe';     // Hijau (> 7 hari)
}
```

---

### 📌 Minggu 3 (Waste Approval & Dashboard Analytics)

#### Task 3: Waste Disposal Controller (`WasteLogController`)
* **Endpoint 1: Pelaporan oleh Barista (`store`)**
  * Input: `ingredient_batch_id`, `waste_quantity`, `reason`.
  * Hitung estimasi kerugian sementara: `financial_loss = waste_quantity * batch.cost_per_unit`.
  * Simpan dengan status: `'pending'`, `reported_by = auth()->id()`.
* **Endpoint 2: Persetujuan oleh Supervisor (`approve`)**
  * Pastikan hanya role `'supervisor'` atau `'owner'` yang bisa mengakses endpoint ini.
  * Update status menjadi `'approved'`, `approved_by = auth()->id()`.
  * Kurangi stok batch yang bersangkutan: `current_stock = current_stock - waste_quantity`. Jika habis, set status batch `'disposed'`.
  * Gunakan `DB::transaction`.

#### Task 4: Dashboard Aggregation Controller (`DashboardController`)
Kumpulkan data metrik untuk Owner:
* `total_asset_value`: Total rupiah seluruh stok bahan aktif (`SUM(current_stock * cost_per_unit)`).
* `critical_asset_value`: Total rupiah bahan yang statusnya kritis/mendekati kedaluwarsa.
* `monthly_waste_loss`: Total kerugian rupiah dari tabel `waste_logs` bulan ini yang statusnya `'approved'`.
* Data array bulanan untuk grafik Recharts:
  ```json
  [
    { "month": "Jan", "usage": 1500000, "waste": 200000 },
    { "month": "Feb", "usage": 1800000, "waste": 150000 }
  ]
  ```

---

## 3. Do's and Don'ts untuk BE 2
* ✅ **DO**: Pastikan rumus hitung kerugian finansial menggunakan harga beli asli dari batch terkait (`batch.cost_per_unit`).
* ✅ **DO**: Pasang middleware otorisasi (Role Check) agar Barista tidak bisa menembus endpoint approval waste.
* ❌ **DON'T**: Jangan melakukan hard delete pada data `waste_logs`. Riwayat harus tersimpan permanen untuk audit.
