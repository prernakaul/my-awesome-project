import Anthropic from '@anthropic-ai/sdk'
import { UserProfile } from '../types'

const SYSTEM_PROMPT = `You are an expert nutritionist and culinary specialist with comprehensive knowledge of global cuisines, dietary science, and practical meal planning.

When creating meal plans, format them clearly with:
## [Day name]
### Breakfast
**[Meal name]** - [Prep time] - [Calories] cal
- Brief description

### Lunch
**[Meal name]** - [Prep time] - [Calories] cal
- Brief description

### Dinner
**[Meal name]** - [Prep time] - [Calories] cal
- Brief description

### Snack
**[Meal name]** - [Calories] cal
- Brief description

Always consider the user's dietary restrictions, health goals, budget, cooking time, skill level, and cuisine preferences when making recommendations.`

export class ClaudeApiService {
  private client: Anthropic | null = null

  constructor() {
    const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY
    if (apiKey) {
      this.client = new Anthropic({
        apiKey,
        dangerouslyAllowBrowser: true
      })
    }
  }

  buildUserContext(profile: UserProfile): string {
    return `User Profile:
- Dietary restrictions/preferences: ${profile.dietaryRestrictions || 'None specified'}
- Health goals: ${profile.healthGoals || 'General wellness'}
- Household size: ${profile.householdSize || 'Not specified'}
- Weekly budget: ${profile.budget || 'Flexible'}
- Cooking time available: ${profile.cookingTime || 'Varies'}
- Cooking skill level: ${profile.skillLevel || 'Intermediate'}
- Cuisine preferences: ${profile.cuisinePreferences || 'Open to all'}
- Foods to avoid: ${profile.foodsToAvoid || 'None'}

Please keep this profile in mind when making meal recommendations.`
  }

  async sendMessage(
    messages: Array<{ role: 'user' | 'assistant'; content: string }>,
    userProfile: UserProfile
  ): Promise<string> {
    if (!this.client) {
      return this.getMockResponse(messages[messages.length - 1]?.content || '')
    }

    try {
      const systemPrompt = `${SYSTEM_PROMPT}\n\n${this.buildUserContext(userProfile)}`

      const response = await this.client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        system: systemPrompt,
        messages: messages.map(m => ({
          role: m.role,
          content: m.content
        }))
      })

      const textBlock = response.content.find(block => block.type === 'text')
      return textBlock && 'text' in textBlock ? textBlock.text : 'I apologize, but I could not generate a response.'
    } catch (error) {
      console.error('Claude API error:', error)
      throw new Error('Failed to get response from Claude')
    }
  }

  private getMockResponse(userMessage: string): string {
    const lowerMessage = userMessage.toLowerCase()

    if (lowerMessage.includes('meal plan') || lowerMessage.includes('weekly')) {
      return `Here's a sample meal plan for you:

## Monday
### Breakfast
**Greek Yogurt Parfait** - 10 min - 350 cal
- Creamy Greek yogurt layered with fresh berries and granola

### Lunch
**Mediterranean Quinoa Bowl** - 20 min - 450 cal
- Fluffy quinoa with chickpeas, cucumber, tomatoes, and feta

### Dinner
**Lemon Herb Grilled Chicken** - 30 min - 520 cal
- Tender chicken breast with roasted vegetables

### Snack
**Apple with Almond Butter** - 180 cal
- Fresh apple slices with creamy almond butter

## Tuesday
### Breakfast
**Avocado Toast with Eggs** - 15 min - 400 cal
- Whole grain toast topped with mashed avocado and poached eggs

### Lunch
**Asian Chicken Salad** - 15 min - 380 cal
- Mixed greens with grilled chicken and sesame dressing

### Dinner
**Baked Salmon with Asparagus** - 25 min - 480 cal
- Wild-caught salmon with roasted asparagus

### Snack
**Mixed Nuts** - 160 cal
- A handful of almonds, walnuts, and cashews

This plan provides balanced nutrition while being easy to prepare. Would you like me to modify anything?`
    }

    return `I'd be happy to help with your meal planning needs! Here are some things I can help with:

- **Weekly meal plans** tailored to your dietary needs
- **Recipe suggestions** based on ingredients you have
- **Grocery lists** organized by store section
- **Nutritional guidance** for your health goals

What would you like me to help you with today?`
  }
}

export const claudeApi = new ClaudeApiService()
