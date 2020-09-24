const { PrismaClient, operations } = require('@prisma/client');

const prisma = new PrismaClient();

async function seed() {
  await prisma.rate.create({
    data: {
      rate: 0.1,
      type: operations.add
    }
  });
  await prisma.rate.create({
    data: {
      rate: 0.1,
      type: operations.subtract
    }
  });
  await prisma.rate.create({
    data: {
      rate: 0.2,
      type: operations.times
    }
  });
  await prisma.rate.create({
    data: {
      rate: 0.2,
      type: operations.divide
    }
  });
  await prisma.rate.create({
    data: {
      rate: 0.5,
      type: operations.root
    }
  });
  await prisma.rate.create({
    data: {
      rate: 0.5,
      type: operations.random
    }
  });
  console.log('Rate seed added::', operations);
}

seed()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
});