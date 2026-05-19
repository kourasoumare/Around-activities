import { getActivities } from '../services/activityService.js'

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