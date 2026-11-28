import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { WasteLog } from '@/types/inventory';
import { Head } from '@inertiajs/react';
import { Download, TrendingDown } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface AnalyticsIndexProps {
    totalWasteLoss: number;
    pendingCount: number;
    totalUsages: number;
    compliantCount: number;
    deviationCount: number;
    wasteByIngredient: Array<{ name: string; total_loss: number; incidents: number }>;
    recentWastes: WasteLog[];
}

export default function AnalyticsIndex({
    totalWasteLoss = 0,
    pendingCount = 0,
    totalUsages = 0,
    compliantCount = 0,
    deviationCount = 0,
    wasteByIngredient = [],
    recentWastes = [],
}: AnalyticsIndexProps) {
    return (
        <AuthenticatedLayout
            header={
                <span className="text-lg font-bold tracking-tight text-content-high">
                    Laporan Finansial &amp; Waste
                </span>
            }
        >
            <Head title="Analitik Finansial & Waste - BeanFlow" />

            <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-surface-border">
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-700">
                            <TrendingDown className="w-5 h-5" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-content-high">Analitik Kerugian Waste &amp; Kepatuhan FEFO</h1>
                            <p className="text-sm text-content-medium">
                                Evaluasi kerugian finansial dari bahan rusak yang disetujui serta tingkat disiplin FEFO.
                            </p>
                        </div>
                    </div>
                    <a
                        href={route('analytics.export')}
                        className="inline-flex items-center gap-2 rounded-xl bg-brand-primary px-4 py-2.5 text-xs font-semibold text-white hover:bg-brand-primary/90"
                    >
                        <Download className="w-4 h-4" />
                        Export Laporan CSV
                    </a>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="rounded-2xl bg-rose-50 border border-rose-200 p-4">
                        <p className="text-xs text-rose-800">Total Kerugian Approved</p>
                        <p className="text-xl font-bold text-rose-900 mt-1">
                            Rp {Math.round(totalWasteLoss).toLocaleString('id-ID')}
                        </p>
                    </div>
                    <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4">
                        <p className="text-xs text-amber-800">Laporan Pending</p>
                        <p className="text-2xl font-bold text-amber-900 mt-1">{pendingCount}</p>
                    </div>
                    <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4">
                        <p className="text-xs text-emerald-800">Pemakaian Patuh FEFO</p>
                        <p className="text-2xl font-bold text-emerald-900 mt-1">
                            {compliantCount} / {totalUsages}
                        </p>
                    </div>
                    <div className="rounded-2xl bg-surface-container border border-surface-border p-4">
                        <p className="text-xs text-content-medium">Total Deviasi FEFO</p>
                        <p className="text-2xl font-bold text-content-high mt-1">{deviationCount}</p>
                    </div>
                </div>

                <div className="rounded-2xl bg-surface-container border border-surface-border p-6 space-y-4">
                    <h2 className="text-sm font-bold text-content-high">Kerugian Waste per Bahan (Rp)</h2>
                    {wasteByIngredient.length === 0 ? (
                        <p className="text-xs text-content-medium">Belum ada data kerugian waste yang disetujui.</p>
                    ) : (
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={wasteByIngredient}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                                    <YAxis tick={{ fontSize: 12 }} />
                                    <Tooltip />
                                    <Bar dataKey="total_loss" fill="#E11D48" radius={[6, 6, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>

                <div className="rounded-2xl bg-surface-container border border-surface-border overflow-hidden">
                    <div className="px-5 py-3.5 border-b border-surface-border text-sm font-bold text-content-high">
                        Riwayat Waste Disetujui Terbaru
                    </div>
                    {recentWastes.length === 0 ? (
                        <div className="p-6 text-xs text-content-medium">Belum ada riwayat waste disetujui.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-surface-container-high text-content-medium uppercase">
                                    <tr>
                                        <th className="px-4 py-3">Bahan &amp; Batch</th>
                                        <th className="px-4 py-3">Jumlah</th>
                                        <th className="px-4 py-3">Kerugian (Rp)</th>
                                        <th className="px-4 py-3">Alasan</th>
                                        <th className="px-4 py-3">Disetujui Oleh</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-surface-border">
                                    {recentWastes.map((w) => (
                                        <tr key={w.id}>
                                            <td className="px-4 py-3 font-semibold text-content-high">
                                                {w.batch?.ingredient?.name ?? '-'} ({w.batch?.batch_code})
                                            </td>
                                            <td className="px-4 py-3">
                                                {Number(w.waste_quantity).toLocaleString('id-ID')} {w.batch?.ingredient?.unit ?? ''}
                                            </td>
                                            <td className="px-4 py-3 font-bold text-rose-700">
                                                Rp {Math.round(Number(w.financial_loss)).toLocaleString('id-ID')}
                                            </td>
                                            <td className="px-4 py-3">{w.reason}</td>
                                            <td className="px-4 py-3">{w.approver?.name ?? '-'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
