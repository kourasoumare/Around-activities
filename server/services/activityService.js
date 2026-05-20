import prisma from '../config/prisma.js'

export const getActivities = async (city, category) => {
  try {
    const where = {}
    if (city) where.city = city
    if (category) where.category = category

    const activities = await prisma.activities.findMany({ where })
    return activities
  } catch (error) {
    throw new Error(error.message)
  }
}


export const getActivityById = async (id) => {
  try {
    const activity = await prisma.activities.findUnique({
      where: { id: parseInt(id) },
      include: {
        groups: true
      }
    })
    return activity
  } catch (error) {
    throw new Error(error.message)
  }
}