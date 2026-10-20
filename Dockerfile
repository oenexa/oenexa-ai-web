# ==============================================================================
# OENEXA AI Web - Multi-Stage Container Image
# Stage 1: Build React/Vite UI with Node 22 LTS
# Stage 2: Serve static bundle via Nginx with reverse proxy to backend
# Repository: github.com/oenexa/oenexa-ai-web
# ==============================================================================

# ---------- Stage 1: Build Frontend Assets ----------
FROM node:22-alpine AS builder
WORKDIR /app

# Copy dependency manifests first for layer caching
COPY package.json package-lock.json ./

# Install dependencies cleanly
RUN npm install

# Copy application source code
COPY index.html vite.config.ts tsconfig*.json postcss.config.js* tailwind.config.js* ./
COPY src/ ./src/

# Build production bundle
RUN npm run build

# ---------- Stage 2: Production Nginx Server ----------
FROM nginx:alpine AS runner
WORKDIR /usr/share/nginx/html

# Clean default nginx website
RUN rm -rf ./*

# Copy built distribution from builder stage
COPY --from=builder /app/dist ./

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80 3000

HEALTHCHECK --interval=15s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://127.0.0.1:80/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
