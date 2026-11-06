<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Membuat tabel log pemusnahan bahan rusak dengan workflow approval.
     */
    public function up(): void
    {
        Schema::create('waste_logs', function (Blueprint $table) {
            $table->id();

            // Foreign key ke batch yang dimusnahkan
            $table->foreignId('ingredient_batch_id')
                  ->constrained('ingredient_batches')
                  ->restrictOnDelete();

            // Foreign key ganda ke tabel users dengan nama kolom kustom
            // reported_by: user yang melaporkan (barista/supervisor)
            $table->unsignedBigInteger('reported_by');
            $table->foreign('reported_by')
                  ->references('id')
                  ->on('users')
                  ->restrictOnDelete();

            // approved_by: user yang menyetujui (supervisor/owner) — NULLABLE karena awalnya belum ada approver
            $table->unsignedBigInteger('approved_by')->nullable();
            $table->foreign('approved_by')
                  ->references('id')
                  ->on('users')
                  ->nullOnDelete(); // Jika approver dihapus, set ke null (tidak batalkan log)

            $table->decimal('waste_quantity', 10, 2);       // Jumlah bahan yang dimusnahkan
            $table->decimal('financial_loss', 12, 2)->nullable(); // Dihitung saat approved: qty × cost_per_unit
            $table->string('reason', 500);                  // Alasan pemusnahan (wajib diisi)

            // Status workflow approval
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');

            $table->timestamps();

            // =====================================================================
            // INDEKS PERFORMA
            // =====================================================================

            // INDEX: Composite — untuk query antrian approval oleh supervisor
            // WHERE status = 'pending' AND reported_by = ?
            $table->index(['status', 'reported_by'], 'idx_waste_status_reporter');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('waste_logs');
    }
};

