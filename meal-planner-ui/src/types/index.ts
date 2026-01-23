export interface UserProfile {
  dietaryRestrictions: string
  healthGoals: string
  householdSize: string
  budget: string
  cookingTime: string
  skillLevel: string
  cuisinePreferences: string
  foodsToAvoid: string
}

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export interface MealPlan {
  days: DayPlan[]
}

export interface DayPlan {
  day: string
  date?: string
  meals: Meal[]
}

export interface Meal {
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  name: string
  description: string
  prepTime?: string
  calories?: number
  ingredients?: string[]
}

export interface OnboardingQuestion {
  id: string
  question: string
  placeholder: string
  field: keyof UserProfile
}
