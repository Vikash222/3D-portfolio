FROM php:8.2-apache

# Set Composer and Apache environment
ENV COMPOSER_ALLOW_SUPERUSER=1
ENV COMPOSER_MEMORY_LIMIT=-1
ENV APACHE_DOCUMENT_ROOT=/var/www/html/public

# Increase PHP memory limit for build & runtime
RUN echo "memory_limit=512M" > /usr/local/etc/php/conf.d/memory-limit.ini

# Install system dependencies, libzip & PHP extensions
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libsqlite3-dev \
    libzip-dev \
    zip \
    unzip \
    sqlite3 \
    && docker-php-ext-install pdo_mysql pdo_sqlite mbstring exif pcntl bcmath gd zip \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Configure Apache DocumentRoot to point to Laravel's public directory
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf \
    && sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf \
    && a2enmod rewrite

# Set working directory
WORKDIR /var/www/html

# Copy the entire backend directory first so app/, database/, etc. exist for PSR-4 autoloader
COPY . .

# Install PHP dependencies with unlimited memory and ignore-platform-reqs
RUN composer install --no-dev --no-interaction --no-scripts --ignore-platform-reqs --optimize-autoloader

# Set up storage and cache permissions
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache /var/www/html/database \
    && chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache /var/www/html/database

# Expose default HTTP port
EXPOSE 80

# Entrypoint script
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
