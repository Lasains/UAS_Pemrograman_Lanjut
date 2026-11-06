<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Membuat tabel log pemakaian stok harian.
     */
    public function up(): void
    {
        Schema::create('stock_usages', function (Blueprint $table) {
            $table->id();

            // Foreign key ke batch yang digunakan
            $table->foreignId('ingredient_batch_id')
                  ->constrained('ingredient_batches')
                  ->restrictOnDelete(); // Batch tidak bisa dihapus jika sudah ada riwayat pemakaian

            // Foreign key ke user yang mencatat pemakaian
            $table->foreignId('user_id')
                  ->constrained('users')
                  ->restrictOnDelete(); // User tidak bisa dihapus jika sudah ada riwayat pencatatan

            $table->decimal('quantity_used', 10, 2);           // Jumlah yang digunakan
            $table->date('usage_date');                         // Tanggal pemakaian

            // Kolom kepatuhan FEFO — inti audit trail
            $table->boolean('is_fefo_compliant')->default(true); // Apakah batch yang dipakai sesuai FEFO?
            $table->string('deviation_reason', 500)->nullable(); // Wajib diisi jika is_fefo_compliant = false
            $table->text('notes')->nullable();                   // Catatan bebas opsional dari barista

            $table->timestamps();

            // =====================================================================
            // INDEKS PERFORMA
            // =====================================================================

            // INDEX: Composite — untuk query riwayat pemakaian per batch dalam rentang tanggal
            $table->index(['ingredient_batch_id', 'usage_date'], 'idx_usage_batch_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stock_usages');
    }
};

