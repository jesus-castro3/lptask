import { PrismaClient } from '@prisma/client';

export default async (req, res) => {
  const prisma = new PrismaClient();
  const { id } = req.query;
  const { balance } = await prisma.balance.findOne({
    select: { balance: true },
    where: { userId: Number(id) }
  });

  res.json({
    balance,
    userId: id
  });
}
