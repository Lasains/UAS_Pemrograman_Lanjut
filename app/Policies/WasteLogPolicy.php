<?php

namespace App\Policies;

use App\Models\User;
use App\Models\WasteLog;

class WasteLogPolicy
{
    /**
     * Semua pengguna terautentikasi dapat melihat laporan waste log.
     */
    public function view(User $user, WasteLog $wasteLog): bool
    {
        return true;
    }

    /**
     * Supervisor dan barista dapat membuat laporan bahan rusak.
     */
    public function create(User $user): bool
    {
        return in_array($user->role, ['supervisor', 'barista'], true);
    }

    /**
     * Hanya supervisor yang bukan pelapor yang dapat menyetujui laporan berstatus pending.
     */
    public function approve(User $user, WasteLog $wasteLog): bool
    {
        return $user->role === 'supervisor'
            && $wasteLog->status === 'pending'
            && $wasteLog->reported_by !== $user->id;
    }

    /**
     * Aturan penolakan sama dengan persetujuan (supervisor, pending, bukan pelapor sendiri).
     */
    public function reject(User $user, WasteLog $wasteLog): bool
    {
        return $this->approve($user, $wasteLog);
    }

    /**
     * Tidak ada role yang diizinkan menghapus permanen data waste log.
     */
    public function delete(User $user, WasteLog $wasteLog): bool
    {
        return false;
    }
}
