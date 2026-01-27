import { useState } from 'react'

interface GroceryItem {
  name: string
  quantity?: string
  category: string
  checked: boolean
}

interface GroceryListProps {
  recipes: Array<{
    id?: string
    name: string
    ingredients: string[]
    category?: string
  }>
}

// Categorize ingredients
function categorizeIngredient(ingredient: string): string {
  const lower = ingredient.toLowerCase()

  if (lower.includes('salmon') || lower.includes('fish') || lower.includes('tilapia') ||
      lower.includes('chicken') || lower.includes('beef') || lower.includes('pork')) {
    return 'Protein'
  }
  if (lower.includes('milk') || lower.includes('yogurt') || lower.includes('cheese') ||
      lower.includes('butter') || lower.includes('cream') || lower.includes('egg')) {
    return 'Dairy & Eggs'
  }
  if (lower.includes('spinach') || lower.includes('kale') || lower.includes('lettuce') ||
      lower.includes('arugula') || lower.includes('greens') || lower.includes('cabbage') ||
      lower.includes('broccoli') || lower.includes('carrot') || lower.includes('onion') ||
      lower.includes('garlic') || lower.includes('tomato') || lower.includes('pepper') ||
      lower.includes('cucumber') || lower.includes('celery') || lower.includes('potato') ||
      lower.includes('sweet potato') || lower.includes('zucchini') || lower.includes('mushroom')) {
    return 'Vegetables'
  }
  if (lower.includes('apple') || lower.includes('banana') || lower.includes('berry') ||
      lower.includes('blueberry') || lower.includes('strawberry') || lower.includes('orange') ||
      lower.includes('lemon') || lower.includes('lime') || lower.includes('avocado') ||
      lower.includes('mango') || lower.includes('peach') || lower.includes('grape')) {
    return 'Fruits'
  }
  if (lower.includes('rice') || lower.includes('pasta') || lower.includes('bread') ||
      lower.includes('oat') || lower.includes('quinoa') || lower.includes('flour') ||
      lower.includes('cereal') || lower.includes('grain') || lower.includes('pretzel')) {
    return 'Grains & Bread'
  }
  if (lower.includes('chickpea') || lower.includes('lentil') || lower.includes('bean') ||
      lower.includes('tofu') || lower.includes('tempeh') || lower.includes('legume')) {
    return 'Legumes'
  }
  if (lower.includes('almond') || lower.includes('walnut') || lower.includes('cashew') ||
      lower.includes('peanut') || lower.includes('seed') || lower.includes('nut') ||
      lower.includes('pecan') || lower.includes('pistachio') || lower.includes('flax') ||
      lower.includes('chia') || lower.includes('pumpkin seed') || lower.includes('sunflower')) {
    return 'Nuts & Seeds'
  }
  if (lower.includes('oil') || lower.includes('vinegar') || lower.includes('sauce') ||
      lower.includes('honey') || lower.includes('maple') || lower.includes('soy') ||
      lower.includes('mustard') || lower.includes('tahini') || lower.includes('dressing')) {
    return 'Oils & Condiments'
  }
  if (lower.includes('salt') || lower.includes('pepper') || lower.includes('cumin') ||
      lower.includes('turmeric') || lower.includes('cinnamon') || lower.includes('paprika') ||
      lower.includes('oregano') || lower.includes('basil') || lower.includes('thyme') ||
      lower.includes('ginger') || lower.includes('curry') || lower.includes('spice') ||
      lower.includes('herb') || lower.includes('parsley') || lower.includes('cilantro')) {
    return 'Spices & Herbs'
  }
  if (lower.includes('chocolate') || lower.includes('cacao') || lower.includes('cocoa') ||
      lower.includes('protein powder') || lower.includes('collagen')) {
    return 'Specialty Items'
  }

  return 'Other'
}

// Parse quantity from ingredient string
function parseIngredient(ingredient: string): { name: string; quantity: string } {
  // Common patterns: "1 cup spinach", "2 tbsp olive oil", "1/2 avocado"
  const match = ingredient.match(/^([\d\s\/½¼¾⅓⅔]+\s*(?:cup|cups|tbsp|tsp|oz|lb|g|ml|piece|pieces|clove|cloves|handful|pinch|dash)?s?\s*)/i)

  if (match) {
    return {
      quantity: match[1].trim(),
      name: ingredient.slice(match[1].length).trim()
    }
  }

  return { name: ingredient, quantity: '' }
}

const categoryIcons: Record<string, string> = {
  'Protein': '🥩',
  'Dairy & Eggs': '🥛',
  'Vegetables': '🥬',
  'Fruits': '🍎',
  'Grains & Bread': '🌾',
  'Legumes': '🫘',
  'Nuts & Seeds': '🥜',
  'Oils & Condiments': '🫒',
  'Spices & Herbs': '🌿',
  'Specialty Items': '✨',
  'Other': '📦'
}

const categoryOrder = [
  'Vegetables',
  'Fruits',
  'Protein',
  'Dairy & Eggs',
  'Grains & Bread',
  'Legumes',
  'Nuts & Seeds',
  'Oils & Condiments',
  'Spices & Herbs',
  'Specialty Items',
  'Other'
]

export function GroceryList({ recipes }: GroceryListProps) {
  // Aggregate all ingredients from recipes
  const allIngredients = recipes.flatMap(recipe => recipe.ingredients)

  // Remove duplicates and categorize
  const uniqueIngredients = [...new Set(allIngredients)]

  const initialItems: GroceryItem[] = uniqueIngredients.map(ingredient => {
    const { quantity } = parseIngredient(ingredient)
    return {
      name: ingredient,
      quantity,
      category: categorizeIngredient(ingredient),
      checked: false
    }
  })

  const [items, setItems] = useState<GroceryItem[]>(initialItems)
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(categoryOrder)
  )

  const toggleItem = (index: number) => {
    setItems(prev => prev.map((item, i) =>
      i === index ? { ...item, checked: !item.checked } : item
    ))
  }

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev)
      if (next.has(category)) {
        next.delete(category)
      } else {
        next.add(category)
      }
      return next
    })
  }

  const clearChecked = () => {
    setItems(prev => prev.map(item => ({ ...item, checked: false })))
  }

  // Group items by category
  const groupedItems = items.reduce((acc, item, index) => {
    if (!acc[item.category]) {
      acc[item.category] = []
    }
    acc[item.category].push({ ...item, originalIndex: index })
    return acc
  }, {} as Record<string, (GroceryItem & { originalIndex: number })[]>)

  const checkedCount = items.filter(i => i.checked).length
  const totalCount = items.length

  return (
    <div className="grocery-list">
      <div className="grocery-header">
        <div className="grocery-title-row">
          <h2>Shopping List</h2>
          <span className="grocery-count">{totalCount} items</span>
        </div>
        <p className="grocery-subtitle">
          Everything you need for this week's {recipes.length} recipes
        </p>

        {checkedCount > 0 && (
          <div className="grocery-progress">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${(checkedCount / totalCount) * 100}%` }}
              />
            </div>
            <div className="progress-text">
              <span>{checkedCount} of {totalCount} items checked</span>
              <button className="btn-text" onClick={clearChecked}>
                Clear all
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="grocery-categories">
        {categoryOrder
          .filter(category => groupedItems[category]?.length > 0)
          .map(category => {
            const categoryItems = groupedItems[category]
            const isExpanded = expandedCategories.has(category)
            const checkedInCategory = categoryItems.filter(i => i.checked).length

            return (
              <div key={category} className="grocery-category">
                <button
                  className="category-header"
                  onClick={() => toggleCategory(category)}
                >
                  <div className="category-left">
                    <span className="category-icon">{categoryIcons[category]}</span>
                    <span className="category-name">{category}</span>
                    <span className="category-count">
                      {checkedInCategory > 0
                        ? `${checkedInCategory}/${categoryItems.length}`
                        : categoryItems.length
                      }
                    </span>
                  </div>
                  <span className={`category-chevron ${isExpanded ? 'expanded' : ''}`}>
                    ▼
                  </span>
                </button>

                {isExpanded && (
                  <ul className="category-items">
                    {categoryItems.map((item) => (
                      <li
                        key={item.originalIndex}
                        className={`grocery-item ${item.checked ? 'checked' : ''}`}
                        onClick={() => toggleItem(item.originalIndex)}
                      >
                        <span className="item-checkbox">
                          {item.checked ? '✓' : ''}
                        </span>
                        <span className="item-name">{item.name}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )
          })}
      </div>

      <div className="grocery-tips">
        <div className="tip-icon">💡</div>
        <div className="tip-content">
          <strong>Shopping Tip</strong>
          <p>Buy fresh produce at the start of the week and frozen options for backup. Many brain-healthy ingredients like nuts and seeds stay fresh longer when stored in the fridge.</p>
        </div>
      </div>
    </div>
  )
}
