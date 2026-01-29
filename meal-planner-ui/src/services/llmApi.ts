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

## Available Recipes in Your Knowledge Base:
${Object.entries(RECIPES).map(([category, items]) =>
  `### ${category.charAt(0).toUpperCase() + category.slice(1)}:\n${items.map(r => `- ${r.name} (${r.time}): ${r.brainBenefit}`).join('\n')}`
).join('\n\n')}

## Sample Weekly Plan Structure:
When creating meal plans, use this format:

\`\`\`weekly_plan
WEEK: [Week name]
DESCRIPTION: [Brief description]

RECIPES_THIS_WEEK:
1. [Recipe name] - [Category] - [Time]
2. [Recipe name] - [Category] - [Time]
3. [Recipe name] - [Category] - [Time]
4. [Recipe name] - [Category] - [Time]
5. [Recipe name] - [Category] - [Time]

MONDAY:
- Breakfast: [Recipe] [Note if leftovers]
- Lunch: [Recipe] [Note]
- Dinner: [Recipe] [Note]
- Snack: [Recipe]

[Continue for each day...]

BRAIN_TIP: [One actionable brain-health tip for the week]
\`\`\`

## When showing a single recipe, use:
\`\`\`recipe
NAME: [Recipe name]
TIME: [Prep + cook time]
SERVINGS: [Number]
BRAIN_BENEFIT: [Why this is good for the brain]

INGREDIENTS:
- [ingredient 1]
- [ingredient 2]
...

INSTRUCTIONS:
1. [Step 1]
2. [Step 2]
...

TIP: [Helpful cooking or storage tip]
\`\`\`

Remember: Your goal is to make brain-healthy eating EASY and ACCESSIBLE. Don't overwhelm users with too many recipes - simplicity is key!`

export class LlmApiService {
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

  async sendMessage(
    messages: Array<{ role: 'user' | 'assistant'; content: string }>,
    userProfile: UserProfile
  ): Promise<string> {
    if (!GROQ_API_KEY) {
      throw new Error('VITE_GROQ_API_KEY is not set. Get a free key at https://console.groq.com')
    }

    const systemPrompt = `${SYSTEM_PROMPT}\n\n${this.buildUserContext(userProfile)}`

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages.map(m => ({ role: m.role, content: m.content }))
        ],
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

export const llmApi = new LlmApiService()
