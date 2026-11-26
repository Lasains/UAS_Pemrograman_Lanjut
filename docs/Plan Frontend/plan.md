# Plan: Desain Simpel Halaman Barista (1 Halaman, 3 Tab)

## Ringkasan Keputusan Desain
Berdasarkan hasil diskusi, desain halaman Barista akan disederhanakan menjadi **1 halaman terpadu** di `resources/js/Pages/Barista/Dashboard.tsx` agar barista tidak perlu berpindah-pindah halaman saat operasional bar sedang sibuk:

1. **Cakupan**: Fokus pada **Frontend UI** dengan kontrak props TypeScript dari [`inventory.d.ts`](file:///home/lasains/ssd2/matkul/pemograman%20lanjut/projek/resources/js/types/inventory.d.ts) (dilengkapi fallback data contoh agar langsung bisa dilihat sebelum backend controller dibuat).
2. **Tata Letak**: 1 halaman dengan **3 Tab ringkas** di bagian atas:
   - **Tab 1 — Pakai Bahan (FEFO & Stok Kritis)**: Menampilkan daftar stok bahan prioritas FEFO (lampu lalu lintas 🟢/🟡/🔴) + form cepat catat pemakaian.
   - **Tab 2 — Terima Batch Baru**: Form ringkas input penerimaan stok/batch baru (`batch_code`, `ingredient_id`, `initial_stock`, `received_date`, `expiry_date`, `cost_per_unit`).
   - **Tab 3 — Lapor Bahan Rusak (Waste)**: Form ringkas laporan waste (`ingredient_batch_id`, `waste_quantity`, `reason`) dengan status `pending` (tanpa hard delete).
3. **Modularitas Komponen**: Masing-masing tab dipisah ke komponen tersendiri di `resources/js/Components/Barista/`.
4. **Navigasi & Halaman Lama**: Menu `OPERASIONAL BAR` di [`AuthenticatedLayout.tsx`](file:///home/lasains/ssd2/matkul/pemograman%20lanjut/projek/resources/js/Layouts/AuthenticatedLayout.tsx#L45-L82) diarahkan ke `/dashboard/barista` (dengan dukungan query `?tab=usage|batch|waste`), sementara file lama (`Usage/Index.tsx`, `Batches/Create.tsx`, `Waste/Create.tsx`) dibiarkan utuh agar tidak merusak route yang sudah ada.

---

## Rencana Perubahan File

### 1. Komponen Tab Barista (`resources/js/Components/Barista/`)
Membuat 3 komponen ringkas yang memanfaatkan `useForm` (`@inertiajs/react`), `cn()` (`@/lib/utils`), ikon `lucide-react`, dan [`Modal.tsx`](file:///home/lasains/ssd2/matkul/pemograman%20lanjut/projek/resources/js/Components/Modal.tsx):

- **[NEW] `resources/js/Components/Barista/FefoUsageTab.tsx`**
  - Menampilkan daftar bahan & batch aktif terurut FEFO (`expiry_date` terdekat di atas) dengan badge status lampu lalu lintas:
    - 🟢 `safe` (> 7 hari)
    - 🟡 `warning` (3–7 hari)
    - 🔴 `critical` (< 3 hari / expired)
  - Menandai batch teratas setiap bahan dengan label `[★ REKOMENDASI FEFO]`.
  - Form ringkas pemakaian stok (`ingredient_batch_id`, `quantity_used`, `notes`) menggunakan `useForm` ke `route('stock-usages.store')`.
  - **Smart Warning Deviasi FEFO**: Jika barista memilih batch yang bukan rekomendasi FEFO teratas, tampilkan `Modal` konfirmasi yang mewajibkan pengisian `deviation_reason` sebelum submit.

- **[NEW] `resources/js/Components/Barista/BatchIntakeTab.tsx`**
  - Form sederhana penerimaan batch baru (`ingredient_id`, `batch_code`, `initial_stock`, `received_date`, `expiry_date`, `cost_per_unit`) menggunakan `useForm` ke `route('batches.store')`.
  - Validasi dasar di sisi client (angka > 0, tanggal kedaluwarsa >= tanggal terima) dan pesan error Inertia.

- **[NEW] `resources/js/Components/Barista/WasteReportTab.tsx`**
  - Form sederhana pelaporan bahan rusak (`ingredient_batch_id`, `waste_quantity`, `reason`) menggunakan `useForm` ke `route('waste-logs.store')`.
  - Menampilkan catatan jelas bahwa laporan berstatus `pending` dan menunggu persetujuan Supervisor (tidak ada hard delete).

### 2. Halaman Utama Barista
- **[MODIFY] [`resources/js/Pages/Barista/Dashboard.tsx`](file:///home/lasains/ssd2/matkul/pemograman%20lanjut/projek/resources/js/Pages/Barista/Dashboard.tsx)**
  - Menyederhanakan tampilan dari ~577 baris mockup menjadi container ringan (~120–160 baris):
    - Header ringkas (nama barista + 3 kartu status kecil: Kritis 🔴, Peringatan 🟡, Aman 🟢).
    - Bar navigasi 3 Tab (`Pakai Bahan FEFO`, `Terima Batch`, `Lapor Waste`) yang membaca/sinkron dengan query parameter `?tab=`.
    - Menerima props opsional bertipe dari `inventory.d.ts` (`ingredients`, `activeBatches`, `recentUsages`) dengan fallback data contoh jika backend belum mengirim props.

### 3. Navigasi Sidebar
- **[MODIFY] [`resources/js/Layouts/AuthenticatedLayout.tsx`](file:///home/lasains/ssd2/matkul/pemograman%20lanjut/projek/resources/js/Layouts/AuthenticatedLayout.tsx#L45-L82)**
  - Mengarahkan item di grup `OPERASIONAL BAR` ke `/dashboard/barista` (misalnya dengan query `?tab=usage`, `?tab=batch`, `?tab=waste`) agar klik dari sidebar langsung membuka tab yang sesuai di 1 halaman Barista tanpa pindah halaman.

### 4. Dokumentasi Wajib (`AGENTS.md` Iron Rule)
- **[NEW] `docs/explanations/barista_simple_dashboard.md`**
  - Dokumentasi ramah pemula dengan analogi kafe, disusun **per fungsi / per komponen** sesuai format standar di `AGENTS.md`.

---

## Rencana Verifikasi
Setelah seluruh file selesai dibuat/diubah, jalankan pengecekan dalam satu perintah:
```bash
npx tsc --noEmit && npm run build
```
Memastikan tidak ada error TypeScript maupun error bundling Vite.
