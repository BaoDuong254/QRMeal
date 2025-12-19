import { PrismaClient } from "@generated/prisma/client";

const prisma = new PrismaClient({
  log: ["info"],
});

export default prisma;
