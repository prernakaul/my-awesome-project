import { DayPlan } from '../../types'
import { getRecipeImage } from '../../utils/recipeImages'

interface WeeklyCalendarProps {
  days: DayPlan[]
  onRecipeClick: (recipeName: string) => void
}

const mealTypeConfig: Record<string, { icon: string; color: string; bgColor: string }> = {
  breakfast: { icon: '🌅', color: '#92400e', bgColor: '#fef3c7' },
  lunch: { icon: '☀️', color: '#065f46', bgColor: '#d1fae5' },
  dinner: { icon: '🌙', color: '#9a3412', bgColor: '#fed7aa' },
  snack: { icon: '🥜', color: '#1e40af', bgColor: '#dbeafe' }
}

export function WeeklyCalendar({ days, onRecipeClick }: WeeklyCalendarProps) {
  return (
    <div className="weekly-calendar">
      {days.map((day, index) => (
        <div key={index} className="calendar-day">
          <div className="day-header">
            <h3>{day.day}</h3>
          </div>
          <div className="day-meals">
            {day.meals.map((meal, mealIndex) => {
              const config = mealTypeConfig[meal.type] || mealTypeConfig.snack
              return (
                <div
                  key={mealIndex}
                  className="calendar-meal"
                  onClick={() => onRecipeClick(meal.name)}
                >
                  <div className="meal-thumbnail">
                    <img
                      src={getRecipeImage(meal.name, 'thumb', meal.type)}
                      alt={meal.name}
                      loading="lazy"
                    />
                  </div>
                  <div className="meal-details">
                    <span
                      className="meal-type-label"
                      style={{ backgroundColor: config.bgColor, color: config.color }}
                    >
                      {config.icon} {meal.type}
                    </span>
                    <span className="meal-name">{meal.name}</span>
                    {meal.note && (
                      <span className="meal-note">{meal.note}</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
