import { PrismaClient } from "@prisma/client";

// Standard PrismaClient initialization for Prisma 6.
// This is reliable on Windows and correctly inherits the DATABASE_URL from the environment.
const globalForPrisma = global as unknown as { medicare_db_v2: PrismaClient };

export const db = globalForPrisma.medicare_db_v2 || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.medicare_db_v2 = db;
}
