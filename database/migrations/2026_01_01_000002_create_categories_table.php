<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Membuat tabel master kategori bahan baku.
     */
    public function up(): void
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->id();                             // BIGINT UNSIGNED AUTO_INCREMENT PK
            $table->string('name', 100);              // Nama kategori (maks 100 karakter)
            $table->string('slug', 120)->unique();    // URL-friendly identifier, harus unik
            $table->timestamps();                     // created_at & updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('categories');
    }
};

