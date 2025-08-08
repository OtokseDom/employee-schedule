#!/usr/bin/env bash
echo "Running composer"

composer install --no-dev --working-dir=/var/www/html

echo "Clearing route and config cache..."
php artisan config:clear
php artisan route:clear
php artisan cache:clear

echo "Caching config..."
php artisan config:cache

echo "Caching routes..."
php artisan route:cache

echo "Publishing cloudinary provider..."
php artisan vendor:publish --provider="CloudinaryLabs\CloudinaryLaravel\CloudinaryServiceProvider" --tag="cloudinary-laravel-config"

# echo "Running migrations..."
# php artisan migrate --force

# echo "Seeding Database..."
# php artisan db:seed --force