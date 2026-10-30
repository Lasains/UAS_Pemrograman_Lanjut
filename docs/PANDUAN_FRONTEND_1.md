# PANDUAN KERJA KHUSUS: FRONTEND DEVELOPER 1 (FE 1)

**Fokus Utama**: Arsitektur Tampilan UI, Tata Letak (*AppLayout*), Navigasi Sidebar Dinamis Sesuai Role (RBAC), Komponen Badge Indikator Masa Simpan, dan Dasbor Analitik Grafik Recharts.

---

## 1. File & Folder Tanggung Jawab Anda
* `resources/js/Components/ui/*` (Komponen tombol, badge, card, tabel)
* `resources/js/Layouts/AppLayout.tsx` (Layout utama aplikasi)
* `resources/js/Components/Sidebar.tsx` (Navigasi menu berdasarkan role)
* `resources/js/Components/ExpiryBadge.tsx` (Komponen badge status kedaluwarsa)
* `resources/js/Pages/Inventory/Index.tsx` (Tabel inventaris bahan & batch)
* `resources/js/Pages/Dashboard/OwnerDashboard.tsx` (Dasbor grafik analitik)

---

## 2. Rincian Tugas Bertahap

### 📌 Minggu 1 (Setup Layout & Navigasi RBAC)

#### Task 1: Setup Komponen UI Dasar
Pastikan komponen dasar UI sudah tersedia di `resources/js/Components/ui/`:
* `Button.tsx`, `Badge.tsx`, `Card.tsx`, `Table.tsx`.
* Anda bisa memanfaatkan helper `cn()` yang sudah disiapkan di `resources/js/lib/utils.ts`.

#### Task 2: Layout Utama & Sidebar Responsif Dinamis (`AppLayout.tsx`)
* Buat layout dengan sidebar di sebelah kiri dan header di atas (nama user yang login + role badge).
* **Navigasi Dinamis Berdasarkan Role**:
  Gunakan props `auth.user.role` dari Inertia:
  * **Jika Role = Barista**:
    * Menu yang muncul: *Dasbor Operasional*, *Pencatatan Pemakaian*, *Penerimaan Batch*, *Lapor Bahan Rusak*.
  * **Jika Role = Supervisor**:
    * Menu yang muncul: *Semua menu Barista* + *Master Data Bahan & Kategori* + *Approval Bahan Rusak (Waste)*.
  * **Jika Role = Owner**:
    * Menu yang muncul: *Dasbor Analitik Eksekutif*, *Laporan Finansial & Waste*, *Monitoring Inventaris*.

---

### 📌 Minggu 2 (Tabel Inventaris & Indikator Warna)

#### Task 3: Komponen Badge Kedaluwarsa (`ExpiryBadge.tsx`)
Buat komponen badge visual dengan 3 status:
```tsx
interface ExpiryBadgeProps {
    daysUntilExpiry: number;
    urgencyStatus: 'safe' | 'warning' | 'critical';
}

export function ExpiryBadge({ daysUntilExpiry, urgencyStatus }: ExpiryBadgeProps) {
    if (urgencyStatus === 'critical' || daysUntilExpiry < 3) {
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-rose-100 text-rose-800 border border-rose-300">
            🔴 Kritis ({daysUntilExpiry <= 0 ? 'Kedaluwarsa' : `${daysUntilExpiry} hari lagi`})
        </span>;
    }
    if (urgencyStatus === 'warning' || daysUntilExpiry <= 7) {
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-800 border border-amber-300">
            🟡 Segera Pakai ({daysUntilExpiry} hari lagi)
        </span>;
    }
    return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
        🟢 Aman ({daysUntilExpiry} hari lagi)
    </span>;
}
```

#### Task 4: Tabel Inventaris Bahan Baku (`Inventory/Index.tsx`)
* Menampilkan daftar bahan baku: Nama Bahan, Kategori, Total Stok, Satuan, dan Status Stok Minimum.
* Bisa di-klik untuk membuka *accordion / sub-table* yang memperlihatkan daftar batch fisik bahan tersebut (Nomor Batch, Tanggal Expired, Sisa Stok, dan `ExpiryBadge`).

---

### 📌 Minggu 3 (Dasbor Analitik Recharts)

#### Task 5: Halaman Dasbor Owner (`Dashboard/OwnerDashboard.tsx`)
1. **Metric Cards (3 Kartu di Atas)**:
   * Total Nilai Aset Bahan Baku (Format Rupiah: `Rp xx.xxx.xxx`).
   * Estimasi Nilai Bahan Kritis (Bahan yang berisiko basi dalam 3 hari).
   * Total Kerugian Bahan Basi Bulan Ini.
2. **Grafik Recharts (BarChart)**:
   * Menampilkan perbandingan batang: Nilai Bahan Terpakai vs Nilai Bahan Terbuang (*Waste*) per bulan.

---

## 3. Do's and Don'ts untuk FE 1
* ✅ **DO**: Selalu gunakan tipe TypeScript yang telah disediakan di `resources/js/types/inventory.d.ts`.
* ✅ **DO**: Gunakan palet warna yang konsisten (Slate/Zinc neutral, aksen Emerald Green untuk nuansa kafe, Amber untuk warning, Rose/Red untuk kritis).
* ❌ **DON'T**: Jangan mengubah logika rute backend di `routes/web.php` secara mandiri; koordinasikan dengan PM.
