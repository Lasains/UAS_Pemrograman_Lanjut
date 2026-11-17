import { cn } from '@/lib/utils';
import { PageProps, Role } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    AlertCircle,
    AlertTriangle,
    Boxes,
    CheckCircle2,
    ClipboardList,
    Clock,
    Coffee,
    Flame,
    LineChart,
    LogOut,
    Menu,
    PackagePlus,
    Scale,
    Tag,
    Thermometer,
    TrendingDown,
    X,
} from 'lucide-react';
import { PropsWithChildren, ReactNode, useState } from 'react';

interface AppLayoutProps {
    title?: string;
    header?: ReactNode;
}

interface NavItem {
    label: string;
    routeName?: string;
    fallbackUrl: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: {
        text: string;
        variant: 'critical' | 'warning' | 'info';
    };
    roles: Role[];
}

interface NavGroup {
    groupName: string;
    roles: Role[];
    items: NavItem[];
}

export default function AppLayout({
    title,
    header,
    children,
}: PropsWithChildren<AppLayoutProps>) {
    const pageProps = usePage<PageProps & { flash?: { success?: string; error?: string; warning?: string } }>().props;
    const user = pageProps.auth?.user || {
        id: 1,
        name: 'Rian Ardiansyah',
        email: 'supervisor@kafe.com',
        role: 'supervisor' as Role,
    };
    const flash = pageProps.flash || {};

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Helpers
    const getInitials = (name: string): string => {
        const parts = name.trim().split(' ');
        if (parts.length >= 2) {
            return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
        }
        return (name.slice(0, 2) || 'BF').toUpperCase();
    };

    const safeUrl = (routeName?: string, fallbackUrl = '#'): string => {
        if (!routeName) return fallbackUrl;
        try {
            if (typeof route !== 'undefined') {
                return route(routeName);
            }
        } catch {
            // fallback if route not registered yet
        }
        return fallbackUrl;
    };

    const isCurrent = (routeName?: string): boolean => {
        if (!routeName) return false;
        try {
            if (typeof route !== 'undefined') {
                return route().current(routeName);
            }
        } catch {
            // fallback
        }
        return false;
    };

    const roleConfig: Record<Role, { label: string; badgeClass: string; station: string }> = {
        barista: {
            label: 'Barista Bar',
            badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-300',
            station: 'Bar Utama (Station A)',
        },
        supervisor: {
            label: 'Supervisor Bar & Gudang',
            badgeClass: 'bg-[#EDE4DC] text-[#4A2C11] border-[#C88242]/40',
            station: 'Operasional & Gudang',
        },
        owner: {
            label: 'Owner & Manajemen',
            badgeClass: 'bg-[#4A2C11] text-[#FAF7F2] border-[#C88242]',
            station: 'Pusat Analitik Eksekutif',
        },
    };

    const currentRoleConfig = roleConfig[user.role] || roleConfig.barista;

    // Navigation configuration based on RBAC matrix
    const navGroups: NavGroup[] = [
        {
            groupName: 'Operasional Bar',
            roles: ['barista', 'supervisor'],
            items: [
                {
                    label: 'Monitoring Kedaluwarsa',
                    routeName: 'dashboard',
                    fallbackUrl: '/dashboard',
                    icon: Clock,
                    badge: { text: '2 Kritis', variant: 'critical' },
                    roles: ['barista', 'supervisor'],
                },
                {
                    label: 'Catat Pemakaian (FEFO)',
                    routeName: 'usage.create',
                    fallbackUrl: '/usage/create',
                    icon: Flame,
                    roles: ['barista', 'supervisor'],
                },
                {
                    label: 'Penerimaan Batch (Restock)',
                    routeName: 'batches.create',
                    fallbackUrl: '/batches/create',
                    icon: PackagePlus,
                    roles: ['barista', 'supervisor'],
                },
                {
                    label: 'Lapor Bahan Rusak',
                    routeName: 'waste.create',
                    fallbackUrl: '/waste/create',
                    icon: AlertTriangle,
                    roles: ['barista', 'supervisor'],
                },
            ],
        },
        {
            groupName: 'Pusat Inventaris & Mutu',
            roles: ['supervisor', 'owner'],
            items: [
                {
                    label: 'Katalog Master Bahan',
                    routeName: 'ingredients.index',
                    fallbackUrl: '/ingredients',
                    icon: Boxes,
                    roles: ['supervisor'],
                },
                {
                    label: 'Kategori Bahan Baku',
                    routeName: 'categories.index',
                    fallbackUrl: '/categories',
                    icon: Tag,
                    roles: ['supervisor'],
                },
                {
                    label: 'Approval Pemusnahan',
                    routeName: 'waste.index',
                    fallbackUrl: '/waste',
                    icon: Scale,
                    badge: { text: '3 Pending', variant: 'warning' },
                    roles: ['supervisor'],
                },
                {
                    label: 'Riwayat Audit FEFO',
                    routeName: 'audit.index',
                    fallbackUrl: '/audit',
                    icon: ClipboardList,
                    roles: ['supervisor', 'owner'],
                },
            ],
        },
        {
            groupName: 'Eksekutif & Finansial',
            roles: ['owner'],
            items: [
                {
                    label: 'Dasbor Analitik Eksekutif',
                    routeName: 'dashboard.owner',
                    fallbackUrl: '/owner/dashboard',
                    icon: LineChart,
                    roles: ['owner'],
                },
                {
                    label: 'Laporan Finansial & Waste',
                    routeName: 'reports.waste',
                    fallbackUrl: '/reports/waste',
                    icon: TrendingDown,
                    roles: ['owner'],
                },
            ],
        },
    ];

    // Filter groups and items by user.role
    const visibleGroups = navGroups
        .filter((g) => g.roles.includes(user.role))
        .map((g) => ({
            ...g,
            items: g.items.filter((item) => item.roles.includes(user.role)),
        }))
        .filter((g) => g.items.length > 0);

    return (
        <div className="min-h-screen bg-[#FAF7F2] text-[#241408] antialiased flex flex-col">
            {title && <Head title={title} />}

            {/* TOP BAR / EXPORT MCP HEADER BANNER */}
            <header className="bg-[#4A2C11] border-b-4 border-[#C88242] px-4 sm:px-6 py-3 shadow-md flex items-center justify-between gap-4 sticky top-0 z-50">
                <div className="flex items-center gap-3">
                    {/* Mobile Menu Trigger */}
                    <button
                        type="button"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="lg:hidden text-[#FAF7F2] p-1.5 rounded-lg hover:bg-white/10 transition"
                        aria-label="Toggle navigation"
                    >
                        {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>

                    <Link href="/" className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-[#FAF7F2] text-[#4A2C11] flex items-center justify-center font-bold shadow-xs">
                            <Coffee className="w-5 h-5 text-[#4A2C11]" />
                        </div>
                        <div>
                            <span className="text-base font-bold text-[#FAF7F2] tracking-tight block leading-none">
                                BeanFlow
                            </span>
                            <span className="text-[10px] text-[#C88242] font-semibold tracking-wider uppercase block mt-0.5">
                                Cafe Ops System
                            </span>
                        </div>
                    </Link>
                </div>

                <div className="flex items-center gap-3">
                    {/* Station & Shift Indicator */}
                    <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full text-xs bg-white/10 text-[#FAF7F2] border border-white/10">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="font-medium text-[#FED0A3]">Shift Pagi</span>
                        <span className="text-white/40">•</span>
                        <span className="text-white/80">{currentRoleConfig.station}</span>
                    </div>

                    {/* Role Capsule Badge */}
                    <span
                        className={cn(
                            'px-2.5 py-1 rounded-full text-xs font-semibold border shadow-xs',
                            currentRoleConfig.badgeClass,
                        )}
                    >
                        {currentRoleConfig.label}
                    </span>
                </div>
            </header>

            <div className="flex flex-1 min-h-[calc(100vh-64px)] relative">
                {/* BACKDROP FOR MOBILE */}
                {isMobileMenuOpen && (
                    <div
                        className="fixed inset-0 bg-black/40 z-30 lg:hidden"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                )}

                {/* PERSISTENT SIDEBAR NAVIGATION */}
                <aside
                    className={cn(
                        'w-64 bg-[#F5EFEB] border-r border-[#EDE4DC] flex flex-col justify-between shrink-0 p-4 transition-all duration-200 z-40',
                        'fixed lg:sticky top-[64px] h-[calc(100vh-64px)]',
                        isMobileMenuOpen ? 'left-0 shadow-2xl' : '-left-64 lg:left-0',
                    )}
                >
                    <div className="space-y-6 overflow-y-auto pr-1">
                        {/* Brand Box & App Identity */}
                        <div className="flex items-center gap-3 px-2 py-1">
                            <div className="w-9 h-9 rounded-xl bg-[#4A2C11] flex items-center justify-center text-[#C88242] shadow-xs font-bold">
                                <Coffee className="w-5 h-5 text-[#C88242]" />
                            </div>
                            <div>
                                <h2 className="text-sm font-extrabold text-[#241408] tracking-tight leading-none">
                                    BeanFlow
                                </h2>
                                <span className="text-[10px] text-[#9C8474] font-semibold tracking-wider uppercase block mt-0.5">
                                    FEFO Precision Core
                                </span>
                            </div>
                        </div>

                        {/* Shift & Station Mini Card */}
                        <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#EDE4DC] space-y-1">
                            <div className="flex items-center justify-between text-xs text-[#5C3A21]">
                                <span className="font-semibold flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    Shift Aktif
                                </span>
                                <span className="text-[10px] font-bold px-1.5 py-0.5 bg-[#EDE4DC] text-[#4A2C11] rounded">
                                    PAGI
                                </span>
                            </div>
                            <p className="text-xs font-bold text-[#241408] truncate">{currentRoleConfig.station}</p>
                            <p className="text-[11px] text-[#9C8474] flex items-center gap-1">
                                <Thermometer className="w-3 h-3 text-[#C88242]" />
                                Chiller IoT: 3.2°C (Optimal)
                            </p>
                        </div>

                        {/* Navigation Groups */}
                        <div className="space-y-5">
                            {visibleGroups.map((group) => (
                                <div key={group.groupName}>
                                    <p className="px-2 text-[10px] font-bold text-[#9C8474] uppercase tracking-wider mb-2">
                                        {group.groupName}
                                    </p>
                                    <nav className="space-y-1">
                                        {group.items.map((item) => {
                                            const active = isCurrent(item.routeName);
                                            const IconComponent = item.icon;
                                            return (
                                                <Link
                                                    key={item.label}
                                                    href={safeUrl(item.routeName, item.fallbackUrl)}
                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                    className={cn(
                                                        'flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group',
                                                        active
                                                            ? 'bg-[#4A2C11] text-[#FAF7F2] shadow-xs'
                                                            : 'text-[#5C3A21] hover:bg-[#EDE4DC] hover:text-[#241408]',
                                                    )}
                                                >
                                                    <span className="flex items-center gap-2.5 truncate">
                                                        <IconComponent
                                                            className={cn(
                                                                'w-4 h-4 shrink-0',
                                                                active
                                                                    ? 'text-[#C88242]'
                                                                    : 'text-[#9C8474] group-hover:text-[#4A2C11]',
                                                            )}
                                                        />
                                                        <span className="truncate">{item.label}</span>
                                                    </span>

                                                    {item.badge && (
                                                        <span
                                                            className={cn(
                                                                'text-[10px] px-1.5 py-0.5 rounded-full font-bold shrink-0 ml-1.5',
                                                                item.badge.variant === 'critical'
                                                                    ? 'bg-[#FDF2F0] text-[#8C3D2B] border border-[#F8C6BF]'
                                                                    : 'bg-[#FFF7ED] text-[#C88242] border border-[#FED7AA]',
                                                            )}
                                                        >
                                                            {item.badge.text}
                                                        </span>
                                                    )}
                                                </Link>
                                            );
                                        })}
                                    </nav>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* User Profile Card & Logout */}
                    <div className="pt-3 border-t border-[#EDE4DC] flex items-center justify-between">
                        <div className="flex items-center gap-2.5 overflow-hidden">
                            <div className="w-8 h-8 rounded-full bg-[#4A2C11] text-[#FAF7F2] flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                                {getInitials(user.name)}
                            </div>
                            <div className="truncate">
                                <p className="text-xs font-bold text-[#241408] truncate">{user.name}</p>
                                <p className="text-[10px] text-[#9C8474] capitalize">{user.role}</p>
                            </div>
                        </div>

                        {/* Logout Button */}
                        <Link
                            href={safeUrl('logout', '/logout')}
                            method="post"
                            as="button"
                            title="Keluar dari sesi"
                            className="text-[#9C8474] hover:text-[#8C3D2B] hover:bg-[#FDF2F0] p-1.5 rounded-lg transition"
                        >
                            <LogOut className="w-4 h-4" />
                        </Link>
                    </div>
                </aside>

                {/* MAIN VIEWPORT / INNER WORKSPACE CANVAS */}
                <main className="flex-1 flex flex-col bg-[#FAF7F2] min-w-0">
                    {/* Header bar within canvas if header prop is provided */}
                    {header && (
                        <div className="bg-[#FAF7F2] border-b border-[#EDE4DC] px-6 sm:px-8 py-4">
                            {header}
                        </div>
                    )}

                    {/* FLASH MESSAGE ALERTS */}
                    <div className="px-6 sm:px-8 pt-4 space-y-2">
                        {flash.success && (
                            <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800 flex items-center gap-2 shadow-xs">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                <span>{flash.success}</span>
                            </div>
                        )}
                        {flash.error && (
                            <div className="rounded-xl bg-[#FDF2F0] border border-[#F8C6BF] p-3 text-xs text-[#8C3D2B] flex items-center gap-2 shadow-xs">
                                <AlertCircle className="w-4 h-4 text-[#8C3D2B] shrink-0" />
                                <span>{flash.error}</span>
                            </div>
                        )}
                        {flash.warning && (
                            <div className="rounded-xl bg-[#FFF7ED] border border-[#FED7AA] p-3 text-xs text-[#C88242] flex items-center gap-2 shadow-xs">
                                <AlertTriangle className="w-4 h-4 text-[#C88242] shrink-0" />
                                <span>{flash.warning}</span>
                            </div>
                        )}
                    </div>

                    {/* DYNAMIC IN-SHELL CONTENT SLOT */}
                    <div className="flex-1 p-4 sm:p-6 lg:p-8">{children}</div>
                </main>
            </div>
        </div>
    );
}
