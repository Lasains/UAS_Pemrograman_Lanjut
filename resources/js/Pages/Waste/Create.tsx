import ExpiryBadge from '@/Components/ExpiryBadge';
import InputError from '@/Components/InputError';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { cn } from '@/lib/utils';
import { IngredientBatch, WasteLog } from '@/types/inventory';
import { Head, useForm } from '@inertiajs/react';
import { AlertTriangle, FileText, History, Send } from 'lucide-react';
import { FormEventHandler } from 'react';

interface WasteCreateProps {
    batches: IngredientBatch[];
    recentReports: WasteLog[];
}

export default function WasteCreate({ batches = [], recentReports = [] }: WasteCreateProps) {
    const firstBatch = batches[0];

    const { data, setData, post, processing, errors, reset } = useForm({
        ingredient_batch_id: firstBatch ? String(firstBatch.id) : '',
        waste_quantity: '',
        reason: '',
    });

    const selectedBatch = batches.find((b) => String(b.id) === String(data.ingredient_batch_id)) ?? firstBatch;

    const estimatedLoss =
        Number(data.waste_quantity || 0) * Number(selectedBatch?.cost_per_unit || 0);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('waste-logs.store'), {
            onSuccess: () => reset('waste_quantity', 'reason'),
        });
    };

    const statusBadgeClass = (status: string) => {
        if (status === 'approved') return 'bg-emerald-100 text-emerald-800';
        if (status === 'rejected') return 'bg-rose-100 text-rose-800';
        return 'bg-amber-100 text-amber-800';
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-2">
                    <span className="text-lg font-bold tracking-tight text-content-high">
                        Lapor Bahan Rusak ke Supervisor
                    </span>
                    <span className="rounded bg-brand-secondary px-1.5 py-0.5 text-[10px] font-bold text-white">
                        WRITE-OFF
                    </span>
                </div>
            }
        >
            <Head title="Lapor Bahan Rusak - BeanFlow" />

            <div className="max-w-7xl mx-auto space-y-6">
                <header className="flex items-center gap-3.5 pb-3 border-b border-surface-border">
                    <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-brand-secondary">
                        <AlertTriangle className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-content-high">
                            Lapor Bahan Rusak (Write-Off)
                        </h1>
                        <p className="text-sm text-content-medium mt-0.5">
                            Laporan akan berstatus Pending hingga disetujui Supervisor. Stok dipotong saat disetujui.
                        </p>
                    </div>
                </header>

                {batches.length === 0 ? (
                    <div className="rounded-2xl border border-amber-300 bg-amber-50 p-6 text-sm text-amber-900">
                        Tidak ada batch aktif yang tersedia untuk dilaporkan.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                        <form
                            onSubmit={submit}
                            className="rounded-2xl bg-surface-container border border-surface-border p-6 shadow-xs space-y-5"
                        >
                            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-content-high pb-2 border-b border-surface-border">
                                <FileText className="w-4 h-4 text-brand-secondary" />
                                <span>Formulir Pelaporan Bahan Rusak</span>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-content-medium mb-1.5">
                                    Pilih Batch Aktif *
                                </label>
                                <select
                                    value={data.ingredient_batch_id}
                                    onChange={(e) => setData('ingredient_batch_id', e.target.value)}
                                    className="w-full rounded-xl border border-surface-border bg-surface-base px-3.5 py-2.5 text-sm text-content-high"
                                >
                                    {batches.map((b) => (
                                        <option key={b.id} value={b.id}>
                                            {b.ingredient?.name ?? '-'} ({b.batch_code}) — Sisa: {Number(b.current_stock).toLocaleString('id-ID')} {b.ingredient?.unit ?? ''}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.ingredient_batch_id} className="mt-1" />
                            </div>

                            {selectedBatch && (
                                <div className="flex items-center justify-between rounded-xl bg-surface-container-high px-4 py-3 text-xs">
                                    <div>
                                        <p className="font-semibold text-content-high">
                                            Sisa Stok: {Number(selectedBatch.current_stock).toLocaleString('id-ID')} {selectedBatch.ingredient?.unit}
                                        </p>
                                        <p className="text-content-medium">
                                            Harga/unit: Rp {Number(selectedBatch.cost_per_unit).toLocaleString('id-ID')}
                                        </p>
                                    </div>
                                    <ExpiryBadge
                                        status={selectedBatch.urgency_status ?? selectedBatch.expiry_status ?? 'safe'}
                                        daysLeft={selectedBatch.days_until_expiry ?? 0}
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-content-medium mb-1.5">
                                    Jumlah Rusak ({selectedBatch?.ingredient?.unit ?? 'unit'}) *
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0.01"
                                    value={data.waste_quantity}
                                    onChange={(e) => setData('waste_quantity', e.target.value)}
                                    placeholder="Contoh: 500"
                                    className="w-full rounded-xl border border-surface-border bg-surface-base px-3.5 py-2.5 text-sm text-content-high"
                                    required
                                />
                                <InputError message={errors.waste_quantity} className="mt-1" />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-content-medium mb-1.5">
                                    Alasan Kerusakan *
                                </label>
                                <textarea
                                    rows={3}
                                    value={data.reason}
                                    onChange={(e) => setData('reason', e.target.value)}
                                    placeholder="Contoh: Susu menggumpal / kemasan bocor / kedaluwarsa"
                                    className="w-full rounded-xl border border-surface-border bg-surface-base px-3.5 py-2.5 text-sm text-content-high"
                                    required
                                />
                                <InputError message={errors.reason} className="mt-1" />
                            </div>

                            <div className="rounded-xl bg-rose-50 border border-rose-200 px-4 py-3 text-xs flex items-center justify-between">
                                <span className="font-medium text-rose-900">Estimasi Kerugian Finansial</span>
                                <span className="font-bold text-rose-700">
                                    Rp {Math.round(estimatedLoss).toLocaleString('id-ID')}
                                </span>
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-brand-secondary px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-secondary/90 disabled:opacity-50"
                            >
                                <Send className="w-4 h-4" />
                                {processing ? 'Mengirim Laporan...' : 'Kirim Laporan ke Supervisor'}
                            </button>
                        </form>

                        <section className="rounded-2xl bg-surface-container border border-surface-border p-6 shadow-xs space-y-4">
                            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-content-high pb-2 border-b border-surface-border">
                                <History className="w-4 h-4 text-brand-primary" />
                                <span>Riwayat Laporan Terbaru</span>
                            </div>

                            {recentReports.length === 0 ? (
                                <p className="text-xs text-content-medium">Belum ada laporan bahan rusak.</p>
                            ) : (
                                <div className="space-y-3">
                                    {recentReports.map((log) => (
                                        <div
                                            key={log.id}
                                            className="rounded-xl border border-surface-border bg-surface-base p-3.5 text-xs space-y-1.5"
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="font-bold text-content-high">
                                                    {log.batch?.ingredient?.name ?? '-'} ({log.batch?.batch_code})
                                                </span>
                                                <span
                                                    className={cn(
                                                        'px-2 py-0.5 rounded-full text-[10px] font-bold uppercase',
                                                        statusBadgeClass(log.status),
                                                    )}
                                                >
                                                    {log.status}
                                                </span>
                                            </div>
                                            <p className="text-content-medium">
                                                Jumlah: {Number(log.waste_quantity).toLocaleString('id-ID')} {log.batch?.ingredient?.unit ?? ''} • Kerugian: Rp{' '}
                                                {Number(log.financial_loss).toLocaleString('id-ID')}
                                            </p>
                                            <p className="text-content-high">Alasan: {log.reason}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
