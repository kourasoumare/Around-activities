import prisma from '../config/prisma.js'

export const createGroupService = async (groupData, userId) => {

  const group = await prisma.groups.create({
    data: {
      ...groupData,
      creator_id: userId
    }
  })

  await prisma.memberships.create({
    data: {
      user_id: userId,
      group_id: group.id
    }
  })

  return group
}