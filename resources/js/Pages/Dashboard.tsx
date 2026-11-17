import AppLayout from '@/Layouts/AppLayout';
import ExpiryBadge from '@/Components/ExpiryBadge';
import { PageProps } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    Boxes,
    CalendarClock,
    Clock,
    Coffee,
    Flame,
    LineChart,
    ShieldCheck,
    Sparkles,
} from 'lucide-react';

export default function Dashboard() {
    const { auth } = usePage<PageProps>().props;
    const user = auth.user;

    return (
        <AppLayout
            title="Dasbor Operasional - BeanFlow"
            header={
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs uppercase tracking-wider font-bold text-[#8B5013]">
                                Pusat Operasional
                            </span>
                            <span className="text-xs text-[#9C8474]">•</span>
                            <span className="text-xs text-[#9C8474]">Masa Simpan FEFO</span>
                        </div>
                        <h1 className="text-2xl font-bold text-[#241408] tracking-tight mt-0.5">
                            Selamat Datang, {user.name}
                        </h1>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            Sistem FEFO Aktif
                        </span>
                    </div>
                </div>
            }
        >
            <Head title="Dasbor Inventaris" />

            <div className="space-y-6">
                {/* HERO STATS OVERVIEW */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Card 1: FEFO Compliance */}
                    <div className="bg-white rounded-2xl p-5 border border-[#EDE4DC] shadow-xs flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold text-[#9C8474] uppercase tracking-wider">
                                Kepatuhan Rotasi Bar
                            </p>
                            <h3 className="text-2xl font-bold text-[#241408] mt-1">99.2%</h3>
                            <div className="mt-1">
                                <ExpiryBadge isFefoRecommended size="sm" label="FEFO Aktif (100% Kepatuhan)" />
                            </div>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-[#FAF7F2] border border-[#EDE4DC] flex items-center justify-center text-[#8B5013]">
                            <Coffee className="w-6 h-6" />
                        </div>
                    </div>

                    {/* Card 2: Waste Prevention */}
                    <div className="bg-white rounded-2xl p-5 border border-[#EDE4DC] shadow-xs flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold text-[#9C8474] uppercase tracking-wider">
                                Sisa Bahan Kritis
                            </p>
                            <h3 className="text-2xl font-bold text-[#8C3D2B] mt-1">2 Batch</h3>
                            <div className="mt-1">
                                <ExpiryBadge daysLeft={1} size="sm" />
                            </div>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-[#FDF2F0] border border-[#F8C6BF] flex items-center justify-center text-[#8C3D2B]">
                            <CalendarClock className="w-6 h-6" />
                        </div>
                    </div>

                    {/* Card 3: Financial Shield */}
                    <div className="bg-white rounded-2xl p-5 border border-[#EDE4DC] shadow-xs flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold text-[#9C8474] uppercase tracking-wider">
                                Estimasi Aset Bahan
                            </p>
                            <h3 className="text-2xl font-bold text-[#4A2C11] mt-1">Optimal</h3>
                            <span className="text-xs text-[#5C3A21] font-medium flex items-center gap-1 mt-0.5">
                                <Boxes className="w-3.5 h-3.5 inline" /> Multi-Batch Terdata
                            </span>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-[#F5EFEB] border border-[#EDE4DC] flex items-center justify-center text-[#4A2C11]">
                            <LineChart className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                {/* ROLE QUICK-ACTION NOTICE */}
                <div className="rounded-2xl border border-[#EDE4DC] bg-white p-6 sm:p-8 shadow-xs">
                    <div className="max-w-2xl space-y-3">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF7F2] text-[#8B5013] border border-[#EDE4DC] text-xs font-semibold">
                            <Sparkles className="w-3.5 h-3.5" />
                            Akses Sesuai Peran: <span className="capitalize font-bold">{user.role}</span>
                        </div>
                        <h2 className="text-xl font-bold text-[#241408] tracking-tight">
                            Master Shell Navigasi Terpadu Siap Digunakan
                        </h2>
                        <p className="text-sm text-[#5C3A21] leading-relaxed">
                            Layout ini telah disesuaikan secara otomatis dengan matriks hak akses RBAC (Role-Based Access
                            Control). Menu navigasi di sisi kiri hanya menampilkan rute dan fitur yang diizinkan untuk
                            posisi <strong className="capitalize">{user.role}</strong>.
                        </p>

                        <div className="pt-2 flex flex-wrap gap-3">
                            {user.role === 'barista' && (
                                <Link
                                    href="/usage/create"
                                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#4A2C11] hover:bg-[#38210D] text-[#FFF6EE] text-xs font-semibold shadow-xs transition"
                                >
                                    <Flame className="w-4 h-4 text-[#C88242]" />
                                    <span>Catat Pemakaian FEFO</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </Link>
                            )}
                            {user.role === 'supervisor' && (
                                <Link
                                    href="/waste"
                                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#4A2C11] hover:bg-[#38210D] text-[#FFF6EE] text-xs font-semibold shadow-xs transition"
                                >
                                    <Boxes className="w-4 h-4 text-[#C88242]" />
                                    <span>Approval Pemusnahan</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </Link>
                            )}
                            {user.role === 'owner' && (
                                <Link
                                    href="/reports/waste"
                                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#4A2C11] hover:bg-[#38210D] text-[#FFF6EE] text-xs font-semibold shadow-xs transition"
                                >
                                    <LineChart className="w-4 h-4 text-[#C88242]" />
                                    <span>Laporan Finansial &amp; Kerugian</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
