# Penjelasan Modul 14: Pencatatan Pemakaian Bahan & Smart Warning Deviasi FEFO
## Panduan Pemula — Menghabiskan Susu Sesuai Urutan Kedaluwarsa

> **Untuk Siapa Dokumen Ini**: Tim mahasiswa pemula yang ingin memahami cara kerja antarmuka pemakaian bahan baku kafe, algoritma penyortiran batch FEFO (*First Expired, First Out*), serta logika peringatan deviasi (*Smart Warning*) jika barista mengambil bahan yang bukan prioritas utama.  
> **Analogi Dunia Nyata**: Bayangkan kulkas (*chiller*) di bawah mesin espresso. Di baris depan ada karton susu yang kedaluwarsa besok lusa, sementara di rak belakang ada susu yang baru datang kemarin sore. SOP kafe mewajibkan menghabiskan susu yang di depan dulu. Jika barista nekat mengambil susu rak belakang (karena alasan karton sudah terlanjur terbuka), sistem langsung meminta penjelasan: *"Mengapa tidak pakai yang terdekat?"*.  
> **Kaitan dengan Kode**: [`resources/js/Pages/Usage/Index.tsx`](../../resources/js/Pages/Usage/Index.tsx) dan [`resources/js/Pages/Usage/Create.tsx`](../../resources/js/Pages/Usage/Create.tsx).

---

## 1. Komponen Utama: `UsageIndex()`

* **Tujuan**: Menyediakan ruang kerja 2-kolom (*Split Workspace*) bagi barista: 60% formulir pengurangan stok FEFO di sisi kiri, dan 40% aliran riwayat transaksi (*live history stream*) di sisi kanan.
* **Input / Parameter**: Membaca data bahan aktif (`DEMO_INGREDIENTS`), batch terurut (`DEMO_BATCHES`), dan state form pemakaian.
* **Alur Logika Bisnis (Langkah demi Langkah)**:
  1. Barista memilih bahan baku yang akan dipakai (Fresh Milk, Oatside, Espresso Beans, atau Sirup Karamel).
  2. Komputer menampilkan seluruh batch aktif bahan tersebut yang diurutkan kronologis tanggal kedaluwarsa terdekat (`expiry_date ASC`).
  3. Batch paling atas (#0) otomatis diberi lencana hitam espresso: `[★ REKOMENDASI FEFO]` dan terpilih secara default.
  4. Barista memasukkan jumlah kuantitas pemakaian (bisa mengetik langsung atau menekan tombol cepat *Quick Chips* 150, 250, 500, atau 1.000 ml).
  5. Barista menekan tombol **"Simpan Pemakaian Bahan"**. Data tercatat dan langsung muncul di kolom riwayat kanan.
* **Output / Return Value**: Antarmuka formulir interaktif di dalam kerangka `AuthenticatedLayout`.
* **Kaitan dengan Bagian Lain**: Terhubung dengan tabel database `stock_usages` dan pemotongan kolom `current_stock` pada tabel `ingredient_batches`.

---

## 2. Fungsi: `handleSelectBatch(batch)`

* **Tujuan**: Memeriksa apakah batch yang dipilih barista adalah batch rekomendasi FEFO atau merupakan batch yang lebih baru (deviasi).
* **Input / Parameter**:
  * `batch: MockBatch`: Objek batch yang diklik oleh barista.
* **Alur Logika Bisnis (Langkah demi Langkah)**:
  1. Komputer mengecek ID batch yang diklik terhadap ID batch teratas (`topBatch.id`).
  2. Jika `batch.id === topBatch.id` (Normal / Patuh FEFO):
     - Variabel `isDeviating` bernilai `false`.
     - Kotak peringatan deviasi disembunyikan.
     - State form mencatat `is_fefo_compliant = true` dan `deviation_reason = ''`.
  3. Jika `batch.id !== topBatch.id` (Deviasi):
     - Variabel `isDeviating` bernilai `true`.
     - Kotak peringatan amber (`#FFF7ED`) otomatis terbuka di layar.
     - State form mencatat `is_fefo_compliant = false` dan mewajibkan barista mengisi alasan.
* **Output / Return Value**: Memperbarui state pilihan batch di form pemakaian.
* **Kaitan dengan Bagian Lain**: Memicu munculnya komponen kotak peringatan deviasi di formulir.

---

## 3. Fungsi: `handleQuickQty(qty)`

* **Tujuan**: Tombol sentuh cepat (*Quick Chips*) agar barista tidak perlu mengetik angka manual saat membuat resep minuman standar.
* **Input / Parameter**:
  * `qty: number`: Angka takaran (misal: `150` untuk Picolo/Flat White, `250` untuk Caffe Latte, `500` untuk Pitcher Besar).
* **Alur Logika Bisnis (Langkah demi Langkah)**:
  1. Komputer mengisi kolom `quantity_used` dengan nilai `qty`.
  2. Otomatis menghitung sisa stok setelah pemakaian: `current_stock - quantity_used`.
* **Output / Return Value**: Memperbarui nilai input jumlah pemakaian.
* **Kaitan dengan Bagian Lain**: Input kuantitas pada formulir.

---

## 4. Fungsi: `submit(e)` & Validasi Deviasi Smart Warning

* **Tujuan**: Memvalidasi seluruh masukan data sebelum dikirimkan ke server.
* **Input / Parameter**:
  * `e: FormEventHandler`: Objek *submit event*.
* **Alur Logika Bisnis (Langkah demi Langkah)**:
  1. Komputer mengecek apakah terjadi deviasi (`isDeviating === true`).
  2. Jika terjadi deviasi namun alasan (`deviation_reason`) kosong atau kurang dari 5 karakter:
     - Sistem membatalkan pengiriman formulir (*early return*).
     - Memunculkan peringatan bahwa alasan deviasi wajib diisi sesuai SOP kafe.
  3. Jika data valid:
     - Membuat objek catatan transaksi baru.
     - Menambahkan catatan ke dalam riwayat lokal (*live history*) di kolom kanan.
     - Menampilkan banner hijau sukses: *"Pemakaian 250 ml berhasil dicatat!"*.
* **Output / Return Value**: Mengirim data transaksi pemakaian ke backend Laravel via Inertia.
* **Kaitan dengan Bagian Lain**: Ditangani oleh `StockUsageFefoController.php` di backend.
