import Decimal from 'decimal.js';
import { PrismaClient } from "@prisma/client";

// TODO: remove the fixed defaults, for testing purposes
export default async function updateBalance(userId = 14, type = 'add'){
  const prisma = new PrismaClient();
  try {    
    const { rate } = await prisma.rate.findOne({
      select: { rate: true },
      where: { type }
    });
    const { balance } = await prisma.balance.findOne({
      select: { balance: true },
      where: { userId }
    });
    const { balance: newBalance } = await prisma.balance.update({
      where: { userId },
      data: {
        balance: Decimal(balance).add(rate).toNumber()
      },
    });
    return newBalance;
  } catch(e) {
    console.error(e);
  } finally {
    prisma.$disconnect()
  }
}