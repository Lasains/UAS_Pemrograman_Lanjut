# Penjelasan Modul 15: Penerimaan Batch Baru (Restock Multi-Batch)
## Panduan Pemula — Menata Kiriman Bahan dari Pemasok

> **Untuk Siapa Dokumen Ini**: Tim mahasiswa pemula yang ingin memahami cara mencatat penerimaan stok bahan baku kafe (*restock*), pembuatan kode batch unik otomatis, validasi tanggal kedaluwarsa terhadap tanggal terima, serta perhitungan nilai aset finansial masuk.  
> **Analogi Dunia Nyata**: Bayangkan mobil pikap pemasok susu (*supplier*) tiba di depan kafe. Barista atau supervisor menerima 10 karton susu baru. Mereka harus mengecek tanggal kedaluwarsa di tutup karton, memberi label nomor batch, mencatat harga belinya, lalu menaruhnya di chiller cadangan agar nantinya dipotong rapi menggunakan aturan FEFO.  
> **Kaitan dengan Kode**: [`resources/js/Pages/Batches/Create.tsx`](../../resources/js/Pages/Batches/Create.tsx) dan [`resources/js/Pages/Batches/Index.tsx`](../../resources/js/Pages/Batches/Index.tsx).

---

## 1. Komponen Utama: `BatchesCreate()`

* **Tujuan**: Menyediakan formulir input stok multi-batch baru yang diterima dari supplier lengkap dengan nomor faktur, estimasi umur simpan, kuantitas satuan, harga beli, dan lokasi fisik penempatan di kafe.
* **Input / Parameter**: Membaca katalog bahan master (`INGREDIENTS_CATALOG`) dan state formulir `useForm` dari `@inertiajs/react`.
* **Alur Logika Bisnis (Langkah demi Langkah)**:
  1. Komputer menyiapkan formulir dengan kode batch acak unik default (`generateBatchCode()`), tanggal terima hari ini, dan tanggal kedaluwarsa sesuai standar masa simpan bahan terpilih.
  2. Barista/Supervisor memilih bahan baku (Fresh Milk, Oatside, Espresso Blend, atau Sirup Karamel).
  3. Sistem otomatis mengalkulasi selisih hari (`diffDays`) antara tanggal terima dan tanggal kedaluwarsa, lalu menampilkan lencana hijau (*Aman*), kuning (*Warning*), atau merah (*Kritis*).
  4. Barista memasukkan jumlah kuantitas fisik dan harga beli satuan (Rp).
  5. Saat formulir dikirim, sistem memvalidasi bahwa tanggal kedaluwarsa tidak boleh lebih lampau atau sama dengan tanggal terima.
* **Output / Return Value**: Antarmuka input batch baru dan panel ringkasan total nilai aset masuk di kolom kanan.
* **Kaitan dengan Bagian Lain**: Data ini disimpan ke tabel database `ingredient_batches` dan otomatis menambah saldo stok total di tabel `ingredients`.

---

## 2. Fungsi: `generateBatchCode()` & `handleAutoGenerateCode()`

* **Tujuan**: Menghasilkan kode batch unik berstandar kafe (*BCH-YYYYMMDD-XXXX*) jika kemasan supplier tidak memiliki nomor lot yang jelas atau jika barista ingin kode seragam.
* **Input / Parameter**: Tidak menerima input; membaca tanggal komputer saat ini dan menghasilkan string acak 4 karakter heksadesimal.
* **Alur Logika Bisnis (Langkah demi Langkah)**:
  1. Komputer mengambil tanggal hari ini dan menghapus tanda hubung (misal: `20241026`).
  2. Komputer mengacak 4 karakter huruf kapital (misal: `A3F2`).
  3. Menggabungkan string menjadi: `BCH-20241026-A3F2`.
* **Output / Return Value**: String kode batch baru yang rapi dan terstandarisasi.
* **Kaitan dengan Bagian Lain**: Kolom `batch_code` pada tabel `ingredient_batches`.

---

## 3. Fungsi: `calculateDefaultExpiry(days)` & `handleIngredientChange(ingredient)`

* **Tujuan**: Mengisi perkiraan tanggal kedaluwarsa secara otomatis berdasarkan karakteristik masa simpan alami tiap bahan (misal: Susu segar ~14 hari, Biji kopi sangrai ~45 hari, Sirup botolan ~180 hari).
* **Input / Parameter**:
  * `days: number`: Jumlah hari masa simpan standar bahan baku.
* **Alur Logika Bisnis (Langkah demi Langkah)**:
  1. Komputer mengambil tanggal hari ini.
  2. Menambahkan sejumlah `days` ke tanggal tersebut.
  3. Mengubahnya ke format tanggal HTML input (`YYYY-MM-DD`).
* **Output / Return Value**: String tanggal masa simpan yang sudah terisi otomatis di formulir.
* **Kaitan dengan Bagian Lain**: Mengurangi beban barista mengetik tanggal secara manual saat menerima barang dalam jumlah banyak.

---

## 4. Fungsi: `submit(e)` & Validasi Tanggal Kedaluwarsa

* **Tujuan**: Mencegah kesalahan manusia (*human error*) di mana tanggal kedaluwarsa dimasukkan lebih lampau daripada hari barang diterima.
* **Input / Parameter**:
  * `e: FormEventHandler`: Objek *submit event*.
* **Alur Logika Bisnis (Langkah demi Langkah)**:
  1. Komputer membandingkan `expiry_date` dengan `received_date`.
  2. Jika `expiry_date <= received_date`: Sistem langsung menghentikan pengiriman formulir dan memunculkan peringatan dialog.
  3. Jika valid: Menghitung total nilai pembelian (`quantity * cost_per_unit`), mencatat batch ke riwayat lokal, dan menampilkan notifikasi sukses hijau.
* **Output / Return Value**: Mengirimkan data penerimaan batch ke controller backend `BatchRestockController.php`.
* **Kaitan dengan Bagian Lain**: Terhubung dengan transaksi database (`DB::transaction`) di backend Laravel.
