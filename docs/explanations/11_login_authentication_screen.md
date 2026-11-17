# Penjelasan Modul 11: Antarmuka Masuk ke Sistem (Login Screen - BeanFlow Theme)
## Panduan Pemula — Sistem Pemantauan Masa Kadaluwarsa dan Inventaris Kafe

> **Untuk Siapa**: Tim mahasiswa pengembang frontend dan pemula yang mempelajari alur autentikasi React Inertia.js.  
> **Berkas Terkait**: [`resources/js/Pages/Auth/Login.tsx`](file:///E:/Uas_PL/UAS_Pemrograman_Lanjut/resources/js/Pages/Auth/Login.tsx)  
> **Desain Asli (Google Stitch)**: Screen ID `7083997261414840596` ("Masuk ke Sistem Inventaris - BeanFlow Tema Kopi").  
> **Aset Desain Tersimpan**: [`docs/stitch/login_screen.html`](file:///E:/Uas_PL/UAS_Pemrograman_Lanjut/docs/stitch/login_screen.html) & [`docs/stitch/login_screen.png`](file:///E:/Uas_PL/UAS_Pemrograman_Lanjut/docs/stitch/login_screen.png).

---

## 1. Analogi Dunia Nyata: "Pintu Masuk Kasir & Terminal Barista"

Bayangkan sebuah kedai kopi (*coffee shop*) di pagi hari sebelum pintu kafe dibuka untuk pelanggan:
1. **Papan Metrik Operasional (Panel Kiri)**: Seperti papan pengumuman di dinding bar kafe yang memajang prestasi operasional: tingkat kepatuhan rotasi susu segar (*99.2% kepatuhan FEFO*), laporan kerugian bahan basi (*Rp 0*), dan pengingat tanggal kedaluwarsa hari ini (*3 batch fresh milk siap pakai sebelum pk 18:00*). Ini memberikan rasa percaya diri dan ketenangan bagi tim kafe.
2. **Terminal Presensi & Kasir (Panel Kanan)**: Seperti tablet kasir POS di meja bar tempat staf melakukan absensi atau membuka shift. Karena di kafe terdapat 3 staf berbeda peran (**Barista**, **Supervisor Gudang**, dan **Owner**), sistem menyediakan tombol **1-Klik Akun Demo** agar pergantian peran dapat dilakukan dengan instan tanpa harus mengetik ulang email dan password panjang saat jam sibuk atau saat presentasi di hadapan dosen penguji.

---

## 2. Penjelasan Per Komponen & Per Fungsi

---

### Komponen Utama: `Login({ status, canResetPassword })`

* **Tujuan**:
  Menyediakan antarmuka visual dua panel (*split-screen layout*) yang imersif dan modern untuk proses autentikasi pengguna ke dalam sistem inventaris BeanFlow, memadukan edukasi nilai bisnis FEFO di sisi kiri dan form login yang aman serta cepat di sisi kanan.

* **Input / Parameter**:
  * `status` (*string*, opsional): Pesan notifikasi dari server Laravel (contoh: `"Sandi Anda berhasil diperbarui"`).
  * `canResetPassword` (*boolean*, default `true`): Penanda apakah tautan "Lupa kata sandi?" diaktifkan atau disembunyikan.

* **Alur Logika Bisnis (Langkah demi Langkah)**:
  1. Komputer menginisialisasi state formulir dengan hook `useForm` dari `@inertiajs/react`, menyiapkan variabel `email`, `password`, dan `remember`.
  2. Komputer menyiapkan state visual pendukung: `showPassword` (sembunyikan/tampilkan password), `activeRole` (role demo yang sedang aktif), dan `roleToast` (notifikasi banner kredensial).
  3. Komputer merender layout responsif `flex-col lg:flex-row`:
     * Di layar besar (*desktop*), panel kiri menampilkan visual branding kopi espresso hangat dengan efek partikel cahaya (*warm glow amber*), metrik FEFO, dan bukti sosial (*social proof* rating 4.9/5.0).
     * Panel kanan menampilkan kartu login putih bersih dengan warna tepi oat latte (`#EDE4DC`) yang ramah mata.
  4. Form menangani interaksi pengguna secara reaktif dan memvalidasi error input secara realtime jika data tidak cocok.

* **Output / Return Value**:
  Elemen JSX React lengkap yang merender seluruh halaman login ke browser pengguna.

* **Kaitan dengan Bagian Lain**:
  * Terhubung ke rute Laravel `route('login')` (ditangani oleh `AuthenticatedSessionController`).
  * Terhubung ke `route('password.request')` jika pengguna lupa kata sandi.
  * Menggunakan palet token warna yang didefinisikan dalam [`Desain.md`](file:///E:/Uas_PL/UAS_Pemrograman_Lanjut/Desain.md) dan `tailwind.config.js`.

---

### Fungsi: `handleQuickRole(email, pass, roleName, roleKey)`

* **Tujuan**:
  Memudahkan pengguna, penguji, dan barista berpindah akun peran (Barista, Supervisor, Owner) hanya dengan 1 kali klik tanpa perlu mengetik manual.

* **Input / Parameter**:
  * `email` (*string*): Alamat email akun demo (contoh: `"barista@kafe.com"`).
  * `pass` (*string*): Kata sandi akun demo (contoh: `"password"`).
  * `roleName` (*string*): Nama tampilan peran (contoh: `"Barista Bar Utama"`).
  * `roleKey` (*'barista' | 'supervisor' | 'owner'*): Kunci identitas peran untuk styling aktif.

* **Alur Logika Bisnis (Langkah demi Langkah)**:
  1. Komputer memanggil `setData(...)` untuk mengisi nilai formulir `email` dan `password` secara otomatis di memori Inertia.
  2. Komputer memperbarui `activeRole` dengan `roleKey` sehingga kartu role yang dipilih mendapatkan garis tepi aktif (*amber focus ring*).
  3. Komputer memunculkan pesan toast konfirmasi: `"Kredensial demo aktif: [Nama Role] ([Email])"`.

* **Output / Return Value**:
  Tidak mengembalikan nilai (*void*), fungsi langsung memperbarui state internal komponen.

* **Kaitan dengan Bagian Lain**:
  * Data email dan password yang dimuat sesuai dengan data awal yang disemai oleh [`database/seeders/UserSeeder.php`](file:///E:/Uas_PL/UAS_Pemrograman_Lanjut/database/seeders/UserSeeder.php).

---

### Fungsi: `submit(e)`

* **Tujuan**:
  Mengirimkan kredensial login pengguna ke backend Laravel secara aman melalui Inertia.js tanpa memicu reload halaman (*single page application transition*).

* **Input / Parameter**:
  * `e` (*FormEvent*): Peristiwa submit formulir dari browser.

* **Alur Logika Bisnis (Langkah demi Langkah)**:
  1. Komputer menjalankan `e.preventDefault()` agar peramban tidak melakukan refresh halaman secara konvensional.
  2. Komputer memicu permintaan HTTP POST menggunakan `post(route('login'), ...)` ke server backend.
  3. Komputer mengaktifkan status `processing = true` sehingga tombol login menampilkan animasi putar (*loading spinner*) dengan teks `"Memverifikasi Akses FEFO..."`.
  4. Ketika proses otentikasi selesai (`onFinish`), komputer mereset kolom sandi demi keamanan. Jika kredensial salah, pesan error otomatis disalurkan ke komponen `<InputError />`.

* **Output / Return Value**:
  Tidak ada nilai kembalian langsung; browser akan diarahkan oleh Laravel ke Dasbor sesuai peran pengguna jika sukses, atau tetap di halaman login dengan pesan error jika gagal.

* **Kaitan dengan Bagian Lain**:
  * Terhubung langsung ke tabel `users` di basis data MySQL melalui `AuthenticatedSessionController@store`.

---

## 3. Rangkuman Integrasi Desain Google Stitch

Desain ini diambil langsung dari Google Stitch project **Remix of BeanFlow FEFO Barista Inventory** (Project ID: `3585613475449128159`, Screen ID: `7083997261414840596`):
1. **Gradien Panel Kiri**: Perpaduan espresso pekat `from-[#2B1810] via-[#3E2316] to-[#1C0F0A]`.
2. **Kartu Kaca Metrik**: Visualisasi rotasi 99.2% dan zero-waste `Rp 0`.
3. **Penyelarasan Ikon**: Menggunakan pustaka lokal terpasang `lucide-react` (`Coffee`, `TrendingUp`, `ShieldCheck`, `Clock`, `Lock`, `Mail`) tanpa ketergantungan CDN eksternal.
