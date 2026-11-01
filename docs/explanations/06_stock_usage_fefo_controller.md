# Penjelasan Modul 06: StockUsageController & Algoritma FEFO
## Panduan Pemula — Sistem Inventaris Kafe

> **Untuk Siapa**: Tim mahasiswa pengembang pemula yang ingin memahami cara kerja algoritma FEFO (*First Expired, First Out*), proteksi stok minus, dan pencatatan deviasi operasional bar.  
> **Pendekatan**: Analogi nyata aktivitas barista di meja bar (*espresso bar*) dan gudang chiller.  
> **Kaitan dengan Kode**: [`docs/Plan Backend/PLAN_06_STOCK_USAGE_FEFO_CONTROLLER.md`](../Plan%20Backend/PLAN_06_STOCK_USAGE_FEFO_CONTROLLER.md)

---

## Konsep Dasar: "Mengapa Perlu Algoritma FEFO?"

Bayangkan di kulkas kafe (*chiller*) ada 3 botol susu segar:
1. **Botol A**: Kedaluwarsa dalam **2 hari lagi** (harus segera dihabiskan).
2. **Botol B**: Kedaluwarsa dalam **5 hari lagi**.
3. **Botol C**: Kedaluwarsa dalam **14 hari lagi** (baru datang dari supplier).

Jika barista asal mengambil Botol C hanya karena posisinya paling depan atau paling mudah dijangkau, maka Botol A akan tertinggal di pojok belakang kulkas hingga basi dan terbuang. Ini menimbulkan **kerugian uang** bagi kafe!

Prinsip **FEFO (First Expired, First Out)** artinya: **Barang yang tanggal kedaluwarsanya paling dekat, WAJIB dipakai lebih dulu**. Sistem ini bertugas memandu barista agar selalu mengambil botol yang tepat.

---

## Penjelasan Per-Komponen & Per-Fungsi

---

### Komponen 1: Form Request `RecordUsageRequest`

Form Request ini bertindak sebagai **"Satpam Formulir"**. Sebelum data pemakaian diteruskan ke database, satpam ini memeriksa apakah input dari barista sudah benar dan masuk akal.

---

#### Fungsi: `rules()`
* **Tujuan**: Menentukan syarat-syarat data yang boleh dikirim oleh formulir pemakaian harian.
* **Input / Parameter**: Data input HTTP dari form: `ingredient_batch_id`, `quantity_used`, `usage_date`, `is_fefo_compliant`, `deviation_reason`.
* **Alur Logika Bisnis (Langkah demi Langkah)**:
  1. Memastikan ID batch yang dipilih benar-benar terdaftar di database (`exists`).
  2. Memastikan kuantitas pemakaian berupa angka desimal positif minimal 0.01 (`min:0.01`).
  3. Memastikan tanggal pemakaian tidak mendahului masa depan (`before_or_equal:today`).
  4. Menerapkan aturan pintar: Jika barista menandai tidak mematuhi FEFO (`is_fefo_compliant = false`), maka kolom `deviation_reason` (alasan) **wajib diisi** minimal 5 karakter.
* **Output / Return Value**: Aturan validasi Laravel dalam bentuk *array*.
* **Kaitan dengan Bagian Lain**: Jika validasi gagal, Laravel otomatis mengembalikan user ke halaman form dengan pesan kesalahan berwarna merah di layar.

---

#### Fungsi: `withValidator($validator)`
* **Tujuan**: Melakukan pemeriksaan khusus yang membutuhkan kueri database tambahan (pemeriksaan stok riil dan keabsahan klaim FEFO).
* **Input / Parameter**: Objek validator Laravel aktif.
* **Alur Logika Bisnis (Langkah demi Langkah)**:
  1. Mengambil data batch langsung dari database.
  2. Mengecek apakah status batch tersebut masih `active`. Jika batch sudah `exhausted` (habis) atau `disposed` (dibuang), tolak transaksi.
  3. **Pencegahan Stok Minus**: Mengecek apakah kuantitas yang diminta melebihi sisa stok yang ada di wadah. Jika barista minta 3 Liter sementara di botol hanya sisa 1.5 Liter, tolak dengan pesan error.
  4. **Pencegahan Kecurangan FEFO**: Sistem mengecek ulang dari database apakah batch tersebut memang benar batch dengan masa kedaluwarsa terdekat. Jika bukan batch teratas tetapi pengguna mengaku patuh FEFO, tolak dan minta alasan deviasi.
* **Output / Return Value**: Menambahkan pesan error ke dalam *error bag* jika ditemukan kejanggalan data.
* **Kaitan dengan Bagian Lain**: Menjamin integritas data agar laporan keuangan pemilik kafe (*Owner*) tetap akurat.

---

### Komponen 2: Action Class `DeductStockAction`

Action Class ini adalah **"Jantung Eksekusi Bisnis"**. Seluruh aksi pengurangan stok dan pencatatan riwayat dipusatkan di sini agar kode rapi dan tidak berantakan di dalam Controller.

---

#### Fungsi: `execute($batch, $user, $data)`
* **Tujuan**: Memotong kuantitas stok batch, mengubah status batch jika habis, dan mencatat riwayat pemakaian ke tabel log.
* **Input / Parameter**:
  * `$batch`: Model `IngredientBatch` yang dipilih.
  * `$user`: Model `User` (barista yang sedang login).
  * `$data`: Data pemakaian tervalidasi (`quantity_used`, `usage_date`, dll).
* **Alur Logika Bisnis (Langkah demi Langkah)**:
  1. **Buka Brankas Transaksi (`DB::transaction`)**: Semua langkah di bawah dijalankan sebagai satu kesatuan. Jika mati lampu atau error di tengah jalan, database otomatis membatalkan perubahan sehingga data tidak rusak.
  2. **Gembok Baris Data (`lockForUpdate`)**: Mengunci batch tersebut selama sepersekian detik agar jika ada barista lain yang memotong batch yang sama di tablet bar berbeda, mereka tidak saling menimpa stok (*race condition*).
  3. **Hitung Sisa Stok Baru**: `stok_baru = stok_sekarang - kuantitas_dipakai`.
  4. **Ubah Status Otomatis**: Jika `stok_baru == 0`, sistem otomatis mengganti status batch menjadi `'exhausted'` (habis terpakai).
  5. **Simpan ke Buku Riwayat**: Membuat satu baris data baru di tabel `stock_usages` yang mencatat siapa yang mengambil, kapan, berapa banyak, dan apakah mematuhi anjuran FEFO.
* **Output / Return Value**: Objek `StockUsage` yang baru saja tersimpan.
* **Kaitan dengan Bagian Lain**: Memperbarui tabel `ingredient_batches` dan tabel `stock_usages` secara serentak.

---

### Komponen 3: Controller `StockUsageController`

Controller ini bertindak sebagai **"Resepsionis Bar"** yang menghubungkan tampilan layar pengguna (*Inertia React*) dengan logika bisnis di belakang layar.

---

#### Fungsi: `index(Request $request)`
* **Tujuan**: Menampilkan tabel daftar riwayat pemakaian bahan baku kafe.
* **Input / Parameter**: Request HTTP yang berisi parameter filter opsional (filter bahan, filter kepatuhan FEFO, dan rentang tanggal).
* **Alur Logika Bisnis (Langkah demi Langkah)**:
  1. Menyiapkan kueri data dari tabel `stock_usages` lengkap dengan data nama bahan dan nama barista yang mencatat.
  2. Menyaring data jika supervisor memilih filter (misal: "Hanya tampilkan pemakaian yang menyimpang dari FEFO").
  3. Membagi data menjadi 15 baris per halaman (*pagination*).
* **Output / Return Value**: Merender halaman Inertia `StockUsages/Index` dengan data riwayat dan daftar bahan baku untuk dropdown filter.
* **Kaitan dengan Bagian Lain**: Digunakan oleh Supervisor dan Owner untuk memantau kedisiplinan penggunaan bahan baku di bar.

---

#### Fungsi: `create(Request $request)`
* **Tujuan**: Menyiapkan dan menampilkan formulir pencatatan pemakaian bahan lengkap dengan daftar batch terurut FEFO.
* **Input / Parameter**: Request HTTP dengan parameter opsional `ingredient_id` (bahan yang ingin dipakai).
* **Alur Logika Bisnis (Langkah demi Langkah)**:
  1. Mengambil seluruh master bahan baku untuk dropdown pilihan bahan.
  2. Mengambil bahan yang sedang dipilih (atau memilih bahan pertama secara default).
  3. **Menjalankan Algoritma FEFO**:
     * Mencari seluruh batch aktif milik bahan tersebut.
     * Mengurutkan kronologis tanggal kedaluwarsa paling awal di posisi teratas: `orderBy('expiry_date', 'asc')`.
  4. **Menentukan Juara FEFO**: Batch di urutan paling atas (`first()`) ditetapkan sebagai batch rekomendasi utama (`recommendedBatchId`).
  5. Melampirkan informasi hitung mundur kedaluwarsa (`days_until_expiry`) dan warna lampu peringatan (`expiry_status`).
* **Output / Return Value**: Merender halaman formulir Inertia `StockUsages/Create` lengkap dengan tanda badge `[★ REKOMENDASI FEFO]`.
* **Kaitan dengan Bagian Lain**: Memberikan data bagi antarmuka React untuk menampilkan dialog peringatan deviasi jika barista memilih batch fisik selain batch rekomendasi.

---

#### Fungsi: `store(RecordUsageRequest $request, DeductStockAction $deductStock)`
* **Tujuan**: Menerima data kiriman formulir dan mendelegasikannya ke Action Class pemotongan stok.
* **Input / Parameter**: Request yang telah lolos sensor `RecordUsageRequest` dan instance service `DeductStockAction`.
* **Alur Logika Bisnis (Langkah demi Langkah)**:
  1. Mencari data batch yang dipilih di database.
  2. Memanggil aksi `deductStock->execute()` untuk memotong kuantitas stok secara aman.
  3. Menyusun pesan notifikasi sukses (membedakan pesan antara pemakaian yang patuh FEFO dengan pemakaian yang menyimpang).
  4. Mengarahkan kembali barista ke halaman riwayat stok dengan pesan kilat (*flash message*).
* **Output / Return Value**: Objek `RedirectResponse` kembali ke halaman `stock-usages.index`.
* **Kaitan dengan Bagian Lain**: Memperbarui status inventaris secara langsung di database.

---

#### Fungsi: `show(StockUsage $stockUsage)`
* **Tujuan**: Menampilkan detail lengkap satu tiket transaksi pemakaian bahan.
* **Input / Parameter**: Objek model `StockUsage` dari URL (*Route Model Binding*).
* **Alur Logika Bisnis (Langkah demi Langkah)**:
  1. Memuat relasi data pendukung: informasi batch, kategori bahan baku, dan identitas user yang mencatat.
* **Output / Return Value**: Merender halaman Inertia `StockUsages/Show`.
* **Kaitan dengan Bagian Lain**: Halaman detail audit jika supervisor ingin meninjau alasan deviasi atau catatan operasional yang diinput oleh barista.

---

## Rangkuman Alur Kerja di Meja Bar

```
Pagi hari di Bar:
1. Barista ingin membuat Caramel Latte, membuka layar "Catat Pemakaian"
2. Barista pilih bahan "Caramel Syrup Monin 1L"
3. Sistem menyajikan daftar botol di gudang:
   • Botol CARAMEL-A (Exp: 4 hari lagi) [★ REKOMENDASI FEFO]
   • Botol CARAMEL-B (Exp: 60 hari lagi)
4. Skenario A (Patuh):
   Barista ambil Botol CARAMEL-A -> Input 0.1 Liter -> Simpan -> Stok Botol A berkurang.
5. Skenario B (Deviasi):
   Barista ambil Botol CARAMEL-B (karena Botol B sudah terlanjur dibuka segelnya)
   -> Sistem memunculkan pop-up peringatan kuning
   -> Barista wajib mengetik alasan: "Segel botol B sudah terbuka kemarin"
   -> Simpan -> Sistem mencatat stok Botol B terpotong dengan tanda deviasi.
```

---

*Dokumen ini merupakan penjelasan ramah pemula pendamping spesifikasi teknis di [`PLAN_06_STOCK_USAGE_FEFO_CONTROLLER.md`](../Plan%20Backend/PLAN_06_STOCK_USAGE_FEFO_CONTROLLER.md).*
