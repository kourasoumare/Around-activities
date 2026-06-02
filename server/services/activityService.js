import prisma from '../config/prisma.js'

export const getActivities = async (city, category) => {
  const where = {}
  if (city) where.city = city
  if (category) where.category = category

  return await prisma.activities.findMany({
    where,
    include: { _count: { select: { groups: true } } }
  })
}

export const getActivityById = async (id) => {
  const activity = await prisma.activities.findUnique({
    where: { id: parseInt(id) },
    include: {
      groups: {
        select: {
          id: true,
          name: true,
          description: true,
          meeting_date: true,
          location: true,
          max_members: true,
          contact_link: true,
          creator_id: true,
          _count: { select: { memberships: true } }
        }
      }
    }
  })
  return activity
}
