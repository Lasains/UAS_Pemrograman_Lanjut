# Penjelasan Modul 14: Halaman Monitoring Inventaris & Early Warning Kedaluwarsa (`Inventory/Index.tsx`)
## Panduan Pemula — Sistem Pemantauan Masa Kadaluwarsa dan Inventaris Kafe

> **Untuk Siapa**: Tim mahasiswa pengembang antarmuka yang mempelajari pembuatan tabel inventaris bertingkat (*Hierarchical Inventory Table*), sistem filter lampu lalu lintas, dan penandaan prioritas rotasi FEFO (*First Expired, First Out*).  
> **Berkas Terkait**: [`resources/js/Pages/Inventory/Index.tsx`](file:///E:/Uas_PL/UAS_Pemrograman_Lanjut/resources/js/Pages/Inventory/Index.tsx)  
> **Desain Asli (Google Stitch)**: Screen ID `160ce384d6bd4e26a922e95c415d4dd2` (Project ID: `6809982526338826771` - "[EXPORT MCP #2] Inventory/Index.tsx - BeanFlow Monitoring").  
> **Aset Desain Tersimpan**: [`docs/stitch/inventory_index_monitoring.html`](file:///E:/Uas_PL/UAS_Pemrograman_Lanjut/docs/stitch/inventory_index_monitoring.html) & [`docs/stitch/inventory_index_monitoring.png`](file:///E:/Uas_PL/UAS_Pemrograman_Lanjut/docs/stitch/inventory_index_monitoring.png).

---

## 1. Analogi Dunia Nyata Kafe: "Papan Inventaris & Rak Chiller Transparan"

Bayangkan seorang **Supervisor Gudang** atau **Head Barista** sedang memeriksa stok di ruang chiller belakang kafe:
1. **Papan Ringkasan Cepat (Toolbar & Tab Filter)**: Seperti papan tulis besar di depan pintu gudang yang menuliskan berapa banyak bahan yang masih berstatus **🟢 Aman**, berapa yang **🟡 Peringatan (harus segera dipakai pekan ini)**, dan berapa yang **🔴 Kritis (akan basi dalam 1-2 hari)**. Lengkap dengan taksiran kerugian rupiah jika bahan kritis tersebut tidak segera dihabiskan.
2. **Daftar Bahan Baku Induk (Tabel Level 1)**: Menampilkan nama produk secara umum, misalnya *"Fresh Milk Diamond 1L"* dengan total sisa 4.500 ml.
3. **Membuka Kardus Fisik (Sub-Baris Rincian Batch Level 2)**: Saat supervisor mengklik *"Lihat Batch"*, baris tabel melebar ke bawah memperlihatkan kardus fisik satu per satu. Kardus yang paling dekat tanggal kedaluwarsanya langsung mendapatkan stiker emas **`[★ Rekomendasi FEFO]`** serta tombol aksi langsung: `[Pakai di Bar]` atau `[Lapor Basi]`.

---

## 2. Penjelasan Per Komponen & Per Fungsi

---

### Komponen Utama: `Index({ ingredients, summaryStats })`

* **Tujuan**:
  Menyediakan antarmuka terpusat bagi supervisor dan barista untuk mengawasi seluruh stok bahan baku kafe secara berjenjang (*hierarchical*), menyaring bahan berdasarkan tingkat urgensi masa simpan, dan mencegah kerugian bahan basi melalui kepatuhan rotasi FEFO.

* **Input / Props**:
  * `ingredients` (*Ingredient[]*, opsional): Daftar seluruh bahan baku beserta relasi batch fisik aktif dari controller Laravel.
  * `summaryStats` (*object*, opsional): Data ringkasan hitungan bahan aman, peringatan, kritis, dan total taksiran kerugian finansial rupiah.

* **Alur Logika Bisnis (Langkah demi Langkah)**:
  1. Komputer membungkus seluruh halaman di dalam master shell `<AppLayout>`, sehingga header atas dan sidebar otomatis terpasang sesuai hak akses user yang login.
  2. Komputer menyiapkan state reaktif lokal:
     * `searchQuery`: Kata kunci pencarian (nama bahan, kategori, atau kode batch).
     * `activeFilter`: Tab lampu lalu lintas yang aktif (`'all' | 'safe' | 'warning' | 'critical'`).
     * `expandedIds`: Daftar ID bahan yang sedang dibuka rincian batch-nya.
  3. Komputer menjalankan memoization `counts` untuk menghitung jumlah bahan di masing-masing kategori lampu lalu lintas dan mengalkulasi potensi kerugian bahan kritis:
     $$\text{Estimasi Kerugian} = \sum (\text{Stok Kritis} \times \text{Harga Beli Satuan})$$
  4. Komputer menyaring daftar bahan melalui memoization `filteredIngredients` berdasarkan kata kunci dan tab status yang dipilih.
  5. Komputer merender tabel utama; jika suatu bahan memiliki batch kritis, barisnya diberi sorotan latar belakang merah muda lembut (`#FDF7F6`) dan titik lampu berkedip (*animate-ping*).
  6. Saat tombol *"Lihat Batch"* diklik, komputer merender kartu sub-batch yang mengurutkan batch fisik secara kronologis dari tanggal kedaluwarsa terdekat (FEFO asc).

* **Output / Return Value**:
  Elemen JSX React lengkap yang merender halaman pengawasan inventaris interaktif.

* **Kaitan dengan Bagian Lain**:
  * Terhubung ke rute Laravel `route('inventory.index')` di `routes/web.php`.
  * Memanfaatkan komponen lencana [`ExpiryBadge.tsx`](file:///E:/Uas_PL/UAS_Pemrograman_Lanjut/resources/js/Components/ExpiryBadge.tsx).
  * Memiliki tombol pintas ke rute pemakaian bahan (`/usage/create?batch_id=...`) dan rute pelaporan bahan rusak (`/waste/create?batch_id=...`).

---

### Fungsi: `toggleExpand(id)`

* **Tujuan**:
  Membuka atau menutup sub-baris rincian batch fisik untuk suatu bahan baku tertentu (*accordion behavior*).

* **Input / Parameter**:
  * `id` (*number*): ID bahan baku yang diklik oleh pengguna (contoh: `1`).

* **Alur Logika Bisnis (Langkah demi Langkah)**:
  1. Komputer memeriksa apakah `id` tersebut sudah ada di dalam array state `expandedIds`.
  2. Jika sudah ada, komputer menghapusnya dari array sehingga baris batch tertutup.
  3. Jika belum ada, komputer menambahkannya ke dalam array sehingga rincian batch terbuka.

* **Output / Return Value**:
  Tidak ada nilai kembalian (*void*); fungsi langsung memperbarui state `expandedIds`.

* **Kaitan dengan Bagian Lain**:
  Mengontrol tampilan kondisional elemen `<tr>` sub-batch pada tabel inventaris.

---

### Fungsi: `getNearestBatch(ingredient)`

* **Tujuan**:
  Mencari batch fisik yang tanggal kedaluwarsanya paling dekat dengan hari ini untuk menentukan status lampu lalu lintas bahan tersebut.

* **Input / Parameter**:
  * `ingredient` (*Ingredient*): Objek data bahan baku beserta daftar `batches`-nya.

* **Alur Logika Bisnis (Langkah demi Langkah)**:
  1. Komputer mengecek apakah bahan memiliki batch aktif (`batches && batches.length > 0`). Jika tidak ada, kembalikan `null`.
  2. Komputer mengurutkan seluruh batch berdasarkan waktu kedaluwarsa (`expiry_date`) dari yang paling cepat basi ke yang paling lama:
     ```typescript
     new Date(a.expiry_date).getTime() - new Date(b.expiry_date).getTime()
     ```
  3. Komputer mengambil elemen pertama (`sorted[0]`) sebagai batch prioritas utama.

* **Output / Return Value**:
  Objek `IngredientBatch` dengan tanggal kedaluwarsa terdekat.

* **Kaitan dengan Bagian Lain**:
  Digunakan oleh filter pencarian, penghitungan tab ringkasan, dan penentuan badge urgensi di baris induk.

---

### Fungsi: `formatCurrency(val)`

* **Tujuan**:
  Mengubah angka integer harga menjadi format mata uang Rupiah Indonesia yang rapi dan mudah dibaca oleh pemilik kafe.

* **Input / Parameter**:
  * `val` (*number*): Nominal rupiah (contoh: `168000`).

* **Alur Logika Bisnis (Langkah demi Langkah)**:
  1. Komputer menggunakan pustaka bawaan browser `Intl.NumberFormat('id-ID', ...)`.
  2. Menetapkan kode mata uang `'IDR'` dan menghilangkan angka desimal di belakang koma.

* **Output / Return Value**:
  String mata uang terformat (contoh: `"Rp 168.000"`).

* **Kaitan dengan Bagian Lain**:
  Ditampilkan pada kotak peringatan estimasi nilai bahan kritis di pojok kanan atas filter.
