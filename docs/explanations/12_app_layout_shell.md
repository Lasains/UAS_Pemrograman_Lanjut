# Penjelasan Modul 12: Master App Shell & Navigasi RBAC Terpadu (`AppLayout.tsx`)
## Panduan Pemula — Sistem Pemantauan Masa Kadaluwarsa dan Inventaris Kafe

> **Untuk Siapa**: Tim mahasiswa pengembang antarmuka yang mempelajari pembuatan tata letak induk (*Master Shell Layout*) berbasis RBAC (*Role-Based Access Control*) pada React Inertia.js.  
> **Berkas Terkait**: [`resources/js/Layouts/AppLayout.tsx`](file:///E:/Uas_PL/UAS_Pemrograman_Lanjut/resources/js/Layouts/AppLayout.tsx)  
> **Desain Asli (Google Stitch)**: Screen ID `2cd8854b69164180b395c46ccb1a8293` (Project ID: `6809982526338826771` - "[EXPORT MCP #1] AppLayout.tsx - BeanFlow Shell").  
> **Aset Desain Tersimpan**: [`docs/stitch/app_layout_shell.html`](file:///E:/Uas_PL/UAS_Pemrograman_Lanjut/docs/stitch/app_layout_shell.html) & [`docs/stitch/app_layout_shell.png`](file:///E:/Uas_PL/UAS_Pemrograman_Lanjut/docs/stitch/app_layout_shell.png).

---

## 1. Analogi Dunia Nyata Kafe: "Gedung Kafe BeanFlow yang Terpadu"

Bayangkan sebuah kedai kopi fisik modern:
* **Gedung Kafe & Lorong Utama (`AppLayout.tsx`)**: Merupakan bangunan fisik kedai kopi itu sendiri. Dinding kafe berwarna kanvas susu hangat (*steamed milk* `#FAF7F2`), meja kasirnya dari kayu espresso pekat (`#4A2C11`), dan di sudut lorong ada papan petunjuk arah (sidebar).
* **Pintu Masuk & Lencana Shift (Top Bar)**: Setiap staf yang masuk langsung dikenali oleh sistem melalui lencana kapsul di baju mereka:
  - 🟢 **Barista**: Lencana hijau botani bertuliskan *"Barista Bar Utama (Station A)"*.
  - 🟡 **Supervisor**: Lencana oat latte bertuliskan *"Supervisor Bar & Gudang"*.
  - 🟤 **Owner**: Lencana espresso emas bertuliskan *"Pusat Analitik Eksekutif"*.
* **Papan Petunjuk Ruangan (Sidebar Navigasi)**: Pintu lorong hanya terbuka untuk ruangan yang berhak dimasuki oleh staf tersebut:
  - Barista tidak perlu melihat tabel laba-rugi keuangan kafe yang rumit.
  - Owner tidak perlu pusing melihat tombol pencatatan takaran mililiter susu di bar.
  - Supervisor memiliki akses ganda agar bisa memantau gudang sekaligus membantu barista saat jam sibuk (*rush hour*).

---

## 2. Penjelasan Per Komponen & Per Fungsi

---

### Komponen Utama: `AppLayout({ title, header, children })`

* **Tujuan**:
  Menjadi satu-satunya kerangka kerja induk (*Universal Single App Shell*) yang membungkus seluruh halaman operasional kafe. Menghilangkan duplikasi sidebar dan header sehingga seluruh halaman anak (*children*) tampil seragam dan rapi.

* **Input / Parameter**:
  * `title` (*string*, opsional): Judul tab peramban/browser (contoh: `"Dasbor Operasional - BeanFlow"`).
  * `header` (*ReactNode*, opsional): Komponen header kontekstual halaman yang dirender tepat di atas kanvas konten.
  * `children` (*ReactNode*): Seluruh komponen isi halaman spesifik yang sedang aktif (contoh: tabel inventaris, formulir FEFO, atau grafik analitik).

* **Alur Logika Bisnis (Langkah demi Langkah)**:
  1. Komputer membaca properti pengguna yang masuk melalui hook `usePage().props.auth.user` untuk mengetahui peran staf (`'barista'`, `'supervisor'`, atau `'owner'`).
  2. Komputer memfilter daftar navigasi sidebar secara dinamis: hanya grup menu yang memiliki izin peran tersebut yang akan ditampilkan di layar.
  3. Komputer merender bar atas (*sticky top bar*) berisi identitas merek, indikator sensor chiller IoT (*3.2°C*), dan lencana peran.
  4. Komputer merender sidebar navigasi persisten selebar 260px (`w-64`) di sebelah kiri, lengkap dengan kartu profil staf dan tombol keluar (*logout*).
  5. Komputer memeriksa apakah ada pesan notifikasi kilat (*flash messages*: sukses, error, atau peringatan) dari backend Laravel dan merendernya di atas kanvas.
  6. Komputer menyuntikkan isi halaman anak ke dalam wadah `{children}` pada kanvas susu hangat (`#FAF7F2`).

* **Output / Return Value**:
  Struktur antarmuka lengkap yang siap pakai, responsif di desktop maupun perangkat seluler (dengan menu *drawer overlay*).

* **Kaitan dengan Bagian Lain**:
  Membungkus seluruh halaman aplikasi di `resources/js/Pages/`, seperti `Dashboard.tsx`, `Inventory/Index.tsx`, `Usage/Create.tsx`, dan `Reports/Waste.tsx`.

---

### Fungsi Pembantu: `getInitials(name)`

* **Tujuan**:
  Mengubah nama lengkap pengguna menjadi inisial 2 huruf untuk ditampilkan di avatar lingkaran profil saat foto pengguna tidak tersedia.

* **Input / Parameter**:
  * `name` (*string*): Nama pengguna (contoh: `"Rian Ardiansyah"`).

* **Alur Logika Bisnis (Langkah demi Langkah)**:
  1. Komputer memotong spasi kosong di awal/akhir nama dengan `trim()`.
  2. Komputer memecah nama menjadi potongan kata menggunakan pemisah spasi `split(' ')`.
  3. Jika nama memiliki 2 kata atau lebih, komputer mengambil huruf pertama dari kata ke-1 dan kata ke-2 lalu mengubahnya menjadi huruf kapital (contoh: `"Rian Ardiansyah"` $\rightarrow$ `"RA"`).
  4. Jika nama hanya 1 kata, komputer mengambil 2 huruf pertama dari kata tersebut.

* **Output / Return Value**:
  String inisial 2 huruf kapital (contoh: `"RA"` atau `"BF"`).

* **Kaitan dengan Bagian Lain**:
  Digunakan di bagian bawah sidebar pada kartu profil pengguna.

---

### Fungsi Pembantu: `safeUrl(routeName, fallbackUrl)`

* **Tujuan**:
  Mencegah aplikasi mengalami eror (*crash/blank screen*) jika sebuah rute Laravel belum selesai dibuat oleh tim backend saat tombol navigasi diklik.

* **Input / Parameter**:
  * `routeName` (*string*, opsional): Nama rute Ziggy yang ingin dituju (contoh: `"usage.create"`).
  * `fallbackUrl` (*string*, default `'#'`): URL cadangan jika rute belum terdaftar (contoh: `"/usage/create"`).

* **Alur Logika Bisnis (Langkah demi Langkah)**:
  1. Komputer mengecek apakah parameter `routeName` tersedia.
  2. Komputer mencoba mengevaluasi `route(routeName)`.
  3. Jika rute belum terdaftar di `routes/web.php`, blok `try/catch` menangkap eror secara senyap dan mengembalikan `fallbackUrl`.

* **Output / Return Value**:
  String URL yang aman untuk atribut `href` pada komponen `<Link />`.

* **Kaitan dengan Bagian Lain**:
  Memastikan tautan navigasi sidebar tetap dapat diklik secara anggun pada tahap pengembangan bertahap (*incremental development*).

---

### Fungsi Pembantu: `isCurrent(routeName)`

* **Tujuan**:
  Mendeteksi apakah halaman yang sedang dibuka oleh pengguna cocok dengan menu di sidebar untuk memberikan efek penanda aktif (*active highlight pill*).

* **Input / Parameter**:
  * `routeName` (*string*, opsional): Nama rute yang ingin diuji.

* **Alur Logika Bisnis (Langkah demi Langkah)**:
  1. Komputer memeriksa apakah fungsi `route().current(routeName)` bernilai `true`.
  2. Jika cocok, menu di sidebar diberi latar belakang warna espresso gelap (`#4A2C11`), teks terang (`#FAF7F2`), dan bayangan halus.
  3. Jika tidak cocok, menu tetap menggunakan warna netral moka (`#5C3A21`).

* **Output / Return Value**:
  Nilai boolean (`true` jika halaman sedang aktif, `false` jika tidak).

* **Kaitan dengan Bagian Lain**:
  Mengatur kelas CSS dinamis via helper `cn()` pada tautan menu sidebar.

---

## 3. Rangkuman Matriks Navigasi Sesuai RBAC

| Grup Menu | Nama Fitur | Ikon | Barista | Supervisor | Owner |
| :--- | :--- | :---: | :---: | :---: | :---: |
| **Operasional Bar** | Monitoring Kedaluwarsa | `Clock` | ✅ | ✅ | ❌ |
| **Operasional Bar** | Catat Pemakaian (FEFO) | `Flame` | ✅ | ✅ | ❌ |
| **Operasional Bar** | Penerimaan Batch (Restock) | `PackagePlus` | ✅ | ✅ | ❌ |
| **Operasional Bar** | Lapor Bahan Rusak | `AlertTriangle` | ✅ | ✅ | ❌ |
| **Pusat Inventaris & Mutu** | Katalog Master Bahan | `Boxes` | ❌ | ✅ | ❌ |
| **Pusat Inventaris & Mutu** | Kategori Bahan Baku | `Tag` | ❌ | ✅ | ❌ |
| **Pusat Inventaris & Mutu** | Approval Pemusnahan | `Scale` | ❌ | ✅ | ❌ |
| **Pusat Inventaris & Mutu** | Riwayat Audit FEFO | `ClipboardList` | ❌ | ✅ | ✅ |
| **Eksekutif & Finansial** | Dasbor Analitik Eksekutif | `LineChart` | ❌ | ❌ | ✅ |
| **Eksekutif & Finansial** | Laporan Finansial & Waste | `TrendingDown` | ❌ | ❌ | ✅ |
