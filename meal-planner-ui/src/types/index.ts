export interface UserProfile {
  name: string
  skillLevel: 'beginner' | 'intermediate' | 'advanced'
  servings: string
  goals: string[]
  dietaryRestrictions: string
  cookingTime: string
}

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export interface Recipe {
  id: string
  name: string
  time: string
  servings: string | number
  brainBenefit: string
  ingredients: string[]
  instructions: string[]
  tip?: string
  category?: string
  difficulty?: string
}

export interface WeeklyPlan {
  weekName: string
  description: string
  recipes: Array<{
    name: string
    category: string
    time: string
  }>
  days: DayPlan[]
  brainTip: string
}

export interface DayPlan {
  day: string
  meals: Meal[]
}

export interface Meal {
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  name: string
  note?: string
}

export interface OnboardingQuestion {
  id: string
  question: string
  type: 'text' | 'select' | 'multiselect'
  options?: Array<{ value: string; label: string; description?: string }>
  placeholder?: string
  field: keyof UserProfile
}

export interface ParsedContent {
  type: 'text' | 'weekly_plan' | 'recipe'
  content: string | WeeklyPlan | Recipe
}

// Legacy types for backward compatibility with old components
export interface MealPlan {
  days: LegacyDayPlan[]
}

export interface LegacyDayPlan {
  day: string
  date?: string
  meals: LegacyMeal[]
}

export interface LegacyMeal {
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  name: string
  description: string
  prepTime?: string
  calories?: number
  ingredients?: string[]
}
