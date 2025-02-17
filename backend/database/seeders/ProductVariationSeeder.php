<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Support\Str;
use Illuminate\Database\Seeder;

class ProductVariationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // \App\Models\ProductVariation::factory(30)->create();

        $timestamp = now();
        \App\Models\ProductVariation::insert([
            [
                'product_id' => 1,
                'SKU' => "1001",
                'name' => "product 1 RED",
                'short_name' => "p1-RED",
                'barcode' => "1000110001",
                'created_at' => $timestamp,
                'updated_at' => $timestamp
            ],
            [
                'product_id' => 1,
                'SKU' => "1002",
                'name' => "product 1 BLUE",
                'short_name' => "p1-BLUE",
                'barcode' => "1000210002",
                'created_at' => $timestamp,
                'updated_at' => $timestamp
            ],
            [
                'product_id' => 1,
                'SKU' => "1003",
                'name' => "product 1 BLACK",
                'short_name' => "p1-BLACK",
                'barcode' => "1000310003",
                'created_at' => $timestamp,
                'updated_at' => $timestamp
            ],
            [
                'product_id' => 1,
                'SKU' => "1004",
                'name' => "product 1 WHITE",
                'short_name' => "p1-WHITE",
                'barcode' => "1000410004",
                'created_at' => $timestamp,
                'updated_at' => $timestamp
            ],
            [
                'product_id' => 3,
                'SKU' => "1005",
                'name' => "product 3 1TB",
                'short_name' => "p3-1TB",
                'barcode' => "1000510005",
                'created_at' => $timestamp,
                'updated_at' => $timestamp
            ],
            [
                'product_id' => 3,
                'SKU' => "1006",
                'name' => "product 3 2TB",
                'short_name' => "p3-2TB",
                'barcode' => "1000610006",
                'created_at' => $timestamp,
                'updated_at' => $timestamp
            ],
            [
                'product_id' => 4,
                'SKU' => "1007",
                'name' => "product 4 Small",
                'short_name' => "p4-2s",
                'barcode' => "1000710007",
                'created_at' => $timestamp,
                'updated_at' => $timestamp
            ],
            [
                'product_id' => 4,
                'SKU' => "1008",
                'name' => "product 4 Regular",
                'short_name' => "p4-2r",
                'barcode' => "1000810008",
                'created_at' => $timestamp,
                'updated_at' => $timestamp
            ],
            [
                'product_id' => 4,
                'SKU' => "1009",
                'name' => "product 4 Large",
                'short_name' => "p4-2l",
                'barcode' => "1000910009",
                'created_at' => $timestamp,
                'updated_at' => $timestamp
            ],
            [
                'product_id' => 4,
                'SKU' => "1010",
                'name' => "product 4 Extra Large",
                'short_name' => "p4-2xl",
                'barcode' => "1001010010",
                'created_at' => $timestamp,
                'updated_at' => $timestamp
            ],
        ]);
    }
}