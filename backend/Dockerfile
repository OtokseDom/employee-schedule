# Stage 1: PHP + Composer
FROM php:8.2-fpm-alpine AS base

RUN apk add --no-cache \
    bash git unzip curl libzip-dev oniguruma-dev autoconf gcc g++ make mysql-client

RUN docker-php-ext-install pdo_mysql mbstring zip exif pcntl bcmath

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY . .

RUN composer install --no-dev --optimize-autoloader

RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html/storage \
    && chmod -R 755 /var/www/html/bootstrap/cache

# Stage 2: Nginx
FROM nginx:alpine AS production

COPY --from=base /var/www/html /var/www/html
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["sh", "-c", "php-fpm -D && nginx -g 'daemon off;'"]
