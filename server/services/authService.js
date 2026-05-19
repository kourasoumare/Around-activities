import prisma from "../config/prisma.js"

export const register = async ({prénom, Nom, Email, mot_de_passe, confirmer_le_mot_de_passe, ville}) => {
  
  // 400 - Mots de passe différents
  if (mot_de_passe !== confirmer_le_mot_de_passe) {
    const error = new Error("Les mots de passe ne correspondent pas")
    error.statusCode = 400
    throw error
  }

  // 409 - Email déjà utilisé
  const existsUser = await prisma.users.findUnique({
    where: { email: Email }
  })

  if (existsUser) {
    const error = new Error("Cet email est déjà utilisé")
    error.statusCode = 409
    throw error
  }

  // Créer l'utilisateur
  const newUser = await prisma.users.create({
    data: {
      first_name: prénom,
      last_name: Nom,
      email: Email,
      password: mot_de_passe,
      city: ville
    }
  })

  const { password, ...userSansMotDePasse } = newUser
  return { message: "Inscription réussie", user: userSansMotDePasse }
}

export const login = async ({ Email, mot_de_passe }) => {

  // 400 - Champs manquants
  if (!Email || !mot_de_passe) {
    const error = new Error("Email et mot de passe obligatoires")
    error.statusCode = 400
    throw error
  }

  // 404 - Email introuvable
  const user = await prisma.users.findUnique({
    where: { email: Email }
  })

  if (!user) {
    const error = new Error("Aucun compte associé à cet email")
    error.statusCode = 404
    throw error
  }

  // 401 - Mauvais mot de passe
  if (user.password !== mot_de_passe) {
    const error = new Error("Mot de passe incorrect")
    error.statusCode = 401
    throw error
  }

  const { password, ...userSansMotDePasse } = user
  return { message: "Connexion réussie", user: userSansMotDePasse }
}