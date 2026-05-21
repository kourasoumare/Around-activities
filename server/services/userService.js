import prisma from "../config/prisma.js"

export const getMyGroups = async (userId) => {
  // chercher dans memberships tous les groupes de l'user
  const groups = await prisma.memberships.findMany({
    where: { user_id: userId } ,
    include: { groups: true }
  })
  if (groups.length === 0) {
  return { message: "Vous ne faites partie d'aucun groupe pour le moment" }
}
  return groups
}