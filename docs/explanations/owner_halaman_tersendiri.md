# Penjelasan: 3 Halaman Eksekutif untuk Owner BeanFlow

> **Dibuat untuk**: Tim Mahasiswa (Pemula)  
> **Topik**: Arsitektur 3 halaman khusus pemilik kafe (Owner) di PLAN_07 (Dasbor Finansial + Laporan Waste + Evaluasi Pembelian)  
> **Analogi Kafe**: Bayangkan pemilik kedai kopi yang sedang duduk di meja pojok memeriksa pembukuan keuangan kafe — ia tidak perlu tahu resep latte secara teknis, tetapi ia ingin tahu berapa banyak uang kafe yang mengendap di kulkas, berapa yang terbuang sia-sia karena susu basi, dan apakah pesanan ke supplier bulan depan harus dikurangi.

---

## Mengapa Owner Memiliki 3 Halaman Mandiri?

Seorang pemilik kafe (*Owner*) memiliki cara pandang yang berbeda dari Barista maupun Supervisor:
- **Barista** butuh kecepatan racik dan kepatuhan urutan pemakaian bahan (FEFO).
- **Supervisor** butuh ketelitian stok fisik dan kontrol persetujuan pemusnahan barang.
- **Owner** butuh **angka finansial (Rupiah)**, efisiensi modal kas (*cash flow*), dan keputusan strategis pembelian bahan.

Oleh karena itu, navigasi sidebar Owner dibagi menjadi 3 stasiun informasi eksekutif:
```
SIDEBAR OWNER (EKSEKUTIF):
├── 📊 Dasbor Finansial       → Pages/Dashboard/OwnerDashboard.tsx
│                              (Helicopter View: 3 KPI + Grafik Recharts + Top 5 Boros)
│
├── 📉 Laporan Waste & Biaya   → Pages/Reports/WasteReport.tsx
│                              (Audit Transparansi: Siapa membuang apa, kapan, dan berapa kerugiannya)
│
└── 📦 Evaluasi Pembelian &   → Pages/Reports/InventoryValuation.tsx
    Valuasi Aset               (Kecerdasan Bisnis: Mencegah over-purchasing bahan yang mudah basi)
```

---

## Halaman A: Dasbor Analitik & Finansial Eksekutif (`Pages/Dashboard/OwnerDashboard.tsx`)

### Komponen: `ExecutiveMetricCards`
* **Tujuan**: Memberikan ringkasan instan dalam 3 detik mengenai posisi keuangan bahan baku kafe bulan ini.
* **Input / Parameter**: Objek `metrics: DashboardMetrics` dari props Inertia:
  - `total_asset_value`: Angka total modal bahan di gudang (misal: `48250000`).
  - `critical_asset_value`: Modal bahan yang kedaluwarsa < 3 hari (misal: `1450000`).
  - `monthly_waste_loss`: Akumulasi kerugian limbah bulan ini (misal: `420500`).
* **Alur Logika Bisnis (Langkah demi Langkah)**:
  1. Komputer menerima angka mentah dari controller Laravel (hasil perkalian stok × harga beli).
  2. Komputer memformat angka menjadi format mata uang Rupiah Indonesia (`Rp 48.250.000`) menggunakan `Intl.NumberFormat`.
  3. Kartu kedua (Bahan Kritis) diberi highlight garis batas merah terracotta (`border-t-4 border-[#8C3D2B]`) untuk menarik perhatian mata Owner bahwa ada modal yang terancam hangus jika tidak segera dipromosikan.
* **Output / Return Value**: 3 kartu metrik besar bernuansa *oat latte* di baris teratas kanvas.
* **Kaitan dengan Bagian Lain**: Data ini dihitung oleh backend dari tabel `ingredient_batches` dan `waste_logs`.

### Komponen: `UsageVsWasteChart` (Recharts)
* **Tujuan**: Memvisualisasikan perbandingan antara bahan yang menghasilkan uang (terpakai efektif di bar) vs bahan yang menjadi kerugian (terbuang basi).
* **Input / Parameter**: Array `monthlyComparison: MonthlyComparisonData[]` berisi data 10 bulan terakhir:
  - `month`: Nama bulan (Jan, Feb, Mar, dst).
  - `usage_cost`: Nominal rupiah bahan terpakai.
  - `waste_cost`: Nominal rupiah bahan terbuang.
* **Alur Logika Bisnis (Langkah demi Langkah)**:
  1. Library Recharts merender dua batang vertikal berdampingan untuk setiap bulan.
  2. Batang hijau (*Harvest Emerald*) menunjukkan bahan yang sukses terpakai meracik kopi.
  3. Batang merah (*Terracotta Cherry*) menunjukkan bahan yang basi/rusak.
  4. Ketika kursor mouse diarahkan ke batang grafis (*hover*), tooltip interaktif muncul menunjukkan angka persentase efisiensi (misal: efisiensi 98.2%).
* **Output / Return Value**: Grafik batang komparasi interaktif yang responsif di layar tablet/desktop.
* **Kaitan dengan Bagian Lain**: Bersumber dari tabel `stock_usages` dan `waste_logs` yang digabungkan per bulan oleh controller.

### Komponen: `TopWasteTable`
* **Tujuan**: Memberitahu Owner 5 bahan baku spesifik yang paling sering basi dan menyedot kerugian terbesar.
* **Input / Parameter**: Array `topWasteIngredients: TopWasteItem[]` (misal: Susu Diamond, Croissant, Sirup Karamel).
* **Alur Logika Bisnis (Langkah demi Langkah)**:
  1. Sistem mengurutkan bahan berdasarkan akumulasi kerugian rupiah tertinggi (`SUM(financial_loss)` DESC).
  2. Menghitung persentase kontribusi kerugian masing-masing bahan terhadap total kerugian kafe.
  3. Menampilkan bar progres tipis warna terracotta di samping angka nominal rupiah.
* **Output / Return Value**: Tabel ringkas 5 baris dengan progress bar visual.
* **Kaitan dengan Bagian Lain**: Membantu Owner mengambil keputusan: apakah perlu mengganti merek susu, atau mengurangi kuantitas pesanan harian.

---

## Halaman B: Laporan Waste & Biaya Limbah (`Pages/Reports/WasteReport.tsx`)

Analoginya: **Ini adalah buku audit investigasi kerugian kafe**. Jika dasbor hanya memberi tahu total angka kerugian, halaman ini membongkar rincian setiap kejadian pemusnahan bahan.

### Komponen: `CategoryLossBreakdown` (Kolom Kiri)
* **Tujuan**: Menampilkan kategori bahan mana yang paling rapuh dan menyumbang kerugian terbesar (Dairy/Susu, Bakery/Kue, Syrup, atau Beans).
* **Input / Parameter**: Data agregasi kerugian per kategori: `categoryBreakdown: { category_name: string; loss_amount: number; percentage: number }[]`.
* **Alur Logika Bisnis (Langkah demi Langkah)**:
  1. Sistem menjumlahkan kerugian dari seluruh tiket waste berstatus `approved` yang terjadi dalam periode tanggal terpilih.
  2. Mengelompokkannya berdasarkan kategori produk.
  3. Menampilkan bar persentase multi-warna: Susu (Dairy) biasanya mendominasi karena masa simpan pendek (misal: 62% dari total kerugian).
* **Output / Return Value**: Kartu visual distribusi persentase kerugian kategori produk.
* **Kaitan dengan Bagian Lain**: Terhubung dengan relasi `IngredientBatch -> Ingredient -> Category`.

### Komponen: `WasteAuditTable` (Kolom Kanan)
* **Tujuan**: Tabel audit resmi yang membuktikan bahwa pemusnahan bahan dilakukan secara sah dan tidak ada kecurangan (*fraud prevention*).
* **Input / Parameter**: Array `wasteLogs: WasteLog[]` berstatus `approved`.
* **Alur Logika Bisnis (Langkah demi Langkah)**:
  1. Menampilkan seluruh data tiket pemusnahan resmi: Tanggal, Nama Bahan, Kode Batch, Jumlah yang Dibuang, dan Nilai Rupiah.
  2. Menampilkan alasan fisik: mengapa bahan tersebut dibuang (contoh: "Bau Asam", "Kemasan Bocor di Chiller").
  3. Menampilkan dua nama penanggung jawab: **Barista yang menemukan & melapor**, serta **Supervisor yang memverifikasi fisik di lokasi**.
  4. Baris tabel dapat di-klik untuk melihat catatan lengkap kondisi fisik bahan saat ditemukan.
* **Output / Return Value**: Tabel audit transparan dengan nominal kerugian berhuruf tebal monospaced terracotta (`text-[#8C3D2B] font-mono`).
* **Kaitan dengan Bagian Lain**: Mengambil data dari tabel `waste_logs` hasil alur kerja di PLAN_06.

---

## Halaman C: Evaluasi Pembelian & Valuasi Aset (`Pages/Reports/InventoryValuation.tsx`)

Analoginya: **Ini seperti konsultan bisnis pribadi Owner**. Halaman ini menganalisis apakah kebiasaan kafe membeli bahan baku sudah seimbang dengan daya beli pelanggan (*anti over-purchasing*).

### Komponen: `ProcurementHealthCards`
* **Tujuan**: Memberikan skor kesehatan sistem pengadaan bahan kafe (*Purchasing Health Score*).
* **Input / Parameter**:
  - `efficiency_rate`: Rasio modal yang berhasil berubah menjadi penjualan (misal: `96.2%`).
  - `waste_ratio`: Rasio modal yang terbuang basi (misal: `3.8%`, target kafe sehat adalah < 5%).
  - `overstocked_count`: Jumlah bahan yang stoknya terlalu menumpuk melebihi kecepatan racik barista.
* **Alur Logika Bisnis (Langkah demi Langkah)**:
  1. Menghitung total bahan yang dibeli dalam 30 hari terakhir.
  2. Menghitung berapa persen yang terpakai dan berapa persen yang terbuang.
  3. Memberikan status lampu indikator: hijau jika waste < 5%, kuning jika 5–10%, merah jika > 10%.
* **Output / Return Value**: 3 kartu evaluasi kesehatan modal berjalan.

### Komponen: `ProcurementRecommendationTable`
* **Tujuan**: Memberikan rekomendasi konkret tindakan order ke vendor untuk setiap bahan baku.
* **Input / Parameter**: Array analisis bahan `procurementAnalysis: { ingredient_name: string; category: string; monthly_purchased: number; monthly_used: number; waste_rate: number; recommendation: string; status: 'optimal' | 'warning' | 'critical' }[]`.
* **Alur Logika Bisnis (Langkah demi Langkah)**:
  1. Komputer membandingkan kuantitas beli vs kuantitas pakai.
  2. Jika angka `monthly_purchased` jauh lebih tinggi dari `monthly_used` dan tingkat `waste_rate` tinggi:
     - Sistem memunculkan rekomendasi: *"⚠ Turunkan Volume Order (-15%) / Pesan Lebih Sering dengan Porsi Kecil"*.
  3. Jika pemakaian dan pembelian seimbang:
     - Sistem memunculkan rekomendasi: *"✓ Kuantitas Pesanan Sangat Ideal"*.
* **Output / Return Value**: Tabel kecerdasan bisnis dengan badge rekomendasi yang langsung dapat digunakan Owner saat menelepon supplier.

---

## Ringkasan Alur Navigasi Owner

```
Login sebagai Owner
        ↓
[ Dasbor Finansial ] ← Halaman pertama (Helicopter View & KPI)
        ↓
Navigasi Sidebar Eksekutif:
├── [📊 Dasbor Finansial]      → Pages/Dashboard/OwnerDashboard.tsx
├── [📉 Laporan Waste & Biaya]  → Pages/Reports/WasteReport.tsx
└── [📦 Evaluasi Pembelian]     → Pages/Reports/InventoryValuation.tsx
```

> **Catatan Ponytail**: Seluruh perhitungan finansial berat (seperti total aset, komparasi bulanan, dan rasio waste) dihitung di sisi backend Laravel (controller/service) menggunakan fungsi agregasi SQL Eloquent (`SUM()`, `AVG()`), bukan dihitung manual dengan loop JavaScript di browser frontend. Ini memastikan performa antarmuka Owner tetap sangat cepat dan ringan di perangkat tablet.
