import { LegacyDayPlan } from '../../types'
import { MealCard } from './MealCard'

interface DayCardProps {
  day: LegacyDayPlan
}

export function DayCard({ day }: DayCardProps) {
  const totalCalories = day.meals.reduce((sum, meal) => sum + (meal.calories || 0), 0)

  return (
    <div className="day-card">
      <div className="day-header">
        <h3>{day.day}</h3>
        {totalCalories > 0 && (
          <span className="day-calories">{totalCalories} cal</span>
        )}
      </div>
      <div className="day-meals">
        {day.meals.map((meal, index) => (
          <MealCard key={index} meal={meal} />
        ))}
      </div>
    </div>
  )
}
