<?php

namespace App\Policies;

use App\Models\Ingredient;
use App\Models\User;

class IngredientPolicy
{
    /**
     * Semua role dapat melihat daftar bahan baku.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Semua role dapat melihat detail bahan baku.
     */
    public function view(User $user, Ingredient $ingredient): bool
    {
        return true;
    }

    /**
     * Hanya supervisor yang dapat menambahkan master bahan baku.
     */
    public function create(User $user): bool
    {
        return $user->role === 'supervisor';
    }

    /**
     * Hanya supervisor yang dapat memperbarui master bahan baku.
     */
    public function update(User $user, Ingredient $ingredient): bool
    {
        return $user->role === 'supervisor';
    }

    /**
     * Hanya supervisor yang dapat menghapus master bahan baku.
     */
    public function delete(User $user, Ingredient $ingredient): bool
    {
        return $user->role === 'supervisor';
    }
}
