import ExpiryBadge from '@/Components/ExpiryBadge';
import AppLayout from '@/Layouts/AppLayout';
import { cn } from '@/lib/utils';
import { Ingredient, Role, UrgencyStatus } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    AlertTriangle,
    Boxes,
    ChevronDown,
    ChevronUp,
    Clock,
    Flame,
    PackagePlus,
    Pencil,
    Plus,
    Search,
    ShieldAlert,
    Thermometer,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';

interface InventoryIndexProps {
    ingredients?: Ingredient[];
    summaryStats?: {
        totalItems?: number;
        safeCount?: number;
        warningCount?: number;
        criticalCount?: number;
        estimatedLossRupiah?: number;
    };
}

// Data demo komprehensif kafe BeanFlow jika backend belum mengirimkan props
const DEFAULT_INGREDIENTS: Ingredient[] = [
    {
        id: 1,
        category_id: 1,
        name: 'Fresh Milk Diamond 1L',
        unit: 'ml',
        minimum_stock: 2000,
        warning_days: 7,
        total_current_stock: 4500,
        category: { id: 1, name: 'Dairy', slug: 'dairy' },
        batches: [
            {
                id: 101,
                ingredient_id: 1,
                batch_code: 'BCH-20241026-A3F2',
                initial_stock: 5000,
                current_stock: 2500,
                received_date: '2024-10-20',
                expiry_date: '2024-10-26',
                cost_per_unit: 24, // Rp 24/ml (Rp 24.000 / liter)
                status: 'active',
                days_until_expiry: 1,
                urgency_status: 'critical',
                is_fefo_recommended: true,
            },
            {
                id: 102,
                ingredient_id: 1,
                batch_code: 'BCH-20241015-B1C9',
                initial_stock: 4000,
                current_stock: 2000,
                received_date: '2024-10-22',
                expiry_date: '2024-11-02',
                cost_per_unit: 24,
                status: 'active',
                days_until_expiry: 7,
                urgency_status: 'warning',
                is_fefo_recommended: false,
            },
        ],
    },
    {
        id: 2,
        category_id: 1,
        name: 'Oatside Oat Milk Barista 1L',
        unit: 'ml',
        minimum_stock: 3000,
        warning_days: 7,
        total_current_stock: 6000,
        category: { id: 1, name: 'Dairy', slug: 'dairy' },
        batches: [
            {
                id: 201,
                ingredient_id: 2,
                batch_code: 'BCH-20241102-OAT1',
                initial_stock: 6000,
                current_stock: 6000,
                received_date: '2024-10-24',
                expiry_date: '2024-11-02',
                cost_per_unit: 38, // Rp 38.000/liter
                status: 'active',
                days_until_expiry: 7,
                urgency_status: 'warning',
                is_fefo_recommended: true,
            },
        ],
    },
    {
        id: 3,
        category_id: 2,
        name: 'House Blend Espresso (Flores & Gayo)',
        unit: 'gram',
        minimum_stock: 5000,
        warning_days: 14,
        total_current_stock: 12500,
        category: { id: 2, name: 'Coffee Beans', slug: 'beans' },
        batches: [
            {
                id: 301,
                ingredient_id: 3,
                batch_code: 'BCH-20241128-ROAST1',
                initial_stock: 15000,
                current_stock: 12500,
                received_date: '2024-10-18',
                expiry_date: '2024-11-28',
                cost_per_unit: 250, // Rp 250.000/kg
                status: 'active',
                days_until_expiry: 33,
                urgency_status: 'safe',
                is_fefo_recommended: true,
            },
        ],
    },
    {
        id: 4,
        category_id: 3,
        name: 'Monin Salted Caramel Syrup 700ml',
        unit: 'ml',
        minimum_stock: 1400,
        warning_days: 30,
        total_current_stock: 2100,
        category: { id: 3, name: 'Syrup & Flavor', slug: 'syrup' },
        batches: [
            {
                id: 401,
                ingredient_id: 4,
                batch_code: 'BCH-20241215-SYR1',
                initial_stock: 2100,
                current_stock: 2100,
                received_date: '2024-10-10',
                expiry_date: '2024-12-15',
                cost_per_unit: 195,
                status: 'active',
                days_until_expiry: 50,
                urgency_status: 'safe',
                is_fefo_recommended: true,
            },
        ],
    },
];

export default function Index({
    ingredients = DEFAULT_INGREDIENTS,
    summaryStats,
}: InventoryIndexProps) {
    const authUser = (usePage().props.auth as { user?: { role?: Role } })?.user;
    const isSupervisor = authUser?.role === 'supervisor';
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState<'all' | 'safe' | 'warning' | 'critical'>('all');
    const [expandedIds, setExpandedIds] = useState<number[]>([1]); // default expanded row 1 (Fresh Milk)

    const toggleExpand = (id: number) => {
        setExpandedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
    };

    // Cari batch terdekat expired untuk setiap bahan
    const getNearestBatch = (ingredient: Ingredient) => {
        if (!ingredient.batches || ingredient.batches.length === 0) return null;
        // Urutkan FEFO: expiry terdekat lebih dulu
        const sorted = [...ingredient.batches].sort(
            (a, b) => new Date(a.expiry_date).getTime() - new Date(b.expiry_date).getTime(),
        );
        return sorted[0];
    };

    // Filter daftar bahan baku
    const filteredIngredients = useMemo(() => {
        return ingredients.filter((ing) => {
            // Filter pencarian
            const matchesQuery =
                ing.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                ing.category?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                ing.batches?.some((b) => b.batch_code.toLowerCase().includes(searchQuery.toLowerCase()));

            if (!matchesQuery) return false;

            // Filter tab urgensi
            if (activeFilter === 'all') return true;

            const nearest = getNearestBatch(ing);
            if (!nearest) return false;

            const days = nearest.days_until_expiry ?? 999;
            if (activeFilter === 'critical') return days < 3;
            if (activeFilter === 'warning') return days >= 3 && days <= 7;
            if (activeFilter === 'safe') return days > 7;

            return true;
        });
    }, [ingredients, searchQuery, activeFilter]);

    // Kalkulasi ringkasan angka lampu lalu lintas
    const counts = useMemo(() => {
        let safe = 0;
        let warning = 0;
        let critical = 0;
        let loss = 0;

        ingredients.forEach((ing) => {
            const nearest = getNearestBatch(ing);
            if (nearest) {
                const days = nearest.days_until_expiry ?? 999;
                if (days < 3) {
                    critical++;
                    loss += nearest.current_stock * nearest.cost_per_unit;
                } else if (days <= 7) {
                    warning++;
                } else {
                    safe++;
                }
            }
        });

        return {
            total: ingredients.length,
            safe: summaryStats?.safeCount ?? safe,
            warning: summaryStats?.warningCount ?? warning,
            critical: summaryStats?.criticalCount ?? critical,
            loss: summaryStats?.estimatedLossRupiah ?? loss,
        };
    }, [ingredients, summaryStats]);

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(val);
    };

    return (
        <AppLayout>
            <Head title="Monitoring Masa Simpan Bahan Baku" />

            <div className="space-y-6">
                {/* TOOLBAR KANVAS ATAS */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#F5EFEB] p-5 rounded-2xl border border-[#EDE4DC] shadow-xs">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-8 h-8 rounded-xl bg-[#EDE4DC] flex items-center justify-center text-[#4A2C11] font-bold">
                                <Clock className="w-4 h-4 text-[#4A2C11]" />
                            </div>
                            <h2 className="text-xl font-bold text-[#241408] tracking-tight">
                                Monitoring Inventaris &amp; Kedaluwarsa
                            </h2>
                            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#EDE4DC] text-[#4A2C11] font-bold">
                                Pengawasan FEFO
                            </span>
                        </div>
                        <p className="text-xs text-[#5C3A21]">
                            Pusat kendali masa simpan bahan baku kafe dan pencegahan kerugian bahan basi via panduan
                            FEFO otomatis.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <div className="relative">
                            <Search className="w-4 h-4 text-[#9C8474] absolute left-3 top-2.5 pointer-events-none" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Cari bahan atau kode batch..."
                                className="pl-9 pr-4 py-2 text-xs rounded-xl bg-white border border-[#EDE4DC] text-[#241408] font-medium w-56 sm:w-64 focus:outline-none focus:ring-2 focus:ring-[#4A2C11] shadow-2xs placeholder:text-[#9C8474]"
                            />
                        </div>

                        <Link
                            href="/batches/create"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#4A2C11] text-[#FAF7F2] text-xs font-bold shadow-xs hover:bg-[#38210D] transition active:scale-[0.98]"
                        >
                            <Plus className="w-4 h-4 text-[#C88242]" />
                            <span>Restock Batch Baru</span>
                        </Link>
                    </div>
                </div>

                {/* ROW 1: TAB FILTER LAMPU LALU LINTAS & ESTIMASI KERUGIAN */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
                        {/* Tab Semua */}
                        <button
                            type="button"
                            onClick={() => setActiveFilter('all')}
                            className={cn(
                                'px-3.5 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-1.5 shadow-2xs',
                                activeFilter === 'all'
                                    ? 'bg-[#4A2C11] text-[#FAF7F2]'
                                    : 'bg-[#F5EFEB] text-[#5C3A21] hover:bg-[#EDE4DC]',
                            )}
                        >
                            <span>Semua Bahan</span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-black/10 font-mono">
                                {counts.total}
                            </span>
                        </button>

                        {/* Tab Aman */}
                        <button
                            type="button"
                            onClick={() => setActiveFilter('safe')}
                            className={cn(
                                'px-3.5 py-1.5 rounded-full text-xs font-medium border transition flex items-center gap-1.5 shadow-2xs',
                                activeFilter === 'safe'
                                    ? 'bg-emerald-600 text-white border-emerald-700'
                                    : 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100',
                            )}
                        >
                            <span>🟢 Aman</span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-200/50 font-mono font-bold">
                                {counts.safe}
                            </span>
                        </button>

                        {/* Tab Warning */}
                        <button
                            type="button"
                            onClick={() => setActiveFilter('warning')}
                            className={cn(
                                'px-3.5 py-1.5 rounded-full text-xs font-medium border transition flex items-center gap-1.5 shadow-2xs',
                                activeFilter === 'warning'
                                    ? 'bg-[#C88242] text-white border-[#B37033]'
                                    : 'bg-[#FFF7ED] text-[#C88242] border-[#FED7AA] hover:bg-[#FEEFD9]',
                            )}
                        >
                            <span>🟡 Peringatan (3–7 Hari)</span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#FED7AA]/50 font-mono font-bold">
                                {counts.warning}
                            </span>
                        </button>

                        {/* Tab Kritis */}
                        <button
                            type="button"
                            onClick={() => setActiveFilter('critical')}
                            className={cn(
                                'px-3.5 py-1.5 rounded-full text-xs font-bold border transition flex items-center gap-1.5 shadow-2xs',
                                activeFilter === 'critical'
                                    ? 'bg-[#8C3D2B] text-white border-[#733122] animate-pulse'
                                    : 'bg-[#FDF2F0] text-[#8C3D2B] border-[#F8C6BF] hover:bg-[#FCE4E1]',
                            )}
                        >
                            <span>🔴 Kritis (&lt; 3 Hari)</span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#F8C6BF]/50 font-mono">
                                {counts.critical}
                            </span>
                        </button>
                    </div>

                    {/* Estimasi Nilai Bahan Kritis */}
                    {counts.loss > 0 && (
                        <div className="text-xs text-[#5C3A21] flex items-center gap-1.5 bg-[#FAF7F2] px-3.5 py-1.5 rounded-xl border border-[#EDE4DC] shadow-2xs">
                            <ShieldAlert className="w-4 h-4 text-[#8C3D2B]" />
                            <span>
                                Estimasi Nilai Bahan Kritis:{' '}
                                <strong className="text-[#8C3D2B] font-bold">{formatCurrency(counts.loss)}</strong>
                            </span>
                        </div>
                    )}
                </div>

                {/* ROW 2: TABEL INVENTARIS BERJENJANG (HIERARCHICAL) */}
                <div className="bg-[#F5EFEB] border border-[#EDE4DC] rounded-2xl overflow-hidden shadow-xs">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#EDE4DC] text-[#241408] text-xs font-bold uppercase tracking-wider border-b border-[#E2D7CE]">
                                    <th className="py-3.5 px-4">Bahan Baku</th>
                                    <th className="py-3.5 px-4">Kategori</th>
                                    <th className="py-3.5 px-4">Total Saldo Stok</th>
                                    <th className="py-3.5 px-4">Batch Terdekat Expired</th>
                                    <th className="py-3.5 px-4">Status Urgensi</th>
                                    <th className="py-3.5 px-4 text-right">Rincian Batch</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#EDE4DC] text-xs">
                                {filteredIngredients.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="py-12 text-center text-[#9C8474]">
                                            <Boxes className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                            <p className="font-semibold text-sm">Tidak ada bahan baku ditemukan</p>
                                            <p className="text-xs text-[#9C8474] mt-0.5">
                                                Coba sesuaikan kata kunci pencarian atau tab filter Anda.
                                            </p>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredIngredients.map((ingredient) => {
                                        const nearest = getNearestBatch(ingredient);
                                        const isExpanded = expandedIds.includes(ingredient.id);
                                        const isCritical = (nearest?.days_until_expiry ?? 999) < 3;

                                        return (
                                            <React.Fragment key={ingredient.id}>
                                                {/* BARIS UTAMA BAHAN */}
                                                <tr
                                                    className={cn(
                                                        'transition-colors',
                                                        isCritical ? 'bg-[#FDF7F6]' : 'hover:bg-[#EFE7DE]',
                                                    )}
                                                >
                                                    <td className="py-3.5 px-4 font-bold text-[#241408]">
                                                        <div className="flex items-center gap-2">
                                                            {isCritical && (
                                                                <span className="w-2 h-2 rounded-full bg-[#8C3D2B] animate-ping" />
                                                            )}
                                                            <span>{ingredient.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-3.5 px-4">
                                                        <span className="px-2 py-0.5 rounded-full bg-[#EDE4DC] text-[#5C3A21] font-medium text-[11px]">
                                                            {ingredient.category?.name || 'Umum'}
                                                        </span>
                                                    </td>
                                                    <td className="py-3.5 px-4 font-bold text-[#241408]">
                                                        {ingredient.total_current_stock?.toLocaleString('id-ID')}{' '}
                                                        {ingredient.unit}{' '}
                                                        <span className="font-normal text-[#9C8474]">
                                                            ({ingredient.batches?.length || 0} batch)
                                                        </span>
                                                    </td>
                                                    <td
                                                        className={cn(
                                                            'py-3.5 px-4 font-bold',
                                                            isCritical ? 'text-[#8C3D2B]' : 'text-[#5C3A21]',
                                                        )}
                                                    >
                                                        {nearest
                                                            ? `${nearest.expiry_date.slice(0, 10)}(${nearest.days_until_expiry} hari)`
                                                            : '-'}
                                                    </td>
                                                    <td className="py-3.5 px-4">
                                                        {nearest && (
                                                            <ExpiryBadge
                                                                daysLeft={nearest.days_until_expiry}
                                                                status={nearest.urgency_status}
                                                                size="sm"
                                                            />
                                                        )}
                                                    </td>
                                                    <td className="py-3.5 px-4 text-right">
                                                        <button
                                                            type="button"
                                                            onClick={() => toggleExpand(ingredient.id)}
                                                            className="inline-flex items-center gap-1 font-bold text-[#4A2C11] hover:text-[#C88242] transition"
                                                        >
                                                            <span>{isExpanded ? 'Tutup' : 'Lihat Batch'}</span>
                                                            {isExpanded ? (
                                                                <ChevronUp className="w-4 h-4" />
                                                            ) : (
                                                                <ChevronDown className="w-4 h-4" />
                                                            )}
                                                        </button>
                                                    </td>
                                                </tr>

                                                {/* SUB-BARIS RINCIAN BATCH FISIK DENGAN REKOMENDASI FEFO */}
                                                {isExpanded && (
                                                    <tr className="bg-[#FAF7F2] border-y border-[#EDE4DC]">
                                                        <td colSpan={6} className="p-4 sm:px-6">
                                                            <div className="rounded-xl border border-[#EDE4DC] bg-white p-4 shadow-2xs space-y-3">
                                                                <div className="flex items-center justify-between">
                                                                    <p className="text-[11px] font-bold text-[#9C8474] uppercase tracking-wider">
                                                                        Daftar Batch Fisik Aktif — Prioritas Rotasi
                                                                        FEFO:
                                                                    </p>
                                                                    <span className="text-[10px] text-[#5C3A21] bg-[#EDE4DC] px-2 py-0.5 rounded font-mono">
                                                                        Chiller Rak Depan
                                                                    </span>
                                                                </div>

                                                                <div className="space-y-2">
                                                                    {ingredient.batches &&
                                                                    ingredient.batches.length > 0 ? (
                                                                        ingredient.batches
                                                                            .sort(
                                                                                (a, b) =>
                                                                                    new Date(a.expiry_date).getTime() -
                                                                                    new Date(b.expiry_date).getTime(),
                                                                            )
                                                                            .map((batch, idx) => (
                                                                                <div
                                                                                    key={batch.id}
                                                                                    className={cn(
                                                                                        'flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl border transition',
                                                                                        idx === 0
                                                                                            ? 'bg-[#FAF7F2] border-[#C88242]/40 shadow-2xs'
                                                                                            : 'bg-white border-[#EDE4DC]',
                                                                                    )}
                                                                                >
                                                                                    <div className="flex flex-wrap items-center gap-2.5">
                                                                                        <span className="font-mono text-xs font-bold text-[#4A2C11]">
                                                                                            #{batch.batch_code}
                                                                                        </span>
                                                                                        <span className="text-xs text-[#5C3A21]">
                                                                                            Saldo:{' '}
                                                                                            <strong className="text-[#241408]">
                                                                                                {batch.current_stock.toLocaleString(
                                                                                                    'id-ID',
                                                                                                )}{' '}
                                                                                                {ingredient.unit}
                                                                                            </strong>
                                                                                        </span>
                                                                                        <span className="text-[11px] text-[#9C8474]">
                                                                                            • Exp: {batch.expiry_date.slice(0, 10)}
                                                                                        </span>
                                                                                    </div>

                                                                                    <div className="flex flex-wrap items-center gap-2">
                                                                                        {idx === 0 && (
                                                                                            <ExpiryBadge
                                                                                                isFefoRecommended
                                                                                                size="sm"
                                                                                            />
                                                                                        )}
                                                                                        <ExpiryBadge
                                                                                            daysLeft={
                                                                                                batch.days_until_expiry
                                                                                            }
                                                                                            status={
                                                                                                batch.urgency_status
                                                                                            }
                                                                                            size="sm"
                                                                                        />

                                                                                        {/* Action Buttons */}
                                                                                        <Link
                                                                                            href={route('stock-usages.index', { batch_id: batch.id })}
                                                                                            className="px-2.5 py-1 rounded-lg bg-[#4A2C11] text-[#FAF7F2] text-xs font-semibold hover:bg-[#38210D] transition flex items-center gap-1 shadow-2xs"
                                                                                        >
                                                                                            <Flame className="w-3 h-3 text-[#C88242]" />
                                                                                            <span>Pakai di Bar</span>
                                                                                        </Link>

                                                                                        <Link
                                                                                            href={route('waste-logs.create', { batch_id: batch.id })}
                                                                                            className="px-2.5 py-1 rounded-lg bg-[#FDF2F0] text-[#8C3D2B] border border-[#F8C6BF] text-xs font-semibold hover:bg-[#FCE4E1] transition flex items-center gap-1"
                                                                                        >
                                                                                            <AlertTriangle className="w-3 h-3" />
                                                                                            <span>Lapor Basi</span>
                                                                                        </Link>

                                                                                        {isSupervisor && (
                                                                                            <Link
                                                                                                href={route('batches.edit', batch.id)}
                                                                                                className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold hover:bg-amber-100 transition flex items-center gap-1"
                                                                                            >
                                                                                                <Pencil className="w-3 h-3" />
                                                                                                <span>Edit Batch</span>
                                                                                            </Link>
                                                                                        )}
                                                                                    </div>
                                                                                </div>
                                                                            ))
                                                                    ) : (
                                                                        <p className="text-xs text-[#9C8474]">
                                                                            Belum ada data batch fisik untuk bahan ini.
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </React.Fragment>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* FOOTER TABEL */}
                    <div className="p-4 bg-[#EDE4DC] border-t border-[#E2D7CE] flex flex-col sm:flex-row items-center justify-between text-xs text-[#5C3A21] gap-2">
                        <span>
                            Menampilkan <strong>{filteredIngredients.length}</strong> dari{' '}
                            <strong>{ingredients.length}</strong> bahan baku terdaftar
                        </span>
                        <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1.5 font-medium">
                                <Thermometer className="w-3.5 h-3.5 text-[#C88242]" />
                                Chiller IoT: 3.2°C (Optimal)
                            </span>
                            <span className="text-[#9C8474]">•</span>
                            <span className="flex items-center gap-1.5 font-medium">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                Sistem Sinkron Terminal Bar
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
