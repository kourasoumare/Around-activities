import {
  sendFriendRequestService,
  acceptFriendRequestService,
  refuseFriendRequestService,
  getFriendsListService,
  getPendingRequestsService,
  getFriendshipStatusService
} from '../services/friendshipService.js'

export const sendFriendRequest = async (req, res) => {
  try {
    const friendship = await sendFriendRequestService(req.user.id, parseInt(req.params.userId))
    res.status(201).json({ message: "Demande d'ami envoyée", friendship })
  } catch (error) {
    console.error(error)
    res.status(error.statusCode || 500).json({ error: error.message })
  }
}

export const acceptFriendRequest = async (req, res) => {
  try {
    const friendship = await acceptFriendRequestService(req.params.requestId, req.user.id)
    res.json({ message: 'Demande acceptée', friendship })
  } catch (error) {
    console.error(error)
    res.status(error.statusCode || 500).json({ error: error.message })
  }
}

export const refuseFriendRequest = async (req, res) => {
  try {
    const friendship = await refuseFriendRequestService(req.params.requestId, req.user.id)
    res.json({ message: 'Demande refusée', friendship })
  } catch (error) {
    console.error(error)
    res.status(error.statusCode || 500).json({ error: error.message })
  }
}

export const getFriendsList = async (req, res) => {
  try {
    const friends = await getFriendsListService(req.user.id)
    res.json({ friends })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: error.message })
  }
}

export const getPendingRequests = async (req, res) => {
  try {
    const requests = await getPendingRequestsService(req.user.id)
    res.json({ requests })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: error.message })
  }
}

export const getFriendshipStatus = async (req, res) => {
  try {
    const status = await getFriendshipStatusService(req.user.id, req.params.userId)
    res.json({ status })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: error.message })
  }
}
