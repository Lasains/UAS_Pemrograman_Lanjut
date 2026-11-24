<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class IngredientBatch extends Model
{
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'ingredient_id',
        'batch_code',
        'initial_stock',
        'current_stock',
        'received_date',
        'expiry_date',
        'cost_per_unit',
        'status',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'received_date'  => 'date',
            'expiry_date'    => 'date',
            'initial_stock'  => 'decimal:2',
            'current_stock'  => 'decimal:2',
            'cost_per_unit'  => 'decimal:2',
        ];
    }

    /**
     * Relasi: Batch ini adalah kiriman dari bahan apa.
     */
    public function ingredient(): BelongsTo
    {
        return $this->belongsTo(Ingredient::class, 'ingredient_id');
    }

    /**
     * Relasi: Riwayat pemakaian batch ini.
     */
    public function stockUsages(): HasMany
    {
        return $this->hasMany(StockUsage::class, 'ingredient_batch_id');
    }

    /**
     * Relasi: Riwayat laporan pemusnahan batch ini.
     */
    public function wasteLogs(): HasMany
    {
        return $this->hasMany(WasteLog::class, 'ingredient_batch_id');
    }

    /**
     * Scope: Filter batch yang masih aktif dan ada stoknya.
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('status', 'active')
                     ->where('current_stock', '>', 0);
    }

    /**
     * Scope: Urutkan batch berdasarkan tanggal kedaluwarsa terdekat (FEFO).
     */
    public function scopeFefoOrder(Builder $query): Builder
    {
        return $query->orderBy('expiry_date', 'asc');
    }

    /**
     * Scope: Filter batch yang akan kedaluwarsa dalam N hari ke depan.
     */
    public function scopeCriticalExpiry(Builder $query, int $days = 7): Builder
    {
        return $query->where('expiry_date', '<=', Carbon::now()->addDays($days));
    }

    /**
     * Scope: Filter batch berdasarkan ingredient_id tertentu.
     */
    public function scopeForIngredient(Builder $query, int $ingredientId): Builder
    {
        return $query->where('ingredient_id', $ingredientId);
    }

    /**
     * Accessor: Hitung sisa hari menuju / sejak tanggal kedaluwarsa.
     */
    public function getDaysUntilExpiryAttribute(): int
    {
        $today = Carbon::today();
        $expiry = Carbon::parse($this->expiry_date);

        if ($expiry->isPast()) {
            return -1 * $today->diffInDays($expiry);
        }

        return $today->diffInDays($expiry);
    }

    /**
     * Accessor: Status kedaluwarsa (safe, warning, critical).
     */
    public function getExpiryStatusAttribute(): string
    {
        $days = $this->days_until_expiry;

        if ($days > 7) {
            return 'safe';
        }

        if ($days >= 3) {
            return 'warning';
        }

        return 'critical';
    }

    /**
     * Accessor: Total valuasi nilai stok sisa (current_stock * cost_per_unit).
     */
    public function getTotalValueAttribute(): float
    {
        return (float) $this->current_stock * (float) $this->cost_per_unit;
    }
}

