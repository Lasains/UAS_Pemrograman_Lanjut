import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { cn } from '@/lib/utils';
import { Role, WasteLog } from '@/types/inventory';
import { Head, router, usePage } from '@inertiajs/react';
import { CheckCircle2, CheckSquare, XCircle } from 'lucide-react';

interface WasteIndexProps {
    wasteLogs: {
        data: WasteLog[];
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    summary: {
        pending_count: number;
        approved_count: number;
        rejected_count: number;
        total_approved_loss: number;
    };
    filters: {
        status?: string;
    };
}

export default function WasteIndex({ wasteLogs, summary, filters }: WasteIndexProps) {
    const userRole = (usePage().props.auth as { user: { role: Role } }).user.role;
    const isSupervisor = userRole === 'supervisor';

    const handleFilter = (status: string) => {
        router.get(route('waste-logs.index'), status ? { status } : {}, { preserveState: true });
    };

    const handleApprove = (id: number) => {
        router.patch(route('waste-logs.approve', id));
    };

    const handleReject = (id: number) => {
        router.patch(route('waste-logs.reject', id));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-2">
                    <span className="text-lg font-bold tracking-tight text-content-high">
                        Approval Center (Waste)
                    </span>
                </div>
            }
        >
            <Head title="Approval Center Waste - BeanFlow" />

            <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-surface-border">
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                            <CheckSquare className="w-5 h-5" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-content-high">Approval Center Bahan Rusak</h1>
                            <p className="text-sm text-content-medium">
                                Verifikasi laporan kerusakan bahan. Persetujuan akan memotong stok batch menjadi 0 dan mencatat kerugian finansial.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4">
                        <p className="text-xs text-amber-800">Menunggu Approval</p>
                        <p className="text-2xl font-bold text-amber-900 mt-1">{summary.pending_count}</p>
                    </div>
                    <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4">
                        <p className="text-xs text-emerald-800">Disetujui</p>
                        <p className="text-2xl font-bold text-emerald-900 mt-1">{summary.approved_count}</p>
                    </div>
                    <div className="rounded-2xl bg-rose-50 border border-rose-200 p-4">
                        <p className="text-xs text-rose-800">Ditolak</p>
                        <p className="text-2xl font-bold text-rose-900 mt-1">{summary.rejected_count}</p>
                    </div>
                    <div className="rounded-2xl bg-surface-container border border-surface-border p-4">
                        <p className="text-xs text-content-medium">Total Kerugian Disetujui</p>
                        <p className="text-xl font-bold text-rose-700 mt-1">
                            Rp {Math.round(summary.total_approved_loss).toLocaleString('id-ID')}
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    {[
                        { label: 'Semua', value: '' },
                        { label: 'Pending', value: 'pending' },
                        { label: 'Approved', value: 'approved' },
                        { label: 'Rejected', value: 'rejected' },
                    ].map((tab) => (
                        <button
                            key={tab.value}
                            type="button"
                            onClick={() => handleFilter(tab.value)}
                            className={cn(
                                'px-3.5 py-1.5 rounded-lg text-xs font-semibold border',
                                (filters.status ?? '') === tab.value
                                    ? 'bg-brand-primary text-white border-brand-primary'
                                    : 'bg-surface-container text-content-medium border-surface-border hover:bg-surface-container-high',
                            )}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="rounded-2xl bg-surface-container border border-surface-border overflow-hidden">
                    {wasteLogs.data.length === 0 ? (
                        <div className="p-8 text-center text-sm text-content-medium">
                            Tidak ada laporan waste pada filter ini.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-surface-container-high text-content-medium uppercase">
                                    <tr>
                                        <th className="px-4 py-3">Bahan &amp; Batch</th>
                                        <th className="px-4 py-3">Jumlah</th>
                                        <th className="px-4 py-3">Kerugian</th>
                                        <th className="px-4 py-3">Alasan &amp; Pelapor</th>
                                        <th className="px-4 py-3">Status</th>
                                        {isSupervisor && <th className="px-4 py-3 text-right">Aksi</th>}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-surface-border">
                                    {wasteLogs.data.map((log) => (
                                        <tr key={log.id} className="hover:bg-surface-base/60">
                                            <td className="px-4 py-3">
                                                <p className="font-bold text-content-high">{log.batch?.ingredient?.name ?? '-'}</p>
                                                <p className="font-mono text-content-medium">{log.batch?.batch_code}</p>
                                            </td>
                                            <td className="px-4 py-3 font-semibold text-content-high">
                                                {Number(log.waste_quantity).toLocaleString('id-ID')} {log.batch?.ingredient?.unit ?? ''}
                                            </td>
                                            <td className="px-4 py-3 font-semibold text-rose-700">
                                                Rp {Math.round(Number(log.financial_loss)).toLocaleString('id-ID')}
                                            </td>
                                            <td className="px-4 py-3">
                                                <p className="text-content-high">{log.reason}</p>
                                                <p className="text-content-medium">Pelapor: {log.reporter?.name ?? '-'}</p>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span
                                                    className={cn(
                                                        'px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase',
                                                        log.status === 'approved'
                                                            ? 'bg-emerald-100 text-emerald-800'
                                                            : log.status === 'rejected'
                                                              ? 'bg-rose-100 text-rose-800'
                                                              : 'bg-amber-100 text-amber-800',
                                                    )}
                                                >
                                                    {log.status}
                                                </span>
                                            </td>
                                            {isSupervisor && (
                                                <td className="px-4 py-3 text-right">
                                                    {log.status === 'pending' ? (
                                                        <div className="inline-flex gap-2">
                                                            <button
                                                                type="button"
                                                                onClick={() => handleApprove(log.id)}
                                                                className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-emerald-700"
                                                            >
                                                                <CheckCircle2 className="w-3.5 h-3.5" />
                                                                Setujui
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleReject(log.id)}
                                                                className="inline-flex items-center gap-1 rounded-lg bg-rose-600 px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-rose-700"
                                                            >
                                                                <XCircle className="w-3.5 h-3.5" />
                                                                Tolak
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <span className="text-content-medium">
                                                            Oleh {log.approver?.name ?? '-'}
                                                        </span>
                                                    )}
                                                </td>
                                            )}
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
