import prisma from '../config/prisma.js'

export const createGroupService = async (groupData, userId) => {
  const group = await prisma.groups.create({
    data: { ...groupData, creator_id: userId }
  })
  await prisma.memberships.create({
    data: { user_id: userId, group_id: group.id }
  })
  return group
}

export const getGroupByIdService = async (id) => {
  return await prisma.groups.findUnique({
    where: { id: parseInt(id) },
    include: {
      activities: { select: { title: true, category: true } },
      users: { select: { id: true, first_name: true, last_name: true } },
      memberships: {
        include: {
          users: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
              avatar_url: true,
              city: true,
              origin: true,
              birth_date: true,
              language: true,
              users_interests: { select: { interest: true } }
            }
          }
        }
      }
    }
  })
}
