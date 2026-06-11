export const ACTIVITY_CATEGORIES = [
  { title: 'Sport & Fitness', category: 'Sport & Fitness', image_url: '/football.jpg' },
  { title: 'Art & Culture', category: 'Art & Culture', image_url: '/aquarelle.jpg' },
  { title: 'Restaurant & Cuisine', category: 'Restaurant & Cuisine', image_url: '/cuisine.jpg' },
  { title: 'Musique & \u00c9v\u00e9nements', category: 'Musique & \u00c9v\u00e9nements', image_url: '/guitare.jpg' },
  { title: 'Bien-\u00eatre & D\u00e9tente', category: 'Bien-\u00eatre & D\u00e9tente', image_url: '/yoga.jpg' },
  { title: 'Tech & Jeux vid\u00e9o', category: 'Tech & Jeux vid\u00e9o', image_url: '/coding.jpg' },
  { title: 'Nature & Plein air', category: 'Nature & Plein air', image_url: '/randonnee.jpg' },
  { title: 'Rencontres & Chill', category: 'Rencontres & Chill', image_url: '/photo.jpg' }
]

const LEGACY_CATEGORY_ALIASES = {
  sport: 'Sport & Fitness',
  fitness: 'Sport & Fitness',
  art: 'Art & Culture',
  culture: 'Art & Culture',
  restaurant: 'Restaurant & Cuisine',
  cuisine: 'Restaurant & Cuisine',
  musique: 'Musique & \u00c9v\u00e9nements',
  evenements: 'Musique & \u00c9v\u00e9nements',
  'musique-evenements': 'Musique & \u00c9v\u00e9nements',
  'musique-a-v-nements': 'Musique & \u00c9v\u00e9nements',
  'musique-a-va-nements': 'Musique & \u00c9v\u00e9nements',
  'bien-etre': 'Bien-\u00eatre & D\u00e9tente',
  detente: 'Bien-\u00eatre & D\u00e9tente',
  'bien-etre-detente': 'Bien-\u00eatre & D\u00e9tente',
  'bien-a-tre-da-tente': 'Bien-\u00eatre & D\u00e9tente',
  tech: 'Tech & Jeux vid\u00e9o',
  'jeux-video': 'Tech & Jeux vid\u00e9o',
  'tech-jeux-video': 'Tech & Jeux vid\u00e9o',
  'tech-jeux-vida-o': 'Tech & Jeux vid\u00e9o',
  nature: 'Nature & Plein air',
  'plein-air': 'Nature & Plein air',
  rencontres: 'Rencontres & Chill',
  chill: 'Rencontres & Chill'
}

export const normalizeCategoryKey = (value) => {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export const resolveActivityCategory = (value) => {
  const key = normalizeCategoryKey(value)
  if (!key) return null

  const categoryByPosition = ACTIVITY_CATEGORIES[Number(key) - 1]
  if (categoryByPosition) return categoryByPosition.category

  const category = ACTIVITY_CATEGORIES.find(item => {
    return normalizeCategoryKey(item.category) === key || normalizeCategoryKey(item.title) === key
  })

  return category?.category || LEGACY_CATEGORY_ALIASES[key] || null
}

export const getActivityCategoryVariants = (category) => {
  const variants = new Set([category])

  if (category === 'Musique & \u00c9v\u00e9nements') variants.add('Musique & \u00c3\u2030v\u00c3\u00a9nements')
  if (category === 'Bien-\u00eatre & D\u00e9tente') variants.add('Bien-\u00c3\u00aatre & D\u00c3\u00a9tente')
  if (category === 'Tech & Jeux vid\u00e9o') variants.add('Tech & Jeux vid\u00c3\u00a9o')

  return [...variants]
}
