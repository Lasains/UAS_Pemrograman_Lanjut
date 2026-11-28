import ExpiryBadge from '@/Components/ExpiryBadge';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { StockUsage, UrgencyStatus } from '@/types/inventory';
import { Head, Link } from '@inertiajs/react';
import { AlertTriangle, Coffee, Flame, History, PackagePlus } from 'lucide-react';

interface BarHealthItem {
    id: number;
    name: string;
    category: string;
    unit: string;
    total_stock: number;
    batch_count: number;
    priorityBatch: string;
    expiry_date: string;
    days_until: number;
    status: UrgencyStatus;
}

interface BaristaDashboardProps {
    healthItems?: BarHealthItem[];
    todayUsages?: StockUsage[];
    stats?: {
        active_batches_count: number;
        critical_count: number;
        warning_count: number;
        today_usages_count: number;
    };
}

export default function BaristaDashboard({
    healthItems = [],
    todayUsages = [],
    stats = { active_batches_count: 0, critical_count: 0, warning_count: 0, today_usages_count: 0 },
}: BaristaDashboardProps) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-2">
                    <span className="text-lg font-bold tracking-tight text-content-high">
                        Dasbor Operasional Barista
                    </span>
                </div>
            }
        >
            <Head title="Dasbor Barista - BeanFlow" />

            <div className="max-w-7xl mx-auto space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="rounded-2xl bg-surface-container border border-surface-border p-4">
                        <p className="text-xs text-content-medium">Batch Aktif</p>
                        <p className="text-2xl font-bold text-content-high mt-1">{stats.active_batches_count}</p>
                    </div>
                    <div className="rounded-2xl bg-rose-50 border border-rose-200 p-4">
                        <p className="text-xs text-rose-700">Kritis (&lt; 3 Hari)</p>
                        <p className="text-2xl font-bold text-rose-800 mt-1">{stats.critical_count}</p>
                    </div>
                    <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4">
                        <p className="text-xs text-amber-700">Warning (3–7 Hari)</p>
                        <p className="text-2xl font-bold text-amber-800 mt-1">{stats.warning_count}</p>
                    </div>
                    <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4">
                        <p className="text-xs text-emerald-700">Pemakaian Hari Ini</p>
                        <p className="text-2xl font-bold text-emerald-800 mt-1">{stats.today_usages_count}</p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-3">
                    <Link
                        href={route('stock-usages.index')}
                        className="inline-flex items-center gap-2 rounded-xl bg-brand-primary px-4 py-2.5 text-xs font-semibold text-white hover:bg-brand-primary/90"
                    >
                        <Flame className="w-4 h-4" />
                        Catat Pemakaian (FEFO)
                    </Link>
                    <Link
                        href={route('batches.create')}
                        className="inline-flex items-center gap-2 rounded-xl border border-surface-border bg-surface-container px-4 py-2.5 text-xs font-semibold text-content-high hover:bg-surface-container-high"
                    >
                        <PackagePlus className="w-4 h-4" />
                        Penerimaan Batch Baru
                    </Link>
                    <Link
                        href={route('waste-logs.create')}
                        className="inline-flex items-center gap-2 rounded-xl border border-amber-300 bg-amber-50 px-4 py-2.5 text-xs font-semibold text-amber-900 hover:bg-amber-100"
                    >
                        <AlertTriangle className="w-4 h-4" />
                        Lapor Bahan Rusak
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    <section className="lg:col-span-7 rounded-2xl bg-surface-container border border-surface-border p-6 space-y-4">
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-content-high">
                            <Coffee className="w-4 h-4 text-brand-primary" />
                            <span>Prioritas FEFO Bahan Bar</span>
                        </div>

                        {healthItems.length === 0 ? (
                            <p className="text-xs text-content-medium">Belum ada stok aktif.</p>
                        ) : (
                            <div className="space-y-3">
                                {healthItems.map((item) => (
                                    <div
                                        key={item.id}
                                        className="rounded-xl border border-surface-border bg-surface-base p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                                    >
                                        <div>
                                            <p className="text-sm font-bold text-content-high">{item.name}</p>
                                            <p className="text-xs text-content-medium mt-0.5">
                                                Stok: <strong>{item.total_stock.toLocaleString('id-ID')} {item.unit}</strong> ({item.batch_count} batch) • Prioritas FEFO:{' '}
                                                <span className="font-mono">{item.priorityBatch}</span>
                                            </p>
                                        </div>
                                        <ExpiryBadge status={item.status} daysLeft={item.days_until} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                    <section className="lg:col-span-5 rounded-2xl bg-surface-container border border-surface-border p-6 space-y-4">
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-content-high">
                            <History className="w-4 h-4 text-brand-primary" />
                            <span>Aktivitas Pemakaian Hari Ini</span>
                        </div>

                        {todayUsages.length === 0 ? (
                            <p className="text-xs text-content-medium">Belum ada pemakaian stok hari ini.</p>
                        ) : (
                            <div className="space-y-2.5">
                                {todayUsages.map((usage) => (
                                    <div key={usage.id} className="rounded-xl border border-surface-border bg-surface-base p-3 text-xs">
                                        <div className="flex justify-between font-semibold text-content-high">
                                            <span>{usage.batch?.ingredient?.name ?? '-'}</span>
                                            <span>{usage.is_fefo_compliant ? 'FEFO' : 'Deviasi'}</span>
                                        </div>
                                        <p className="text-content-medium mt-0.5">
                                            {Number(usage.quantity_used).toLocaleString('id-ID')} {usage.batch?.ingredient?.unit ?? ''} • {usage.batch?.batch_code} • {usage.user?.name ?? '-'}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
