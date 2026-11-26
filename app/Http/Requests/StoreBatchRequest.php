<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreBatchRequest extends FormRequest
{
    /**
     * Tentukan apakah user yang sedang login boleh membuat request ini.
     *
     * Proteksi role sudah ditangani di middleware (role:barista,supervisor).
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Aturan validasi untuk setiap kolom input form restock.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            // ─── IDENTIFIKASI BAHAN ─────────────────────────────────────────
            'ingredient_id' => [
                'required',
                'integer',
                Rule::exists('ingredients', 'id'),
            ],

            // ─── KODE BATCH (OPSIONAL) ──────────────────────────────────────
            'batch_code' => [
                'nullable',
                'string',
                'max:50',
                Rule::unique('ingredient_batches', 'batch_code'),
            ],

            // ─── STOK AWAL ──────────────────────────────────────────────────
            'initial_stock' => [
                'required',
                'numeric',
                'min:0.01',
                'max:99999999.99',
            ],

            // ─── HARGA BELI PER UNIT ────────────────────────────────────────
            'cost_per_unit' => [
                'required',
                'numeric',
                'min:0',
                'max:99999999.99',
            ],

            // ─── TANGGAL TERIMA ─────────────────────────────────────────────
            'received_date' => [
                'required',
                'date',
                'before_or_equal:today',
            ],

            // ─── TANGGAL KEDALUWARSA ────────────────────────────────────────
            'expiry_date' => [
                'required',
                'date',
                'after:received_date',
                'after:today',
            ],

            // ─── CATATAN OPSIONAL ───────────────────────────────────────────
            'notes' => [
                'nullable',
                'string',
                'max:500',
            ],
        ];
    }

    /**
     * Pesan error kustom dalam Bahasa Indonesia.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'ingredient_id.required' => 'Nama bahan wajib dipilih.',
            'ingredient_id.exists'   => 'Bahan yang dipilih tidak ditemukan dalam sistem.',

            'batch_code.unique'      => 'Kode batch ini sudah digunakan. Gunakan kode lain atau kosongkan untuk auto-generate.',
            'batch_code.max'         => 'Kode batch maksimal 50 karakter.',

            'initial_stock.required' => 'Jumlah stok awal wajib diisi.',
            'initial_stock.numeric'  => 'Jumlah stok harus berupa angka.',
            'initial_stock.min'      => 'Jumlah stok minimal 0.01 unit.',

            'cost_per_unit.required' => 'Harga beli per unit wajib diisi.',
            'cost_per_unit.numeric'  => 'Harga beli harus berupa angka.',
            'cost_per_unit.min'      => 'Harga beli tidak boleh negatif.',

            'received_date.required'        => 'Tanggal terima wajib diisi.',
            'received_date.date'            => 'Format tanggal terima tidak valid.',
            'received_date.before_or_equal' => 'Tanggal terima tidak boleh di masa depan.',

            'expiry_date.required'           => 'Tanggal kedaluwarsa wajib diisi.',
            'expiry_date.date'               => 'Format tanggal kedaluwarsa tidak valid.',
            'expiry_date.after:received_date' => 'Tanggal kedaluwarsa harus setelah tanggal terima.',
            'expiry_date.after'              => 'Tanggal kedaluwarsa harus di masa depan.',

            'notes.max' => 'Catatan maksimal 500 karakter.',
        ];
    }

    /**
     * Nama kolom yang ramah untuk pesan error.
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'ingredient_id' => 'nama bahan',
            'batch_code'    => 'kode batch',
            'initial_stock' => 'jumlah stok awal',
            'cost_per_unit' => 'harga beli per unit',
            'received_date' => 'tanggal terima',
            'expiry_date'   => 'tanggal kedaluwarsa',
        ];
    }

    /**
     * Persiapan data sebelum validasi dijalankan.
     */
    protected function prepareForValidation(): void
    {
        if (empty($this->received_date)) {
            $this->merge([
                'received_date' => now()->toDateString(),
            ]);
        }

        if ($this->batch_code) {
            $this->merge([
                'batch_code' => trim(strtoupper($this->batch_code)),
            ]);
        }
    }
}
