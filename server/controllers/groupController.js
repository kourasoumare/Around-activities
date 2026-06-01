import prisma from '../config/prisma.js'
import { getGroupByIdService } from '../services/groupService.js'

export const createGroup = async (req, res) => {
  try {
    const {
      name,
      description,
      activity_id,
      city,
      meeting_date,
      location,
      max_members,
      contact_link
    } = req.body

    const group = await prisma.groups.create({
      data: {
        name,
        description,
        activity_id,
        city,
        meeting_date: new Date(meeting_date),
        location,
        max_members,
        contact_link,
        creator_id: req.user.id
      }
    })

    await prisma.memberships.create({
      data: {
        user_id: req.user.id,
        group_id: group.id
      }
    })

    res.status(201).json({ message: 'Groupe créé avec succès', group })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
}

export const joinGroup = async (req, res) => {
  try {
    const groupId = parseInt(req.params.id)
    const userId = req.user.id

    const group = await prisma.groups.findUnique({ where: { id: groupId } })
    if (!group) return res.status(404).json({ error: 'Group not found' })

    const existing = await prisma.memberships.findFirst({
      where: { group_id: groupId, user_id: userId }
    })
    if (existing) return res.status(400).json({ error: 'Already a member' })

    const memberCount = await prisma.memberships.count({ where: { group_id: groupId } })
    if (memberCount >= group.max_members) return res.status(400).json({ error: 'Group is full' })

    await prisma.memberships.create({
      data: { user_id: userId, group_id: groupId }
    })

    res.status(201).json({ message: 'Successfully joined the group' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Server error' })
  }
}

export const getGroupById = async (req, res) => {
  try {
    const group = await getGroupByIdService(req.params.id)
    if (!group) return res.status(404).json({ error: 'Groupe introuvable' })
    res.json(group)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
}

export const deleteGroup = async (req, res) => {
  try {
    const groupId = parseInt(req.params.id)
    const userId = req.user.id

    const group = await prisma.groups.findUnique({ where: { id: groupId } })
    if (!group) return res.status(404).json({ error: 'Group not found' })

    if (group.creator_id !== userId) {
      return res.status(403).json({ error: 'Only the creator can delete this group' })
    }

    await prisma.memberships.deleteMany({ where: { group_id: groupId } })
    await prisma.groups.delete({ where: { id: groupId } })

    res.status(200).json({ message: 'Group deleted successfully' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Server error' })
  }
}

export const leaveGroup = async (req, res) => {
  try {
    const groupId = parseInt(req.params.id)
    const userId = req.user.id

    const membership = await prisma.memberships.findFirst({
      where: { group_id: groupId, user_id: userId }
    })
    if (!membership) return res.status(400).json({ error: 'You are not a member of this group' })

    const group = await prisma.groups.findUnique({ where: { id: groupId } })
    if (group.creator_id === userId) {
      return res.status(400).json({ error: 'You are the creator, delete the group instead.' })
    }

    await prisma.memberships.deleteMany({
      where: { group_id: groupId, user_id: userId }
    })

    res.status(200).json({ message: 'Successfully left the group' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Server error' })
  }
}
export const getGroupById = async (req, res) => {
  try {
    const group = await getGroupByIdService(req.params.id)
    if (!group) return res.status(404).json({ error: 'Groupe introuvable' })
    res.json(group)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
}