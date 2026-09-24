# syntax=docker/dockerfile:1
# ------------------------------------------------------------
# Stage 1: Build Frontend Assets
# ------------------------------------------------------------
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Build Vite static assets with /api base URL for same-origin proxy
ENV VITE_API_BASE_URL=/api
RUN npm run build

# ------------------------------------------------------------
# Stage 2: Serve with Nginx
# ------------------------------------------------------------
FROM nginx:alpine AS runner

# Remove default static pages
RUN rm -rf /usr/share/nginx/html/*

# Copy built bundle from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom reverse proxy & SPA configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
