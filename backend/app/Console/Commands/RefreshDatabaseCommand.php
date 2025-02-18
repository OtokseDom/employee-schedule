<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Artisan;

class RefreshDatabaseCommand extends Command
{
    protected $signature = 'g'; // Command name

    protected $description = 'Refresh database, run migrations, and seed data';

    public function handle()
    {
        // Ask for confirmation
        if (!$this->confirm('⚠️ This will reset the database! Do you want to continue?', true)) {
            $this->info('Operation canceled.');
            return;
        }

        // Run migrations
        $this->info('Migrating database...');
        Artisan::call('migrate:fresh'); // Drops all tables and re-runs migrations
        $this->info('✅ Database migrated successfully.');

        // Run seeders
        $this->info('Seeding database...');
        Artisan::call('db:seed');
        $this->info('✅ Database seeded successfully.');

        $this->info('🎉 Database refresh complete!');
    }
}