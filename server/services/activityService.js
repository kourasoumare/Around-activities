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