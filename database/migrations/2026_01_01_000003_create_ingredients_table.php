<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Membuat tabel master bahan baku kafe.
     */
    public function up(): void
    {
        Schema::create('ingredients', function (Blueprint $table) {
            $table->id();

            // Foreign key ke tabel categories
            $table->foreignId('category_id')
                  ->constrained('categories')
                  ->restrictOnDelete();  // Mencegah penghapusan kategori yang masih punya bahan

            $table->string('name', 150);                       // Nama bahan (contoh: "Fresh Milk Full Cream")
            $table->string('unit', 30);                        // Satuan (contoh: "Liter", "Kg", "Botol")
            $table->decimal('minimum_stock', 10, 2);           // Batas stok minimum untuk alert
            $table->unsignedInteger('warning_days')->default(3); // Hari peringatan sebelum expiry

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ingredients');
    }
};

