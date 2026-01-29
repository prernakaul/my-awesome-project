import { useState } from 'react'
import { QuestionFlow } from './components/Questions/QuestionFlow'
import { MealPlanDashboard } from './components/Dashboard/MealPlanDashboard'
import { UserProfile, WeeklyPlan } from './types'
import { llmApi } from './services/llmApi'

function App() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyPlan | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleOnboardingComplete = async (profile: UserProfile) => {
    setUserProfile(profile)
    setIsGenerating(true)

    try {
      const response = await llmApi.sendMessage(
        [{ role: 'user', content: 'Create a weekly meal plan for me' }],
        profile
      )

      const plan = parseWeeklyPlanFromResponse(response)
      if (plan) {
        setWeeklyPlan(plan)
      }
    } catch (error) {
      console.error('Error generating meal plan:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleGenerateNewPlan = async () => {
    if (!userProfile) return
    setIsGenerating(true)

    try {
      const response = await llmApi.sendMessage(
        [{ role: 'user', content: 'Create a different weekly meal plan for me with new recipes' }],
        userProfile
      )

      const plan = parseWeeklyPlanFromResponse(response)
      if (plan) {
        setWeeklyPlan(plan)
      }
    } catch (error) {
      console.error('Error generating meal plan:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleResetProfile = () => {
    setUserProfile(null)
    setWeeklyPlan(null)
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="header-brand">
            <span className="brand-icon">🧠</span>
            <div>
              <h1>Brain Food</h1>
              <p>Eat smart. Think sharp.</p>
            </div>
          </div>
          {userProfile && (
            <div className="header-actions">
              <span className="user-greeting">Hi, {userProfile.name}!</span>
              <button className="header-btn" onClick={handleResetProfile}>
                Start Over
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="app-main">
        {!userProfile ? (
          <div className="onboarding-wrapper">
            <div className="onboarding-intro">
              <h2>Welcome to Brain Food!</h2>
              <p>
                Based on the research of Dr. Lisa Mosconi, we'll create simple,
                delicious meal plans designed to boost your brain power.
              </p>
              <div className="intro-features">
                <div className="intro-feature">
                  <span className="feature-icon">🥗</span>
                  <span>Only 4-5 recipes per week</span>
                </div>
                <div className="intro-feature">
                  <span className="feature-icon">⏱️</span>
                  <span>Simple, quick cooking</span>
                </div>
                <div className="intro-feature">
                  <span className="feature-icon">🔬</span>
                  <span>Science-backed nutrition</span>
                </div>
              </div>
            </div>
            <QuestionFlow onComplete={handleOnboardingComplete} />
          </div>
        ) : (
          <MealPlanDashboard
            weeklyPlan={weeklyPlan}
            isGenerating={isGenerating}
            onGenerateNewPlan={handleGenerateNewPlan}
          />
        )}
      </main>

      <footer className="app-footer">
        <p>Inspired by "Brain Food" by Dr. Lisa Mosconi</p>
      </footer>
    </div>
  )
}

function parseWeeklyPlanFromResponse(response: string): WeeklyPlan | null {
  const weeklyPlanMatch = response.match(/```weekly_plan\n([\s\S]*?)```/)
  if (!weeklyPlanMatch) return null

  const content = weeklyPlanMatch[1]
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

  if (currentDay && currentMeals.length > 0) {
    days.push({ day: currentDay, meals: currentMeals })
  }

  return { weekName, description, recipes, days, brainTip }
}

export default App
