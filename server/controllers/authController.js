import * as authService from "../services/authService.js"

const register = async (req, res, next) => {
  try {
    const { prénom, Nom, Email, mot_de_passe, confirmer_le_mot_de_passe, ville } = req.body

    if (!prénom || !Nom || !Email || !mot_de_passe || !confirmer_le_mot_de_passe || !ville) {
      return res.status(400).json({ message: "Tous les champs sont obligatoires" })
    }

    const result = await authService.register({ prénom, Nom, Email, mot_de_passe, confirmer_le_mot_de_passe, ville })
    res.status(201).json(result)
  } catch (error) {
    next(error)
  }
}
// Connexion
const login = async (req, res, next) => {
  try {
    const { Email, mot_de_passe } = req.body

    // Vérifier que les champs sont remplis
    if (!Email || !mot_de_passe) {
      return res.status(400).json({ message: "Email et mot de passe obligatoires" })
    }

    const result = await authService.login({ Email, mot_de_passe })
    res.status(200).json(result)
  } catch (error) {
    next(error)
  }
}

export default { register, login }

