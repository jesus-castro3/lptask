import { PrismaClient } from '@prisma/client';

export default async (req, res) => {
  const prisma = new PrismaClient();
  const rates = await prisma.rate.findMany();
  res.json({
    rates
  });
}
