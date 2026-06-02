import prisma from '../config/prisma.js'

export const sendFriendRequest = async (requesterId, receiverId) => {
  const existing = await prisma.friendships.findFirst({
    where: {
      OR: [
        { requester_id: requesterId, receiver_id: receiverId },
        { requester_id: receiverId, receiver_id: requesterId }
      ]
    }
  })
  if (existing) {
    const error = new Error('Friendship already exists')
    error.statusCode = 400
    throw error
  }

  return await prisma.friendships.create({
    data: { requester_id: requesterId, receiver_id: receiverId, status: 'pending' }
  })
}

export const acceptFriendRequest = async (requestId, userId) => {
  const friendship = await prisma.friendships.findUnique({ where: { id: requestId } })
  if (!friendship) {
    const error = new Error('Request not found'); error.statusCode = 404; throw error
  }
  if (friendship.receiver_id !== userId) {
    const error = new Error('Unauthorized'); error.statusCode = 403; throw error
  }
  return await prisma.friendships.update({ where: { id: requestId }, data: { status: 'accepted' } })
}

export const refuseFriendRequest = async (requestId, userId) => {
  const friendship = await prisma.friendships.findUnique({ where: { id: requestId } })
  if (!friendship) {
    const error = new Error('Request not found'); error.statusCode = 404; throw error
  }
  if (friendship.receiver_id !== userId) {
    const error = new Error('Unauthorized'); error.statusCode = 403; throw error
  }
  return await prisma.friendships.update({ where: { id: requestId }, data: { status: 'refused' } })
}

export const getFriends = async (userId) => {
  const friendships = await prisma.friendships.findMany({
    where: {
      status: 'accepted',
      OR: [{ requester_id: userId }, { receiver_id: userId }]
    },
    include: {
      requester: { select: { id: true, first_name: true, last_name: true, avatar_url: true } },
      receiver: { select: { id: true, first_name: true, last_name: true, avatar_url: true } }
    }
  })
  return friendships.map(f => f.requester_id === userId ? f.receiver : f.requester)
}

export const getFriendRequests = async (userId) => {
  const requests = await prisma.friendships.findMany({
    where: { receiver_id: userId, status: 'pending' },
    include: {
      requester: { select: { id: true, first_name: true, last_name: true, avatar_url: true } }
    }
  })
  return requests.map(r => ({ id: r.id, requester: r.requester }))
}

export const getFriendshipStatus = async (userId, otherUserId) => {
  const friendship = await prisma.friendships.findFirst({
    where: {
      OR: [
        { requester_id: userId, receiver_id: otherUserId },
        { requester_id: otherUserId, receiver_id: userId }
      ]
    }
  })
  if (!friendship) return null
  return { status: friendship.status, requester_id: friendship.requester_id }
}
