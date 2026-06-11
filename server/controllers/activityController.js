import { getActivities, getActivityById, createActivityService, joinActivityService, leaveActivityService, getActivityMembersService } from '../services/activityService.js'

export const getActivitiesHandler = async (req, res) => {
  try {
    const { city, category } = req.query;
    const activities = await getActivities(city, category);
    res.json(activities);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message : "Erreur lors de la récupération des activités" });
  }
};

//renvoi une activité spécifique en fonction de son ID avec les groupes associés
export const getActivityByIdHandler = async (req, res) => {
  try {
    const { id } = req.params
    const activity = await getActivityById(id)
    if (!activity) {
      return res.status(404).json({ message: "Activité non trouvée" })
    }
    res.json(activity)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// ── POST /api/activities ──────────────────────────────────────────
export const createActivityHandler = async (req, res) => {
  try {
    const { title, description, category, city } = req.body

    if (!title || !category || !city) {
      return res.status(400).json({ message: 'title, category et city sont requis' })
    }

    const activity = await createActivityService({
      title,
      description,
      category,
      city,
      creatorId: req.user.id
    })

    res.status(201).json(activity)
  } catch (error) {
    if (error.statusCode === 409) {
      return res.status(409).json({
        message: error.message,
        similarActivities: error.similarActivities
      })
    }
    if (error.statusCode === 400) {
      return res.status(400).json({ message: error.message })
    }
    console.error(error)
    res.status(500).json({ message: "Erreur lors de la création de l'activité" })
  }
}
// ── POST /api/activities/:id/join ─────────────────────────────────
export const joinActivityHandler = async (req, res) => {
  try {
    const result = await joinActivityService(req.params.id, req.user.id)
    res.status(201).json(result)
  } catch (error) {
    if (error.statusCode) return res.status(error.statusCode).json({ message: error.message })
    console.error(error)
    res.status(500).json({ message: 'Erreur serveur' })
  }
}
// ── DELETE /api/activities/:id/leave ──────────────────────────────
export const leaveActivityHandler = async (req, res) => {
  try {
    const result = await leaveActivityService(req.params.id, req.user.id)
    res.status(200).json(result)
  } catch (error) {
    if (error.statusCode) return res.status(error.statusCode).json({ message: error.message })
    console.error(error)
    res.status(500).json({ message: 'Erreur serveur' })
  }
}
// ── GET /api/activities/:id/members ───────────────────────────────
export const getActivityMembersHandler = async (req, res) => {
  try {
    const members = await getActivityMembersService(req.params.id)
    res.json(members)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Erreur serveur' })
  }
}