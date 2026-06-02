import 'dotenv/config'
import { PrismaClient } from '../generated/prisma/index.js'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

async function main() {
  await prisma.activities.createMany({
    data: [
      { title: 'Sport & Fitness', category: 'Sport & Fitness', image_url: '/football.jpg' },
      { title: 'Art & Culture', category: 'Art & Culture', image_url: '/aquarelle.jpg' },
      { title: 'Restaurant & Cuisine', category: 'Restaurant & Cuisine', image_url: '/cuisine.jpg' },
      { title: 'Musique & Événements', category: 'Musique & Événements', image_url: '/guitare.jpg' },
      { title: 'Bien-être & Détente', category: 'Bien-être & Détente', image_url: '/yoga.jpg' },
      { title: 'Tech & Jeux vidéo', category: 'Tech & Jeux vidéo', image_url: '/coding.jpg' },
      { title: 'Nature & Plein air', category: 'Nature & Plein air', image_url: '/randonnee.jpg' },
      { title: 'Rencontres & Chill', category: 'Rencontres & Chill', image_url: '/photo.jpg' },
    ],
    skipDuplicates: true,
  })
  console.log('8 catégories créées !')
  await prisma.$disconnect()
}

main()
