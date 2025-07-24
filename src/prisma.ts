import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

const prisma = global.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// Prevent multiple instances of Prisma Client in development
if (process.env.NODE_ENV === 'development') {
  global.prisma = prisma;
}

export { prisma };
