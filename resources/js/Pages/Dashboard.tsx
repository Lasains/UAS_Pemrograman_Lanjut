import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { Coffee, Layers, Sparkles } from 'lucide-react';

export default function Dashboard() {
    const user = usePage().props.auth.user;

    return (
        <AuthenticatedLayout
            header={
                <h1 className="text-lg font-bold tracking-tight text-content-high">
                    Dasbor Operasional Kafe
                </h1>
            }
        >
            <Head title="Dasbor - BeanFlow" />

            <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#DCDAD5] bg-[#F6F3EE]/60 p-12 text-center min-h-[450px]">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-surface-border bg-surface-container-high text-brand-secondary shadow-xs">
                    <Coffee className="h-8 w-8 text-brand-primary" />
                </div>
                <h2 className="text-xl font-bold tracking-tight text-content-high">
                    Selamat Datang di BeanFlow, {user.name}!
                </h2>
                <p className="mt-2 max-w-md text-sm text-content-medium">
                    Sistem pemantauan inventaris multibatch dan rotasi masa simpan bahan baku (FEFO) aktif.
                </p>

                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                    <div className="flex items-center gap-2 rounded-lg border border-surface-border bg-white px-3.5 py-2 text-xs font-medium text-content-medium shadow-xs">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        <span>Role: <strong className="capitalize text-brand-primary">{user.role}</strong></span>
                    </div>
                    <div className="flex items-center gap-2 rounded-lg border border-surface-border bg-white px-3.5 py-2 text-xs font-mono text-content-subtle shadow-xs">
                        <Layers className="h-3.5 w-3.5 text-brand-secondary" />
                        <span>Universal In-Shell Content View</span>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
