# Penjelasan Modul 13: Dasbor Operasional Barista & Kesehatan Meja Bar
## Panduan Pemula — Monitor Speedometer Barista di Stasiun Espresso

> **Untuk Siapa Dokumen Ini**: Tim mahasiswa pemula yang ingin memahami antarmuka dasbor operasional barista, logika sistem peringatan dini (*early warning indicator*), serta kartu aksi cepat pemakaian bahan di jam sibuk (*rush hour*).  
> **Analogi Dunia Nyata**: Bayangkan meja racik barista (*bar station*). Barista butuh panel instrumen seperti di mobil balap: tahu susu mana yang paling darurat harus segera dibuka (kartu merah terracotta), sirup apa yang stoknya mulai menipis (kartu kuning), dan melihat riwayat apakah teman shift sebelumnya patuh merotasi bahan sesuai urutan kedaluwarsa (kartu hijau).  
> **Kaitan dengan Kode**: [`resources/js/Pages/Barista/Dashboard.tsx`](../../resources/js/Pages/Barista/Dashboard.tsx) dan [`resources/js/Pages/Dashboard.tsx`](../../resources/js/Pages/Dashboard.tsx).

---

## 1. Komponen: `BaristaDashboard()`

* **Tujuan**: Menyajikan layar utama untuk barista saat bekerja di bar kafe. Memusatkan 3 aksi utama (Catat Pemakaian, Penerimaan Batch, Lapor Bahan Rusak), menyoroti batch yang mendekati kedaluwarsa, serta memantau kesehatan stok 5 bahan utama secara *real-time*.
* **Input / Parameter**: Mengambil data pengguna login dan parameter props dari Inertia (`usePage().props.auth.user`).
* **Alur Logika Bisnis (Langkah demi Langkah)**:
  1. Komputer memeriksa status stasiun bar dan shift yang aktif (misal: Shift Pagi 07:00 - 15:00 WIB).
  2. Merender **3 Tombol Sentuh Cepat Berukuran Besar**:
     - *Catat Pemakaian (FEFO)*: Latar cokelat espresso `#4A2C11`.
     - *Penerimaan Batch Baru*: Latar kertas perkamen `#EDE4DC`.
     - *Lapor Bahan Rusak*: Latar amber karamel `#FFF7ED`.
  3. Menampilkan **Kartu Peringatan Terracotta Kritis**: Menyorot batch bahan baku yang sisa umurnya kurang dari 24 jam (misal: *Fresh Milk Diamond Batch #BCH-20241026-A3F2*) beserta lokasi fisiknya di chiller bar. Tombol *"Pakai Batch Ini"* langsung mengarahkan ke form pemakaian.
  4. Memetakan 5 bahan utama ke indikator progress bar dan lampu lalu lintas.
  5. Menampilkan tabel riwayat transaksi shift pagi dengan lencana hijau (*Patuh FEFO*) atau kuning (*Deviasi Teralasan*).
* **Output / Return Value**: Tampilan dasbor operasional barista terpadu di dalam kerangka `AuthenticatedLayout`.
* **Kaitan dengan Bagian Lain**: Terhubung dengan rute pemakaian bahan (`/usage/create`), penerimaan batch (`/batches/create`), dan laporan rusak (`/waste/create`).

---

## 2. Komponen: `Dashboard()`

* **Tujuan**: Menjadi pintu masuk rute `/dashboard` utama di aplikasi Laravel.
* **Input / Parameter**: Tidak menerima props luar; membaca peran pengguna dari sesi login Inertia.
* **Alur Logika Bisnis (Langkah demi Langkah)**:
  1. Komputer memeriksa `auth.user.role`.
  2. Untuk pengguna dengan peran Barista atau Supervisor, komponen ini otomatis merender antarmuka `BaristaDashboard`.
* **Output / Return Value**: Elemen JSX dasbor yang sesuai dengan peran aktif.
* **Kaitan dengan Bagian Lain**: Didaftarkan pada file `routes/web.php` pada URL `/dashboard`.

---

## 3. Logika Bisnis: Lampu Lalu Lintas Status Bahan (`UrgencyStatus`)

* **Tujuan**: Memandu mata barista dalam 1 detik untuk mengetahui kelayakan bahan tanpa harus menghitung selisih tanggal manual.
* **Aturan Bisnis (Sesuai PRD Bab 3.3)**:
  1. 🟢 **Aman (`safe`)**: Sisa hari masa simpan > 7 hari. Lencana hijau dengan teks "Hijau: Aman / Optimal".
  2. 🟡 **Peringatan Dini (`warning`)**: Sisa hari masa simpan antara 3 sampai 7 hari. Lencana amber karamel "Kuning: Warning Segera Pakai".
  3. 🔴 **Kritis (`critical`)**: Sisa hari masa simpan < 3 hari atau sudah lewat dari hari ini. Lencana merah bata terracotta beranimasi detak (*animate-pulse*): "Merah: Kritis 1 Hari / Habiskan Segera".
* **Kaitan dengan Bagian Lain**: Mengatur warna latar, teks, dan progress bar pada daftar 5 bahan utama meja bar.

---

## 4. Logika Bisnis: Riwayat Audit & Lencana Kepatuhan FEFO

* **Tujuan**: Memastikan transparansi rotasi stok antara barista di bar dan supervisor gudang.
* **Aturan Bisnis (Sesuai PRD Bab 3.2)**:
  1. Jika barista mengambil batch dengan tanggal kedaluwarsa terdekat: Kolom status mencatat `is_fefo_compliant = true` dengan lencana **Patuh FEFO 🟢**.
  2. Jika barista mengambil batch yang lebih baru karena kondisi fisik tertentu (disertai alasan): Kolom status mencatat `is_fefo_compliant = false` dengan lencana **Deviasi Teralasan 🟡**.
* **Kaitan dengan Bagian Lain**: Data transaksi ini bersumber dari tabel database `stock_usages`.
