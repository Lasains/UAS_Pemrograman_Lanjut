<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Membuat tabel batch bahan baku — inti dari sistem FEFO.
     */
    public function up(): void
    {
        Schema::create('ingredient_batches', function (Blueprint $table) {
            $table->id();

            // Foreign key ke tabel ingredients
            $table->foreignId('ingredient_id')
                  ->constrained('ingredients')
                  ->restrictOnDelete(); // Bahan tidak bisa dihapus jika masih ada batch

            $table->string('batch_code', 50)->unique(); // Kode batch/nomor faktur, HARUS unik
            $table->decimal('initial_stock', 10, 2);    // Stok awal saat diterima (tidak berubah)
            $table->decimal('current_stock', 10, 2);    // Stok sisa real-time (berkurang tiap pemakaian)
            $table->date('received_date');               // Tanggal terima dari supplier
            $table->date('expiry_date');                 // Tanggal kedaluwarsa (kunci FEFO)
            $table->decimal('cost_per_unit', 12, 2);    // Harga beli per unit (untuk hitung financial_loss)

            // Status lifecycle batch (TIDAK ada soft-delete bawaan)
            $table->enum('status', ['active', 'exhausted', 'expired', 'disposed'])
                  ->default('active');

            $table->timestamps();

            // =====================================================================
            // INDEKS PERFORMA — KRITIS UNTUK QUERY FEFO
            // =====================================================================

            // INDEX 1: Composite index — query FEFO paling sering dijalankan
            // WHERE ingredient_id = ? AND status = 'active' AND current_stock > 0
            // ORDER BY expiry_date ASC
            $table->index(['ingredient_id', 'status', 'expiry_date'], 'idx_fefo_query');

            // INDEX 2: Index single — untuk dashboard early warning
            // WHERE expiry_date BETWEEN today AND today+7
            $table->index('expiry_date', 'idx_expiry_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ingredient_batches');
    }
};

