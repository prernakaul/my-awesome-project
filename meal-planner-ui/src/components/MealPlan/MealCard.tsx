import { LegacyMeal } from '../../types'
import { FoodImage } from '../common/FoodImage'

interface MealCardProps {
  meal: LegacyMeal
}

const mealIcons: Record<string, string> = {
  breakfast: '🍳',
  lunch: '🥗',
  dinner: '🍽️',
  snack: '🍎'
}

const mealColors: Record<string, string> = {
  breakfast: 'var(--breakfast-color)',
  lunch: 'var(--lunch-color)',
  dinner: 'var(--dinner-color)',
  snack: 'var(--snack-color)'
}

export function MealCard({ meal }: MealCardProps) {
  return (
    <div
      className="meal-card"
      style={{ '--accent-color': mealColors[meal.type] } as React.CSSProperties}
    >
      <div className="meal-image">
        <FoodImage mealType={meal.type} mealName={meal.name} />
      </div>
      <div className="meal-info">
        <div className="meal-type">
          <span className="meal-icon">{mealIcons[meal.type]}</span>
          <span className="meal-type-label">{meal.type}</span>
        </div>
        <h4 className="meal-name">{meal.name}</h4>
        <p className="meal-description">{meal.description}</p>
        <div className="meal-meta">
          {meal.prepTime && (
            <span className="prep-time">⏱️ {meal.prepTime}</span>
          )}
          {meal.calories && (
            <span className="calories">🔥 {meal.calories} cal</span>
          )}
        </div>
      </div>
    </div>
  )
}
