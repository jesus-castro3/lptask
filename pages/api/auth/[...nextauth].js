import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'
import Adapters from 'next-auth/adapters'
import { PrismaClient } from '@prisma/client'

let prisma

// this is to make sure we don't get connection errors on hot reloading
if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient()
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient()
  }
  prisma = global.prisma
}

const options = {
  providers: [
    Providers.GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET
    }),
    Providers.Google({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET
    })
  ],
  jwt: {
    secret: process.env.JWT_SECRET
  },
  database: process.env.POSTGRES_URL,
  adapter: Adapters.Prisma.Adapter({ prisma }),
  callbacks: {
    session: async (session, user) => {
      const [balance] = await prisma.balance.findMany({
        where: {
          userId: user.id
        }
      });
      
      if(!balance) {
        await prisma.balance.create({
          data: {
            balance: 0,
            author: {
              connect: { id: user.id }
            }
          }
        })
      }
      session.user.id = user.id;
      return Promise.resolve(session);
    }
  }
}

export default (req, res) => NextAuth(req, res, options)