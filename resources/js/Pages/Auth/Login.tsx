import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    ArrowRight,
    BarChart3,
    CheckCircle2,
    ClipboardCheck,
    Clock,
    Coffee,
    Eye,
    EyeOff,
    Loader2,
    Lock,
    Mail,
    ShieldCheck,
    Star,
    TrendingUp,
} from 'lucide-react';
import { FormEventHandler, useState } from 'react';

interface LoginPageProps {
    status?: string;
    canResetPassword?: boolean;
}

interface DemoAccount {
    role: 'barista' | 'supervisor' | 'owner';
    title: string;
    email: string;
    badge: string;
    desc: string;
    icon: typeof Coffee;
    badgeColor: string;
    targetRoute: string;
}

const DEMO_ACCOUNTS: DemoAccount[] = [
    {
        role: 'barista',
        title: 'Barista',
        email: 'barista@kafe.com',
        badge: 'Aktif',
        desc: 'Akses Bar & FEFO',
        icon: Coffee,
        badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-300',
        targetRoute: 'Operasional Bar & FEFO',
    },
    {
        role: 'supervisor',
        title: 'Supervisor',
        email: 'supervisor@kafe.com',
        badge: 'Gudang',
        desc: 'Audit & Approval',
        icon: ClipboardCheck,
        badgeColor: 'bg-[#FFF7ED] text-[#C88242] border-[#FED7AA]',
        targetRoute: 'Gudang & Approval Waste',
    },
    {
        role: 'owner',
        title: 'Owner',
        email: 'owner@kafe.com',
        badge: 'Keuangan',
        desc: 'Laba Rugi & Aset',
        icon: BarChart3,
        badgeColor: 'bg-[#EDE4DC] text-content-high border-surface-border',
        targetRoute: 'Eksekutif & Valuasi Aset',
    },
];

export default function Login({ status, canResetPassword }: LoginPageProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: 'barista@kafe.com',
        password: 'password',
        remember: true,
    });

    const [showPassword, setShowPassword] = useState(false);
    const [demoFeedback, setDemoFeedback] = useState<string | null>(null);
    const [selectedRole, setSelectedRole] = useState<string | null>('barista');

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    const handleQuickLogin = (account: DemoAccount) => {
        setSelectedRole(account.role);
        setData({
            email: account.email,
            password: 'password',
            remember: true,
        });
        setDemoFeedback(`Kredensial demo aktif: ${account.title} (${account.email})`);

        post(route('login'), {
            data: {
                email: account.email,
                password: 'password',
                remember: true,
            },
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout fullWidth>
            <Head title="Masuk ke Sistem Inventaris - BeanFlow" />

            <main className="flex min-h-screen w-full flex-col justify-between bg-surface-canvas p-4 md:p-8">
                <div className="flex w-full flex-col">
                    <div className="flex min-h-[calc(100vh-4rem)] w-full flex-col overflow-hidden rounded-2xl border border-surface-border bg-white shadow-xl lg:flex-row">
                        {/* LEFT PANEL: Visual Storytelling & FEFO System Showcase (Warm Artisan Coffee / Deep Espresso) */}
                        <div className="relative flex w-full flex-col justify-between overflow-hidden bg-gradient-to-br from-[#2B1810] via-[#3E2316] to-[#1C0F0A] p-8 text-white lg:w-5/12 lg:p-12">
                            {/* Ambient Warm Glow */}
                            <div className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full bg-[#E5A65E]/15 blur-3xl" />
                            <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-[#C27D38]/20 blur-3xl" />
                            <div className="pointer-events-none absolute left-1/3 top-1/2 h-64 w-64 rounded-full bg-[#8B5013]/10 blur-2xl" />

                            {/* Top Brand Badge */}
                            <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/15 shadow-sm backdrop-blur-md">
                                        <Coffee className="h-5 w-5 text-[#FED0A3]" />
                                    </div>
                                    <div>
                                        <span className="block font-bold tracking-tight text-white">
                                            BeanFlow
                                        </span>
                                        <span className="block text-[11px] font-semibold uppercase tracking-wider text-[#E5B58B]">
                                            Cafe Ops System
                                        </span>
                                    </div>
                                </div>
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#FED0A3]/20 bg-white/10 px-3 py-1 text-xs font-medium text-[#FED0A3] shadow-sm backdrop-blur-md">
                                    <span className="h-2 w-2 animate-ping rounded-full bg-[#E5A65E]" />
                                    v2.4 • FEFO Precision Core
                                </span>
                            </div>

                            {/* Center Hero & Precision FEFO Metrics */}
                            <div className="relative z-10 my-8 space-y-6">
                                <div className="space-y-3">
                                    <span className="inline-block rounded-md border border-[#FED0A3]/25 bg-[#FED0A3]/15 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#FED0A3]">
                                        Manajemen Masa Simpan Spesialis
                                    </span>
                                    <h2 className="text-3xl font-bold leading-tight tracking-tight text-white md:text-4xl">
                                        Preserve Freshness, Eliminate Waste.
                                    </h2>
                                    <p className="max-w-md text-sm leading-relaxed text-white/85">
                                        Sistem cerdas manajemen stok bahan baku kafe dengan panduan FEFO (First-Expired, First-Out) otomatis untuk memangkas kerugian bahan basi hingga 84%.
                                    </p>
                                </div>

                                {/* Metric Glass Cards */}
                                <div className="space-y-3 pt-2">
                                    {/* Card 1: FEFO Compliance */}
                                    <div className="rounded-xl border border-white/10 bg-white/10 p-4 backdrop-blur-md transition-all hover:bg-white/15">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-xs uppercase tracking-wide text-white/70">
                                                    Kepatuhan Rotasi Barista
                                                </p>
                                                <div className="mt-0.5 flex items-baseline gap-2">
                                                    <span className="text-2xl font-bold text-white">
                                                        99.2%
                                                    </span>
                                                    <span className="flex items-center text-xs font-semibold text-[#FED0A3]">
                                                        <TrendingUp className="mr-0.5 h-3.5 w-3.5" /> +4.1%
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex h-8 w-16 items-end gap-1">
                                                <div className="h-3 w-2.5 rounded-t-sm bg-[#E5A65E]/40" />
                                                <div className="h-4.5 w-2.5 rounded-t-sm bg-[#E5A65E]/60" />
                                                <div className="h-6 w-2.5 rounded-t-sm bg-[#E5A65E]/80" />
                                                <div className="h-7 w-2.5 rounded-t-sm bg-[#E5A65E]" />
                                                <div className="h-8 w-2.5 rounded-t-sm bg-[#FED0A3]" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Card 2: Waste Prevention */}
                                    <div className="rounded-xl border border-white/10 bg-white/10 p-4 backdrop-blur-md transition-all hover:bg-white/15">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-xs uppercase tracking-wide text-white/70">
                                                    Penyusutan Susu & Sirup Pekan Ini
                                                </p>
                                                <div className="mt-0.5 flex items-baseline gap-2">
                                                    <span className="text-2xl font-bold text-white">
                                                        Rp 0
                                                    </span>
                                                    <span className="text-xs text-white/80">
                                                        (Nol Kerugian)
                                                    </span>
                                                </div>
                                            </div>
                                            <span className="inline-flex items-center gap-1 rounded-full border border-[#FED0A3]/25 bg-[#E5A65E]/20 px-2.5 py-1 text-xs font-medium text-[#FED0A3]">
                                                <CheckCircle2 className="h-3.5 w-3.5" /> Terproteksi
                                            </span>
                                        </div>
                                    </div>

                                    {/* Alert Indicator */}
                                    <div className="flex items-center gap-3 rounded-lg border border-[#E5A65E]/20 bg-[#4A2C11]/60 p-3 backdrop-blur-md">
                                        <Clock className="h-4 w-4 shrink-0 text-[#FED0A3]" />
                                        <p className="text-xs text-white/90">
                                            <span className="font-semibold text-[#FED0A3]">
                                                3 Batch Fresh Milk
                                            </span>{' '}
                                            siap pakai hari ini sebelum pk 18:00 WIB
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Left Bottom Info & Trust Social Proof */}
                            <div className="relative z-10 flex flex-col justify-between gap-4 pt-4 sm:flex-row sm:items-center">
                                <div>
                                    <p className="text-xs text-white/75">
                                        Dipercaya oleh 45+ specialty roastery & kafe multi-cabang
                                    </p>
                                    <div className="mt-1 flex items-center gap-1 text-[#FEB06B]">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className="h-3.5 w-3.5 fill-current" />
                                        ))}
                                        <span className="ml-1 text-xs font-semibold text-white">
                                            4.9 / 5.0
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center -space-x-2">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#5C3826] text-xs font-bold text-[#FED0A3] ring-2 ring-[#3E2316]">
                                        JK
                                    </div>
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#8B5013] text-xs font-bold text-[#FFDCC2] ring-2 ring-[#3E2316]">
                                        AR
                                    </div>
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#4A2C11] text-xs font-bold text-[#E5B58B] ring-2 ring-[#3E2316]">
                                        DS
                                    </div>
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2B1810] text-[10px] font-bold text-[#FED0A3] ring-2 ring-[#3E2316]">
                                        +42
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT PANEL: Authentication Form & Quick-Demo Switcher (Warm Cream / Latte Finish) */}
                        <div className="flex w-full items-center justify-center bg-surface-canvas p-6 lg:w-7/12 lg:p-12">
                            <div className="w-full max-w-md space-y-6 rounded-2xl border border-surface-border bg-white p-6 shadow-sm sm:p-8">
                                {/* Header Content */}
                                <div className="space-y-2">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-surface-border bg-surface-container text-brand-primary">
                                        <Coffee className="h-6 w-6 text-brand-primary" />
                                    </div>
                                    <div>
                                        <h1 className="text-xl font-bold tracking-tight text-content-high">
                                            Masuk ke Sistem Inventaris
                                        </h1>
                                        <p className="text-sm text-content-medium">
                                            Kelola masa simpan bahan baku kafe secara presisi
                                        </p>
                                    </div>
                                </div>

                                {/* Status Messages */}
                                {status && (
                                    <div className="rounded-lg border border-emerald-300 bg-emerald-50 p-3 text-sm font-medium text-emerald-800">
                                        {status}
                                    </div>
                                )}

                                {/* Feedback Toast for Role Auto-Fill */}
                                {demoFeedback && (
                                    <div className="flex items-center gap-2 rounded-lg border border-surface-border bg-surface-container p-3 text-xs font-medium text-content-high transition-all">
                                        <CheckCircle2 className="h-4 w-4 shrink-0 text-brand-secondary" />
                                        <span>{demoFeedback}</span>
                                    </div>
                                )}

                                {/* Form Authentication */}
                                <form onSubmit={submit} className="space-y-4">
                                    {/* Email Input */}
                                    <div className="space-y-1.5">
                                        <div className="flex items-center justify-between">
                                            <label
                                                htmlFor="email"
                                                className="text-xs font-semibold text-content-high"
                                            >
                                                Alamat Email
                                            </label>
                                            <span className="text-[11px] text-content-subtle">
                                                Akun Terminal Toko
                                            </span>
                                        </div>
                                        <div className="relative">
                                            <Mail className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-content-subtle" />
                                            <input
                                                id="email"
                                                type="email"
                                                name="email"
                                                value={data.email}
                                                readOnly={processing}
                                                placeholder="nama@kafe.com"
                                                autoComplete="username"
                                                required
                                                onChange={(e) => setData('email', e.target.value)}
                                                className={`w-full rounded-lg border py-2.5 pl-9 pr-3 text-sm text-content-high placeholder:text-content-subtle/60 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 ${
                                                    errors.email
                                                        ? 'border-brand-tertiary focus:border-brand-tertiary focus:ring-brand-tertiary/20'
                                                        : 'border-surface-border bg-white focus:border-brand-primary'
                                                }`}
                                            />
                                        </div>
                                        {errors.email && (
                                            <p className="mt-1 text-xs text-brand-tertiary">
                                                {errors.email}
                                            </p>
                                        )}
                                    </div>

                                    {/* Password Input */}
                                    <div className="space-y-1.5">
                                        <div className="flex items-center justify-between">
                                            <label
                                                htmlFor="password"
                                                className="text-xs font-semibold text-content-high"
                                            >
                                                Kata Sandi
                                            </label>
                                            {canResetPassword && (
                                                <Link
                                                    href={route('password.request')}
                                                    className="text-xs font-semibold text-brand-secondary hover:text-brand-primary hover:underline"
                                                >
                                                    Lupa kata sandi?
                                                </Link>
                                            )}
                                        </div>
                                        <div className="relative">
                                            <Lock className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-content-subtle" />
                                            <input
                                                id="password"
                                                type={showPassword ? 'text' : 'password'}
                                                name="password"
                                                value={data.password}
                                                readOnly={processing}
                                                placeholder="••••••••"
                                                autoComplete="current-password"
                                                required
                                                onChange={(e) => setData('password', e.target.value)}
                                                className={`w-full rounded-lg border py-2.5 pl-9 pr-10 text-sm text-content-high placeholder:text-content-subtle/60 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 ${
                                                    errors.password
                                                        ? 'border-brand-tertiary focus:border-brand-tertiary focus:ring-brand-tertiary/20'
                                                        : 'border-surface-border bg-white focus:border-brand-primary'
                                                }`}
                                            />
                                            <button
                                                type="button"
                                                aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-2.5 top-2.5 text-content-subtle hover:text-content-high"
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="h-4 w-4" />
                                                ) : (
                                                    <Eye className="h-4 w-4" />
                                                )}
                                            </button>
                                        </div>
                                        {errors.password && (
                                            <p className="mt-1 text-xs text-brand-tertiary">
                                                {errors.password}
                                            </p>
                                        )}
                                    </div>

                                    {/* Remember Checkbox */}
                                    <div className="flex items-center gap-2 pt-1">
                                        <input
                                            id="remember"
                                            type="checkbox"
                                            name="remember"
                                            checked={data.remember}
                                            onChange={(e) => setData('remember', e.target.checked)}
                                            className="h-4 w-4 rounded border-surface-border text-brand-primary focus:ring-brand-primary"
                                        />
                                        <label
                                            htmlFor="remember"
                                            className="cursor-pointer text-xs text-content-medium"
                                        >
                                            Ingat sesi selama 30 hari di terminal bar ini
                                        </label>
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-primary py-2.5 px-4 text-sm font-semibold text-white shadow-sm transition-all hover:bg-brand-primary-hover active:scale-[0.99] disabled:opacity-70"
                                    >
                                        {processing ? (
                                            <>
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                <span>Memverifikasi Akses FEFO...</span>
                                            </>
                                        ) : (
                                            <>
                                                <span>Masuk ke Sistem</span>
                                                <ArrowRight className="h-4 w-4" />
                                            </>
                                        )}
                                    </button>
                                </form>

                                {/* Divider */}
                                <div className="relative my-6 flex items-center justify-center">
                                    <div className="w-full border-t border-surface-border" />
                                    <span className="absolute rounded-full border border-surface-border bg-white px-3 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-content-subtle shadow-xs">
                                        Akun Demo Uji Coba (1-Klik)
                                    </span>
                                </div>

                                {/* 1-Click Role Quick Buttons */}
                                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                                    {DEMO_ACCOUNTS.map((account) => {
                                        const IconComponent = account.icon;
                                        const isSelected = selectedRole === account.role;

                                        return (
                                            <button
                                                key={account.role}
                                                type="button"
                                                disabled={processing}
                                                onClick={() => handleQuickLogin(account)}
                                                className={`group flex flex-col justify-between rounded-xl border p-3 text-left shadow-xs transition-all active:scale-95 disabled:pointer-events-none disabled:opacity-60 ${
                                                    isSelected
                                                        ? 'border-brand-secondary bg-surface-container ring-1 ring-brand-secondary'
                                                        : 'border-surface-border bg-surface-container/60 hover:bg-surface-container'
                                                }`}
                                            >
                                                <div>
                                                    <div className="mb-1.5 flex items-center justify-between">
                                                        <IconComponent className="h-4 w-4 text-brand-secondary" />
                                                        <span
                                                            className={`rounded border px-1.5 py-0.5 text-[10px] font-semibold ${account.badgeColor}`}
                                                        >
                                                            {account.badge}
                                                        </span>
                                                    </div>
                                                    <h3 className="text-sm font-bold text-content-high">
                                                        {account.title}
                                                    </h3>
                                                    <p className="truncate text-[11px] text-content-subtle">
                                                        {account.email}
                                                    </p>
                                                </div>
                                                <div className="mt-2 flex items-center justify-between border-t border-surface-border pt-1.5">
                                                    <span className="text-[10px] font-medium text-content-medium">
                                                        {account.desc}
                                                    </span>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Security & Trust Footer */}
                                <div className="space-y-1 pt-2 text-center text-content-subtle">
                                    <div className="flex items-center justify-center gap-1.5 text-xs">
                                        <ShieldCheck className="h-4 w-4 text-brand-secondary" />
                                        <span>
                                            Terenkripsi SSL 256-bit • Terintegrasi POS Terminal & Chiller IoT
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-content-subtle/80">
                                        Sistem Operasional Inventaris Kafe • Dukungan Multi-Outlet Ready
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </GuestLayout>
    );
}
