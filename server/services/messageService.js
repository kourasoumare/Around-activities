import prisma from '../config/prisma.js'

const senderSelect = {
  select: { id: true, first_name: true, last_name: true, avatar_url: true }
}

export const getGroupMessagesService = async (groupId) => {
  return prisma.messages.findMany({
    where: { group_id: parseInt(groupId) },
    include: { sender: senderSelect },
    orderBy: { created_at: 'asc' }
  })
}

export const getPrivateMessagesService = async (userId, otherUserId) => {
  return prisma.messages.findMany({
    where: {
      group_id: null,
      OR: [
        { sender_id: userId, receiver_id: parseInt(otherUserId) },
        { sender_id: parseInt(otherUserId), receiver_id: userId }
      ]
    },
    include: { sender: senderSelect },
    orderBy: { created_at: 'asc' }
  })
}

export const createMessageService = async ({ sender_id, group_id, receiver_id, content }) => {
  return prisma.messages.create({
    data: {
      sender_id,
      group_id: group_id || null,
      receiver_id: receiver_id || null,
      content
    },
    include: { sender: senderSelect }
  })
}

// ── Messages du chat communautaire d'une activité ─────────────────
export const getActivityMessagesService = async (activityId) => {
  return prisma.activity_messages.findMany({
    where: { activity_id: parseInt(activityId) },
    include: { sender: senderSelect },
    orderBy: { created_at: 'asc' }
  })
}

export const createActivityMessageService = async ({ activity_id, sender_id, content }) => {
  return prisma.activity_messages.create({
    data: {
      activity_id: parseInt(activity_id),
      sender_id,
      content
    },
    include: { sender: senderSelect }
  })
}