FROM nginx:alpine AS base
WORKDIR /var/www/html
COPY dist .
COPY conf/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
