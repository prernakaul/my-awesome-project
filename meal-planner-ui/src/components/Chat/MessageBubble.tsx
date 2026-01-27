import ReactMarkdown from 'react-markdown'
import { Message, WeeklyPlan, Recipe } from '../../types'

interface MessageBubbleProps {
  message: Message
}

interface ParsedBlock {
  type: 'text' | 'weekly_plan' | 'recipe'
  content: string
}

function parseMessageContent(content: string): ParsedBlock[] {
  const blocks: ParsedBlock[] = []

  // Match ```weekly_plan ... ``` or ```recipe ... ``` blocks
  const blockRegex = /```(weekly_plan|recipe)\n([\s\S]*?)```/g
  let lastIndex = 0
  let match

  while ((match = blockRegex.exec(content)) !== null) {
    // Add text before this block
    if (match.index > lastIndex) {
      const textBefore = content.slice(lastIndex, match.index).trim()
      if (textBefore) {
        blocks.push({ type: 'text', content: textBefore })
      }
    }

    blocks.push({
      type: match[1] as 'weekly_plan' | 'recipe',
      content: match[2]
    })

    lastIndex = match.index + match[0].length
  }

  // Add remaining text
  if (lastIndex < content.length) {
    const remainingText = content.slice(lastIndex).trim()
    if (remainingText) {
      blocks.push({ type: 'text', content: remainingText })
    }
  }

  // If no special blocks found, return the whole content as text
  if (blocks.length === 0) {
    blocks.push({ type: 'text', content })
  }

  return blocks
}

function parseWeeklyPlan(content: string): WeeklyPlan {
  const lines = content.split('\n')
  let weekName = ''
  let description = ''
  const recipes: WeeklyPlan['recipes'] = []
  const days: WeeklyPlan['days'] = []
  let brainTip = ''
  let currentDay: string | null = null
  let currentMeals: WeeklyPlan['days'][0]['meals'] = []
  let inRecipesList = false

  for (const line of lines) {
    const trimmed = line.trim()

    if (trimmed.startsWith('WEEK:')) {
      weekName = trimmed.replace('WEEK:', '').trim()
    } else if (trimmed.startsWith('DESCRIPTION:')) {
      description = trimmed.replace('DESCRIPTION:', '').trim()
    } else if (trimmed.startsWith('RECIPES_THIS_WEEK:')) {
      inRecipesList = true
    } else if (trimmed.startsWith('BRAIN_TIP:')) {
      brainTip = trimmed.replace('BRAIN_TIP:', '').trim()
      inRecipesList = false
    } else if (inRecipesList && trimmed.match(/^\d+\./)) {
      const recipeMatch = trimmed.match(/^\d+\.\s*(.+?)\s*-\s*(.+?)\s*-\s*(.+)$/)
      if (recipeMatch) {
        recipes.push({
          name: recipeMatch[1].trim(),
          category: recipeMatch[2].trim(),
          time: recipeMatch[3].trim()
        })
      }
    } else if (trimmed.match(/^(MONDAY|TUESDAY|WEDNESDAY|THURSDAY|FRIDAY|SATURDAY|SUNDAY):$/i)) {
      inRecipesList = false
      if (currentDay && currentMeals.length > 0) {
        days.push({ day: currentDay, meals: [...currentMeals] })
      }
      currentDay = trimmed.replace(':', '')
      currentMeals = []
    } else if (currentDay && trimmed.startsWith('-')) {
      const mealMatch = trimmed.match(/^-\s*(Breakfast|Lunch|Dinner|Snack):\s*(.+)$/i)
      if (mealMatch) {
        const mealType = mealMatch[1].toLowerCase() as 'breakfast' | 'lunch' | 'dinner' | 'snack'
        const mealContent = mealMatch[2].trim()
        const [name, ...noteParts] = mealContent.split(/\s*\(/)
        const note = noteParts.length > 0 ? noteParts.join('(').replace(/\)$/, '') : undefined
        currentMeals.push({
          type: mealType,
          name: name.trim(),
          note
        })
      }
    }
  }

  // Don't forget the last day
  if (currentDay && currentMeals.length > 0) {
    days.push({ day: currentDay, meals: currentMeals })
  }

  return { weekName, description, recipes, days, brainTip }
}

function parseRecipe(content: string): Recipe {
  const lines = content.split('\n')
  let name = ''
  let time = ''
  let servings = ''
  let brainBenefit = ''
  const ingredients: string[] = []
  const instructions: string[] = []
  let tip = ''
  let section = ''

  for (const line of lines) {
    const trimmed = line.trim()

    if (trimmed.startsWith('NAME:')) {
      name = trimmed.replace('NAME:', '').trim()
    } else if (trimmed.startsWith('TIME:')) {
      time = trimmed.replace('TIME:', '').trim()
    } else if (trimmed.startsWith('SERVINGS:')) {
      servings = trimmed.replace('SERVINGS:', '').trim()
    } else if (trimmed.startsWith('BRAIN_BENEFIT:')) {
      brainBenefit = trimmed.replace('BRAIN_BENEFIT:', '').trim()
    } else if (trimmed.startsWith('TIP:')) {
      tip = trimmed.replace('TIP:', '').trim()
    } else if (trimmed === 'INGREDIENTS:') {
      section = 'ingredients'
    } else if (trimmed === 'INSTRUCTIONS:') {
      section = 'instructions'
    } else if (trimmed.startsWith('-') && section === 'ingredients') {
      ingredients.push(trimmed.replace(/^-\s*/, ''))
    } else if (trimmed.match(/^\d+\./) && section === 'instructions') {
      instructions.push(trimmed.replace(/^\d+\.\s*/, ''))
    }
  }

  return {
    id: name.toLowerCase().replace(/\s+/g, '-'),
    name,
    time,
    servings,
    brainBenefit,
    ingredients,
    instructions,
    tip
  }
}

function WeeklyPlanCard({ plan }: { plan: WeeklyPlan }) {
  return (
    <div className="weekly-plan-card">
      <div className="plan-header">
        <h3>{plan.weekName}</h3>
        <p>{plan.description}</p>
      </div>

      {plan.recipes.length > 0 && (
        <div className="plan-recipes">
          <h4>This Week's Recipes</h4>
          <div className="recipe-list">
            {plan.recipes.map((recipe, index) => (
              <div key={index} className="recipe-chip">
                <span className="recipe-name">{recipe.name}</span>
                <span className="recipe-meta">{recipe.category} • {recipe.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {plan.days.length > 0 && (
        <div className="plan-days">
          {plan.days.map((day, index) => (
            <div key={index} className="plan-day">
              <h5>{day.day}</h5>
              <div className="day-meals">
                {day.meals.map((meal, mealIndex) => (
                  <div key={mealIndex} className="plan-meal">
                    <span className={`meal-type-badge ${meal.type}`}>{meal.type}</span>
                    <span className="meal-name">{meal.name}</span>
                    {meal.note && <span className="meal-note">({meal.note})</span>}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {plan.brainTip && (
        <div className="brain-tip">
          <span className="tip-icon">💡</span>
          <span>{plan.brainTip}</span>
        </div>
      )}
    </div>
  )
}

function RecipeCard({ recipe }: { recipe: Recipe }) {
  return (
    <div className="recipe-card">
      <div className="recipe-header">
        <h3>{recipe.name}</h3>
        <div className="recipe-meta-row">
          <span className="meta-item">⏱️ {recipe.time}</span>
          <span className="meta-item">🍽️ {recipe.servings}</span>
        </div>
      </div>

      <div className="brain-benefit">
        <span className="benefit-icon">🧠</span>
        <span>{recipe.brainBenefit}</span>
      </div>

      <div className="recipe-section">
        <h4>Ingredients</h4>
        <ul className="ingredients-list">
          {recipe.ingredients.map((ingredient, index) => (
            <li key={index}>{ingredient}</li>
          ))}
        </ul>
      </div>

      <div className="recipe-section">
        <h4>Instructions</h4>
        <ol className="instructions-list">
          {recipe.instructions.map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </ol>
      </div>

      {recipe.tip && (
        <div className="recipe-tip">
          <span className="tip-icon">💡</span>
          <span>{recipe.tip}</span>
        </div>
      )}
    </div>
  )
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user'
  const blocks = isUser ? [{ type: 'text' as const, content: message.content }] : parseMessageContent(message.content)

  return (
    <div className={`message-bubble ${isUser ? 'user' : 'assistant'}`}>
      <div className="message-avatar">
        {isUser ? '👤' : '🧠'}
      </div>
      <div className="message-content">
        {blocks.map((block, index) => {
          if (block.type === 'weekly_plan') {
            const plan = parseWeeklyPlan(block.content)
            return <WeeklyPlanCard key={index} plan={plan} />
          } else if (block.type === 'recipe') {
            const recipe = parseRecipe(block.content)
            return <RecipeCard key={index} recipe={recipe} />
          } else {
            return (
              <div key={index} className="text-content">
                <ReactMarkdown>{block.content}</ReactMarkdown>
              </div>
            )
          }
        })}
        <span className="message-time">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  )
}
