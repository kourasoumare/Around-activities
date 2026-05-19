import express from 'express'
import userControllers from '../controllers/userController.js'
const router = express.Router()
router.get("/me/groups",userControllers.getMyGroups)
export default router