import BaristaDashboard from '@/Pages/Barista/Dashboard';
import { usePage } from '@inertiajs/react';

export default function Dashboard() {
    const user = usePage().props.auth.user;

    // Untuk barista dan supervisor, tampilkan Dasbor Operasional Barista
    return <BaristaDashboard />;
}
