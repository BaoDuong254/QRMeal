# Build stage
FROM node:24.11.1-alpine AS builder

WORKDIR /app

# Install pnpm and openssl for Prisma
RUN corepack enable && corepack prepare pnpm@10.26.0 --activate \
    && apk add --no-cache openssl

# Copy package files and prisma schema
COPY package.json ./
COPY tsconfig.json ./
COPY prisma.config.ts ./
COPY prisma ./prisma

# Enable build scripts for native modules
RUN pnpm config set enable-pre-post-scripts true

# Install dependencies (generate lockfile in CI)
RUN pnpm install --no-frozen-lockfile

# Set dummy DATABASE_URL for Prisma generate (doesn't need real DB)
ENV DATABASE_URL="file:/app/prisma/dev.db"

# Generate Prisma Client
RUN pnpm prisma generate

# Copy source code
COPY src ./src

# Build the application
RUN pnpm run build

# Production stage
FROM node:24.11.1-alpine

WORKDIR /app

# Install wget for healthcheck and openssl for Prisma
RUN apk add --no-cache wget openssl

# Install pnpm
RUN corepack enable && corepack prepare pnpm@10.26.0 --activate

# Copy package files and prisma schema
COPY package.json ./
COPY prisma.config.ts ./
COPY prisma ./prisma

# Enable build scripts for native modules
RUN pnpm config set enable-pre-post-scripts true

# Install production dependencies
RUN pnpm install --no-frozen-lockfile --prod

# Set DATABASE_URL for Prisma (will be overridden by actual .env at runtime)
ENV DATABASE_URL="file:/app/prisma/dev.db"

# Generate Prisma Client again in production stage
RUN pnpm prisma generate

# Copy built application from builder
COPY --from=builder /app/dist ./dist

# Copy existing uploads folder with files
COPY uploads ./uploads

# Expose port 4008 for Fastify server and 5555 for Prisma Studio
EXPOSE 4008 5555

# Start the application with migration (use db push for development)
CMD ["sh", "-c", "pnpm prisma db push --accept-data-loss && pnpm run start"]
