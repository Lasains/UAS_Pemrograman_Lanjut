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
| **03** | Halaman Operasional Barista (4 Halaman: Dasbor, Catat Pemakaian, Penerimaan Batch, Lapor Rusak) | Barista | `docs/Plan Frontend/PLAN_03_BARISTA_OPERASIONAL_FEFO.md` |
| **04** | Master Data & Kategori (2 Halaman: Katalog Bahan Baku, Kelola Kategori) | Supervisor | `docs/Plan Frontend/PLAN_04_SUPERVISOR_MASTER_DATA.md` |
| **05** | Monitoring Inventaris & Audit FEFO (2 Halaman: Monitoring Kedaluwarsa, Riwayat Audit FEFO) | Supervisor & Barista | `docs/Plan Frontend/PLAN_05_SUPERVISOR_MONITORING_INVENTARIS.md` |
| **06** | Pusat Approval Pemusnahan Limbah (Waste Write-Off Center) | Supervisor (Approve) & Barista | `docs/Plan Frontend/PLAN_06_WASTE_APPROVAL_CENTER.md` |
| **07** | Halaman Eksekutif & Finansial Owner (3 Halaman: Dasbor Finansial, Laporan Waste, Evaluasi Pembelian) | Owner | `docs/Plan Frontend/PLAN_07_OWNER_ANALYTICS_DASHBOARD.md` |

---

## PANDUAN PENGGUNAAN PROMPT & ATURAN BAKU GOOGLE STITCH

> [!IMPORTANT]
> **IRON RULE: IN-SHELL CONTENT PROMPTING (HINDARI DUPLIKASI SHELL & MODAL CLUTTER)**:  
> 1. **Satu Universal App Shell**: Layout aplikasi hanya memiliki 1 shell utama (`PLAN_02`). Seluruh layar fitur lainnya (`PLAN_03` s/d `PLAN_07`) adalah **In-Shell Content View** yang hanya merender area kerja di dalam `<slot />` kanvas susu hangat `#FAF7F2`.
> 2. **Dilarang Men-generate Ulang Sidebar/Header**: Saat membuat prompt Stitch untuk halaman fitur, **WAJIB INSTRUKSIKAN STITCH UNTUK TIDAK MERENDER SIDEBAR DAN HEADER ATAS**. Ini menjamin konsistensi layout, font (Plus Jakarta Sans/Figtree), dan token warna `Desain.md`.
> 3. **Slide-Over Drawers Menggantikan Tumpukan Modal**: Hindari modal pop-up bertumpuk (modal di atas modal). Gunakan **Slide-Over Panel (Drawer)** dari sisi kanan layar untuk pencatatan FEFO, restock, review waste, dan tambah bahan baku.
> 4. **Glanceable UI untuk Rush Hour**: Antarmuka meja bar barista harus memprioritaskan keterbacaan dalam 1 detik dengan tombol sentuh besar (min 72px) dan badge lampu lalu lintas kedaluwarsa yang sangat kontras.

1. **Pilih Fitur yang Akan Dikerjakan**: Ambil salah satu prompt di bawah sesuai nomor modul yang ingin Anda rencanakan.
2. **Jalankan Prompt**: Salin (*copy*) seluruh blok teks prompt dan masukkan ke AI asisten Anda.
3. **Simpan Hasilnya**: Pastikan teks output disimpan ke direktori `docs/Plan Frontend/` sesuai nama file (misal: `PLAN_03_BARISTA_OPERASIONAL_FEFO.md`).
4. **Alur ke Google Stitch**: Gunakan bagian **Stitch UI Prompt (In-Shell Content View)** yang ada di dalam dokumen plan hasil AI tersebut untuk menghasilkan mockup antarmuka yang presisi dan rapi di Google Stitch.

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

### PROMPT 03: Halaman Operasional Barista — 4 Halaman Tersendiri (Dasbor, Pemakaian FEFO, Penerimaan Batch, Lapor Rusak)

> [!NOTE]
> PLAN_03 kini mencakup **4 halaman tersendiri** (bukan modal terpisah). Setiap halaman memiliki Stitch prompt mandiri di dalam `PLAN_03_BARISTA_OPERASIONAL_FEFO.md`:
> - **Section 2.2** → Halaman A: Dasbor Operasional Barista (dengan Slide-Over Drawer)
> - **Section 2.4 / Halaman B** → `Pages/Usage/Index.tsx` — Catat Pemakaian & Riwayat FEFO
> - **Section 2.4 / Halaman C** → `Pages/Batches/Create.tsx` — Penerimaan Batch Baru
> - **Section 2.4 / Halaman D** → `Pages/Waste/Create.tsx` — Lapor Bahan Rusak & Status Tiket

```text
Anda adalah seorang Senior UI/UX Designer dan Lead Frontend Architect yang ahli dalam ekosistem React 18, Inertia.js, Tailwind CSS, dan promptcrafting untuk Google Stitch.

TUGAS ANDA:
Buatlah dokumen spesifikasi desain komprehensif untuk "Modul 03: Halaman Operasional Bar Barista (4 Halaman Tersendiri)". Dokumen ini WAJIB disimpan di `docs/Plan Frontend/PLAN_03_BARISTA_OPERASIONAL_FEFO.md`.

KONTEKS BISNIS & PERSONA BARISTA:
1. Barista bekerja di bar yang sibuk (*rush hour*). Antarmuka harus *glanceable* (dapat dipahami dalam 1 detik) dan meminimalkan klik.
2. Barista memiliki 4 halaman tersendiri (bukan modal overlay dari dasbor), masing-masing dapat diakses via sidebar menu:
   - **Halaman A — Dasbor Barista** (`Pages/Barista/Dashboard.tsx`): Ringkasan bar, banner kritis FEFO, 3 Quick Action Cards besar, Grid bahan utama bar.
   - **Halaman B — Catat Pemakaian FEFO** (`Pages/Usage/Index.tsx`, route: `usage.index`): Form pemakaian bahan 2 kolom — kiri: pilih bahan + batch FEFO + kuantitas; kanan: riwayat pemakaian hari ini.
   - **Halaman C — Penerimaan Batch Baru** (`Pages/Batches/Create.tsx`, route: `batches.create`): Form restock 2 kolom — kiri: form lengkap batch baru + live total value; kanan: 5 batch terakhir diterima.
   - **Halaman D — Lapor Bahan Rusak** (`Pages/Waste/Create.tsx`, route: `waste.create`): Form laporan 2 kolom — kiri: form laporan ke supervisor; kanan: status tiket milik barista.
3. **LOGIKA INTI FEFO (First Expired, First Out) & SMART WARNING** (berlaku di Halaman A & B):
   - Batch aktif diurutkan `expiry_date ASC`. Batch[0] otomatis terpilih dan diberi badge `[★ REKOMENDASI FEFO]`.
   - Jika barista memilih batch lain (bukan [0]): tampilkan **Inline Warning Amber** (bukan modal baru!) langsung di dalam form/drawer, dengan textarea `deviation_reason` wajib diisi min 5 karakter.

DESIGN CONTRACT & ATURAN VISUAL:
- Ikuti Desain.md (IN-SHELL CONTENT RULE: Semua halaman hanya merender kanvas, JANGAN render ulang sidebar/header):
  * RadioGroup kartu batch: Kartu terpilih border `border-brand-primary bg-surface-container-high`.
  * Rekomendasi FEFO Badge: `bg-brand-primary text-surface-canvas font-semibold`.
  * Inline Warning Deviasi: Box amber `bg-[#FFF7ED] border-[#FED7AA] rounded-lg p-3.5`.
  * Tombol Submit Waste (Halaman D): Amber `bg-[#C88242]` (bukan espresso) untuk membedakan aksi "laporan/peringatan".
  * Badge status tiket: Pending=Amber, Approved=Emerald, Rejected=Perkamen abu.

STRUKTUR DOKUMEN OUTPUT YANG WAJIB ANDA HASILKAN:
Dokumen `docs/Plan Frontend/PLAN_03_BARISTA_OPERASIONAL_FEFO.md` harus memiliki bab-bab berikut:
1. Ringkasan Alur Kerja Barista & Logika Bisnis FEFO Semi-Otomatis (dengan diagram Mermaid flowchart).
2. STITCH-READY SCREEN SPECIFICATION — 4 bagian terpisah:
   - 2.1 Identitas & Token Desain
   - 2.2 Halaman A: Dasbor Barista (Slide-Over Drawer + Grid Bahan)
   - 2.3 Stitch Prompt Halaman A (teks siap pakai Indonesia & Inggris)
   - 2.4 Spesifikasi 3 Halaman Tersendiri (Halaman B, C, D) masing-masing dengan tata letak 2 kolom + Stitch prompt
3. ARSITEKTUR TEKNIS FRONTEND (REACT + INERTIA):
   - Lokasi 4 halaman (Pages/) + komponen bersama (Components/Barista/)
   - Kontrak Props TypeScript: `Ingredient`, `IngredientBatch`, `StockUsage`, `WasteLog` dari `resources/js/types/inventory.d.ts`
   - Logika deteksi deviasi FEFO (bandingkan `selectedBatch.id` vs `activeBatches[0].id`)
   - Form handling Inertia `useForm` untuk: usage.store, batches.store, waste.store
4. EDGE CASES & ERROR HANDLING:
   - Kuantitas melebihi `current_stock` batch terpilih
   - Bahan tanpa batch aktif (empty state + link ke Penerimaan Batch)
   - Tanggal kedaluwarsa lebih awal dari tanggal terima (blokir di Halaman C)
   - Barista menutup warning tanpa isi alasan → revert ke batch[0]
```

---

```markdown
<!-- ============================================================================== -->
<!-- PROMPT 04: MASTER DATA BAHAN BAKU & KATEGORI                                  -->
<!-- ============================================================================== -->
```

### PROMPT 04: Master Data Bahan Baku & Kategori — 2 Halaman Tersendiri (Katalog Bahan, Kelola Kategori)

> [!NOTE]
> PLAN_04 mencakup **2 halaman tersendiri** bagi Supervisor:
> - **Section 2.2 & 2.3 / Halaman A** → `Pages/Master/Ingredients/Index.tsx` — Katalog Master Bahan Baku (dengan Slide-Over Drawer Tambah/Ubah)
> - **Section 2.4 / Halaman B** → `Pages/Master/Categories/Index.tsx` — Manajemen Kategori Bahan Baku

```text
Anda adalah seorang Senior UI/UX Designer dan Lead Frontend Architect yang ahli dalam ekosistem React 18, Inertia.js, Tailwind CSS, dan promptcrafting untuk Google Stitch.

TUGAS ANDA:
Buatlah dokumen spesifikasi desain komprehensif untuk "Modul 04: Manajemen Master Data Bahan Baku & Kategori (2 Halaman Tersendiri)". Dokumen ini WAJIB disimpan di `docs/Plan Frontend/PLAN_04_SUPERVISOR_MASTER_DATA.md`.

KONTEKS BISNIS & PERSONA SUPERVISOR:
1. Modul ini eksklusif untuk hak akses 'supervisor' (Role Barista dan Owner hanya memiliki izin View / No Access).
2. Supervisor bertanggung jawab menjaga konsistensi katalog bahan kafe, satuan unit standar (*standard unit*), ambang batas restock (*minimum stock threshold*), dan ambang peringatan dini (*warning days threshold*).
3. Modul terdiri dari 2 halaman tersendiri di sidebar:
   - **Halaman A — Katalog Master Bahan Baku** (`Pages/Master/Ingredients/Index.tsx`, route: `ingredients.index`): Filter pills kategori, pencarian cepat, tabel master bahan baku dengan statistik total stok dan jumlah batch aktif, serta panel slide-over drawer tambah/ubah bahan.
   - **Halaman B — Manajemen Kategori Bahan Baku** (`Pages/Master/Categories/Index.tsx`, route: `categories.index`): Form tambah kategori baru di sisi kiri dan grid kartu kategori aktif beserta total bahan terdaftar di sisi kanan.

DESIGN CONTRACT & ATURAN VISUAL:
- Ikuti Desain.md (IN-SHELL CONTENT RULE: Hanya merender isi kanvas di dalam slot utama):
  * Table: Desain kontainer oat latte `bg-surface-container` dengan header `#EDE4DC`.
  * Slide-Over Drawer: Panel kanan lebar 480px untuk tambah/ubah bahan (bukan modal pop-up kaku).
  * Segmented Unit Buttons: `ml`, `gram`, `pcs`.
  * Grid Kategori: Kartu rounded-xl dengan badge capsule berwarna khas per kelompok bahan.

STRUKTUR DOKUMEN OUTPUT YANG WAJIB ANDA HASILKAN:
Dokumen `docs/Plan Frontend/PLAN_04_SUPERVISOR_MASTER_DATA.md` harus memiliki bab-bab berikut:
1. Ringkasan Fitur Master Data & Otorisasi Supervisor.
2. STITCH-READY SCREEN SPECIFICATION:
   - 2.1 Identitas Modul Layar
   - 2.2 & 2.3 Halaman A: Katalog Master Bahan Baku (Stitch Prompt)
   - 2.4 Halaman B: Manajemen Kategori Bahan Baku (Tata letak 2 kolom + Stitch Prompt)
3. ARSITEKTUR TEKNIS FRONTEND (REACT + INERTIA):
   - Path File: `resources/js/Pages/Master/Ingredients/Index.tsx` dan `resources/js/Pages/Master/Categories/Index.tsx`
   - Kontrak Props TypeScript: `Ingredient`, `Category` dari `resources/js/types/inventory.d.ts`.
   - Form handling dengan Inertia `useForm`.
4. EDGE CASES & PERLINDUNGAN DATA:
   - Pencegahan penghapusan kategori yang masih memiliki bahan baku aktif (*foreign key guard*).
   - Validasi angka negatif pada batas minimum stok atau hari warning.
```

---

```markdown
<!-- ============================================================================== -->
<!-- PROMPT 05: MONITORING INVENTARIS & BATCH KEDALUWARSA                          -->
<!-- ============================================================================== -->
```

### PROMPT 05: Monitoring Inventaris & Audit FEFO — 2 Halaman Tersendiri (Monitoring Batch, Riwayat Audit FEFO)

> [!NOTE]
> PLAN_05 kini mencakup **2 halaman tersendiri** bagi Supervisor:
> - **Section 2.2 & 2.3 / Halaman A** → `Pages/Inventory/Index.tsx` — Monitoring Inventaris & Early Warning Kedaluwarsa
> - **Section 2.4 / Halaman B** → `Pages/Audit/FefoLog.tsx` — Riwayat Audit Kepatuhan & Log Deviasi FEFO Barista

```text
Anda adalah seorang Senior UI/UX Designer dan Lead Frontend Architect yang ahli dalam ekosistem React 18, Inertia.js, Tailwind CSS, dan promptcrafting untuk Google Stitch.

TUGAS ANDA:
Buatlah dokumen spesifikasi desain komprehensif untuk "Modul 05: Monitoring Inventaris Bahan & Log Audit FEFO (2 Halaman Tersendiri)". Dokumen ini WAJIB disimpan di `docs/Plan Frontend/PLAN_05_SUPERVISOR_MONITORING_INVENTARIS.md`.

KONTEKS BISNIS & PERSONA SUPERVISOR:
1. Modul ini adalah inti dari pencegahan kerugian bahan basi (*food safety & anti-waste*) dan evaluasi kepatuhan SOP barista di meja bar.
2. Modul terdiri dari 2 halaman tersendiri:
   - **Halaman A — Monitoring Inventaris & Kedaluwarsa** (`Pages/Inventory/Index.tsx`, route: `inventory.index`): 4 Filter Tab status kedaluwarsa (Semua, 🟢 Aman, 🟡 Warning, 🔴 Kritis), tabel hierarki bahan dengan daftar batch aktif yang diurutkan FEFO ASC, dan tombol aksi restock.
   - **Halaman B — Riwayat Audit & Deviasi FEFO** (`Pages/Audit/FefoLog.tsx`, route: `audit.fefo`): Skor kepatuhan SOP FEFO kafe (target > 90%), filter barista, dan tabel riwayat transaksi pemakaian bahan yang mencatat perbandingan batch terpilih vs rekomendasi sistem beserta alasan deviasi fisik barista.

DESIGN CONTRACT & ATURAN VISUAL:
- Ikuti Desain.md (IN-SHELL CONTENT RULE: Hanya merender area kanvas kerja dalam slot utama):
  * Traffic Light Badges: Safe (Hijau Emerald), Warning (Kuning Amber), Critical (Terracotta #8C3D2B animate-pulse).
  * Baris Kritis: Highlight tipis terracotta #FDF2F0.
  * Baris Deviasi: Highlight aksen kuning amber tipis.

STRUKTUR DOKUMEN OUTPUT YANG WAJIB ANDA HASILKAN:
Dokumen `docs/Plan Frontend/PLAN_05_SUPERVISOR_MONITORING_INVENTARIS.md` harus memiliki bab-bab berikut:
1. Ringkasan Fitur Monitoring & Logika Perhitungan Hari Kedaluwarsa (`Carbon diffInDays`).
2. STITCH-READY SCREEN SPECIFICATION:
   - 2.1 Identitas Modul Layar
   - 2.2 & 2.3 Halaman A: Monitoring Inventaris & Early Warning Kedaluwarsa (Stitch Prompt)
   - 2.4 Halaman B: Riwayat Audit & Deviasi FEFO (Tata letak + Stitch Prompt)
3. ARSITEKTUR TEKNIS FRONTEND (REACT + INERTIA):
   - Path File: `resources/js/Pages/Inventory/Index.tsx` dan `resources/js/Pages/Audit/FefoLog.tsx`
   - Kontrak Props TypeScript: `Ingredient`, `IngredientBatch`, `StockUsage`, `UrgencyStatus` dari `resources/js/types/inventory.d.ts`.
4. EDGE CASES & PERFORMANCE:
   - Penanganan batch dengan stok 0 (`exhausted`): disaring otomatis.
   - Filter transaksi deviasi saja untuk mempermudah evaluasi shift bar.
```
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

### PROMPT 07: Halaman Eksekutif & Finansial Owner — 3 Halaman Tersendiri (Dasbor Finansial, Laporan Waste, Evaluasi Pembelian)

> [!NOTE]
> PLAN_07 kini mencakup **3 halaman tersendiri** bagi Persona Owner untuk mengakomodasi seluruh navigasi sidebar App Shell Owner:
> - **Section 2.2 & 2.3 / Halaman A** → `Pages/Dashboard/OwnerDashboard.tsx` — Dasbor Analitik & Finansial Eksekutif
> - **Section 2.4 / Halaman B** → `Pages/Reports/WasteReport.tsx` — Laporan Waste & Biaya Limbah
> - **Section 2.4 / Halaman C** → `Pages/Reports/InventoryValuation.tsx` — Evaluasi Pembelian & Valuasi Aset

```text
Anda adalah seorang Senior UI/UX Designer dan Lead Frontend Architect yang ahli dalam ekosistem React 18, Inertia.js, Tailwind CSS, Recharts, dan promptcrafting untuk Google Stitch.

TUGAS ANDA:
Buatlah dokumen spesifikasi desain komprehensif untuk "Modul 07: Halaman Eksekutif & Finansial Owner (3 Halaman Tersendiri)". Dokumen ini WAJIB disimpan di `docs/Plan Frontend/PLAN_07_OWNER_ANALYTICS_DASHBOARD.md`.

KONTEKS BISNIS & PERSONA OWNER:
1. Owner kafe tidak berkutat pada detail teknis operasional harian, melainkan membutuhkan ringkasan eksekutif (*helicopter view*) mengenai kesehatan kas, efisiensi modal bahan, pencegahan pembelian berlebih, dan evaluasi kebocoran modal akibat bahan basi.
2. Owner memiliki 3 halaman mandiri yang dapat diakses langsung via sidebar navigasi:
   - **Halaman A — Dasbor Analitik & Finansial** (`Pages/Dashboard/OwnerDashboard.tsx`, route: `dashboard.owner`): 3 KPI Card (Total Aset, Modal Kritis <3 Hari, Kerugian Waste Bulan Ini), Grafik Batang Recharts Bulanan (Terpakai vs Terbuang), dan Tabel Top 5 Bahan Paling Boros.
   - **Halaman B — Laporan Waste & Biaya Limbah** (`Pages/Reports/WasteReport.tsx`, route: `reports.waste`): Filter rentang tanggal & kategori bahan, 3 kartu ringkas audit, visual breakdown kerugian per kategori bahan, dan tabel audit transaksi pemusnahan resmi (disetujui SPV) lengkap dengan nominal rupiah dan alasan kerusakan.
   - **Halaman C — Evaluasi Pembelian & Valuasi Aset** (`Pages/Reports/InventoryValuation.tsx`, route: `reports.inventory`): Evaluasi perputaran stok, health check pengadaan (tingkat efisiensi modal vs rasio waste), dan tabel kecerdasan pembelian untuk mencegah over-purchasing bahan cepat basi.

DESIGN CONTRACT & ATURAN VISUAL:
- Ikuti Desain.md (IN-SHELL CONTENT RULE: Hanya render area kanvas kerja, JANGAN buat ulang sidebar atau header atas):
  * Latar Kanvas: `bg-surface-canvas` (`#FAF7F2`).
  * Kontainer Kartu: `bg-surface-container` (`#F5EFEB`) dengan border halus `#EDE4DC`.
  * Highlight Kerugian & Kritis: Terracotta Cherry (`#8C3D2B`).
  * Highlight Efisiensi & Terpakai: Emerald Harvest (`#059669`).
  * Grafik Recharts: ResponsiveContainer dengan dual-bar, tooltip nominal rupiah, dan legenda bersih.

STRUKTUR DOKUMEN OUTPUT YANG WAJIB ANDA HASILKAN:
Dokumen `docs/Plan Frontend/PLAN_07_OWNER_ANALYTICS_DASHBOARD.md` harus memiliki bab-bab berikut:
1. Ringkasan Kebutuhan Informasi Eksekutif Owner & KPI Finansial Kafe.
2. STITCH-READY SCREEN SPECIFICATION:
   - 2.1 Identitas Modul Layar
   - 2.2 & 2.3 Halaman A: Dasbor Analitik & Finansial Eksekutif (Stitch Prompt)
   - 2.4 Spesifikasi Lengkap Halaman B (Laporan Waste & Biaya) dan Halaman C (Evaluasi Pembelian & Valuasi Aset) masing-masing dengan Stitch Prompt mandiri
3. ARSITEKTUR TEKNIS FRONTEND (REACT + RECHARTS + INERTIA):
   - Path File 3 Halaman (`Pages/Dashboard/` dan `Pages/Reports/`) serta sub-komponennya
   - Kontrak Props TypeScript: `DashboardMetrics`, `WasteLog`, `MonthlyComparisonData`, `TopWasteItem` dari `inventory.d.ts`
   - Formatter mata uang Rupiah Indonesia (`Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' })`)
4. EDGE CASES & DATA PRESENTATION:
   - Tampilan jika data bulan ini masih kosong (Empty state dengan ilustrasi profesional)
   - Nilai kerugian 0 (Visual apresiasi "Zero Food Waste")
```
```

---

## REKOMENDASI TAHAPAN EKSEKUSI

Untuk tim pengembang atau AI agent, eksekusi pembuatan file plan disarankan berurutan sesuai prioritas berikut:
1. **Langkah 1 (Fondasi)**: Jalankan `PROMPT 01` (Auth) & `PROMPT 02` (AppLayout & RBAC).
2. **Langkah 2 (Operasional Barista)**: Jalankan `PROMPT 03` (Barista Dashboard & FEFO Engine).
3. **Langkah 3 (Manajemen Gudang)**: Jalankan `PROMPT 04` (Master Data) & `PROMPT 05` (Monitoring & Restock).
4. **Langkah 4 (Pengendalian Limbah & Analitik)**: Jalankan `PROMPT 06` (Waste Center) & `PROMPT 07` (Owner Analytics).

Setelah masing-masing dokumen `PLAN_0X_*.md` terbentuk, salin bagian **Stitch UI Prompt** ke Google Stitch untuk memvalidasi antarmuka visual sebelum tim koding menulis komponen React-nya.
