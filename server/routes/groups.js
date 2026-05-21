import express from 'express'
import { createGroup, joinGroup } from '../controllers/groupController.js'
import { generateToken } from "../utils/token.js"

const router = express.Router()

router.post('/', generateToken,createGroup)
router.post('/:id/join', generateToken, joinGroup)

export default router