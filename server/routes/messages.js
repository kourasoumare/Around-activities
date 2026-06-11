import { Router } from 'express'
import { verifyToken } from '../middleware/auth.js'
import { getGroupMessages, getPrivateMessages, createMessage, getActivityMessagesHandler } from '../controllers/messageController.js'

const router = Router()

router.get('/group/:groupId', verifyToken, getGroupMessages)
router.get('/activity/:id', verifyToken, getActivityMessagesHandler)
router.get('/private/:userId', verifyToken, getPrivateMessages)
router.post('/', verifyToken, createMessage)

export default router