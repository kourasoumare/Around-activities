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

export default { register, login }