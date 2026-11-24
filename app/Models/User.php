<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Relasi: Satu user bisa mencatat banyak pemakaian stok.
     */
    public function stockUsages(): HasMany
    {
        return $this->hasMany(StockUsage::class, 'user_id');
    }

    /**
     * Relasi: Satu user bisa membuat banyak laporan pemusnahan.
     */
    public function reportedWasteLogs(): HasMany
    {
        return $this->hasMany(WasteLog::class, 'reported_by');
    }

    /**
     * Relasi: Satu user (supervisor) bisa menyetujui banyak laporan pemusnahan.
     */
    public function approvedWasteLogs(): HasMany
    {
        return $this->hasMany(WasteLog::class, 'approved_by');
    }

    /**
     * Helper methods: Cek peran pengguna
     */
    public function isOwner(): bool
    {
        return $this->role === 'owner';
    }

    public function isSupervisor(): bool
    {
        return $this->role === 'supervisor';
    }

    public function isBarista(): bool
    {
        return $this->role === 'barista';
    }
}
