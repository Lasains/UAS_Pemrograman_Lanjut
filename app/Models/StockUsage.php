<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StockUsage extends Model
{
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'ingredient_batch_id',
        'user_id',
        'quantity_used',
        'usage_date',
        'is_fefo_compliant',
        'deviation_reason',
        'notes',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'usage_date'        => 'date',
            'quantity_used'     => 'decimal:2',
            'is_fefo_compliant' => 'boolean',
        ];
    }

    /**
     * Relasi: Menguras stok dari batch mana.
     */
    public function batch(): BelongsTo
    {
        return $this->belongsTo(IngredientBatch::class, 'ingredient_batch_id');
    }

    /**
     * Relasi: Dicatat oleh user siapa.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}

