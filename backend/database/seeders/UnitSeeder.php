<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class UnitSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $timestamp = now();
        \App\Models\Unit::insert([
            [
                'code' => "PCS",
                'description' => "Pieces",
                'created_at' => $timestamp,
                'updated_at' => $timestamp
            ],
            [
                'code' => "PK",
                'description' => "Packs",
                'created_at' => $timestamp,
                'updated_at' => $timestamp
            ],
            [
                'code' => "CTN",
                'description' => "Pieces",
                'created_at' => $timestamp,
                'updated_at' => $timestamp
            ],
            [
                'code' => "PLT",
                'description' => "Palletes",
                'created_at' => $timestamp,
                'updated_at' => $timestamp
            ],
            [
                'code' => "1KG",
                'description' => "1 Kilogram",
                'created_at' => $timestamp,
                'updated_at' => $timestamp
            ],
            [
                'code' => "2KG",
                'description' => "2 Kilogram",
                'created_at' => $timestamp,
                'updated_at' => $timestamp
            ],
            [
                'code' => "5KG",
                'description' => "5 Kilogram",
                'created_at' => $timestamp,
                'updated_at' => $timestamp
            ],
        ]);
    }
}