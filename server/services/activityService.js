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

// ── Création d'activité avec détection de doublons ──────────────
export const createActivityService = async ({ title, description, category, city, creatorId }) => {
  const trimmedTitle = title.trim()

  // 1. Doublon exact (insensible à la casse)
  const exactMatch = await prisma.activities.findFirst({
    where: { title: { equals: trimmedTitle, mode: 'insensitive' } }
  })
  if (exactMatch) {
    const error = new Error('Une activité avec ce titre existe déjà')
    error.statusCode = 400
    throw error
  }

  // 2. Doublons similaires (mots-clés communs de plus de 3 lettres)
  const keywords = trimmedTitle
    .toLowerCase()
    .split(/\s+/)
    .filter(word => word.length > 3)

  if (keywords.length > 0) {
    const similar = await prisma.activities.findMany({
      where: {
        OR: keywords.map(word => ({
          title: { contains: word, mode: 'insensitive' }
        }))
      }
    })

    if (similar.length > 0) {
      const error = new Error('Des activités similaires existent déjà')
      error.statusCode = 409
      error.similarActivities = similar
      throw error
    }
  }

  // 3. Création + ajout du créateur comme membre
  const activity = await prisma.activities.create({
    data: {
      title: trimmedTitle,
      description,
      category,
      city,
      creator_id: creatorId
    }
  })

  await prisma.activity_members.create({
    data: {
      activity_id: activity.id,
      user_id: creatorId
    }
  })

  return activity
}
// ── Rejoindre une activité ───────────────────────────────────────
export const joinActivityService = async (activityId, userId) => {
  const activity = await prisma.activities.findUnique({ where: { id: parseInt(activityId) } })
  if (!activity) {
    const error = new Error('Activité non trouvée')
    error.statusCode = 404
    throw error
  }

  const existing = await prisma.activity_members.findUnique({
    where: { activity_id_user_id: { activity_id: parseInt(activityId), user_id: userId } }
  })
  if (existing) {
    const error = new Error('Vous êtes déjà membre de cette activité')
    error.statusCode = 400
    throw error
  }

  await prisma.activity_members.create({
    data: { activity_id: parseInt(activityId), user_id: userId }
  })

  return { message: 'Activité rejointe avec succès' }
}
// ── Quitter une activité ─────────────────────────────────────────
export const leaveActivityService = async (activityId, userId) => {
  const membership = await prisma.activity_members.findUnique({
    where: { activity_id_user_id: { activity_id: parseInt(activityId), user_id: userId } }
  })
  if (!membership) {
    const error = new Error("Vous n'êtes pas membre de cette activité")
    error.statusCode = 400
    throw error
  }

  await prisma.activity_members.delete({
    where: { activity_id_user_id: { activity_id: parseInt(activityId), user_id: userId } }
  })

  return { message: 'Activité quittée avec succès' }
}
// ── Membres d'une activité ───────────────────────────────────────
export const getActivityMembersService = async (activityId) => {
  const members = await prisma.activity_members.findMany({
    where: { activity_id: parseInt(activityId) },
    include: {
      user: { select: { id: true, first_name: true, last_name: true, avatar_url: true } }
    },
    orderBy: { joined_at: 'asc' }
  })

  return members.map(m => ({
    id: m.user.id,
    first_name: m.user.first_name,
    last_name: m.user.last_name,
    avatar_url: m.user.avatar_url
  }))
}