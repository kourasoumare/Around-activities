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
export const getUserById = async (id) => {
    const user = await prisma.users.findUnique({
        where: { id: parseInt(id) },
        select: {
            id: true,
            first_name: true,
            last_name: true,
            city: true,
            origin: true,
            avatar_url: true,
            created_at: true
        }
    })
    if (!user) throw new Error('User not found')
    return user
}

export const updateMe = async (id, data) => {
    const { first_name, last_name, city, origin, avatar_url } = data
    const user = await prisma.users.update({
        where: { id: parseInt(id) },
        data: { first_name, last_name, city, origin, avatar_url },
        select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            city: true,
            origin: true,
            avatar_url: true
        }
    })
    return user
}