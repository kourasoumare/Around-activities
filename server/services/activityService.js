import prisma from '../config/prisma.js'
import {
  ACTIVITY_CATEGORIES,
  getActivityCategoryVariants,
  resolveActivityCategory
} from '../constants/activityCategories.js'

const CATEGORY_BY_VALUE = new Map(
  ACTIVITY_CATEGORIES.flatMap(item => {
    return getActivityCategoryVariants(item.category).map(value => [value, item])
  })
)

const normalizeActivity = (activity) => {
  const baseCategory = CATEGORY_BY_VALUE.get(activity.category)
  if (!baseCategory) return activity

  return {
    ...activity,
   
    category: baseCategory.category,
    image_url: activity.image_url || baseCategory.image_url
  }
}

export const getActivities = async (city, category) => {
  const where = {}
  if (category) {
    const resolvedCategory = resolveActivityCategory(category)
    if (!resolvedCategory) return []
    where.category = { in: getActivityCategoryVariants(resolvedCategory) }
  } else {
    where.category = {
      in: ACTIVITY_CATEGORIES.flatMap(item => getActivityCategoryVariants(item.category))
    }
  }

  const activities = await prisma.activities.findMany({
    where,
    include: {
      _count: {
        select: {
          groups: city ? { where: { city } } : true
        }
      }
    }
  })

  const activitiesByCategory = new Map()
  for (const activity of activities.map(normalizeActivity)) {
    const existingActivity = activitiesByCategory.get(activity.category)
    if (!existingActivity) {
      activitiesByCategory.set(activity.category, activity)
      continue
    }

    activitiesByCategory.set(activity.category, {
      ...existingActivity,
      _count: {
        groups: existingActivity._count.groups + activity._count.groups
      }
    })
  }

  return ACTIVITY_CATEGORIES
    .map(item => activitiesByCategory.get(item.category))
    .filter(Boolean)
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
