import 'dotenv/config'
import { PrismaClient } from '../generated/prisma/index.js'
import { PrismaPg } from '@prisma/adapter-pg'
import { ACTIVITY_CATEGORIES } from '../server/constants/activityCategories.js'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

async function main() {
  await prisma.activities.createMany({
    data: ACTIVITY_CATEGORIES,
    skipDuplicates: true
  })
  console.log('8 categories creees !')
  await prisma.$disconnect()
}

main()
