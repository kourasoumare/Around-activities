import prisma from "../config/prisma.js"
import { hashPassword, comparePasswords } from "../utils/passwords.js"
import { generateToken } from "../utils/token.js"

export const register = async ({ firstName, lastName, email, password, confirmPassword, city }) => {

  // Check passwords match
  if (password !== confirmPassword) {
    const error = new Error("Passwords do not match")
    error.statusCode = 400
    throw error
  }

  // Check if email already exists
  const existingUser = await prisma.users.findUnique({
    where: { email }
  })

  if (existingUser) {
    const error = new Error("Email already in use")
    error.statusCode = 409
    throw error
  }

  // Hash password
  const hashedPassword = await hashPassword(password)

  // Create user
  const newUser = await prisma.users.create({
    data: {
      first_name: firstName,
      last_name: lastName,
      email,
      password: hashedPassword,
      city
    }
  })

  // Generate token
  const token = generateToken(newUser.id)

  const { password: _, ...userWithoutPassword } = newUser
  return { message: "Registration successful", user: userWithoutPassword, token }
}

export const login = async ({ email, password }) => {

  // Check if user exists
  const user = await prisma.users.findUnique({
    where: { email }
  })

  if (!user) {
    const error = new Error("Invalid email or password")
    error.statusCode = 401
    throw error
  }

  // Check password
  const isPasswordValid = await comparePasswords(password, user.password)

  if (!isPasswordValid) {
    const error = new Error("Invalid email or password")
    error.statusCode = 401
    throw error
  }

  // Generate token
  const token = generateToken(user.id)

  const { password: _, ...userWithoutPassword } = user
  return { message: "Login successful", user: userWithoutPassword, token }
}