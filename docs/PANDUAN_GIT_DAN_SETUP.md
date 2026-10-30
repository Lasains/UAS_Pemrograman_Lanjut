# PANDUAN SETUP AWAL & ATURAN GIT (UNTUK SEMUA ANGGOTA TIM)

Dokumen ini adalah panduan wajib bagi seluruh anggota tim (PM, BE 1, BE 2, FE 1, FE 2) saat pertama kali mengunduh proyek ini di komputer masing-masing.

---

## 1. Persiapan Software (Prerequisites)
Pastikan komputer Anda sudah terinstal:
* **PHP**: Minimal versi 8.2 (Cek: `php -v`)
* **Composer**: Pengelola paket PHP (Cek: `composer -V`)
* **Node.js**: Minimal versi 18+ (Cek: `node -v`)
* **Git**: Pengelola versi kode (Cek: `git --version`)
* **Database**: MySQL (via XAMPP/Laragon) atau SQLite.

---

## 2. Langkah Clone & Menjalankan Proyek (Local Setup)

Lakukan urutan perintah berikut di Terminal / Command Prompt:

```bash
# 1. Clone repository ke komputer Anda
git clone <URL_REPOSITORY_GITHUB_DARI_PM>
cd <NAMA_FOLDER_PROJEK>

# 2. Checkout ke branch develop (pusat integrasi kita)
git checkout develop

# 3. Instal dependensi backend (Composer)
composer install

# 4. Instal dependensi frontend (NPM)
npm install

# 5. Siapkan file konfigurasi .env
cp .env.example .env

# 6. Generate application key
php artisan key:generate

# 7. Sesuaikan koneksi database di file .env:
# (Jika menggunakan MySQL XAMPP: DB_CONNECTION=mysql, DB_DATABASE=kafe_fefo, DB_USERNAME=root, DB_PASSWORD=)
# (Atau jika menggunakan SQLite: DB_CONNECTION=sqlite)

# 8. Jalankan migrasi dan seeder database awal
php artisan migrate --seed

# 9. Jalankan server lokal:
# Buka Terminal 1:
php artisan serve

# Buka Terminal 2:
npm run dev
```
Buka browser di: `http://localhost:8000`.

---

## 3. SOP Alur Kerja Git Harian (PENTING AGAR TIDAK CONFLICT!)

> [!CAUTION]
> **ATURAN MUTLAK**: 
> 1. JANGAN PERNAH menjalankan `git push` langsung ke branch `main` atau `develop`!
> 2. Selalu buat branch fitur sendiri dengan format: `feat/<nama-fitur>-<inisial-anda>` (contoh: `feat/batch-migration-be1`).

### Rutinitas Harian Anggota:
Setiap kali Anda ingin mulai mengerjakan tugas baru:

```bash
# Langkah A: Pastikan branch develop di komputer Anda sudah yang paling baru
git checkout develop
git pull origin develop

# Langkah B: Buat branch baru untuk tugas spesifik Anda
git checkout -b feat/nama-tugas-anda

# Langkah C: Mulai ngoding...
# Hanya sentuh file yang menjadi tanggung jawab role Anda!

# Langkah D: Simpan dan commit pekerjaan Anda
git add .
git commit -m "feat: tambahkan fungsi X sesuai task"

# Langkah E: Unggah ke GitHub
git push -u origin feat/nama-tugas-anda

# Langkah F: Buka GitHub di Browser
# Klik tombol "Compare & Pull Request".
# Arahkan base branch ke: 'develop' (BUKAN 'main').
# Beritahu PM di grup chat untuk memeriksa dan me-merge PR Anda.
```
