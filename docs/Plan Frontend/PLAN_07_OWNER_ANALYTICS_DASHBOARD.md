# RENCANA SPESIFIKASI DESAIN FRONTEND (PLAN 07)
## Modul 07: Dasbor Analitik & Finansial Eksekutif (Khusus Persona Owner)
**Target File Implementasi**:  
- `resources/js/Pages/Dashboard/OwnerDashboard.tsx`  
- `resources/js/Components/MetricCard.tsx`  
- `resources/js/Components/Charts/UsageVsWasteChart.tsx`  
- `resources/js/Components/Dashboard/TopWasteTable.tsx`  
**Referensi Kontrak**: [Desain.md](file:///home/lasains/ssd2/matkul/pemograman%20lanjut/projek/Desain.md), [PRD.md](file:///home/lasains/ssd2/matkul/pemograman%20lanjut/projek/PRD.md), dan [inventory.d.ts](file:///home/lasains/ssd2/matkul/pemograman%20lanjut/projek/resources/js/types/inventory.d.ts)

---

## 1. RINGKASAN KEBUTUHAN INFORMASI EKSEKUTIF OWNER & KPI FINANSIAL

### 1.1 Persona Pemilik Kafe (*The Helicopter View*)
Pemilik kafe (*Owner*) tidak berkutat pada urusan teknis seperti menimbang gram biji kopi atau menginput nomor faktur pemasok. Fokus utama Owner adalah **kesehatan kas, efisiensi modal bahan, dan meminimalkan kebocoran laba akibat bahan basi**:
1. **Berapa total uang kafe yang saat ini mengendap di gudang?** (Total Nilai Aset Bahan).
2. **Berapa potensi modal yang akan hangus jika tidak segera terjual dalam 3 hari ke depan?** (Nilai Bahan Kritis).
3. **Berapa kerugian riil akibat bahan terbuang sia-sia bulan ini?** (Total Kerugian Limbah / *Waste Loss*).
4. **Bahan baku apa yang paling sering basi dan menyebabkan kerugian terbesar?** (Evaluasi negosiasi vendor dan kuantitas pemesanan).

---

### 1.2 Diagram Alur Agregasi Finansial & KPI Inventaris

```mermaid
flowchart TD
    subgraph DataSources ["Tabel Transaksional Database"]
        Batches["ingredient_batches<br/>(current_stock * cost_per_unit)"]
        Usages["stock_usages<br/>(quantity_used * cost_per_unit)"]
        Wastes["waste_logs (status: approved)<br/>(SUM financial_loss)"]
    end

    subgraph Calculations ["Agregasi Finansial Backend (Carbon & Eloquent)"]
        TotalAsset["1. Total Nilai Aset:<br/>Akumulasi modal berjalan di gudang & bar"]
        CriticalAsset["2. Nilai Bahan Kritis:<br/>Akumulasi batch dengan days_until_expiry < 3"]
        TotalLoss["3. Total Beban Kerugian:<br/>Total rupiah bahan yang dibuang resmi"]
        MonthlyComp["4. Komparasi Bulanan:<br/>Biaya Terpakai Efektif vs Terbuang Sia-sia"]
        TopWasteRank["5. Ranking 5 Bahan Paling Boros:<br/>Bahan penyumbang kerugian terbesar"]
    end

    Batches --> TotalAsset
    Batches --> CriticalAsset
    Usages --> MonthlyComp
    Wastes --> TotalLoss
    Wastes --> MonthlyComp
    Wastes --> TopWasteRank

    subgraph OwnerUI ["Tampilan Dasbor Eksekutif (OwnerDashboard.tsx)"]
        Card1["Metric Card: Total Nilai Aset"]
        Card2["Metric Card: Nilai Bahan Kritis (3 Hari)"]
        Card3["Metric Card: Total Kerugian Bulan Ini"]
        Chart["Grafik Batang Recharts (Emerald Harvest vs Terracotta Cherry)"]
        Table["Tabel Top 5 Bahan Paling Boros + Progress Bar"]
    end

    TotalAsset --> Card1
    CriticalAsset --> Card2
    TotalLoss --> Card3
    MonthlyComp --> Chart
    TopWasteRank --> Table
```

---

## 2. STITCH-READY SCREEN SPECIFICATION (GOOGLE STITCH PROMPT)

Spesifikasi berikut dirancang agar siap dimasukkan ke Google Stitch untuk menghasilkan purwarupa visual dasbor analitik eksekutif.

### 2.1 Identitas Modul Layar
* **Screen Title**: Executive Specialty Coffee Inventory & Financial Analytics Dashboard
* **Target Viewport**: Desktop (1440x900) & iPad Pro / Tablet Owner (1024x768)
* **Visual Tone**: Warm Modern Artisan SaaS, Canvas `#FAF7F2`, Containers `#F5EFEB` & `#EDE4DC`, Emerald Harvest (Aset & Terpakai), Terracotta Cherry `#8C3D2B` (Kerugian & Kritis), Deep Espresso `#241408` Bold Typography.

---

### 2.2 Rincian Tiga Blok Antarmuka Dasbor

#### Blok 1: Toolbar Header & 3 Executive Metric Cards
1. **Header Dasbor & Filter Rentang Waktu**:
   - Judul: `text-2xl font-bold tracking-tight text-content-high` (*"Dasbor Analitik & Finansial"*).
   - Subjudul: `text-sm text-content-medium` (*"Ringkasan nilai aset bahan, evaluasi masa kedaluwarsa, dan efisiensi modal kafe"*).
   - Filter Bar Kanan:
     * Select Dropdown Bulan (Januari – Desember, default bulan aktif).
     * Select Dropdown Tahun (2026).
     * Tombol Sekunder: `[Unduh Laporan Finansial]` dengan ikon `Download` (`border-surface-border bg-surface-container-high text-content-high`).
2. **Grid 3 Kartu Metrik Utama (`grid grid-cols-1 md:grid-cols-3 gap-6`)**:
   - **Kartu 1 (Total Nilai Aset Bahan Baku)**:
     * Container: `bg-surface-container p-6 rounded-xl border border-surface-border shadow-sm flex flex-col justify-between`.
     * Baris Atas: Label `text-xs font-semibold uppercase tracking-wider text-content-subtle` (*Total Nilai Aset Persediaan*) dan ikon koin/dompet `Wallet` berlatar `p-2 bg-emerald-50 text-emerald-800 rounded-lg`.
     * Nilai Utama: `text-3xl font-bold tracking-tight text-content-high font-mono` (misal: `Rp 48.250.000`).
     * Baris Bawah: Badge hijau halus (*"Aktif di 38 Batch Gudang & Bar"*).
   - **Kartu 2 (Nilai Bahan Kritis < 3 Hari)**:
     * Container: `bg-surface-container p-6 rounded-xl border border-[#F8C6BF] shadow-sm flex flex-col justify-between relative overflow-hidden`.
     * Aksen: Garis batas atas terracotta tipis (`border-t-4 border-[#8C3D2B]`).
     * Baris Atas: Label (*Modal Bahan Kritis*) dan ikon `AlertOctagon` berlatar `p-2 bg-[#FDF2F0] text-[#8C3D2B] rounded-lg`.
     * Nilai Utama: `text-3xl font-bold tracking-tight text-[#8C3D2B] font-mono` (misal: `Rp 1.450.000`).
     * Baris Bawah: Keterangan urgensi (*"Beresiko basi dalam 3 hari ke depan"*).
   - **Kartu 3 (Total Beban Kerugian Limbah Bulan Ini)**:
     * Container: `bg-surface-container p-6 rounded-xl border border-surface-border shadow-sm flex flex-col justify-between`.
     * Baris Atas: Label (*Total Kerugian Bahan Rusak*) dan ikon `TrendingDown` berlatar `p-2 bg-[#FDF2F0] text-[#8C3D2B] rounded-lg`.
     * Nilai Utama: `text-3xl font-bold tracking-tight text-[#8C3D2B] font-mono` (misal: `Rp 420.500`).
     * Baris Bawah: Rasio pemborosan (*"0.87% dari total perputaran bahan bulan ini"*).

---

#### Blok 2: Grafik Batang Komparasi Bulanan (Recharts)
- Grid layout: 60% lebar layar desktop (`lg:col-span-3`).
- Container: `bg-surface-container p-6 rounded-xl border border-surface-border shadow-sm`.
- Header Grafik:
  * Judul: `text-base font-semibold text-content-high` (*"Komparasi Biaya Bahan: Terpakai vs Terbuang Sia-sia"*).
  * Legend Interaktif:
    * Kotak Hijau Emerald Harvest: *"Nilai Bahan Terpakai Efektif (COGS)"*
    * Kotak Terracotta Cherry: *"Nilai Bahan Terbuang Sia-sia (Waste Loss)"*
- Visual Grafik Batang Ganda (*Dual Bar Chart*):
  * Sumbu X: Nama-nama bulan (Jan, Feb, Mar, Apr, Mei, Jun, ...).
  * Sumbu Y: Nominal Rupiah (Rp 0, Rp 10Jt, Rp 20Jt, Rp 30Jt, Rp 40Jt).
  * Batang Hijau Harvest (`fill="#059669"`, radius atas `rounded-t-sm`).
  * Batang Terracotta Cherry (`fill="#8C3D2B"`, radius atas `rounded-t-sm`).
  * Tooltip Melayang Interaktif (*Floating Custom Tooltip*):
    - Background oat latte `bg-surface-container`, border parchment `border-surface-border`, shadow-lg, padding 12px.
    - Menampilkan nama bulan, nominal bahan terpakai, nominal bahan rusak, dan indikator persentase efisiensi (misal: *"Efisiensi Pemakaian: 98.4%"*).

---

#### Blok 3: Peringkat 5 Bahan Paling Boros (Top 5 Waste Ingredients)
- Grid layout: 40% lebar layar desktop (`lg:col-span-2`).
- Container: `bg-surface-container p-6 rounded-xl border border-surface-border shadow-sm`.
- Header:
  * Judul: `text-base font-semibold text-content-high` (*"5 Bahan Penyumbang Kerugian Terbesar"*).
  * Subjudul: `text-xs text-content-subtle` (*"Evaluasi kuantitas restock dan durasi simpan bahan berikut"*).
- Tabel Sederhana Bersih:
  * Kolom: Nomor urut (1-5), Nama Bahan & Kategori, Kuantitas Dibuang, dan Total Kerugian Rupiah.
  * Setiap baris memiliki **Visual Progress Bar Tipis** di bawah nominal rupiah yang menggambarkan persentase kontribusi bahan tersebut terhadap total kerugian (misal: *Fresh Milk Diamond 1L* menyumbang 52% dari seluruh kerugian kafe) menggunakan aksen terracotta `#8C3D2B`.

---

### 2.3 Teks Prompt Siap Pakai untuk Google Stitch

#### Prompt Bahasa Indonesia (Terstruktur & Deskriptif)
```text
Buatkan desain antarmuka layar dasbor eksekutif untuk modul "Dasbor Analitik & Finansial Kafe" pada aplikasi "BeanFlow" khusus persona Owner bernuansa hangat artisan coffee:

Latar belakang kanvas susu hangat #FAF7F2.
Bagian Header:
- Judul halaman tebal "Dasbor Analitik & Finansial Eksekutif" (#241408) dan subjudul penjelasan (#5C3A21).
- Toolbar kanan: dropdown pilihan bulan ("Oktober 2026") dan tombol outline perkamen dengan ikon download "Unduh Laporan Keuangan".

Bagian Atas (3 Kartu Metrik Eksekutif berlatar oat latte #F5EFEB, border #EDE4DC):
- Kartu 1: Total Nilai Aset Bahan Baku (Angka besar monospaced "Rp 48.250.000", ikon dompet hijau botani, label persediaan aktif di 38 batch).
- Kartu 2: Modal Bahan Kritis Berisiko (Border atas terracotta tipis #8C3D2B, angka monospaced "Rp 1.450.000" warna terracotta #8C3D2B, ikon peringatan, label "Expired dalam < 3 hari").
- Kartu 3: Beban Kerugian Limbah Bulan Ini (Angka monospaced "Rp 420.500" warna terracotta #8C3D2B, ikon tren turun, label rasio limbah 0.87%).

Bagian Bawah (Layout 2 Kolom Berdampingan):
1. Kolom Kiri (60% lebar): Card grafik batang ganda Recharts "Komparasi Biaya: Terpakai vs Limbah Terbuang". Batang hijau harvest (#059669) untuk bahan terpakai dan batang terracotta cherry (#8C3D2B) untuk bahan basi per bulan (Januari - Oktober). Terdapat legenda warna yang rapi dan garis grid latar belakang yang sangat halus.
2. Kolom Kanan (40% lebar): Card tabel "5 Bahan Paling Boros Bulan Ini". Daftar 5 baris:
   - Rank 1: Fresh Milk Diamond 1L (Terbuang 6.000 ml • Rugi Rp 144.000 • progress bar terracotta #8C3D2B 34%)
   - Rank 2: Croissant Butter Pastry (Terbuang 8 pcs • Rugi Rp 120.000 • progress bar terracotta 28%)
   - Rank 3: Sirup Karamel Monin (Terbuang 400 ml • Rugi Rp 68.000 • progress bar terracotta 16%)
   - Rank 4: Oat Milk Oatside (Terbuang 1.500 ml • Rugi Rp 52.500 • progress bar terracotta 12%)
   - Rank 5: Whipping Cream Anchor (Terbuang 500 ml • Rugi Rp 36.000 • progress bar terracotta 10%)
Tampilan sangat bersih, bernuansa kafe mewah, tipografi tajam, kontras tinggi, elegan ala dashboard SaaS finansial modern.
```

#### English Prompt (High-Fidelity for Stitch AI)
```text
An executive financial analytics dashboard for a specialty coffee inventory system named "BeanFlow", tailored for the cafe Owner persona with warm coffee aesthetics:
Warm steamed milk canvas (#FAF7F2) background. Top header features the page title "Executive Financial & Inventory Analytics" (#241408) with month-picker dropdown and an "Export PDF Report" button on parchment container.
Top row features 3 bold executive metric cards on oat latte (#F5EFEB, border #EDE4DC):
1. "Total Inventory Asset Value" with bold monospaced rupiah amount "Rp 48,250,000", botanical emerald wallet icon badge, and active batch counter.
2. "At-Risk Critical Asset Value" with subtle top terracotta border (#8C3D2B), terracotta monospace "Rp 1,450,000" (#8C3D2B), alert icon, subtext "Expiring in < 3 days".
3. "Total Waste Loss This Month" with terracotta monospace "Rp 420,500" (#8C3D2B), trending down icon, and waste efficiency ratio subtext (0.87%).

Bottom section features a 2-column responsive layout:
- Left Column (60% width): Recharts dual-bar comparison chart "Monthly Usage vs. Waste Loss". Emerald bars (#059669) for effectively consumed ingredients vs terracotta cherry bars (#8C3D2B) for wasted/spoiled stock across Jan - Oct, with clean legends and subtle parchment gridlines.
- Right Column (40% width): Clean card listing "Top 5 Wasted Ingredients". Shows 5 ranked rows (e.g. Fresh Milk Diamond, Butter Croissant, Caramel Syrup) with quantity wasted, rupiah loss amount, and a slim terracotta progress bar (#8C3D2B) showing percentage of total loss. High contrast, warm coffee typography, polished financial SaaS aesthetic.
```

---

## 3. ARSITEKTUR TEKNIS FRONTEND (REACT + RECHARTS + INERTIA)

### 3.1 Lokasi File & Komposisi
```text
resources/js/
├── Pages/
│   └── Dashboard/
│       └── OwnerDashboard.tsx          # Halaman utama dasbor analitik Owner
├── Components/
│   ├── MetricCard.tsx                  # Komponen kartu metrik eksekutif serbaguna
│   ├── Dashboard/
│   │   └── TopWasteTable.tsx           # Komponen tabel 5 bahan paling boros
│   └── Charts/
│       └── UsageVsWasteChart.tsx       # Komponen grafik Recharts batang ganda
└── types/
    └── inventory.d.ts                  # Kontrak data TypeScript
```

---

### 3.2 Kontrak Tipe Data TypeScript

Mengacu pada [`resources/js/types/inventory.d.ts`](file:///home/lasains/ssd2/matkul/pemograman%20lanjut/projek/resources/js/types/inventory.d.ts):

```typescript
// resources/js/types/analytics.ts
import { DashboardMetrics } from '@/types/inventory';

export interface MonthlyComparisonData {
    month: string;           // 'Jan', 'Feb', 'Mar', dst.
    usage_cost: number;      // Biaya bahan terpakai efektif (Rp)
    waste_cost: number;      // Biaya bahan basi terbuang (Rp)
    efficiency_rate: number; // Persentase efisiensi (misal: 98.5%)
}

export interface TopWasteItem {
    ingredient_name: string;
    category_name: string;
    waste_quantity: number;
    unit: string;
    financial_loss: number;
    loss_percentage: number; // Persentase kontribusi terhadap total kerugian (misal: 34.2%)
}

export interface OwnerDashboardProps {
    metrics: DashboardMetrics;
    monthlyComparison: MonthlyComparisonData[];
    topWasteIngredients: TopWasteItem[];
    currentPeriod: {
        month: number;
        year: number;
    };
}
```

---

### 3.3 Komponen Grafik Recharts `UsageVsWasteChart.tsx`

```tsx
// resources/js/Components/Charts/UsageVsWasteChart.tsx
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from 'recharts';
import { MonthlyComparisonData } from '@/types/analytics';

interface Props {
    data: MonthlyComparisonData[];
}

// Formatter Rupiah Singkat untuk Sumbu Y (misal: 10Jt, 20Jt)
const formatYAxis = (value: number) => {
    if (value >= 1_000_000) {
        return `Rp ${(value / 1_000_000).toFixed(0)} Jt`;
    }
    if (value >= 1_000) {
        return `Rp ${(value / 1_000).toFixed(0)} Rb`;
    }
    return `Rp ${value}`;
};

// Custom Floating Tooltip
const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        const usage = payload[0].value;
        const waste = payload[1].value;
        const efficiency = ((usage / (usage + waste)) * 100).toFixed(1);

        return (
            <div className="rounded-xl border border-surface-border bg-surface-container p-3.5 shadow-lg text-xs space-y-2">
                <p className="font-bold text-content-high border-b border-surface-border pb-1 text-sm">
                    Periode: {label} 2026
                </p>
                <div className="flex items-center justify-between gap-4">
                    <span className="flex items-center gap-1.5 text-emerald-800">
                        <span className="h-2.5 w-2.5 rounded-full bg-emerald-600" />
                        Bahan Terpakai:
                    </span>
                    <span className="font-semibold font-mono text-content-high">
                        Rp {usage.toLocaleString('id-ID')}
                    </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                    <span className="flex items-center gap-1.5 text-brand-tertiary">
                        <span className="h-2.5 w-2.5 rounded-full bg-brand-tertiary" />
                        Limbah Terbuang:
                    </span>
                    <span className="font-semibold font-mono text-brand-tertiary">
                        Rp {waste.toLocaleString('id-ID')}
                    </span>
                </div>
                <div className="pt-1 border-t border-surface-border flex justify-between font-medium">
                    <span className="text-content-medium">Efisiensi Bahan:</span>
                    <span className="text-emerald-700 font-bold">{efficiency}%</span>
                </div>
            </div>
        );
    }
    return null;
};

export function UsageVsWasteChart({ data }: Props) {
    return (
        <div className="w-full h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={data}
                    margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                    barGap={4}
                >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EDE4DC" />
                    <XAxis
                        dataKey="month"
                        stroke="#9C8474"
                        fontSize={12}
                        tickLine={false}
                        axisLine={{ stroke: '#EDE4DC' }}
                    />
                    <YAxis
                        stroke="#9C8474"
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={formatYAxis}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                        verticalAlign="top"
                        align="right"
                        iconType="circle"
                        wrapperStyle={{ paddingBottom: '16px', fontSize: '12px' }}
                    />
                    <Bar
                        name="Bahan Terpakai (COGS)"
                        dataKey="usage_cost"
                        fill="#059669"
                        radius={[4, 4, 0, 0]}
                        maxBarSize={32}
                    />
                    <Bar
                        name="Limbah Terbuang (Waste)"
                        dataKey="waste_cost"
                        fill="#8C3D2B"
                        radius={[4, 4, 0, 0]}
                        maxBarSize={32}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
```

---

### 3.4 Komponen Tabel 5 Bahan Paling Boros `TopWasteTable.tsx`

```tsx
// resources/js/Components/Dashboard/TopWasteTable.tsx
import { TopWasteItem } from '@/types/analytics';

interface Props {
    items: TopWasteItem[];
}

export function TopWasteTable({ items }: Props) {
    if (!items || items.length === 0) {
        return (
            <div className="py-12 text-center text-sm text-slate-500">
                🎉 Belum ada catatan bahan terbuang pada periode ini.
            </div>
        );
    }

    return (
        <div className="divide-y divide-slate-100">
            {items.map((item, index) => (
                <div key={item.ingredient_name} className="py-3 flex flex-col gap-1.5">
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2.5">
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-surface-container-high text-xs font-semibold text-content-high">
                                {index + 1}
                            </span>
                            <div>
                                <span className="font-semibold text-content-high block leading-tight">
                                    {item.ingredient_name}
                                </span>
                                <span className="text-xs text-content-subtle">
                                    {item.waste_quantity.toLocaleString('id-ID')} {item.unit} • {item.category_name}
                                </span>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="font-mono font-bold text-brand-tertiary block leading-tight">
                                Rp {item.financial_loss.toLocaleString('id-ID')}
                            </span>
                            <span className="text-xs text-content-subtle">{item.loss_percentage}% dari total</span>
                        </div>
                    </div>
                    {/* Visual Progress Bar Kontribusi Kerugian */}
                    <div className="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                        <div
                            className="h-full bg-brand-tertiary rounded-full"
                            style={{ width: `${Math.min(item.loss_percentage, 100)}%` }}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}
```

---

## 4. EDGE CASES & DATA PRESENTATION

### 4.1 Kasus Bulan Baru / Data Belum Ada (*Empty State*)
- Jika kafe baru beroperasi atau awal bulan belum ada transaksi:
  - Grafik Recharts tidak boleh rusak (*crash*).
  - Tampilkan wadah kosong dengan border putus-putus (`border-dashed border-slate-200 rounded-xl p-8 text-center`):
    * Ikon `BarChart3` warna abu-abu lembut.
    * Teks: *"Belum ada data pemakaian dan limbah tercatat untuk periode ini. Grafik akan terisi otomatis seiring pencatatan operasional bar."*

### 4.2 Kondisi Ideal Tanpa Pemborosan (*Zero Food Waste*)
- Jika `monthly_waste_loss === 0`:
  - Kartu Metrik 3 menampilkan teks hijau ceria: `Rp 0`.
  - Subteks: *"🌟 Luar Biasa! Efisiensi bahan 100% (Zero Waste tercapai)."*

### 4.3 Navigasi Pergantian Periode (Inertia Visit)
- Saat Owner mengubah dropdown bulan atau tahun:
  ```typescript
  import { router } from '@inertiajs/react';

  const handlePeriodChange = (month: number, year: number) => {
      router.get(
          route('dashboard.owner'),
          { month, year },
          { preserveState: true, preserveScroll: true }
      );
  };
  ```

---

## 5. REKOMENDASI TAHAPAN IMPLEMENTASI KODING

1. **Langkah 1**: Buat komponen `MetricCard.tsx` di `resources/js/Components/`.
2. **Langkah 2**: Buat komponen grafik `UsageVsWasteChart.tsx` menggunakan `recharts`.
3. **Langkah 3**: Buat komponen tabel ranking `TopWasteTable.tsx`.
4. **Langkah 4**: Gabungkan seluruh komponen ke dalam halaman [`resources/js/Pages/Dashboard/OwnerDashboard.tsx`](file:///home/lasains/ssd2/matkul/pemograman%20lanjut/projek/resources/js/Pages/Dashboard/OwnerDashboard.tsx).
5. **Langkah 5**: Buat kueri agregasi finansial di `DashboardController.php` pada backend Laravel dengan relasi `StockUsage` dan `WasteLog`.
