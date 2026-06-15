import prisma from '../config/prisma.js'

export const getActivities = async (city, category) => {
  const where = {}

  if (category) {
    where.category = category
  }

  if (city) {
    where.city = city
  }

  const activities = await prisma.activities.findMany({
    where,
    include: {
      _count: {
        select: {
          groups: true,
          activity_members: true
        }
      }
    },
    orderBy: { created_at: 'desc' }
  })

  return activities
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
          _count: { select: { memberships: true } },
          memberships: {
            select: {
              user_id: true
            }
          }
        }
      }
    }
  })
  return activity
}

export const createActivityService = async ({ title, description, category, city, creatorId }) => {
  const trimmedTitle = title.trim()

  const exactMatch = await prisma.activities.findFirst({
    where: { title: { equals: trimmedTitle, mode: 'insensitive' } }
  })
  if (exactMatch) {
    const error = new Error('Une activité avec ce titre existe déjà')
    error.statusCode = 400
    throw error
  }

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

export const updateActivityService = async (activityId, userId, { title, description, category, city, image_url }) => {
  const activity = await prisma.activities.findUnique({ where: { id: parseInt(activityId) } })
  if (!activity) {
    const error = new Error('Activité non trouvée')
    error.statusCode = 404
    throw error
  }

  if (activity.creator_id !== userId) {
    const error = new Error('Non autorisé')
    error.statusCode = 403
    throw error
  }

  const data = {}
  if (title !== undefined) data.title = title.trim()
  if (description !== undefined) data.description = description
  if (category !== undefined) data.category = category
  if (city !== undefined) data.city = city
  if (image_url !== undefined) data.image_url = image_url

  return prisma.activities.update({
    where: { id: parseInt(activityId) },
    data
  })
}

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
