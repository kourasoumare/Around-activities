import * as userService from "../services/userService.js"

const getMyGroups = async (req, res, next) => {
  try {
    const userId = 1 // hardcodé pour tester
    const groups = await userService.getMyGroups(userId)
    res.status(200).json(groups)
  } catch (error) {
    next(error)
  }
}

export default { getMyGroups }