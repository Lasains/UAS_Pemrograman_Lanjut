# PANDUAN KERJA KHUSUS: FRONTEND DEVELOPER 2 (FE 2)

> **Peran**: Frontend Developer 2 (Interactive Modals, FEFO Engine & Waste Approval Specialist)  
> **Tingkat Tim**: Pemula (Beginner-Friendly Environment)  
> **Fokus Utama**: Perancangan Mockup Modal & Form Interaktif di Google Stitch, Dasbor Operasional Barista, Form Pemakaian Stok Berbasis FEFO, Dialog Konfirmasi Deviasi FEFO (`SmartWarningDialog`), Form Master Data Bahan & Restock Batch, serta Modul Pelaporan & Approval Pemusnahan Bahan Rusak (*Waste Write-Off Center*).  
> **Rujukan Dokumen Rencana**: `docs/Plan Frontend/PLAN_03`, `PLAN_04`, dan `PLAN_06`

---

## 1. File & Folder Tanggung Jawab Anda
* `docs/Plan Frontend/PLAN_03_BARISTA_OPERASIONAL_FEFO.md` (Spesifikasi Operasional Barista & FEFO)
* `docs/Plan Frontend/PLAN_04_SUPERVISOR_MASTER_DATA.md` (Spesifikasi Master Bahan & Restock)
* `docs/Plan Frontend/PLAN_06_WASTE_APPROVAL_CENTER.md` (Spesifikasi Pelaporan & Approval Limbah)
* `resources/js/Pages/Barista/Dashboard.tsx` (Dasbor Operasional Cepat Barista)
* `resources/js/Pages/Usage/CreateUsageModal.tsx` & `resources/js/Components/SmartWarningDialog.tsx` (Form Pemakaian FEFO & Dialog Deviasi)
* `resources/js/Pages/Master/IngredientsIndex.tsx` & `resources/js/Pages/Master/IngredientModal.tsx` (Katalog & Modal Tambah/Edit Master Bahan)
* `resources/js/Pages/Inventory/RestockModal.tsx` (Modal Form Penerimaan Barang Masuk)
* `resources/js/Pages/Waste/ReportModal.tsx` & `resources/js/Pages/Waste/Index.tsx` & `resources/js/Components/WasteApprovalDialog.tsx` (Pusat Pelaporan & Approval Limbah Rusak)

---

## 2. Alur Integrasi Desain: Google Stitch ke AI Coding Agent

Sebagai developer frontend pemula, Anda **tidak perlu menyusun form dan modal rumit secara manual**. Gunakan alur kerja modern berbasis kecerdasan buatan (AI):

```
[Prompt di PLAN_XX.md] ──> [Google Stitch (Buat Layar)] ──> [AI Coding Assistant] ──> [Modal & State React]
```

1. **Tahap Mockup (Minggu 1)**: Ambil prompt dari dokumen spesifikasi di `docs/Plan Frontend/` dan jalankan di **Google Stitch** untuk menghasilkan purwarupa visual form dan modal dialog.
2. **Tahap Konversi ke Kode (Minggu 2 & 3)**: Berikan instruksi ke AI Coding Assistant:
   > *"Tolong terapkan hasil layar Stitch [nama/link/ID layar] ke file `resources/js/Pages/[TargetFile.tsx]` sesuai spesifikasi teknis di `docs/Plan Frontend/[PLAN_FILE.md]`."*
3. **Hasil Otomatis**: AI akan merangkai visual modal dengan helper `useForm` dari `@inertiajs/react`, validasi error per-kolom, dan tombol pencegah submit ganda (*double-submit*).

---

## 3. Rincian Tugas Bertahap Mingguan

### 📌 MINGGU 1: Perancangan Mockup Visual Form & Dialog (Google Stitch)
> **Tujuan Minggu 1**: Menyelesaikan seluruh purwarupa visual modal dan dialog tanggung jawab FE 2 di Google Stitch sebelum menulis logika state React.

#### Task 1: Mockup Dasbor Barista & Pemakaian Stok FEFO (Rujukan: `PLAN_03_BARISTA_OPERASIONAL_FEFO.md`)
* Salin prompt dari **Bab 2.4** di `PLAN_03` ke Google Stitch.
* Pastikan mockup menampilkan:
  * Dasbor Barista dengan tombol cepat: *Catat Pemakaian*, *Terima Restock*, *Lapor Rusak*.
  * Modal Pemakaian: Menampilkan daftar batch fisik yang diurutkan kronologis tanggal kedaluwarsa terdekat, serta tanda khusus `[★ REKOMENDASI FEFO - Prioritas Pakai]` pada batch teratas.

#### Task 2: Mockup Smart Warning Dialog Deviasi FEFO (Rujukan: `PLAN_03_BARISTA_OPERASIONAL_FEFO.md`)
* Salin prompt dialog deviasi dari `PLAN_03` ke Google Stitch.
* Pastikan mockup menampilkan pop-up dialog peringatan beraksen warna kuning amber yang muncul saat barista memilih batch bukan rekomendasi pertama, dilengkapi kolom teks wajib: **Alasan Deviasi**.

#### Task 3: Mockup Master Bahan & Form Restock Batch (Rujukan: `PLAN_04_SUPERVISOR_MASTER_DATA.md`)
* Salin prompt dari `PLAN_04` ke Google Stitch.
* Buat 2 mockup:
  1. Modal Tambah/Edit Bahan: Input nama bahan, kategori dropdown, satuan (`ml`/`gram`/`pcs`), ambang batas minimum stok, dan hari peringatan kedaluwarsa.
  2. Modal Penerimaan Barang Masuk (Restock): Pilih bahan, nomor batch otomatis, tanggal kedaluwarsa, jumlah diterima, dan harga beli per unit.

#### Task 4: Mockup Pelaporan Waste & Approval Center (Rujukan: `PLAN_06_WASTE_APPROVAL_CENTER.md`)
* Salin prompt dari `PLAN_06` ke Google Stitch.
* Buat 2 mockup:
  1. Modal Barista: Input lapor bahan rusak/basi (pilih batch, masukkan jumlah rusak, dan alasan kerusakan).
  2. Tabel Supervisor: Antrean tiket bahan rusak berstatus pending dengan kartu ringkasan estimasi nilai kerugian rupiah serta tombol *Approve* (hijau) dan *Reject* (merah).

---

### 📌 MINGGU 2: Form Master Bahan, Form Restock & Mesin Antarmuka FEFO

#### Task 5: Modal Tambah/Edit Master Bahan (`IngredientModal.tsx`)
* Buat form menggunakan helper Inertia `useForm`:
  * Nama bahan, kategori (dropdown select), satuan (pilihan radio: `ml`, `gram`, `pcs`).
  * Batas stok minimum dan ambang peringatan hari kedaluwarsa (`warning_days`).
  * Tampilkan pesan error validasi di bawah setiap input jika validasi backend gagal.

#### Task 6: Modal Penerimaan Batch Barang Masuk (`RestockModal.tsx`)
* Form input saat stok baru tiba dari pemasok:
  * Pilihan bahan baku, nomor batch (dapat diisi manual atau dibiarkan kosong untuk auto-generate backend).
  * Tanggal terima barang dan tanggal kedaluwarsa (pasang atribut `min={hari_ini}` agar tidak bisa memilih tanggal lampau).
  * Kuantitas awal dan harga beli satuan (`cost_per_unit`).

#### Task 7: Dasbor Barista & Form Pemakaian Stok FEFO (`Barista/Dashboard.tsx` & `CreateUsageModal.tsx`)
* Bangun layar operasional cepat untuk barista di bar minuman.
* Alur Pemakaian Bahan Berbasis FEFO:
  1. Saat barista memilih bahan, ambil daftar batch aktif bahan tersebut dari backend.
  2. Urutkan batch dari tanggal kedaluwarsa terdekat.
  3. Batch paling atas otomatis terpilih secara default dan diberi badge `[★ REKOMENDASI FEFO]`.
  4. Barista memasukkan jumlah kuantitas yang dipakai.

#### Task 8: Pop-up Peringatan Deviasi FEFO (`SmartWarningDialog.tsx`)
* **Mekanisme Cerdas (Smart Warning)**:
  * Jika barista mengganti pilihan ke batch yang tanggal kedaluwarsanya lebih lama daripada rekomendasi FEFO teratas:
  * Tahan pengiriman form, tampilkan pop-up dialog `SmartWarningDialog`:  
    *"Peringatan: Anda memilih batch yang kedaluwarsanya lebih lama daripada stok terlama. Yakin ingin menggunakan batch ini?"*
  * Wajibkan barista mengetik di kotak input: **Alasan Deviasi** (contoh: *"Kemasan lama sudah terlanjur dibuka di area bar"*).
  * Kirim payload data ke backend dengan flag `is_fefo_compliant: false` dan string `deviation_reason`.

---

### 📌 MINGGU 3: Modul Pelaporan & Approval Pemusnahan Limbah Rusak

#### Task 9: Modal Lapor Bahan Basi/Rusak untuk Barista (`ReportModal.tsx`)
* Barista memilih batch bahan yang rusak (misal: susu basi/menggumpal, sirup pecah).
* Mengisi kuantitas yang rusak dan alasan kerusakan.
* Form mengirim data dengan status awal `'pending'` ke endpoint `POST /waste-logs`.

#### Task 10: Halaman Approval Tiket Limbah untuk Supervisor (`Waste/Index.tsx` & `WasteApprovalDialog.tsx`)
* Menampilkan daftar antrean tiket limbah yang masih berstatus `'pending'`.
* Menampilkan kartu rincian tiket: Nama bahan, kode batch, nama barista pelapor, kuantitas rusak, dan estimasi nilai kerugian modal rupiah.
* Dialog Konfirmasi Persetujuan (`WasteApprovalDialog`):
  * Supervisor klik tombol **Setujui Pemusnahan (Approve Write-Off)**:
    * Kirim permintaan ke `POST /waste-logs/{id}/approve`.
    * Tampilkan notifikasi berhasil: *"Stok batch berhasil dipotong dan kerugian tercatat di laporan keuangan"*.
  * Tombol **Tolak (Reject)**:
    * Batalkan tiket dengan alasan penolakan, stok batch fisik tidak dipotong.

---

### 📌 MINGGU 4: Validasi Error Form, Pengujian Loading & Demo UAS
* Pastikan seluruh tombol submit menerapkan atribut `disabled={processing}` dan menampilkan animasi indikator proses (*spinner*) untuk mencegah submit ganda.
* Uji kasus ekstrim:
  * Menginput angka negatif atau kuantitas pemakaian melebihi stok yang tersedia.
  * Mengirim form deviasi tanpa mengisi alasan (harus diblokir oleh dialog).
* Gladi bersih demonstrasi alur pemakaian FEFO dan alur approval waste bersama dosen penguji.

---

## 4. Do's and Don'ts untuk FE 2
* ✅ **DO**: Selalu gunakan helper `useForm` dari `@inertiajs/react` untuk seluruh interaksi form:
  `const { data, setData, post, processing, errors, reset } = useForm({...})`.
* ✅ **DO**: Hormati kontrak nama atribut di `resources/js/types/inventory.d.ts` (misal: `deviation_reason`, `waste_quantity`).
* ✅ **DO**: Tuliskan dokumentasi komponen modal yang Anda buat di folder `docs/explanations/`.
* ❌ **DON'T**: Jangan pernah mengizinkan tombol simpan/submit aktif saat status form sedang `processing`.
