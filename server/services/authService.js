import prisma from "../config/prisma.js"

export const register = async ({
  prénom,
  Nom,
  Email,
  mot_de_passe,
  confirmer_le_mot_de_passe,
  ville
}) => {
  if (mot_de_passe !== confirmer_le_mot_de_passe) {
    const error = new Error("Les mots de passe ne correspondent pas")
    error.statusCode = 400
    throw error
  }

  const existsUser = await prisma.users.findUnique({
    where: { email: Email }
  })

  if (existsUser) {
    const error = new Error("L'Email a déjà été utilisé")
    error.statusCode = 409
    throw error
  }

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

  return {
    message: "Inscription réussie",
    user: userSansMotDePasse
  }
}

export const login = async ({ Email, mot_de_passe }) => {
  if (!Email || !mot_de_passe) {
    const error = new Error("Email et mot de passe obligatoires")
    error.statusCode = 400
    throw error
  }

  const user = await prisma.users.findUnique({
    where: { email: Email }
  })

  if (!user || user.password !== mot_de_passe) {
    const error = new Error("Email ou mot de passe incorrect")
    error.statusCode = 401
    throw error
  }

  const { password, ...userSansMotDePasse } = user

  return {
    message: "Connexion réussie",
    user: userSansMotDePasse
  }
}