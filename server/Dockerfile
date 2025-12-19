# Build stage
FROM node:24.11.1-alpine AS builder

WORKDIR /app

# Install build dependencies for native modules (better-sqlite3)
RUN corepack enable && corepack prepare pnpm@10.26.0 --activate \
    && apk add --no-cache \
        openssl \
        python3 \
        make \
        g++ \
        gcc \
        libc-dev

# Copy package files and prisma schema
COPY package.json ./
COPY tsconfig.json ./
COPY prisma.config.ts ./
COPY prisma ./prisma

# Enable build scripts for native modules
RUN pnpm config set enable-pre-post-scripts true

# Install ALL dependencies (including devDependencies for build)
RUN pnpm install --no-frozen-lockfile

# Set dummy DATABASE_URL for Prisma generate (doesn't need real DB)
ENV DATABASE_URL="file:/app/prisma/dev.db"

# Generate Prisma Client
RUN pnpm prisma generate

# Copy source code
COPY src ./src

# Build the application
RUN pnpm run build

# Rebuild better-sqlite3 to ensure native bindings are compiled for this platform
RUN pnpm rebuild better-sqlite3

# Production stage
FROM node:24.11.1-alpine

WORKDIR /app

# Install build tools required for native modules compilation
RUN apk add --no-cache \
        wget \
        openssl \
        libc6-compat \
        libstdc++ \
        python3 \
        make \
        g++ \
        gcc \
        libc-dev

# Install pnpm
RUN corepack enable && corepack prepare pnpm@10.26.0 --activate

# Copy package files and prisma schema
COPY package.json ./
COPY prisma.config.ts ./
COPY prisma ./prisma

# Enable build scripts for native modules
RUN pnpm config set enable-pre-post-scripts true

# Install ALL dependencies first (needed for native module compilation)
RUN pnpm install --no-frozen-lockfile

# Force rebuild better-sqlite3 native bindings for this platform
RUN pnpm rebuild better-sqlite3

# Now prune devDependencies after native modules are compiled
RUN pnpm prune --prod

# Copy built application from builder FIRST (without generated/)
COPY --from=builder /app/dist ./dist

# Remove old generated from dist if exists (to avoid conflicts)
RUN rm -rf ./dist/generated

# Set DATABASE_URL for Prisma (will be overridden by actual .env at runtime)
ENV DATABASE_URL="file:/app/prisma/dev.db"

# Re-install prisma CLI temporarily for generate (it's a devDep)
RUN pnpm add prisma --save-dev

# Generate Prisma Client AFTER copying dist (skip dbml generator)
# This creates fresh /app/generated/ that matches production runtime
RUN pnpm prisma generate --generator client

# Copy generated into dist where the compiled code expects it
RUN cp -r ./generated ./dist/

# Copy existing uploads folder with files
COPY uploads ./uploads

# Expose port 4008 for Fastify server and 5555 for Prisma Studio
EXPOSE 4008 5555

# Start the application with migration (use db push for development)
CMD ["sh", "-c", "pnpm prisma db push --accept-data-loss && pnpm run start"]
