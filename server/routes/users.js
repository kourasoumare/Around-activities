import express from 'express'
import authenticate from "../middleware/authicate.js"
import userControllers from '../controllers/userController.js'
const router = express.Router()
router.get("/me/groups", authenticate, userControllers.getMyGroups)
export default router


