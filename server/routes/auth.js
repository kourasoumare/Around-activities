import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../config/prisma.js'

const router = express.Router()

// TEMPORARY - just to get a token for testing
router.post('/register', async (req, res) => {
  try {
    const { first_name, last_name, email, password, city } = req.body

    // Check if email already exists
    const existing = await prisma.users.findUnique({ where: { email } })
    if (existing) {
      return res.status(400).json({ error: 'Email already exists' })
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 10)

    // Create user
    const user = await prisma.users.create({
      data: { first_name, last_name, email, password: hashed, city }
    })

    // Generate token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET)

    res.status(201).json({ token, user })

  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Server error' })
  }
})

export default router