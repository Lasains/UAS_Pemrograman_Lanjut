# Penjelasan Modul: Halaman Barista Simpel (1 Halaman, 3 Tab)
## Panduan Pemula — Meja Kerja Barista Terpadu di BeanFlow

> **Analogi Dunia Nyata**: Bayangkan saat jam sibuk di kafe (*rush hour*), barista tidak punya waktu untuk berjalan bolak-balik ke tiga ruangan berbeda hanya untuk mencatat pemakaian susu, menerima kiriman biji kopi, dan melapor kalau ada karton susu yang bocor. Karena itu, semua urusan operasional bar disatukan ke dalam **1 meja kerja dengan 3 laci (tab)**:
> 1. **Laci 1 (`Pakai Bahan FEFO`)**: Mengambil bahan dengan tanggal kedaluwarsa terdekat.
> 2. **Laci 2 (`Terima Batch`)**: Mencatat bahan baru yang baru tiba dari kurir/gudang.
> 3. **Laci 3 (`Lapor Waste`)**: Mengajukan laporan jika ada bahan yang rusak/basi.

---

## 1. Halaman Utama: `resources/js/Pages/Barista/Dashboard.tsx`

### Fungsi: `BaristaDashboard({ auth, ingredients, activeBatches, recentUsages })`
* **Tujuan**: Menjadi wadah utama 1 halaman untuk operasional barista agar tidak perlu berpindah halaman saat bekerja di bar.
* **Input / Parameter**:
  * `auth`: Data user barista yang sedang login (dari Inertia `PageProps`).
  * `ingredients` *(opsional)*: Daftar bahan baku kafe bertipe `Ingredient[]`.
  * `activeBatches` *(opsional)*: Daftar batch stok aktif bertipe `IngredientBatch[]`.
  * `recentUsages` *(opsional)*: Riwayat pemakaian terbaru bertipe `StockUsage[]`.
  * *(Jika backend belum mengirim props, komponen otomatis memakai data contoh `FALLBACK_INGREDIENTS`, `FALLBACK_BATCHES`, dan `FALLBACK_USAGES`).*
* **Alur Logika Bisnis (Langkah demi Langkah)**:
  1. Membaca query `?tab=` dari URL melalui `parseTabFromUrl(page.url)` agar tab aktif sinkron dengan menu sidebar.
  2. Menghitung jumlah batch aktif per status lampu lalu lintas (`critical` 🔴, `warning` 🟡, `safe` 🟢) menggunakan `getBatchUrgency()`.
  3. Menampilkan header ringkas berisi sapaan nama barista dan 3 kartu status kecil.
  4. Menampilkan 3 tombol tab (`Pakai Bahan FEFO`, `Terima Batch`, `Lapor Waste`) dan merender komponen tab yang sedang aktif.
* **Output / Return Value**: Elemen JSX halaman dasbor barista di dalam `AuthenticatedLayout`.
* **Kaitan dengan Bagian Lain**: Memanggil `FefoUsageTab`, `BatchIntakeTab`, dan `WasteReportTab` serta disinkronkan dengan sidebar di `AuthenticatedLayout.tsx`.

### Fungsi: `parseTabFromUrl(url)` & `handleTabChange(tab)`
* **Tujuan**: Menjaga agar tab yang dibuka selalu sinkron dengan URL (`/dashboard/barista?tab=usage|batch|waste`).
* **Input / Parameter**: `url` (string URL halaman dari Inertia `usePage().url`) dan `tab` (`'usage' | 'batch' | 'waste'`).
* **Alur Logika Bisnis (Langkah demi Langkah)**:
  1. `parseTabFromUrl` memotong bagian query setelah `?` lalu mengambil nilai `tab`. Jika bukan `'batch'` atau `'waste'`, otomatis jatuh ke `'usage'`.
  2. `handleTabChange` mengubah state `activeTab` dan memperbarui URL di browser menggunakan `window.history.replaceState` tanpa memuat ulang halaman.
* **Output / Return Value**: `parseTabFromUrl` mengembalikan key tab aktif (`TabKey`); `handleTabChange` memperbarui state dan URL browser.
* **Kaitan dengan Bagian Lain**: Membantu link di sidebar (`?tab=usage`, `?tab=batch`, `?tab=waste`) langsung membuka tab yang tepat.

---

## 2. Tab 1 — Pakai Bahan FEFO: `resources/js/Components/Barista/FefoUsageTab.tsx`

### Fungsi: `getBatchUrgency(batch)`
* **Tujuan**: Mengelompokkan setiap batch ke status lampu lalu lintas (Hijau/Kuning/Merah) berdasarkan sisa hari sebelum kedaluwarsa.
* **Input / Parameter**: `batch` (objek `IngredientBatch`, misalnya `{ expiry_date: '2026-11-27', ... }`).
* **Alur Logika Bisnis (Langkah demi Langkah)**:
  1. Jika backend sudah mengirim `days_until_expiry`, nilai tersebut langsung dipakai. Jika belum, dihitung selisih hari antara `expiry_date` dan tanggal hari ini.
  2. Menentukan status: `< 3` hari = `'critical'` (🔴), `3–7` hari = `'warning'` (🟡), `> 7` hari = `'safe'` (🟢).
* **Output / Return Value**: Objek `{ daysUntilExpiry, status }`.
* **Kaitan dengan Bagian Lain**: Dipakai oleh `FefoUsageTab` untuk badge batch dan oleh `BaristaDashboard` untuk menghitung 3 kartu ringkasan status.

### Fungsi: `safeRoute(routeName, fallbackUrl)`
* **Tujuan**: Mengambil URL route Laravel (Ziggy) secara aman agar UI tetap berjalan mulus meskipun route Ziggy belum dimuat.
* **Input / Parameter**: `routeName` (contoh `'stock-usages.store'`) dan `fallbackUrl` (contoh `'/stock-usages'`).
* **Alur Logika Bisnis (Langkah demi Langkah)**:
  1. Mengecek apakah fungsi global `route()` tersedia dan memiliki `routeName`.
  2. Jika ada, kembalikan `route(routeName)`; jika tidak, kembalikan `fallbackUrl`.
* **Output / Return Value**: String URL tujuan pengiriman form.
* **Kaitan dengan Bagian Lain**: Dipakai ulang oleh `BatchIntakeTab` dan `WasteReportTab`.

### Komponen & Fungsi: `FefoUsageTab({ ingredients, activeBatches, recentUsages })`
* **Tujuan**: Menampilkan daftar batch terurut FEFO (*First Expired, First Out*) dan menyediakan form cepat pencatatan pemakaian stok beserta peringatan deviasi FEFO.
* **Input / Parameter**: Daftar `ingredients`, `activeBatches`, dan `recentUsages`.
* **Alur Logika Bisnis (Langkah demi Langkah)**:
  1. Menyaring batch yang berstatus `'active'` dan memiliki `current_stock > 0`, lalu mengurutkannya dari `expiry_date` paling dekat ke paling jauh.
  2. Menandai batch paling atas untuk tiap bahan dengan lencana `[★ REKOMENDASI FEFO]`.
  3. Saat barista memilih batch melalui `handleSelectBatch(batch)`, state form `useForm` mencatat `ingredient_batch_id` serta apakah pilihan tersebut patuh FEFO (`is_fefo_compliant`).
  4. Saat form dikirim via `handleFormSubmit(e)`: memvalidasi jumlah (`> 0` dan `<= current_stock`). Jika barista memilih batch **selain** rekomendasi FEFO teratas, sistem membuka `Modal` peringatan deviasi (`showDeviationModal = true`).
  5. Di dalam modal, `handleConfirmDeviation(e)` memastikan `deviation_reason` diisi sebelum memanggil `post()` ke endpoint `stock-usages.store`.
* **Output / Return Value**: Antarmuka daftar batch FEFO, form pemakaian, daftar pemakaian terkini, dan modal konfirmasi deviasi.
* **Kaitan dengan Bagian Lain**: Terhubung dengan `Modal.tsx` dan endpoint backend `POST /stock-usages`.

---

## 3. Tab 2 — Terima Batch Baru: `resources/js/Components/Barista/BatchIntakeTab.tsx`

### Fungsi: `generateBatchCode()`
* **Tujuan**: Membuat kode batch unik otomatis dengan format tanggal agar barista tidak perlu mengetik kode manual.
* **Input / Parameter**: Tidak ada.
* **Alur Logika Bisnis (Langkah demi Langkah)**:
  1. Mengambil tanggal hari ini dalam format `YYYYMMDD`.
  2. Menambahkan 4 karakter acak huruf/angka kapital, menghasilkan pola `BCH-YYYYMMDD-XXXX`.
* **Output / Return Value**: String kode batch unik (contoh: `BCH-20261126-K9M2`).
* **Kaitan dengan Bagian Lain**: Dipanggil sebagai nilai awal form dan saat tombol *refresh* kode batch ditekan.

### Komponen & Fungsi: `BatchIntakeTab({ ingredients })` + `handleSubmit(e)`
* **Tujuan**: Menyediakan form ringkas bagi barista untuk mencatat kedatangan stok/batch baru ke gudang atau chiller bar.
* **Input / Parameter**: `ingredients` (daftar bahan baku untuk dropdown).
* **Alur Logika Bisnis (Langkah demi Langkah)**:
  1. Menginisialisasi `useForm` dengan field `ingredient_id`, `batch_code`, `initial_stock`, `received_date` (hari ini), `expiry_date`, dan `cost_per_unit`.
  2. Saat disubmit melalui `handleSubmit`, melakukan validasi sisi klien: bahan dipilih, kode batch tidak kosong, stok awal `> 0`, harga modal `> 0`, dan `expiry_date >= received_date`.
  3. Mengirim data ke `route('batches.store')` (fallback `'/batches'`). Jika gagal di server, pesan error ditampilkan di bawah input terkait.
* **Output / Return Value**: Form penerimaan batch baru.
* **Kaitan dengan Bagian Lain**: Terhubung dengan endpoint backend `POST /batches`.

---

## 4. Tab 3 — Lapor Bahan Rusak: `resources/js/Components/Barista/WasteReportTab.tsx`

### Komponen & Fungsi: `WasteReportTab({ activeBatches, ingredients })` + `handleSubmit(e)`
* **Tujuan**: Memudahkan barista melaporkan bahan rusak/basi/tumpah tanpa menghapus data stok secara paksa (*no hard delete*).
* **Input / Parameter**: `activeBatches` (hanya batch aktif dengan stok > 0 yang bisa dilaporkan) dan `ingredients`.
* **Alur Logika Bisnis (Langkah demi Langkah)**:
  1. Menampilkan catatan informasi bahwa laporan akan berstatus `pending` dan menunggu persetujuan Supervisor.
  2. Menghitung estimasi kerugian secara langsung (`waste_quantity * batch.cost_per_unit`) sebagai informasi sebelum dikirim.
  3. Saat disubmit melalui `handleSubmit`, memvalidasi bahwa batch dipilih, `waste_quantity > 0` serta tidak melebihi `current_stock`, dan `reason` tidak kosong.
  4. Mengirim laporan ke `route('waste-logs.store')` (fallback `'/waste-logs'`).
* **Output / Return Value**: Form pelaporan bahan rusak beserta pratinjau estimasi kerugian.
* **Kaitan dengan Bagian Lain**: Terhubung dengan endpoint backend `POST /waste-logs` yang selanjutnya ditinjau Supervisor.

---

## 5. Navigasi Sidebar: `resources/js/Layouts/AuthenticatedLayout.tsx`

### Fungsi: `resolveHref(item)` & `checkActive(item)`
* **Tujuan**: Mengarahkan seluruh menu pada grup `OPERASIONAL BAR` ke satu halaman `/dashboard/barista` dengan parameter `?tab=` masing-masing, serta menyorot menu sidebar yang sedang dibuka.
* **Input / Parameter**: `item` bertipe `NavItem` yang memiliki properti opsional `tab?: 'usage' | 'batch' | 'waste'`.
* **Alur Logika Bisnis (Langkah demi Langkah)**:
  1. `resolveHref(item)` mengambil URL dasar dari `route(item.routeName)` (jika ada) lalu menempelkan `?tab=${item.tab}` bila `item.tab` tersedia.
  2. `checkActive(item)` memecah `page.url` menjadi path dan query string, lalu memanggil `item.activeMatch(currentPath, user.role, currentSearch)` untuk menentukan menu mana yang aktif.
* **Output / Return Value**: `resolveHref` mengembalikan string URL tujuan; `checkActive` mengembalikan `boolean`.
* **Kaitan dengan Bagian Lain**: Menghubungkan sidebar global aplikasi dengan tab di `BaristaDashboard`.
