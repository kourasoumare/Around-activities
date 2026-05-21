import { getActivities, getActivityById } from '../services/activityService.js'

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