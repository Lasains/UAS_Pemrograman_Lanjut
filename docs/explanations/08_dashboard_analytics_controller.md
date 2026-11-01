# Penjelasan Modul 08: Dashboard & Analytics Controller
## Panduan Pemula — Sistem Inventaris Kafe

> **Untuk Siapa**: Tim mahasiswa pengembang yang ingin memahami cara menyajikan data agregasi cepat, grafik analitik finansial, dan laporan eksekutif untuk 3 peran pengguna berbeda.  
> **Pendekatan**: Analogi papan display di bar, papan monitoring di ruang kepala gudang, dan ruang rapat pemilik kafe.  
> **Kaitan dengan Kode**: [`docs/Plan Backend/PLAN_08_DASHBOARD_ANALYTICS_CONTROLLER.md`](../Plan%20Backend/PLAN_08_DASHBOARD_ANALYTICS_CONTROLLER.md)

---

## Konsep Dasar: "Satu Aplikasi, Tiga Kacamata Berbeda"

Setiap orang di kafe memiliki kepentingan yang berbeda saat membuka aplikasi:

1. **Andi (Barista)**: Sedang sibuk membuat kopi. Dia tidak peduli laporan laba rugi. Dia hanya butuh tahu: *"Susu mana yang mau basi hari ini dan harus cepat dihabiskan?"* dan *"Bahan apa yang stoknya menipis?"*
2. **Ibu Sari (Supervisor)**: Menjaga stok gudang agar tidak kehabisan bahan dan tidak ada barang membusuk. Dia butuh: *"Berapa banyak bahan di lampu merah/kuning?"* dan *"Ada berapa laporan bahan rusak yang harus saya periksa?"*
3. **Pak Budi (Owner)**: Memikirkan kesehatan keuangan bisnis. Dia butuh: *"Berapa total nilai modal bahan baku yang tersimpan di kafe?"*, *"Berapa rupiah uang yang hangus bulan ini karena bahan busuk?"*, dan *"Seberapa disiplin barista mengikuti FEFO?"*

Modul ini bertugas meracik data dari database menjadi informasi tepat sasaran bagi masing-masing peran tersebut.

---

## Penjelasan Per-Komponen & Per-Fungsi

---

### Komponen 1: Controller `DashboardController`

---

#### Fungsi: `barista()`
* **Tujuan**: Menyajikan informasi operasional harian yang ringkas dan memicu tindakan cepat bagi barista di meja bar.
* **Input / Parameter**: Tidak ada parameter input (langsung mendeteksi sesi pengguna aktif).
* **Alur Logika Bisnis (Langkah demi Langkah)**:
  1. Mencari batch bahan yang berada dalam status darurat (kedaluwarsa kurang dari 3 hari lagi atau sudah lewat) menggunakan scope `criticalExpiry(3)`.
  2. Mengurutkan batch tersebut berdasarkan tanggal kedaluwarsa terdekat (FEFO) dan membatasi hanya 8 data teratas agar layar tidak penuh.
  3. Mencari bahan baku yang total stok fisiknya di bawah batas minimum (`belowMinimumStock()`) agar barista tahu bahan apa yang perlu segera dibuatkan pesanan baru.
  4. Menghitung berapa kali barista mencatat pemakaian hari ini.
* **Output / Return Value**: Merender tampilan Inertia `Dashboard/Barista`.
* **Kaitan dengan Bagian Lain**: Memberikan peringatan dini di awal shift kerja barista agar bahan yang mendekati masa kedaluwarsa segera diprioritaskan untuk menu promo atau pemakaian harian.

---

#### Fungsi: `supervisor()`
* **Tujuan**: Menampilkan sistem peringatan dini (*Early Warning System*) dan rekapitulasi inventaris komprehensif bagi Supervisor.
* **Input / Parameter**: Request HTTP dengan query paginasi opsional.
* **Alur Logika Bisnis (Langkah demi Langkah)**:
  1. **Menghitung 5 Kartu Metrik Utama (`$stats`)**:
     * Total batch aktif di gudang.
     * Jumlah batch lampu merah (kritis < 3 hari).
     * Jumlah batch lampu kuning (peringatan 3–7 hari).
     * Jumlah bahan yang stoknya di bawah batas minimum.
     * Jumlah tiket pemusnahan yang masih berstatus `pending` (perlu diperiksa fisik).
  2. Menampilkan daftar batch yang masa simpannya $\le 7$ hari lengkap dengan paginasi.
  3. Menampilkan daftar bahan yang memerlukan pengadaan restock segera.
* **Output / Return Value**: Merender tampilan Inertia `Dashboard/Supervisor`.
* **Kaitan dengan Bagian Lain**: Memandu Supervisor dalam menentukan jadwal belanja mingguan dan menyelesaikan antrean approval limbah bahan baku.

---

#### Fungsi: `owner()`
* **Tujuan**: Menyajikan metrik finansial tingkat tinggi dan grafik tren kerugian untuk pemilik kafe (*Owner*).
* **Input / Parameter**: Tidak ada parameter input.
* **Alur Logika Bisnis (Langkah demi Langkah)**:
  1. **Hitung Nilai Aset Aktif**: Mengalikan sisa stok dengan harga beli untuk seluruh batch yang aktif:
     $$\text{Total Nilai Aset} = \sum (\text{current\_stock} \times \text{cost\_per\_unit})$$
  2. **Hitung Total Kerugian Bahan Rusak**: Menjumlahkan seluruh kerugian finansial dari tiket pemusnahan yang berstatus `approved` untuk bulan berjalan dan sepanjang masa.
  3. **Hitung Rasio Disiplin FEFO**: Menghitung persentase pemakaian yang mematuhi rekomendasi FEFO:
     $$\text{Kepatuhan FEFO (\%)} = \left(\frac{\text{Pemakaian Patuh}}{\text{Total Pemakaian}}\right) \times 100\%$$
  4. **Bentuk Data Grafik Tren**: Menghitung total kerugian per bulan selama 6 bulan terakhir untuk diumpankan ke grafik kurva (*Recharts AreaChart*).
  5. **Bentuk Data Komposisi Kategori**: Mengelompokkan kerugian berdasarkan kategori bahan (Dairy, Sirup, Biji Kopi) untuk grafik lingkaran (*PieChart*).
* **Output / Return Value**: Merender tampilan Inertia `Dashboard/Owner`.
* **Kaitan dengan Bagian Lain**: Membantu Owner mengevaluasi efisiensi operasional kafe dan meminimalisir kerugian uang modal (*shrinkage*).

---

### Komponen 2: Controller `AnalyticsController`

---

#### Fungsi: `index(Request $request)`
* **Tujuan**: Menyediakan analisis mendalam dengan dukungan pemilihan rentang tanggal khusus bagi Owner untuk keperluan audit.
* **Input / Parameter**: HTTP Request dengan filter rentang tanggal (`start_date`, `end_date`).
* **Alur Logika Bisnis (Langkah demi Langkah)**:
  1. Menentukan periode awal dan akhir (default: dari awal bulan hingga hari ini).
  2. Menghitung total insiden pemusnahan dan total rupiah kerugian pada periode yang dipilih.
  3. Mengidentifikasi **5 Bahan Baku Paling Boros**: Mencari bahan baku mana yang menyumbang kerugian nominal rupiah terbesar akibat kedaluwarsa.
  4. Mengidentifikasi **5 Alasan Deviasi Terbanyak**: Menganalisis alasan mengapa barista sering tidak mematuhi FEFO (misal: "segel botol lain terlanjur terbuka").
* **Output / Return Value**: Merender tampilan Inertia `Analytics/Index`.
* **Kaitan dengan Bagian Lain**: Menjadi bahan evaluasi SOP operasional bar dan evaluasi kualitas supplier bahan baku.

---

#### Fungsi: `export(Request $request)`
* **Tujuan**: Mengunduh seluruh rincian riwayat pemusnahan bahan ke dalam file Microsoft Excel / Spreadsheet (format CSV).
* **Input / Parameter**: Filter tanggal `start_date` dan `end_date`.
* **Alur Logika Bisnis (Langkah demi Langkah)**:
  1. Menyiapkan header unduhan file CSV berformat UTF-8 (agar karakter tanda kurung dan rupiah tidak rusak di Excel).
  2. Menuliskan judul kolom di baris pertama (ID, Tanggal, Bahan, Batch, Jumlah, Harga Beli, Kerugian Rp, Pelapor, Approver, Alasan).
  3. **Mengalirkan Data Bertahap (*Streaming Chunking*)**: Mengambil data setiap 100 baris langsung ditulis ke file unduhan tanpa ditampung semua di memori server.
* **Output / Return Value**: File `.csv` yang langsung terunduh secara otomatis di peramban web pengguna.
* **Kaitan dengan Bagian Lain**: Mempermudah akuntan kafe mengimpor data pengeluaran dan kerugian ke dalam software akuntansi pembukuan bulanan.

---

## Rangkuman Penggunaan Dashboard

```
SKENARIO 1: ANDI (BARISTA) MASUK SHIFT PAGI
1. Andi login -> Otomatis diarahkan ke Dashboard Barista.
2. Andi melihat kartu merah: "Fresh Milk Batch A (Sisa 3 Botol, Expired 2 Hari Lagi!)".
3. Andi langsung tahu: pagi ini semua pesanan Iced Latte wajib dibuat menggunakan Batch A.

SKENARIO 2: IBU SARI (SUPERVISOR) MONITORING GUDANG
1. Ibu Sari login -> Otomatis diarahkan ke Dashboard Supervisor.
2. Sari melihat ada badge merah: "1 Laporan Menunggu Approval".
3. Sari memeriksa daftar bahan menipis: "Caramel Syrup sisa 1 botol (di bawah batas minimum 3)".
4. Sari membuat purchase order baru ke supplier sirup sebelum stok habis total.

SKENARIO 3: PAK BUDI (OWNER) EVALUASI BULANAN
1. Pak Budi login -> Otomatis diarahkan ke Dashboard Owner.
2. Budi melihat grafik Recharts: Kerugian limbah turun 30% berkat sistem FEFO.
3. Kepatuhan FEFO berada di angka 94%.
4. Budi menekan tombol "Export CSV" untuk menyerahkan bukti pembukuan ke konsultan pajak.
```

---

*Dokumen ini merupakan panduan pemula pendamping spesifikasi teknis di [`PLAN_08_DASHBOARD_ANALYTICS_CONTROLLER.md`](../Plan%20Backend/PLAN_08_DASHBOARD_ANALYTICS_CONTROLLER.md).*
