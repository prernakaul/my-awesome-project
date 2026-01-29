import { UserProfile } from '../types'
import { BRAIN_FOOD_PRINCIPLES, RECIPES } from '../data/brainFoodKnowledge'

const OLLAMA_URL = import.meta.env.VITE_OLLAMA_URL || 'http://localhost:11434'

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
  private available: boolean = true
  private mockPlanIndex: number = 0

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
    if (!this.available) {
      return this.getMockResponse(messages[messages.length - 1]?.content || '', userProfile)
    }

    try {
      const systemPrompt = `${SYSTEM_PROMPT}\n\n${this.buildUserContext(userProfile)}`

      const response = await fetch(`${OLLAMA_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama3.1',
          messages: [
            { role: 'system', content: systemPrompt },
            ...messages.map(m => ({ role: m.role, content: m.content }))
          ],
          stream: false
        })
      })

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status}`)
      }

      const data = await response.json()
      return data.message?.content || 'I apologize, but I could not generate a response.'
    } catch (error) {
      console.error('Ollama API error:', error)
      // Fall back to mock responses when Ollama is unreachable (e.g. deployed on Vercel/Railway)
      this.available = false
      return this.getMockResponse(messages[messages.length - 1]?.content || '', userProfile)
    }
  }

  private getMockResponse(userMessage: string, profile: UserProfile): string {
    const lowerMessage = userMessage.toLowerCase()
    const userName = profile.name || 'there'

    if (lowerMessage.includes('meal plan') || lowerMessage.includes('weekly') || lowerMessage.includes('week')) {
      const plans = this.getMockWeeklyPlans(userName)
      const plan = plans[this.mockPlanIndex % plans.length]
      this.mockPlanIndex++
      return plan
    }

    if (lowerMessage.includes('recipe') || lowerMessage.includes('salmon')) {
      const salmon = RECIPES.dinner.find(r => r.id === 'grilled-salmon-ginger')!
      return `Here's one of my favorite brain-boosting recipes:

\`\`\`recipe
NAME: ${salmon.name}
TIME: ${salmon.time}
SERVINGS: ${salmon.servings}
BRAIN_BENEFIT: ${salmon.brainBenefit}

INGREDIENTS:
${salmon.ingredients.map(i => `- ${i}`).join('\n')}

INSTRUCTIONS:
${salmon.instructions.map((s, i) => `${i + 1}. ${s}`).join('\n')}

TIP: Wild-caught Alaskan salmon has the highest omega-3 content. Look for it at Costco or Trader Joe's!
\`\`\`

This recipe is perfect for brain health because wild salmon is the **#1 food source of DHA** - the omega-3 fatty acid that makes up a large part of your brain cell membranes!`
    }

    if (lowerMessage.includes('snack') || lowerMessage.includes('trail mix')) {
      const trailMix = RECIPES.snacks.find(r => r.id === 'brain-trail-mix')!
      return `Here's the ultimate brain-healthy snack:

\`\`\`recipe
NAME: ${trailMix.name}
TIME: ${trailMix.time}
SERVINGS: ${trailMix.servings}
BRAIN_BENEFIT: ${trailMix.brainBenefit}

INGREDIENTS:
${trailMix.ingredients.map(i => `- ${i}`).join('\n')}

INSTRUCTIONS:
${trailMix.instructions.map((s, i) => `${i + 1}. ${s}`).join('\n')}

TIP: Pre-portion into small containers for grab-and-go brain fuel!
\`\`\`

**Brain benefits of each ingredient:**
- **Walnuts**: Highest omega-3 content of any nut
- **Brazil nuts**: Selenium for brain cell protection
- **Goji berries**: Antioxidants that cross the blood-brain barrier
- **Cacao nibs**: Flavonoids that improve blood flow to the brain
- **Pumpkin seeds**: Zinc for memory and focus`
    }

    if (lowerMessage.includes('grocery') || lowerMessage.includes('shopping')) {
      return `Here's your **Brain-Boosting Grocery List** for the week:

**Produce:**
- Baby spinach (2 bags)
- Sweet potatoes (4)
- Blueberries (2 pints)
- Apples (4)
- Lemons (4)
- Fresh ginger root
- Garlic (1 head)
- Yellow onions (2)
- Fresh cilantro
- Broccolini (2 bunches)

**Protein:**
- Wild Alaskan salmon (12 oz)
- Chickpeas (2 cans)

**Dairy:**
- Greek yogurt (32 oz)
- Organic whole milk (1 quart)

**Grains & Legumes:**
- Steel-cut oats (1 lb)
- Quinoa (1 lb)
- Red lentils (1 lb)

**Pantry:**
- Extra virgin olive oil
- Coconut oil
- Tahini
- Maple syrup
- Tamari or soy sauce
- Vegetable broth (2 cartons)
- Diced tomatoes (2 cans)
- Coconut milk (1 can)

**Nuts & Seeds:**
- Walnuts, Almonds, Hazelnuts
- Chia seeds, Pumpkin seeds
- Goji berries

**Brain Tip:** Shop the perimeter of the store first - that's where all the fresh, brain-healthy foods are!`
    }

    return `Hi ${userName}! I'm your brain-health nutrition guide, trained on the research of Dr. Lisa Mosconi.

I can help you with:

🧠 **Weekly Meal Plans** - Just 4-5 simple recipes that repeat throughout the week
🥗 **Brain-Boosting Recipes** - Easy dishes with powerful cognitive benefits
🛒 **Grocery Lists** - Organized shopping lists for your meal plan
💡 **Brain Food Tips** - Simple habits to sharpen your mind

**Quick facts about brain-healthy eating:**
- Omega-3s (from salmon, walnuts) build brain cell membranes
- Berries protect brain cells from aging
- Turmeric helps your brain absorb nutrients
- Hydration is crucial - 8 glasses of water daily!

What would you like to explore? Try asking for a "weekly meal plan" or "show me a recipe"!`
  }

  private getMockWeeklyPlans(userName: string): string[] {
    return [
      `Hi ${userName}! Here's your Brain-Boosting Beginner Week - just **5 simple recipes** that you'll mix and match all week:

\`\`\`weekly_plan
WEEK: Brain-Boosting Beginner Week
DESCRIPTION: A simple week designed for newbie cooks. Cook once, eat multiple times!

RECIPES_THIS_WEEK:
1. Swiss Overnight Oats - Breakfast - 10 min prep
2. Lentil Dal with Spinach - Lunch/Dinner - 25 min
3. Grilled Salmon in Ginger Marinade - Dinner - 20 min
4. Rainbow Buddha Bowl - Lunch/Dinner - 30 min
5. Brain-Healthy Trail Mix - Snack - 5 min

MONDAY:
- Breakfast: Swiss Overnight Oats (prep Sunday night!)
- Lunch: Lentil Dal with Spinach (make a big batch)
- Dinner: Grilled Salmon with steamed veggies
- Snack: Brain-Healthy Trail Mix

TUESDAY:
- Breakfast: Swiss Overnight Oats (leftovers)
- Lunch: Lentil Dal (tastes even better day 2!)
- Dinner: Rainbow Buddha Bowl
- Snack: Brain-Healthy Trail Mix

WEDNESDAY:
- Breakfast: Swiss Overnight Oats (last of batch)
- Lunch: Rainbow Buddha Bowl (leftovers)
- Dinner: Lentil Dal
- Snack: Brain-Healthy Trail Mix

THURSDAY:
- Breakfast: Swiss Overnight Oats (make fresh batch)
- Lunch: Lentil Dal (last of batch)
- Dinner: Grilled Salmon
- Snack: Brain-Healthy Trail Mix

FRIDAY:
- Breakfast: Swiss Overnight Oats
- Lunch: Rainbow Buddha Bowl (make fresh)
- Dinner: Rainbow Buddha Bowl
- Snack: Brain-Healthy Trail Mix

BRAIN_TIP: Start each morning with a glass of warm water and lemon - it hydrates your brain and aids digestion!
\`\`\`

**Why these recipes are brain-boosters:**
- **Salmon**: Packed with DHA omega-3s, the building blocks of brain cell membranes
- **Lentil Dal**: Turmeric helps your brain absorb omega-3s better
- **Overnight Oats**: Fiber keeps blood sugar steady for sustained focus
- **Buddha Bowl**: Colorful veggies = diverse antioxidants protecting brain cells
- **Trail Mix**: Walnuts literally look like little brains - they're full of omega-3s!

Would you like me to show you any of these recipes in detail?`,

      `Hi ${userName}! Here's your Mediterranean Mind Week - a fresh set of **5 brain-boosting recipes**:

\`\`\`weekly_plan
WEEK: Mediterranean Mind Week
DESCRIPTION: Mediterranean-inspired meals packed with omega-3s and antioxidants for peak brain performance.

RECIPES_THIS_WEEK:
1. Blueberry Brain Smoothie - Breakfast - 5 min
2. Turmeric Chickpea Bowl - Lunch/Dinner - 20 min
3. Walnut-Crusted Baked Salmon - Dinner - 25 min
4. Spinach and Sweet Potato Soup - Lunch/Dinner - 30 min
5. Dark Chocolate Almond Bites - Snack - 10 min

MONDAY:
- Breakfast: Blueberry Brain Smoothie
- Lunch: Turmeric Chickpea Bowl (make a big batch)
- Dinner: Walnut-Crusted Baked Salmon
- Snack: Dark Chocolate Almond Bites

TUESDAY:
- Breakfast: Blueberry Brain Smoothie
- Lunch: Turmeric Chickpea Bowl (leftovers)
- Dinner: Spinach and Sweet Potato Soup (make a big pot)
- Snack: Dark Chocolate Almond Bites

WEDNESDAY:
- Breakfast: Blueberry Brain Smoothie
- Lunch: Spinach and Sweet Potato Soup (leftovers)
- Dinner: Turmeric Chickpea Bowl
- Snack: Dark Chocolate Almond Bites

THURSDAY:
- Breakfast: Blueberry Brain Smoothie
- Lunch: Spinach and Sweet Potato Soup (last of batch)
- Dinner: Walnut-Crusted Baked Salmon
- Snack: Dark Chocolate Almond Bites

FRIDAY:
- Breakfast: Blueberry Brain Smoothie
- Lunch: Turmeric Chickpea Bowl (make fresh)
- Dinner: Spinach and Sweet Potato Soup
- Snack: Dark Chocolate Almond Bites

BRAIN_TIP: Pair turmeric with black pepper to increase curcumin absorption by up to 2000% - your brain will thank you!
\`\`\`

**Why these recipes are brain-boosters:**
- **Blueberries**: Anthocyanins cross the blood-brain barrier and protect neurons
- **Turmeric + Chickpeas**: Curcumin reduces brain inflammation and boosts memory
- **Walnut-Crusted Salmon**: Double omega-3 power from walnuts AND salmon
- **Spinach + Sweet Potato**: Folate and beta-carotene fuel brain cell repair
- **Dark Chocolate**: Flavonoids increase blood flow to the brain

Would you like me to show you any of these recipes in detail?`,

      `Hi ${userName}! Here's your Focus & Energy Week - **5 recipes** designed to keep you sharp all day:

\`\`\`weekly_plan
WEEK: Focus and Energy Week
DESCRIPTION: Recipes rich in B-vitamins and iron to sustain mental energy and concentration throughout the day.

RECIPES_THIS_WEEK:
1. Green Power Smoothie Bowl - Breakfast - 10 min
2. Quinoa Mediterranean Salad - Lunch - 15 min
3. Herb-Baked Mackerel with Greens - Dinner - 25 min
4. Roasted Beet and Lentil Bowl - Lunch/Dinner - 35 min
5. Omega Trail Mix - Snack - 5 min

MONDAY:
- Breakfast: Green Power Smoothie Bowl
- Lunch: Quinoa Mediterranean Salad (make a big batch)
- Dinner: Herb-Baked Mackerel with Greens
- Snack: Omega Trail Mix

TUESDAY:
- Breakfast: Green Power Smoothie Bowl
- Lunch: Quinoa Mediterranean Salad (leftovers)
- Dinner: Roasted Beet and Lentil Bowl (make extra)
- Snack: Omega Trail Mix

WEDNESDAY:
- Breakfast: Green Power Smoothie Bowl
- Lunch: Roasted Beet and Lentil Bowl (leftovers)
- Dinner: Quinoa Mediterranean Salad
- Snack: Omega Trail Mix

THURSDAY:
- Breakfast: Green Power Smoothie Bowl
- Lunch: Roasted Beet and Lentil Bowl (last of batch)
- Dinner: Herb-Baked Mackerel with Greens
- Snack: Omega Trail Mix

FRIDAY:
- Breakfast: Green Power Smoothie Bowl
- Lunch: Quinoa Mediterranean Salad (make fresh)
- Dinner: Roasted Beet and Lentil Bowl
- Snack: Omega Trail Mix

BRAIN_TIP: Eat your biggest brain-food meal at lunch - your brain uses the most energy between 10am and 2pm!
\`\`\`

**Why these recipes are brain-boosters:**
- **Green Smoothie Bowl**: Spinach and avocado deliver folate and healthy fats for neuron health
- **Quinoa Salad**: Complete protein with all 9 amino acids your brain needs
- **Mackerel**: Even higher in omega-3s than salmon, and more affordable
- **Beet + Lentil Bowl**: Beets boost blood flow to the brain; lentils provide steady energy
- **Omega Trail Mix**: A quick hit of brain-essential fatty acids

Would you like me to show you any of these recipes in detail?`
    ]
  }
}

export const llmApi = new LlmApiService()
