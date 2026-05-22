import 'dotenv/config';
<<<<<<< HEAD
import { PrismaClient } from '../../generated/prisma/index.js'
=======
import { PrismaClient } from '../../generated/prisma/client.js'
>>>>>>> develop
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({
        connectionString: process.env.DATABASE_URL,
})

const prisma = new PrismaClient({ adapter })
console.log("DATABASE_URL =", process.env.DATABASE_URL);

export default prisma