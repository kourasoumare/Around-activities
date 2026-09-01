import prisma from '../config/prisma.js'
import { getIO } from '../config/socket.js'

export const sendFriendRequestService = async (requesterId, receiverId) => {
  if (requesterId === receiverId) {
    const err = new Error('Vous ne pouvez pas vous ajouter vous-même')
    err.statusCode = 400
    throw err
  }

  const existing = await prisma.friendships.findFirst({
    where: {
      OR: [
        { requester_id: requesterId, receiver_id: receiverId },
        { requester_id: receiverId, receiver_id: requesterId }
      ]
    }
  })

  if (existing) {
    const err = new Error("Une demande d'ami existe déjà")
    err.statusCode = 400
    throw err
  }

  const friendship = await prisma.friendships.create({
    data: { requester_id: requesterId, receiver_id: receiverId, status: 'pending' },
    include: {
      requester: { select: { id: true, first_name: true, last_name: true, avatar_url: true } }
    }
  })

  const io = getIO()
  if (io) {
    io.to(`user:${receiverId}`).emit('friend_request', friendship.requester)

    // Créer et envoyer la notification
    const { createNotification } = await import('./notificationService.js')
    const notif = await createNotification({
      user_id: receiverId,
      type: 'friend_request',
      content: `${friendship.requester.first_name} t'a envoyé une demande d'ami`,
      link: `/demandes-ami`
    })
    io.to(`user:${receiverId}`).emit('new_notification', notif)
  }

  return friendship
}

export const acceptFriendRequestService = async (requestId, userId) => {
  const friendship = await prisma.friendships.findUnique({
    where: { id: parseInt(requestId) }
  })

  if (!friendship) {
    const err = new Error('Demande introuvable')
    err.statusCode = 404
    throw err
  }

  if (friendship.receiver_id !== userId) {
    const err = new Error('Non autorisé')
    err.statusCode = 403
    throw err
  }

  return prisma.friendships.update({
    where: { id: parseInt(requestId) },
    data: { status: 'accepted' }
  })
}

export const refuseFriendRequestService = async (requestId, userId) => {
  const friendship = await prisma.friendships.findUnique({
    where: { id: parseInt(requestId) }
  })

  if (!friendship) {
    const err = new Error('Demande introuvable')
    err.statusCode = 404
    throw err
  }

  if (friendship.receiver_id !== userId) {
    const err = new Error('Non autorisé')
    err.statusCode = 403
    throw err
  }

  return prisma.friendships.update({
    where: { id: parseInt(requestId) },
    data: { status: 'refused' }
  })
}

export const getFriendsListService = async (userId) => {
  const friendships = await prisma.friendships.findMany({
    where: {
      status: 'accepted',
      OR: [{ requester_id: userId }, { receiver_id: userId }]
    },
    include: {
      requester: { select: { id: true, first_name: true, last_name: true, avatar_url: true } },
      receiver:  { select: { id: true, first_name: true, last_name: true, avatar_url: true } }
    }
  })

  return friendships.map(f => ({
    id: f.id,
    status: f.status,
    friend: f.requester_id === userId ? f.receiver : f.requester
  }))
}

export const getPendingRequestsService = async (userId) => {
  return prisma.friendships.findMany({
    where: { receiver_id: userId, status: 'pending' },
    include: {
      requester: { select: { id: true, first_name: true, last_name: true, avatar_url: true } }
    }
  })
}

export const getFriendshipStatusService = async (userId, otherUserId) => {
  const friendship = await prisma.friendships.findFirst({
    where: {
      OR: [
        { requester_id: userId, receiver_id: parseInt(otherUserId) },
        { requester_id: parseInt(otherUserId), receiver_id: userId }
      ]
    }
  })

  if (!friendship) return { status: 'none' }
  return {
    status: friendship.status,
    request_id: friendship.id,
    requester_id: friendship.requester_id
  }
}
