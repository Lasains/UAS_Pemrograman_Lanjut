# Penjelasan Modul 11: Antarmuka Autentikasi & Login Multi-Peran (BeanFlow)
## Panduan Pemula — Pintu Masuk Kedai Kopi Modern

> **Untuk Siapa Dokumen Ini**: Tim mahasiswa pemula yang ingin memahami cara kerja antarmuka login kafe, tata letak dua kolom (*split-screen*), pengisian kredensial otomatis untuk pengujian, serta pengiriman formulir dengan Inertia.js React.  
> **Analogi Dunia Nyata**: Bayangkan meja kasir / bar kafe. Barista yang baru datang untuk pergantian shift butuh kartu akses cepat tanpa harus mengetik panjang, sementara sistem di belakang tetap memverifikasi identitas dan hak aksesnya.  
> **Kaitan dengan Kode**: [`resources/js/Pages/Auth/Login.tsx`](../../resources/js/Pages/Auth/Login.tsx) dan [`resources/js/Layouts/GuestLayout.tsx`](../../resources/js/Layouts/GuestLayout.tsx).

---

## 1. Komponen: `GuestLayout({ children, fullWidth })`

* **Tujuan**: Menjadi "ruang tunggu" (kerangka dasar) bagi halaman-halaman yang dibuka sebelum pengguna masuk ke dalam sistem (seperti halaman Login, Lupa Password, dan Reset Password). Komponen ini memastikan latar belakang bernuansa kanvas susu hangat (*Warm Steamed Milk & Porcelain* `#FAF7F2`) konsisten di seluruh aplikasi.
* **Input / Parameter**:
  * `children`: Elemen atau komponen tampilan yang ingin diletakkan di dalam kerangka layout.
  * `fullWidth` *(boolean opsional, default: false)*: Saklar apakah tampilan ingin mengisi layar penuh (*split-screen* seperti pada login) atau memakai kotak kartu terpusat standar.
* **Alur Logika Bisnis (Langkah demi Langkah)**:
  1. Komputer memeriksa apakah `fullWidth` bernilai `true`.
  2. Jika `true` (pada halaman Login): Komputer langsung menampilkan `children` dalam wadah kanvas layar penuh tanpa pembatas sempit, sehingga panel visual kiri dan form kanan bisa membentang anggun.
  3. Jika `false` (pada halaman reset password): Komputer membungkus konten dalam kotak kartu putih terpusat berukuran `max-w-md` lengkap dengan logo BeanFlow di atasnya.
* **Output / Return Value**: Elemen JSX pembungkus layout tamu dengan tema kafe hangat.
* **Kaitan dengan Bagian Lain**: Digunakan oleh seluruh halaman autentikasi di dalam direktori `resources/js/Pages/Auth/`.

---

## 2. Komponen Utama: `Login({ status, canResetPassword })`

* **Tujuan**: Menyediakan antarmuka pendaratan utama bagi seluruh staf kafe (Barista, Supervisor gudang, dan Owner). Menyajikan informasi sistem rotasi FEFO di sisi kiri serta form login kredensial di sisi kanan.
* **Input / Parameter**:
  * `status` *(string opsional)*: Pesan notifikasi dari sesi Laravel (misal: "Sandi Anda telah berhasil direset").
  * `canResetPassword` *(boolean)*: Penanda apakah fitur pemulihan kata sandi aktif di sistem.
* **Alur Logika Bisnis (Langkah demi Langkah)**:
  1. Komputer menginisialisasi state form menggunakan helper `useForm` dari `@inertiajs/react` dengan nilai awal kosong (`email: ''`, `password: ''`, `remember: false`).
  2. Komputer menyusun dua panel utama:
     - **Panel Kiri (Visual & Edukasi FEFO)**: Menampilkan keunggulan sistem pemantauan kadaluwarsa (rotasi 99.2%, Rp 0 kerugian bahan basi, dan reminder batch fresh milk).
     - **Panel Kanan (Formulir Autentikasi)**: Menampilkan input email, kata sandi, kotak centang "Ingat sesi", dan tombol submit.
  3. Komputer memantau proses autentikasi. Jika form sedang diproses (`processing === true`), tombol dinonaktifkan dan ikon animasi pemuatan (*Loader2 spinner*) dimunculkan untuk mencegah klik ganda.
* **Output / Return Value**: Antarmuka lengkap halaman login responsif (ramah tablet bar kafe maupun desktop).
* **Kaitan dengan Bagian Lain**: Terhubung dengan rute Laravel `route('login')` yang diatur oleh `AuthenticatedSessionController.php`.

---

## 3. Fungsi: `submit(e)`

* **Tujuan**: Menangani pengiriman formulir secara manual ketika pengguna menekan tombol **"Masuk ke Sistem"**.
* **Input / Parameter**:
  * `e: FormEventHandler`: Objek *event* klik/submit dari form HTML browser.
* **Alur Logika Bisnis (Langkah demi Langkah)**:
  1. Komputer memanggil `e.preventDefault()` agar halaman web tidak me-*reload* secara tradisional (menjaga pengalaman Single Page Application / SPA).
  2. Mengirimkan data formulir (`email`, `password`, `remember`) menggunakan metode `post(route('login'))` via protokol Inertia.js.
  3. Menunggu respon dari server:
     - Jika autentikasi valid: Laravel membuat sesi login dan mengarahkan pengguna ke dasbor peran masing-masing.
     - Jika autentikasi gagal: Inertia mengembalikan pesan error validasi (misal: sandi salah) dan mengisi variabel `errors.email` atau `errors.password`.
  4. Pada callback `onFinish()`, kolom password otomatis dikosongkan demi keamanan data.
* **Output / Return Value**: Tidak mengembalikan nilai langsung (*void*); mengirim permintaan HTTP POST ke backend.
* **Kaitan dengan Bagian Lain**: Berinteraksi dengan `App\Http\Requests\Auth\LoginRequest` di backend Laravel untuk validasi kredensial.

---

## 4. Fungsi: `setShowPassword(!showPassword)`

* **Tujuan**: Fitur kenyamanan (*convenience feature*) untuk mengintip atau menyembunyikan karakter kata sandi di layar.
* **Input / Parameter**: Membalikkan nilai boolean sebelumnya (dari `false` ke `true` atau sebaliknya).
* **Alur Logika Bisnis (Langkah demi Langkah)**:
  1. Saat tombol mata (*Eye icon*) diklik, state `showPassword` berubah.
  2. Atribut tipe input HTML pada kotak password berganti secara dinamis antara `type="password"` (titik-titik tersembunyi) dan `type="text"` (karakter terbaca).
  3. Ikon berganti antara `Eye` dan `EyeOff`.
* **Output / Return Value**: Pembaruan tampilan input kata sandi di layar.
* **Kaitan dengan Bagian Lain**: Elemen input kata sandi pada formulir autentikasi.
