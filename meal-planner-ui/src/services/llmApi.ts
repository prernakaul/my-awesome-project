import { UserProfile } from '../types'
import { BRAIN_FOOD_PRINCIPLES, RECIPES } from '../data/brainFoodKnowledge'

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY

const SYSTEM_PROMPT = `You are a brain-health nutrition expert trained on the principles and research of Dr. Lisa Mosconi, author of "Brain Food: The Surprising Science of Eating for Cognitive Power."

Your mission is to help users eat smarter to sharpen their minds through simple, practical meal planning.

## Your Expertise:
- Neuro-nutrition and how food affects cognitive function
- The Mediterranean diet and its brain-health benefits
- Omega-3 fatty acids (especially DHA) and brain cell health
- Antioxidants and their role in protecting brain cells
- Anti-inflammatory foods and reducing brain aging

## Core Principles You Follow:
${BRAIN_FOOD_PRINCIPLES}

## Your Approach:
1. **Keep it SIMPLE** - Users are newbie cooks. Maximum 4-5 recipes per week.
2. **Batch cooking** - Cook once, eat multiple times throughout the week
3. **Brain benefits** - Always explain WHY each food is good for the brain
4. **Practical** - Focus on easy-to-find ingredients and simple techniques
5. **Encouraging** - Make brain-healthy eating feel achievable, not overwhelming

Remember: Your goal is to make brain-healthy eating EASY and ACCESSIBLE. Don't overwhelm users with too many recipes - simplicity is key!`

// ── Recipe selection based on user profile ──────────────────────────

type KnowledgeRecipe = (typeof RECIPES.breakfast)[number]

function parseMinutes(time: string): number {
  const match = time.match(/(\d+)\s*min/)
  return match ? parseInt(match[1]) : 30
}

function getMaxMinutes(cookingTime: string): number {
  switch (cookingTime) {
    case 'minimal': return 15
    case 'limited': return 30
    case 'moderate': return 45
    case 'flexible': return 999
    default: return 30
  }
}

function violatesDietaryRestrictions(recipe: KnowledgeRecipe, restrictions: string): boolean {
  if (!restrictions || restrictions.toLowerCase() === 'none') return false
  const lower = restrictions.toLowerCase()
  const ingredientText = recipe.ingredients.join(' ').toLowerCase()

  if (lower.includes('vegetarian') || lower.includes('vegan')) {
    if (ingredientText.includes('salmon') || ingredientText.includes('tilapia') ||
        ingredientText.includes('fish') || ingredientText.includes('chicken') ||
        ingredientText.includes('beef') || ingredientText.includes('pork')) {
      return true
    }
  }
  if (lower.includes('vegan')) {
    if (ingredientText.includes('egg') || ingredientText.includes('yogurt') ||
        ingredientText.includes('milk') || ingredientText.includes('cheese') ||
        ingredientText.includes('butter') || ingredientText.includes('honey')) {
      return true
    }
  }
  if (lower.includes('gluten')) {
    if (ingredientText.includes('pretzel') || ingredientText.includes('flour') ||
        ingredientText.includes('bread')) {
      return true
    }
  }
  if (lower.includes('nut')) {
    if (ingredientText.includes('walnut') || ingredientText.includes('almond') ||
        ingredientText.includes('hazelnut') || ingredientText.includes('peanut') ||
        ingredientText.includes('cashew') || ingredientText.includes('pecan') ||
        ingredientText.includes('pistachio') || ingredientText.includes('brazil nut')) {
      return true
    }
  }
  if (lower.includes('dairy')) {
    if (ingredientText.includes('milk') || ingredientText.includes('yogurt') ||
        ingredientText.includes('cheese') || ingredientText.includes('butter') ||
        ingredientText.includes('cream')) {
      return true
    }
  }
  return false
}

const GOAL_LABELS: Record<string, string> = {
  focus: 'Better Focus',
  memory: 'Memory Support',
  energy: 'Mental Energy',
  mood: 'Mood Balance',
  longevity: 'Brain Longevity'
}

const GOAL_KEYWORDS: Record<string, { pattern: RegExp; why: string }> = {
  focus:     { pattern: /energy|sustained|focus|b.vitamin|concentration/,       why: 'sustained energy and B vitamins for concentration' },
  memory:    { pattern: /memory|choline|dha|omega/,                             why: 'omega-3 DHA and choline for memory' },
  energy:    { pattern: /energy|sustained|b.vitamin|carb|iron/,                 why: 'complex carbs and B vitamins for mental stamina' },
  mood:      { pattern: /anti.inflammatory|omega|antioxidant|mood/,             why: 'anti-inflammatory compounds for emotional balance' },
  longevity: { pattern: /antioxidant|protect|anti.inflammatory|decline/,        why: 'antioxidants that protect brain cells from aging' },
}

const TIME_LABELS: Record<string, string> = {
  minimal: '15 minutes or less',
  limited: '15-30 minutes',
  moderate: '30-45 minutes',
  flexible: '45+ minutes'
}

interface RecipePick {
  recipe: KnowledgeRecipe
  reason: string
}

function goalScore(recipe: KnowledgeRecipe, goals: string[]): number {
  const benefit = recipe.brainBenefit.toLowerCase()
  let score = 0
  for (const goal of goals) {
    const kw = GOAL_KEYWORDS[goal]
    if (kw && kw.pattern.test(benefit)) score++
  }
  return score
}

function buildReason(recipe: KnowledgeRecipe, profile: UserProfile): string {
  const parts: string[] = []
  const benefit = recipe.brainBenefit.toLowerCase()
  const goals = profile.goals || []

  // Which goals does this recipe match?
  const matchedGoals = goals.filter(g => {
    const kw = GOAL_KEYWORDS[g]
    return kw && kw.pattern.test(benefit)
  })
  if (matchedGoals.length > 0) {
    const goalNames = matchedGoals.map(g => GOAL_LABELS[g] || g).join(' & ')
    const whys = matchedGoals.map(g => GOAL_KEYWORDS[g].why)
    parts.push(`supports your ${goalNames} goal — ${recipe.brainBenefit} (${whys.join('; ')})`)
  } else {
    parts.push(`brain benefit: ${recipe.brainBenefit}`)
  }

  // Time fit
  const mins = parseMinutes(recipe.time)
  const maxMins = getMaxMinutes(profile.cookingTime)
  if (mins <= maxMins) {
    parts.push(`fits your ${TIME_LABELS[profile.cookingTime] || profile.cookingTime} cooking window (${recipe.time})`)
  }

  // Dietary fit
  const restrictions = profile.dietaryRestrictions
  if (restrictions && restrictions.toLowerCase() !== 'none') {
    parts.push(`compatible with your ${restrictions} diet`)
  }

  return parts.join('; ')
}

function pickBest(recipes: KnowledgeRecipe[], profile: UserProfile): RecipePick {
  const maxTime = getMaxMinutes(profile.cookingTime)
  const goals = profile.goals || []

  // Filter by time and dietary restrictions
  let candidates = recipes.filter(r =>
    parseMinutes(r.time) <= maxTime &&
    !violatesDietaryRestrictions(r, profile.dietaryRestrictions)
  )

  // Relax time filter if nothing passed
  if (candidates.length === 0) {
    candidates = recipes.filter(r =>
      !violatesDietaryRestrictions(r, profile.dietaryRestrictions)
    )
  }

  // Relax all filters if still nothing
  if (candidates.length === 0) {
    candidates = recipes
  }

  // Sort by goal relevance then shuffle ties
  candidates.sort((a, b) => {
    const diff = goalScore(b, goals) - goalScore(a, goals)
    return diff !== 0 ? diff : Math.random() - 0.5
  })

  const recipe = candidates[0]
  return { recipe, reason: buildReason(recipe, profile) }
}

function selectWeeklyRecipes(profile: UserProfile): RecipePick[] {
  return [
    pickBest(RECIPES.breakfast, profile),
    pickBest(RECIPES.lunch, profile),
    pickBest(RECIPES.dinner, profile),
    pickBest(RECIPES.snacks, profile),
    pickBest(RECIPES.smoothies, profile),
  ]
}

function getCategoryName(recipe: KnowledgeRecipe): string {
  if ((RECIPES.breakfast as readonly KnowledgeRecipe[]).includes(recipe)) return 'Breakfast'
  if ((RECIPES.lunch as readonly KnowledgeRecipe[]).includes(recipe)) return 'Lunch'
  if ((RECIPES.dinner as readonly KnowledgeRecipe[]).includes(recipe)) return 'Dinner'
  if ((RECIPES.snacks as readonly KnowledgeRecipe[]).includes(recipe)) return 'Snack'
  return 'Smoothie'
}

function buildMealPlanPrompt(picks: RecipePick[], profile: UserProfile): string {
  const goalNames = (profile.goals || []).map(g => GOAL_LABELS[g] || g).join(', ')

  const recipeListWithReasons = picks.map((p, i) =>
    `${i + 1}. "${p.recipe.name}" (${getCategoryName(p.recipe)}, ${p.recipe.time})\n   WHY: ${p.reason}`
  ).join('\n')

  const recipesThisWeek = picks.map((p, i) =>
    `${i + 1}. ${p.recipe.name} - ${getCategoryName(p.recipe)} - ${p.recipe.time}`
  ).join('\n')

  return `Create a personalized weekly meal plan (Monday through Friday) for ${profile.name || 'the user'}.

## About this user:
- Name: ${profile.name || 'Friend'}
- Cooking skill: ${profile.skillLevel} (${profile.skillLevel === 'beginner' ? 'keep instructions very simple' : profile.skillLevel === 'intermediate' ? 'can handle moderate complexity' : 'comfortable with any technique'})
- Time for cooking: ${TIME_LABELS[profile.cookingTime] || profile.cookingTime}
- Brain-health goals: ${goalNames || 'General brain health'}
- Dietary restrictions: ${profile.dietaryRestrictions || 'none'}
- Servings needed: ${profile.servings || '2'}

## Recipes selected for ${profile.name || 'this user'} (and why):
${recipeListWithReasons}

## Instructions:
1. Use each recipe name EXACTLY as written — do not change, shorten, or rephrase any name.
2. In the DESCRIPTION, mention the user's goals (${goalNames}) and explain how this plan addresses them.
3. Use batch cooking logic — cook once, eat leftovers on subsequent days.
4. In the daily schedule, add parenthetical notes like (make a big batch), (leftovers), (prep night before).
5. The BRAIN_TIP should be specifically relevant to the user's goals: ${goalNames}.

Output the plan in this EXACT format:

\`\`\`weekly_plan
WEEK: [Creative week name that reflects the user's goals]
DESCRIPTION: [2-3 sentences: reference ${profile.name}'s specific goals (${goalNames}) and how these recipes address them]

RECIPES_THIS_WEEK:
${recipesThisWeek}

MONDAY:
- Breakfast: [recipe name] (optional note)
- Lunch: [recipe name] (optional note)
- Dinner: [recipe name] (optional note)
- Snack: [recipe name]

TUESDAY:
- Breakfast: [recipe name] (optional note)
- Lunch: [recipe name] (optional note)
- Dinner: [recipe name] (optional note)
- Snack: [recipe name]

WEDNESDAY:
- Breakfast: [recipe name] (optional note)
- Lunch: [recipe name] (optional note)
- Dinner: [recipe name] (optional note)
- Snack: [recipe name]

THURSDAY:
- Breakfast: [recipe name] (optional note)
- Lunch: [recipe name] (optional note)
- Dinner: [recipe name] (optional note)
- Snack: [recipe name]

FRIDAY:
- Breakfast: [recipe name] (optional note)
- Lunch: [recipe name] (optional note)
- Dinner: [recipe name] (optional note)
- Snack: [recipe name]

BRAIN_TIP: [One actionable tip specifically for ${goalNames}]
\`\`\`

After the plan, write a section titled "**Why these recipes were chosen for you, ${profile.name}:**" and explain each recipe's connection to their specific goals (${goalNames}), cooking time preference, and dietary needs. Be personal and specific — don't give generic brain-health advice.`
}

// ── LLM Service ─────────────────────────────────────────────────────

export class LlmApiService {
  // Track previously selected recipes so "New Plan" gives different results
  private lastSelectedIds: Set<string> = new Set()

  buildUserContext(profile: UserProfile): string {
    return `User Profile:
- Name: ${profile.name || 'Friend'}
- Cooking skill level: ${profile.skillLevel || 'Beginner'}
- Servings per meal: ${profile.servings || '2'}
- Goals: ${profile.goals?.join(', ') || 'General brain health'}
- Dietary restrictions: ${profile.dietaryRestrictions || 'None'}
- Time available for cooking: ${profile.cookingTime || 'Limited'}

Remember to keep recommendations simple and achievable for this user's skill level.`
  }

  private isMealPlanRequest(message: string): boolean {
    const lower = message.toLowerCase()
    return lower.includes('meal plan') || lower.includes('weekly plan') ||
      (lower.includes('week') && lower.includes('plan')) ||
      (lower.includes('create') && (lower.includes('plan') || lower.includes('meal')))
  }

  private selectRecipes(profile: UserProfile): RecipePick[] {
    const picks = selectWeeklyRecipes(profile)

    // If this is the same set as last time, try to swap at least one recipe
    const selectedIds = new Set(picks.map(p => p.recipe.id))
    if (this.lastSelectedIds.size > 0 && setsEqual(selectedIds, this.lastSelectedIds)) {
      const categories = [RECIPES.breakfast, RECIPES.lunch, RECIPES.dinner, RECIPES.snacks, RECIPES.smoothies]
      for (let i = 0; i < picks.length; i++) {
        const pool = categories[i]
        const alt = pool.find(r => r.id !== picks[i].recipe.id &&
          !violatesDietaryRestrictions(r, profile.dietaryRestrictions))
        if (alt) {
          picks[i] = { recipe: alt, reason: buildReason(alt, profile) }
          break
        }
      }
    }

    this.lastSelectedIds = new Set(picks.map(p => p.recipe.id))
    return picks
  }

  async sendMessage(
    messages: Array<{ role: 'user' | 'assistant'; content: string }>,
    userProfile: UserProfile
  ): Promise<string> {
    if (!GROQ_API_KEY) {
      throw new Error('VITE_GROQ_API_KEY is not set. Get a free key at https://console.groq.com')
    }

    const lastMessage = messages[messages.length - 1]?.content || ''

    // For meal plan requests, pre-select recipes from the knowledge base
    // based on the user's profile, then ask the LLM to arrange them.
    let llmMessages: Array<{ role: string; content: string }>
    if (this.isMealPlanRequest(lastMessage)) {
      const picks = this.selectRecipes(userProfile)
      const mealPlanPrompt = buildMealPlanPrompt(picks, userProfile)
      llmMessages = [
        { role: 'system', content: `${SYSTEM_PROMPT}\n\n${this.buildUserContext(userProfile)}` },
        { role: 'user', content: mealPlanPrompt }
      ]
    } else {
      llmMessages = [
        { role: 'system', content: `${SYSTEM_PROMPT}\n\n${this.buildUserContext(userProfile)}` },
        ...messages.map(m => ({ role: m.role, content: m.content }))
      ]
    }

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: llmMessages,
        max_tokens: 4096,
        temperature: 0.7
      })
    })

    if (!response.ok) {
      const errorBody = await response.text()
      console.error('Groq API error:', response.status, errorBody)
      throw new Error(`Groq API error: ${response.status}`)
    }

    const data = await response.json()
    return data.choices?.[0]?.message?.content || 'I apologize, but I could not generate a response.'
  }
}

function setsEqual(a: Set<string>, b: Set<string>): boolean {
  if (a.size !== b.size) return false
  for (const v of a) if (!b.has(v)) return false
  return true
}

export const llmApi = new LlmApiService()
