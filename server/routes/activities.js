import express from 'express'
import { getActivitiesHandler, getActivityByIdHandler} from '../controllers/activityController.js'
import { verifyToken } from '../middleware/auth.js'
const router = express.Router()

router.get('/', verifyToken, getActivitiesHandler)
router.get('/:id', verifyToken, getActivityByIdHandler)
export default router