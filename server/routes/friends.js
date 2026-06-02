import express from 'express'
import { verifyToken } from '../middleware/auth.js'
import {
  sendFriendRequest,
  acceptFriendRequest,
  refuseFriendRequest,
  getFriends,
  getFriendRequests,
  getFriendshipStatus
} from '../controllers/friendshipController.js'

const router = express.Router()

router.get('/', verifyToken, getFriends)
router.get('/requests', verifyToken, getFriendRequests)
router.get('/status/:userId', verifyToken, getFriendshipStatus)
router.post('/request/:userId', verifyToken, sendFriendRequest)
router.put('/accept/:requestId', verifyToken, acceptFriendRequest)
router.put('/refuse/:requestId', verifyToken, refuseFriendRequest)

export default router
