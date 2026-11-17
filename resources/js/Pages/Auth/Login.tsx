import InputError from '@/Components/InputError';
import { cn } from '@/lib/utils';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    ArrowRight,
    CheckCircle2,
    ClipboardCheck,
    Clock,
    Coffee,
    Eye,
    EyeOff,
    LineChart,
    Loader2,
    Lock,
    Mail,
    Package,
    ShieldCheck,
    Star,
    TrendingUp,
} from 'lucide-react';
import { FormEventHandler, useState } from 'react';

interface LoginProps {
    status?: string;
    canResetPassword?: boolean;
}

export default function Login({ status, canResetPassword = true }: LoginProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [activeRole, setActiveRole] = useState<'barista' | 'supervisor' | 'owner' | null>('barista');
    const [roleToast, setRoleToast] = useState<string | null>(
        'Kredensial demo aktif: Barista Bar Utama (barista@kafe.com)',
    );

    const { data, setData, post, processing, errors, reset } = useForm({
        email: 'barista@kafe.com',
        password: 'password',
        remember: true,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    const handleQuickRole = (
        email: string,
        pass: string,
        roleName: string,
        roleKey: 'barista' | 'supervisor' | 'owner',
    ) => {
        setData((prev) => ({
            ...prev,
            email,
            password: pass,
        }));
        setActiveRole(roleKey);
        setRoleToast(`Kredensial demo aktif: ${roleName} (${email})`);
    };

    return (
        <div className="min-h-screen bg-[#FAF7F2] text-[#241408] antialiased flex flex-col justify-between p-4 sm:p-6 lg:p-8">
            <Head title="Masuk ke Sistem Inventaris - BeanFlow" />

            <div className="w-full max-w-7xl mx-auto my-auto">
                <div className="w-full min-h-[calc(100vh-4rem)] flex flex-col lg:flex-row rounded-2xl overflow-hidden shadow-2xl bg-white border border-[#EDE4DC]">
                    {/* LEFT PANEL: Visual Storytelling & FEFO System Showcase (Warm Artisan Coffee / Deep Espresso Mocha) */}
                    <div className="w-full lg:w-5/12 bg-gradient-to-br from-[#2B1810] via-[#3E2316] to-[#1C0F0A] text-white p-6 sm:p-8 lg:p-12 flex flex-col justify-between relative overflow-hidden">
                        {/* Ambient Warm Glow Orbs */}
                        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-[#E5A65E]/15 blur-3xl pointer-events-none" />
                        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-[#C27D38]/20 blur-3xl pointer-events-none" />
                        <div className="absolute top-1/2 left-1/3 w-64 h-64 rounded-full bg-[#8B5013]/10 blur-2xl pointer-events-none" />

                        {/* Top Brand Badge */}
                        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-[#FED0A3] shadow-sm border border-white/15">
                                    <Coffee className="w-5 h-5 text-[#FED0A3]" />
                                </div>
                                <div>
                                    <span className="text-lg tracking-tight block text-white font-bold leading-none">
                                        BeanFlow
                                    </span>
                                    <span className="text-xs text-[#E5B58B] uppercase tracking-wider block mt-1 font-semibold">
                                        Cafe Ops System
                                    </span>
                                </div>
                            </div>
                            <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[#FED0A3] border border-[#FED0A3]/20 text-xs inline-flex items-center gap-2 shadow-sm font-medium">
                                <span className="w-2 h-2 rounded-full bg-[#E5A65E] animate-ping" />
                                v2.4 - FEFO Precision Core
                            </span>
                        </div>

                        {/* Center Hero & Precision FEFO Metrics */}
                        <div className="relative z-10 my-8 sm:my-10 space-y-6">
                            <div className="space-y-3">
                                <span className="px-3 py-1 rounded-md bg-[#FED0A3]/15 text-[#FED0A3] border border-[#FED0A3]/25 text-xs font-semibold uppercase tracking-wider inline-block">
                                    Manajemen Masa Simpan Spesialis
                                </span>
                                <h2 className="text-2xl sm:text-3xl lg:text-4xl text-white font-serif font-bold leading-tight tracking-tight">
                                    Preserve Freshness, Eliminate Waste.
                                </h2>
                                <p className="text-sm text-white/80 leading-relaxed max-w-md">
                                    Sistem cerdas manajemen stok bahan baku kafe dengan panduan FEFO (First-Expired,
                                    First-Out) otomatis untuk memangkas kerugian bahan basi hingga 84%.
                                </p>
                            </div>

                            {/* Metric Glass Cards */}
                            <div className="space-y-3 pt-2">
                                {/* Card 1: FEFO Compliance */}
                                <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 transition-all hover:bg-white/15 border border-white/10 shadow-sm">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-xs text-white/70 uppercase tracking-wider font-medium">
                                                Kepatuhan Rotasi Barista
                                            </p>
                                            <div className="flex items-baseline gap-2 mt-1">
                                                <span className="text-2xl font-bold text-white">99.2%</span>
                                                <span className="text-xs text-[#FED0A3] flex items-center font-semibold">
                                                    <TrendingUp className="w-3.5 h-3.5 mr-0.5 inline" /> +4.1%
                                                </span>
                                            </div>
                                        </div>
                                        <div className="w-16 h-8 flex items-end gap-1">
                                            <div className="w-2.5 bg-[#E5A65E]/40 h-3 rounded-t-sm" />
                                            <div className="w-2.5 bg-[#E5A65E]/60 h-4.5 rounded-t-sm" />
                                            <div className="w-2.5 bg-[#E5A65E]/80 h-6 rounded-t-sm" />
                                            <div className="w-2.5 bg-[#E5A65E] h-7 rounded-t-sm" />
                                            <div className="w-2.5 bg-[#FED0A3] h-8 rounded-t-sm" />
                                        </div>
                                    </div>
                                </div>

                                {/* Card 2: Waste Prevention */}
                                <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 transition-all hover:bg-white/15 border border-white/10 shadow-sm">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-xs text-white/70 uppercase tracking-wider font-medium">
                                                Penyusutan Susu &amp; Sirup Pekan Ini
                                            </p>
                                            <div className="flex items-baseline gap-2 mt-1">
                                                <span className="text-2xl font-bold text-white">Rp 0</span>
                                                <span className="text-xs text-white/80 font-medium">Nol Kerugian</span>
                                            </div>
                                        </div>
                                        <span className="px-2.5 py-1 rounded-full bg-[#E5A65E]/20 text-[#FED0A3] border border-[#FED0A3]/25 text-xs font-medium flex items-center gap-1.5">
                                            <ShieldCheck className="w-3.5 h-3.5" /> Terproteksi
                                        </span>
                                    </div>
                                </div>

                                {/* Alert Indicator */}
                                <div className="bg-[#4A2C11]/60 backdrop-blur-md rounded-xl p-3 flex items-center gap-3 border border-[#E5A65E]/25">
                                    <Clock className="w-5 h-5 text-[#FED0A3] flex-shrink-0" />
                                    <p className="text-xs text-white/90 leading-snug">
                                        <span className="font-semibold text-[#FED0A3]">3 Batch Fresh Milk</span> siap pakai
                                        hari ini sebelum pk 18:00 WIB
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Left Bottom Info & Trust Social Proof */}
                        <div className="relative z-10 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-white/10">
                            <div>
                                <p className="text-xs text-white/75 font-normal">
                                    Dipercaya oleh 45+ specialty roastery &amp; kafe multi-cabang
                                </p>
                                <div className="flex items-center gap-1 mt-1 text-[#FEB06B]">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="w-3.5 h-3.5 fill-[#FEB06B]" />
                                    ))}
                                    <span className="text-xs text-white ml-1 font-semibold">4.9 / 5.0</span>
                                </div>
                            </div>
                            <div className="flex items-center -space-x-2">
                                <div className="w-8 h-8 rounded-full bg-[#5C3826] text-[#FED0A3] text-xs flex items-center justify-center ring-2 ring-[#3E2316] font-bold">
                                    JK
                                </div>
                                <div className="w-8 h-8 rounded-full bg-[#8B5013] text-[#FFDCC2] text-xs flex items-center justify-center ring-2 ring-[#3E2316] font-bold">
                                    AR
                                </div>
                                <div className="w-8 h-8 rounded-full bg-[#4A2C11] text-[#E5B58B] text-xs flex items-center justify-center ring-2 ring-[#3E2316] font-bold">
                                    DS
                                </div>
                                <div className="w-8 h-8 rounded-full bg-[#2B1810] text-[#FED0A3] text-xs flex items-center justify-center ring-2 ring-[#3E2316] font-bold">
                                    +42
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT PANEL: Authentication Form & Quick-Demo Switcher (Warm Cream / Latte Finish) */}
                    <div className="w-full lg:w-7/12 bg-[#F8F2EE] flex items-center justify-center p-6 sm:p-8 lg:p-12">
                        <div className="max-w-md w-full bg-white rounded-2xl shadow-sm p-6 sm:p-8 space-y-6 border border-[#EDE4DC]">
                            {/* Header Content */}
                            <div className="space-y-2">
                                <div className="w-10 h-10 rounded-xl bg-[#F5EFEB] flex items-center justify-center text-[#8B5013] border border-[#EDE4DC]">
                                    <Package className="w-5 h-5 text-[#8B5013]" />
                                </div>
                                <div>
                                    <h1 className="text-xl sm:text-2xl font-bold text-[#241408] tracking-tight">
                                        Masuk ke Sistem Inventaris
                                    </h1>
                                    <p className="text-sm text-[#5C3A21] mt-0.5">
                                        Kelola masa simpan bahan baku kafe secara presisi
                                    </p>
                                </div>
                            </div>

                            {/* Status Message from Backend */}
                            {status && (
                                <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-sm text-emerald-800 flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                                    <span>{status}</span>
                                </div>
                            )}

                            {/* Feedback Toast for Role Auto-Fill */}
                            {roleToast && (
                                <div className="rounded-xl bg-[#F5EFEB] border border-[#C88242]/30 p-3 text-xs text-[#5C3A21] flex items-center gap-2 transition-all">
                                    <CheckCircle2 className="w-4 h-4 text-[#C88242] flex-shrink-0" />
                                    <span className="font-medium text-[#241408]">{roleToast}</span>
                                </div>
                            )}

                            {/* Form Authentication */}
                            <form className="space-y-4" onSubmit={submit}>
                                {/* Email Input */}
                                <div className="space-y-1.5">
                                    <div className="flex justify-between items-center text-xs font-semibold text-[#241408]">
                                        <label htmlFor="emailInput">Alamat Email</label>
                                        <span className="text-[#9C8474] font-normal">Akun Terminal Toko</span>
                                    </div>
                                    <div className="relative">
                                        <Mail className="w-4 h-4 text-[#9C8474] absolute left-3 top-3 pointer-events-none" />
                                        <input
                                            id="emailInput"
                                            type="email"
                                            name="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            placeholder="nama@kafe.com"
                                            required
                                            autoComplete="username"
                                            className="w-full bg-white text-[#241408] rounded-xl pl-9 pr-3 py-2.5 text-sm border border-[#EDE4DC] placeholder:text-[#9C8474]/60 focus:outline-none focus:ring-2 focus:ring-[#C88242]/50 focus:border-[#C88242] transition-colors shadow-sm"
                                        />
                                    </div>
                                    <InputError message={errors.email} className="mt-1 text-xs text-red-600" />
                                </div>

                                {/* Password Input */}
                                <div className="space-y-1.5">
                                    <div className="flex justify-between items-center text-xs">
                                        <label htmlFor="passwordInput" className="font-semibold text-[#241408]">
                                            Kata Sandi
                                        </label>
                                        {canResetPassword && (
                                            <Link
                                                href={route('password.request')}
                                                className="text-xs font-medium text-[#8B5013] hover:text-[#4A2C11] transition-colors"
                                            >
                                                Lupa kata sandi?
                                            </Link>
                                        )}
                                    </div>
                                    <div className="relative">
                                        <Lock className="w-4 h-4 text-[#9C8474] absolute left-3 top-3 pointer-events-none" />
                                        <input
                                            id="passwordInput"
                                            type={showPassword ? 'text' : 'password'}
                                            name="password"
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            placeholder="••••••••"
                                            required
                                            autoComplete="current-password"
                                            className="w-full bg-white text-[#241408] rounded-xl pl-9 pr-10 py-2.5 text-sm border border-[#EDE4DC] placeholder:text-[#9C8474]/60 focus:outline-none focus:ring-2 focus:ring-[#C88242]/50 focus:border-[#C88242] transition-colors shadow-sm"
                                        />
                                        <button
                                            type="button"
                                            aria-label={showPassword ? 'Sembunyikan sandi' : 'Tampilkan sandi'}
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-2.5 text-[#9C8474] hover:text-[#241408] p-0.5 rounded transition-colors"
                                        >
                                            {showPassword ? (
                                                <EyeOff className="w-4 h-4" />
                                            ) : (
                                                <Eye className="w-4 h-4" />
                                            )}
                                        </button>
                                    </div>
                                    <InputError message={errors.password} className="mt-1 text-xs text-red-600" />
                                </div>

                                {/* Checkbox Terminal */}
                                <div className="flex items-center gap-2 pt-1">
                                    <input
                                        id="rememberDevice"
                                        type="checkbox"
                                        name="remember"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                        className="w-4 h-4 rounded text-[#8B5013] accent-[#8B5013] cursor-pointer focus:ring-[#8B5013] border-[#EDE4DC]"
                                    />
                                    <label
                                        htmlFor="rememberDevice"
                                        className="text-xs text-[#5C3A21] cursor-pointer select-none"
                                    >
                                        Ingat sesi selama 30 hari di terminal bar ini
                                    </label>
                                </div>

                                {/* Submit Button (Coffee Brown) */}
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full bg-[#4A2C11] hover:bg-[#38210D] active:scale-[0.99] text-[#FFF6EE] font-semibold text-sm py-2.5 px-4 rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all disabled:opacity-75 disabled:cursor-not-allowed"
                                >
                                    {processing ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin text-[#FFF6EE]" />
                                            <span>Memverifikasi Akses FEFO...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Masuk ke Sistem</span>
                                            <ArrowRight className="w-4 h-4" />
                                        </>
                                    )}
                                </button>
                            </form>

                            {/* Divider with Label */}
                            <div className="relative flex items-center justify-center my-6">
                                <div className="w-full h-px bg-[#EDE4DC]" />
                                <span className="absolute bg-white px-3 text-[11px] font-bold uppercase tracking-wider text-[#9C8474] shadow-sm rounded-full py-0.5 border border-[#EDE4DC]">
                                    Akun Demo Uji Coba (1-Klik)
                                </span>
                            </div>

                            {/* 1-Click Role Quick Buttons */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                                {/* Role 1: Barista */}
                                <button
                                    type="button"
                                    onClick={() =>
                                        handleQuickRole('barista@kafe.com', 'password', 'Barista Bar Utama', 'barista')
                                    }
                                    className={cn(
                                        'text-left p-3 rounded-xl bg-[#F5EFEB] hover:bg-[#EDE4DC] transition-all flex flex-col justify-between group active:scale-95 border shadow-sm',
                                        activeRole === 'barista'
                                            ? 'border-[#8B5013] ring-1 ring-[#8B5013] bg-[#F5EFEB]'
                                            : 'border-[#EDE4DC]',
                                    )}
                                >
                                    <div>
                                        <div className="flex items-center justify-between mb-1.5">
                                            <Coffee className="w-4 h-4 text-[#8B5013]" />
                                            <span className="text-[10px] text-[#8B5013] bg-white border border-[#EDE4DC] px-1.5 py-0.5 rounded font-semibold">
                                                Aktif
                                            </span>
                                        </div>
                                        <h3 className="text-sm font-bold text-[#241408]">Barista</h3>
                                        <p className="text-[11px] text-[#5C3A21] truncate">barista@kafe.com</p>
                                    </div>
                                    <div className="mt-2 pt-2 border-t border-[#EDE4DC] flex items-center justify-between">
                                        <span className="text-[10px] text-[#9C8474] font-medium">Akses Bar &amp; FEFO</span>
                                    </div>
                                </button>

                                {/* Role 2: Supervisor */}
                                <button
                                    type="button"
                                    onClick={() =>
                                        handleQuickRole(
                                            'supervisor@kafe.com',
                                            'password',
                                            'Supervisor Operasional',
                                            'supervisor',
                                        )
                                    }
                                    className={cn(
                                        'text-left p-3 rounded-xl bg-[#F5EFEB] hover:bg-[#EDE4DC] transition-all flex flex-col justify-between group active:scale-95 border shadow-sm',
                                        activeRole === 'supervisor'
                                            ? 'border-[#8B5013] ring-1 ring-[#8B5013] bg-[#F5EFEB]'
                                            : 'border-[#EDE4DC]',
                                    )}
                                >
                                    <div>
                                        <div className="flex items-center justify-between mb-1.5">
                                            <ClipboardCheck className="w-4 h-4 text-[#784102]" />
                                            <span className="text-[10px] text-[#784102] bg-white border border-[#EDE4DC] px-1.5 py-0.5 rounded font-semibold">
                                                Gudang
                                            </span>
                                        </div>
                                        <h3 className="text-sm font-bold text-[#241408]">Supervisor</h3>
                                        <p className="text-[11px] text-[#5C3A21] truncate">supervisor@kafe.com</p>
                                    </div>
                                    <div className="mt-2 pt-2 border-t border-[#EDE4DC] flex items-center justify-between">
                                        <span className="text-[10px] text-[#9C8474] font-medium">Audit &amp; Approval</span>
                                    </div>
                                </button>

                                {/* Role 3: Owner */}
                                <button
                                    type="button"
                                    onClick={() =>
                                        handleQuickRole('owner@kafe.com', 'password', 'Owner & Manajemen', 'owner')
                                    }
                                    className={cn(
                                        'text-left p-3 rounded-xl bg-[#F5EFEB] hover:bg-[#EDE4DC] transition-all flex flex-col justify-between group active:scale-95 border shadow-sm',
                                        activeRole === 'owner'
                                            ? 'border-[#8B5013] ring-1 ring-[#8B5013] bg-[#F5EFEB]'
                                            : 'border-[#EDE4DC]',
                                    )}
                                >
                                    <div>
                                        <div className="flex items-center justify-between mb-1.5">
                                            <LineChart className="w-4 h-4 text-[#311701]" />
                                            <span className="text-[10px] text-[#311701] bg-white border border-[#EDE4DC] px-1.5 py-0.5 rounded font-semibold">
                                                Keuangan
                                            </span>
                                        </div>
                                        <h3 className="text-sm font-bold text-[#241408]">Owner</h3>
                                        <p className="text-[11px] text-[#5C3A21] truncate">owner@kafe.com</p>
                                    </div>
                                    <div className="mt-2 pt-2 border-t border-[#EDE4DC] flex items-center justify-between">
                                        <span className="text-[10px] text-[#9C8474] font-medium">Laba Rugi &amp; Aset</span>
                                    </div>
                                </button>
                            </div>

                            {/* Security & Hardware Integration Footer Badge */}
                            <div className="pt-2 text-center flex flex-col items-center gap-1.5 text-[#5C3A21]">
                                <div className="flex items-center justify-center gap-1.5 text-xs text-[#5C3A21]">
                                    <ShieldCheck className="w-3.5 h-3.5 text-[#8B5013]" />
                                    <span>Terenkripsi SSL 256-bit • Terintegrasi POS Terminal &amp; Chiller IoT</span>
                                </div>
                                <p className="text-[11px] text-[#9C8474]">
                                    Sistem Operasional Inventaris Kafe • Dukungan Multi-Outlet Ready
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
