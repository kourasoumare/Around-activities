import * as messageService from '../services/messageService.js'

export const getGroupMessages = async (req, res) => {
  try {
    const messages = await messageService.getGroupMessages(req.params.groupId)
    res.status(200).json(messages)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const getPrivateMessages = async (req, res) => {
  try {
    const messages = await messageService.getPrivateMessages(req.user.id, req.params.userId)
    res.status(200).json(messages)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const createMessage = async (req, res) => {
  try {
    const { content, group_id, receiver_id } = req.body
    const message = await messageService.createMessageService({
      sender_id: req.user.id,
      group_id: group_id ? parseInt(group_id) : null,
      receiver_id: receiver_id ? parseInt(receiver_id) : null,
      content
    })
    res.status(201).json(message)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
