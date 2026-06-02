import prisma from '../config/prisma.js'

const SENDER_SELECT = {
  sender: { select: { id: true, first_name: true, last_name: true, avatar_url: true } }
}

export const getGroupMessages = async (groupId) => {
  return await prisma.messages.findMany({
    where: { group_id: parseInt(groupId) },
    include: SENDER_SELECT,
    orderBy: { created_at: 'asc' }
  })
}

export const getPrivateMessages = async (userId, otherUserId) => {
  const uid = parseInt(userId)
  const oid = parseInt(otherUserId)
  return await prisma.messages.findMany({
    where: {
      OR: [
        { sender_id: uid, receiver_id: oid },
        { sender_id: oid, receiver_id: uid }
      ]
    },
    include: SENDER_SELECT,
    orderBy: { created_at: 'asc' }
  })
}

export const createMessageService = async ({ sender_id, group_id, receiver_id, content }) => {
  return await prisma.messages.create({
    data: {
      sender_id,
      group_id: group_id || null,
      receiver_id: receiver_id || null,
      content
    },
    include: SENDER_SELECT
  })
}
