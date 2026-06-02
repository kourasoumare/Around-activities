import * as friendshipService from '../services/friendshipService.js'
import { getIo } from '../config/socket.js'
import prisma from '../config/prisma.js'

export const sendFriendRequest = async (req, res) => {
  try {
    const requesterId = req.user.id
    const receiverId = parseInt(req.params.userId)

    const friendship = await friendshipService.sendFriendRequest(requesterId, receiverId)

    const io = getIo()
    if (io) {
      const requester = await prisma.users.findUnique({
        where: { id: requesterId },
        select: { id: true, first_name: true, last_name: true, avatar_url: true }
      })
      io.to(`user:${receiverId}`).emit('friend_request', requester)
    }

    res.status(201).json({ message: 'Friend request sent', friendship })
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message })
  }
}

export const acceptFriendRequest = async (req, res) => {
  try {
    const friendship = await friendshipService.acceptFriendRequest(parseInt(req.params.requestId), req.user.id)
    res.status(200).json({ message: 'Friend request accepted', friendship })
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message })
  }
}

export const refuseFriendRequest = async (req, res) => {
  try {
    const friendship = await friendshipService.refuseFriendRequest(parseInt(req.params.requestId), req.user.id)
    res.status(200).json({ message: 'Friend request refused', friendship })
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message })
  }
}

export const getFriends = async (req, res) => {
  try {
    const friends = await friendshipService.getFriends(req.user.id)
    res.status(200).json(friends)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const getFriendRequests = async (req, res) => {
  try {
    const requests = await friendshipService.getFriendRequests(req.user.id)
    res.status(200).json(requests)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const getFriendshipStatus = async (req, res) => {
  try {
    const status = await friendshipService.getFriendshipStatus(req.user.id, parseInt(req.params.userId))
    res.status(200).json(status)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
