# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm and openssl for Prisma
RUN corepack enable && corepack prepare pnpm@10.25.0 --activate \
    && apk add --no-cache openssl

# Copy package files and prisma schema
COPY package.json ./
COPY tsconfig.json ./
COPY prisma ./prisma

# Install dependencies (generate lockfile in CI)
RUN pnpm install --no-frozen-lockfile

# Generate Prisma Client
RUN pnpm prisma generate

# Copy source code
COPY src ./src

# Build the application
RUN pnpm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Install wget for healthcheck and openssl for Prisma
RUN apk add --no-cache wget openssl

# Install pnpm
RUN corepack enable && corepack prepare pnpm@10.25.0 --activate

# Copy package files and prisma schema
COPY package.json ./
COPY prisma ./prisma

# Install production dependencies
RUN pnpm install --no-frozen-lockfile --prod

# Generate Prisma Client in production
RUN pnpm prisma generate

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
