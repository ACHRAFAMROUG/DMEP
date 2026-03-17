FROM php:8.2-cli

RUN apt-get update && apt-get install -y \
    git curl libpng-dev libonig-dev libxml2-dev zip unzip \
    && docker-php-ext-install pdo_mysql mbstring bcmath

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

COPY . .

RUN mkdir -p bootstrap/cache storage/framework/cache \
    storage/framework/sessions storage/framework/views \
    storage/logs \
    && chmod -R 775 bootstrap/cache storage \
    && composer install --no-dev --optimize-autoloader

EXPOSE 8000
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]