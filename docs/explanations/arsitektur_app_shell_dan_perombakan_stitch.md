# PANDUAN PENJELASAN ARSITEKTUR APP SHELL & STANDARISASI STITCH (UNTUK PEMULA)
> **Modul**: Arsitektur Frontend, Layout Shell Terpadu, dan Perbaikan Prompt Desain Stitch  
> **Berkas Terkait**: `docs/Plan Frontend/PLAN_02_APP_LAYOUT_RBAC.md`, `PLAN_03_BARISTA_OPERASIONAL_FEFO.md`, `PROMPT_LIST_PLAN_DESIGN.md`, dan [Desain.md](file:///home/lasains/ssd2/matkul/pemograman%20lanjut/projek/Desain.md)

---

## 1. Analogi Dunia Nyata Kafe: Kenapa Desain Sebelumnya "Berantakan"?

Bayangkan kafe fisik **BeanFlow**:
* **App Shell (Kerangka Aplikasi)** adalah **Gedung Kafe itu sendiri**: Pintu masuk, meja bar kasir, dinding, dan papan nama "BeanFlow".
* **Halaman Modul (Dashboard, Stok, Laporan)** adalah **Aktivitas yang Berlangsung di Meja Bar**: Barista sedang meracik kopi (*Dasbor Barista*), Supervisor sedang menghitung kardus susu di rak belakang (*Monitoring Stok*), atau Pemilik kafe sedang membaca buku kas malam hari (*Analitik Owner*).

### Masalah Desain Sebelumnya di Google Stitch:
Saat membuat desain di Stitch, kita secara tidak sengaja meminta arsitek membangun gedung baru lengkap dengan pintu dan tembok baru **setiap kali barista ingin mengambil susu**! 
Akibatnya:
1. Di setiap halaman ada sidebar dan header dengan ukuran, jenis font, dan warna yang berbeda-beda.
2. Barista yang sibuk saat *rush hour* (antrean panjang) harus membuka modal (jendela pop-up), lalu di dalam jendela itu muncul jendela konfirmasi lagi. Ini sangat memperlambat kerja peracikan kopi.

---

## 2. Penjelasan Per Komponen Arsitektur Baru

---

### Komponen: `UniversalAppShell` (`AppLayout.tsx`)
* **Tujuan**: Menjadi satu-satunya "rumah" atau kerangka antarmuka terpadu untuk semua peran (Barista, Supervisor, Owner). Tidak boleh ada shell terpisah.
* **Input / Props**:
  - `auth.user`: Data pengguna yang sedang login (nama, inisial avatar, dan perannya: `'barista' | 'supervisor' | 'owner'`).
  - `title`: Judul halaman yang akan ditampilkan di header atas.
  - `children`: Isi halaman yang sedang dibuka (misal: Dasbor Barista atau Tabel Inventaris).
* **Alur Logika Bisnis (Langkah demi Langkah)**:
  1. Komputer memeriksa peran user yang masuk (`auth.user.role`).
  2. Jika perannya adalah `barista`, menu sidebar sebelah kiri hanya menampilkan kelompok "OPERASIONAL BAR" (Dasbor, Pemakaian FEFO, Restock, Lapor Rusak).
  3. Jika perannya adalah `supervisor` atau `owner`, sidebar secara otomatis membuka menu gudang atau analitik eksekutif.
  4. Header atas secara otomatis memasang lencana (*Role Capsule Badge*) yang sesuai (contoh: Kapsul Hijau Botani *"Barista Shift"* untuk barista).
  5. Bagian tengah kanvas susu hangat (`#FAF7F2`) merender elemen `children` (halaman modul yang dipanggil).
* **Output / Tampilan**: Sebuah kerangka web responsif dengan sidebar kiri tetap (260px), header atas lengket (64px), dan kanvas kerja yang luas.
* **Kaitan dengan Bagian Lain**: Membungkus seluruh file yang ada di folder `resources/js/Pages/`.

---

### Komponen: `InShellContentView` (Pola Kanvas Konten Isi)
* **Tujuan**: Menghilangkan duplikasi sidebar dan header saat membuat desain di Google Stitch maupun saat koding komponen React.
* **Input / Parameter**:
  - Area kerja kanvas bebas di dalam tag `<slot />` atau `{children}`.
* **Alur Logika Bisnis (Langkah demi Langkah)**:
  1. Pengembang dan AI Stitch diberi instruksi tegas: **Jangan gambar sidebar atau header lagi!**
  2. Fokus desain 100% dialokasikan untuk menyusun kartu bahan, tabel inventaris, atau grafik finansial.
  3. Seluruh elemen menggunakan latar belakang turunan kanvas susu hangat (`#FAF7F2`) dan kartu oat latte (`#F5EFEB`).
* **Output**: Mockup Stitch dan halaman React yang bersih, rapi, dan langsung menyatu saat dimasukkan ke dalam shell.
* **Kaitan dengan Bagian Lain**: Digunakan oleh `Barista/Dashboard.tsx`, `Inventory/Index.tsx`, `Master/Ingredients/Index.tsx`, dan `Owner/Dashboard.tsx`.

---

### Komponen: `FefoUsageSlideOverDrawer` (Panel Geser Aksi FEFO)
* **Tujuan**: Menggantikan tumpukan modal pop-up kaku menjadi satu panel geser dari sisi kanan layar (*Slide-Over Drawer*), sehingga barista tetap bisa melihat meja bar saat mencatat bahan.
* **Input / Parameter**:
  - `ingredient`: Data bahan baku yang dipilih (contoh: Fresh Milk Diamond 1L).
  - `activeBatches`: Daftar seluruh batch fisik bahan yang masih aktif dan tersisa, **diurutkan kronologis tanggal kedaluwarsa terdekat (FEFO ASC)**.
* **Alur Logika Bisnis (Langkah demi Langkah)**:
  1. Barista mengklik tombol `[Pakai Bahan]` pada kartu susu di layar dasbor.
  2. Drawer meluncur halus dari sisi kanan (lebar 480px).
  3. Komputer otomatis menandai batch nomor 1 (kedaluwarsa terdekat) dengan badge emas/espresso `[★ REKOMENDASI FEFO]`.
  4. **Pencegahan Deviasi Cerdas (Inline Warning)**:
     - Jika barista memilih batch lain (misal batch nomor 2), komputer tidak memunculkan modal pop-up baru yang mengganggu.
     - Kotak peringatan warna karamel amber (`#FFF7ED`) langsung terbuka secara *inline* (di dalam drawer yang sama).
     - Barista wajib mengetik alasan kenapa mengambil batch tersebut (misal: *"Kotak susu ini sudah terbuka duluan di kulkas"*).
  5. Barista memasukkan jumlah mililiter/gram yang dipakai, lalu menekan `[Konfirmasi & Kurangi Stok]`.
* **Output**: Pengurangan stok batch fisik secara aman di database (`DB::transaction`) dan notifikasi sukses hijau botani.
* **Kaitan dengan Bagian Lain**: Terhubung dengan controller `StockUsageController.php` dan tabel `stock_usages`.

---

### Komponen: `WasteReviewSlideOverDrawer` (Panel Verifikasi Kerugian Bahan Rusak)
* **Tujuan**: Memungkinkan supervisor meninjau tiket bahan basi/rusak yang dilaporkan barista dan melihat perhitungan kerugian uang secara transparan sebelum disetujui.
* **Input / Parameter**:
  - `ticket`: Data tiket pelaporan (nama bahan, nomor batch, kuantitas rusak, alasan, nama barista).
  - `cost_per_unit`: Harga beli bahan per unit dari faktur pembelian awal.
* **Alur Logika Bisnis (Langkah demi Langkah)**:
  1. Supervisor membuka daftar antrean persetujuan limbah.
  2. Mengklik baris tiket untuk membuka slide-over panel di sisi kanan.
  3. Komputer menghitung rumus kerugian finansial secara otomatis:  
     $$\text{Kerugian Finansial} = \text{Kuantitas Rusak} \times \text{Harga Beli Satuan}$$
  4. Ditampilkan dalam tipografi angka terracotta cherry tebal (`#8C3D2B`), misalnya: `Rp 24.000`.
  5. Jika supervisor menekan `[Setujui]`: Stok fisik batch langsung dipotong menjadi 0 (tidak dihapus hard delete) dan kerugian dibukukan ke laporan owner.
  6. Jika supervisor menekan `[Tolak]`: Stok fisik tidak berubah dan tiket ditandai ditolak beserta alasan supervisor.
* **Output**: Status tiket menjadi `approved` atau `rejected` secara atomik melalui `DB::transaction`.
* **Kaitan dengan Bagian Lain**: Terhubung dengan `WasteLogController.php` dan dasbor analitik owner (`PLAN_07`).

---

## 3. Rangkuman Standarisasi Token Warna (Anti-UI Slop)

| Nama Token | Kode Warna Hex | Filosofi Kafe | Tempat Digunakan |
| :--- | :--- | :--- | :--- |
| **Canvas Base** | `#FAF7F2` | Steamed Milk & Porselen | Latar belakang seluruh halaman |
| **Container Base** | `#F5EFEB` | Oat Latte Base | Permukaan kartu, panel drawer |
| **Parchment Border** | `#EDE4DC` | Kertas seduh kopi tanpa pemutih | Garis batas kartu, pemisah baris tabel |
| **Brand Primary** | `#4A2C11` | Biji kopi Espresso panggang gelap | Tombol aksi utama, logo, badge FEFO |
| **Brand Secondary** | `#C88242` | Karamel dan gula aren leleh | Status peringatan deviasi, tab aktif |
| **Brand Critical** | `#8C3D2B` | Ceri kopi merah panggang / Terracotta | Peringatan kedaluwarsa kritis, nominal kerugian waste |
| **Botanical Safe** | `#ECFDF5` / `#065F46` | Daun tanaman kopi segar | Badge status aman (> 7 hari), sistem sinkron |
