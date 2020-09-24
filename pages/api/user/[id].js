import { PrismaClient } from '@prisma/client';
import { setCookie } from 'nookies';
import nc from 'next-connect';

const handler = nc()
  .get(async (req, res) => {
    const prisma = new PrismaClient();
    const {
      id
    } = req.query;
    const {
      balance
    } = await prisma.balance.findOne({
      select: {
        balance: true
      },
      where: {
        userId: Number(id)
      }
    });

    res.json({
      balance,
      userId: id
    });
  })
  .delete(async (req, res) => {
    res.setHeader('Set-Cookie', 'userId=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT');
    res.statusCode = 200;
    res.send('User session data removed');
  });

export default handler;