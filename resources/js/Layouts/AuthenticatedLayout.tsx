import AppLayout from '@/Layouts/AppLayout';
import { PropsWithChildren, ReactNode } from 'react';

/**
 * Authenticated Layout wrapper yang meneruskan props ke AppLayout terpadu BeanFlow.
 * Ini memastikan kompatibilitas penuh dengan rute bawaan Laravel Breeze sekaligus
 * menerapkan Master Shell bertema kopi artisan FEFO.
 */
export default function Authenticated({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    return <AppLayout header={header}>{children}</AppLayout>;
}
