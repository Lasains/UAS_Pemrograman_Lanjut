import { cn } from '@/lib/utils';
import { UrgencyStatus } from '@/types';
import React from 'react';

export interface ExpiryBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    /**
     * Jumlah sisa hari hingga tanggal kedaluwarsa.
     * Jika diisi, status ('safe' | 'warning' | 'critical') akan dikalkulasi otomatis:
     * - > 7 hari: 'safe' (Aman)
     * - 3 s/d 7 hari: 'warning' (Segera Pakai)
     * - < 3 hari: 'critical' (Kritis / Basi)
     */
    daysLeft?: number;

    /**
     * Status urgensi eksplisit sesuai kontrak inventory.d.ts.
     * Digunakan jika nilai status sudah dihitung oleh backend Laravel (Carbon).
     */
    status?: UrgencyStatus;

    /**
     * Apakah batch ini merupakan prioritas rekomendasi FEFO nomor 1?
     * Jika true, badge akan menggunakan aksen Espresso Signature (#4A2C11).
     */
    isFefoRecommended?: boolean;

    /**
     * Ukuran badge: 'sm' (kecil untuk tabel padat), 'md' (standar), 'lg' (besar untuk header).
     */
    size?: 'sm' | 'md' | 'lg';

    /**
     * Teks kustom jika ingin menimpa label bawaan.
     */
    label?: string;

    /**
     * Tampilkan titik indikator warna (dot indicator). Default: true.
     */
    showDot?: boolean;
}

export default function ExpiryBadge({
    daysLeft,
    status,
    isFefoRecommended = false,
    size = 'md',
    label,
    showDot = true,
    className,
    ...props
}: ExpiryBadgeProps) {
    // 1. Tentukan status urgensi berdasarkan daysLeft atau status eksplisit
    const resolveStatus = (): UrgencyStatus => {
        if (status) return status;
        if (daysLeft === undefined) return 'safe';
        if (daysLeft < 3) return 'critical';
        if (daysLeft <= 7) return 'warning';
        return 'safe';
    };

    const currentStatus = resolveStatus();

    // 2. Jika merupakan rekomendasi prioritas FEFO utama
    if (isFefoRecommended) {
        return (
            <span
                className={cn(
                    'inline-flex items-center gap-1.5 rounded-full font-semibold bg-[#4A2C11] text-[#FAF7F2] border border-[#C88242]/40 shadow-xs tracking-tight',
                    size === 'sm' && 'text-[10px] px-2 py-0.5',
                    size === 'md' && 'text-xs px-3 py-1.5',
                    size === 'lg' && 'text-sm px-4 py-2',
                    className,
                )}
                {...props}
            >
                <span className="text-[#C88242] font-black leading-none">★</span>
                <span>{label || 'Rekomendasi FEFO'}</span>
            </span>
        );
    }

    // 3. Konfigurasi tampilan sesuai traffic-light warning
    const statusConfig: Record<
        UrgencyStatus,
        {
            badgeClass: string;
            dotClass: string;
            defaultText: string;
        }
    > = {
        safe: {
            badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-300',
            dotClass: 'bg-emerald-500',
            defaultText: daysLeft !== undefined ? `🟢 Aman (${daysLeft} hari)` : '🟢 Aman',
        },
        warning: {
            badgeClass: 'bg-[#FFF7ED] text-[#C88242] border-[#FED7AA]',
            dotClass: 'bg-[#C88242]',
            defaultText: daysLeft !== undefined ? `🟡 Segera Pakai (${daysLeft} hari)` : '🟡 Segera Pakai',
        },
        critical: {
            badgeClass: 'bg-[#FDF2F0] text-[#8C3D2B] border-[#F8C6BF] animate-pulse',
            dotClass: 'bg-[#8C3D2B]',
            defaultText:
                daysLeft !== undefined
                    ? daysLeft <= 0
                        ? '🔴 Kedaluwarsa'
                        : daysLeft === 1
                          ? '🔴 Kritis (1 hari / Besok)'
                          : `🔴 Kritis (${daysLeft} hari)`
                    : '🔴 Kritis',
        },
    };

    const config = statusConfig[currentStatus];

    return (
        <span
            className={cn(
                'inline-flex items-center gap-1.5 rounded-full font-medium border shadow-xs transition-colors',
                config.badgeClass,
                size === 'sm' && 'text-[10px] px-2 py-0.5',
                size === 'md' && 'text-xs px-3 py-1.5',
                size === 'lg' && 'text-sm px-4 py-2',
                className,
            )}
            {...props}
        >
            {showDot && <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', config.dotClass)} />}
            <span>{label || config.defaultText}</span>
        </span>
    );
}
