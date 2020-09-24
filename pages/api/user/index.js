import { PrismaClient } from '@prisma/client';
import { setCookie, destroyCookie } from 'nookies';
import nc from 'next-connect';

const handler = nc()
  .post(async (req, res) => {
    const prisma = new PrismaClient();
      const { user } = JSON.parse(req.body);
      console.log(user);
      try {
        const result = await prisma.users.create({
          data: {
            user,
            balance: {
              create: {
                balance: 0
              }
            }
          }
        });
        setCookie({ res }, 'userId', result.id, {
          maxAge: 30 * 24 * 60 * 60,
          path: '/',
        });
        res.statusCode = 201;
        
        res.json({ result });
      } catch (e) {
        res.status(500);
        res.send("unable to create new user");
      } finally {
        prisma.$disconnect();
    }
  });

export default handler;
