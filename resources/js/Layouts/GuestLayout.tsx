import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';

interface GuestLayoutProps extends PropsWithChildren {
    fullWidth?: boolean;
}

export default function GuestLayout({ children, fullWidth = false }: GuestLayoutProps) {
    if (fullWidth) {
        return (
            <div className="min-h-screen bg-surface-canvas font-sans text-content-high antialiased">
                {children}
            </div>
        );
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-surface-canvas p-4 text-content-high antialiased sm:p-6">
            <div className="mb-4">
                <Link href="/" className="flex items-center gap-2">
                    <ApplicationLogo className="h-10 w-10 fill-current text-brand-primary" />
                    <span className="text-xl font-bold tracking-tight text-content-high">BeanFlow</span>
                </Link>
            </div>

            <div className="w-full max-w-md overflow-hidden rounded-xl border border-surface-border bg-white p-6 shadow-sm sm:p-8">
                {children}
            </div>
        </div>
    );
}
