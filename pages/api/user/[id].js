import { PrismaClient } from '@prisma/client';
import { setCookie } from 'nookies';
import nc from 'next-connect';

const handler = nc()
  .get(async (req, res) => {
    const prisma = new PrismaClient();
    const { id } = req.query;
    try {
      const { balance } = await prisma.balance.findOne({
        select: { balance: true },
        where: { userId: Number(id) }
      });
  
      res.json({
        balance,
        userId: id
      });
    } catch(e) {
      console.error('Ooops something went wrong');
      res.statusCode = 500;
      res.text('Unable to get User data');
    }
  })
  .delete(async (req, res) => {
    try {
      res.setHeader('Set-Cookie', 'userId=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT');
      res.statusCode = 200;
      res.send('User session data removed');
      res.json({ error: false })
    } catch (e) {
      res.statusCode = 500;
      res.send('Ooops something happened');
      res.json({ error: true });
    } 
  });

export default handler;