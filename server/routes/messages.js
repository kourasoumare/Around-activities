import { Router } from 'express'
import { verifyToken } from '../middleware/auth.js'
import { getGroupMessages, getPrivateMessages, createMessage } from '../controllers/messageController.js'

const router = Router()

router.get('/group/:groupId', verifyToken, getGroupMessages)
router.get('/private/:userId', verifyToken, getPrivateMessages)
router.post('/', verifyToken, createMessage)

export default router
