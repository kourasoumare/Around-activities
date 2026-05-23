import prisma from '../server/config/prisma.js'


async function main() {
  await prisma.activities.createMany({
    data: [
      {
        title: "Foot du dimanche",
        description: "Match amical chaque dimanche matin au parc. Tous niveaux, bonne ambiance garantie.",
        category: "Sport & Fitness",
        city: "Paris",
      },
      {
        title: "Atelier peinture aquarelle",
        description: "Rejoins un groupe de passionné·e·s pour explorer la peinture aquarelle ensemble.",
        category: "Art & Culture",
        city: "Paris",
      },
      {
        title: "Cuisine du monde",
        description: "On se retrouve pour cuisiner ensemble une recette d'ailleurs. Chaque session, un nouveau pays.",
        category: "Restaurant & Cuisine",
        city: "Paris",
      },
      {
        title: "Jam session guitare",
        description: "Musiciens de tous niveaux, on improvise et on s'amuse !",
        category: "Musique & Événements",
        city: "Paris",
      },
      {
        title: "Yoga en plein air",
        description: "Séances de yoga dans les parcs parisiens chaque matin.",
        category: "Bien-être & Détente",
        city: "Paris",
      },
      {
        title: "Coding & Side projects",
        description: "On se retrouve dans un café pour coder sur nos side projects respectifs.",
        category: "Tech & Jeux vidéo",
        city: "Paris",
      },
      {
        title: "Randonnée en forêt",
        description: "Escapades vertes le week-end en forêt de Fontainebleau.",
        category: "Nature & Plein air",
        city: "Paris",
      },
      {
        title: "Café rencontre",
        description: "On se retrouve autour d'un café pour échanger et rencontrer de nouvelles personnes.",
        category: "Rencontres & Chill",
        city: "Paris",
      },
    ],
    skipDuplicates: true,
  })

  console.log("Activités insérées avec succès !")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })