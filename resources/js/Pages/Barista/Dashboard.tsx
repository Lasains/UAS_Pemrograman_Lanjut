import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    AlertCircle,
    AlertOctagon,
    AlertTriangle,
    ArrowRight,
    Calendar,
    Check,
    CheckCircle2,
    Clock,
    Coffee,
    Flame,
    History,
    Hourglass,
    Info,
    LayoutDashboard,
    MapPin,
    PackageCheck,
    PackagePlus,
    RefreshCw,
    ShieldCheck,
    TrendingUp,
} from 'lucide-react';
import { useState } from 'react';

interface BarHealthItem {
    id: number;
    name: string;
    location: string;
    stock: string;
    priorityBatch: string;
    expiryText: string;
    status: 'safe' | 'warning' | 'critical';
    statusText: string;
    percentage: number;
}

interface ActivityItem {
    id: number;
    time: string;
    ingredient: string;
    amount: string;
    target: string;
    batchCode: string;
    barista: string;
    isCompliant: boolean;
}

const DEFAULT_HEALTH_ITEMS: BarHealthItem[] = [
    {
        id: 1,
        name: 'Fresh Milk Diamond 1L',
        location: 'Chiller Depan Bar',
        stock: '4.200 ml (3 batch aktif)',
        priorityBatch: '#BCH-20241026-A3F2',
        expiryText: 'Besok (1 Hari)',
        status: 'critical',
        statusText: 'Merah: Kritis 1 Hari',
        percentage: 25,
    },
    {
        id: 2,
        name: 'Oatside Oat Milk Barista 1L',
        location: 'Chiller Utama',
        stock: '3.000 ml (3 batch)',
        priorityBatch: '#BCH-20241102-OAT1',
        expiryText: '7 Hari',
        status: 'warning',
        statusText: 'Kuning: Warning 7 Hari',
        percentage: 60,
    },
    {
        id: 3,
        name: 'House Espresso Blend (Beans)',
        location: 'Hopper Grinder 1 & 2',
        stock: '5.400 gr (3 pack)',
        priorityBatch: '#EB-2024-09',
        expiryText: '13 Hari (Peak)',
        status: 'safe',
        statusText: 'Hijau: Peak Degassing',
        percentage: 85,
    },
    {
        id: 4,
        name: 'Monin Caramel Syrup 700ml',
        location: 'Rak Sirup Bar',
        stock: '3.200 ml (4 btl)',
        priorityBatch: '#SY-0920',
        expiryText: '45 Hari',
        status: 'safe',
        statusText: 'Hijau: Aman 45 Hari',
        percentage: 75,
    },
    {
        id: 5,
        name: 'Cup Hot 8oz & Lid',
        location: 'Dry Station Dispenser',
        stock: '350 pcs',
        priorityBatch: '#CUP-8OZ-10',
        expiryText: 'Stok Cukup',
        status: 'safe',
        statusText: 'Hijau: Stok Cukup',
        percentage: 90,
    },
];

const DEFAULT_ACTIVITIES: ActivityItem[] = [
    {
        id: 1,
        time: '10:38 WIB',
        ingredient: 'Fresh Milk Diamond 1L',
        amount: '250 ml',
        target: '2x Caffe Latte',
        batchCode: '#BCH-20241026-A3F2',
        barista: 'Andi (Barista)',
        isCompliant: true,
    },
    {
        id: 2,
        time: '10:24 WIB',
        ingredient: 'House Espresso Blend',
        amount: '180 gr',
        target: 'Isi Hopper Grinder',
        batchCode: '#EB-2024-09',
        barista: 'Andi (Barista)',
        isCompliant: true,
    },
    {
        id: 3,
        time: '09:50 WIB',
        ingredient: 'Oatside Oat Milk Barista',
        amount: '200 ml',
        target: 'Oat Latte Iced',
        batchCode: '#BCH-20241102-OAT1',
        barista: 'Dimas Pratama',
        isCompliant: false, // Deviasi teralasan
    },
    {
        id: 4,
        time: '09:15 WIB',
        ingredient: 'Monin Caramel Syrup',
        amount: '40 ml',
        target: 'Caramel Macchiato',
        batchCode: '#SY-0920',
        barista: 'Andi (Barista)',
        isCompliant: true,
    },
];

export default function BaristaDashboard() {
    const user = usePage().props.auth.user;
    const [healthItems] = useState<BarHealthItem[]>(DEFAULT_HEALTH_ITEMS);
    const [activities] = useState<ActivityItem[]>(DEFAULT_ACTIVITIES);

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-2">
                    <span className="text-lg font-bold tracking-tight text-content-high">
                        Dasbor Operasional Barista
                    </span>
                    <span className="rounded bg-brand-primary px-1.5 py-0.5 text-[10px] font-bold text-white">
                        LIVE
                    </span>
                </div>
            }
        >
            <Head title="Dasbor Operasional Barista - BeanFlow" />

            <div className="space-y-6">
                {/* 1. HEADER TOOLBAR */}
                <div className="flex flex-col justify-between gap-4 border-b border-surface-border pb-4 lg:flex-row lg:items-center">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-content-high">
                            Dasbor Operasional Barista
                        </h1>
                        <p className="mt-0.5 text-xs text-content-medium sm:text-sm">
                            Ringkasan status bar real-time, alert shift aktif, dan kesehatan inventaris meja racik.
                        </p>
                    </div>

                    {/* Sisi Kanan: Status Stasiun & Jam Operasional */}
                    <div className="flex flex-wrap items-center gap-2.5">
                        <div className="flex items-center gap-2 rounded-xl border border-surface-border bg-surface-container px-3 py-1.5 text-xs font-semibold text-content-high shadow-2xs">
                            <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-500" />
                            <span>Bar Utama (Station A)</span>
                            <span className="font-normal text-content-subtle">• Optimal</span>
                        </div>

                        <div className="flex items-center gap-2 rounded-xl border border-surface-border bg-surface-container px-3 py-1.5 text-xs font-medium text-content-medium shadow-2xs">
                            <Clock className="h-4 w-4 text-brand-secondary" />
                            <span>
                                Shift: <strong className="text-content-high">Pagi (07:00 - 15:00 WIB)</strong>
                            </span>
                        </div>

                        <div className="flex items-center gap-1.5 rounded-xl bg-brand-primary px-3 py-1.5 text-xs font-mono font-semibold text-surface-canvas shadow-xs">
                            <Calendar className="h-3.5 w-3.5 text-brand-secondary" />
                            <span>Live Sync</span>
                            <span className="mx-0.5 text-white/40">|</span>
                            <span className="text-[#FED7AA]">Aktif</span>
                        </div>
                    </div>
                </div>

                {/* 2. THREE LARGE TOUCH ACTION CARDS */}
                <section aria-label="Aksi Cepat Barista" className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {/* Action 1: Catat Pemakaian */}
                    <Link
                        href="/usage/create"
                        className="group flex items-center justify-between rounded-2xl bg-brand-primary p-5 text-white shadow-sm transition-all hover:bg-brand-primary-hover active:scale-[0.99]"
                    >
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-white backdrop-blur-xs">
                                <Flame className="h-6 w-6 text-brand-secondary" />
                            </div>
                            <div>
                                <h2 className="text-base font-bold leading-tight text-white">
                                    Catat Pemakaian (FEFO)
                                </h2>
                                <p className="mt-0.5 text-xs text-white/80">
                                    Pengurangan stok susu, sirup, & biji kopi
                                </p>
                            </div>
                        </div>
                        <ArrowRight className="h-5 w-5 text-brand-secondary transition-transform group-hover:translate-x-1" />
                    </Link>

                    {/* Action 2: Penerimaan Batch */}
                    <Link
                        href="/batches/create"
                        className="group flex items-center justify-between rounded-2xl border border-surface-border bg-surface-container-high p-5 text-content-high shadow-sm transition-all hover:bg-[#E2D6CB] active:scale-[0.99]"
                    >
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-primary text-white shadow-xs">
                                <PackagePlus className="h-6 w-6" />
                            </div>
                            <div>
                                <h2 className="text-base font-bold leading-tight text-content-high">
                                    Penerimaan Batch Baru
                                </h2>
                                <p className="mt-0.5 text-xs text-content-medium">
                                    Input stok barang datang & tanggal expired
                                </p>
                            </div>
                        </div>
                        <ArrowRight className="h-5 w-5 text-brand-primary transition-transform group-hover:translate-x-1" />
                    </Link>

                    {/* Action 3: Lapor Bahan Rusak */}
                    <Link
                        href="/waste/create"
                        className="group flex items-center justify-between rounded-2xl border border-[#FED7AA] bg-[#FFF7ED] p-5 text-brand-secondary shadow-sm transition-all hover:bg-[#FEEBC8] active:scale-[0.99]"
                    >
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-secondary/20 text-brand-secondary">
                                <AlertTriangle className="h-6 w-6" />
                            </div>
                            <div>
                                <h2 className="text-base font-bold leading-tight text-[#784102]">
                                    Lapor Bahan Rusak
                                </h2>
                                <p className="mt-0.5 text-xs text-[#A1580A]">
                                    Pengajuan tiket basi/tumpah ke supervisor
                                </p>
                            </div>
                        </div>
                        <ArrowRight className="h-5 w-5 text-brand-secondary transition-transform group-hover:translate-x-1" />
                    </Link>
                </section>

                {/* 3. METRIC CARDS ROW */}
                <section aria-label="Metrik Shift Harian" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Metric 1: Kepatuhan FEFO */}
                    <article className="flex flex-col justify-between rounded-2xl border border-surface-border bg-surface-container p-5 shadow-2xs">
                        <div className="flex items-center justify-between text-content-medium">
                            <span className="text-xs font-bold uppercase tracking-wider">Kepatuhan FEFO Shift</span>
                            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                                <ShieldCheck className="h-4 w-4" />
                            </div>
                        </div>
                        <div className="mt-3">
                            <div className="font-mono text-3xl font-extrabold tracking-tight text-emerald-700">
                                94.8%
                            </div>
                            <p className="mt-1 text-xs font-medium text-content-medium">
                                Target &gt; 90% (18 dari 19 pemakaian patuh)
                            </p>
                        </div>
                        <div className="mt-3 flex items-center justify-between border-t border-surface-border pt-2.5 text-[11px] text-content-subtle">
                            <span className="flex items-center gap-1 font-semibold text-emerald-700">
                                <TrendingUp className="h-3 w-3" /> +2.3% vs kemarin
                            </span>
                            <span>Audit: Aman</span>
                        </div>
                    </article>

                    {/* Metric 2: Volume Konsumsi */}
                    <article className="flex flex-col justify-between rounded-2xl border border-surface-border bg-surface-container p-5 shadow-2xs">
                        <div className="flex items-center justify-between text-content-medium">
                            <span className="text-xs font-bold uppercase tracking-wider">Konsumsi Bar Hari Ini</span>
                            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-secondary/15 text-brand-secondary">
                                <Coffee className="h-4 w-4" />
                            </div>
                        </div>
                        <div className="mt-3">
                            <div className="font-mono text-2xl font-extrabold tracking-tight text-content-high">
                                4.250 ml <span className="font-sans text-xs font-normal text-content-medium">&amp;</span> 1.280 gr
                            </div>
                            <p className="mt-1 text-xs font-medium text-content-medium">
                                Est. 68 porsi minuman disajikan
                            </p>
                        </div>
                        <div className="mt-3 flex items-center justify-between border-t border-surface-border pt-2.5 text-[11px] text-content-subtle">
                            <span>Peak: 08:30 - 10:00</span>
                            <span className="font-mono text-content-medium">Rasio 1:18 OK</span>
                        </div>
                    </article>

                    {/* Metric 3: Batch Kritis */}
                    <article className="flex flex-col justify-between rounded-2xl border border-surface-border bg-surface-container p-5 shadow-2xs">
                        <div className="flex items-center justify-between text-content-medium">
                            <span className="text-xs font-bold uppercase tracking-wider">Batch Kritis Shift</span>
                            <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#F8C6BF] bg-[#FDF2F0] text-brand-tertiary">
                                <AlertTriangle className="h-4 w-4" />
                            </div>
                        </div>
                        <div className="mt-3">
                            <div className="font-mono text-3xl font-extrabold tracking-tight text-brand-secondary">
                                1 Batch
                            </div>
                            <p className="mt-1 text-xs font-semibold text-brand-tertiary">
                                Fresh Milk Diamond (&lt; 24 jam)
                            </p>
                        </div>
                        <div className="mt-3 flex items-center justify-between border-t border-surface-border pt-2.5 text-[11px] text-content-subtle">
                            <span className="font-semibold text-brand-tertiary">Prioritas Utama</span>
                            <span className="font-mono">Chiller Depan Bar</span>
                        </div>
                    </article>

                    {/* Metric 4: Kesiapan Stok Bar */}
                    <article className="flex flex-col justify-between rounded-2xl border border-surface-border bg-surface-container p-5 shadow-2xs">
                        <div className="flex items-center justify-between text-content-medium">
                            <span className="text-xs font-bold uppercase tracking-wider">Kesiapan Stok Bar</span>
                            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-primary/10 text-brand-primary">
                                <PackageCheck className="h-4 w-4" />
                            </div>
                        </div>
                        <div className="mt-3">
                            <div className="font-mono text-3xl font-extrabold tracking-tight text-brand-primary">
                                98.2% <span className="font-sans text-sm font-bold text-emerald-700">Siap</span>
                            </div>
                            <p className="mt-1 text-xs font-medium text-content-medium">
                                Semua bahan utama di atas ambang minimum
                            </p>
                        </div>
                        <div className="mt-3 flex items-center justify-between border-t border-surface-border pt-2.5 text-[11px] text-content-subtle">
                            <span>Siaga rush hour siang</span>
                            <span className="font-semibold text-emerald-700">Ready</span>
                        </div>
                    </article>
                </section>

                {/* 4. SPLIT ROW: ALERTS & LIVE HEALTH */}
                <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* KARTU KIRI: Peringatan Aktif & Prioritas FEFO */}
                    <div className="flex flex-col justify-between space-y-5 rounded-2xl border border-surface-border bg-surface-container p-6 shadow-2xs">
                        <div>
                            <div className="flex items-center justify-between border-b border-surface-border pb-3">
                                <div className="flex items-center gap-2">
                                    <AlertOctagon className="h-5 w-5 text-brand-tertiary" />
                                    <h2 className="text-base font-bold text-content-high">
                                        Peringatan Aktif & Prioritas FEFO Shift
                                    </h2>
                                </div>
                                <span className="rounded-full bg-brand-tertiary px-2.5 py-0.5 text-xs font-bold text-white">
                                    1 Perlu Tindakan
                                </span>
                            </div>

                            <div className="mt-4 space-y-3.5">
                                {/* Alert 1: Urgent Terracotta */}
                                <div className="rounded-xl border-2 border-[#F8C6BF] bg-[#FDF2F0] p-4 shadow-xs">
                                    <div className="flex items-start gap-3">
                                        <div className="mt-0.5 flex h-9 w-9 flex-shrink-0 animate-pulse items-center justify-center rounded-lg border border-[#F8C6BF] bg-brand-tertiary/10 text-brand-tertiary">
                                            <AlertOctagon className="h-5 w-5" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex flex-wrap items-center justify-between gap-1">
                                                <span className="rounded bg-brand-tertiary px-2 py-0.5 text-[10px] font-extrabold uppercase text-white">
                                                    URGENT FEFO
                                                </span>
                                                <span className="font-mono text-xs font-bold text-brand-tertiary">
                                                    Exp: Besok (24 Jam)
                                                </span>
                                            </div>
                                            <h3 className="mt-1 text-sm font-bold text-brand-tertiary">
                                                Habiskan Segera: Fresh Milk Diamond Batch #BCH-20241026-A3F2
                                            </h3>
                                            <p className="mt-1 text-xs leading-relaxed text-content-medium">
                                                Sisa <strong>1.000 ml</strong> di chiller depan bar stasiun espresso. Jangan buka karton baru sebelum batch ini habis.
                                            </p>
                                            <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                                                <div className="flex items-center gap-1.5 rounded-md border border-[#F8C6BF]/60 bg-white/70 px-2.5 py-1 text-[11px] font-semibold text-content-medium">
                                                    <MapPin className="h-3.5 w-3.5 text-brand-tertiary" />
                                                    <span>Chiller Depan Bar • Rak Bawah</span>
                                                </div>
                                                <Link
                                                    href="/usage/create"
                                                    className="inline-flex items-center gap-1 rounded-lg bg-brand-tertiary px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-[#733122]"
                                                >
                                                    <span>Pakai Batch Ini</span>
                                                    <ArrowRight className="h-3.5 w-3.5" />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Info Note */}
                                <div className="flex items-start gap-3 rounded-xl border border-surface-border bg-surface-container-high/60 p-3.5">
                                    <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-brand-primary/10 text-brand-primary">
                                        <Info className="h-4 w-4" />
                                    </div>
                                    <div className="text-xs leading-relaxed text-content-medium">
                                        <strong className="text-content-high">Instruksi Barista:</strong> Selalu verifikasi kode batch pada kemasan karton susu sebelum menyeduh pesanan Caffe Latte / Cappuccino.
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between border-t border-surface-border pt-3 text-xs text-content-subtle">
                            <span>Sistem Peringatan Otomatis FEFO</span>
                            <span className="flex items-center gap-1 font-medium text-content-medium">
                                <RefreshCw className="h-3 w-3 text-brand-secondary" /> Cloud Sync Aktif
                            </span>
                        </div>
                    </div>

                    {/* KARTU KANAN: Ringkasan Kesehatan Inventaris Meja Bar */}
                    <div className="flex flex-col justify-between space-y-4 rounded-2xl border border-surface-border bg-surface-container p-6 shadow-2xs">
                        <div>
                            <div className="flex items-center justify-between border-b border-surface-border pb-3">
                                <div className="flex items-center gap-2">
                                    <Coffee className="h-5 w-5 text-brand-primary" />
                                    <h2 className="text-base font-bold text-content-high">
                                        Kesehatan Inventaris Meja Bar (5 Bahan Utama)
                                    </h2>
                                </div>
                                <span className="text-xs font-semibold text-content-medium">
                                    Ambang Batas Par-Level
                                </span>
                            </div>

                            <div className="mt-2 divide-y divide-surface-border">
                                {healthItems.map((item) => (
                                    <div key={item.id} className="space-y-1.5 py-3 first:pt-1 last:pb-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <div>
                                                <h3 className="text-sm font-bold text-content-high">
                                                    {item.name}
                                                </h3>
                                                <p className="text-xs text-content-medium">
                                                    {item.location} • <span className="font-mono font-semibold">{item.stock}</span> • Batch: <span className="font-mono font-bold text-brand-primary">{item.priorityBatch}</span>
                                                </p>
                                            </div>
                                            <span
                                                className={`inline-flex whitespace-nowrap rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${
                                                    item.status === 'critical'
                                                        ? 'animate-pulse border-[#F8C6BF] bg-[#FDF2F0] text-brand-tertiary'
                                                        : item.status === 'warning'
                                                        ? 'border-[#FED7AA] bg-[#FFF7ED] text-brand-secondary'
                                                        : 'border-emerald-300 bg-emerald-50 text-emerald-800'
                                                }`}
                                            >
                                                {item.statusText}
                                            </span>
                                        </div>
                                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-container-high">
                                            <div
                                                className={`h-full rounded-full ${
                                                    item.status === 'critical'
                                                        ? 'bg-brand-tertiary'
                                                        : item.status === 'warning'
                                                        ? 'bg-brand-secondary'
                                                        : 'bg-emerald-600'
                                                }`}
                                                style={{ width: `${item.percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center justify-between border-t border-surface-border pt-3 text-xs text-content-subtle">
                            <span>Lampu Indikator: Hijau (&gt;7h), Kuning (3-7h), Merah (&lt;3h)</span>
                            <span className="font-semibold text-content-medium">Sensor Bar Online</span>
                        </div>
                    </div>
                </section>

                {/* 5. RECENT SHIFT ACTIVITY TIMELINE TABLE */}
                <section aria-label="Aktivitas Terkini Shift" className="rounded-2xl border border-surface-border bg-surface-container p-6 shadow-2xs">
                    <div className="flex flex-col justify-between gap-2 border-b border-surface-border pb-4 sm:flex-row sm:items-center">
                        <div className="flex items-center gap-2">
                            <History className="h-5 w-5 text-brand-primary" />
                            <h2 className="text-base font-bold text-content-high">
                                Riwayat Pemakaian & Transaksi Terkini Shift
                            </h2>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-content-medium">
                            <span className="h-2 w-2 rounded-full bg-emerald-600" />
                            <span>Audit Logging Otomatis</span>
                        </div>
                    </div>

                    <div className="mt-2 overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead>
                                <tr className="border-b border-surface-border text-[11px] font-semibold uppercase tracking-wider text-content-subtle">
                                    <th className="px-3 py-3">Waktu</th>
                                    <th className="px-3 py-3">Bahan / SKU</th>
                                    <th className="px-3 py-3">Jumlah &amp; Tujuan</th>
                                    <th className="px-3 py-3">Batch Code</th>
                                    <th className="px-3 py-3">Barista</th>
                                    <th className="px-3 py-3 text-right">Kepatuhan FEFO</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-surface-border/70 font-medium text-content-high">
                                {activities.map((act) => (
                                    <tr key={act.id} className="transition-colors hover:bg-surface-canvas/60">
                                        <td className="px-3 py-3 font-mono text-content-medium">{act.time}</td>
                                        <td className="px-3 py-3 font-semibold">{act.ingredient}</td>
                                        <td className="px-3 py-3">
                                            {act.amount}{' '}
                                            <span className="text-content-subtle">({act.target})</span>
                                        </td>
                                        <td className="px-3 py-3 font-mono font-bold text-brand-primary">
                                            {act.batchCode}
                                        </td>
                                        <td className="px-3 py-3 text-content-medium">{act.barista}</td>
                                        <td className="px-3 py-3 text-right">
                                            {act.isCompliant ? (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800">
                                                    <Check className="h-3 w-3" /> Patuh FEFO
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 rounded-full border border-[#FED7AA] bg-[#FFF7ED] px-2.5 py-0.5 text-[11px] font-bold text-brand-secondary">
                                                    <AlertCircle className="h-3 w-3" /> Deviasi Teralasan
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-surface-border pt-3 text-xs text-content-medium">
                        <span>Pencatatan transaksi terintegrasi dengan tabel stock_usages &amp; waste_logs</span>
                        <div className="flex items-center gap-3">
                            <span className="text-content-subtle">
                                Supervisor on Duty: <strong className="text-content-high">Ibu Sari</strong>
                            </span>
                            <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
                                <CheckCircle2 className="h-3.5 w-3.5" /> Standar HACCP Terpenuhi
                            </span>
                        </div>
                    </div>
                </section>
            </div>
        </AuthenticatedLayout>
    );
}
