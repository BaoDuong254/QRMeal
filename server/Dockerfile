# Build stage
FROM node:24.11.1-alpine AS builder

WORKDIR /app

# Install pnpm and openssl for Prisma
RUN corepack enable && corepack prepare pnpm@10.26.0 --activate \
    && apk add --no-cache openssl

# Copy package files and prisma schema
COPY package.json ./
COPY tsconfig.json ./
COPY prisma ./prisma

# Enable build scripts for native modules
RUN pnpm config set enable-pre-post-scripts true

# Install dependencies (generate lockfile in CI)
RUN pnpm install --no-frozen-lockfile

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
COPY prisma ./prisma

# Enable build scripts for native modules
RUN pnpm config set enable-pre-post-scripts true

# Install production dependencies (including prisma CLI for studio)
RUN pnpm install --no-frozen-lockfile --prod

# Install Prisma CLI for Prisma Studio
RUN pnpm add -g prisma@7.2.0

# Copy built application from builder
COPY --from=builder /app/dist ./dist

# Copy generated Prisma Client from builder
COPY --from=builder /app/generated ./generated

# Create data directory for SQLite database
RUN mkdir -p /app/data

# Expose port 4008 for Fastify server and 5555 for Prisma Studio
EXPOSE 4008 5555

# Start the application
CMD ["pnpm", "run", "start"]
