import Decimal from 'decimal.js';
import { PrismaClient } from '@prisma/client';
import { getSession } from 'next-auth/client';
import { OPERATIONS_ENUM } from '../constants/index'

export default async function updateBalance(req, res, next) {
  const prisma = new PrismaClient();
  const { type } = req.body;
  const { user } =  await getSession({ req });
  console.log(type);
  if(!OPERATIONS_ENUM[type]) {
    res.json({
      error: true,
      errorMsg: `Unsupported type of ${type}`
    });
    throw Error();
  }
  try {    
    const { rate } = await prisma.rate.findOne({
      select: { rate: true },
      where: { type }
    });
    const { balance } = await prisma.balance.findOne({
      select: { balance: true },
      where: { userId: user.id }
    });
    const { balance: newBalance } = await prisma.balance.update({
      where: { userId: user.id },
      data: {
        balance: Decimal(balance).add(rate).toNumber()
      },
    });
    req.balance = newBalance;
    next();
  } catch(e) {
    console.error(e);
    throw Error('Unable to update balance', e)
  } finally {
    prisma.$disconnect()
  }
}