import express from 'express'
import { verifyToken } from '../middleware/auth.js'
import {
  getNotificationsService,
  deleteNotificationService,
  countUnreadService
} from '../services/notificationService.js'

const router = express.Router()

// Récupérer toutes mes notifications
router.get('/', verifyToken, async (req, res) => {
  try {
    const notifications = await getNotificationsService(req.user.id)
    res.json(notifications)
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// Compter les notifications non lues
router.get('/unread-count', verifyToken, async (req, res) => {
  try {
    const count = await countUnreadService(req.user.id)
    res.json({ count })
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// Supprimer une notification (clic dessus)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    await deleteNotificationService(Number(req.params.id), req.user.id)
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

export default router