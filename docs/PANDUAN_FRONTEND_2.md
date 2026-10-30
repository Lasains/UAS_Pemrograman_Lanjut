# PANDUAN KERJA KHUSUS: FRONTEND DEVELOPER 2 (FE 2)

**Fokus Utama**: Komponen Form Interaktif, Modal Pop-up (CRUD Master & Restock Batch), Form Pemakaian Bahan dengan Rekomendasi FEFO + Smart Warning Dialog Deviasi, dan Form Pelaporan/Approval Tiket Pemusnahan (*Waste*).

---

## 1. File & Folder Tanggung Jawab Anda
* `resources/js/Pages/Master/IngredientModal.tsx` (Form tambah/edit bahan)
* `resources/js/Pages/Inventory/RestockModal.tsx` (Form tambah batch restock)
* `resources/js/Pages/Usage/CreateUsageModal.tsx` (Form pemakaian harian FEFO)
* `resources/js/Components/SmartWarningDialog.tsx` (Pop-up peringatan deviasi FEFO)
* `resources/js/Pages/Waste/ReportModal.tsx` (Form lapor bahan rusak untuk Barista)
* `resources/js/Pages/Waste/Index.tsx` (Tabel persetujuan tiket waste untuk Supervisor)

---

## 2. Rincian Tugas Bertahap

### 📌 Minggu 1 - 2 (Modal Form Master & Restock Batch)

#### Task 1: Modal Tambah/Edit Master Bahan (`IngredientModal.tsx`)
* Gunakan form Inertia `useForm`:
  * Nama Bahan (Input teks)
  * Kategori (Select dropdown dari data kategori)
  * Satuan/Unit (Select: ml, gram, pcs)
  * Batas Minimum Stok (Input angka)
  * Ambang Hari Warning (Input angka, default 3 hari)
* Tampilkan pesan error validasi di bawah masing-masing input jika ada input yang keliru.

#### Task 2: Modal Penerimaan Batch Baru (`RestockModal.tsx`)
* Form input saat barang baru datang dari pemasok:
  * Pilih Bahan Baku
  * Nomor Batch (opsional, ada keterangan "Kosongkan untuk nomor otomatis")
  * Tanggal Terima (`received_date`, default hari ini)
  * Tanggal Kedaluwarsa (`expiry_date`, date picker dengan validasi `min={today}`)
  * Kuantitas Diterima (`initial_stock`)
  * Harga Beli Satuan (`cost_per_unit`, format input rupiah)

---

### 📌 Minggu 2 (Core FEFO Engine & Smart Warning Dialog)

#### Task 3: Form Pemakaian Bahan Berbasis FEFO (`CreateUsageModal.tsx`)
Ini adalah fitur kunci sistem:
1. Saat barista memilih nama bahan, tampilkan daftar batch aktif yang tersedia.
2. Urutkan dari tanggal kedaluwarsa paling dekat.
3. Batch teratas otomatis diberi tanda `[★ REKOMENDASI FEFO - Prioritas Pakai]` dan **otomatis terpilih secara default**.
4. Barista memasukkan jumlah kuantitas yang digunakan.

#### Task 4: Pop-up Peringatan Deviasi (`SmartWarningDialog.tsx`)
* **Mekanisme Peringatan**:
  * Jika barista sengaja memilih batch lain yang kedaluwarsanya lebih lama daripada batch rekomendasi FEFO:
  * Cegah submit langsung, lalu munculkan modal dialog konfirmasi:
    > *"Perhatian: Terdapat batch dengan masa kedaluwarsa lebih dekat. Apakah Anda yakin ingin menggunakan batch ini?"*
  * Wajibkan barista mengisi kotak teks: **Alasan Deviasi** (contoh: *"Batch lama sudah terlanjur terbuka di chiller bar"*).
  * Setelah alasan diisi dan tombol "Tetap Gunakan" ditekan, kirim data form beserta `is_fefo_compliant: false` dan `deviation_reason`.

---

### 📌 Minggu 3 (Modul Pelaporan & Approval Pemusnahan Bahan Rusak)

#### Task 5: Modal Lapor Bahan Basi/Rusak untuk Barista (`ReportModal.tsx`)
* Input: Pilih batch bahan, kuantitas yang rusak/basi, alasan (misal: "Susu menggumpal", "Kemasan bocor", "Kedaluwarsa").
* Submit ke endpoint pelaporan dengan status awal `pending`.

#### Task 6: Halaman Approval Tiket Waste untuk Supervisor (`Waste/Index.tsx`)
* Menampilkan daftar tiket waste yang berstatus `pending`.
* Tampilkan informasi lengkap: Nama bahan, kode batch, pelapor (barista), kuantitas rusak, dan estimasi kerugian finansial.
* Tombol aksi:
  * Tombol Hijau: **Approve Write-off** (Stok batch dipotong jadi 0).
  * Tombol Abu-abu: **Reject** (Batalkan pelaporan).

---

## 3. Do's and Don'ts untuk FE 2
* ✅ **DO**: Selalu gunakan form helper Inertia (`const { data, setData, post, processing, errors } = useForm(...)`) agar otomatis terhubung dengan validasi Laravel.
* ✅ **DO**: Pastikan tombol submit dinonaktifkan (`disabled={processing}`) saat form sedang dikirim agar tidak terjadi double-submit.
* ❌ **DON'T**: Jangan biarkan barista mengirimkan pemakaian non-FEFO tanpa mengisi alasan deviasi.
