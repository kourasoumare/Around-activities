import prisma from "../config/prisma.js"
import { hashPassword, comparePasswords } from "../utils/passwords.js"
import { generateToken } from "../utils/token.js"
import crypto from "crypto"
import nodemailer from "nodemailer"

export const register = async ({ firstName, lastName, email, password, confirmPassword, city }) => {
  if (password !== confirmPassword) {
    const error = new Error("Passwords do not match")
    error.statusCode = 400
    throw error
  }

  const existingUser = await prisma.users.findUnique({
    where: { email }
  })

  if (existingUser) {
    const error = new Error("Email already in use")
    error.statusCode = 409
    throw error
  }

  const hashedPassword = await hashPassword(password)

  const newUser = await prisma.users.create({
    data: {
      first_name: firstName,
      last_name: lastName,
      email,
      password: hashedPassword,
      city
    }
  })

  const token = generateToken(newUser.id)
  const { password: _, ...userWithoutPassword } = newUser
  return { message: "Registration successful", user: userWithoutPassword, token }
}

export const login = async ({ email, password }) => {
  const user = await prisma.users.findUnique({
    where: { email }
  })

  if (!user) {
    const error = new Error("Invalid email or password")
    error.statusCode = 401
    throw error
  }

  const isPasswordValid = await comparePasswords(password, user.password)

  if (!isPasswordValid) {
    const error = new Error("Invalid email or password")
    error.statusCode = 401
    throw error
  }

  const token = generateToken(user.id)
  const { password: _, ...userWithoutPassword } = user
  return { message: "Login successful", user: userWithoutPassword, token }
}

export const forgotPassword = async ({ email }) => {
  const user = await prisma.users.findUnique({
    where: { email }
  })

  if (!user) {
    const error = new Error("No account associated with this email")
    error.statusCode = 404
    throw error
  }

  // Generate reset token
  const resetToken = crypto.randomBytes(32).toString("hex")
  const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hour

  // Save token in database
  await prisma.users.update({
    where: { email },
    data: {
      reset_token: resetToken,
      reset_token_expiry: resetTokenExpiry
    }
  })

  // Send email
  const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

 await transporter.sendMail({
  from: "cissebambi451@gmail.com",
  to: email,
  subject: "Reset your password",
  html: `<p>Click <a href="${process.env.FRONTEND_URL}/reset-password?token=${resetToken}">here</a> to reset your password. Link expires in 1 hour.</p>`
})
  return { message: "Reset email sent successfully" }
}

export const resetPassword = async ({ token, newPassword }) => {
  const user = await prisma.users.findFirst({
    where: {
      reset_token: token,
      reset_token_expiry: { gt: new Date() }
    }
  })

  if (!user) {
    const error = new Error("Invalid or expired token")
    error.statusCode = 400
    throw error
  }

  const hashedPassword = await hashPassword(newPassword)

  await prisma.users.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      reset_token: null,
      reset_token_expiry: null
    }
  })

  return { message: "Password reset successfully" }
}