<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateBatchRequest extends FormRequest
{
    /**
     * Hanya supervisor yang boleh update (sudah dihandle middleware route).
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Aturan validasi untuk update (koreksi) data batch.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $batchId = $this->route('batch')?->id;

        return [
            'ingredient_id' => [
                'sometimes',
                'required',
                'integer',
                Rule::exists('ingredients', 'id'),
            ],

            'batch_code' => [
                'sometimes',
                'nullable',
                'string',
                'max:50',
                Rule::unique('ingredient_batches', 'batch_code')->ignore($batchId),
            ],

            'initial_stock' => [
                'sometimes',
                'required',
                'numeric',
                'min:0.01',
                'max:99999999.99',
            ],

            'current_stock' => [
                'sometimes',
                'required',
                'numeric',
                'min:0',
                'max:99999999.99',
            ],

            'cost_per_unit' => [
                'sometimes',
                'required',
                'numeric',
                'min:0',
                'max:99999999.99',
            ],

            'received_date' => [
                'sometimes',
                'required',
                'date',
                'before_or_equal:today',
            ],

            'expiry_date' => [
                'sometimes',
                'required',
                'date',
                'after:received_date',
            ],

            'notes' => [
                'nullable',
                'string',
                'max:500',
            ],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'ingredient_id.exists' => 'Bahan yang dipilih tidak ditemukan dalam sistem.',
            'batch_code.unique'    => 'Kode batch ini sudah digunakan oleh batch lain.',
            'initial_stock.min'    => 'Stok awal minimal 0.01 unit.',
            'current_stock.min'    => 'Stok saat ini tidak boleh negatif.',
            'expiry_date.after'    => 'Tanggal kedaluwarsa harus setelah tanggal terima.',
        ];
    }
}
