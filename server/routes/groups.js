import express from 'express'
import { createGroup, joinGroup } from '../controllers/groupController.js'
import { verifyToken } from '../middleware/auth.js'

const router = express.Router()

router.post('/', verifyToken, createGroup)
router.post('/:id/join', verifyToken, joinGroup)

export default router