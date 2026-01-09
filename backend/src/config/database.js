const { PrismaClient } = require('@prisma/client');

// Create a singleton Prisma client instance
let prisma;

const createPrismaClient = () => {
  if (!prisma) {
    prisma = new PrismaClient({
      log: ['error', 'warn'],
      datasources: {
        db: {
          url: process.env.DATABASE_URL
        }
      }
    });

    // Handle graceful shutdown
    process.on('beforeExit', async () => {
      console.log('Disconnecting from database...');
      await prisma.$disconnect();
    });

    process.on('SIGINT', async () => {
      console.log('Received SIGINT, disconnecting from database...');
      await prisma.$disconnect();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      console.log('Received SIGTERM, disconnecting from database...');
      await prisma.$disconnect();
      process.exit(0);
    });
  }

  return prisma;
};

module.exports = {
  prisma: createPrismaClient(),
  createPrismaClient
};