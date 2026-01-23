import { useState, useEffect } from 'react'
import { MessageList } from './MessageList'
import { ChatInput } from './ChatInput'
import { MealPlanDisplay } from '../MealPlan/MealPlanDisplay'
import { useChat } from '../../hooks/useChat'
import { UserProfile, MealPlan } from '../../types'
import { LoadingSpinner } from '../common/LoadingSpinner'

interface ChatContainerProps {
  userProfile: UserProfile
}

export function ChatContainer({ userProfile }: ChatContainerProps) {
  const { messages, isLoading, sendMessage } = useChat(userProfile)
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null)

  useEffect(() => {
    // Parse meal plan from assistant messages - check all messages in reverse order
    const assistantMessages = [...messages]
      .reverse()
      .filter(m => m.role === 'assistant')

    for (const msg of assistantMessages) {
      const parsed = parseMealPlan(msg.content)
      if (parsed && parsed.days.length > 0) {
        setMealPlan(parsed)
        return
      }
    }
  }, [messages])

  return (
    <div className="chat-container">
      <div className="chat-section">
        <div className="chat-header">
          <h2>Chat with your Meal Planner</h2>
          <p className="profile-summary">
            Planning for: {userProfile.householdSize} | Budget: {userProfile.budget} | Goal: {userProfile.healthGoals}
          </p>
        </div>
        <MessageList messages={messages} onSuggestionClick={sendMessage} />
        {isLoading && (
          <div className="loading-indicator">
            <LoadingSpinner />
            <span>Thinking...</span>
          </div>
        )}
        <ChatInput onSend={sendMessage} disabled={isLoading} />
      </div>

      {mealPlan && (
        <div className="meal-plan-section">
          <MealPlanDisplay mealPlan={mealPlan} />
        </div>
      )}
    </div>
  )
}

function parseMealPlan(content: string): MealPlan | null {
  const days: MealPlan['days'] = []

  // More flexible day pattern - matches ##, ###, **, or just the day name at start of line
  const dayPattern = /(?:^|\n)(?:#{1,3}\s*|\*\*)?((Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday|Day\s*\d+)(?:\s*[-:])?)/gi
  const dayMatches = [...content.matchAll(dayPattern)]

  if (dayMatches.length === 0) {
    return null
  }

  // Split content by day headers
  const daySplitPattern = /(?=(?:^|\n)(?:#{1,3}\s*|\*\*)?(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday|Day\s*\d+))/gi
  const daySections = content.split(daySplitPattern).filter(s => s.trim())

  let currentDay: string | null = null
  let currentSection = ''

  for (const section of daySections) {
    const trimmed = section.trim()

    // Check if this section starts with a day name
    const dayNameMatch = trimmed.match(/^(?:#{1,3}\s*|\*\*)?(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday|Day\s*\d+)/i)

    if (dayNameMatch) {
      // Process previous day if exists
      if (currentDay && currentSection) {
        const meals = parseMealsFromSection(currentSection)
        if (meals.length > 0) {
          days.push({ day: currentDay, meals })
        }
      }
      currentDay = dayNameMatch[1]
      currentSection = trimmed
    } else if (currentDay) {
      currentSection += '\n' + trimmed
    }
  }

  // Don't forget the last day
  if (currentDay && currentSection) {
    const meals = parseMealsFromSection(currentSection)
    if (meals.length > 0) {
      days.push({ day: currentDay, meals })
    }
  }

  return days.length > 0 ? { days } : null
}

function parseMealsFromSection(section: string): MealPlan['days'][0]['meals'] {
  const meals: MealPlan['days'][0]['meals'] = []
  const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'] as const

  for (const mealType of mealTypes) {
    // More flexible meal pattern - matches ###, **, or just the meal type
    const mealRegex = new RegExp(`(?:#{1,3}\\s*|\\*\\*)?${mealType}[:\\s*]*\\**([\\s\\S]*?)(?=(?:#{1,3}\\s*|\\*\\*)?(?:breakfast|lunch|dinner|snack)|$)`, 'i')
    const mealMatch = section.match(mealRegex)

    if (mealMatch) {
      const mealContent = mealMatch[1].trim()
      if (!mealContent) continue

      const lines = mealContent.split('\n').filter(l => l.trim())
      if (lines.length === 0) continue

      // Extract meal name - look for bold text or first meaningful line
      let name = ''
      const firstLine = lines[0].replace(/^[-*•]\s*/, '').trim()

      // Try to find bold text first
      const boldMatch = mealContent.match(/\*\*([^*]+)\*\*/)
      if (boldMatch) {
        name = boldMatch[1].trim()
      } else {
        // Take first line up to a dash or colon
        name = firstLine.split(/[-–:]/)[0].trim()
      }

      if (!name) continue

      const calorieMatch = mealContent.match(/(\d+)\s*(?:cal|kcal|calories)/i)
      const timeMatch = mealContent.match(/(\d+)\s*(?:min|minutes)/i)

      // Get description from remaining content
      let description = lines.slice(1).join(' ').replace(/\*\*/g, '').trim()
      if (!description) {
        description = firstLine.includes('-') ? firstLine.split('-').slice(1).join('-').trim() : 'Delicious and nutritious'
      }

      meals.push({
        type: mealType,
        name: name,
        description: description,
        prepTime: timeMatch ? `${timeMatch[1]} min` : undefined,
        calories: calorieMatch ? parseInt(calorieMatch[1]) : undefined
      })
    }
  }

  return meals
}
