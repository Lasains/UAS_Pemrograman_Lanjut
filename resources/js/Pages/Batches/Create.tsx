import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    Calendar,
    Check,
    CheckCircle2,
    Clock,
    Coffee,
    DollarSign,
    Info,
    MapPin,
    Package,
    PackagePlus,
    RefreshCw,
    Sparkles,
} from 'lucide-react';
import { FormEventHandler, useState } from 'react';

interface MockIngredient {
    id: number;
    name: string;
    category: string;
    unit: string;
    sku: string;
    defaultCost: number;
    defaultShelfDays: number;
}

interface IntakeRecord {
    id: number;
    batchCode: string;
    ingredientName: string;
    quantity: number;
    unit: string;
    costPerUnit: number;
    totalCost: number;
    expiryDate: string;
    daysUntil: number;
    location: string;
    time: string;
}

const INGREDIENTS_CATALOG: MockIngredient[] = [
    { id: 1, name: 'Fresh Milk Diamond 1L', category: 'Dairy', unit: 'ml', sku: 'SKU-DRY-001', defaultCost: 18500, defaultShelfDays: 14 },
    { id: 2, name: 'Oatside Oat Milk Barista 1L', category: 'Plant-Based', unit: 'ml', sku: 'SKU-DRY-002', defaultCost: 38000, defaultShelfDays: 90 },
    { id: 3, name: 'House Espresso Blend Beans', category: 'Coffee Beans', unit: 'gram', sku: 'SKU-COF-001', defaultCost: 160000, defaultShelfDays: 45 },
    { id: 4, name: 'Monin Caramel Syrup 700ml', category: 'Syrup', unit: 'ml', sku: 'SKU-SYR-001', defaultCost: 145000, defaultShelfDays: 180 },
];

const INITIAL_INTAKE_HISTORY: IntakeRecord[] = [
    {
        id: 1,
        batchCode: 'BCH-20241026-A3F2',
        ingredientName: 'Fresh Milk Diamond 1L',
        quantity: 5000,
        unit: 'ml',
        costPerUnit: 18500,
        totalCost: 92500,
        expiryDate: '2024-11-09',
        daysUntil: 14,
        location: 'Chiller Depan Bar',
        time: '10:15 WIB',
    },
    {
        id: 2,
        batchCode: 'BCH-20241026-OAT9',
        ingredientName: 'Oatside Oat Milk Barista',
        quantity: 6000,
        unit: 'ml',
        costPerUnit: 38000,
        totalCost: 228000,
        expiryDate: '2025-01-24',
        daysUntil: 90,
        location: 'Chiller Cadangan',
        time: '09:30 WIB',
    },
    {
        id: 3,
        batchCode: 'EB-2024-10-B1',
        ingredientName: 'House Espresso Blend Beans',
        quantity: 3000,
        unit: 'gram',
        costPerUnit: 160000,
        totalCost: 480000,
        expiryDate: '2024-12-10',
        daysUntil: 45,
        location: 'Rak Biji Kopi Kering',
        time: '08:45 WIB',
    },
];

export default function BatchesCreate() {
    const todayStr = new Date().toISOString().split('T')[0];

    const generateBatchCode = () => {
        const d = new Date();
        const datePart = d.toISOString().slice(0, 10).replace(/-/g, '');
        const randomHex = Math.random().toString(36).substring(2, 6).toUpperCase();
        return `BCH-${datePart}-${randomHex}`;
    };

    const [selectedIngredientId, setSelectedIngredientId] = useState<number>(1);
    const selectedIngredient =
        INGREDIENTS_CATALOG.find((i) => i.id === selectedIngredientId) || INGREDIENTS_CATALOG[0];

    // Default expiry date based on shelf days
    const calculateDefaultExpiry = (days: number) => {
        const target = new Date();
        target.setDate(target.getDate() + days);
        return target.toISOString().split('T')[0];
    };

    const { data, setData, post, processing, errors, reset } = useForm({
        ingredient_id: selectedIngredient.id,
        batch_code: generateBatchCode(),
        received_date: todayStr,
        expiry_date: calculateDefaultExpiry(selectedIngredient.defaultShelfDays),
        initial_stock: 5000,
        cost_per_unit: selectedIngredient.defaultCost,
        location: 'Chiller Depan Bar',
    });

    const [historyList, setHistoryList] = useState<IntakeRecord[]>(INITIAL_INTAKE_HISTORY);
    const [successBanner, setSuccessBanner] = useState<string | null>(null);

    // Calculate days between received and expiry
    const diffDays = Math.max(
        0,
        Math.round(
            (new Date(data.expiry_date).getTime() - new Date(data.received_date).getTime()) /
                (1000 * 60 * 60 * 24),
        ),
    );

    const handleIngredientChange = (ingredient: MockIngredient) => {
        setSelectedIngredientId(ingredient.id);
        setData({
            ...data,
            ingredient_id: ingredient.id,
            cost_per_unit: ingredient.defaultCost,
            expiry_date: calculateDefaultExpiry(ingredient.defaultShelfDays),
        });
    };

    const handleAutoGenerateCode = () => {
        setData('batch_code', generateBatchCode());
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        if (new Date(data.expiry_date) <= new Date(data.received_date)) {
            alert('Tanggal kedaluwarsa harus lebih besar dari tanggal penerimaan bahan!');
            return;
        }

        const newIntake: IntakeRecord = {
            id: Date.now(),
            batchCode: data.batch_code,
            ingredientName: selectedIngredient.name,
            quantity: Number(data.initial_stock),
            unit: selectedIngredient.unit,
            costPerUnit: Number(data.cost_per_unit),
            totalCost: Math.round(
                (Number(data.initial_stock) / (selectedIngredient.unit === 'ml' ? 1000 : 1)) *
                    Number(data.cost_per_unit),
            ),
            expiryDate: data.expiry_date,
            daysUntil: diffDays,
            location: data.location,
            time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
        };

        setHistoryList([newIntake, ...historyList]);
        setSuccessBanner(
            `Batch ${data.batch_code} (${selectedIngredient.name}) berhasil disimpan ke gudang/bar!`,
        );

        // Reset to next batch code
        setData('batch_code', generateBatchCode());
        setTimeout(() => setSuccessBanner(null), 4000);
    };

    const totalAssetValuation = historyList.reduce((acc, cur) => acc + cur.totalCost, 0);

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-2">
                    <span className="text-lg font-bold tracking-tight text-content-high">
                        Penerimaan Batch Baru
                    </span>
                    <span className="rounded bg-brand-primary px-1.5 py-0.5 text-[10px] font-bold text-white">
                        MULTI-BATCH
                    </span>
                </div>
            }
        >
            <Head title="Penerimaan Batch Baru - BeanFlow" />

            <div className="max-w-7xl mx-auto space-y-6">
                {/* Page Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-surface-border">
                    <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center text-brand-primary shadow-xs">
                            <PackagePlus className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2.5">
                                <h1 className="text-2xl font-bold tracking-tight text-content-high">
                                    Penerimaan Batch Baru
                                </h1>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-surface-container-high text-content-medium border border-surface-border">
                                    Multi-Batch Supplier
                                </span>
                            </div>
                            <p className="text-sm text-content-medium mt-0.5">
                                Catat stok bahan masuk, lot pabrik, tanggal kedaluwarsa &amp; harga beli per unit
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2.5 text-xs">
                        <div className="px-3 py-1.5 rounded-lg bg-surface-container border border-surface-border text-content-medium flex items-center gap-2 shadow-2xs">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span>Sistem Sinkron Gudang &amp; Bar</span>
                        </div>
                    </div>
                </div>

                {successBanner && (
                    <div className="flex items-center gap-2 rounded-xl border border-emerald-300 bg-emerald-50 p-4 text-xs font-semibold text-emerald-800 shadow-xs">
                        <CheckCircle2 className="h-4 w-4 text-emerald-700" />
                        <span>{successBanner}</span>
                    </div>
                )}

                {/* Two-Column Layout (55% Form / 45% Restock History) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* LEFT COLUMN: Batch Entry Form */}
                    <div className="lg:col-span-7 bg-surface-container border border-surface-border rounded-2xl p-6 sm:p-7 shadow-xs">
                        <div className="flex items-center justify-between pb-4 mb-5 border-b border-surface-border">
                            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-content-high">
                                <Package className="w-4 h-4 text-brand-secondary" />
                                <span>Formulir Penerimaan Batch Fisik</span>
                            </div>
                            <span className="text-xs font-medium text-content-subtle bg-surface-container-high px-2 py-0.5 rounded">
                                Faktur Supplier
                            </span>
                        </div>

                        <form onSubmit={submit} className="space-y-5">
                            {/* Field 1: Pilih Bahan Baku */}
                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold uppercase tracking-wider text-content-medium">
                                    Pilih Bahan Baku <span className="text-brand-tertiary">*</span>
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {INGREDIENTS_CATALOG.map((item) => (
                                        <button
                                            key={item.id}
                                            type="button"
                                            onClick={() => handleIngredientChange(item)}
                                            className={`p-3 rounded-xl border text-left transition-all ${
                                                selectedIngredientId === item.id
                                                    ? 'border-brand-primary bg-white shadow-xs ring-1 ring-brand-primary'
                                                    : 'border-surface-border bg-white/60 hover:bg-white'
                                            }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-bold text-content-high truncate">
                                                    {item.name}
                                                </span>
                                                <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-surface-container text-content-medium">
                                                    {item.unit}
                                                </span>
                                            </div>
                                            <p className="text-[11px] text-content-subtle mt-1">
                                                {item.sku} • {item.category}
                                            </p>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Field 2: Kode Batch Fisik */}
                            <div className="space-y-1.5">
                                <div className="flex justify-between items-center">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-content-medium">
                                        Kode Batch Fisik / Lot Pabrik <span className="text-brand-tertiary">*</span>
                                    </label>
                                    <span className="text-[11px] text-content-subtle">Tercetak pada kemasan</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="relative flex-1">
                                        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-content-subtle font-mono text-xs font-semibold">
                                            #
                                        </span>
                                        <input
                                            type="text"
                                            value={data.batch_code}
                                            onChange={(e) => setData('batch_code', e.target.value)}
                                            className="w-full pl-8 pr-3.5 py-2.5 bg-white border border-surface-border rounded-xl text-sm font-mono font-bold text-content-high focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary shadow-xs"
                                            required
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleAutoGenerateCode}
                                        className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-surface-border bg-surface-canvas hover:bg-surface-container-high text-xs font-medium text-content-medium transition-colors shadow-xs flex-shrink-0"
                                    >
                                        <RefreshCw className="w-3.5 h-3.5 text-brand-secondary" />
                                        <span>Auto-Code</span>
                                    </button>
                                </div>
                            </div>

                            {/* Two Date Fields Side by Side */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-content-medium">
                                        Tanggal Terima <span className="text-brand-tertiary">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        value={data.received_date}
                                        onChange={(e) => setData('received_date', e.target.value)}
                                        className="w-full px-3.5 py-2.5 bg-white border border-surface-border rounded-xl text-sm font-medium text-content-high shadow-xs focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                                        required
                                    />
                                    <p className="text-[11px] text-content-subtle">Default: Hari ini</p>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-content-medium">
                                        Tanggal Kedaluwarsa <span className="text-brand-tertiary">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        value={data.expiry_date}
                                        onChange={(e) => setData('expiry_date', e.target.value)}
                                        className="w-full px-3.5 py-2.5 bg-white border border-surface-border rounded-xl text-sm font-medium text-content-high font-mono shadow-xs focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                                        required
                                    />
                                    <p className="text-[11px] text-content-subtle">Tercetak pada tutup / kemasan</p>
                                </div>
                            </div>

                            {/* Expiry Evaluation Preview */}
                            <div className="p-3 bg-surface-canvas border border-surface-border rounded-xl flex items-center justify-between gap-3 text-xs">
                                <span className="font-medium text-content-medium">Hasil Evaluasi Umur Simpan (FEFO):</span>
                                <span
                                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                                        diffDays > 7
                                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                                            : diffDays >= 3
                                            ? 'bg-[#FFF7ED] text-[#C88242] border border-[#FED7AA]'
                                            : 'bg-[#FDF2F0] text-brand-tertiary border border-[#F8C6BF]'
                                    }`}
                                >
                                    <Check className="w-3.5 h-3.5" />
                                    <span>{diffDays > 7 ? '✓ Aman' : '⚠ Perhatian'}: {diffDays} hari sisa</span>
                                </span>
                            </div>

                            {/* Kuantitas & Harga Beli */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-content-medium">
                                        Jumlah Stok Masuk <span className="text-brand-tertiary">*</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={data.initial_stock}
                                            onChange={(e) => setData('initial_stock', Number(e.target.value))}
                                            className="w-full pl-3.5 pr-14 py-2.5 bg-white border border-surface-border rounded-xl text-base font-bold font-mono text-content-high shadow-xs focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                                            min={1}
                                            required
                                        />
                                        <span className="absolute inset-y-0 right-3.5 flex items-center font-mono text-xs font-bold text-content-medium">
                                            {selectedIngredient.unit}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-content-medium">
                                        Harga Beli per Unit <span className="text-brand-tertiary">*</span>
                                    </label>
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-3.5 flex items-center font-mono text-xs font-bold text-content-medium">
                                            Rp
                                        </span>
                                        <input
                                            type="number"
                                            value={data.cost_per_unit}
                                            onChange={(e) => setData('cost_per_unit', Number(e.target.value))}
                                            className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-surface-border rounded-xl text-base font-bold font-mono text-content-high shadow-xs focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                                            min={100}
                                            required
                                        />
                                    </div>
                                    <p className="text-[11px] text-content-subtle">Dasar valuasi aset &amp; kerugian waste</p>
                                </div>
                            </div>

                            {/* Lokasi Penyimpanan Fisik */}
                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold uppercase tracking-wider text-content-medium">
                                    Lokasi Penyimpanan Fisik
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                    {['Chiller Depan Bar', 'Chiller Cadangan', 'Gudang Transit Bar'].map((loc) => (
                                        <button
                                            key={loc}
                                            type="button"
                                            onClick={() => setData('location', loc)}
                                            className={`p-2.5 rounded-xl border text-xs font-medium text-center transition-all ${
                                                data.location === loc
                                                    ? 'border-brand-primary bg-white text-brand-primary font-bold shadow-xs'
                                                    : 'border-surface-border bg-white/60 text-content-medium hover:bg-white'
                                            }`}
                                        >
                                            {loc}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full h-12 bg-brand-primary hover:bg-brand-primary-hover active:scale-[0.99] text-white rounded-xl font-bold text-sm tracking-wide shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-70"
                                >
                                    <PackagePlus className="w-5 h-5 text-brand-secondary" />
                                    <span>Simpan Batch Masuk ke Sistem</span>
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* RIGHT COLUMN: Restock History & Valuation Card */}
                    <div className="lg:col-span-5 space-y-5">
                        {/* Summary Valuation Widget */}
                        <div className="rounded-2xl border border-surface-border bg-surface-container p-6 shadow-xs space-y-3">
                            <span className="text-xs font-bold uppercase tracking-wider text-content-subtle">
                                Total Valuasi Masuk Shift Ini
                            </span>
                            <div className="font-mono text-3xl font-extrabold text-brand-primary tracking-tight">
                                Rp {totalAssetValuation.toLocaleString('id-ID')}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-content-medium border-t border-surface-border pt-3">
                                <Sparkles className="w-4 h-4 text-brand-secondary" />
                                <span>{historyList.length} Batch terdaftar &amp; siap dipotong FEFO</span>
                            </div>
                        </div>

                        {/* Recent Batch List */}
                        <div className="rounded-2xl border border-surface-border bg-surface-container p-6 shadow-xs space-y-4">
                            <div className="flex items-center justify-between pb-3 border-b border-surface-border">
                                <div className="flex items-center gap-2 text-sm font-bold text-content-high">
                                    <Clock className="w-4 h-4 text-brand-primary" />
                                    <span>Batch Baru Diterima</span>
                                </div>
                                <span className="text-xs text-content-subtle font-mono">Shift Pagi</span>
                            </div>

                            <div className="space-y-3">
                                {historyList.map((batch) => (
                                    <div
                                        key={batch.id}
                                        className="p-3.5 rounded-xl border border-surface-border bg-white shadow-2xs space-y-2"
                                    >
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="font-mono font-bold text-brand-primary">
                                                {batch.batchCode}
                                            </span>
                                            <span className="rounded bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 text-[10px] font-semibold font-mono">
                                                Exp: {batch.expiryDate}
                                            </span>
                                        </div>

                                        <div className="flex items-baseline justify-between">
                                            <h3 className="text-xs font-bold text-content-high">
                                                {batch.ingredientName}
                                            </h3>
                                            <span className="font-mono font-extrabold text-sm text-content-high">
                                                {batch.quantity.toLocaleString()} {batch.unit}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between text-[11px] text-content-subtle border-t border-surface-border/60 pt-2 font-mono">
                                            <span>Valuasi: Rp {batch.totalCost.toLocaleString('id-ID')}</span>
                                            <span className="font-sans flex items-center gap-1">
                                                <MapPin className="w-3 h-3 text-brand-secondary" />
                                                {batch.location}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
