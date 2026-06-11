import express from 'express'
import userControllers from '../controllers/userController.js'
import { verifyToken } from '../middleware/auth.js'


const router = express.Router()

router.get('/me', verifyToken, userControllers.getMe)
router.get('/me/groups', verifyToken, userControllers.getMyGroups)
router.get('/:id', verifyToken, userControllers.getUserById)
router.put('/me', verifyToken, userControllers.updateMe)
router.get('/me/activities', verifyToken, userControllers.getMyActivities)

export default router
