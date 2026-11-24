<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Ingredient extends Model
{
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'category_id',
        'name',
        'unit',
        'minimum_stock',
        'warning_days',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'minimum_stock' => 'decimal:2',
            'warning_days'  => 'integer',
        ];
    }

    /**
     * Relasi: Bahan ini termasuk kategori mana.
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'category_id');
    }

    /**
     * Relasi: Satu bahan bisa punya banyak batch kiriman.
     */
    public function batches(): HasMany
    {
        return $this->hasMany(IngredientBatch::class, 'ingredient_id');
    }

    /**
     * Scope: Filter bahan yang total stok aktifnya di bawah minimum_stock.
     */
    public function scopeBelowMinimumStock(Builder $query): Builder
    {
        return $query->whereRaw(
            '(
                SELECT COALESCE(SUM(ib.current_stock), 0)
                FROM ingredient_batches ib
                WHERE ib.ingredient_id = ingredients.id
                  AND ib.status = ?
            ) < ingredients.minimum_stock',
            ['active']
        );
    }
}

