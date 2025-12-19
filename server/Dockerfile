# Single stage build with Debian for better native module compatibility
FROM node:20-slim

WORKDIR /app

# Install build dependencies for native modules (better-sqlite3)
RUN apt-get update && apt-get install -y \
        openssl \
        python3 \
        make \
        g++ \
        gcc \
        build-essential \
    && rm -rf /var/lib/apt/lists/*

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@10.26.0 --activate

# Copy package files and prisma schema
COPY package.json ./
COPY tsconfig.json ./
COPY prisma.config.ts ./
COPY prisma ./prisma

# Enable build scripts for native modules
RUN pnpm config set enable-pre-post-scripts true

# Install ALL dependencies (including devDependencies for build)
RUN pnpm install --no-frozen-lockfile

# Force rebuild better-sqlite3 native bindings for this platform
RUN pnpm rebuild better-sqlite3

# Verify the native binding exists
RUN find /app/node_modules -name "better_sqlite3.node" -type f 2>/dev/null || echo "No binding found"

# Set DATABASE_URL for Prisma generate
ENV DATABASE_URL="file:/app/prisma/dev.db"

# Generate Prisma Client
RUN pnpm prisma generate

# Copy source code
COPY src ./src

# Build the application
RUN pnpm run build

# Copy existing uploads folder with files
COPY uploads ./uploads

# Expose port 4008 for Fastify server and 5555 for Prisma Studio
EXPOSE 4008 5555

# Start the application with migration (use db push for development)
CMD ["sh", "-c", "pnpm prisma db push --accept-data-loss && pnpm run start"]
