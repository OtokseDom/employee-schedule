<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class ProductUnitSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $timestamp = now();
        \App\Models\ProductUnit::insert([
            [
                'product_variation_id' => 1,
                'unit_id' => 1,
                'is_base' => true,
                'factor' => 1,
                'base_qty' => 100,
                'cost_price' => 15,
                'selling_price' => 20,
                'sale_price' => null,
                'created_at' => $timestamp,
                'updated_at' => $timestamp
            ],
            [
                'product_variation_id' => 2,
                'unit_id' => 1,
                'is_base' => true,
                'factor' => 1,
                'base_qty' => 100,
                'cost_price' => 15,
                'selling_price' => 20,
                'sale_price' => null,
                'created_at' => $timestamp,
                'updated_at' => $timestamp
            ],
            [
                'product_variation_id' => 3,
                'unit_id' => 1,
                'is_base' => true,
                'factor' => 1,
                'base_qty' => 100,
                'cost_price' => 15,
                'selling_price' => 20,
                'sale_price' => null,
                'created_at' => $timestamp,
                'updated_at' => $timestamp
            ],
            [
                'product_variation_id' => 4,
                'unit_id' => 1,
                'is_base' => true,
                'factor' => 1,
                'base_qty' => 100,
                'cost_price' => 15,
                'selling_price' => 20,
                'sale_price' => null,
                'created_at' => $timestamp,
                'updated_at' => $timestamp
            ],
            [
                'product_variation_id' => null,
                'unit_id' => 1,
                'is_base' => true,
                'factor' => 1,
                'base_qty' => 100,
                'cost_price' => 20,
                'selling_price' => 25,
                'sale_price' => null,
                'created_at' => $timestamp,
                'updated_at' => $timestamp
            ],
            [
                'product_variation_id' => null,
                'unit_id' => 2,
                'is_base' => false,
                'factor' => 12,
                'base_qty' => 100,
                'cost_price' => 200,
                'selling_price' => 220,
                'sale_price' => null,
                'created_at' => $timestamp,
                'updated_at' => $timestamp
            ],
            [
                'product_variation_id' => null,
                'unit_id' => 3,
                'is_base' => false,
                'factor' => 144,
                'base_qty' => 100,
                'cost_price' => 2880,
                'selling_price' => 3000,
                'sale_price' => null,
                'created_at' => $timestamp,
                'updated_at' => $timestamp
            ],
            [
                'product_variation_id' => 5,
                'unit_id' => 1,
                'is_base' => true,
                'factor' => 1,
                'base_qty' => 100,
                'cost_price' => 600,
                'selling_price' => 800,
                'sale_price' => 750,
                'created_at' => $timestamp,
                'updated_at' => $timestamp
            ],
            [
                'product_variation_id' => 6,
                'unit_id' => 1,
                'is_base' => true,
                'factor' => 1,
                'base_qty' => 100,
                'cost_price' => 700,
                'selling_price' => 850,
                'sale_price' => 800,
                'created_at' => $timestamp,
                'updated_at' => $timestamp
            ],
            [
                'product_variation_id' => 7,
                'unit_id' => 1,
                'is_base' => true,
                'factor' => 1,
                'base_qty' => 100,
                'cost_price' => 15,
                'selling_price' => 20,
                'sale_price' => null,
                'created_at' => $timestamp,
                'updated_at' => $timestamp
            ],
            [
                'product_variation_id' => 8,
                'unit_id' => 1,
                'is_base' => true,
                'factor' => 1,
                'base_qty' => 100,
                'cost_price' => 15,
                'selling_price' => 20,
                'sale_price' => null,
                'created_at' => $timestamp,
                'updated_at' => $timestamp
            ],
            [
                'product_variation_id' => 9,
                'unit_id' => 1,
                'is_base' => true,
                'factor' => 1,
                'base_qty' => 100,
                'cost_price' => 15,
                'selling_price' => 20,
                'sale_price' => null,
                'created_at' => $timestamp,
                'updated_at' => $timestamp
            ],
            [
                'product_variation_id' => 10,
                'unit_id' => 1,
                'is_base' => true,
                'factor' => 1,
                'base_qty' => 100,
                'cost_price' => 15,
                'selling_price' => 20,
                'sale_price' => null,
                'created_at' => $timestamp,
                'updated_at' => $timestamp
            ],
            [
                'product_variation_id' => null,
                'unit_id' => 1,
                'is_base' => true,
                'factor' => 1,
                'base_qty' => 100,
                'cost_price' => 10,
                'selling_price' => 15,
                'sale_price' => null,
                'created_at' => $timestamp,
                'updated_at' => $timestamp
            ],
            [
                'product_variation_id' => null,
                'unit_id' => 1,
                'is_base' => true,
                'factor' => 1,
                'base_qty' => 100,
                'cost_price' => 10,
                'selling_price' => 15,
                'sale_price' => null,
                'created_at' => $timestamp,
                'updated_at' => $timestamp
            ],
            [
                'product_variation_id' => null,
                'unit_id' => 1,
                'is_base' => true,
                'factor' => 1,
                'base_qty' => 100,
                'cost_price' => 10,
                'selling_price' => 15,
                'sale_price' => null,
                'created_at' => $timestamp,
                'updated_at' => $timestamp
            ],
            [
                'product_variation_id' => null,
                'unit_id' => 1,
                'is_base' => true,
                'factor' => 1,
                'base_qty' => 100,
                'cost_price' => 10,
                'selling_price' => 15,
                'sale_price' => null,
                'created_at' => $timestamp,
                'updated_at' => $timestamp
            ],
            [
                'product_variation_id' => null,
                'unit_id' => 1,
                'is_base' => true,
                'factor' => 1,
                'base_qty' => 100,
                'cost_price' => 10,
                'selling_price' => 15,
                'sale_price' => null,
                'created_at' => $timestamp,
                'updated_at' => $timestamp
            ],
            [
                'product_variation_id' => null,
                'unit_id' => 1,
                'is_base' => true,
                'factor' => 1,
                'base_qty' => 100,
                'cost_price' => 10,
                'selling_price' => 15,
                'sale_price' => null,
                'created_at' => $timestamp,
                'updated_at' => $timestamp
            ],
        ]);
    }
}
