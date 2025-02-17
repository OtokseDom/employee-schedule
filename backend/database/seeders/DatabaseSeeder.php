<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            UnitSeeder::class,
            ProductSeeder::class,
            ProductVariationSeeder::class,
            ProductUnitSeeder::class,
            CustomerSeeder::class,
            SupplierSeeder::class,
            BranchSeeder::class,
            WarehouseSeeder::class,
            StorageSeeder::class,
            ContactSeeder::class,
        ]);
    }
}