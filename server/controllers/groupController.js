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