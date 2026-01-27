import { MealPlan, LegacyDayPlan } from '../../types'
import { DayCard } from './DayCard'

interface MealPlanDisplayProps {
  mealPlan: MealPlan
}

export function MealPlanDisplay({ mealPlan }: MealPlanDisplayProps) {
  return (
    <div className="meal-plan-display">
      <div className="meal-plan-header">
        <h2>Your Meal Plan</h2>
        <p>{mealPlan.days.length} days planned</p>
      </div>
      <div className="meal-plan-days">
        {mealPlan.days.map((day: LegacyDayPlan, index: number) => (
          <DayCard key={index} day={day} />
        ))}
      </div>
    </div>
  )
}
