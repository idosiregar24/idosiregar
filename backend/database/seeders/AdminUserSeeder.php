<?php

namespace Database\Seeders;

use App\Models\AdminUser;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        AdminUser::create([
            'email' => 'admin@ido.com',
            'password' => Hash::make('password'),
        ]);
    }
}
