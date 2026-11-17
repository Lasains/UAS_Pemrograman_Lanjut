<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Membuat 3 akun demo untuk presentasi kepada dosen penguji.
     */
    public function run(): void
    {
        // Owner
        User::firstOrCreate(
            ['email' => 'owner@kafe.com'],
            [
                'name'     => 'Pak Budi (Owner)',
                'password' => Hash::make('password'),
                'role'     => 'owner',
            ]
        );

        // Supervisor
        User::firstOrCreate(
            ['email' => 'supervisor@kafe.com'],
            [
                'name'     => 'Ibu Sari (Supervisor)',
                'password' => Hash::make('password'),
                'role'     => 'supervisor',
            ]
        );

        // Barista
        User::firstOrCreate(
            ['email' => 'barista@kafe.com'],
            [
                'name'     => 'Andi (Barista)',
                'password' => Hash::make('password'),
                'role'     => 'barista',
            ]
        );

        $this->command->info('✅ UserSeeder: 3 akun demo berhasil dibuat.');
    }
}

