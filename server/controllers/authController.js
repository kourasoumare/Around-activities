import * as authService from "../services/authService.js"

// Register
const register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, confirmPassword, city, origin } = req.body

    if (!firstName || !lastName || !email || !password || !confirmPassword || !city) {
      return res.status(400).json({ message: "All fields are required" })
    }

    const result = await authService.register({ firstName, lastName, email, password, confirmPassword, city, origin })
    res.status(201).json(result)
  } catch (error) {
    next(error)
  }
}

// Login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" })
    }

    const result = await authService.login({ email, password })
    res.status(200).json(result)
  } catch (error) {
    next(error)
  }
}

// Forgot password
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ message: "Email is required" })
    }

    const result = await authService.forgotPassword({ email })
    res.status(200).json(result)
  } catch (error) {
    next(error)
  }
}

// Reset password
const resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body

    if (!token || !newPassword) {
      return res.status(400).json({ message: "Token and new password are required" })
    }

    const result = await authService.resetPassword({ token, newPassword })
    res.status(200).json(result)
  } catch (error) {
    next(error)
  }
}

export default { register, login, forgotPassword, resetPassword }