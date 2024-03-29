<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RolesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        DB::table('roles')->insert([
            'name' => 'patient',
        ]);

        DB::table('roles')->insert([
            'name' => 'doctor',
        ]);

        DB::table('roles')->insert([
            'name' => 'volunteer',
        ]);

        DB::table('roles')->insert([
            'name' => 'admin',
        ]);
    }
}
