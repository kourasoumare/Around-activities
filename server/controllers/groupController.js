import prisma from '../config/prisma.js'

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
        creator_id: req.userId
      }
    })

    await prisma.memberships.create({
      data: {
        user_id: req.userId,
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

export const deleteGroup = async (req, res) => {
  try {
    const groupId = parseInt(req.params.id)
    const userId = req.userId

    // Check group exists
    const group = await prisma.groups.findUnique({ where: { id: groupId } })
    if (!group) return res.status(404).json({ error: 'Group not found' })

    // Check user is the creator
    if (group.creator_id !== userId) {
      return res.status(403).json({ error: 'Only the creator can delete this group' })
    }

    // Delete all memberships first
    await prisma.memberships.deleteMany({ where: { group_id: groupId } })

    // Delete the group
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
    const userId = req.userId

    // Check user is a member
    const membership = await prisma.memberships.findFirst({
      where: { group_id: groupId, user_id: userId }
    })
    if (!membership) return res.status(400).json({ error: 'You are not a member of this group' })

    // Check if user is the creator
    const group = await prisma.groups.findUnique({ where: { id: groupId } })
    if (group.creator_id === userId) {
      return res.status(400).json({ error: 'You are the creator, you cannot leave. Delete the group instead.' })
    }

    // Remove from memberships
    await prisma.memberships.deleteMany({
      where: { group_id: groupId, user_id: userId }
    })

    res.status(200).json({ message: 'Successfully left the group' })

  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Server error' })
  }
}