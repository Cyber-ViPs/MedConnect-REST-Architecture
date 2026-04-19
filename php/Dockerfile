FROM php:8.2.28-fpm

RUN mkdir -p /var/log/php && chown www-data:www-data /var/log/php

COPY ./php-fpm.ini /usr/local/etc/php/conf.d/zzz-custom.ini

WORKDIR /var/www/html

EXPOSE 9000

# Metadados da Imagem
LABEL description="Ambiente PHP 8.2-FPM para desenvolvimento" \
      version="1.2" \
      maintainer="Cyber-ViPs <teste.systems1@gmail.com>"

CMD ["php-fpm"]