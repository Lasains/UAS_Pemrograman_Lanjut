import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    AlertCircle,
    AlertOctagon,
    AlertTriangle,
    Check,
    CheckCircle2,
    ChevronDown,
    ChevronUp,
    Clock,
    DollarSign,
    FileText,
    History,
    Info,
    MapPin,
    Package,
    Send,
    Trash2,
} from 'lucide-react';
import { FormEventHandler, useState } from 'react';

interface MockBatch {
    id: number;
    batchCode: string;
    ingredientName: string;
    currentStock: number;
    unit: string;
    costPerUnit: number;
    expiryDate: string;
    daysUntil: number;
    urgency: 'safe' | 'warning' | 'critical';
}

interface WasteTicket {
    id: number;
    ticketCode: string;
    date: string;
    time: string;
    ingredientName: string;
    batchCode: string;
    quantity: number;
    unit: string;
    reason: string;
    financialLoss: number;
    status: 'pending' | 'approved' | 'rejected';
    supervisorNote?: string;
}

const AVAILABLE_BATCHES: MockBatch[] = [
    {
        id: 1,
        batchCode: 'BCH-20241026-A3F2',
        ingredientName: 'Fresh Milk Diamond 1L',
        currentStock: 2500,
        unit: 'ml',
        costPerUnit: 18500, // per 1000ml -> Rp 18.5/ml
        expiryDate: '2024-10-26',
        daysUntil: 1,
        urgency: 'critical',
    },
    {
        id: 2,
        batchCode: 'BCH-20241023-F2G4',
        ingredientName: 'Oatside Oat Milk Barista 1L',
        currentStock: 3000,
        unit: 'ml',
        costPerUnit: 38000,
        expiryDate: '2024-11-02',
        daysUntil: 7,
        urgency: 'warning',
    },
    {
        id: 3,
        batchCode: 'BCH-20241019-K3L8',
        ingredientName: 'Monin Caramel Syrup 700ml',
        currentStock: 1200,
        unit: 'ml',
        costPerUnit: 145000,
        expiryDate: '2024-12-15',
        daysUntil: 50,
        urgency: 'safe',
    },
];

const INITIAL_TICKETS: WasteTicket[] = [
    {
        id: 1,
        ticketCode: 'TKT-WO-20241025-01',
        date: '25 Okt',
        time: '08:15 WIB',
        ingredientName: 'Oatside Oat Milk Barista 1L',
        batchCode: 'BCH-20241023-F2G4',
        quantity: 300,
        unit: 'ml',
        reason: 'Kemasan Bocor di Chiller Bar',
        financialLoss: 11400,
        status: 'pending',
    },
    {
        id: 2,
        ticketCode: 'TKT-WO-20241020-04',
        date: '20 Okt',
        time: '14:20 WIB',
        ingredientName: 'Monin Caramel Syrup 700ml',
        batchCode: 'BCH-20241019-K3L8',
        quantity: 100,
        unit: 'ml',
        reason: 'Tumpah saat Jam Sibuk',
        financialLoss: 20700,
        status: 'approved',
        supervisorNote: 'Disetujui. Bukti fisik botol pecah terverifikasi oleh Ibu Sari.',
    },
    {
        id: 3,
        ticketCode: 'TKT-WO-20241018-02',
        date: '18 Okt',
        time: '16:45 WIB',
        ingredientName: 'Fresh Milk Diamond 1L',
        batchCode: 'BCH-20241015-B1C9',
        quantity: 500,
        unit: 'ml',
        reason: 'Bau Asam Organoleptik',
        financialLoss: 9250,
        status: 'rejected',
        supervisorNote: 'Stok masih layak konsumsi setelah uji organoleptik ulang oleh SPV. Suhu chiller telah disesuaikan.',
    },
];

export default function WasteCreate() {
    const [selectedBatchId, setSelectedBatchId] = useState<number>(1);
    const selectedBatch =
        AVAILABLE_BATCHES.find((b) => b.id === selectedBatchId) || AVAILABLE_BATCHES[0];

    const [tickets, setTickets] = useState<WasteTicket[]>(INITIAL_TICKETS);
    const [expandedTicketId, setExpandedTicketId] = useState<number | null>(3);
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        ingredient_batch_id: selectedBatch.id,
        waste_quantity: 500,
        reason: 'Bau Asam / Rasa Berubah (Uji Organoleptik)',
        notes: 'Susu sudah menggumpal dan berbau asam saat dibuka pagi ini di chiller depan bar stasiun espresso.',
    });

    const handleBatchChange = (batchId: number) => {
        setSelectedBatchId(batchId);
        setData('ingredient_batch_id', batchId);
    };

    // Calculate loss: quantity * (cost_per_unit / 1000 for ml/gr)
    const unitDivisor = selectedBatch.unit === 'pcs' ? 1 : 1000;
    const estimatedLoss = Math.round((data.waste_quantity / unitDivisor) * selectedBatch.costPerUnit);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        if (data.waste_quantity > selectedBatch.currentStock) {
            alert(`Jumlah rusak tidak boleh melebihi sisa stok (${selectedBatch.currentStock} ${selectedBatch.unit})!`);
            return;
        }

        const newTicket: WasteTicket = {
            id: Date.now(),
            ticketCode: `TKT-WO-${Date.now().toString().slice(-6)}`,
            date: 'Hari Ini',
            time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
            ingredientName: selectedBatch.ingredientName,
            batchCode: selectedBatch.batchCode,
            quantity: Number(data.waste_quantity),
            unit: selectedBatch.unit,
            reason: data.reason,
            financialLoss: estimatedLoss,
            status: 'pending',
        };

        setTickets([newTicket, ...tickets]);
        setToastMessage(`Tiket write-off untuk ${selectedBatch.ingredientName} berhasil diajukan ke supervisor!`);
        setTimeout(() => setToastMessage(null), 4000);
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

            <div className="max-w-[1400px] mx-auto space-y-6">
                {/* Page Header */}
                <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-surface-border">
                    <div className="flex items-start sm:items-center gap-3.5">
                        <div className="w-12 h-12 rounded-xl bg-[#FFF7ED] border border-[#FED7AA] flex items-center justify-center text-brand-secondary shadow-xs shrink-0">
                            <AlertTriangle className="w-6 h-6 stroke-[2.2]" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2.5">
                                <h1 className="text-2xl font-bold tracking-tight text-content-high">
                                    Lapor Bahan Rusak
                                </h1>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#FFF7ED] text-brand-secondary border border-[#FED7AA]">
                                    Tiket Write-Off Barista
                                </span>
                            </div>
                            <p className="text-sm text-content-medium mt-0.5">
                                Laporkan bahan yang tidak layak konsumsi ke supervisor untuk verifikasi fisik &amp; approval
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 text-xs font-medium">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container border border-surface-border text-content-medium">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span>Station Bar Utama (Station A)</span>
                        </div>
                    </div>
                </header>

                {toastMessage && (
                    <div className="flex items-center gap-2 rounded-xl border border-emerald-300 bg-emerald-50 p-4 text-xs font-semibold text-emerald-800 shadow-xs">
                        <CheckCircle2 className="h-4 w-4 text-emerald-700" />
                        <span>{toastMessage}</span>
                    </div>
                )}

                {/* Two-Column Layout (50% left / 50% right) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                    {/* LEFT COLUMN — Waste Report Form */}
                    <section className="rounded-2xl bg-surface-container border border-surface-border p-6 shadow-xs space-y-5">
                        <div className="flex items-center justify-between pb-3 border-b border-surface-border">
                            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-content-high">
                                <FileText className="w-4 h-4 text-brand-secondary" />
                                <span>Formulir Pelaporan Bahan Rusak</span>
                            </div>
                            <span className="text-xs text-content-subtle font-mono">FORM-WO-04</span>
                        </div>

                        <form onSubmit={submit} className="space-y-4">
                            {/* Pilih Batch Bahan */}
                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold uppercase tracking-wider text-content-medium">
                                    Pilih Batch Bahan <span className="text-brand-tertiary">*</span>
                                </label>
                                <select
                                    value={selectedBatchId}
                                    onChange={(e) => handleBatchChange(Number(e.target.value))}
                                    className="w-full h-11 px-3.5 rounded-xl bg-white border border-surface-border text-sm text-content-high font-medium focus:outline-none focus:ring-2 focus:ring-brand-secondary focus:border-brand-secondary shadow-xs cursor-pointer"
                                >
                                    {AVAILABLE_BATCHES.map((b) => (
                                        <option key={b.id} value={b.id}>
                                            {b.ingredientName} ({b.batchCode}) — Sisa: {b.currentStock} {b.unit}
                                        </option>
                                    ))}
                                </select>

                                {/* Mini Batch Info Card */}
                                <div className="rounded-xl bg-surface-container-high p-3.5 flex items-center justify-between gap-3 shadow-2xs">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-brand-secondary shrink-0 border border-surface-border">
                                            <Package className="w-4 h-4" />
                                        </div>
                                        <div className="truncate">
                                            <div className="font-bold text-sm text-content-high truncate">
                                                {selectedBatch.ingredientName}
                                            </div>
                                            <div className="text-xs text-content-medium font-mono">
                                                Sisa stok fisik: <strong className="text-content-high">{selectedBatch.currentStock.toLocaleString()} {selectedBatch.unit}</strong>
                                            </div>
                                        </div>
                                    </div>
                                    <span
                                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold shrink-0 whitespace-nowrap ${
                                            selectedBatch.urgency === 'critical'
                                                ? 'bg-[#FDF2F0] text-brand-tertiary border border-[#F8C6BF] animate-pulse'
                                                : 'bg-[#FFF7ED] text-brand-secondary border border-[#FED7AA]'
                                        }`}
                                    >
                                        🔴 Exp: {selectedBatch.expiryDate} ({selectedBatch.daysUntil} hari!)
                                    </span>
                                </div>
                            </div>

                            {/* Jumlah Bahan Rusak */}
                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-content-medium">
                                        Jumlah Bahan Rusak <span className="text-brand-tertiary">*</span>
                                    </label>
                                    <span className="text-xs text-content-subtle font-mono">
                                        Maks saldo: {selectedBatch.currentStock} {selectedBatch.unit}
                                    </span>
                                </div>
                                <div className="relative flex rounded-xl shadow-xs">
                                    <input
                                        type="number"
                                        value={data.waste_quantity}
                                        onChange={(e) => setData('waste_quantity', Number(e.target.value))}
                                        step={selectedBatch.unit === 'ml' ? 50 : 10}
                                        max={selectedBatch.currentStock}
                                        min={1}
                                        className="w-full h-11 px-3.5 rounded-l-xl bg-white border border-r-0 border-surface-border text-base font-bold font-mono text-content-high focus:outline-none focus:ring-2 focus:ring-brand-secondary focus:border-brand-secondary"
                                        required
                                    />
                                    <span className="inline-flex items-center px-4 rounded-r-xl border border-l-0 border-surface-border bg-surface-container-high text-xs font-bold text-content-medium uppercase tracking-wider font-mono">
                                        {selectedBatch.unit}
                                    </span>
                                </div>
                            </div>

                            {/* Alasan Kerusakan */}
                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold uppercase tracking-wider text-content-medium">
                                    Alasan Kerusakan <span className="text-brand-tertiary">*</span>
                                </label>
                                <select
                                    value={data.reason}
                                    onChange={(e) => setData('reason', e.target.value)}
                                    className="w-full h-11 px-3.5 rounded-xl bg-white border border-surface-border text-sm text-content-high font-medium focus:outline-none focus:ring-2 focus:ring-brand-secondary focus:border-brand-secondary shadow-xs cursor-pointer"
                                >
                                    <option value="Kadaluwarsa / Basi di Chiller">Kadaluwarsa / Basi di Chiller</option>
                                    <option value="Bocor / Kemasan Rusak saat Pengiriman">Bocor / Kemasan Rusak saat Pengiriman</option>
                                    <option value="Bau Asam / Rasa Berubah (Uji Organoleptik)">Bau Asam / Rasa Berubah (Uji Organoleptik)</option>
                                    <option value="Tumpah / Human Error saat Operasional Bar">Tumpah / Human Error saat Operasional Bar</option>
                                    <option value="Kontaminasi Asing / Kotoran">Kontaminasi Asing / Kotoran</option>
                                </select>
                            </div>

                            {/* Catatan Kondisi Fisik */}
                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold uppercase tracking-wider text-content-medium">
                                    Catatan Kondisi Fisik <span className="text-content-subtle font-normal lowercase">(opsional)</span>
                                </label>
                                <textarea
                                    rows={3}
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    placeholder="Deskripsikan kondisi fisik bahan secara faktual..."
                                    className="w-full p-3 rounded-xl bg-white border border-surface-border text-xs text-content-high leading-relaxed focus:outline-none focus:ring-2 focus:ring-brand-secondary focus:border-brand-secondary shadow-xs resize-none"
                                />
                            </div>

                            {/* Estimasi Kerugian Finansial Realtime */}
                            <div className="p-3.5 rounded-xl bg-surface-canvas border border-surface-border flex items-center justify-between text-xs">
                                <div className="flex items-center gap-2 text-content-medium">
                                    <DollarSign className="w-4 h-4 text-brand-secondary" />
                                    <span>Estimasi Beban Kerugian Bahan:</span>
                                </div>
                                <div className="font-mono font-bold text-brand-tertiary text-sm">
                                    Rp {estimatedLoss.toLocaleString('id-ID')}{' '}
                                    <span className="text-xs text-content-subtle font-sans font-normal">
                                        ({data.waste_quantity} {selectedBatch.unit})
                                    </span>
                                </div>
                            </div>

                            {/* Submit Button (Amber Caramel #C88242) */}
                            <div className="pt-2 space-y-2">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full h-12 rounded-xl bg-brand-secondary hover:bg-brand-secondary-hover active:scale-[0.99] text-white font-bold text-sm tracking-wide shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-70"
                                >
                                    <Send className="w-4 h-4" />
                                    <span>Kirim Laporan ke Supervisor</span>
                                </button>
                                <p className="text-center italic text-xs text-content-subtle">
                                    Laporan bersifat pending hingga supervisor memverifikasi fisik bahan di lokasi.
                                </p>
                            </div>
                        </form>
                    </section>

                    {/* RIGHT COLUMN — My Waste Ticket Status */}
                    <section className="rounded-2xl bg-surface-container border border-surface-border p-6 shadow-xs flex flex-col justify-between space-y-5">
                        <div className="space-y-4">
                            {/* Title Row */}
                            <div className="flex items-center justify-between pb-3 border-b border-surface-border">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-7 h-7 rounded-lg bg-surface-container-high flex items-center justify-center text-brand-primary">
                                        <History className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <h2 className="font-bold text-content-high text-base">Status Laporan Saya</h2>
                                        <p className="text-xs text-content-medium">
                                            Riwayat tiket write-off yang Anda ajukan pada shift berjalan.
                                        </p>
                                    </div>
                                </div>
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-surface-canvas border border-surface-border text-content-medium">
                                    <span className="w-1.5 h-1.5 rounded-full bg-brand-secondary" />
                                    {tickets.length} Tiket Aktif
                                </span>
                            </div>

                            {/* Table Container */}
                            <div className="overflow-hidden rounded-xl border border-surface-border bg-white shadow-2xs">
                                <table className="w-full text-left text-xs border-collapse">
                                    <thead>
                                        <tr className="bg-surface-container-high text-content-medium font-bold text-[11px] uppercase tracking-wider">
                                            <th className="py-3 px-3.5">Waktu</th>
                                            <th className="py-3 px-3.5">Bahan</th>
                                            <th className="py-3 px-3.5 text-right">Qty</th>
                                            <th className="py-3 px-3.5 text-center">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-surface-border">
                                        {tickets.map((t) => {
                                            const isExpanded = expandedTicketId === t.id;

                                            return (
                                                <tr
                                                    key={t.id}
                                                    onClick={() =>
                                                        setExpandedTicketId(isExpanded ? null : t.id)
                                                    }
                                                    className="hover:bg-surface-canvas/60 transition-colors cursor-pointer"
                                                >
                                                    <td className="py-3.5 px-3.5 font-medium text-content-high whitespace-nowrap">
                                                        {t.date}
                                                        <span className="block text-[10px] text-content-subtle font-mono">
                                                            {t.time}
                                                        </span>
                                                    </td>
                                                    <td className="py-3.5 px-3.5">
                                                        <span className="font-bold text-content-high block">
                                                            {t.ingredientName}
                                                        </span>
                                                        <span className="text-[10px] text-content-subtle font-mono">
                                                            {t.batchCode}
                                                        </span>
                                                    </td>
                                                    <td className="py-3.5 px-3.5 text-right font-mono font-bold text-content-high whitespace-nowrap">
                                                        {t.quantity} {t.unit}
                                                    </td>
                                                    <td className="py-3.5 px-3.5 text-center">
                                                        {t.status === 'pending' && (
                                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FFF7ED] text-brand-secondary border border-[#FED7AA]">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-brand-secondary" />
                                                                Pending
                                                            </span>
                                                        )}
                                                        {t.status === 'approved' && (
                                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-300">
                                                                <Check className="w-3 h-3 text-emerald-600" />
                                                                Disetujui
                                                            </span>
                                                        )}
                                                        {t.status === 'rejected' && (
                                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#EDE4DC] text-content-subtle border border-surface-border">
                                                                Ditolak
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            {/* Expanded Detail Box for Selected Ticket */}
                            {expandedTicketId && (
                                <div className="rounded-xl border border-surface-border bg-surface-canvas p-4 text-xs space-y-2">
                                    <div className="flex items-center justify-between text-content-subtle">
                                        <span className="font-mono font-bold text-brand-primary">
                                            {tickets.find((t) => t.id === expandedTicketId)?.ticketCode}
                                        </span>
                                        <span>Detail Tiket Write-Off</span>
                                    </div>
                                    <p className="text-content-medium">
                                        <strong>Alasan:</strong>{' '}
                                        {tickets.find((t) => t.id === expandedTicketId)?.reason}
                                    </p>
                                    {tickets.find((t) => t.id === expandedTicketId)?.supervisorNote && (
                                        <div className="rounded-lg bg-surface-container-high/80 p-2.5 border-l-3 border-brand-secondary text-content-high">
                                            <strong>Catatan Supervisor:</strong>{' '}
                                            <em>"{tickets.find((t) => t.id === expandedTicketId)?.supervisorNote}"</em>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Transparency Footer */}
                        <div className="rounded-xl bg-surface-container-high/60 border border-surface-border p-3.5 text-xs text-content-medium flex items-start gap-2.5">
                            <Info className="w-4 h-4 text-brand-secondary shrink-0 mt-0.5" />
                            <p className="leading-relaxed">
                                <strong className="text-content-high">Integritas Audit (No Hard Delete):</strong> Setiap tiket yang disetujui supervisor memotong stok batch ke 0 tanpa menghapus rekaman riwayat pembukuan kafe.
                            </p>
                        </div>
                    </section>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
