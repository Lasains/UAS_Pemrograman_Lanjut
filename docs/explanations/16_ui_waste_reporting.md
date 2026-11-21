# Penjelasan Modul 16: Pelaporan Bahan Rusak & Pemusnahan (Waste Write-Off)
## Panduan Pemula — Menangani Susu Basi & Bahan Tumpah Secara Akuntabel

> **Untuk Siapa Dokumen Ini**: Tim mahasiswa pemula yang ingin memahami mekanisme pelaporan bahan rusak (*waste disposal*), pencegahan penghapusan data sepihak (*No Hard Delete Rule*), alur persetujuan bertingkat (*Approval Flow*), serta kalkulasi kerugian finansial di kedai kopi.  
> **Analogi Dunia Nyata**: Ketika seorang barista menemukan susu yang sudah menggumpal dan asam di chiller, barista dilarang langsung membuangnya begitu saja tanpa jejak di pembukuan (*shrinkage*). Barista membuat tiket laporan di sistem, supervisor datang memeriksa baunya secara fisik, menyetujui pemusnahan (*write-off*), dan sistem mencatat kerugian rupiahnya ke laporan keuangan pemilik kedai (*Owner*).  
> **Kaitan dengan Kode**: [`resources/js/Pages/Waste/Create.tsx`](../../resources/js/Pages/Waste/Create.tsx) dan [`resources/js/Pages/Waste/Index.tsx`](../../resources/js/Pages/Waste/Index.tsx).

---

## 1. Komponen Utama: `WasteCreate()`

* **Tujuan**: Menyediakan formulir pelaporan bahan tidak layak konsumsi bagi barista (kiri) dan tabel pemantauan status tiket verifikasi supervisor (kanan).
* **Input / Parameter**: Membaca daftar batch aktif yang masih memiliki sisa stok (`AVAILABLE_BATCHES`) dan state form pelaporan limbah.
* **Alur Logika Bisnis (Langkah demi Langkah)**:
  1. Barista memilih batch bahan yang bermasalah (misal: *Fresh Milk Diamond Batch #BCH-20241026-A3F2*).
  2. Sistem menampilkan kartu info mini berisi sisa stok fisik dan tanggal kedaluwarsa batch tersebut.
  3. Barista memasukkan kuantitas yang rusak (misal: 500 ml). Sistem langsung mengunci batas maksimal agar tidak melebihi sisa stok fisik.
  4. Sistem otomatis mengalkulasi **Estimasi Kerugian Finansial Realtime** dalam Rupiah (`financial_loss = waste_quantity * cost_per_unit`).
  5. Barista memilih alasan kerusakan (Kadaluwarsa, Bocor, Bau Asam, atau Tumpah) dan menambahkan catatan kondisi fisik.
  6. Menekan tombol **"Kirim Laporan ke Supervisor"** (Warna amber hangat `#C88242`). Tiket otomatis berstatus `Pending Review`.
* **Output / Return Value**: Tampilan formulir tiket pemusnahan bahan di dalam kerangka `AuthenticatedLayout`.
* **Kaitan dengan Bagian Lain**: Data tiket ini tersimpan ke tabel `waste_logs` dengan status awal `pending` untuk kemudian di-approve di modul Supervisor.

---

## 2. Logika Bisnis: Aturan Dilarang Hard Delete (*No Hard Delete Rule*)

* **Tujuan**: Menjaga integritas pembukuan akuntansi dan audit audit stok kafe.
* **Aturan Bisnis (Sesuai PRD Bab 4 & AGENTS.md Bagian 4.4)**:
  1. Barista atau supervisor **DILARANG MENGHAPUS** baris data stok yang basi dari database (`DELETE FROM ingredient_batches`).
  2. Jika data dihapus secara fisik, riwayat pembelian supplier dan jejak keuangan akan hilang, sehingga owner tidak bisa mengetahui berapa rupiah modal yang hangus.
  3. Alur yang benar: Barista membuat tiket -> Supervisor menyetujui -> Sistem memotong `current_stock` batch menjadi `0`, lalu mencatat nominal kerugian ke tabel `waste_logs`.
* **Kaitan dengan Bagian Lain**: Tabel `waste_logs` dan `ingredient_batches` di database MySQL.

---

## 3. Logika Bisnis: Estimasi Beban Kerugian Finansial Realtime

* **Tujuan**: Memberikan kesadaran biaya (*cost awareness*) kepada barista tentang nilai rupiah dari bahan yang rusak sebelum tiket dikirimkan.
* **Perhitungan Rumus**:
  $$\text{Estimasi Kerugian (Rp)} = \frac{\text{Kuantitas Rusak}}{\text{Satuan Konversi}} \times \text{Harga Beli per Satuan}$$
  * *Contoh*: Susu rusak 500 ml dari batch dengan harga beli Rp 18.500 per liter (1.000 ml).
  * $\text{Kerugian} = \frac{500}{1000} \times 18.500 = \text{Rp } 9.250$.
* **Kaitan dengan Bagian Lain**: Tampilan estimasi langsung diperbarui saat barista mengubah angka kuantitas di formulir.

---

## 4. Fungsi: `submit(e)` & Validasi Kuantitas

* **Tujuan**: Mencegah pengiriman laporan dengan kuantitas fiktif yang melebihi sisa saldo fisik batch.
* **Input / Parameter**:
  * `e: FormEventHandler`: Objek *submit event*.
* **Alur Logika Bisnis (Langkah demi Langkah)**:
  1. Komputer memeriksa apakah `data.waste_quantity > selectedBatch.currentStock`.
  2. Jika melebihi saldo: Sistem memunculkan alert peringatan dan menolak pengiriman formulir.
  3. Jika valid: Menghasilkan kode tiket baru (`TKT-WO-XXXXXX`), memasukkannya ke dalam tabel riwayat kanan dengan status `pending`, dan mengosongkan form.
* **Output / Return Value**: Mengirimkan request tiket pelaporan ke controller `WasteDisposalController.php`.
* **Kaitan dengan Bagian Lain**: Muncul di *Approval Center* pada modul Supervisor.
