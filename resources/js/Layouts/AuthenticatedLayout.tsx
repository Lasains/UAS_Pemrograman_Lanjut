import { Role, User } from '@/types/inventory';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    AlertTriangle,
    BarChart3,
    Boxes,
    CalendarClock,
    CheckCircle2,
    CheckSquare,
    ChevronDown,
    ClipboardCheck,
    Clock,
    Coffee,
    Flame,
    LayoutDashboard,
    LogOut,
    Menu,
    PackagePlus,
    ShieldCheck,
    TrendingDown,
    User as UserIcon,
    X,
} from 'lucide-react';
import { PropsWithChildren, ReactNode, useEffect, useRef, useState } from 'react';

interface AuthenticatedLayoutProps extends PropsWithChildren {
    header?: ReactNode;
}

interface NavItem {
    label: string;
    routeName: string;
    url: string;
    tab?: 'usage' | 'batch' | 'waste';
    icon: typeof Coffee;
    roles: Role[];
    activeMatch?: (path: string, userRole: Role, search: string) => boolean;
}

interface NavGroup {
    title: string;
    roles: Role[];
    items: NavItem[];
}

const NAVIGATION_GROUPS: NavGroup[] = [
    {
        title: 'OPERASIONAL BAR',
        roles: ['barista', 'supervisor'],
        items: [
            {
                label: 'Dasbor Barista',
                routeName: 'dashboard.barista',
                url: '/dashboard/barista',
                icon: Coffee,
                roles: ['barista', 'supervisor'],
                activeMatch: (path, role, search) =>
                    (path === '/dashboard/barista' && !search.includes('tab=')) ||
                    (path === '/dashboard' && (role === 'barista' || role === 'supervisor')),
            },
            {
                label: 'Catat Pemakaian (FEFO)',
                routeName: 'dashboard.barista',
                url: '/dashboard/barista?tab=usage',
                tab: 'usage',
                icon: Flame,
                roles: ['barista', 'supervisor'],
                activeMatch: (path, _role, search) =>
                    path === '/dashboard/barista' &&
                    new URLSearchParams(search).get('tab') === 'usage',
            },
            {
                label: 'Penerimaan Batch',
                routeName: 'dashboard.barista',
                url: '/dashboard/barista?tab=batch',
                tab: 'batch',
                icon: PackagePlus,
                roles: ['barista', 'supervisor'],
                activeMatch: (path, _role, search) =>
                    path === '/dashboard/barista' &&
                    new URLSearchParams(search).get('tab') === 'batch',
            },
            {
                label: 'Lapor Bahan Rusak',
                routeName: 'dashboard.barista',
                url: '/dashboard/barista?tab=waste',
                tab: 'waste',
                icon: AlertTriangle,
                roles: ['barista', 'supervisor'],
                activeMatch: (path, _role, search) =>
                    path === '/dashboard/barista' &&
                    new URLSearchParams(search).get('tab') === 'waste',
            },
        ],
    },
    {
        title: 'MANAJEMEN INVENTARIS',
        roles: ['supervisor', 'owner'],
        items: [
            {
                label: 'Master Bahan & Kategori',
                routeName: 'ingredients.index',
                url: '/ingredients',
                icon: Boxes,
                roles: ['supervisor'],
            },
            {
                label: 'Monitoring & Kedaluwarsa',
                routeName: 'inventory.index',
                url: '/inventory',
                icon: CalendarClock,
                roles: ['supervisor', 'owner'],
            },
            {
                label: 'Approval Center (Waste)',
                routeName: 'waste.index',
                url: '/waste/approvals',
                icon: CheckSquare,
                roles: ['supervisor'],
            },
        ],
    },
    {
        title: 'EKSEKUTIF & LAPORAN',
        roles: ['owner'],
        items: [
            {
                label: 'Dasbor Eksekutif',
                routeName: 'dashboard.owner',
                url: '/dashboard/owner',
                icon: LayoutDashboard,
                roles: ['owner'],
                activeMatch: (path, role) =>
                    path === '/dashboard/owner' || (path === '/dashboard' && role === 'owner'),
            },
            {
                label: 'Laporan Finansial & Waste',
                routeName: 'reports.waste',
                url: '/reports/waste',
                icon: TrendingDown,
                roles: ['owner'],
            },
        ],
    },
];

export default function AuthenticatedLayout({
    header,
    children,
}: AuthenticatedLayoutProps) {
    const page = usePage();
    const user = page.props.auth.user as User;
    const flash = (page.props as Record<string, any>).flash as
        | { success?: string; error?: string; warning?: string }
        | undefined;

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown on outside click
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setUserDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Get 2 letter initials
    const initials = user?.name
        ? user.name
              .split(' ')
              .map((n) => n[0])
              .join('')
              .slice(0, 2)
              .toUpperCase()
        : 'BF';

    // Role-specific badge & metadata
    const getRoleMeta = (role: Role) => {
        switch (role) {
            case 'barista':
                return {
                    label: 'Barista Shift',
                    badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-300',
                    icon: Coffee,
                    widgetTitle: 'Shift Operasional: Aktif',
                    widgetSub: 'Bar Utama & Rotasi FEFO',
                    widgetIcon: Clock,
                };
            case 'supervisor':
                return {
                    label: 'Supervisor Gudang',
                    badgeClass: 'bg-[#FFF7ED] text-[#C88242] border-[#FED7AA]',
                    icon: ClipboardCheck,
                    widgetTitle: 'Gudang & Kontrol Mutu',
                    widgetSub: 'Supervisi & Otorisasi Waste',
                    widgetIcon: ShieldCheck,
                };
            case 'owner':
                return {
                    label: 'Owner Eksekutif',
                    badgeClass: 'bg-[#EDE4DC] text-content-high border-surface-border',
                    icon: BarChart3,
                    widgetTitle: 'Manajemen Finansial',
                    widgetSub: 'Akses Valuasi & Laba Rugi',
                    widgetIcon: BarChart3,
                };
            default:
                return {
                    label: 'Staff Kafe',
                    badgeClass: 'bg-surface-container text-content-high border-surface-border',
                    icon: Coffee,
                    widgetTitle: 'Sistem Terhubung',
                    widgetSub: 'Operasional Toko',
                    widgetIcon: Clock,
                };
        }
    };

    const roleMeta = getRoleMeta(user?.role || 'barista');
    const RoleIcon = roleMeta.icon;
    const WidgetIcon = roleMeta.widgetIcon;

    // Safe route resolution helper
    const resolveHref = (item: NavItem): string => {
        let baseUrl = item.url;
        try {
            if (typeof route === 'function' && route().has(item.routeName)) {
                baseUrl = route(item.routeName);
                if (item.tab) {
                    return `${baseUrl}?tab=${item.tab}`;
                }
            }
        } catch (e) {}
        return baseUrl;
    };

    // Safe active check
    const checkActive = (item: NavItem): boolean => {
        const rawUrl =
            page.url ||
            (typeof window !== 'undefined'
                ? `${window.location.pathname}${window.location.search}`
                : '');
        const [currentPath, queryString = ''] = rawUrl.split('?');
        const currentSearch = queryString ? `?${queryString}` : '';
        if (item.activeMatch) {
            return item.activeMatch(currentPath, user.role, currentSearch);
        }
        try {
            if (
                typeof route === 'function' &&
                route().has(item.routeName) &&
                route().current(item.routeName)
            ) {
                return true;
            }
        } catch (e) {}
        return currentPath === item.url;
    };

    // Safe profile & logout routes
    const profileHref = () => {
        try {
            if (typeof route === 'function' && route().has('profile.edit')) {
                return route('profile.edit');
            }
        } catch (e) {}
        return '/profile';
    };

    const logoutHref = () => {
        try {
            if (typeof route === 'function' && route().has('logout')) {
                return route('logout');
            }
        } catch (e) {}
        return '/logout';
    };

    const sidebarContent = (
        <aside className="flex h-full w-[260px] flex-shrink-0 flex-col justify-between border-r border-surface-border bg-surface-container shadow-[2px_0_12px_rgba(74,44,17,0.03)] select-none">
            {/* Top Brand & Navigation */}
            <div className="flex flex-col">
                {/* Brand & Monogram */}
                <div className="flex h-16 items-center gap-3 border-b border-surface-border px-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-primary text-white shadow-sm">
                        <Coffee className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col">
                        <div className="flex items-center gap-1.5">
                            <span className="text-lg font-bold tracking-tight text-brand-primary leading-none">
                                BeanFlow
                            </span>
                            <span className="rounded bg-surface-container-high px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-brand-primary">
                                FEFO
                            </span>
                        </div>
                        <span className="mt-0.5 text-[11px] font-medium text-content-subtle">
                            Specialty Coffee Inventory
                        </span>
                    </div>
                </div>

                {/* Navigation Menus with RBAC Filter */}
                <div className="space-y-4 px-3.5 py-5">
                    {NAVIGATION_GROUPS.filter((group) =>
                        group.roles.includes(user?.role || 'barista'),
                    ).map((group) => {
                        const visibleItems = group.items.filter((item) =>
                            item.roles.includes(user?.role || 'barista'),
                        );

                        if (visibleItems.length === 0) return null;

                        return (
                            <div key={group.title}>
                                <div className="px-2.5 pb-2 text-[10px] font-bold uppercase tracking-wider text-content-subtle">
                                    {group.title}
                                </div>
                                <nav className="space-y-1">
                                    {visibleItems.map((item) => {
                                        const ItemIcon = item.icon;
                                        const isActive = checkActive(item);

                                        return (
                                            <Link
                                                key={item.label}
                                                href={resolveHref(item)}
                                                onClick={() => setMobileMenuOpen(false)}
                                                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                                                    isActive
                                                        ? 'border border-surface-container-high/80 bg-surface-container-high font-semibold text-brand-primary shadow-[inset_0_1px_2px_rgba(74,44,17,0.06)]'
                                                        : 'text-content-medium hover:bg-surface-container-high/60 hover:text-brand-primary'
                                                }`}
                                            >
                                                <ItemIcon
                                                    className={`h-4 w-4 ${
                                                        isActive
                                                            ? 'text-brand-primary'
                                                            : 'text-content-medium'
                                                    }`}
                                                />
                                                <span className="truncate">
                                                    {item.label}
                                                </span>
                                                {isActive && (
                                                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-brand-primary" />
                                                )}
                                            </Link>
                                        );
                                    })}
                                </nav>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Bottom Widget: Role & Shift Context */}
            <div className="border-t border-surface-border p-3.5">
                <div className="flex items-center gap-3 rounded-xl border border-surface-border/70 bg-surface-container-high p-3 shadow-xs">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-surface-canvas text-brand-primary shadow-xs">
                        <WidgetIcon className="h-4 w-4" />
                    </div>
                    <div className="flex min-w-0 flex-col">
                        <span className="truncate text-[11px] font-bold leading-tight text-brand-primary">
                            {roleMeta.widgetTitle}
                        </span>
                        <span className="mt-0.5 flex items-center gap-1 text-[10px] text-content-medium">
                            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            {roleMeta.widgetSub}
                        </span>
                    </div>
                </div>
            </div>
        </aside>
    );

    return (
        <div className="flex h-screen overflow-hidden bg-surface-canvas text-content-high antialiased">
            {/* Desktop Left Sidebar (Fixed 260px) */}
            <div className="hidden lg:flex lg:flex-shrink-0">
                {sidebarContent}
            </div>

            {/* Mobile Sidebar Overlay / Drawer */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-50 flex lg:hidden">
                    <div
                        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
                        onClick={() => setMobileMenuOpen(false)}
                    />
                    <div className="relative z-50 flex h-full w-[260px]">
                        {sidebarContent}
                    </div>
                </div>
            )}

            {/* Right Main Container */}
            <div className="flex flex-1 flex-col h-screen min-w-0 overflow-hidden">
                {/* Sticky Top Header (64px) */}
                <header className="sticky top-0 z-20 flex h-16 flex-shrink-0 items-center justify-between border-b border-surface-border bg-surface-container/90 px-4 backdrop-blur-md sm:px-8">
                    {/* Left: Hamburger (mobile) & Title */}
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            aria-label="Buka menu navigasi"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="rounded-lg p-1.5 text-content-medium hover:bg-surface-container-high hover:text-brand-primary lg:hidden"
                        >
                            {mobileMenuOpen ? (
                                <X className="h-5 w-5" />
                            ) : (
                                <Menu className="h-5 w-5" />
                            )}
                        </button>

                        <div className="flex items-center gap-3">
                            {header ? (
                                <div className="text-lg font-bold tracking-tight text-content-high">
                                    {header}
                                </div>
                            ) : (
                                <h1 className="text-lg font-bold tracking-tight text-content-high">
                                    BeanFlow Operations
                                </h1>
                            )}
                            <div className="hidden h-4 w-px bg-surface-border sm:block" />
                            <span className="hidden text-xs font-medium text-content-subtle sm:inline-block">
                                Modul Inventaris & FEFO Bar
                            </span>
                        </div>
                    </div>

                    {/* Right: Sync Status, Role Capsule Badge, User Dropdown */}
                    <div className="flex items-center gap-3 sm:gap-4">
                        {/* Live Sync Status Indicator */}
                        <div className="hidden items-center gap-2 rounded-full border border-surface-border bg-surface-canvas px-2.5 py-1 text-xs font-medium text-content-medium sm:flex">
                            <span className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                            </span>
                            <span className="text-xs font-medium text-content-high">
                                Sistem Sinkron
                            </span>
                        </div>

                        {/* Role Capsule Badge */}
                        <div
                            className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold shadow-xs ${roleMeta.badgeClass}`}
                        >
                            <RoleIcon className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">{roleMeta.label}</span>
                        </div>

                        <div className="h-5 w-px bg-surface-border" />

                        {/* User Profile Dropdown */}
                        <div className="relative" ref={dropdownRef}>
                            <button
                                type="button"
                                aria-label="Menu profil pengguna"
                                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                                className="group flex cursor-pointer items-center gap-2.5 rounded-lg py-1 pl-1 transition-colors hover:opacity-95"
                            >
                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-primary text-xs font-bold text-white shadow-xs ring-2 ring-surface-border">
                                    {initials}
                                </div>
                                <div className="hidden flex-col text-left md:flex">
                                    <span className="text-xs font-semibold leading-tight text-content-high transition-colors group-hover:text-brand-primary">
                                        {user?.name || 'Pengguna Kafe'}
                                    </span>
                                    <span className="text-[10px] text-content-subtle capitalize">
                                        {user?.role || 'Staff'}
                                    </span>
                                </div>
                                <ChevronDown className="h-4 w-4 text-content-subtle transition-transform duration-150 group-hover:text-brand-primary" />
                            </button>

                            {/* Dropdown Menu Popup */}
                            {userDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-56 rounded-xl border border-surface-border bg-white p-1.5 shadow-lg animate-in fade-in zoom-in-95">
                                    <div className="border-b border-surface-border px-3 py-2">
                                        <p className="truncate text-xs font-bold text-content-high">
                                            {user?.name}
                                        </p>
                                        <p className="truncate text-[11px] text-content-subtle">
                                            {user?.email}
                                        </p>
                                    </div>

                                    <div className="py-1">
                                        <Link
                                            href={profileHref()}
                                            onClick={() => setUserDropdownOpen(false)}
                                            className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-content-medium hover:bg-surface-container hover:text-brand-primary"
                                        >
                                            <UserIcon className="h-4 w-4 text-content-subtle" />
                                            <span>Profil Pengguna</span>
                                        </Link>
                                    </div>

                                    <div className="border-t border-surface-border pt-1">
                                        <Link
                                            href={logoutHref()}
                                            method="post"
                                            as="button"
                                            onClick={() => setUserDropdownOpen(false)}
                                            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-medium text-brand-tertiary hover:bg-[#FDF2F0]"
                                        >
                                            <LogOut className="h-4 w-4" />
                                            <span>Keluar Sistem</span>
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Main Content Area: Latar #FAF7F2, Scrolling Independen */}
                <main className="flex flex-1 flex-col overflow-y-auto bg-surface-canvas p-4 sm:p-8 min-w-0">
                    {/* Flash Notifications */}
                    {flash?.success && (
                        <div className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-300 bg-emerald-50 p-4 text-xs font-medium text-emerald-800 shadow-xs">
                            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-700" />
                            <span>{flash.success}</span>
                        </div>
                    )}
                    {flash?.error && (
                        <div className="mb-4 flex items-center gap-2 rounded-xl border border-[#F8C6BF] bg-[#FDF2F0] p-4 text-xs font-medium text-[#8C3D2B] shadow-xs">
                            <AlertTriangle className="h-4 w-4 shrink-0 text-[#8C3D2B]" />
                            <span>{flash.error}</span>
                        </div>
                    )}
                    {flash?.warning && (
                        <div className="mb-4 flex items-center gap-2 rounded-xl border border-[#FED7AA] bg-[#FFF7ED] p-4 text-xs font-medium text-[#C88242] shadow-xs">
                            <AlertTriangle className="h-4 w-4 shrink-0 text-[#C88242]" />
                            <span>{flash.warning}</span>
                        </div>
                    )}

                    {/* Page Content Slot */}
                    <div className="flex-1 min-w-0">{children}</div>
                </main>
            </div>
        </div>
    );
}
