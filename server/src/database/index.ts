import envConfig from "@/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@generated/prisma/client";

const connectionString = envConfig.DATABASE_URL;
const adapter = new PrismaBetterSqlite3({ url: connectionString });

const prisma = new PrismaClient({
  adapter,
  log: ["info"],
});

export default prisma;
