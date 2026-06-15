import express from 'express'
import { getActivitiesHandler, getActivityByIdHandler, createActivityHandler, updateActivityHandler, joinActivityHandler, leaveActivityHandler, getActivityMembersHandler } from '../controllers/activityController.js'
import { verifyToken } from '../middleware/auth.js'
const router = express.Router()

router.get('/', verifyToken, getActivitiesHandler)
router.post('/', verifyToken, createActivityHandler)
router.put('/:id', verifyToken, updateActivityHandler)
router.post('/:id/join', verifyToken, joinActivityHandler)
router.delete('/:id/leave', verifyToken, leaveActivityHandler)
router.get('/:id/members', verifyToken, getActivityMembersHandler)
router.get('/:id', verifyToken, getActivityByIdHandler)
export default router