<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WasteLog extends Model
{
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'ingredient_batch_id',
        'reported_by',
        'waste_quantity',
        'reason',
        'status',
        // 'approved_by' & 'financial_loss' sengaja tidak dimasukkan ke fillable untuk proteksi keamanan
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'waste_quantity' => 'decimal:2',
            'financial_loss' => 'decimal:2',
        ];
    }

    /**
     * Relasi: Pemusnahan untuk batch mana.
     */
    public function batch(): BelongsTo
    {
        return $this->belongsTo(IngredientBatch::class, 'ingredient_batch_id');
    }

    /**
     * Relasi: Siapa yang melaporkan pemusnahan ini.
     */
    public function reporter(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reported_by');
    }

    /**
     * Relasi: Siapa yang menyetujui pemusnahan ini.
     */
    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }
}

