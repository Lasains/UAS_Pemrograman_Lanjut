# PANDUAN KERJA KHUSUS: FRONTEND DEVELOPER 1 (FE 1)

> **Peran**: Frontend Developer 1 (Shell, Navigation, Monitoring Table & Analytics Dashboard Specialist)  
> **Tingkat Tim**: Pemula (Beginner-Friendly Environment)  
> **Fokus Utama**: Perancangan Mockup Global di Google Stitch, Arsitektur UI Shell (`AppLayout`), Navigasi Sidebar Dinamis Berbasis Role (RBAC), Halaman Login Multi-Role, Komponen Badge Masa Simpan, Tabel Monitoring Inventaris, serta Dasbor Grafik Analitik Owner (Recharts).  
> **Rujukan Dokumen Rencana**: `docs/Plan Frontend/PLAN_01`, `PLAN_02`, `PLAN_05`, dan `PLAN_07`

---

## 1. File & Folder Tanggung Jawab Anda
* `docs/Plan Frontend/PLAN_01_AUTH_LOGIN.md` (Spesifikasi Login)
* `docs/Plan Frontend/PLAN_02_APP_LAYOUT_RBAC.md` (Spesifikasi Shell & Navigasi)
* `docs/Plan Frontend/PLAN_05_SUPERVISOR_MONITORING_INVENTARIS.md` (Spesifikasi Monitoring Stok)
* `docs/Plan Frontend/PLAN_07_OWNER_ANALYTICS_DASHBOARD.md` (Spesifikasi Analitik Finansial)
* `resources/js/Layouts/GuestLayout.tsx` & `resources/js/Pages/Auth/Login.tsx` (Autentikasi Multi-Role)
* `resources/js/Layouts/AppLayout.tsx` & `resources/js/Components/Sidebar.tsx` & `resources/js/Components/Header.tsx` & `resources/js/Components/UserDropdown.tsx` (Shell Utama Aplikasi)
* `resources/js/Components/ExpiryBadge.tsx` (Indikator Lampu Lalu Lintas Kedaluwarsa)
* `resources/js/Pages/Inventory/Index.tsx` (Tabel Monitoring Inventaris & Expand Rincian Batch)
* `resources/js/Pages/Dashboard/OwnerDashboard.tsx` & `resources/js/Components/MetricCard.tsx` & `resources/js/Components/Charts/UsageVsWasteChart.tsx` & `resources/js/Components/Dashboard/TopWasteTable.tsx` (Dasbor Grafik Owner)

---

## 2. Alur Integrasi Desain: Google Stitch ke AI Coding Agent

Sebagai developer frontend pemula, Anda **tidak perlu menyusun styling CSS/Tailwind manual dari nol**. Gunakan alur kerja modern berbasis kecerdasan buatan (AI):

```
[Prompt di PLAN_XX.md] ──> [Google Stitch (Buat Layar)] ──> [AI Coding Assistant] ──> [Kode React Hidup]
```

1. **Tahap Mockup (Minggu 1)**: Ambil prompt dari dokumen spesifikasi di `docs/Plan Frontend/` dan jalankan di **Google Stitch** untuk menghasilkan purwarupa visual layar.
2. **Tahap Konversi ke Kode (Minggu 2 & 3)**: Berikan perintah ke AI Coding Assistant:
   > *"Tolong terapkan hasil layar Stitch [nama/link/ID layar] ke file `resources/js/Pages/[TargetFile.tsx]` sesuai panduan di `docs/Plan Frontend/[PLAN_FILE.md]`."*
3. **Hasil Otomatis**: AI akan menyusun markup Tailwind yang rapi, menghubungkannya dengan form Inertia `useForm`, serta tipe data di `resources/js/types/inventory.d.ts`.

---

## 3. Rincian Tugas Bertahap Mingguan

### 📌 MINGGU 1: Perancangan Mockup Visual & Design System (Google Stitch)
> **Tujuan Minggu 1**: Menyelesaikan seluruh purwarupa visual (mockup) layar tanggung jawab FE 1 di Google Stitch sebelum menulis baris kode React.

#### Task 1: Mockup Autentikasi & Login Multi-Role (Rujukan: `PLAN_01_AUTH_LOGIN.md`)
* Salin prompt dari **Bab 2.5** di `PLAN_01` ke Google Stitch.
* Pastikan mockup memiliki:
  * Tampilan *split-screen* modern (sisi kiri ilustrasi kafe hangat, sisi kanan form login).
  * Tiga kartu pemilih demo cepat (*One-Click Demo Login Cards*): Barista, Supervisor, dan Owner.

#### Task 2: Mockup Shell Layout Utama & Sidebar RBAC (Rujukan: `PLAN_02_APP_LAYOUT_RBAC.md`)
* Salin prompt dari `PLAN_02` ke Google Stitch.
* Pastikan mockup memiliki:
  * Sidebar kiri dengan menu dinamis yang berubah sesuai role pengguna.
  * Header atas dengan indikator peran (*Role Capsule Badge*): Hijau Emerald untuk Barista, Biru Indigo untuk Supervisor, dan Ungu Amethyst untuk Owner.

#### Task 3: Mockup Tabel Monitoring Inventaris (Rujukan: `PLAN_05_SUPERVISOR_MONITORING_INVENTARIS.md`)
* Salin prompt dari `PLAN_05` ke Google Stitch.
* Pastikan mockup memuat:
  * Tabel daftar bahan baku dengan status stok total.
  * Baris yang dapat diklik (*collapsible accordion*) untuk melihat rincian batch fisik di bawahnya.
  * Kolom badge kedaluwarsa dengan indikator warna lalu lintas.

#### Task 4: Mockup Dasbor Analitik & Grafik Finansial Owner (Rujukan: `PLAN_07_OWNER_ANALYTICS_DASHBOARD.md`)
* Salin prompt dari `PLAN_07` ke Google Stitch.
* Pastikan memuat:
  * 3 Kartu Metrik Finansial Rupiah (Total Nilai Aset Bahan, Estimasi Nilai Bahan Kritis, Total Kerugian Limbah).
  * Mockup grafik batang perbandingan: Pemakaian Bahan Baku vs Kerugian Bahan Basi.

---

### 📌 MINGGU 2: Implementasi Login, Shell Layout Dinamis & Tabel Inventaris

#### Task 5: Layar Autentikasi & Login Demo (`Pages/Auth/Login.tsx`)
* Terapkan mockup Stitch ke file `Login.tsx` dan `GuestLayout.tsx`.
* Pasang event handler pada tombol 1-klik akun demo:
  * Klik tombol **Demo Barista**: Otomatis mengisi email `barista@kafe.com` dan password `password`.
  * Klik tombol **Demo Supervisor**: Otomatis mengisi email `spv@kafe.com` dan password `password`.
  * Klik tombol **Demo Owner**: Otomatis mengisi email `owner@kafe.com` dan password `password`.

#### Task 6: Shell Layout Utama & Sidebar Navigasi Dinamis (`AppLayout.tsx`)
* Bangun arsitektur tata letak dengan menu berdasarkan izin peran:
  * **Barista**: Menu *Dasbor Barista*, *Pencatatan Pemakaian FEFO*, *Penerimaan Batch Restock*, *Lapor Bahan Rusak*.
  * **Supervisor**: Semua menu Barista + *Master Data Bahan & Kategori* + *Tabel Monitoring Stok* + *Approval Limbah Rusak*.
  * **Owner**: *Dasbor Analitik Eksekutif*, *Laporan Finansial & Kerugian*, *Monitoring Inventaris*.
* Pasang tombol logout di menu profil dropdown kanan atas (`UserDropdown.tsx`).

#### Task 7: Komponen Badge Kedaluwarsa (`ExpiryBadge.tsx`)
* Buat komponen serbaguna untuk menampilkan status umur simpan bahan:
  * 🔴 **Kritis (`critical`)**: Sisa masa simpan < 3 hari atau sudah lewat (`bg-rose-100 text-rose-800 border-rose-300`).
  * 🟡 **Peringatan Dini (`warning`)**: Sisa masa simpan 3 – 7 hari (`bg-amber-100 text-amber-800 border-amber-300`).
  * 🟢 **Aman (`safe`)**: Sisa masa simpan > 7 hari (`bg-emerald-100 text-emerald-800 border-emerald-300`).

#### Task 8: Halaman Monitoring Inventaris Bahan Baku (`Inventory/Index.tsx`)
* Tampilkan daftar bahan yang diterima dari controller backend.
* Fitur interaktif: Saat baris bahan diklik, baris mengembang (*expand*) menampilkan tabel batch fisik yang mencantumkan: kode batch, sisa stok, tanggal kedaluwarsa, dan komponen `ExpiryBadge`.

---

### 📌 MINGGU 3: Dasbor Analitik Recharts untuk Persona Owner

#### Task 9: Halaman Dasbor Eksekutif Owner (`Dashboard/OwnerDashboard.tsx`)
1. **Tiga Kartu Metrik Finansial (`MetricCard.tsx`)**:
   * Total Nilai Aset Bahan Baku (Format Rupiah: `Rp xx.xxx.xxx`).
   * Estimasi Nilai Bahan Kritis (Bahan berisiko basi dalam < 3 hari).
   * Total Kerugian Bahan Basi (*Waste Loss*) Bulan Ini.
2. **Visualisasi Grafik Recharts (`UsageVsWasteChart.tsx`)**:
   * Gunakan komponen `BarChart` dari pustaka `recharts` yang telah terpasang.
   * Sumbu X: Bulan (Jan, Feb, Mar, dst).
   * Bar 1 (Warna Emerald): Nilai Bahan Baku Terpakai.
   * Bar 2 (Warna Rose): Nilai Bahan Basi/Rusak (*Waste Loss*).
3. **Tabel Top Limbah Bahan Rusak (`TopWasteTable.tsx`)**:
   * Menampilkan daftar 5 bahan baku yang menyumbang kerugian terbesar bulan ini.

---

### 📌 MINGGU 4: Responsivitas Layar, Uji Aksesibilitas & Demo UAS
* Uji tampilan antarmuka pada resolusi tablet kasir/bar (1024x768 dan 1280x800).
* Pastikan navigasi sidebar dapat ditutup/dibuka secara mulus pada layar kecil (*mobile drawer*).
* Gladi bersih skenario presentasi: Login sebagai Owner -> Tinjau grafik tren kerugian -> Buka monitoring tabel stok bahan kritis.

---

## 4. Do's and Don'ts untuk FE 1
* ✅ **DO**: Manfaatkan komponen pustaka yang sudah ada: `lucide-react`, `recharts`, `clsx`, dan helper `cn()` di `resources/js/lib/utils.ts`.
* ✅ **DO**: Selalu gunakan tipe TypeScript yang telah disediakan di `resources/js/types/inventory.d.ts`.
* ✅ **DO**: Tuliskan dokumentasi komponen baru yang Anda buat di folder `docs/explanations/`.
* ❌ **DON'T**: Jangan mengubah rute web di backend secara mandiri; koordinasikan dengan PM dan tim Backend.
