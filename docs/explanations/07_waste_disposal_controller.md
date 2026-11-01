# Penjelasan Modul 07: WasteLogController & Approval Workflow
## Panduan Pemula — Sistem Inventaris Kafe

> **Untuk Siapa**: Tim mahasiswa pengembang yang ingin memahami cara kerja sistem persetujuan dua tahap (*two-tier approval workflow*), pencatatan kerugian uang kafe, dan perlindungan audit trail.  
> **Pendekatan**: Analogi berita acara pemusnahan barang rusak di dapur kafe.  
> **Kaitan dengan Kode**: [`docs/Plan Backend/PLAN_07_WASTE_DISPOSAL_CONTROLLER.md`](../Plan%20Backend/PLAN_07_WASTE_DISPOSAL_CONTROLLER.md)

---

## Konsep Dasar: "Mengapa Barista Tidak Boleh Langsung Membuang Susu Basi?"

Bayangkan skenario berikut di kafe:
> *Seorang barista menemukan 2 botol susu yang baunya sudah asam dan menggumpal. Jika barista langsung membuangnya begitu saja ke tempat sampah tanpa persetujuan, apa yang terjadi?*
> 1. Stok di komputer masih mencatat ada 2 botol susu (asimetri data dengan barang fisik).
> 2. Pemilik kafe (*Owner*) heran mengapa uang modal beli susu hilang tanpa hasil penjualan.
> 3. Timbul celah kecurangan: karyawan nakal bisa saja mengaku "susunya basi" padahal susunya dibawa pulang.

Untuk mencegah masalah ini, kafe menerapkan **Sistem Berita Acara Pemusnahan (Waste Write-Off)**:
1. **Barista melapor**: Buat tiket "Saya menemukan susu basi" (status: *Pending*).
2. **Supervisor memeriksa**: Datang ke kulkas, cium baunya, dan periksa fisiknya.
3. **Supervisor menyetujui**: Menekan tombol **Approve**. Pada detik itulah sistem memotong stok dan menghitung nominal rupiah kerugian modal kafe.

---

## Penjelasan Per-Komponen & Per-Fungsi

---

### Komponen 1: Form Request `StoreWasteLogRequest`

Form Request ini bertindak sebagai **"Pemeriksa Berkas Laporan"**. Sebelum laporan bahan rusak dicatat, sistem memeriksa apakah barang yang dilaporkan masuk akal.

---

#### Fungsi: `rules()`
* **Tujuan**: Memastikan data input laporan lengkap dan memiliki format yang valid.
* **Input / Parameter**:
  * `ingredient_batch_id`: Nomor identitas batch bahan yang rusak.
  * `waste_quantity`: Jumlah bahan yang rusak.
  * `reason`: Alasan kerusakan.
* **Alur Logika Bisnis (Langkah demi Langkah)**:
  1. Memeriksa apakah batch yang dipilih ada di tabel database (`exists`).
  2. Memeriksa kuantitas minimal 0.01 dan berupa angka.
  3. Memastikan alasan pemusnahan diisi minimal 5 karakter (contoh: "Susu berbau asam dan menggumpal") agar supervisor tahu masalahnya.
* **Output / Return Value**: Aturan validasi Laravel.
* **Kaitan dengan Bagian Lain**: Melindungi Controller dari input form yang tidak valid atau kosong.

---

#### Fungsi: `withValidator($validator)`
* **Tujuan**: Melakukan verifikasi fisik ke database sebelum laporan diterima.
* **Input / Parameter**: Objek validator Laravel aktif.
* **Alur Logika Bisnis (Langkah demi Langkah)**:
  1. Mengambil data batch dari database.
  2. Mengecek status batch: jika batch sudah berstatus `disposed` (sudah dibuang) atau `exhausted` (stoknya memang sudah nol), tolak laporan.
  3. Mengecek jumlah: jika barista lapor membuang 5 Liter susu padahal di sistem sisa botol itu cuma 2 Liter, tolak laporan karena tidak mungkin membuang lebih banyak dari yang tersedia.
* **Output / Return Value**: Menambahkan pesan error spesifik jika ditemukan kejanggalan.
* **Kaitan dengan Bagian Lain**: Mencegah stok menjadi angka negatif di kemudian hari.

---

### Komponen 2: Controller `WasteLogController`

Controller ini adalah **"Manajer Alur Berita Acara"** yang menangani pembuatan tiket, antrean verifikasi, hingga eksekusi persetujuan.

---

#### Fungsi: `index(Request $request)`
* **Tujuan**: Menampilkan daftar seluruh tiket laporan pemusnahan barang bagi Supervisor dan Owner.
* **Input / Parameter**: HTTP Request dengan filter opsional (status pending/approved/rejected, filter bahan, dan rentang tanggal).
* **Alur Logika Bisnis (Langkah demi Langkah)**:
  1. Menyiapkan kueri data waste logs lengkap dengan nama bahan, nama barista yang melapor, dan nama supervisor yang menyetujui.
  2. Menghitung jumlah tiket yang masih berstatus `pending` (untuk badge merah notifikasi di dashboard supervisor).
  3. Menghitung total kerugian finansial bulan ini (khusus tiket yang sudah `approved`) untuk laporan Owner.
  4. Membagi data menjadi 15 baris per halaman (*pagination*).
* **Output / Return Value**: Merender tampilan Inertia `WasteLogs/Index`.
* **Kaitan dengan Bagian Lain**: Dashboard utama Supervisor untuk melihat tugas pemeriksaan fisik yang belum diselesaikan.

---

#### Fungsi: `create()`
* **Tujuan**: Menampilkan formulir bagi Barista untuk melaporkan bahan rusak.
* **Input / Parameter**: Tidak ada.
* **Alur Logika Bisnis (Langkah demi Langkah)**:
  1. Mencari semua batch bahan baku di rak/kulkas yang statusnya masih `active` atau `expired` dan masih ada sisa stoknya (`current_stock > 0`).
  2. Melampirkan informasi sisa hari kedaluwarsa dan warna lampu peringatan (*traffic light*).
* **Output / Return Value**: Merender formulir Inertia `WasteLogs/Create` berisi dropdown batch yang bisa dipilih.
* **Kaitan dengan Bagian Lain**: Digunakan oleh Barista saat menemukan bahan yang tidak layak konsumsi di area bar.

---

#### Fungsi: `store(StoreWasteLogRequest $request)`
* **Tujuan**: Menerbitkan tiket laporan pemusnahan baru dengan status awal `pending`.
* **Input / Parameter**: Data laporan tervalidasi dari `StoreWasteLogRequest`.
* **Alur Logika Bisnis (Langkah demi Langkah)**:
  1. Mengambil identitas barista yang sedang login (`Auth::id()`).
  2. Menyimpan baris baru di tabel `waste_logs` dengan status `'pending'`.
  3. Kolom `approved_by` dan `financial_loss` sengaja **dibiarkan kosong (null)** karena barang belum dicek dan belum disetujui.
  4. Stok batch fisik **belum dipotong** pada tahap ini.
* **Output / Return Value**: Mengarahkan kembali pengguna ke halaman riwayat dengan notifikasi sukses pembuatan tiket.
* **Kaitan dengan Bagian Lain**: Menambahkan 1 antrean baru yang akan muncul di layar Supervisor.

---

#### Fungsi: `approve(Request $request, WasteLog $wasteLog)`
* **Tujuan**: Menyetujui pemusnahan barang setelah supervisor memeriksa fisik bahan secara nyata.
* **Input / Parameter**: Tiket `WasteLog` yang ingin disetujui.
* **Alur Logika Bisnis (Langkah demi Langkah)**:
  1. **Pengecekan Izin (`$this->authorize`)**: Memastikan yang menekan tombol adalah Supervisor dan menerapkan prinsip empat mata (*Supervisor tidak boleh menyetujui tiket buatannya sendiri*).
  2. **Buka Transaksi Database (`DB::transaction`)**:
     * Kunci baris data batch (`lockForUpdate`) agar tidak ada kasir lain yang memakai bahan ini saat sedang diproses.
     * Potong stok batch di gudang: `stok_baru = stok_lama - jumlah_dibuang`.
     * Jika stoknya menjadi nol, tandai status batch menjadi `'disposed'`.
     * **Hitung Uang Modal yang Hangus**:
       $$\text{Kerugian} = \text{Jumlah Dibuang} \times \text{Harga Beli per Unit}$$
     * Perbarui tiket pemusnahan: status diubah jadi `'approved'`, catat ID supervisor yang menyetujui, dan simpan nominal kerugian rupiahnya.
* **Output / Return Value**: Redirect ke daftar tiket dengan pesan informasi nominal rupiah kerugian yang tercatat.
* **Kaitan dengan Bagian Lain**: Memperbarui laporan keuangan Owner secara otomatis dan mengurangi stok di tabel inventaris.

---

#### Fungsi: `reject(Request $request, WasteLog $wasteLog)`
* **Tujuan**: Menolak laporan pemusnahan jika hasil pemeriksaan fisik membuktikan bahan ternyata masih bagus atau laporannya keliru.
* **Input / Parameter**: Tiket `WasteLog` yang ingin ditolak.
* **Alur Logika Bisnis (Langkah demi Langkah)**:
  1. Memeriksa izin hak akses Supervisor.
  2. Mengubah status tiket menjadi `'rejected'` dan mencatat siapa supervisor yang menolak.
  3. **Stok batch tidak dipotong** dan nilai kerugian finansial tetap bernilai `null`.
* **Output / Return Value**: Redirect ke daftar tiket dengan notifikasi penolakan.
* **Kaitan dengan Bagian Lain**: Tiket tetap tersimpan selamanya di database (tidak dihapus) sebagai rekam jejak audit internal kafe.

---

## Rangkuman Siklus Tiket Pemusnahan

```
[Pagi Hari]
Barista Dini menemukan susu menggumpal
└── Klik "Lapor Bahan Rusak" -> Isi 2 Botol Susu Diamond
└── Tiket #1 Terbit (Status: PENDING, Stok Fisik Belum Berkurang)

[Siang Hari]
Supervisor Sari datang ke chiller untuk memeriksa fisik
├── Opsi A (Setuju):
│   └── Sari klik "Approve"
│   └── Stok Susu Diamond di sistem berkurang 2 botol
│   └── Tercatat kerugian modal: 2 botol x Rp18.500 = Rp37.000
│   └── Tiket #1 berstatus APPROVED
│
└── Opsi B (Tolak):
    └── Susu ternyata cuma dingin beku (bukan basi), Sari klik "Reject"
    └── Stok tidak berubah sama sekali
    └── Tiket #1 berstatus REJECTED
```

---

*Dokumen ini merupakan penjelasan ramah pemula pendamping spesifikasi teknis di [`PLAN_07_WASTE_DISPOSAL_CONTROLLER.md`](../Plan%20Backend/PLAN_07_WASTE_DISPOSAL_CONTROLLER.md).*
