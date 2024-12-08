// client.ts
// Import the Prisma Client generated for Data Proxy
import { env } from "./deps.ts";
import { PrismaClient } from "./deps.ts";

// Initialize the Prisma Client
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: env.DATABASE_URL,
    },
  },
});

export default prisma;
