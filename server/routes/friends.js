import { Router } from 'express'
import { verifyToken } from '../middleware/auth.js'
import {
  sendFriendRequest,
  acceptFriendRequest,
  refuseFriendRequest,
  getFriendsList,
  getPendingRequests,
  getFriendshipStatus
} from '../controllers/friendshipController.js'

const router = Router()

router.post('/request/:userId', verifyToken, sendFriendRequest)
router.put('/accept/:requestId', verifyToken, acceptFriendRequest)
router.put('/refuse/:requestId', verifyToken, refuseFriendRequest)
router.get('/', verifyToken, getFriendsList)
router.get('/requests', verifyToken, getPendingRequests)
router.get('/status/:userId', verifyToken, getFriendshipStatus)

export default router
