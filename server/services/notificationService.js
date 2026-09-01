import prisma from '../config/prisma.js'

// Créer une notification
export const createNotification = async ({ user_id, type, content, link }) => {
  return await prisma.notifications.create({
    data: { user_id, type, content, link: link ?? null }
  })
}

// Récupérer toutes les notifications d'un utilisateur
export const getNotificationsService = async (userId) => {
  return await prisma.notifications.findMany({
    where: { user_id: userId },
    orderBy: { created_at: 'desc' },
    take: 30
  })
}

// Supprimer une notification (quand l'utilisateur clique dessus)
export const deleteNotificationService = async (notificationId, userId) => {
  return await prisma.notifications.deleteMany({
    where: { id: notificationId, user_id: userId }
  })
}

// Compter les notifications non lues
export const countUnreadService = async (userId) => {
  return await prisma.notifications.count({
    where: { user_id: userId, is_read: false }
  })
}