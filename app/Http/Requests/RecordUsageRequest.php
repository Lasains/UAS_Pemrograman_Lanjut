<?php

namespace App\Http\Requests;

use App\Models\IngredientBatch;
use Carbon\Carbon;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class RecordUsageRequest extends FormRequest
{
    /**
     * Pastikan pengguna memiliki izin.
     * Sudah dijaga oleh middleware 'role:barista,supervisor'.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Aturan validasi deklaratif.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            // ─── BATCH TARGET ──────────────────────────────────────────────
            'ingredient_batch_id' => [
                'required',
                'integer',
                Rule::exists('ingredient_batches', 'id'),
            ],

            // ─── KUANTITAS PEMAKAIAN ────────────────────────────────────────
            'quantity_used' => [
                'required',
                'numeric',
                'min:0.01',
                'max:99999999.99',
            ],

            // ─── TANGGAL PEMAKAIAN ──────────────────────────────────────────
            'usage_date' => [
                'required',
                'date',
                'before_or_equal:today', // Tidak boleh mencatat pemakaian masa depan
            ],

            // ─── KEPATUHAN FEFO & ALASAN DEVIASI ───────────────────────────
            'is_fefo_compliant' => [
                'required',
                'boolean',
            ],

            // Wajib diisi jika is_fefo_compliant = false
            'deviation_reason' => [
                'nullable',
                'required_if:is_fefo_compliant,false',
                'string',
                'min:5',
                'max:500',
            ],

            // ─── CATATAN TAMBAHAN (OPSIONAL) ────────────────────────────────
            'notes' => [
                'nullable',
                'string',
                'max:1000',
            ],
        ];
    }

    /**
     * Validasi Lanjutan Kompleks (After Validation Hook).
     * Mengecek sisa stok aktual di database & memverifikasi klaim FEFO.
     */
    public function withValidator(Validator $validator): void
    {
        $validator->after(function ($validator) {
            $batchId = $this->input('ingredient_batch_id');
            $qtyUsed = (float) $this->input('quantity_used');

            if (!$batchId) {
                return;
            }

            $batch = IngredientBatch::find($batchId);
            if (!$batch) {
                return;
            }

            // 1. Validasi Status Batch
            if ($batch->status !== 'active') {
                $validator->errors()->add(
                    'ingredient_batch_id',
                    "Batch {$batch->batch_code} tidak aktif (status: {$batch->status}) dan tidak dapat digunakan."
                );
            }

            // 2. Validasi Anti-Stok Minus
            if ($qtyUsed > (float) $batch->current_stock) {
                $validator->errors()->add(
                    'quantity_used',
                    "Kuantitas melebihi sisa stok batch ({$batch->current_stock} {$batch->ingredient->unit} tersedia)."
                );
            }

            // 3. Verifikasi Integritas Status FEFO dari Sisi Server
            // Mencegah manipulasi frontend di mana user mengirim is_fefo_compliant=true padahal bukan batch teratas
            $recommendedBatch = IngredientBatch::where('ingredient_id', $batch->ingredient_id)
                ->where('status', 'active')
                ->where('current_stock', '>', 0)
                ->orderBy('expiry_date', 'asc')
                ->first();

            $isActuallyFefo = ($recommendedBatch && $recommendedBatch->id === $batch->id);
            $clientClaimsFefo = (bool) $this->boolean('is_fefo_compliant');

            if ($clientClaimsFefo && !$isActuallyFefo) {
                $validator->errors()->add(
                    'is_fefo_compliant',
                    "Batch yang dipilih bukan batch rekomendasi FEFO teratas. Harap isi alasan deviasi."
                );
            }
        });
    }

    /**
     * Pesan error ramah pengguna dalam Bahasa Indonesia.
     */
    public function messages(): array
    {
        return [
            'ingredient_batch_id.required'     => 'Batch bahan baku wajib dipilih.',
            'ingredient_batch_id.exists'       => 'Batch yang dipilih tidak ditemukan dalam sistem.',
            'quantity_used.required'           => 'Jumlah bahan yang digunakan wajib diisi.',
            'quantity_used.numeric'            => 'Jumlah bahan harus berupa angka desimal atau bulat.',
            'quantity_used.min'                => 'Jumlah bahan minimal 0.01.',
            'usage_date.required'              => 'Tanggal pemakaian wajib diisi.',
            'usage_date.before_or_equal'       => 'Tanggal pemakaian tidak boleh lebih dari hari ini.',
            'deviation_reason.required_if'     => 'Alasan deviasi wajib diisi ketika tidak menggunakan batch rekomendasi FEFO.',
            'deviation_reason.min'             => 'Alasan deviasi minimal 5 karakter agar informatif.',
            'deviation_reason.max'             => 'Alasan deviasi maksimal 500 karakter.',
        ];
    }

    /**
     * Normalisasi payload sebelum divalidasi.
     */
    protected function prepareForValidation(): void
    {
        if (empty($this->usage_date)) {
            $this->merge([
                'usage_date' => Carbon::today()->toDateString(),
            ]);
        }

        // Jika compliant disetel true, kosongkan deviation_reason
        if ($this->boolean('is_fefo_compliant')) {
            $this->merge([
                'deviation_reason' => null,
            ]);
        }
    }
}
