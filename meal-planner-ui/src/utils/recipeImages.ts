// Exact mapping of recipe IDs to curated Unsplash images
// Each image is hand-picked to match the actual recipe

export const RECIPE_IMAGES: Record<string, { card: string; hero: string; thumb: string }> = {
  // Breakfast
  'swiss-overnight-oats': {
    card: 'https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=400&h=300&fit=crop&q=80',
    hero: 'https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=800&h=400&fit=crop&q=80',
    thumb: 'https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=100&h=100&fit=crop&q=80'
  },
  'sicilian-scrambled-eggs': {
    card: 'https://images.unsplash.com/photo-1482049016gy-2a2-e7m85cd58d0?w=400&h=300&fit=crop&q=80',
    hero: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&h=400&fit=crop&q=80',
    thumb: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=100&h=100&fit=crop&q=80'
  },

  // Lunch
  'lentil-dal-spinach': {
    card: 'https://images.unsplash.com/photo-1546549032-9571cd6b27df?w=400&h=300&fit=crop&q=80',
    hero: 'https://images.unsplash.com/photo-1546549032-9571cd6b27df?w=800&h=400&fit=crop&q=80',
    thumb: 'https://images.unsplash.com/photo-1546549032-9571cd6b27df?w=100&h=100&fit=crop&q=80'
  },
  'rainbow-buddha-bowl': {
    card: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop&q=80',
    hero: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=400&fit=crop&q=80',
    thumb: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=100&h=100&fit=crop&q=80'
  },
  'chickpea-tikka-masala': {
    card: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop&q=80',
    hero: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&h=400&fit=crop&q=80',
    thumb: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=100&h=100&fit=crop&q=80'
  },

  // Dinner
  'grilled-salmon-ginger': {
    card: 'https://images.unsplash.com/photo-1485921325833-c519f76c4927?w=400&h=300&fit=crop&q=80',
    hero: 'https://images.unsplash.com/photo-1485921325833-c519f76c4927?w=800&h=400&fit=crop&q=80',
    thumb: 'https://images.unsplash.com/photo-1485921325833-c519f76c4927?w=100&h=100&fit=crop&q=80'
  },
  'pretzel-tilapia': {
    card: 'https://images.unsplash.com/photo-1510130387422-82bed34b37e9?w=400&h=300&fit=crop&q=80',
    hero: 'https://images.unsplash.com/photo-1510130387422-82bed34b37e9?w=800&h=400&fit=crop&q=80',
    thumb: 'https://images.unsplash.com/photo-1510130387422-82bed34b37e9?w=100&h=100&fit=crop&q=80'
  },
  'sweet-potato-spinach-salad': {
    card: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=300&fit=crop&q=80',
    hero: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&h=400&fit=crop&q=80',
    thumb: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=100&h=100&fit=crop&q=80'
  },

  // Snacks
  'brain-trail-mix': {
    card: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=400&h=300&fit=crop&q=80',
    hero: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=800&h=400&fit=crop&q=80',
    thumb: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=100&h=100&fit=crop&q=80'
  },
  'peanut-butter-bites': {
    card: 'https://images.unsplash.com/photo-1604329756574-d4c5d53c2c84?w=400&h=300&fit=crop&q=80',
    hero: 'https://images.unsplash.com/photo-1604329756574-d4c5d53c2c84?w=800&h=400&fit=crop&q=80',
    thumb: 'https://images.unsplash.com/photo-1604329756574-d4c5d53c2c84?w=100&h=100&fit=crop&q=80'
  },

  // Smoothies
  'soothing-cacao-smoothie': {
    card: 'https://images.unsplash.com/photo-1577805947697-89e18249d767?w=400&h=300&fit=crop&q=80',
    hero: 'https://images.unsplash.com/photo-1577805947697-89e18249d767?w=800&h=400&fit=crop&q=80',
    thumb: 'https://images.unsplash.com/photo-1577805947697-89e18249d767?w=100&h=100&fit=crop&q=80'
  },
  'nourishing-green-smoothie': {
    card: 'https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=400&h=300&fit=crop&q=80',
    hero: 'https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=800&h=400&fit=crop&q=80',
    thumb: 'https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=100&h=100&fit=crop&q=80'
  },
  'spicy-berry-smoothie': {
    card: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=400&h=300&fit=crop&q=80',
    hero: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=800&h=400&fit=crop&q=80',
    thumb: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=100&h=100&fit=crop&q=80'
  }
}

// Fallback images by category
const CATEGORY_FALLBACKS: Record<string, { card: string; hero: string; thumb: string }> = {
  breakfast: {
    card: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=400&h=300&fit=crop&q=80',
    hero: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=800&h=400&fit=crop&q=80',
    thumb: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=100&h=100&fit=crop&q=80'
  },
  lunch: {
    card: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop&q=80',
    hero: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=400&fit=crop&q=80',
    thumb: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&h=100&fit=crop&q=80'
  },
  dinner: {
    card: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop&q=80',
    hero: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&h=400&fit=crop&q=80',
    thumb: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=100&h=100&fit=crop&q=80'
  },
  snack: {
    card: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=400&h=300&fit=crop&q=80',
    hero: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=800&h=400&fit=crop&q=80',
    thumb: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=100&h=100&fit=crop&q=80'
  },
  smoothie: {
    card: 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=400&h=300&fit=crop&q=80',
    hero: 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=800&h=400&fit=crop&q=80',
    thumb: 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=100&h=100&fit=crop&q=80'
  }
}

// Convert recipe name to ID
function nameToId(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

// Get image for a recipe
export function getRecipeImage(
  recipeIdOrName: string,
  size: 'card' | 'hero' | 'thumb' = 'card',
  category?: string
): string {
  // Try exact ID match first
  if (RECIPE_IMAGES[recipeIdOrName]) {
    return RECIPE_IMAGES[recipeIdOrName][size]
  }

  // Try converting name to ID
  const id = nameToId(recipeIdOrName)
  if (RECIPE_IMAGES[id]) {
    return RECIPE_IMAGES[id][size]
  }

  // Try partial matches
  for (const [key, images] of Object.entries(RECIPE_IMAGES)) {
    if (recipeIdOrName.toLowerCase().includes(key.replace(/-/g, ' ')) ||
        key.includes(id)) {
      return images[size]
    }
  }

  // Fallback to category
  if (category) {
    const cat = category.toLowerCase()
    if (CATEGORY_FALLBACKS[cat]) {
      return CATEGORY_FALLBACKS[cat][size]
    }
  }

  // Default fallback
  return CATEGORY_FALLBACKS.lunch[size]
}
