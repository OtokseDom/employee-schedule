#!/bin/bash

# Start PHP-FPM
php-fpm -D

# Run Laravel setup commands
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Start Nginx
nginx -g "daemon off;"