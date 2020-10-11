const { PrismaClient, operations } = require('@prisma/client');

const prisma = new PrismaClient();

async function seed() {
  await prisma.rate.upsert({
    where: { id: 1},
    update: { rate: 0.1, type: operations.add },
    create: { rate: 0.1, type: operations.add }
  });
  await prisma.rate.upsert({
    where: { id: 2},
    update: { rate: 0.1, type: operations.subtract },
    create: { rate: 0.1, type: operations.subtract }
  });
  await prisma.rate.upsert({
    where: { id: 3},
    update: { rate: 0.2, type: operations.times },
    create: { rate: 0.2, type: operations.times }
  });
  await prisma.rate.upsert({
    where: { id: 4},
    update: { rate: 0.2, type: operations.divide },
    create: { rate: 0.2, type: operations.divide }
  });
  await prisma.rate.upsert({
    where: { id: 5},
    update: { rate: 0.5, type: operations.root },
    create: { rate: 0.5, type: operations.root }
  });
  await prisma.rate.upsert({
    where: { id: 6},
    update: { rate: 0.5, type: operations.random },
    create: { rate: 0.5, type: operations.random }
  });

  await prisma.rate.upsert({
    where: { id: 7},
    update: { rate: 1, type: operations.equation },
    create: { rate: 1, type: operations.equation }
  });
  console.log('Rate seed added::', operations);
}

seed()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
});