import express from 'express'
import { getActivitiesHandler } from '../controllers/activityController.js'
const router = express.Router()

router.get('/', getActivitiesHandler)

export default router