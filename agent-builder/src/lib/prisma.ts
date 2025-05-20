// src/lib/prisma.ts
import { PrismaClient } from '@/generated/prisma';

console.log("Attempting to initialize Prisma Client...");
console.log("DATABASE_URL from env:", process.env.DATABASE_URL);

declare global {
  // This allows global `var` declarations for the prisma instance
  // eslint-disable-next-line no-unused-vars
  var prisma: PrismaClient | undefined;
}

const prismaInstance =
  global.prisma ||
  new PrismaClient({
    // Optional: You can pass Prisma Client options here, e.g., logging
    // log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : [],
  });

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prismaInstance;
}

export const prisma = prismaInstance;