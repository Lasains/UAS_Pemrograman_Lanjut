# Penjelasan Modul 09: Palet Warna & Token Desain Kafe (Tailwind CSS)
## Panduan Pemula — Sistem Desain Identitas Kafe

> **Untuk Siapa Dokumen Ini**: Tim mahasiswa pemula frontend yang ingin memahami cara kerja palet warna, token Tailwind CSS, serta logika status peringatan di antarmuka kafe.  
> **Pendekatan**: Dijelaskan per kelompok token menggunakan analogi suasana kedai kopi (*artisan coffee shop*) ☕.  
> **Kaitan dengan Kode**: [`Desain.md`](../../Desain.md) dan [`tailwind.config.js`](../../tailwind.config.js).

---

## Gambaran Besar: "Warna Bukan Sekadar Estetika, tapi Panduan Mata Barista"

Di kedai kopi yang sibuk (*rush hour*), seorang barista tidak punya waktu membaca paragraf panjang untuk mengetahui apakah susu atau sirup masih aman dipakai. 

Warna antarmuka diatur dengan dua misi utama:
1. **Atmosfer Kafe Hangat (*Artisan Coffee House*)**: Kanvas berlatar warna susu hangat (*warm milk*), kartu bertingkat oat latte dan kertas perkamen (*parchment*), serta aksen seduhan biji espresso sangrai.
2. **Prioritas & Refleks Mata (*Glanceable Traffic Light*)**: Warna peringatan (Aman, Segera Pakai, Kritis) langsung memicu tindakan tanpa membuat mata cepat lelah.

---

## Grup 1: `brand` — Biji Kopi Sangrai, Karamel, & Buah Ceri Kopi

Kelompok warna utama yang menjadi ciri khas identitas visual kafe dan tombol interaksi.

### Token: `brand.primary` (`#4A2C11`) — Deep Roasted Espresso Bean
* **Tujuan**: Menjadi jangkar visual (*anchoring UI chrome*) dan penanda aksi paling krusial.
* **Input / Nilai Hex**: `#4A2C11` (Cokelat tua biji kopi sangrai gelap / dark roast).
* **Alur Logika Bisnis**:
  1. Digunakan pada tombol aksi paling penting seperti tombol **[Restock Masuk]**, **[Simpan Pemakaian]**, dan **[Submit Form]**.
  2. Memberikan kontras tinggi di atas kanvas terang sehingga mata pengguna langsung tahu ke mana harus mengklik saat formulir selesai diisi.
* **Output / Kelas Tailwind**: `bg-brand-primary`, `hover:bg-brand-primary-hover`, `text-brand-primary`.
* **Kaitan dengan Bagian Lain**: Digunakan pada tombol submit modal dialog dan lencana prioritas FEFO teratas (`[★ Rekomendasi FEFO]`).

---

### Token: `brand.secondary` (`#C88242`) — Spun Amber & Warm Caramel
* **Tujuan**: Memberikan aksen hangat untuk status aktif, indikator progres, dan badge peringatan dini.
* **Input / Nilai Hex**: `#C88242` (Karamel mentega dan cairan amber espresso).
* **Alur Logika Bisnis**:
  1. Digunakan saat sebuah elemen sedang dipilih (*active tab* atau *checked radio*).
  2. Menjadi warna dasar badge **Warning 🟡 (Segera Pakai)** ketika sisa masa simpan bahan tersisa antara 3 sampai 7 hari.
* **Output / Kelas Tailwind**: `bg-brand-secondary`, `text-brand-secondary`, `border-brand-secondary`.
* **Kaitan dengan Bagian Lain**: Dipakai pada `ExpiryBadge` status warning dan indikator bar progress sisa stok.

---

### Token: `brand.tertiary` (`#8C3D2B`) — Terracotta & Roasted Coffee Cherry
* **Tujuan**: Menandai anomali kritis, peringatan bahaya kedaluwarsa, atau aksi pemusnahan barang (*destructive actions*).
* **Input / Nilai Hex**: `#8C3D2B` (Merah bata terakota dan kulit ceri kopi matang).
* **Alur Logika Bisnis**:
  1. Ketika ada bahan yang tinggal < 3 hari atau sudah basi, mata pengguna harus segera waspada.
  2. Dipakai juga untuk tombol yang berisiko tinggi menghapus/memusnahkan data stok (*Reject* tiket atau *Lapor Bahan Rusak*).
* **Output / Kelas Tailwind**: `bg-brand-tertiary`, `text-brand-tertiary`, `border-brand-tertiary`.
* **Kaitan dengan Bagian Lain**: Dipakai pada `ExpiryBadge` status kritis, background peringatan baris tabel kedaluwarsa, dan modal alert deviasi FEFO.

---

## Grup 2: `surface` — Meja Keramik & Piringan Bar Kafe

Kelompok warna latar belakang yang membagi area konten tanpa perlu garis pembatas hitam yang kaku.

### Token: `surface.canvas` (`#FAF7F2`) — Warm Steamed Milk & Porcelain
* **Tujuan**: Latar belakang dasar (*viewport background*) seluruh aplikasi.
* **Input / Nilai Hex**: `#FAF7F2` (Putih lembut bernuansa susu hangat / porcelain cangkir kopi).
* **Alur Logika Bisnis**: Menggantikan warna putih murni (`#FFFFFF`) atau abu-abu standar (*slate-50*) agar layar terasa lebih hangat dan ramah di mata barista yang bekerja di bawah lampu kafe yang redup (*warm light*).
* **Output / Kelas Tailwind**: `bg-surface-canvas`.
* **Kaitan dengan Bagian Lain**: Dipasang pada tag pembungkus layout utama (`AuthenticatedLayout` dan `GuestLayout`).

---

### Token: `surface.container` (`#F5EFEB`) & `surface.container-high` (`#EDE4DC`)
* **Tujuan**: Memisahkan kartu data, tabel, dan formulir secara bertingkat (*layering*).
* **Input / Nilai Hex**:
  * `surface.container`: `#F5EFEB` (Warna busa oat latte lembut).
  * `surface.container-high`: `#EDE4DC` (Warna kertas perkamen pembungkus kopi).
* **Alur Logika Bisnis**:
  1. Kartu metrik dan formulir diletakkan di atas kontainer `#F5EFEB`.
  2. Bagian sub-panel, header tabel, atau kontainer bertingkat memakai `#EDE4DC`.
  3. Dengan variasi warna ini, aplikasi tidak membutuhkan garis pemisah tebal (*borderless grouping*).
* **Output / Kelas Tailwind**: `bg-surface-container`, `bg-surface-container-high`.
* **Kaitan dengan Bagian Lain**: Dipakai pada komponen `MetricCard`, modal popup form, dan header tabel data inventaris.

---

## Grup 3: `content` — Tingkatan Teks & Tipografi

Kelompok warna teks untuk memastikan keterbacaan (*contrast ratio*) yang lulus standar aksesibilitas WCAG.

### Token: `content.high` (`#241408`) — Deep Espresso
* **Tujuan**: Menampilkan teks utama yang paling penting.
* **Input / Nilai Hex**: `#241408` (Cokelat pekat hampir hitam).
* **Contoh Pemakaian**: Judul halaman (H1), nominal rupiah aset, dan nama bahan baku ("Fresh Milk Greenfields").
* **Kelas Tailwind**: `text-content-high`.

---

### Token: `content.medium` (`#5C3A21`) — Muted Mocha
* **Tujuan**: Menampilkan teks sekunder yang menjelaskan konteks.
* **Input / Nilai Hex**: `#5C3A21` (Cokelat moka lembut).
* **Contoh Pemakaian**: Label formulir, satuan kuantitas (ml/gram/botol), nomor batch, dan sub-judul.
* **Kelas Tailwind**: `text-content-medium`.

---

### Token: `content.subtle` (`#9C8474`) — Crema Umber
* **Tujuan**: Menampilkan teks tambahan atau komponen nonaktif yang tidak boleh mendominasi layar.
* **Input / Nilai Hex**: `#9C8474` (Warna krem busa espresso / crema).
* **Contoh Pemakaian**: Teks petunjuk (*placeholder*), catatan waktu (*timestamp*), dan teks tombol saat status *disabled*.
* **Kelas Tailwind**: `text-content-subtle`.

---

## Grup 4: Status Peringatan Kedaluwarsa (Traffic Light System)

Mengintegrasikan aturan inti bisnis FEFO dengan palet baru kafe:

| Level Status | Token Tailwind | Warna Dasar | Logika Masa Simpan | Analogi Kafe |
| :--- | :--- | :--- | :--- | :--- |
| 🟢 **Aman** | `bg-emerald-50 text-emerald-800 border-emerald-300` | Emerald Harvest | Sisa hari > 7 hari | Daun tanaman kopi segar |
| 🟡 **Warning** | `bg-[#FFF7ED] text-[#C88242] border-[#FED7AA]` | Caramel Amber | Sisa hari 3 s/d 7 hari | Sirup karamel yang harus segera dihabiskan |
| 🔴 **Kritis** | `bg-[#FDF2F0] text-[#8C3D2B] border-[#F8C6BF]` | Terracotta Cherry | Sisa hari < 3 hari / Lewat | Ceri kopi yang sudah terlalu matang / basi |
| ★ **FEFO Rekomendasi**| `bg-brand-primary text-surface-canvas font-semibold` | Deep Espresso | Batch dengan tanggal expired paling dekat | Prioritas nomor 1 yang harus dituangkan barista |

---

## Contoh Integrasi Komponen React

```tsx
import React from 'react';

export function ExampleCard() {
    return (
        <div className="bg-surface-container border border-surface-border p-6 rounded-xl shadow-sm">
            <h1 className="text-xl font-bold text-content-high">
                Biji Kopi Arabika Gayo
            </h1>
            <p className="text-sm text-content-medium mt-1">
                Batch #BCH-2026-001 • Sisa Stok: 4.500 gram
            </p>
            
            <div className="mt-4 flex items-center gap-2">
                {/* Lencana Status Warning bernuansa Caramel Amber */}
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#FFF7ED] text-[#C88242] border border-[#FED7AA]">
                    🟡 Segera Pakai (4 hari lagi)
                </span>
                
                {/* Lencana Rekomendasi FEFO */}
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-primary text-surface-canvas">
                    ★ Rekomendasi FEFO
                </span>
            </div>

            <div className="mt-6 flex justify-end gap-3">
                <button className="px-4 py-2 rounded-lg text-sm font-medium bg-surface-container-high text-content-high hover:bg-[#E3D5C8]">
                    Detail Batch
                </button>
                <button className="px-4 py-2 rounded-lg text-sm font-medium bg-brand-primary text-white hover:bg-brand-primary-hover">
                    Catat Pemakaian
                </button>
            </div>
        </div>
    );
}
```

---

## Integrasi di Seluruh Dokumen Perencanaan Frontend (`docs/Plan Frontend/`)

Seluruh 7 rencana frontend dan 1 master prompt telah diperbarui secara harmonis:
1. [`PLAN_01_AUTH_LOGIN.md`](../Plan%20Frontend/PLAN_01_AUTH_LOGIN.md): Hero split-screen bernuansa gradien dark espresso (`#241408` - `#4A2C11`), kanvas susu hangat `#FAF7F2`, dan kartu login `#F5EFEB`.
2. [`PLAN_02_APP_LAYOUT_RBAC.md`](../Plan%20Frontend/PLAN_02_APP_LAYOUT_RBAC.md): Sidebar tetap oat latte (`#F5EFEB`), active state parchment (`#EDE4DC`), dan role badge capsule.
3. [`PLAN_03_BARISTA_OPERASIONAL_FEFO.md`](../Plan%20Frontend/PLAN_03_BARISTA_OPERASIONAL_FEFO.md): RadioGroup batch FEFO rekomendasi espresso tebal `#4A2C11` dan smart warning dialog karamel amber `#C88242`.
4. [`PLAN_04_SUPERVISOR_MASTER_DATA.md`](../Plan%20Frontend/PLAN_04_SUPERVISOR_MASTER_DATA.md): Data table master bahan baku berheader parchment `#EDE4DC` dan modal tambah bahan berbasis `#F5EFEB`.
5. [`PLAN_05_SUPERVISOR_MONITORING_INVENTARIS.md`](../Plan%20Frontend/PLAN_05_SUPERVISOR_MONITORING_INVENTARIS.md): 4 kartu ringkasan status batch dan lencana ExpiryBadge (🟢 Aman, 🟡 Amber, 🔴 Terracotta).
6. [`PLAN_06_WASTE_APPROVAL_CENTER.md`](../Plan%20Frontend/PLAN_06_WASTE_APPROVAL_CENTER.md): Highlight nominal kerugian finansial monospaced terracotta cherry `#8C3D2B` dan modal konfirmasi pemusnahan.
7. [`PLAN_07_OWNER_ANALYTICS_DASHBOARD.md`](../Plan%20Frontend/PLAN_07_OWNER_ANALYTICS_DASHBOARD.md): Metric cards eksekutif, Recharts dual-bar chart (Emerald Harvest vs Terracotta Cherry), dan progress bar 5 bahan terboros.
8. [`PROMPT_LIST_PLAN_DESIGN.md`](../Plan%20Frontend/PROMPT_LIST_PLAN_DESIGN.md): Sinkronisasi seluruh teks prompt Google Stitch bahasa Indonesia dan Inggris.

