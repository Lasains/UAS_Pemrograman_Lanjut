# PROPOSAL USULAN PROYEK UAS PEMROGRAMAN LANJUT
## PROGRAM STUDI TEKNIK INFORMATIKA

* **Mata Kuliah**: Pemrograman Lanjut
* **Nama Mahasiswa**: ....................................................
* **NIM**: ....................................................
* **Kelas**: ....................................................

---

### JUDUL PROYEK:
**“Sistem Pemantauan Masa Kadaluwarsa dan Inventaris Bahan Baku Kafe Berbasis Web Menggunakan Laravel”**

---

# BAB I PENDAHULUAN

## 1.1 Latar Belakang Masalah

Industri *food and beverage* (F&B), khususnya kedai kopi (*coffee shop*), memiliki ketergantungan yang tinggi terhadap ketersediaan bahan baku dengan masa simpan (*shelf life*) yang pendek dan rentan mengalami penurunan kualitas (*perishable goods*). Berdasarkan laporan Kementerian Perencanaan Pembangunan Nasional/Bappenas (2021), Indonesia menghasilkan timbulan *food loss and waste* mencapai 23 hingga 48 juta ton per tahun, dengan sektor penyedia konsumsi (perhotelan, restoran, dan kafe) menyumbang volume limbah yang signifikan pada tahap penyimpanan dan persiapan bahan baku. Sejalan dengan temuan global *United Nations Environment Programme* (UNEP, 2024), sektor jasa boga menyumbang porsi limbah makanan yang masif akibat inefisiensi rotasi penyimpanan. Komoditas utama operasional kafe seperti susu segar pasteurisasi, biji kopi pasca-sangrai (*roasted beans*), sirup perisa, dan produk pastri membutuhkan pengawasan masa kelayakan yang ketat karena karakteristik biologis dan kimianya yang cepat terdegradasi setelah kemasan dibuka atau disimpan dalam rentang waktu tertentu.

Pada praktiknya di tingkat usaha kafe skala kecil hingga menengah, tata kelola inventaris bahan baku masih mengandalkan pencatatan berbasis formulir fisik atau lembar kerja digital manual yang tidak terintegrasi secara *real-time*. Kelemahan prosedural ini menyebabkan kegagalan dalam penerapan prinsip *First Expired, First Out* (FEFO) di area bar dan ruang penyimpanan (*chiller*). Ketika terjadi lonjakan pesanan pada jam operasional sibuk (*rush hour*), barista cenderung mengambil stok bahan baku yang posisinya paling mudah dijangkau atau membuka kemasan baru, sementara bahan baku yang diterima lebih awal dan mendekati tanggal kedaluwarsa terselip di rak bagian belakang. Tanpa adanya sistem pemantauan berkala berbasis status *batch*, bahan baku yang terlupakan tersebut terus mengalami masa kedaluwarsa tanpa terdeteksi oleh pengelola kafe.

Ketidakmampuan dalam melacak masa simpan bahan baku menimbulkan dua dampak kerugian yang krusial. Dari perspektif manajerial dan ekonomi, bahan baku yang rusak atau melewati batas tanggal kedaluwarsa berujung pada pemusnahan barang (*inventory shrinkage*), di mana penelitian empiris pada tata kelola persediaan kedai kopi membuktikan bahwa ketiadaan sistem kontrol FEFO dan ambang batas stok (*buffer stock*) memicu kerugian finansial berulang akibat akumulasi bahan kedaluwarsa di gudang (Agil & Triase, 2023). Dari perspektif keamanan konsumsi (*food safety*), regulasi Badan Pengawas Obat dan Makanan (BPOM RI, 2021) secara tegas mewajibkan penjaminan masa simpan dan mutu pangan olahan. Penggunaan bahan baku yang telah mengalami pembusukan atau penurunan mutu organoleptik—seperti susu segar yang mengalami kontaminasi asam mikroba—berisiko fatal terhadap standar higiene penyajian minuman, berpotensi memicu keracunan konsumen, serta merusak reputasi dan legalitas usaha kafe tersebut.

Guna mengatasi kesenjangan operasional tersebut, diperlukan sebuah instrumen teknologi terstruktur berupa **Sistem Pemantauan Masa Kadaluwarsa dan Inventaris Bahan Baku Kafe Berbasis Web**. Sistem ini dikembangkan dengan memanfaatkan kerangka kerja *Laravel*, yang memfasilitasi pencatatan data *multibatch* penerimaan bahan, penetapan ambang batas peringatan (*early warning threshold*), dan visualisasi status kelayakan bahan baku menggunakan kode warna (*Aman*, *Peringatan Dini*, dan *Kedaluwarsa*). Dengan mengimplementasikan metode FEFO secara semi-otomatis pada alur pemakaian bahan harian serta menyediakan modul pelaporan pembuangan (*waste disposal log*), sistem ini tidak hanya memenuhi tuntutan arsitektur pemrograman berorientasi objek dan relasi *Create, Read, Update, Delete* (CRUD) yang berbobot untuk tugas proyek Pemrograman Lanjut, tetapi juga memberikan solusi terukur dalam menekan angka pemborosan bahan baku serta menjaga standar mutu operasional kafe.

---

## 1.2 Rumusan Masalah

Berdasarkan uraian latar belakang masalah di atas, maka rumusan masalah dalam perancangan proyek ini adalah:
1. Bagaimana merancang sistem pencatatan inventaris bahan baku berbasis *multi-batch* untuk memetakan tanggal kedaluwarsa bahan secara terintegrasi pada kedai kopi?
2. Bagaimana menerapkan algoritma *First Expired, First Out* (FEFO) semi-otomatis yang merekomendasikan batch terdekat sekaligus memfasilitasi konfirmasi fisik barista saat mencatat pemakaian harian?
3. Bagaimana membangun fitur peringatan dini (*early warning system*) visual dan modul audit pemusnahan barang rusak (*waste disposal log*) untuk meminimalisasi kerugian finansial kafe?

---

## 1.3 Batasan Masalah / Ruang Lingkup

Agar ruang lingkup pengerjaan proyek UAS Pemrograman Lanjut ini tetap fokus dan terukur, batasan masalah ditetapkan sebagai berikut:
1. **Objek Bahan Baku**: Difokuskan pada kategori *perishable* dan bahan bar kafe utama, yaitu produk susu (*fresh milk*), biji kopi (*roasted coffee beans*), sirup/perisa, dan produk pastri.
2. **Platform & Arsitektur**: Sistem dikembangkan berbasis Web menggunakan *framework* Laravel 11 pada sisi backend dan antarmuka React (Inertia.js) dengan komponen shadcn/ui.
3. **Hak Akses Pengguna (RBAC)**: Dibagi menjadi 3 peran: Owner (analitik finansial & limbah), Supervisor (kelola master bahan, threshold, & approval waste), dan Barista (operasional harian restock & pemakaian).
4. **Metode Pergudangan**: Pengurangan stok menggunakan metode FEFO semi-otomatis (sistem merekomendasikan batch terdekat, barista mengonfirmasi nomor batch fisik).
5. **Eksklusi Fitur**: Sistem tidak mencakup integrasi modul kasir penjualan meja (*Point of Sales/POS*) dan gateway pembayaran transaksi pelanggan.

---

## 1.4 Tujuan Proyek

Tujuan yang hendak dicapai melalui pelaksanaan proyek perangkat lunak ini adalah:
1. Menghasilkan aplikasi web inventaris bahan baku kafe yang mampu mengelola pencatatan stok *multi-batch* beserta tanggal kedaluwarsanya secara *real-time*.
2. Mengimplementasikan mekanisme rotasi stok FEFO semi-otomatis guna memandu barista memprioritaskan pemakaian bahan yang memiliki masa simpan paling pendek.
3. Menyediakan visualisasi indikator peringatan dini (Aman, Segera Pakai, Kedaluwarsa) serta pencatatan audit log kerugian akibat bahan rusak/basi untuk kebutuhan evaluasi manajemen.

---

## 1.5 Manfaat Proyek

1. **Manfaat Praktis (Bagi Pelaku Usaha Kafe)**: Membantu operasional kafe menekan angka kerugian modal akibat bahan baku kedaluwarsa (*inventory shrinkage*), mencegah penyajian minuman dari bahan berkualitas buruk (*food safety*), dan menyajikan transparansi data stok bagi owner.
2. **Manfaat Akademis (Bagi Mahasiswa)**: Mengimplementasikan secara nyata kompetensi mata kuliah Pemrograman Lanjut, khususnya dalam perancangan database relasional multi-entitas, arsitektur MVC, validasi logika bisnis FEFO, serta penerapan CRUD berbobot.

---

# DAFTAR PUSTAKA (APA 7th Edition)

1. **Agil, M., & Triase.** (2023). Sistem Informasi Persediaan Bahan Baku pada Barbekoe Coffee Menggunakan Metode Buffer Stock dan FEFO. *Jurnal Teknologi Sistem Informasi dan Aplikasi*, 6(3), 362–370. https://doi.org/10.32493/jtsi.v6i3.31011
2. **Badan Pengawas Obat dan Makanan (BPOM RI).** (2021). *Peraturan Badan Pengawas Obat dan Makanan Nomor 20 Tahun 2021 tentang Perubahan atas Peraturan Badan Pengawas Obat dan Makanan Nomor 31 Tahun 2018 tentang Label Pangan Olahan*. Jakarta: BPOM RI.
3. **Kementerian PPN/Bappenas.** (2021). *Laporan Kajian Food Loss and Waste di Indonesia: Dalam Rangka Mendukung Ketahanan Pangan Nasional dan Penurunan Gas Rumah Kaca*. Jakarta: Direktorat Lingkungan Hidup, Kementerian Perencanaan Pembangunan Nasional/Badan Perencanaan Pembangunan Nasional.
4. **United Nations Environment Programme (UNEP).** (2024). *Food Waste Index Report 2024: Think Eat Save – Tracking Global Food Waste*. Nairobi: UNEP.

---

## AUDIT VALIDASI SITASI

| No | Kalimat / Klaim dalam Naskah | Rujukan Sitasi | Tahun | Status Validitas | Catatan Kredibilitas Sumber |
| :---: | :--- | :--- | :---: | :---: | :--- |
| **1** | Indonesia menghasilkan 23–48 juta ton timbulan sampah makanan per tahun; sektor konsumsi/Horeka menyumbang limbah signifikan. | Kementerian PPN / Bappenas | **2021** | **[VERIFIED]** | Laporan resmi Bappenas RI bersama WRI dan UK Foreign Office. |
| **2** | Limbah makanan di sektor jasa boga (*food service*) menyumbang porsi masif secara global akibat inefisiensi rotasi penyimpanan. | UNEP (*Food Waste Index Report*) | **2024** | **[VERIFIED]** | Laporan resmi PBB (United Nations Environment Programme) edisi terbaru 2024. |
| **3** | Ketiadaan kontrol rotasi FEFO pada kedai kopi menyebabkan penumpukan bahan kedaluwarsa dan kerugian operasional di gudang. | Agil & Triase (*Jurnal Teknologi Sistem Informasi & Aplikasi*) | **2023** | **[VERIFIED]** | Artikel jurnal ilmiah nasional terakreditasi mengenai studi kasus kedai kopi nyata (*Barbekoe Coffee*). |
| **4** | Kewajiban pencantuman dan kepatuhan masa kedaluwarsa pangan olahan demi keselamatan konsumen (*food safety*). | BPOM RI (*Peraturan BPOM No. 20/2021*) | **2021** | **[VERIFIED]** | Lembaran regulasi resmi negara Republik Indonesia terbaru mengenai label pangan olahan. |
