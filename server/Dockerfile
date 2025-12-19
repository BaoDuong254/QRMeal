FROM node:24.11.1-slim AS base

# Install build dependencies for better-sqlite3 and OpenSSL for Prisma
RUN apt-get update && apt-get install -y \
        openssl \
        python3 \
        make \
        g++ \
    && rm -rf /var/lib/apt/lists/*

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@10.26.0 --activate

# Builder stage
FROM base AS builder

WORKDIR /app

# Copy package files and prisma schema
COPY package.json ./
COPY tsconfig.json ./
COPY prisma.config.ts ./
COPY prisma ./prisma

# Set DATABASE_URL for Prisma generate
ENV DATABASE_URL="file:/app/prisma/dev.db"

# Install dependencies with shamefully-hoist to avoid symlink issues
# Force rebuild of native modules
RUN pnpm install --no-frozen-lockfile --shamefully-hoist && \
    pnpm rebuild better-sqlite3

# Generate Prisma Client
RUN pnpm prisma generate

# Copy source code
COPY src ./src

# Build the application
RUN pnpm run build

# Production stage
FROM base AS production

WORKDIR /app

# Copy package files
COPY package.json ./
COPY tsconfig.json ./
COPY prisma.config.ts ./
COPY prisma ./prisma

# Set DATABASE_URL
ENV DATABASE_URL="file:/app/prisma/dev.db"

# Install only dependencies (including dev for prisma) with shamefully-hoist
RUN pnpm install --no-frozen-lockfile --shamefully-hoist && \
    pnpm rebuild better-sqlite3

# Generate Prisma Client
RUN pnpm prisma generate

# Copy built application from builder
COPY --from=builder /app/dist ./dist

# Copy generated Prisma client
COPY --from=builder /app/generated ./generated

# Copy uploads folder
COPY uploads ./uploads

# Expose port 4008 for Fastify server and 5555 for Prisma Studio
EXPOSE 4008 5555

# Start the application with migration (use db push for development)
CMD ["sh", "-c", "pnpm prisma db push --accept-data-loss && pnpm run start"]
