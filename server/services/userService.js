import prisma from "../config/prisma.js"

export const getMyGroups = async (userId) => {
  const memberships = await prisma.memberships.findMany({
    where: { user_id: userId },
    include: {
      groups: {
        include: {
          activities: { select: { id: true, title: true, category: true } }
        }
      }
    }
  })
  return memberships.map(m => m.groups).filter(Boolean)
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
      users_interests: { select: { interest: true } }
    }
  })
  if (!user) throw new Error('User not found')

  return {
    ...user,
    interests: user.users_interests.map(i => i.interest)
  }
}

export const updateMe = async (id, data) => {
  const userId = parseInt(id)
  const { firstName, lastName, city, origin, birthDate, language, avatar_url, interests } = data

  const user = await prisma.users.update({
    where: { id: userId },
    data: {
      ...(firstName !== undefined && { first_name: firstName }),
      ...(lastName !== undefined && { last_name: lastName }),
      ...(city !== undefined && { city }),
      ...(origin !== undefined && { origin }),
      ...(avatar_url !== undefined && { avatar_url }),
      ...(language !== undefined && { language }),
      ...(birthDate ? { birth_date: new Date(birthDate) } : {})
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
      language: true,
      is_new_user: true
    }
  })

  if (interests && Array.isArray(interests)) {
    await prisma.users_interests.deleteMany({ where: { user_id: userId } })
    if (interests.length > 0) {
      await prisma.users_interests.createMany({
        data: interests.map(interest => ({ user_id: userId, interest }))
      })
    }
  }

  return user
}
