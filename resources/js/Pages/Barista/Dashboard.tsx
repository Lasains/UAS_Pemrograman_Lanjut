import BatchIntakeTab from '@/Components/Barista/BatchIntakeTab';
import FefoUsageTab, {
    getBatchUrgency,
} from '@/Components/Barista/FefoUsageTab';
import WasteReportTab from '@/Components/Barista/WasteReportTab';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { cn } from '@/lib/utils';
import { PageProps } from '@/types';
import { Ingredient, IngredientBatch, StockUsage } from '@/types/inventory';
import { Head, usePage } from '@inertiajs/react';
import { Flame, PackagePlus, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

type TabKey = 'usage' | 'batch' | 'waste';

interface BaristaDashboardProps {
    auth?: PageProps['auth'];
    ingredients?: Ingredient[];
    activeBatches?: IngredientBatch[];
    recentUsages?: StockUsage[];
}

function offsetDate(days: number): string {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
}

const FALLBACK_INGREDIENTS: Ingredient[] = [
    { id: 1, category_id: 1, name: 'Fresh Milk Diamond 1L', unit: 'ml', minimum_stock: 2000, warning_days: 7 },
    { id: 2, category_id: 1, name: 'Oatside Oat Milk Barista 1L', unit: 'ml', minimum_stock: 1500, warning_days: 7 },
    { id: 3, category_id: 2, name: 'House Espresso Blend', unit: 'gram', minimum_stock: 1000, warning_days: 7 },
    { id: 4, category_id: 3, name: 'Monin Caramel Syrup 700ml', unit: 'ml', minimum_stock: 700, warning_days: 7 },
];

const FALLBACK_BATCHES: IngredientBatch[] = [
    {
        id: 101,
        ingredient_id: 1,
        batch_code: 'BCH-MILK-01',
        initial_stock: 3000,
        current_stock: 1200,
        received_date: offsetDate(-10),
        expiry_date: offsetDate(1),
        cost_per_unit: 19,
        status: 'active',
    },
    {
        id: 102,
        ingredient_id: 1,
        batch_code: 'BCH-MILK-02',
        initial_stock: 4000,
        current_stock: 4000,
        received_date: offsetDate(-2),
        expiry_date: offsetDate(10),
        cost_per_unit: 19,
        status: 'active',
    },
    {
        id: 103,
        ingredient_id: 2,
        batch_code: 'BCH-OAT-01',
        initial_stock: 3000,
        current_stock: 2000,
        received_date: offsetDate(-5),
        expiry_date: offsetDate(5),
        cost_per_unit: 38,
        status: 'active',
    },
    {
        id: 104,
        ingredient_id: 3,
        batch_code: 'BCH-BEAN-01',
        initial_stock: 5000,
        current_stock: 3500,
        received_date: offsetDate(-4),
        expiry_date: offsetDate(20),
        cost_per_unit: 160,
        status: 'active',
    },
];

const FALLBACK_USAGES: StockUsage[] = [
    {
        id: 1,
        ingredient_batch_id: 101,
        user_id: 1,
        quantity_used: 250,
        usage_date: offsetDate(0),
        is_fefo_compliant: true,
        notes: '2x Caffe Latte',
        batch: { ...FALLBACK_BATCHES[0], ingredient: FALLBACK_INGREDIENTS[0] },
    },
];

const TABS: { key: TabKey; label: string; icon: typeof Flame }[] = [
    { key: 'usage', label: 'Pakai Bahan FEFO', icon: Flame },
    { key: 'batch', label: 'Terima Batch', icon: PackagePlus },
    { key: 'waste', label: 'Lapor Waste', icon: Trash2 },
];

function parseTabFromUrl(url: string): TabKey {
    const query = url.split('?')[1] ?? '';
    const tab = new URLSearchParams(query).get('tab');
    return tab === 'batch' || tab === 'waste' ? tab : 'usage';
}

export default function BaristaDashboard({
    auth,
    ingredients,
    activeBatches,
    recentUsages,
}: BaristaDashboardProps) {
    const page = usePage<PageProps>();
    const user = auth?.user ?? page.props.auth?.user;
    const [activeTab, setActiveTab] = useState<TabKey>(() =>
        parseTabFromUrl(page.url),
    );

    useEffect(() => {
        setActiveTab(parseTabFromUrl(page.url));
    }, [page.url]);

    const ingredientList =
        ingredients && ingredients.length > 0 ? ingredients : FALLBACK_INGREDIENTS;
    const batchList =
        activeBatches && activeBatches.length > 0
            ? activeBatches
            : FALLBACK_BATCHES;
    const usageList = recentUsages ?? FALLBACK_USAGES;

    const statusCounts = useMemo(() => {
        const counts = { critical: 0, warning: 0, safe: 0 };
        for (const batch of batchList) {
            if (batch.status !== 'active' || batch.current_stock <= 0) continue;
            counts[getBatchUrgency(batch).status] += 1;
        }
        return counts;
    }, [batchList]);

    const handleTabChange = (tab: TabKey) => {
        setActiveTab(tab);
        if (typeof window !== 'undefined') {
            const url = new URL(window.location.href);
            url.searchParams.set('tab', tab);
            window.history.replaceState(null, '', url.toString());
        }
    };

    return (
        <AuthenticatedLayout header="Dasbor Barista">
            <Head title="Dasbor Barista - BeanFlow" />

            <div className="space-y-6">
                {/* Header Ringkas + 3 Kartu Status Lampu Lalu Lintas */}
                <div className="flex flex-col justify-between gap-4 rounded-2xl border border-surface-border bg-surface-container p-5 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-xl font-bold text-content-high">
                            Halo, {user?.name || 'Barista'}
                        </h1>
                        <p className="mt-0.5 text-xs text-content-medium">
                            Operasional bar terpadu: pemakaian FEFO, terima batch, dan lapor waste.
                        </p>
                    </div>

                    <div className="grid grid-cols-3 gap-2.5">
                        <div className="rounded-xl border border-[#F8C6BF] bg-[#FDF2F0] px-3 py-2 text-center">
                            <div className="font-mono text-lg font-extrabold text-brand-tertiary">
                                {statusCounts.critical}
                            </div>
                            <div className="text-[11px] font-semibold text-brand-tertiary">
                                🔴 Kritis
                            </div>
                        </div>
                        <div className="rounded-xl border border-[#FED7AA] bg-[#FFF7ED] px-3 py-2 text-center">
                            <div className="font-mono text-lg font-extrabold text-[#C88242]">
                                {statusCounts.warning}
                            </div>
                            <div className="text-[11px] font-semibold text-[#C88242]">
                                🟡 Peringatan
                            </div>
                        </div>
                        <div className="rounded-xl border border-emerald-300 bg-emerald-50 px-3 py-2 text-center">
                            <div className="font-mono text-lg font-extrabold text-emerald-800">
                                {statusCounts.safe}
                            </div>
                            <div className="text-[11px] font-semibold text-emerald-800">
                                🟢 Aman
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigasi 3 Tab Ringkas */}
                <div
                    role="tablist"
                    aria-label="Menu Operasional Barista"
                    className="grid grid-cols-3 gap-2 rounded-2xl border border-surface-border bg-surface-container p-1.5"
                >
                    {TABS.map(({ key, label, icon: Icon }) => {
                        const isActive = activeTab === key;
                        return (
                            <button
                                key={key}
                                type="button"
                                role="tab"
                                aria-selected={isActive}
                                onClick={() => handleTabChange(key)}
                                className={cn(
                                    'flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-bold transition-all sm:text-sm',
                                    isActive
                                        ? 'bg-brand-primary text-white shadow-xs'
                                        : 'text-content-medium hover:bg-surface-container-high hover:text-brand-primary',
                                )}
                            >
                                <Icon className="h-4 w-4 shrink-0" />
                                <span className="truncate">{label}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Konten Tab Aktif */}
                {activeTab === 'usage' && (
                    <FefoUsageTab
                        ingredients={ingredientList}
                        activeBatches={batchList}
                        recentUsages={usageList}
                    />
                )}
                {activeTab === 'batch' && (
                    <BatchIntakeTab ingredients={ingredientList} />
                )}
                {activeTab === 'waste' && (
                    <WasteReportTab
                        activeBatches={batchList}
                        ingredients={ingredientList}
                    />
                )}
            </div>
        </AuthenticatedLayout>
    );
}
