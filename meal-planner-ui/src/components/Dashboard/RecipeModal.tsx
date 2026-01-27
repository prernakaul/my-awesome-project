import { Recipe } from '../../types'
import { getRecipeImage } from '../../utils/recipeImages'

interface RecipeModalProps {
  recipe: Recipe & { id?: string; category?: string }
  onClose: () => void
}

export function RecipeModal({ recipe, onClose }: RecipeModalProps) {
  const imageUrl = getRecipeImage(recipe.id || recipe.name, 'hero', recipe.category)

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>

        <div className="modal-image">
          <img src={imageUrl} alt={recipe.name} />
        </div>

        <div className="modal-body">
          <h2>{recipe.name}</h2>

          <div className="recipe-meta-row">
            <span className="meta-badge">
              <span className="meta-icon">⏱️</span>
              {recipe.time}
            </span>
            <span className="meta-badge">
              <span className="meta-icon">🍽️</span>
              {recipe.servings}
            </span>
          </div>

          <div className="brain-benefit-box">
            <span className="benefit-icon">🧠</span>
            <div>
              <strong>Brain Benefit</strong>
              <p>{recipe.brainBenefit}</p>
            </div>
          </div>

          <div className="recipe-sections">
            <div className="recipe-section">
              <h3>Ingredients</h3>
              <ul className="ingredients-list">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index}>
                    <span className="ingredient-bullet">•</span>
                    {ingredient}
                  </li>
                ))}
              </ul>
            </div>

            <div className="recipe-section">
              <h3>Instructions</h3>
              <ol className="instructions-list">
                {recipe.instructions.map((step, index) => (
                  <li key={index}>
                    <span className="step-number">{index + 1}</span>
                    <span className="step-text">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {recipe.tip && (
            <div className="recipe-tip-box">
              <span className="tip-icon">💡</span>
              <div>
                <strong>Pro Tip</strong>
                <p>{recipe.tip}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
