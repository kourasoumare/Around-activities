import prisma from "../config/prisma.js"
import { hashPassword, comparePasswords } from "../utils/passwords.js"
import { generateToken } from "../utils/token.js"
import crypto from "crypto"
import nodemailer from "nodemailer"

const USER_SELECT = {
  id: true,
  first_name: true,
  last_name: true,
  email: true,
  city: true,
  origin: true,
  birth_date: true,
  language: true,
  avatar_url: true,
  is_new_user: true,
  created_at: true
}

export const register = async ({ firstName, lastName, email, password, confirmPassword, city, origin, birthDate }) => {
  if (password !== confirmPassword) {
    const error = new Error("Passwords do not match")
    error.statusCode = 400
    throw error
  }

  const existingUser = await prisma.users.findUnique({ where: { email } })
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
      city,
      origin,
      ...(birthDate ? { birth_date: new Date(birthDate) } : {})
    },
    select: USER_SELECT
  })

  const token = generateToken(newUser.id)
  return { message: "Registration successful", user: newUser, token }
}

export const login = async ({ email, password }) => {
  const user = await prisma.users.findUnique({
    where: { email },
    select: { ...USER_SELECT, password: true }
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
  const user = await prisma.users.findUnique({ where: { email } })
  if (!user) {
    const error = new Error("No account associated with this email")
    error.statusCode = 404
    throw error
  }

  const resetToken = crypto.randomBytes(32).toString("hex")
  const resetTokenExpiry = new Date(Date.now() + 3600000)

  await prisma.users.update({
    where: { email },
    data: { reset_token: resetToken, reset_token_expiry: resetTokenExpiry }
  })

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
    })
    await transporter.sendMail({
      from: "cissebambi451@gmail.com",
      to: email,
      subject: "Reset your password",
      html: `<p>Click <a href="${process.env.FRONTEND_URL}/reset-password?token=${resetToken}">here</a> to reset your password. Link expires in 1 hour.</p>`
    })
  } catch (emailErr) {
    console.error("Email sending failed:", emailErr.message)
  }

  return { message: "Reset email sent successfully" }
}

export const resetPassword = async ({ token, newPassword }) => {
  const user = await prisma.users.findFirst({
    where: { reset_token: token, reset_token_expiry: { gt: new Date() } }
  })

  if (!user) {
    const error = new Error("Invalid or expired token")
    error.statusCode = 400
    throw error
  }

  const hashedPassword = await hashPassword(newPassword)

  await prisma.users.update({
    where: { id: user.id },
    data: { password: hashedPassword, reset_token: null, reset_token_expiry: null }
  })

  return { message: "Password reset successfully" }
}
