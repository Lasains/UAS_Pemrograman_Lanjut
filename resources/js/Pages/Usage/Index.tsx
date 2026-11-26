import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Ingredient, IngredientBatch } from '@/types/inventory';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    AlertCircle,
    AlertTriangle,
    ArrowRight,
    Check,
    CheckCircle2,
    ChevronDown,
    Clock,
    Coffee,
    Flame,
    History,
    Info,
    Loader2,
    Package,
    RotateCcw,
    Sparkles,
} from 'lucide-react';
import { FormEventHandler, useState } from 'react';

interface MockBatch extends IngredientBatch {
    location?: string;
}

interface UsageRecord {
    id: number;
    time: string;
    ingredientName: string;
    amount: string;
    target: string;
    batchCode: string;
    barista: string;
    isCompliant: boolean;
    deviationReason?: string;
}

const DEMO_INGREDIENTS = [
    { id: 1, name: 'Fresh Milk Diamond 1L', category: 'Dairy', unit: 'ml', totalStock: 8700 },
    { id: 2, name: 'Oatside Oat Milk Barista 1L', category: 'Dairy (Plant-Based)', unit: 'ml', totalStock: 6000 },
    { id: 3, name: 'House Espresso Blend Beans', category: 'Coffee Beans', unit: 'gram', totalStock: 5400 },
    { id: 4, name: 'Monin Caramel Syrup 700ml', category: 'Syrup', unit: 'ml', totalStock: 3200 },
];

const DEMO_BATCHES: Record<number, MockBatch[]> = {
    1: [
        {
            id: 101,
            ingredient_id: 1,
            batch_code: 'BCH-20241026-A3F2',
            initial_stock: 5000,
            current_stock: 2500,
            received_date: '2024-10-12',
            expiry_date: '2024-10-26',
            cost_per_unit: 18500,
            status: 'active',
            location: 'Karton Depan Chiller Bar',
            days_until_expiry: 1,
            urgency_status: 'critical',
            is_fefo_recommended: true,
        },
        {
            id: 102,
            ingredient_id: 1,
            batch_code: 'BCH-20241015-B1C9',
            initial_stock: 5000,
            current_stock: 5000,
            received_date: '2024-10-15',
            expiry_date: '2024-11-02',
            cost_per_unit: 18500,
            status: 'active',
            location: 'Chiller Cadangan Belakang',
            days_until_expiry: 8,
            urgency_status: 'safe',
            is_fefo_recommended: false,
        },
        {
            id: 103,
            ingredient_id: 1,
            batch_code: 'BCH-20241008-D4E7',
            initial_stock: 3000,
            current_stock: 1200,
            received_date: '2024-10-18',
            expiry_date: '2024-11-10',
            cost_per_unit: 18500,
            status: 'active',
            location: 'Gudang Transit Bar',
            days_until_expiry: 16,
            urgency_status: 'safe',
            is_fefo_recommended: false,
        },
    ],
};

const INITIAL_HISTORY: UsageRecord[] = [
    {
        id: 1,
        time: '10:38 WIB',
        ingredientName: 'Fresh Milk Diamond 1L',
        amount: '250 ml',
        target: '2x Caffe Latte',
        batchCode: 'BCH-20241026-A3F2',
        barista: 'Andi (Barista)',
        isCompliant: true,
    },
    {
        id: 2,
        time: '10:15 WIB',
        ingredientName: 'Oatside Oat Milk Barista',
        amount: '200 ml',
        target: '1x Oat Latte Iced',
        batchCode: 'BCH-20241102-OAT1',
        barista: 'Dimas Pratama',
        isCompliant: false,
        deviationReason: 'Batch kemasan ini sudah terbuka di chiller stasiun espresso',
    },
    {
        id: 3,
        time: '09:40 WIB',
        ingredientName: 'House Espresso Blend',
        amount: '180 gr',
        target: 'Isi Hopper Grinder 1',
        batchCode: 'EB-2024-09',
        barista: 'Andi (Barista)',
        isCompliant: true,
    },
];

export default function UsageIndex() {
    const [selectedIngredientId, setSelectedIngredientId] = useState<number>(1);
    const selectedIngredient =
        DEMO_INGREDIENTS.find((i) => i.id === selectedIngredientId) || DEMO_INGREDIENTS[0];
    const batches = DEMO_BATCHES[selectedIngredientId] || DEMO_BATCHES[1];
    const topBatch = batches[0];

    const [selectedBatchId, setSelectedBatchId] = useState<number>(topBatch.id);
    const selectedBatch = batches.find((b) => b.id === selectedBatchId) || topBatch;
    const isDeviating = selectedBatchId !== topBatch.id;

    const [recentHistory, setRecentHistory] = useState<UsageRecord[]>(INITIAL_HISTORY);
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        ingredient_id: selectedIngredient.id,
        ingredient_batch_id: topBatch.id,
        quantity_used: 250,
        notes: '2x Caffe Latte',
        is_fefo_compliant: true,
        deviation_reason: '',
    });

    const handleSelectBatch = (batch: MockBatch) => {
        setSelectedBatchId(batch.id);
        const deviating = batch.id !== topBatch.id;
        setData({
            ...data,
            ingredient_batch_id: batch.id,
            is_fefo_compliant: !deviating,
            deviation_reason: deviating ? data.deviation_reason : '',
        });
    };

    const handleQuickQty = (qty: number) => {
        setData('quantity_used', qty);
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        // Validasi deviasi
        if (isDeviating && (!data.deviation_reason || data.deviation_reason.trim().length < 5)) {
            alert('Wajib mengisi alasan deviasi minimal 5 karakter!');
            return;
        }

        // Catat ke live history secara instan
        const newRecord: UsageRecord = {
            id: Date.now(),
            time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
            ingredientName: selectedIngredient.name,
            amount: `${data.quantity_used} ${selectedIngredient.unit}`,
            target: data.notes || 'Operasional Bar',
            batchCode: selectedBatch.batch_code,
            barista: 'Andi (Barista)',
            isCompliant: !isDeviating,
            deviationReason: isDeviating ? data.deviation_reason : undefined,
        };

        setRecentHistory([newRecord, ...recentHistory]);
        setToastMessage(
            `Pemakaian ${data.quantity_used} ${selectedIngredient.unit} berhasil dicatat (${
                !isDeviating ? 'Patuh FEFO' : 'Deviasi Dicatat'
            })!`,
        );

        setTimeout(() => setToastMessage(null), 4000);
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-2">
                    <span className="text-lg font-bold tracking-tight text-content-high">
                        Catat Pemakaian Bahan FEFO
                    </span>
                    <span className="rounded bg-brand-primary px-1.5 py-0.5 text-[10px] font-bold text-white">
                        SMART CHOICE
                    </span>
                </div>
            }
        >
            <Head title="Catat Pemakaian Bahan FEFO - BeanFlow" />

            <div className="max-w-[1400px] mx-auto space-y-6">
                {/* Header Title */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-surface-border/60">
                    <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary shadow-xs">
                            <Flame className="w-6 h-6 text-brand-primary" />
                        </div>
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-content-high flex items-center gap-2.5">
                                Catat Pemakaian Bahan
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-primary/10 text-brand-primary border border-brand-primary/20">
                                    FEFO Smart Choice
                                </span>
                            </h1>
                            <p className="text-sm text-content-medium mt-0.5">
                                Pengurangan stok semi-otomatis dengan algoritma rekomendasi FEFO
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2.5 text-xs">
                        <div className="px-3 py-1.5 rounded-lg bg-surface-container border border-surface-border text-content-medium flex items-center gap-2 shadow-2xs">
                            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                            <span className="font-medium">Shift Pagi • Bar Utama</span>
                        </div>
                    </div>
                </div>

                {toastMessage && (
                    <div className="flex items-center gap-2 rounded-xl border border-emerald-300 bg-emerald-50 p-4 text-xs font-semibold text-emerald-800 shadow-xs">
                        <CheckCircle2 className="h-4 w-4 text-emerald-700" />
                        <span>{toastMessage}</span>
                    </div>
                )}

                {/* TWO-COLUMN WORKSPACE GRID (60% / 40%) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* LEFT COLUMN: FEFO USAGE FORM (60%) */}
                    <section className="lg:col-span-7 bg-surface-container rounded-2xl border border-surface-border p-6 shadow-xs space-y-6">
                        <form onSubmit={submit} className="space-y-6">
                            {/* SECTION 1: PILIH BAHAN BAKU */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-content-medium flex items-center justify-between">
                                    <span>Pilih Bahan Baku <span className="text-brand-tertiary">*</span></span>
                                    <span className="text-xs font-normal text-content-subtle normal-case">
                                        {DEMO_INGREDIENTS.length} Bahan Aktif di Bar
                                    </span>
                                </label>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {DEMO_INGREDIENTS.map((item) => (
                                        <button
                                            key={item.id}
                                            type="button"
                                            onClick={() => {
                                                setSelectedIngredientId(item.id);
                                                setData('ingredient_id', item.id);
                                            }}
                                            className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                                                selectedIngredientId === item.id
                                                    ? 'border-brand-primary bg-white shadow-xs ring-1 ring-brand-primary'
                                                    : 'border-surface-border bg-white/60 hover:bg-white'
                                            }`}
                                        >
                                            <div>
                                                <p className="text-xs font-bold text-content-high">{item.name}</p>
                                                <p className="text-[11px] text-content-subtle font-mono">
                                                    Stok: {item.totalStock.toLocaleString()} {item.unit}
                                                </p>
                                            </div>
                                            <span className="rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-800">
                                                {item.category}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* SECTION 2: PILIH BATCH (URUTAN FEFO) */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <label className="text-xs font-bold uppercase tracking-wider text-content-medium">
                                        Pilih Batch <span className="normal-case font-medium text-content-subtle">(Urutan FEFO — Terdekat Expired Dulu)</span>
                                    </label>
                                    <span className="text-xs text-brand-secondary font-semibold flex items-center gap-1">
                                        <Sparkles className="w-3.5 h-3.5" />
                                        Algoritma FEFO Aktif
                                    </span>
                                </div>

                                <div className="space-y-2.5">
                                    {batches.map((batch, index) => {
                                        const isTop = index === 0;
                                        const isSelected = selectedBatchId === batch.id;

                                        return (
                                            <label
                                                key={batch.id}
                                                onClick={() => handleSelectBatch(batch)}
                                                className={`relative flex items-center justify-between p-4 rounded-xl border-2 transition-all cursor-pointer ${
                                                    isSelected
                                                        ? 'border-brand-primary bg-white shadow-xs'
                                                        : 'border-surface-border bg-white/70 hover:bg-white'
                                                }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="batch_selection"
                                                    checked={isSelected}
                                                    onChange={() => handleSelectBatch(batch)}
                                                    className="sr-only"
                                                />

                                                <div className="flex items-center gap-3.5">
                                                    <div
                                                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                                                            isSelected
                                                                ? 'border-brand-primary bg-brand-primary'
                                                                : 'border-surface-border bg-white'
                                                        }`}
                                                    >
                                                        {isSelected && (
                                                            <div className="w-2 h-2 rounded-full bg-white" />
                                                        )}
                                                    </div>

                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-mono font-bold text-sm text-content-high">
                                                                {batch.batch_code}
                                                            </span>
                                                            <span
                                                                className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                                                    batch.urgency_status === 'critical'
                                                                        ? 'bg-[#FDF2F0] text-brand-tertiary border border-[#F8C6BF]'
                                                                        : 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                                                                }`}
                                                            >
                                                                Exp: {batch.expiry_date} ({batch.days_until_expiry} hari!)
                                                            </span>
                                                        </div>
                                                        <p className="text-xs font-mono text-content-medium mt-0.5">
                                                            Sisa: <strong className="text-content-high">{batch.current_stock.toLocaleString()} ml</strong>{' '}
                                                            <span className="text-content-subtle font-sans">({batch.location})</span>
                                                        </p>
                                                    </div>
                                                </div>

                                                {isTop ? (
                                                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-brand-primary text-white shadow-xs">
                                                        ★ REKOMENDASI FEFO
                                                    </span>
                                                ) : (
                                                    <span className="text-xs font-medium text-content-subtle">
                                                        Antrean Ke-{index + 1}
                                                    </span>
                                                )}
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* SECTION 3: INLINE DEVIATION WARNING BOX (Jika Barista Memilih Bukan Batch #0) */}
                            {isDeviating && (
                                <div className="rounded-xl bg-[#FFF7ED] border border-[#FED7AA] p-4 space-y-2.5 shadow-xs">
                                    <div className="flex items-start gap-2.5">
                                        <AlertTriangle className="w-5 h-5 text-brand-secondary flex-shrink-0 mt-0.5" />
                                        <div className="text-xs leading-relaxed text-content-high">
                                            <strong className="text-brand-secondary font-bold block sm:inline">
                                                Deviasi FEFO Terdeteksi:
                                            </strong>{' '}
                                            Anda memilih batch yang bukan prioritas utama. Wajib cantumkan alasan pengambilan fisik:
                                        </div>
                                    </div>

                                    <textarea
                                        rows={3}
                                        value={data.deviation_reason}
                                        onChange={(e) => setData('deviation_reason', e.target.value)}
                                        className="w-full bg-white border border-[#FED7AA] rounded-lg p-2.5 text-xs text-content-high placeholder:text-content-subtle focus:ring-2 focus:ring-brand-secondary focus:border-brand-secondary outline-none transition-all"
                                        placeholder="Contoh: Kemasan batch ini sudah terlanjur dibuka di chiller bar stasiun espresso..."
                                        required
                                    />

                                    <div className="flex items-center justify-between text-[11px] text-content-subtle">
                                        <span>SOP Barista: Minimal 5 karakter alasan logis</span>
                                        <span className="font-semibold text-brand-secondary">
                                            Tercatat ke Log Audit Deviasi
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* SECTION 4: JUMLAH PEMAKAIAN */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-xs font-bold uppercase tracking-wider text-content-medium">
                                        Jumlah Pemakaian <span className="text-brand-tertiary">*</span>
                                    </label>

                                    {/* Quick Chips */}
                                    <div className="flex items-center gap-1.5 text-xs">
                                        {[150, 250, 500, 1000].map((chip) => (
                                            <button
                                                key={chip}
                                                type="button"
                                                onClick={() => handleQuickQty(chip)}
                                                className={`px-2.5 py-1 rounded-lg font-mono text-[11px] transition-colors ${
                                                    data.quantity_used === chip
                                                        ? 'bg-brand-primary text-white font-bold shadow-xs'
                                                        : 'bg-surface-container-high text-content-medium hover:bg-surface-border'
                                                }`}
                                            >
                                                {chip}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="relative flex items-center">
                                    <input
                                        type="number"
                                        value={data.quantity_used}
                                        onChange={(e) => setData('quantity_used', Number(e.target.value))}
                                        className="w-full h-12 bg-white border border-surface-border rounded-xl text-center text-xl font-bold font-mono text-content-high shadow-xs focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all pr-12"
                                        min={1}
                                        max={selectedBatch.current_stock}
                                        required
                                    />
                                    <span className="absolute right-4 font-mono font-semibold text-content-medium text-sm pointer-events-none">
                                        {selectedIngredient.unit}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between pt-0.5 text-xs">
                                    <p className="italic text-content-subtle">
                                        Sisa setelah pakai:{' '}
                                        <strong className="text-content-high font-mono not-italic">
                                            {Math.max(0, selectedBatch.current_stock - data.quantity_used).toLocaleString()}{' '}
                                            {selectedIngredient.unit}
                                        </strong>
                                    </p>
                                    <span className="font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                        Saldo Aman & Cukup
                                    </span>
                                </div>
                            </div>

                            {/* SECTION 5: CATATAN TUJUAN */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-content-high">
                                    Tujuan Pemakaian / Resep Minuman
                                </label>
                                <input
                                    type="text"
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    placeholder="Contoh: 2x Caffe Latte Hot, Isi Hopper Grinder..."
                                    className="w-full bg-white border border-surface-border rounded-xl px-3.5 py-2.5 text-xs text-content-high placeholder:text-content-subtle focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none transition-all"
                                />
                            </div>

                            {/* SUBMIT BUTTON */}
                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full h-12 bg-brand-primary hover:bg-brand-primary-hover active:scale-[0.99] text-white rounded-xl font-bold text-sm tracking-wide shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-70"
                                >
                                    <Check className="w-5 h-5 text-brand-secondary" />
                                    <span>Simpan Pemakaian Bahan</span>
                                </button>
                            </div>
                        </form>
                    </section>

                    {/* ================= RIGHT COLUMN: LIVE HISTORY STREAM (40%) ================= */}
                    <section className="lg:col-span-5 bg-surface-container rounded-2xl border border-surface-border p-6 shadow-xs space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-surface-border">
                            <div className="flex items-center gap-2">
                                <History className="w-5 h-5 text-brand-primary" />
                                <h2 className="text-base font-bold text-content-high">
                                    Riwayat Pemakaian Shift
                                </h2>
                            </div>
                            <span className="text-xs text-content-subtle">
                                {recentHistory.length} Transaksi Terkini
                            </span>
                        </div>

                        <div className="space-y-3">
                            {recentHistory.map((rec) => (
                                <div
                                    key={rec.id}
                                    className={`p-3.5 rounded-xl border transition-all ${
                                        rec.isCompliant
                                            ? 'bg-white border-surface-border shadow-2xs'
                                            : 'bg-[#FFF7ED]/50 border-[#FED7AA]'
                                    }`}
                                >
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="font-mono font-bold text-content-high">
                                            {rec.time}
                                        </span>
                                        {rec.isCompliant ? (
                                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                                                <Check className="h-3 w-3" /> Patuh FEFO
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 rounded-full border border-[#FED7AA] bg-[#FFF7ED] px-2 py-0.5 text-[10px] font-bold text-brand-secondary">
                                                <AlertCircle className="h-3 w-3" /> Deviasi Teralasan
                                            </span>
                                        )}
                                    </div>

                                    <div className="mt-2 flex items-baseline justify-between">
                                        <div>
                                            <h3 className="text-xs font-bold text-content-high">
                                                {rec.ingredientName}
                                            </h3>
                                            <p className="text-[11px] text-content-subtle mt-0.5">
                                                Tujuan: {rec.target}
                                            </p>
                                        </div>
                                        <span className="font-mono font-extrabold text-sm text-brand-primary">
                                            {rec.amount}
                                        </span>
                                    </div>

                                    <div className="mt-2 pt-2 border-t border-surface-border/60 flex items-center justify-between text-[11px] text-content-subtle font-mono">
                                        <span>Batch: {rec.batchCode}</span>
                                        <span className="font-sans text-content-medium">{rec.barista}</span>
                                    </div>

                                    {rec.deviationReason && (
                                        <div className="mt-2 rounded-md bg-white/80 p-2 text-[10px] text-brand-secondary border border-[#FED7AA]/60">
                                            Alasan: "{rec.deviationReason}"
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="pt-2 border-t border-surface-border text-center">
                            <span className="text-[11px] text-content-subtle">
                                Data tersinkron dengan tabel <code className="font-mono">stock_usages</code>
                            </span>
                        </div>
                    </section>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
