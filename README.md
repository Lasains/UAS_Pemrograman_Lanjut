# Sistem Pemantauan Masa Kadaluwarsa dan Inventaris Bahan Baku Kafe
> **Tugas Besar Mata Kuliah Pemrograman Lanjut (UAS)**  
> **Tech Stack**: Laravel 11, Inertia.js (React 18 + TypeScript), Tailwind CSS, shadcn/ui, Recharts, MySQL

---

## ☕ Tentang Proyek
Aplikasi web terpadu untuk memodernisasi manajemen inventaris kedai kopi (*coffee shop*). Sistem ini mencatat stok berbasis *multi-batch* dan menerapkan algoritma **First Expired, First Out (FEFO)** serta sistem peringatan dini (*early warning indicator*) untuk mencegah kerugian finansial akibat pembusukan bahan baku sensitif (seperti susu segar, sirup perisa, dan biji kopi).

Sistem memiliki **3 Peran Pengguna (RBAC)**:
1. **Owner**: Memantau metrik finansial, total nilai aset bahan, dan grafik tren kerugian bahan terbuang (*waste*).
2. **Supervisor**: Mengelola master data bahan, mengatur ambang batas peringatan, dan menyetujui pemusnahan bahan rusak (*approval write-off*).
3. **Barista**: Mencatat pemakaian harian dengan rekomendasi otomatis FEFO, menerima batch baru (*restock*), dan melaporkan bahan rusak/basi.

---

## 📚 Panduan Lengkap Sesuai Peran Anggota Tim (5 Orang)

Untuk mempermudah pengerjaan dan mencegah bentrok kode (*merge conflict*), panduan telah dipisahkan secara spesifik untuk masing-masing anggota:

| Peran Anggota | Penanggung Jawab | Tautan Panduan Kerja Lengkap |
| :--- | :--- | :--- |
| **Umum (Semua Anggota)** | Seluruh Tim | 📖 [Panduan Setup Awal & Aturan Git](docs/PANDUAN_GIT_DAN_SETUP.md) |
| **Project Manager & Integrator** | PM (Anda) | 📖 [Panduan Khusus Project Manager](docs/PANDUAN_PM.md) |
| **Backend Developer 1** | Anggota 2 | 📖 [Panduan Khusus Backend 1 (Database, Batch & FEFO)](docs/PANDUAN_BACKEND_1.md) |
| **Backend Developer 2** | Anggota 3 | 📖 [Panduan Khusus Backend 2 (Master, Warning & Waste)](docs/PANDUAN_BACKEND_2.md) |
| **Frontend Developer 1** | Anggota 4 | 📖 [Panduan Khusus Frontend 1 (Layout RBAC & Tabel)](docs/PANDUAN_FRONTEND_1.md) |
| **Frontend Developer 2** | Anggota 5 | 📖 [Panduan Khusus Frontend 2 (Modal Form & Dialog FEFO)](docs/PANDUAN_FRONTEND_2.md) |

---

## 🚀 Panduan Ringkas Menjalankan Proyek (Quick Start)

### 1. Prasyarat Sistem
* PHP >= 8.2 & Composer
* Node.js >= 18 & NPM
* MySQL (XAMPP / Laragon)

### 2. Instalasi Dependensi & Menjalankan Server
```bash
# 1. Salin file environment
cp .env.example .env

# 2. Instal dependensi backend & frontend
composer install
npm install

# 3. Generate key & migrasi database awal
php artisan key:generate
php artisan migrate --seed

# 4. Jalankan aplikasi (buka di dua terminal berbeda):
# Terminal 1:
php artisan serve

# Terminal 2:
npm run dev
```
Akses sistem di browser melalui: **`http://localhost:8000`**

---

## 🌿 Aturan Cabang Git (Git Branching Rules)
1. **`main`**: Kode stabil dan teruji untuk presentasi dosen.
2. **`develop`**: Pusat penggabungan fitur seluruh anggota tim.
3. **`feat/<nama-fitur>-<inisial>`**: Cabang kerja mandiri masing-masing anggota.
4. **Wajib Pull Request (PR)**: Dilarang melakukan push langsung ke `main` atau `develop`. Semua perubahan harus melalui review PR oleh PM.
