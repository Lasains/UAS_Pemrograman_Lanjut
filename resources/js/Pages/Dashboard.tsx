import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import BaristaDashboard from '@/Pages/Barista/Dashboard';
import { DashboardMetrics, Role } from '@/types/inventory';
import { Head, Link, usePage } from '@inertiajs/react';
import { BarChart3, Boxes, ShieldAlert, TrendingDown, Wallet } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface OwnerDashboardProps {
    metrics?: DashboardMetrics;
    fefoComplianceRate?: number;
    assetByCategory?: Array<{ category: string; value: number; batches: number }>;
    expiryBreakdown?: Array<{ status: string; count: number }>;
}

export default function Dashboard({
    metrics,
    fefoComplianceRate = 100,
    assetByCategory = [],
    expiryBreakdown = [],
}: OwnerDashboardProps) {
    const user = (usePage().props.auth as { user: { role: Role } }).user;

    if (user.role !== 'owner') {
        return <BaristaDashboard />;
    }

    const dataMetrics: DashboardMetrics = metrics ?? {
        total_asset_value: 0,
        critical_asset_value: 0,
        monthly_waste_loss: 0,
        active_batches_count: 0,
    };

    return (
        <AuthenticatedLayout
            header={
                <span className="text-lg font-bold tracking-tight text-content-high">
                    Dasbor Eksekutif Owner
                </span>
            }
        >
            <Head title="Dasbor Eksekutif Owner - BeanFlow" />

            <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-surface-border">
                    <div>
                        <h1 className="text-2xl font-bold text-content-high">Ringkasan Aset &amp; Risiko Kedaluwarsa</h1>
                        <p className="text-sm text-content-medium">
                            Pantau valuasi inventaris aktif, nilai stok berisiko kritis, serta tingkat kepatuhan FEFO.
                        </p>
                    </div>
                    <Link
                        href={route('analytics.index')}
                        className="inline-flex items-center gap-2 rounded-xl bg-brand-primary px-4 py-2.5 text-xs font-semibold text-white hover:bg-brand-primary/90"
                    >
                        <BarChart3 className="w-4 h-4" />
                        Buka Laporan Analitik &amp; Export
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="rounded-2xl bg-surface-container border border-surface-border p-5">
                        <div className="flex items-center justify-between text-xs text-content-medium">
                            <span>Total Valuasi Stok Aktif</span>
                            <Wallet className="w-4 h-4 text-brand-primary" />
                        </div>
                        <p className="text-2xl font-bold text-content-high mt-2">
                            Rp {Math.round(dataMetrics.total_asset_value).toLocaleString('id-ID')}
                        </p>
                    </div>

                    <div className="rounded-2xl bg-rose-50 border border-rose-200 p-5">
                        <div className="flex items-center justify-between text-xs text-rose-700">
                            <span>Aset Berisiko Kritis (&lt;3 Hari)</span>
                            <ShieldAlert className="w-4 h-4 text-rose-600" />
                        </div>
                        <p className="text-2xl font-bold text-rose-800 mt-2">
                            Rp {Math.round(dataMetrics.critical_asset_value).toLocaleString('id-ID')}
                        </p>
                    </div>

                    <div className="rounded-2xl bg-amber-50 border border-amber-200 p-5">
                        <div className="flex items-center justify-between text-xs text-amber-800">
                            <span>Kerugian Waste Bulan Ini</span>
                            <TrendingDown className="w-4 h-4 text-amber-700" />
                        </div>
                        <p className="text-2xl font-bold text-amber-900 mt-2">
                            Rp {Math.round(dataMetrics.monthly_waste_loss).toLocaleString('id-ID')}
                        </p>
                    </div>

                    <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-5">
                        <div className="flex items-center justify-between text-xs text-emerald-800">
                            <span>Kepatuhan FEFO ({dataMetrics.active_batches_count} Batch)</span>
                            <Boxes className="w-4 h-4 text-emerald-700" />
                        </div>
                        <p className="text-2xl font-bold text-emerald-900 mt-2">{fefoComplianceRate}%</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="rounded-2xl bg-surface-container border border-surface-border p-6 space-y-4">
                        <h2 className="text-sm font-bold text-content-high">Valuasi Aset per Kategori (Rp)</h2>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={assetByCategory}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="category" tick={{ fontSize: 12 }} />
                                    <YAxis tick={{ fontSize: 12 }} />
                                    <Tooltip />
                                    <Bar dataKey="value" fill="#6F4E37" radius={[6, 6, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="rounded-2xl bg-surface-container border border-surface-border p-6 space-y-4">
                        <h2 className="text-sm font-bold text-content-high">Distribusi Status Kedaluwarsa Batch</h2>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={expiryBreakdown}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="status" tick={{ fontSize: 12 }} />
                                    <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                                    <Tooltip />
                                    <Bar dataKey="count" fill="#D97706" radius={[6, 6, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
