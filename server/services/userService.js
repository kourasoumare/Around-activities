import prisma from "../config/prisma.js"

export const getMyGroups = async (userId) => {
  const groups = await prisma.memberships.findMany({
    where: { user_id: userId },
    include: {
      groups: {
        include: {
          activities: {
            select: { id: true, title: true, category: true }
          }
        }
      }
    }
  })
  // Retourne toujours un tableau, même vide
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
      birth_date: true,
      language: true,
      created_at: true,
      users_interests: {
        select: { interest: true }
      }
    }
  })
  if (!user) throw new Error('User not found')

  // Transformer users_interests en tableau simple
  return {
    ...user,
    interests: user.users_interests.map(i => i.interest)
  }
}

export const updateMe = async (id, data) => {
  const { first_name, last_name, city, origin, avatar_url, birth_date, language } = data
  const user = await prisma.users.update({
    where: { id: parseInt(id) },
    data: {
      first_name,
      last_name,
      city,
      origin,
      avatar_url,
      language,
      ...(birth_date ? { birth_date: new Date(birth_date) } : {})
    },
    select: {
      id: true,
      first_name: true,
      last_name: true,
      email: true,
      city: true,
      origin: true,
      avatar_url: true,
      birth_date: true,
      language: true
    }
  })
  return user
}
