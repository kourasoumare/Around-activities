import express from 'express'
import authControllers from '../controllers/authController.js'

const router = express.Router()

router.post("/register", authControllers.register)
router.post("/login", authControllers.login)
router.post("/forgot-password", authControllers.forgotPassword)
router.post("/reset-password", authControllers.resetPassword)

export default router