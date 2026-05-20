import express from 'express'
import { getActivitiesHandler, getActivityByIdHandler} from '../controllers/activityController.js'
const router = express.Router()

router.get('/', getActivitiesHandler)
router.get('/:id', getActivityByIdHandler)
export default router