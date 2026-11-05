# MASTER LIST PROMPT PERENCANAAN DESAIN FRONTEND (PER-FITUR)
## Sistem Pemantauan Masa Kadaluwarsa dan Inventaris Kafe (Laravel 11 + Inertia.js React + shadcn/ui)

> **Tujuan Dokumen**: Dokumen ini merupakan katalog prompt siap pakai (*production-ready prompts*) berbasis **Prompt Engineering Patterns**. Setiap prompt dirancang untuk dijalankan ke AI (ChatGPT, Claude, Gemini, atau Subagent coding) guna menghasilkan dokumen spesifikasi desain mandiri (*Design Plan*) per-fitur di folder `docs/Plan Frontend/`.
> 
> **Pendekatan Dual-Purpose**: Setiap plan yang dihasilkan AI memuat:
> 1. **Stitch UI Prompt & Screen Specification**: Spesifikasi visual terstruktur yang siap dimasukkan ke Google Stitch (`generate_screen_from_text`) untuk menghasilkan mockup antarmuka terlebih dahulu.
> 2. **Arsitektur Teknis Frontend (React + TypeScript)**: Rencana komponen shadcn/ui, integrasi Inertia `useForm`, kontrak tipe data dari `resources/js/types/inventory.d.ts`, dan penanganan *edge cases*.

---

## DAFTAR MODUL FITUR & TARGET OUTPUT

| No | Nama Modul Fitur | Persona Pengguna | Target File Plan yang Dihasilkan |
| :---: | :--- | :--- | :--- |
| **01** | Autentikasi & Login Multi-Role | Barista, Supervisor, Owner | `docs/Plan Frontend/PLAN_01_AUTH_LOGIN.md` |
| **02** | Shell Layout Utama & Navigasi RBAC | Barista, Supervisor, Owner | `docs/Plan Frontend/PLAN_02_APP_LAYOUT_RBAC.md` |
| **03** | Dasbor Barista & Pemakaian Stok FEFO | Barista | `docs/Plan Frontend/PLAN_03_BARISTA_OPERASIONAL_FEFO.md` |
| **04** | Master Data Bahan Baku & Kategori | Supervisor | `docs/Plan Frontend/PLAN_04_SUPERVISOR_MASTER_DATA.md` |
| **05** | Monitoring Inventaris & Kedaluwarsa | Supervisor & Barista | `docs/Plan Frontend/PLAN_05_SUPERVISOR_MONITORING_INVENTARIS.md` |
| **06** | Pelaporan & Approval Pemusnahan (Waste) | Barista (Lapor) & Supervisor (Approve) | `docs/Plan Frontend/PLAN_06_WASTE_APPROVAL_CENTER.md` |
| **07** | Dasbor Analitik & Finansial Eksekutif | Owner | `docs/Plan Frontend/PLAN_07_OWNER_ANALYTICS_DASHBOARD.md` |

---

## PANDUAN PENGGUNAAN PROMPT

1. **Pilih Fitur yang Akan Dikerjakan**: Ambil salah satu prompt di bawah sesuai nomor modul yang ingin Anda buatkan perencanaannya.
2. **Jalankan Prompt**: Salin (*copy*) seluruh blok teks prompt (mulai dari `### ROLE & OBJECTIVE` sampai akhir template) dan masukkan ke AI asisten Anda.
3. **Simpan Hasilnya**: Pastikan AI menyimpan atau Anda menyimpan teks output ke direktori `docs/Plan Frontend/` dengan nama file yang telah ditentukan (contoh: `PLAN_01_AUTH_LOGIN.md`).
4. **Alur ke Google Stitch**: Gunakan bagian **Stitch UI Prompt** yang ada di dalam dokumen plan hasil AI tersebut untuk membuat prototipe visual layar di Google Stitch.

---

```markdown
<!-- ============================================================================== -->
<!-- PROMPT 01: AUTENTIKASI & LOGIN MULTI-ROLE                                      -->
<!-- ============================================================================== -->
```

### PROMPT 01: Autentikasi & Login Multi-Role (Barista, Supervisor, Owner)

```text
Anda adalah seorang Senior UI/UX Designer dan Lead Frontend Architect yang ahli dalam ekosistem React 18, Inertia.js, Tailwind CSS, dan promptcrafting untuk Google Stitch.

TUGAS ANDA:
Buatlah dokumen spesifikasi desain komprehensif untuk "Modul 01: Autentikasi & Login Multi-Role" pada aplikasi Sistem Inventaris & Pemantauan Kedaluwarsa Kafe. Dokumen ini WAJIB disimpan di `docs/Plan Frontend/PLAN_01_AUTH_LOGIN.md`.

KONTEKS BISNIS & PERSONA:
1. Sistem memiliki 3 peran (*roles*):
   - 'barista': Pengguna operasional bar, butuh login cepat saat shift bar dimulai.
   - 'supervisor': Penanggung jawab gudang & master data.
   - 'owner': Pemilik kafe yang fokus pada metrik bisnis.
2. Untuk kemudahan evaluasi tugas kuliah (demo dosen) dan kepraktisan kafe, layar login harus menyediakan antarmuka login kredensial standar (Email & Password) SERTA tombol/kartu "One-Click Quick Login Demo Account" (pilihan cepat login sebagai Barista, Supervisor, atau Owner tanpa mengetik password).
3. Setelah login berhasil, sistem melakukan redirection cerdas:
   - Barista -> `/dashboard/barista` (Operasional Bar & FEFO)
   - Supervisor -> `/inventory` atau `/dashboard/supervisor`
   - Owner -> `/dashboard/owner` (Executive Analytics)

DESIGN CONTRACT & ATURAN VISUAL:
- Ikuti panduan visual dari Desain.md:
  * Background: Steamed Milk Canvas (`bg-surface-canvas` `#FAF7F2`).
  * Card form: `bg-surface-container` (`#F5EFEB`), border `border-surface-border` (`#EDE4DC`), radius `rounded-xl`, shadow halus `shadow-sm`.
  * Brand Accent: Deep Roasted Espresso (`bg-brand-primary` `#4A2C11`, `hover:bg-brand-primary-hover`) & Warm Caramel Amber (`bg-brand-secondary` `#C88242`).
  * Tipografi: Sans-serif modern, judul form `text-xl font-semibold text-content-high` (`#241408`).
  * Logo & Identitas: Nuansa warm artisan specialty coffee house.

STRUKTUR DOKUMEN OUTPUT YANG WAJIB ANDA HASILKAN:
Dokumen `docs/Plan Frontend/PLAN_01_AUTH_LOGIN.md` harus memiliki bab-bab berikut:
1. Ringkasan Fitur & Analisis Persona (User flow login, keamanan, session flash).
2. STITCH-READY SCREEN SPECIFICATION (Google Stitch Prompt):
   - Screen Title & Purpose.
   - Layout & Composition (Centered card, split screen, ilustrasi coffee bar).
   - Component Breakdown (Logo, form input, quick switcher cards, submit button).
   - Color & Style Tokens yang digunakan.
   - Teks prompt deskriptif bahasa Indonesia & Inggris ringkas yang siap di-copy ke tool Stitch (`generate_screen_from_text`).
3. ARSITEKTUR TEKNIS FRONTEND (REACT + INERTIA):
   - Path File: `resources/js/Pages/Auth/Login.tsx` dan `resources/js/Layouts/GuestLayout.tsx`.
   - Komponen UI: Button, Input, Checkbox, Card, Label, Alert dari shadcn/ui.
   - Kontrak Props & Data TypeScript (mengacu pada User & Role di `resources/js/types/inventory.d.ts`).
   - State Handling via Inertia `useForm` (data email, password, remember).
   - Penanganan Validasi & Error (tampilan pesan error kredensial salah, rate limiting).
4. EDGE CASES & ACCESSIBILITY:
   - Tombol loading state saat form disubmit (indikator spinner + disabled).
   - Mobile responsiveness untuk perangkat tablet kasir/bar.
```

---

```markdown
<!-- ============================================================================== -->
<!-- PROMPT 02: SHELL LAYOUT UTAMA & NAVIGASI RBAC                                  -->
<!-- ============================================================================== -->
```

### PROMPT 02: Shell Layout Utama & Navigasi RBAC (`AppLayout` & Responsive Sidebar)

```text
Anda adalah seorang Senior UI/UX Designer dan Lead Frontend Architect yang ahli dalam ekosistem React 18, Inertia.js, Tailwind CSS, dan promptcrafting untuk Google Stitch.

TUGAS ANDA:
Buatlah dokumen spesifikasi desain komprehensif untuk "Modul 02: Shell Layout Utama & Navigasi Dinamis Berbasis RBAC (Role-Based Access Control)". Dokumen ini WAJIB disimpan di `docs/Plan Frontend/PLAN_02_APP_LAYOUT_RBAC.md`.

KONTEKS BISNIS & PERSONA:
1. Aplikasi digunakan oleh 3 peran berbeda pada satu domain sistem: Barista, Supervisor, dan Owner.
2. Setiap peran memiliki struktur navigasi menu yang terisolasi secara ketat:
   - **Barista**: Menu [Dasbor Barista], [Catat Pemakaian (FEFO)], [Penerimaan Batch], [Lapor Bahan Rusak].
   - **Supervisor**: Memiliki seluruh menu Barista PLUS [Master Bahan & Kategori], [Monitoring Inventaris & Warning Kedaluwarsa], [Approval Center Pemusnahan].
   - **Owner**: Menu [Dasbor Analitik Eksekutif], [Laporan Finansial & Waste], [Monitoring Nilai Aset].
3. Barista sering menggunakan tablet di bar kopi; navigasi harus ramah sentuhan (*touch-friendly*), memiliki collapsible sidebar untuk layar kecil, dan header yang jelas menampilkan: Nama User, Badge Role, dan indikator koneksi/status.

DESIGN CONTRACT & ATURAN VISUAL:
- Ikuti Desain.md:
  * Sidebar: `bg-surface-container` (`#F5EFEB`) dengan border kanan `border-surface-border` (`#EDE4DC`). Item aktif menggunakan latar `bg-surface-container-high text-brand-primary font-semibold`, item inaktif `text-content-medium hover:bg-surface-container-high`.
  * Header: `bg-surface-container/95 border-b border-surface-border`, sticky di bagian atas, tinggi 64px (`h-16`).
  * Badge Role: Capsule rounded-full (Barista: Hijau Botani, Supervisor: Karamel Amber `#C88242`, Owner: Perkamen `#EDE4DC`).
  * Lucide Icons untuk setiap menu navigasi.

STRUKTUR DOKUMEN OUTPUT YANG WAJIB ANDA HASILKAN:
Dokumen `docs/Plan Frontend/PLAN_02_APP_LAYOUT_RBAC.md` harus memiliki bab-bab berikut:
1. Ringkasan Arsitektur Layout & Matriks Hak Akses Menu (Tabel pemetaan menu per role).
2. STITCH-READY SCREEN SPECIFICATION (Google Stitch Prompt):
   - Desktop Layout (Sidebar 260px fixed + Header + Dynamic Main Content area).
   - Mobile/Tablet Layout (Sheet drawer modal untuk navigasi hamburger bar).
   - Visual Styling & Hierarchy (Logo Kafe, Navigation Group, User Profile Dropdown, Logout).
   - Teks prompt siap pakai untuk Google Stitch screen generation.
3. ARSITEKTUR TEKNIS FRONTEND (REACT + INERTIA):
   - Path File: `resources/js/Layouts/AppLayout.tsx`, `resources/js/Components/Sidebar.tsx`, `resources/js/Components/Header.tsx`, `resources/js/Components/UserDropdown.tsx`.
   - Prop types: Memanfaatkan interface `User` & `Role` dari `resources/js/types/inventory.d.ts`.
   - Logika pemfilteran menu navigasi berbasis `usePage().props.auth.user.role`.
   - Flash Message Banner (Notifikasi Toast/Alert hijau untuk pesan sukses dan merah untuk error).
4. EDGE CASES & RESPONSIVE BEHAVIOR:
   - Transisi buka-tutup sidebar mobile (menggunakan Sheet shadcn/ui).
   - Role switching / otorisasi rute jika pengguna mencoba mengakses URL di luar izin perannya.
```

---

```markdown
<!-- ============================================================================== -->
<!-- PROMPT 03: DASBOR OPERASIONAL BARISTA & PEMAKAIAN STOK FEFO                    -->
<!-- ============================================================================== -->
```

### PROMPT 03: Dasbor Operasional Barista & Pemakaian Stok Berbasis FEFO Interaktif

```text
Anda adalah seorang Senior UI/UX Designer dan Lead Frontend Architect yang ahli dalam ekosistem React 18, Inertia.js, Tailwind CSS, dan promptcrafting untuk Google Stitch.

TUGAS ANDA:
Buatlah dokumen spesifikasi desain komprehensif untuk "Modul 03: Dasbor Operasional Barista & Form Pemakaian Stok Berbasis FEFO Interaktif". Dokumen ini WAJIB disimpan di `docs/Plan Frontend/PLAN_03_BARISTA_OPERASIONAL_FEFO.md`.

KONTEKS BISNIS & PERSONA BARISTA:
1. Barista bekerja di bar yang sibuk (*rush hour*). Antarmuka harus *glanceable* (dapat dipahami dalam 1 detik) dan meminimalkan klik.
2. Dasbor Barista menampilkan:
   - Shortcut Aksi Cepat (*Quick Action Cards*): **[+ Catat Pemakaian Bahan]**, **[+ Penerimaan Restock Baru]**, **[! Lapor Bahan Rusak]**.
   - Daftar "Bahan Sering Digunakan di Bar" (Fresh Milk, Espresso Beans, Karamel Sirup) beserta stok tersisa dan peringatan kadaluwarsa terdekat.
3. **LOGIKA INTI FEFO (First Expired, First Out) & SMART WARNING**:
   - Saat modal pencatatan pemakaian dibuka dan bahan dipilih:
   - Sistem menampilkan daftar seluruh batch aktif terurut dari `expiry_date` paling dekat.
   - Batch teratas otomatis diberi tanda badge mencolok `[★ REKOMENDASI FEFO - Prioritas Pakai]` dan otomatis terpilih secara *default* (`RadioGroup`).
   - Jika barista sengaja memilih batch lain yang kedaluwarsanya lebih lama (misal: karena batch lain sudah terlanjur terbuka), sistem **TIDAK LANGSUNG MENOLAK**, melainkan memunculkan dialog peringatan (**Smart Warning Dialog**).
   - Dialog peringatan mewajibkan pengisian `deviation_reason` (alasan deviasi, misal: "Kemasan batch ini sudah terlanjur terbuka di chiller"), dan tombol simpan dinonaktifkan jika alasan belum diisi minimal 5 karakter.

DESIGN CONTRACT & ATURAN VISUAL:
- Ikuti Desain.md:
  * RadioGroup kartu batch: Kartu terpilih memiliki border `border-brand-primary bg-surface-container-high`.
  * Rekomendasi FEFO Badge: `bg-brand-primary text-surface-canvas font-semibold`.
  * Dialog Smart Warning: Aksentuasi warna Karamel Amber (`border-[#FED7AA] bg-[#FFF7ED]`), tombol aksi amber tegas (`bg-brand-secondary text-white`).
  * Form modal: Dialog shadcn/ui dengan latar `bg-surface-container` dan tombol simpan espresso responsif.

STRUKTUR DOKUMEN OUTPUT YANG WAJIB ANDA HASILKAN:
Dokumen `docs/Plan Frontend/PLAN_03_BARISTA_OPERASIONAL_FEFO.md` harus memiliki bab-bab berikut:
1. Ringkasan Alur Kerja Barista & Logika Bisnis FEFO Semi-Otomatis.
2. STITCH-READY SCREEN SPECIFICATION (Google Stitch Prompt):
   - Layar 1: Dasbor Operasional Barista (Quick Action Buttons, Kartu Bahan Bar Populer).
   - Layar 2: Modal Form Pemakaian Bahan FEFO (Dropdown bahan, RadioGroup list batch, input kuantitas dengan unit ml/gram).
   - Layar 3: Pop-up AlertDialog Smart Warning Deviasi FEFO.
   - Teks prompt visual siap pakai untuk Google Stitch.
3. ARSITEKTUR TEKNIS FRONTEND (REACT + INERTIA):
   - Path File: `resources/js/Pages/Barista/Dashboard.tsx`, `resources/js/Pages/Usage/CreateUsageModal.tsx`, `resources/js/Components/SmartWarningDialog.tsx`.
   - Kontrak Props TypeScript: `Ingredient`, `IngredientBatch`, `StockUsage` dari `resources/js/types/inventory.d.ts`.
   - Logika deteksi deviasi: Membandingkan ID batch terpilih vs ID batch FEFO rekomendasi teratas (`batches[0].id`).
   - Form handling dengan Inertia `useForm`: fields `ingredient_batch_id`, `quantity_used`, `is_fefo_compliant`, `deviation_reason`, `notes`.
4. EDGE CASES & ERROR HANDLING:
   - Kuantitas melebihi `current_stock` dari batch terpilih.
   - Bahan yang dipilih tidak memiliki batch aktif (Empty batch state).
   - Barista menutup dialog peringatan tanpa mengisi alasan (revert pilihan ke batch rekomendasi FEFO).
```

---

```markdown
<!-- ============================================================================== -->
<!-- PROMPT 04: MASTER DATA BAHAN BAKU & KATEGORI                                  -->
<!-- ============================================================================== -->
```

### PROMPT 04: Master Data Bahan Baku & Kategori (Persona Supervisor)

```text
Anda adalah seorang Senior UI/UX Designer dan Lead Frontend Architect yang ahli dalam ekosistem React 18, Inertia.js, Tailwind CSS, dan promptcrafting untuk Google Stitch.

TUGAS ANDA:
Buatlah dokumen spesifikasi desain komprehensif untuk "Modul 04: Manajemen Master Data Bahan Baku & Kategori". Dokumen ini WAJIB disimpan di `docs/Plan Frontend/PLAN_04_SUPERVISOR_MASTER_DATA.md`.

KONTEKS BISNIS & PERSONA SUPERVISOR:
1. Modul ini eksklusif untuk hak akses 'supervisor' (Role Barista dan Owner hanya memiliki izin View / No Access).
2. Supervisor bertanggung jawab menjaga konsistensi katalog bahan kafe, satuan unit standar (*standard unit*), ambang batas restock (*minimum stock threshold*), dan ambang peringatan dini (*warning days threshold*).
3. Modul terdiri dari:
   - Pengelolaan Kategori (Dairy/Susu, Beans/Kopi, Syrup/Perisa, Bakery/Kue, Packaging).
   - Master Bahan Baku: Nama Bahan, Kategori, Satuan (`ml`, `gram`, `pcs`), Ambang Batas Stok Minimum, dan Pengaturan Ambang Hari Kedaluwarsa (default 3 hari sebelum basi menyalakan lampu kuning).
   - Tabel Master Bahan dilengkapi statistik total batch aktif dan kalkulasi total saldo stok.

DESIGN CONTRACT & ATURAN VISUAL:
- Ikuti Desain.md:
  * Table: shadcn/ui Table dengan header `bg-surface-container-high text-content-high font-semibold`, border `border-surface-border`.
  * Dialog/Modal Form Tambah & Edit Bahan: Form bersih berlatar `bg-surface-container` dengan label jelas, helper text ramah pemula, dan tombol espresso `bg-brand-primary`.
  * Aksi baris tabel: Dropdown Menu / Tombol Edit & Nonaktifkan.

STRUKTUR DOKUMEN OUTPUT YANG WAJIB ANDA HASILKAN:
Dokumen `docs/Plan Frontend/PLAN_04_SUPERVISOR_MASTER_DATA.md` harus memiliki bab-bab berikut:
1. Ringkasan Fitur Master Data & Otorisasi Supervisor.
2. STITCH-READY SCREEN SPECIFICATION (Google Stitch Prompt):
   - Layar Utama: Master Data Bahan dengan Filter Kategori, Search Bar, dan Tombol [+ Tambah Bahan].
   - Modal Form: Form Tambah/Ubah Bahan Baku (Input nama, select kategori, select unit, input number minimum_stock, input number warning_days).
   - Modal Kategori: Quick manager untuk kategori bahan.
   - Teks prompt visual terperinci untuk Google Stitch.
3. ARSITEKTUR TEKNIS FRONTEND (REACT + INERTIA):
   - Path File: `resources/js/Pages/Master/Ingredients/Index.tsx`, `resources/js/Pages/Master/Ingredients/IngredientModal.tsx`, `resources/js/Pages/Master/Categories/CategoryModal.tsx`.
   - Kontrak Props TypeScript: `Ingredient`, `Category` dari `resources/js/types/inventory.d.ts`.
   - Form handling dengan Inertia `useForm` (create & update mode).
   - Validasi sisi klien & pemetaan pesan error dari Laravel Form Request.
4. EDGE CASES & PERLINDUNGAN DATA:
   - Konfirmasi sebelum menghapus/menonaktifkan bahan yang masih memiliki batch aktif (mencegah broken relation).
   - Validasi angka negatif pada batas minimum stok atau hari warning.
```

---

```markdown
<!-- ============================================================================== -->
<!-- PROMPT 05: MONITORING INVENTARIS & BATCH KEDALUWARSA                          -->
<!-- ============================================================================== -->
```

### PROMPT 05: Monitoring Inventaris & Sistem Peringatan Dini Kedaluwarsa

```text
Anda adalah seorang Senior UI/UX Designer dan Lead Frontend Architect yang ahli dalam ekosistem React 18, Inertia.js, Tailwind CSS, dan promptcrafting untuk Google Stitch.

TUGAS ANDA:
Buatlah dokumen spesifikasi desain komprehensif untuk "Modul 05: Monitoring Inventaris Bahan & Sistem Peringatan Dini Kedaluwarsa (Early Warning System)". Dokumen ini WAJIB disimpan di `docs/Plan Frontend/PLAN_05_SUPERVISOR_MONITORING_INVENTARIS.md`.

KONTEKS BISNIS & LOGIKA LAMPU LALU LINTAS:
1. Sistem ini adalah inti dari pencegahan kerugian bahan basi (*food safety & anti-waste*).
2. Tiga level indikator urgensi kedaluwarsa (*Traffic Light System*):
   - 🟢 **Aman (`safe`)**: Sisa hari kedaluwarsa > 7 hari.
   - 🟡 **Peringatan Dini / Segera Pakai (`warning`)**: Sisa hari 3 hingga 7 hari.
   - 🔴 **Kritis / Sudah Kedaluwarsa (`critical`)**: Sisa hari < 3 hari atau tanggal hari ini sudah melewati `expiry_date`.
3. Indikator Stok Menipis (*Understock Warning*): Jika `total_current_stock < minimum_stock`, munculkan penanda `[Restock Segera]`.
4. Fitur Interaktif pada Antarmuka:
   - Filter Tab Cepat: `[Semua Batch]`, `[🟢 Aman]`, `[🟡 Mendekati Expired]`, `[🔴 Kritis / Expired]`.
   - Fitur Penerimaan Batch Baru (*Restock Modal*): Modal pop-up untuk mencatat batch masuk saat faktur dari supplier tiba (Nama Bahan, Kode Batch unik otomatis/manual, Tanggal Terima, Tanggal Expired, Kuantitas, Harga Beli Satuan).

DESIGN CONTRACT & ATURAN VISUAL:
- Ikuti Desain.md:
  * Komponen `ExpiryBadge`:
    - Safe: `bg-emerald-50 text-emerald-800 border-emerald-300`.
    - Warning: `bg-[#FFF7ED] text-[#C88242] border-[#FED7AA]`.
    - Critical: `bg-[#FDF2F0] text-[#8C3D2B] border-[#F8C6BF] font-medium animate-pulse`.
  * Highlight baris tabel: Batch yang kritis mendapatkan warna latar kemerahan terracotta tipis (`bg-[#FDF2F0]/80`).
  * Modal Restock: Dialog oat latte `bg-surface-container` dengan datepicker validasi minimal hari ini.

STRUKTUR DOKUMEN OUTPUT YANG WAJIB ANDA HASILKAN:
Dokumen `docs/Plan Frontend/PLAN_05_SUPERVISOR_MONITORING_INVENTARIS.md` harus memiliki bab-bab berikut:
1. Ringkasan Fitur Monitoring & Logika Perhitungan Hari Kedaluwarsa (`Carbon diffInDays`).
2. STITCH-READY SCREEN SPECIFICATION (Google Stitch Prompt):
   - Layar DataTable Inventaris: Header metrik ringkas status batch, filter tabs status kedaluwarsa, tabel hierarki (Bahan -> Expandable list batch aktif), badge warna, dan tombol aksi [+ Restock Batch].
   - Modal Form Penerimaan Batch (Restock): Input data faktur, datepicker expiry date, kalkulator total nilai rupiah batch.
   - Teks prompt visual komprehensif untuk Google Stitch.
3. ARSITEKTUR TEKNIS FRONTEND (REACT + INERTIA):
   - Path File: `resources/js/Pages/Inventory/Index.tsx`, `resources/js/Components/ExpiryBadge.tsx`, `resources/js/Pages/Inventory/RestockModal.tsx`.
   - Kontrak Props TypeScript: `Ingredient`, `IngredientBatch`, `UrgencyStatus` dari `resources/js/types/inventory.d.ts`.
   - Logika rendering dinamis badge berdasarkan `days_until_expiry` dan `urgency_status`.
   - Form handling restock batch menggunakan Inertia `useForm`.
4. EDGE CASES & PERFORMANCE:
   - Penanganan batch dengan stok 0 (`exhausted`): disembunyikan secara default atau ada toggle filter.
   - Input tanggal kedaluwarsa yang lebih lampau daripada tanggal terima (blokir dengan validasi form).
   - Skeleton loading saat pencarian atau pergantian tab status.
```

---

```markdown
<!-- ============================================================================== -->
<!-- PROMPT 06: PELAPORAN & APPROVAL PEMUSNAHAN (WASTE WRITE-OFF)                   -->
<!-- ============================================================================== -->
```

### PROMPT 06: Pelaporan & Approval Pemusnahan Bahan Rusak / Basi (Waste Write-Off)

```text
Anda adalah seorang Senior UI/UX Designer dan Lead Frontend Architect yang ahli dalam ekosistem React 18, Inertia.js, Tailwind CSS, dan promptcrafting untuk Google Stitch.

TUGAS ANDA:
Buatlah dokumen spesifikasi desain komprehensif untuk "Modul 06: Pelaporan & Approval Pemusnahan Bahan Rusak/Basi (Waste Write-Off Center)". Dokumen ini WAJIB disimpan di `docs/Plan Frontend/PLAN_06_WASTE_APPROVAL_CENTER.md`.

KONTEKS BISNIS & ALUR KERJA 2-FAKTOR (BARISTA & SUPERVISOR):
1. **Aturan Bisnis Kunci**: Sistem DILARANG melakukan *Hard Delete* pada data stok bahan yang basi atau rusak. Seluruh bahan yang tidak layak konsumsi wajib melalui alur audit *Waste Write-off*.
2. **Langkah 1 (Pelaporan oleh Barista)**:
   - Barista menemukan bahan basi (misal: susu asam di chiller, kemasan sirup pecah).
   - Barista membuka modal **[Lapor Bahan Rusak]**: memilih batch bahan, menginput kuantitas rusak, memilih alasan (Kadaluwarsa, Kemasan Bocor, Bau Asam, Lainnya), dan menulis catatan kondisi fisik.
   - Status tiket tersimpan sebagai `pending`.
3. **Langkah 2 (Verifikasi & Approval oleh Supervisor)**:
   - Supervisor membuka halaman **Pusat Approval Pemusnahan (Waste Center)**.
   - Menampilkan daftar tiket berstatus `pending` lengkap dengan: Tanggal lapor, Nama Barista, Batch Bahan, Kuantitas, serta **Kalkulasi Otomatis Nilai Kerugian Finansial Rupiah** (`financial_loss = waste_quantity * cost_per_unit`).
   - Supervisor memeriksa fisik bahan di gudang lalu menekan tombol **[Setujui Pemusnahan]** atau **[Tolak / Reject]**.
   - Saat disetujui: stok batch dipotong menjadi 0, status berubah menjadi `approved`, dan tercatat ke buku besar kerugian kafe.

DESIGN CONTRACT & ATURAN VISUAL:
- Ikuti Desain.md:
  * Badge Tiket: `pending` (Kuning Amber `#FFF7ED` text `#C88242`), `approved` (Hijau Botani `bg-emerald-50 text-emerald-800`), `rejected` (Perkamen).
  * Kartu Kalkulasi Kerugian: Highlight nominal kerugian finansial dengan warna Terracotta Cherry tebal (`text-[#8C3D2B] font-bold font-mono`).
  * Modal Konfirmasi Approval: AlertDialog dengan penjelasan tegas bahwa aksi persetujuan akan memotong stok menjadi 0 dan membukukan kerugian finansial.

STRUKTUR DOKUMEN OUTPUT YANG WAJIB ANDA HASILKAN:
Dokumen `docs/Plan Frontend/PLAN_06_WASTE_APPROVAL_CENTER.md` harus memiliki bab-bab berikut:
1. Ringkasan Alur Bisnis Audit Waste (Peran Barista vs Supervisor) dan Pencegahan Hard Delete.
2. STITCH-READY SCREEN SPECIFICATION (Google Stitch Prompt):
   - Layar 1 (Modal Barista): Form Lapor Bahan Rusak/Basi (Pilih batch, input kuantitas rusak, select alasan, textarea keterangan).
   - Layar 2 (Halaman Supervisor): Approval Center DataTable (Tabel tiket pending, kalkulator rupiah kerugian, tombol Setujui/Tolak).
   - Layar 3: Dialog Konfirmasi Persetujuan Pemusnahan Stok.
   - Teks prompt visual untuk Google Stitch.
3. ARSITEKTUR TEKNIS FRONTEND (REACT + INERTIA):
   - Path File: `resources/js/Pages/Waste/ReportModal.tsx`, `resources/js/Pages/Waste/Index.tsx`, `resources/js/Components/WasteApprovalDialog.tsx`.
   - Kontrak Props TypeScript: `WasteLog`, `WasteStatus`, `IngredientBatch` dari `resources/js/types/inventory.d.ts`.
   - Form handling pengajuan tiket (`useForm`) dan aksi approve/reject via router patch/post Inertia.
4. EDGE CASES & INTEGRITAS TRANSAKSI:
   - Kuantitas yang dilaporkan rusak melebihi sisa stok aktif batch.
   - Supervisor menolak tiket (wajib memasukkan catatan alasan penolakan).
   - Empty state jika tidak ada tiket pemusnahan yang pending.
```

---

```markdown
<!-- ============================================================================== -->
<!-- PROMPT 07: DASBOR ANALITIK & FINANSIAL EKSEKUTIF (OWNER)                       -->
<!-- ============================================================================== -->
```

### PROMPT 07: Dasbor Analitik & Finansial Eksekutif (Persona Owner)

```text
Anda adalah seorang Senior UI/UX Designer dan Lead Frontend Architect yang ahli dalam ekosistem React 18, Inertia.js, Tailwind CSS, Recharts, dan promptcrafting untuk Google Stitch.

TUGAS ANDA:
Buatlah dokumen spesifikasi desain komprehensif untuk "Modul 07: Dasbor Analitik & Finansial Eksekutif (Khusus Persona Owner)". Dokumen ini WAJIB disimpan di `docs/Plan Frontend/PLAN_07_OWNER_ANALYTICS_DASHBOARD.md`.

KONTEKS BISNIS & PERSONA OWNER:
1. Owner kafe tidak berkutat pada detail teknis pencatatan bar harian, melainkan membutuhkan ringkasan eksekutif (*helicopter view*) mengenai kesehatan finansial inventaris kafe dan evaluasi kebocoran modal akibat bahan basi.
2. Dasbor Owner terdiri dari 3 blok utama:
   - **Blok 1: 3 Executive Metric Cards**:
     * *Total Nilai Aset Bahan*: Akumulasi rupiah seluruh modal bahan yang saat ini tersimpan di gudang & chiller (`current_stock * cost_per_unit`).
     * *Nilai Bahan Kritis*: Estimasi rupiah bahan yang akan kedaluwarsa dalam 3 hari ke depan jika tidak segera dipakai/dibuat promo penjualan.
     * *Total Kerugian Limbah Bulan Ini*: Akumulasi kerugian rupiah akibat bahan basi/rusak yang telah disetujui pemusnahannya (`SUM(financial_loss)` dari `waste_logs`).
   - **Blok 2: Grafik Batang Komparasi Bulanan (Recharts)**:
     * Grafik batang ganda berdampingan: Batang Hijau Emerald (Nilai Biaya Bahan Terpakai Efektif) vs Batang Merah Rose (Nilai Biaya Bahan Terbuang Sia-sia / *Waste Loss*).
     * Tooltip interaktif yang menampilkan rincian nominal rupiah dan persentase efisiensi bahan.
   - **Blok 3: Peringkat 5 Bahan Paling Boros (Top 5 Waste Ingredients)**:
     * Tabel daftar 5 bahan baku penyumbang kerugian terbesar agar Owner dapat mengevaluasi kuantitas pembelian ke vendor.

DESIGN CONTRACT & ATURAN VISUAL:
- Ikuti Desain.md:
  * Metric Cards: `bg-surface-container p-5 rounded-xl border border-surface-border shadow-sm flex flex-col justify-between`. Nominal besar `text-2xl sm:text-3xl font-bold tracking-tight text-content-high`.
  * Chart Container: Recharts ResponsiveContainer, warna batang `fill-emerald-600` dan `fill-[#8C3D2B]`, grid garis halus `stroke-[#EDE4DC]`.
  * Top Waste Table: Simple clean table dengan persentase bar progres visual di samping nominal rupiah bertema terracotta `#8C3D2B`.

STRUKTUR DOKUMEN OUTPUT YANG WAJIB ANDA HASILKAN:
Dokumen `docs/Plan Frontend/PLAN_07_OWNER_ANALYTICS_DASHBOARD.md` harus memiliki bab-bab berikut:
1. Ringkasan Kebutuhan Informasi Eksekutif Owner & KPI Finansial Kafe.
2. STITCH-READY SCREEN SPECIFICATION (Google Stitch Prompt):
   - Layar Dasbor Eksekutif Owner (Header filter rentang waktu bulan/tahun, 3 Metric Cards, Grafik Recharts pemakaian vs waste, dan Tabel Top 5 Waste Ingredients).
   - Spesifikasi detail tata letak grid responsif (Grid 3 kolom desktop, 1 kolom mobile).
   - Teks prompt visual komprehensif untuk Google Stitch.
3. ARSITEKTUR TEKNIS FRONTEND (REACT + RECHARTS + INERTIA):
   - Path File: `resources/js/Pages/Dashboard/OwnerDashboard.tsx`, `resources/js/Components/MetricCard.tsx`, `resources/js/Components/Charts/UsageVsWasteChart.tsx`.
   - Kontrak Props TypeScript: `DashboardMetrics`, `WasteLog` dari `resources/js/types/inventory.d.ts`.
   - Konfigurasi Recharts (BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer).
   - Formatter mata uang Rupiah Indonesia (`Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' })`).
4. EDGE CASES & DATA PRESENTATION:
   - Tampilan jika data bulan ini masih kosong (Empty chart state dengan ilustrasi profesional).
   - Nilai kerugian 0 (Tampilkan visual apresiasi efisiensi "Zero Food Waste").
```

---

## REKOMENDASI TAHAPAN EKSEKUSI

Untuk tim pengembang atau AI agent, eksekusi pembuatan file plan disarankan berurutan sesuai prioritas berikut:
1. **Langkah 1 (Fondasi)**: Jalankan `PROMPT 01` (Auth) & `PROMPT 02` (AppLayout & RBAC).
2. **Langkah 2 (Operasional Barista)**: Jalankan `PROMPT 03` (Barista Dashboard & FEFO Engine).
3. **Langkah 3 (Manajemen Gudang)**: Jalankan `PROMPT 04` (Master Data) & `PROMPT 05` (Monitoring & Restock).
4. **Langkah 4 (Pengendalian Limbah & Analitik)**: Jalankan `PROMPT 06` (Waste Center) & `PROMPT 07` (Owner Analytics).

Setelah masing-masing dokumen `PLAN_0X_*.md` terbentuk, salin bagian **Stitch UI Prompt** ke Google Stitch untuk memvalidasi antarmuka visual sebelum tim koding menulis komponen React-nya.
