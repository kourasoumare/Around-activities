import {
  getGroupMessagesService,
  getPrivateMessagesService,
  createMessageService,
  getActivityMessagesService
} from '../services/messageService.js'

export const getGroupMessages = async (req, res) => {
  try {
    const messages = await getGroupMessagesService(req.params.groupId)
    res.json(messages)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: error.message })
  }
}

export const getPrivateMessages = async (req, res) => {
  try {
    const messages = await getPrivateMessagesService(req.user.id, req.params.userId)
    res.json(messages)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: error.message })
  }
}

export const createMessage = async (req, res) => {
  try {
    const { content, group_id, receiver_id } = req.body

    if (!content) return res.status(400).json({ error: 'Le contenu est requis' })
    if (!group_id && !receiver_id) return res.status(400).json({ error: 'group_id ou receiver_id requis' })

    const message = await createMessageService({
      sender_id: req.user.id,
      group_id: group_id ? parseInt(group_id) : null,
      receiver_id: receiver_id ? parseInt(receiver_id) : null,
      content
    })

    res.status(201).json(message)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: error.message })
  }
}

// ── GET /api/messages/activity/:id ────────────────────────────────
export const getActivityMessagesHandler = async (req, res) => {
  try {
    const messages = await getActivityMessagesService(req.params.id)
    res.json(messages)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: error.message })
  }
}