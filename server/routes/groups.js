import express from 'express'
import { createGroup, joinGroup, getGroupById, deleteGroup, leaveGroup } from '../controllers/groupController.js'
import { verifyToken } from '../middleware/auth.js'

const router = express.Router()

router.post('/', verifyToken, createGroup)
router.post('/:id/join', verifyToken, joinGroup)
router.get('/:id', verifyToken, getGroupById)
router.delete('/:id', verifyToken, deleteGroup)
router.delete('/:id/leave', verifyToken, leaveGroup)

export default router