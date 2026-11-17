# Penjelasan Modul 13: Komponen Lencana Kedaluwarsa Lampu Lalu Lintas (`ExpiryBadge.tsx`)
## Panduan Pemula — Sistem Pemantauan Masa Kadaluwarsa dan Inventaris Kafe

> **Untuk Siapa**: Tim mahasiswa pengembang antarmuka yang mempelajari pembuatan komponen visual indikator urgensi tanggal kedaluwarsa (*Traffic-Light Early Warning System*) dan penanda prioritas rotasi FEFO (*First Expired, First Out*).  
> **Berkas Terkait**: [`resources/js/Components/ExpiryBadge.tsx`](file:///E:/Uas_PL/UAS_Pemrograman_Lanjut/resources/js/Components/ExpiryBadge.tsx)  
> **Desain Asli (Google Stitch)**: Screen ID `45fe473f2c894ed188635a066a2b9cbd` (Project ID: `6809982526338826771` - "[EXPORT MCP #3] ExpiryBadge.tsx - BeanFlow Component").  
> **Aset Desain Tersimpan**: [`docs/stitch/expiry_badge_component.html`](file:///E:/Uas_PL/UAS_Pemrograman_Lanjut/docs/stitch/expiry_badge_component.html) & [`docs/stitch/expiry_badge_component.png`](file:///E:/Uas_PL/UAS_Pemrograman_Lanjut/docs/stitch/expiry_badge_component.png).

---

## 1. Analogi Dunia Nyata Kafe: "Label Stiker Warna di Kotak Susu"

Di meja bar kafe saat jam sibuk (*rush hour*), barista tidak punya waktu luang untuk membaca tulisan kecil tanggal kedaluwarsa pada kotak karton susu di dalam kulkas *chiller*.

Oleh karena itu, kafe memasang **Sistem Stiker Berwarna (Lampu Lalu Lintas)**:
* 🟢 **Stiker Hijau (Aman / Safe)**: Ditempel jika susu baru datang dan masa kedaluwarsanya masih **lebih dari 7 hari**. Barista tahu bahan ini sangat segar dan aman disimpan.
* 🟡 **Stiker Kuning (Warning / Segera Pakai)**: Ditempel jika sisa masa kelayakan tinggal **3 sampai 7 hari**. Barista diingatkan untuk segera menggunakannya sebelum basi.
* 🔴 **Stiker Merah Berkedip (Kritis / Basi)**: Ditempel jika sisa hari tinggal **kurang dari 3 hari** atau bahkan sudah melewati hari ini. Stiker ini berdenyut (*pulsing*) untuk mendesak barista menghabiskannya hari ini juga atau melaporkannya ke supervisor sebagai bahan rusak.
* ⭐ **Lencana Bintang Espresso (Rekomendasi FEFO)**: Tanda prioritas emas bertuliskan `[★ Rekomendasi FEFO]` untuk batch nomor 1 yang paling wajib diambil lebih dahulu sesuai prinsip rotasi First-Expired, First-Out.

---

## 2. Penjelasan Per Komponen & Per Fungsi

---

### Komponen Utama: `ExpiryBadge({ daysLeft, status, isFefoRecommended, size, label, showDot, ...props })`

* **Tujuan**:
  Menyediakan komponen label/lencana visual tunggal yang modular, konsisten, dan dapat digunakan berulang kali di seluruh tabel, kartu bahan, drawer aksi, dan dasbor sistem BeanFlow untuk menampilkan status kedaluwarsa secara cepat dalam 1 detik pandang.

* **Input / Props**:
  * `daysLeft` (*number*, opsional): Sisa hari kedaluwarsa bahan baku (contoh: `12`, `4`, atau `1`).
  * `status` (*UrgencyStatus* - `'safe' | 'warning' | 'critical'`, opsional): Status eksplisit dari backend jika sudah dihitung sebelumnya via Carbon.
  * `isFefoRecommended` (*boolean*, default `false`): Penanda apakah batch fisik ini merupakan rekomendasi nomor 1 algoritma FEFO.
  * `size` (*'sm' | 'md' | 'lg'*, default `'md'`): Ukuran lencana kapsul (kecil untuk tabel padat, sedang untuk kartu, besar untuk header).
  * `label` (*string*, opsional): Teks kustom jika ingin menimpa (*override*) label otomatis.
  * `showDot` (*boolean*, default `true`): Opsi menampilkan titik lampu indikator bundar di sisi kiri teks.
  * `className` (*string*, opsional): Kelas tambahan Tailwind untuk kustomisasi khusus.

* **Alur Logika Bisnis (Langkah demi Langkah)**:
  1. Komputer mengecek apakah properti `isFefoRecommended` bernilai `true`. Jika ya, komputer langsung merender varian khusus **Espresso Bean Signature (`#4A2C11`)** dengan ikon bintang karamel `★ Rekomendasi FEFO`.
  2. Jika bukan rekomendasi FEFO khusus, komputer memanggil fungsi internal `resolveStatus()` untuk menentukan tingkat keparahan:
     * Jika `daysLeft > 7`: Diklasifikasikan sebagai `safe` (🟢 Aman).
     * Jika `3 <= daysLeft <= 7`: Diklasifikasikan sebagai `warning` (🟡 Segera Pakai).
     * Jika `daysLeft < 3` atau `<= 0`: Diklasifikasikan sebagai `critical` (🔴 Kritis / Kedaluwarsa).
  3. Komputer mencocokkan status yang didapat dengan objek konfigurasi gaya `statusConfig`:
     * Memilih palet warna background, border, dan teks yang sesuai dengan kontrak [Desain.md](file:///E:/Uas_PL/UAS_Pemrograman_Lanjut/Desain.md).
     * Untuk status `critical`, komputer otomatis menambahkan animasi denyut Tailwind `animate-pulse` agar menarik perhatian barista di bar.
  4. Komputer menggabungkan kelas CSS menggunakan helper bawaan `cn(...)` dan merender elemen `<span>` berbentuk kapsul bundar (`rounded-full`).

* **Output / Return Value**:
  Elemen JSX `<span>` bergaya kapsul dengan kontras warna tinggi yang mudah dibaca oleh barista dan supervisor.

* **Kaitan dengan Bagian Lain**:
  * Digunakan pada tabel kartu dasbor barista ([Dashboard.tsx](file:///E:/Uas_PL/UAS_Pemrograman_Lanjut/resources/js/Pages/Dashboard.tsx)).
  * Digunakan pada tabel inventaris `Inventory/Index.tsx` dan laci aksi pemakaian FEFO `FefoUsageSlideOverDrawer.tsx`.
  * Menghormati tipe data TypeScript di [`resources/js/types/inventory.d.ts`](file:///E:/Uas_PL/UAS_Pemrograman_Lanjut/resources/js/types/inventory.d.ts).

---

### Fungsi Internal: `resolveStatus()`

* **Tujuan**:
  Menghitung dan menyimpulkan status urgensi lampu lalu lintas secara otomatis jika komponen hanya menerima input angka sisa hari (`daysLeft`).

* **Input / Parameter**:
  * Mengakses variabel lingkup komponen: `status` dan `daysLeft`.

* **Alur Logika Bisnis (Langkah demi Langkah)**:
  1. Jika properti `status` sudah diisi langsung oleh pemanggil, komputer langsung mengembalikan nilai tersebut.
  2. Jika `daysLeft` tidak diberikan (undefined), komputer menganggap stok masih dalam kondisi aman secara default (`'safe'`).
  3. Komputer mengecek apakah `daysLeft < 3`. Jika ya, kembalikan `'critical'`.
  4. Komputer mengecek apakah `daysLeft <= 7`. Jika ya, kembalikan `'warning'`.
  5. Jika lebih dari 7 hari, kembalikan `'safe'`.

* **Output / Return Value**:
  Nilai tipe bertipe `UrgencyStatus` (`'safe' | 'warning' | 'critical'`).

* **Kaitan dengan Bagian Lain**:
  Menjamin logika bisnis pembagian hari kedaluwarsa konsisten 100% di seluruh aplikasi tanpa duplikasi kode `if/else`.

---

## 3. Matriks Ragam Varian Visual ExpiryBadge

| Kategori Status | Kondisi Sisa Hari | Warna Background & Border | Warna Teks | Efek Khusus | Contoh Teks Bawaan |
| :--- | :--- | :--- | :--- | :---: | :--- |
| **Aman** | Sisa hari > 7 | `bg-emerald-50 border-emerald-300` | `text-emerald-800` | Titik hijau botani | `🟢 Aman (12 hari)` |
| **Warning** | Sisa hari 3 s/d 7 | `bg-[#FFF7ED] border-[#FED7AA]` | `text-[#C88242]` | Titik amber karamel | `🟡 Segera Pakai (4 hari)` |
| **Kritis** | Sisa hari < 3 | `bg-[#FDF2F0] border-[#F8C6BF]` | `text-[#8C3D2B]` | `animate-pulse` | `🔴 Kritis (1 hari / Besok)` |
| **Basi / Kadaluwarsa** | Sisa hari <= 0 | `bg-[#FDF2F0] border-[#F8C6BF]` | `text-[#8C3D2B]` | `animate-pulse` | `🔴 Kedaluwarsa` |
| **Rekomendasi FEFO** | `isFefoRecommended` | `bg-[#4A2C11] border-[#C88242]/40` | `text-[#FAF7F2]` | Bintang emas `★` | `★ Rekomendasi FEFO` |
