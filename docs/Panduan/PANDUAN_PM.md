# PANDUAN KERJA KHUSUS: PROJECT MANAGER / LEAD INTEGRATOR

Dokumen ini adalah pegangan Anda sebagai Project Manager (PM) sekaligus Lead Integrator teknis tim.

---

## 1. Peran & Tanggung Jawab Utama
* **Penjaga Kualitas & Integrasi**: Memastikan branch `main` dan `develop` selalu bersih, bebas dari error build atau merge conflict.
* **Reviewer Pull Request (PR)**: Satu-satunya orang yang berwenang menekan tombol *Merge* di GitHub.
* **Jembatan Komunikasi**: Mengarahkan Backend dan Frontend agar selalu mengacu pada kontrak `resources/js/types/inventory.d.ts`.
* **Koordinator Dokumentasi Akhir (Minggu 4)**: Menyatukan seluruh bab laporan UAS dan menyiapkan skenario demo dosen.

---

## 2. Checklist Kerja Mingguan PM

### 📌 Minggu 1: Setup, Kickoff & Review Mockup UI
- [x] Inisialisasi Laravel 11 + Inertia React + TypeScript.
- [x] Siapkan kontrak tipe awal di `resources/js/types/inventory.d.ts`.
- [x] Instal dependensi UI (`lucide-react`, `recharts`, `clsx`, `tailwind-merge`).
- [ ] Buat repository di GitHub dan undang 4 anggota tim sebagai kolaborator.
- [ ] Push branch `main` dan branch `develop` ke GitHub.
- [ ] Set `develop` sebagai *Default Branch* di pengaturan repository GitHub.
- [ ] Bagikan dokumen `docs/Panduan/PANDUAN_GIT_DAN_SETUP.md` serta panduan masing-masing role ke anggota tim.
- [ ] **Review Mockup UI Google Stitch**: Tinjau hasil generasi mockup dari FE 1 (Layout, Login, Monitoring, Analytics) dan FE 2 (FEFO, Master, Waste) sebelum tim masuk ke tahap koding di Minggu 2.

### 📌 Minggu 2: Pengawalan Fitur Core & FEFO
- [ ] Pantau PR dari BE1 (Migrations & Batch Restock). Segera merge jika lolos test.
- [ ] Pantau PR dari FE1 (AppLayout & Tabel Inventaris) dan FE2 (Modal Restock & FEFO Dialog).
- [ ] Lakukan uji coba integrasi di lokal: Cek apakah data dari Controller BE berhasil tampil di antarmuka FE.

### 📌 Minggu 3: Fitur Waste Disposal & Owner Analytics
- [ ] Review PR alur Waste Approval dari BE2 dan FE2.
- [ ] Review PR Dasbor Metrik & Grafik Recharts dari BE2 dan FE1.
- [ ] Uji skenario lengkap dari login Barista -> Restock -> Pakai -> Lapor Rusak -> Approve Supervisor -> Lihat Grafik Owner.
- [ ] Merge branch `develop` ke `main` sebagai rilis stabil (Release Candidate).

### 📌 Minggu 4: Pembekuan Kode & Finalisasi Dokumen UAS
- [ ] Kunci kode (*Code Freeze*): Tidak boleh ada penambahan fitur baru, hanya perbaikan bug kritis.
- [ ] Bagi bab laporan UAS kepada 4 anggota tim sesuai tabel di dokumen perencanaan.
- [ ] Gabungkan seluruh bab menjadi satu dokumen laporan resmi (PDF).
- [ ] Latihan live demo bersama tim sebelum hari presentasi dosen.

---

## 3. SOP Meninjau & Menggabungkan Pull Request (PR Review Guide)
Saat anggota tim membuat PR ke `develop`:
1. Buka tab **Pull requests** di GitHub.
2. Klik tab **Files changed**:
   * Periksa apakah anggota hanya mengubah file tugasnya atau menyentuh file orang lain.
   * Pastikan tidak ada credential rahasia di file `.env`.
3. Jika kode sudah bersih dan tidak ada konflik:
   * Klik tombol hijau **Merge pull request** (pilih *Squash and merge* atau *Create a merge commit*).
   * Konfirmasi merge.
4. Beritahu seluruh anggota di grup:
   *"Guys, PR [nama fitur] sudah dimerge ke develop. Jangan lupa git checkout develop && git pull origin develop sebelum lanjut ngoding ya!"*
