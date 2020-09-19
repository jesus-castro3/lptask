import { PrismaClient } from '@prisma/client';

export default async(req, res) => {
  const prisma = new PrismaClient();
  const { user } = req.body;
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
    res.statusCode = 201;
    res.json({ result });
  } catch (e) {
    res.status(500);
    res.send("unable to create new user");
  } finally {
    prisma.$disconnect();
  }
}
