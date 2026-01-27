import { useState } from 'react'
import { getRecipeImage } from '../../utils/recipeImages'

interface RecipeCardProps {
  recipe: {
    id?: string
    name: string
    category?: string
    time: string
    brainBenefit?: string
  }
  onClick: () => void
}

const categoryColors: Record<string, { bg: string; text: string }> = {
  breakfast: { bg: '#fef3c7', text: '#92400e' },
  lunch: { bg: '#d1fae5', text: '#065f46' },
  dinner: { bg: '#fed7aa', text: '#9a3412' },
  snack: { bg: '#dbeafe', text: '#1e40af' },
  smoothie: { bg: '#fce7f3', text: '#9d174d' },
  'lunch/dinner': { bg: '#e0e7ff', text: '#3730a3' }
}

export function RecipeCard({ recipe, onClick }: RecipeCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  const category = recipe.category || 'lunch'
  const categoryLower = category.toLowerCase()
  const colors = categoryColors[categoryLower] || categoryColors['lunch/dinner']
  const imageUrl = getRecipeImage(recipe.id || recipe.name, 'card', category)

  return (
    <div className="recipe-card" onClick={onClick}>
      <div className="recipe-image-container">
        {!imageLoaded && !imageError && (
          <div className="recipe-image-placeholder">
            <span>🍽️</span>
          </div>
        )}
        {imageError ? (
          <div className="recipe-image-placeholder">
            <span>🍽️</span>
          </div>
        ) : (
          <img
            src={imageUrl}
            alt={recipe.name}
            className={`recipe-image ${imageLoaded ? 'loaded' : ''}`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
        )}
        <span
          className="recipe-category-badge"
          style={{ backgroundColor: colors.bg, color: colors.text }}
        >
          {category}
        </span>
      </div>
      <div className="recipe-info">
        <h3 className="recipe-name">{recipe.name}</h3>
        {recipe.brainBenefit && (
          <p className="recipe-benefit">
            <span className="benefit-icon">🧠</span>
            {recipe.brainBenefit.length > 60
              ? recipe.brainBenefit.substring(0, 60) + '...'
              : recipe.brainBenefit
            }
          </p>
        )}
        <div className="recipe-meta">
          <span className="recipe-time">
            <span className="meta-icon">⏱️</span>
            {recipe.time}
          </span>
        </div>
      </div>
    </div>
  )
}
