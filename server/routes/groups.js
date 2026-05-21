import express from 'express'
import { createGroup, joinGroup, deleteGroup, leaveGroup } from '../controllers/groupController.js'
import authenticate from '../middleware/authicate.js'

const router = express.Router()

router.post('/', authenticate, createGroup)
router.post('/:id/join', authenticate, joinGroup)
router.delete('/:id', authenticate, deleteGroup)
router.delete('/:id/leave', authenticate, leaveGroup)

export default router