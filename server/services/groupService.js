import prisma from '../config/prisma.js'

// Calcule les dates suivantes selon la fréquence
function getNextDates(startDate, frequency, count) {
  const dates = []
  let current = new Date(startDate)

  for (let i = 1; i < count; i++) {
    const next = new Date(current)
    if (frequency === 'weekly') {
      next.setDate(next.getDate() + 7)
    } else if (frequency === 'biweekly') {
      next.setDate(next.getDate() + 14)
    } else if (frequency === 'monthly') {
      next.setMonth(next.getMonth() + 1)
    }
    dates.push(new Date(next))
    current = next
  }
  return dates
}

export const createGroupService = async (groupData, userId) => {
  const {
    is_recurring,
    recurrence_frequency,
    recurrence_count,
    ...baseData
  } = groupData

  // Créer le groupe principal (on garde la trace de la récurrence sur CE groupe)
  const group = await prisma.groups.create({
    data: {
      ...baseData,
      creator_id: userId,
      is_recurring: !!is_recurring,
      recurrence_frequency: is_recurring ? recurrence_frequency : null,
      recurrence_count: is_recurring ? recurrence_count : null,
    }
  })

  // Ajouter le créateur comme membre
  await prisma.memberships.create({
    data: { user_id: userId, group_id: group.id }
  })

  // Si récurrent, créer les occurrences suivantes
  if (is_recurring && recurrence_frequency && recurrence_count > 1) {
    const nextDates = getNextDates(baseData.meeting_date, recurrence_frequency, recurrence_count)

    for (const date of nextDates) {
      const occurrence = await prisma.groups.create({
        data: {
          ...baseData,
          creator_id: userId,
          meeting_date: date,
          is_recurring: true,
          recurrence_frequency,
          recurrence_count,
          // Lié à la série via le nom (on garde le même nom)
        }
      })
      // Le créateur rejoint aussi les occurrences
      await prisma.memberships.create({
        data: { user_id: userId, group_id: occurrence.id }
      })
    }
  }

  return group
}

export const getGroupByIdService = async (id) => {
  return await prisma.groups.findUnique({
    where: { id: parseInt(id) },
    include: {
      activities: { select: { title: true, category: true } },
      users: { select: { id: true, first_name: true, last_name: true } },
      memberships: {
        include: {
          users: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
              avatar_url: true,
              city: true,
              origin: true,
              birth_date: true,
              language: true,
              users_interests: { select: { interest: true } }
            }
          }
        }
      }
    }
  })
}