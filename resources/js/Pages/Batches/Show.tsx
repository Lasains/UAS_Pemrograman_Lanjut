import ExpiryBadge from '@/Components/ExpiryBadge';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { IngredientBatch, StockUsage, WasteLog } from '@/types/inventory';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

interface BatchesShowProps {
    batch: IngredientBatch;
    stockUsages: StockUsage[];
    wasteLogs: WasteLog[];
}

export default function BatchesShow({
    batch,
    stockUsages = [],
    wasteLogs = [],
}: BatchesShowProps) {
    return (
        <AuthenticatedLayout
            header={
                <span className="text-lg font-bold tracking-tight text-content-high">
                    Detail Batch {batch.batch_code}
                </span>
            }
        >
            <Head title={`Detail Batch ${batch.batch_code} - BeanFlow`} />

            <div className="max-w-5xl mx-auto space-y-6">
                <Link
                    href={route('inventory.index')}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-content-medium hover:text-content-high"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Kembali ke Monitoring Inventaris
                </Link>

                <div className="rounded-2xl bg-surface-container border border-surface-border p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-xl font-bold text-content-high">
                            {batch.ingredient?.name ?? '-'} ({batch.batch_code})
                        </h1>
                        <p className="text-sm text-content-medium mt-1">
                            Stok: <strong>{Number(batch.current_stock).toLocaleString('id-ID')}</strong> /{' '}
                            {Number(batch.initial_stock).toLocaleString('id-ID')} {batch.ingredient?.unit ?? ''} • Status:{' '}
                            <span className="uppercase font-semibold">{batch.status}</span>
                        </p>
                    </div>
                    <ExpiryBadge
                        status={batch.urgency_status ?? 'safe'}
                        daysLeft={batch.days_until_expiry ?? 0}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="rounded-2xl bg-surface-container border border-surface-border p-5 space-y-3">
                        <h2 className="text-sm font-bold text-content-high">Riwayat Pemakaian ({stockUsages.length})</h2>
                        {stockUsages.length === 0 ? (
                            <p className="text-xs text-content-medium">Belum ada riwayat pemakaian.</p>
                        ) : (
                            <div className="space-y-2 text-xs">
                                {stockUsages.map((u) => (
                                    <div key={u.id} className="rounded-lg border border-surface-border bg-surface-base p-2.5">
                                        <p className="font-semibold">
                                            -{Number(u.quantity_used).toLocaleString('id-ID')} {batch.ingredient?.unit ?? ''} ({u.is_fefo_compliant ? 'FEFO' : 'Deviasi'})
                                        </p>
                                        <p className="text-content-medium">Oleh {u.user?.name ?? '-'}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="rounded-2xl bg-surface-container border border-surface-border p-5 space-y-3">
                        <h2 className="text-sm font-bold text-content-high">Riwayat Waste ({wasteLogs.length})</h2>
                        {wasteLogs.length === 0 ? (
                            <p className="text-xs text-content-medium">Belum ada laporan waste.</p>
                        ) : (
                            <div className="space-y-2 text-xs">
                                {wasteLogs.map((w) => (
                                    <div key={w.id} className="rounded-lg border border-surface-border bg-surface-base p-2.5">
                                        <p className="font-semibold">
                                            {Number(w.waste_quantity).toLocaleString('id-ID')} {batch.ingredient?.unit ?? ''} — {w.status.toUpperCase()}
                                        </p>
                                        <p className="text-content-medium">{w.reason}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
