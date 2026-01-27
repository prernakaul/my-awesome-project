import { useState } from 'react'
import { WeeklyPlan } from '../../types'
import { RecipeCard } from './RecipeCard'
import { WeeklyCalendar } from './WeeklyCalendar'
import { RecipeModal } from './RecipeModal'
import { GroceryList } from './GroceryList'
import { RECIPES } from '../../data/brainFoodKnowledge'

interface MealPlanDashboardProps {
  weeklyPlan: WeeklyPlan | null
  isGenerating: boolean
  onGenerateNewPlan: () => void
}

// Get all recipes as a flat array
const ALL_RECIPES = [
  ...RECIPES.breakfast.map(r => ({ ...r, category: 'Breakfast' })),
  ...RECIPES.lunch.map(r => ({ ...r, category: 'Lunch' })),
  ...RECIPES.dinner.map(r => ({ ...r, category: 'Dinner' })),
  ...RECIPES.snacks.map(r => ({ ...r, category: 'Snack' })),
  ...RECIPES.smoothies.map(r => ({ ...r, category: 'Smoothie' }))
]

function getRecipeById(id: string): (typeof ALL_RECIPES)[0] | null {
  return ALL_RECIPES.find(r => r.id === id) || null
}

function getRecipeByName(name: string): (typeof ALL_RECIPES)[0] | null {
  return ALL_RECIPES.find(r =>
    r.name.toLowerCase().includes(name.toLowerCase()) ||
    name.toLowerCase().includes(r.name.toLowerCase())
  ) || null
}

export function MealPlanDashboard({
  weeklyPlan,
  isGenerating,
  onGenerateNewPlan
}: MealPlanDashboardProps) {
  const [selectedRecipe, setSelectedRecipe] = useState<(typeof ALL_RECIPES)[0] | null>(null)
  const [activeView, setActiveView] = useState<'plan' | 'recipes' | 'grocery'>('plan')

  // Get this week's recipes from the plan
  const weekRecipes = weeklyPlan?.recipes.map(r => {
    const recipe = getRecipeByName(r.name)
    return recipe ? { ...recipe, planCategory: r.category } : null
  }).filter(Boolean) || []

  if (isGenerating) {
    return (
      <div className="dashboard-loading">
        <div className="loading-content">
          <div className="loading-animation">
            <span className="food-icon">🥗</span>
            <span className="food-icon">🍳</span>
            <span className="food-icon">🥜</span>
          </div>
          <h2>Creating your personalized meal plan...</h2>
          <p>Selecting brain-boosting recipes based on your preferences</p>
        </div>
      </div>
    )
  }

  if (!weeklyPlan) {
    return (
      <div className="dashboard-empty">
        <div className="empty-content">
          <div className="empty-illustration">
            <span className="big-icon">🧠</span>
            <div className="floating-foods">
              <span>🥑</span>
              <span>🫐</span>
              <span>🐟</span>
              <span>🥬</span>
            </div>
          </div>
          <h2>Ready to fuel your brain?</h2>
          <p>Get a personalized weekly meal plan with just 4-5 simple recipes<br/>designed to boost your cognitive power.</p>
          <button className="btn btn-primary btn-large" onClick={onGenerateNewPlan}>
            <span>✨</span> Generate My Meal Plan
          </button>
        </div>
      </div>
    )
  }

  const handleRecipeClick = (recipeNameOrId: string) => {
    const recipe = getRecipeByName(recipeNameOrId) || getRecipeById(recipeNameOrId)
    if (recipe) {
      setSelectedRecipe(recipe)
    }
  }

  return (
    <div className="dashboard">
      {/* Hero Section */}
      <div className="plan-hero">
        <div className="hero-content">
          <span className="hero-badge">This Week's Plan</span>
          <h1>{weeklyPlan.weekName}</h1>
          <p>{weeklyPlan.description}</p>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-value">{weeklyPlan.recipes.length}</span>
              <span className="stat-label">Recipes</span>
            </div>
            <div className="stat">
              <span className="stat-value">5</span>
              <span className="stat-label">Days</span>
            </div>
            <div className="stat">
              <span className="stat-value">~25</span>
              <span className="stat-label">Min avg</span>
            </div>
          </div>
        </div>
        <button className="btn btn-outline" onClick={onGenerateNewPlan}>
          <span>🔄</span> New Plan
        </button>
      </div>

      {/* Brain Tip */}
      {weeklyPlan.brainTip && (
        <div className="brain-tip-card">
          <div className="tip-icon">💡</div>
          <div className="tip-content">
            <span className="tip-label">Brain Tip of the Week</span>
            <p>{weeklyPlan.brainTip}</p>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="dashboard-nav">
        <button
          className={`nav-tab ${activeView === 'plan' ? 'active' : ''}`}
          onClick={() => setActiveView('plan')}
        >
          <span className="nav-icon">📅</span>
          <span className="nav-label">Weekly Plan</span>
        </button>
        <button
          className={`nav-tab ${activeView === 'recipes' ? 'active' : ''}`}
          onClick={() => setActiveView('recipes')}
        >
          <span className="nav-icon">🍳</span>
          <span className="nav-label">Recipes ({weekRecipes.length})</span>
        </button>
        <button
          className={`nav-tab ${activeView === 'grocery' ? 'active' : ''}`}
          onClick={() => setActiveView('grocery')}
        >
          <span className="nav-icon">🛒</span>
          <span className="nav-label">Grocery List</span>
        </button>
      </nav>

      {/* Content */}
      <div className="dashboard-content">
        {activeView === 'plan' && (
          <WeeklyCalendar
            days={weeklyPlan.days}
            onRecipeClick={handleRecipeClick}
          />
        )}

        {activeView === 'recipes' && (
          <div className="recipes-section">
            <div className="section-header">
              <h2>This Week's Recipes</h2>
              <p>Just {weekRecipes.length} simple recipes to cook once and enjoy all week</p>
            </div>
            <div className="recipes-grid">
              {weekRecipes.map((recipe, index) => recipe && (
                <RecipeCard
                  key={recipe.id || index}
                  recipe={recipe}
                  onClick={() => setSelectedRecipe(recipe)}
                />
              ))}
            </div>
          </div>
        )}

        {activeView === 'grocery' && (
          <GroceryList recipes={weekRecipes.filter(Boolean) as typeof ALL_RECIPES} />
        )}
      </div>

      {/* Recipe Modal */}
      {selectedRecipe && (
        <RecipeModal
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
        />
      )}
    </div>
  )
}
