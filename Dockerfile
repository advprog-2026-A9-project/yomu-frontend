# Tahap 1: Build aplikasi
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Menerima ARG dari docker-compose.yml dan menjadikannya ENV saat build
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN npm run build

# Tahap 2: Serve dengan Nginx
FROM nginx:alpine

# Hapus konfigurasi default Nginx
RUN rm /etc/nginx/conf.d/default.conf

# Copy konfigurasi custom yang sudah mengatasi 404 SPA
COPY nginx.conf /etc/nginx/conf.d/

# Copy hasil build dari tahap 1 ke folder Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Ekspos port 80 (sesuai dengan docker-compose "3001:80")
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]