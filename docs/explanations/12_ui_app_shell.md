# Penjelasan Modul 12: Layout Kerangka Utama & Navigasi RBAC (BeanFlow App Shell)
## Panduan Pemula — Denah Rumah & Jalur Navigasi Kafe

> **Untuk Siapa Dokumen Ini**: Tim mahasiswa pemula yang ingin memahami arsitektur *Universal App Shell*, cara kerja filter navigasi berdasarkan peran (*Role-Based Access Control*), status indikator sinkronisasi sistem, serta integrasi kanvas konten dinamis di React & Inertia.js.  
> **Analogi Dunia Nyata**: Bayangkan layout kafe fisik. Ada area bar depan (tempat Barista meracik), pintu gudang belakang (hanya Supervisor yang boleh masuk mengatur stok), dan kantor manajer di lantai dua (tempat Owner membaca pembukuan). Semua orang berada di satu bangunan kafe yang sama (App Shell), tetapi tanda pengenal di seragam mereka menentukan pintu mana saja yang bisa dibuka.  
> **Kaitan dengan Kode**: [`resources/js/Layouts/AuthenticatedLayout.tsx`](../../resources/js/Layouts/AuthenticatedLayout.tsx), [`resources/js/Layouts/AppLayout.tsx`](../../resources/js/Layouts/AppLayout.tsx), dan [`resources/js/Pages/Dashboard.tsx`](../../resources/js/Pages/Dashboard.tsx).

---

## 1. Komponen: `AuthenticatedLayout({ header, children })`

* **Tujuan**: Menjadi "kerangka induk universal" (*universal application shell*) satu pintu untuk seluruh halaman aplikasi setelah pengguna berhasil login. Menjamin Sidebar 260px di kiri, Header 64px di atas, dan area konten utama selalu konsisten di setiap modul tanpa perlu membuat ulang navigasi.
* **Input / Parameter**:
  * `header` *(ReactNode opsional)*: Judul halaman atau elemen breadcrumb yang ditampilkan di bilah atas (*top bar*).
  * `children` *(PropsWithChildren)*: Konten halaman spesifik yang akan dimasukkan (*injected*) ke dalam kanvas kerja utama.
* **Alur Logika Bisnis (Langkah demi Langkah)**:
  1. Komputer membaca data pengguna yang sedang login melalui `usePage().props.auth.user`.
  2. Komputer mendeteksi peran pengguna (`role`: `'barista'`, `'supervisor'`, atau `'owner'`).
  3. Memanggil `getRoleMeta(user.role)` untuk mengambil warna badge, ikon lencana, serta keterangan shift yang sesuai.
  4. Menyusun antarmuka dalam 2 bagian besar:
     - **Sidebar Kiri**: Menampilkan menu navigasi yang otomatis disaring (*filtered*) sesuai hak akses pengguna.
     - **Bilah Atas & Kanvas**: Menampilkan indikator sinkronisasi hijau berkedip, kapsul badge peran, avatar inisial, dan slot konten halaman (`children`).
  5. Menampilkan banner notifikasi kilat (*flash messages*) jika ada pemberitahuan sukses, peringatan, atau error dari backend.
* **Output / Return Value**: Struktur layout web terpadu dengan scrolling independen pada kanvas tengah.
* **Kaitan dengan Bagian Lain**: Membungkus halaman `Dashboard.tsx`, serta halaman operasional FEFO, batch intake, dan waste reporting di masa mendatang.

---

## 2. Fungsi: `getRoleMeta(role)`

* **Tujuan**: Menerjemahkan peran pengguna menjadi identitas visual yang mudah dikenali dalam 1 detik pandang (*glanceable UI*).
* **Input / Parameter**:
  * `role: Role`: String peran pengguna (`'barista' | 'supervisor' | 'owner'`).
* **Alur Logika Bisnis (Langkah demi Langkah)**:
  1. Komputer mengecek nilai parameter `role` menggunakan percabangan `switch`.
  2. Jika `'barista'`: Mengembalikan lencana hijau botani (`bg-emerald-50 text-emerald-800`), ikon cangkir kopi, dan widget konteks shift bar: *"Shift Pagi: Bar Utama & Rotasi FEFO"*.
  3. Jika `'supervisor'`: Mengembalikan lencana amber karamel (`bg-[#FFF7ED] text-[#C88242]`), ikon clipboard, dan widget pengawasan gudang: *"Gudang & Kontrol Mutu"*.
  4. Jika `'owner'`: Mengembalikan lencana perkamen eksekutif (`bg-[#EDE4DC]`), ikon grafik, dan widget finansial: *"Manajemen Finansial & Valuasi"*.
* **Output / Return Value**: Objek konfigurasi metadata visual peran:
  ```typescript
  {
      label: string;
      badgeClass: string;
      icon: LucideIcon;
      widgetTitle: string;
      widgetSub: string;
      widgetIcon: LucideIcon;
  }
  ```
* **Kaitan dengan Bagian Lain**: Digunakan oleh Header untuk merender lencana peran dan bagian bawah Sidebar untuk merender kartu konteks kerja.

---

## 3. Fungsi: `resolveHref(item)`

* **Tujuan**: Menjamin navigasi menu tidak akan pernah menyebabkan aplikasi rusak (*crash*) jika ada rute Laravel berwujud Ziggy yang belum terdaftar di `routes/web.php`.
* **Input / Parameter**:
  * `item: NavItem`: Objek data menu yang berisi nama rute (`routeName`) dan URL cadangan (`url`).
* **Alur Logika Bisnis (Langkah demi Langkah)**:
  1. Komputer mencoba mengecek apakah fungsi pembantu `route()` tersedia dan memiliki rute dengan nama `item.routeName` (`route().has(item.routeName)`).
  2. Jika rute terdaftar di Laravel: Menghasilkan URL resmi dari Ziggy (misal: `route('dashboard.barista')`).
  3. Jika rute belum selesai dibuat di backend: Komputer secara aman menggunakan URL statis cadangan (`item.url`, misal: `'/dashboard/barista'`) tanpa melempar fatal error.
* **Output / Return Value**: String URL tujuan yang aman dan valid.
* **Kaitan dengan Bagian Lain**: Digunakan pada setiap tag `<Link href={...}>` di daftar menu sidebar.

---

## 4. Fungsi: `checkActive(item)`

* **Tujuan**: Menentukan apakah sebuah menu di sidebar sedang aktif dibuka oleh pengguna, sehingga sistem bisa memberikan efek sorotan visual (*highlight*) cokelat espresso hangat.
* **Input / Parameter**:
  * `item: NavItem`: Objek data menu yang sedang dievaluasi.
* **Alur Logika Bisnis (Langkah demi Langkah)**:
  1. Komputer membaca URL halaman web saat ini di browser (`window.location.pathname`).
  2. Jika menu memiliki logika pencocokan khusus (`item.activeMatch`): Komputer memanggil fungsi tersebut (misal: jika barista sedang berada di `/dashboard`, menu *Dasbor Barista* otomatis menyala).
  3. Jika rute Ziggy tersedia, komputer mengecek `route().current(item.routeName)`.
  4. Jika cocok, menu diberi kelas CSS aktif: latar perkamen `#EDE4DC`, teks tebal cokelat sangrai `#4A2C11`, dan titik indikator bulat di sebelah kanan.
* **Output / Return Value**: `true` jika menu aktif, atau `false` jika tidak aktif.
* **Kaitan dengan Bagian Lain**: Mengontrol gaya visual pada elemen tautan menu sidebar.

---

## 5. Fungsi: `handleClickOutside(event)`

* **Tujuan**: Menutup menu pop-up profil pengguna secara otomatis jika pengguna mengklik area mana pun di luar kotak menu tersebut (*click outside to dismiss*).
* **Input / Parameter**:
  * `event: MouseEvent`: Objek kejadian klik mouse di layar.
* **Alur Logika Bisnis (Langkah demi Langkah)**:
  1. Komputer mendeteksi koordinat elemen HTML yang baru saja diklik pengguna.
  2. Memeriksa apakah elemen yang diklik berada di dalam referensi kotak dropdown (`dropdownRef.current`).
  3. Jika klik terjadi di luar kotak: Mengubah state `setUserDropdownOpen(false)` sehingga menu tertutup rapi.
* **Output / Return Value**: Tidak mengembalikan nilai (*void*); mengubah state tampilan.
* **Kaitan dengan Bagian Lain**: Terhubung dengan *hook* `useEffect` pada menu profil di pojok kanan atas Header.
