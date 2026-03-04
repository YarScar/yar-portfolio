# ============================================
# STAGE 1: BUILD
# Purpose: Install dependencies and build the Next.js app
# ============================================

# Use Node.js 20 Alpine (lightweight Linux) as base image
# Alpine = smaller image size (~50MB vs ~300MB)
FROM node:20-alpine AS builder

# Set working directory inside the container
WORKDIR /app

# Copy package files first (for Docker layer caching)
# If these don't change, Docker reuses this layer = faster builds
COPY package*.json ./

# Copy Prisma schema (needed for npm ci to generate Prisma client)
COPY prisma ./prisma

# Install dependencies
# npm ci = clean install (faster, uses exact versions from package-lock.json)
RUN npm ci

# Copy all source code
# Done AFTER npm ci so code changes don't invalidate dependency cache
COPY . .

# Set dummy DATABASE_URL for build time
# Next.js needs this during build, but we're not actually connecting to a DB
# The real DB connection happens at runtime in Stage 2
ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"

# Build the Next.js app
# Creates optimized production build in .next folder
# With output: 'standalone', creates minimal self-contained server
RUN npm run build

# ============================================
# STAGE 2: RUN (Production)
# Purpose: Create minimal image with only what's needed to run
# ============================================

# Start fresh with clean Alpine image (don't carry build artifacts)
FROM node:20-alpine
WORKDIR /app

# Copy ONLY the standalone server (not all node_modules or source code)
# This is why the image is 90% smaller!
COPY --from=builder /app/.next/standalone ./

# Copy static files (images, CSS, JS) that Next.js built
COPY --from=builder /app/.next/static ./.next/static

# Copy public assets (favicon, images, etc.)
COPY --from=builder /app/public ./public

# Copy Prisma schema (needed for database operations at runtime)
COPY --from=builder /app/prisma ./prisma

# Tell Node.js we're in production (enables optimizations)
ENV NODE_ENV=production

# Expose port 3000 (where Next.js runs)
# This doesn't actually publish the port, docker-compose.yml does that
EXPOSE 3000

# Start the standalone Next.js server
# Standalone mode creates a server.js file instead of using npm start
CMD ["node", "server.js"]