import * as userService from "../services/userService.js"

const getMyGroups = async (req, res, next) => {
    try {
        const userId = req.user.id
        const groups = await userService.getMyGroups(userId)
        res.status(200).json(groups)
    } catch (error) {
        next(error)
    }
}

const getUserById = async (req, res, next) => {
    try {
        const user = await userService.getUserById(req.params.id)
        res.status(200).json(user)
    } catch (error) {
        if (error.message === 'User not found') {
            return res.status(404).json({ message: 'Utilisateur introuvable' })
        }
        next(error)
    }
}

const getMe = async (req, res, next) => {
    try {
        const user = await userService.getUserById(req.user.id)
        res.status(200).json(user)
    } catch (error) {
        next(error)
    }
}

const updateMe = async (req, res, next) => {
    try {
        const user = await userService.updateMe(req.user.id, req.body)
        res.status(200).json(user)
    } catch (error) {
        next(error)
    }
}

const getMyActivities = async (req, res, next) => {
  try {
    const data = await userService.getMyActivities(req.user.id)
    res.status(200).json(data)
  } catch (error) {
    next(error)
  }
}

export default { getMyGroups, getUserById, getMe, updateMe, getMyActivities }
