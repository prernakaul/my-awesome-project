interface FoodImageProps {
  mealType: string
  mealName: string
}

import breakfastImg from '../../assets/food-images/breakfast.svg'
import lunchImg from '../../assets/food-images/lunch.svg'
import dinnerImg from '../../assets/food-images/dinner.svg'
import snackImg from '../../assets/food-images/snack.svg'
import saladImg from '../../assets/food-images/salad.svg'
import soupImg from '../../assets/food-images/soup.svg'
import pastaImg from '../../assets/food-images/pasta.svg'
import chickenImg from '../../assets/food-images/chicken.svg'
import fishImg from '../../assets/food-images/fish.svg'
import vegetablesImg from '../../assets/food-images/vegetables.svg'

const mealTypeImages: Record<string, string> = {
  breakfast: breakfastImg,
  lunch: lunchImg,
  dinner: dinnerImg,
  snack: snackImg
}

const keywordImages: Record<string, string> = {
  salad: saladImg,
  soup: soupImg,
  pasta: pastaImg,
  chicken: chickenImg,
  fish: fishImg,
  vegetables: vegetablesImg
}

export function FoodImage({ mealType, mealName }: FoodImageProps) {
  const getImagePath = (): string => {
    const lowerName = mealName.toLowerCase()

    for (const [keyword, path] of Object.entries(keywordImages)) {
      if (lowerName.includes(keyword)) {
        return path
      }
    }

    return mealTypeImages[mealType] || mealTypeImages.dinner
  }

  return (
    <div className="food-image-container">
      <img
        src={getImagePath()}
        alt={mealName}
        className="food-image"
        onError={(e) => {
          const target = e.target as HTMLImageElement
          target.style.display = 'none'
        }}
      />
    </div>
  )
}
