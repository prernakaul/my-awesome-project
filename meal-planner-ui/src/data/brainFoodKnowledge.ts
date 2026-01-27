// Brain Food Knowledge Base
// Based on Dr. Lisa Mosconi's "Brain Food" book

export const BRAIN_FOOD_PRINCIPLES = `
## Core Brain-Health Eating Principles (Dr. Lisa Mosconi)

### Foods to Prioritize:
- **Leafy Greens**: Spinach, kale, Swiss chard, dandelion greens, watercress
- **Berries**: Blueberries, blackberries, goji berries, acai (antioxidants)
- **Fatty Fish**: Wild Alaskan salmon, sardines, mackerel (omega-3 DHA)
- **Nuts & Seeds**: Walnuts, almonds, Brazil nuts, chia seeds, flaxseeds, hemp hearts
- **Whole Grains**: Quinoa, steel-cut oats, buckwheat, amaranth
- **Legumes**: Lentils, chickpeas, black beans
- **Sweet Potatoes**: Especially Okinawan purple sweet potatoes
- **Extra Virgin Olive Oil**: For cooking and dressings
- **Dark Chocolate**: 75%+ cacao, in moderation
- **Green Tea**: Rich in L-theanine for focus

### Foods to Limit:
- Processed foods and refined sugars
- Red meat (limit to once per week)
- Trans fats and fried foods
- Excessive alcohol (red wine in moderation is OK)
- Artificial sweeteners

### Key Nutrients for Brain Health:
- **Omega-3 DHA**: Found in fatty fish, crucial for brain cell membranes
- **Antioxidants**: Protect brain cells from oxidative stress
- **B Vitamins**: Support energy metabolism in the brain
- **Vitamin E**: Found in nuts and seeds
- **Turmeric/Curcumin**: Anti-inflammatory, helps convert plant omega-3s to DHA

### Daily Habits:
- Start day with warm water and lemon
- Drink 8 glasses of water daily
- Include probiotic foods (yogurt, kefir)
- Have a handful of nuts as snacks
- End day with herbal tea
`;

export const RECIPES = {
  breakfast: [
    {
      id: 'swiss-overnight-oats',
      name: 'Swiss Overnight Oats',
      time: '10 min + overnight',
      servings: 4,
      difficulty: 'Easy',
      brainBenefit: 'Fiber for sustained energy, berries for antioxidants',
      ingredients: [
        '2 cups organic steel-cut oats',
        '1¾ cups organic whole milk',
        '¾ cup organic apple juice',
        '3 tbsp fresh lemon juice',
        '1 apple, grated',
        '2 tbsp raw honey',
        '¼ cup raisins',
        '1 tbsp chia seeds',
        'Dash of cinnamon',
        '1½ cups organic plain yogurt (topping)',
        '1 cup blueberries (topping)',
        '½ cup hazelnuts, chopped (topping)'
      ],
      instructions: [
        'Mix oats, milk, apple juice, lemon juice, grated apple, honey, raisins, chia seeds, and cinnamon in a large bowl.',
        'Cover and refrigerate overnight (or at least 4 hours).',
        'In the morning, stir well and divide into bowls.',
        'Top each serving with yogurt, blueberries, and hazelnuts.'
      ]
    },
    {
      id: 'sicilian-scrambled-eggs',
      name: 'Sicilian Scrambled Eggs',
      time: '15 min',
      servings: 2,
      difficulty: 'Easy',
      brainBenefit: 'Choline from eggs supports memory and cognition',
      ingredients: [
        '4 organic cage-free eggs',
        '2 tbsp extra virgin olive oil',
        '1 clove garlic, minced',
        '1 cup cherry tomatoes, halved',
        'Handful of fresh basil',
        'Sea salt and black pepper',
        '2 tbsp grated Pecorino Romano'
      ],
      instructions: [
        'Heat olive oil in a pan over medium heat.',
        'Add garlic and cook for 30 seconds until fragrant.',
        'Add tomatoes and cook for 2-3 minutes until softened.',
        'Beat eggs with salt and pepper, pour into pan.',
        'Gently scramble until just set.',
        'Top with fresh basil and cheese.'
      ]
    }
  ],
  lunch: [
    {
      id: 'lentil-dal-spinach',
      name: 'Lentil Dal with Spinach',
      time: '25 min',
      servings: 4,
      difficulty: 'Easy',
      brainBenefit: 'Turmeric boosts DHA in the brain, lentils provide B vitamins',
      ingredients: [
        '2 tsp extra virgin olive oil or coconut oil',
        '1 yellow onion, finely chopped',
        '1 tsp ground cumin',
        '¼ tsp ground cardamom',
        '4 cloves garlic, finely chopped',
        '2 tbsp finely chopped ginger',
        '2 cups red lentils, rinsed and drained',
        '4 cups vegetable broth',
        '1½ cups chopped fresh tomatoes with juice',
        '2 cups chopped spinach or Swiss chard',
        '½ cup chopped fresh cilantro',
        '1 tsp ground turmeric',
        '½ cup full-fat coconut milk',
        'Sea salt to taste'
      ],
      instructions: [
        'Heat oil in a large pot over medium-high heat. Add onions and cook until softened, about 5 minutes.',
        'Add cumin, cardamom, garlic, and ginger. Cook, stirring often, until fragrant, about 2 minutes.',
        'Add lentils, broth, tomatoes, spinach, cilantro, turmeric, coconut milk, and salt. Bring to a boil.',
        'Reduce heat to medium-low, cover, and simmer, stirring often, until lentils are soft, about 15 minutes.',
        'Ladle into bowls and serve.'
      ]
    },
    {
      id: 'rainbow-buddha-bowl',
      name: 'Rainbow Buddha Bowl',
      time: '30 min',
      servings: 2,
      difficulty: 'Easy',
      brainBenefit: 'Colorful vegetables provide diverse antioxidants',
      ingredients: [
        '1 can chickpeas, drained',
        '1 tsp cumin',
        '½ tsp turmeric',
        '2 sweet potatoes, cubed',
        '2 cups broccolini',
        '1 cup mushrooms, sliced',
        '2 cups cooked quinoa',
        'For dressing: ¼ cup tahini, 2 tbsp maple syrup, juice of ½ lemon, 1 garlic clove, 1-inch ginger, 2-4 tbsp hot water'
      ],
      instructions: [
        'Preheat oven to 400°F. Toss sweet potatoes with olive oil, salt, and pepper. Roast for 25 minutes.',
        'Toss chickpeas with cumin, turmeric, and olive oil. Add to baking sheet for last 15 minutes.',
        'Steam or sauté broccolini and mushrooms.',
        'Make dressing by blending all dressing ingredients until smooth.',
        'Assemble bowls: quinoa base, topped with sweet potatoes, chickpeas, broccolini, mushrooms.',
        'Drizzle with tahini dressing.'
      ]
    },
    {
      id: 'chickpea-tikka-masala',
      name: 'Chickpea Tikka Masala',
      time: '25 min',
      servings: 4,
      difficulty: 'Easy',
      brainBenefit: 'Turmeric and ginger are anti-inflammatory powerhouses',
      ingredients: [
        '2 tbsp coconut oil or ghee',
        '1 onion, diced',
        '4 garlic cloves, minced',
        'Sea salt',
        '1 tbsp garam masala',
        '1 tsp turmeric',
        '2-inch piece ginger, grated',
        '3 cups cooked chickpeas',
        '1 can diced tomatoes',
        '1 cup coconut milk',
        '1 tbsp tomato paste',
        'Fresh cilantro for garnish'
      ],
      instructions: [
        'Heat oil in a large pan over medium heat. Add onion and cook until translucent, about 5 minutes.',
        'Add garlic, salt, garam masala, turmeric, and ginger. Cook for 2 minutes until fragrant.',
        'Add chickpeas and diced tomatoes. Simmer for 15 minutes.',
        'Stir in coconut milk and tomato paste. Simmer for another 5 minutes.',
        'Garnish with fresh cilantro and serve over rice or with naan.'
      ]
    }
  ],
  dinner: [
    {
      id: 'grilled-salmon-ginger',
      name: 'Grilled Salmon in Ginger Garlic Marinade',
      time: '20 min + marinating',
      servings: 2,
      difficulty: 'Easy',
      brainBenefit: 'Wild salmon is the #1 source of brain-essential DHA omega-3',
      ingredients: [
        '4 tbsp avocado or olive oil',
        '1-inch piece ginger, grated',
        '3 garlic cloves, minced',
        'Juice of ½ lemon',
        '1 tbsp maple syrup',
        '2 tbsp tamari or coconut aminos',
        '6 oz wild Alaskan salmon fillet',
        'Sea salt and cayenne pepper to taste'
      ],
      instructions: [
        'Whisk together oil, ginger, garlic, lemon juice, maple syrup, and tamari in a bowl.',
        'Place salmon in a zip-lock bag, pour marinade over, and refrigerate for 3-4 hours.',
        'Preheat grill to medium-high. Remove salmon from marinade.',
        'Grill for about 4 minutes per side until fish flakes easily.',
        'Season with salt and cayenne. Serve with steamed vegetables.'
      ]
    },
    {
      id: 'pretzel-tilapia',
      name: 'Pretzel-Encrusted Tilapia',
      time: '20 min',
      servings: 2,
      difficulty: 'Easy',
      brainBenefit: 'Fish provides complete protein and omega-3s with less saturated fat than meat',
      ingredients: [
        '½ cup whole-wheat flour',
        'Sea salt (only if using unsalted pretzels)',
        '1 organic cage-free egg',
        '1 cup pretzels (whole wheat or sprouted grain)',
        '8 oz tilapia fillet',
        '2 tbsp grass-fed butter or extra virgin olive oil',
        'Juice of ½ lemon'
      ],
      instructions: [
        'Place flour on a plate and season with salt.',
        'Beat egg in a shallow bowl.',
        'Crush pretzels finely using a food processor.',
        'Dip tilapia in flour, then egg, then pretzel crumbs to coat.',
        'Heat butter in a large pan over medium-high heat.',
        'Cook fish for about 3 minutes per side until golden and cooked through.',
        'Sprinkle with lemon juice and serve with a green salad.'
      ]
    },
    {
      id: 'sweet-potato-spinach-salad',
      name: 'Grilled Sweet Potatoes with Spinach Salad',
      time: '25 min',
      servings: 4,
      difficulty: 'Easy',
      brainBenefit: 'Sweet potatoes provide complex carbs for steady brain energy',
      ingredients: [
        '4 sweet potatoes, halved lengthwise',
        '3 tbsp coconut oil',
        '1 cup full-fat plain yogurt',
        '2 tbsp tahini',
        '2 tbsp maple syrup',
        '4 cups baby spinach',
        '2 tbsp extra virgin olive oil',
        'Juice of ½ lemon',
        'Salt and pepper to taste'
      ],
      instructions: [
        'Preheat grill to medium-high.',
        'Blanch sweet potatoes in boiling water for 2-3 minutes. Drain.',
        'Brush with coconut oil and grill for 5 minutes per side until tender.',
        'Whisk together yogurt, tahini, and maple syrup for dressing.',
        'Toss spinach with olive oil and lemon juice.',
        'Serve sweet potatoes on spinach, drizzled with yogurt-tahini sauce.'
      ]
    }
  ],
  snacks: [
    {
      id: 'brain-trail-mix',
      name: 'Brain-Healthy Trail Mix',
      time: '5 min',
      servings: 12,
      difficulty: 'Easy',
      brainBenefit: 'Walnuts look like brains for a reason - they\'re packed with omega-3s!',
      ingredients: [
        '½ cup raisins',
        '½ cup date crumbles',
        '¼ cup sunflower seeds',
        '¼ cup pumpkin seeds',
        '¼ cup Brazil nuts',
        '¼ cup goji berries',
        '¼ cup roasted hazelnuts',
        '½ cup halved walnuts',
        '½ cup unsweetened coconut flakes',
        '¼ cup cacao nibs',
        '¼ cup pistachios',
        '½ cup sliced almonds',
        '¼ cup hemp hearts'
      ],
      instructions: [
        'Combine all ingredients in a large bowl.',
        'Store in an airtight container for up to 2 weeks.',
        'Enjoy a small handful (about ¼ cup) as a brain-boosting snack.'
      ]
    },
    {
      id: 'peanut-butter-bites',
      name: 'Peanut Butter Power Bites',
      time: '15 min + chill',
      servings: 12,
      difficulty: 'Easy',
      brainBenefit: 'Oats provide sustained energy, dates are natural brain fuel',
      ingredients: [
        '1 cup rolled oats',
        '½ tsp ground cinnamon',
        '7-8 Medjool dates, pitted',
        'Dash of maple syrup',
        '3 tbsp smooth organic peanut butter',
        '⅓ cup chopped peanuts for rolling'
      ],
      instructions: [
        'In a food processor, blend oats and cinnamon until flour-like.',
        'Add dates and maple syrup. Blend until a paste forms.',
        'Add peanut butter and blend until well combined. Add warm water if too dry.',
        'Roll into 12 balls using about 1 tablespoon of mixture each.',
        'Roll each ball in chopped peanuts.',
        'Refrigerate for 1 hour before serving.'
      ]
    }
  ],
  smoothies: [
    {
      id: 'soothing-cacao-smoothie',
      name: 'Soothing Cacao Smoothie',
      time: '5 min',
      servings: 2,
      difficulty: 'Easy',
      brainBenefit: 'Cacao is rich in flavonoids that improve blood flow to the brain',
      ingredients: [
        '1 tbsp raw unsweetened cacao powder',
        '1 tbsp almond meal',
        '1 tbsp chia seeds',
        '1 tsp goji berries',
        '1 tbsp organic aloe vera juice',
        '⅓ cup chocolate or vanilla protein powder',
        '1 cup coconut water',
        '1 cup full-fat coconut milk'
      ],
      instructions: [
        'Combine all ingredients in a high-speed blender.',
        'Blend for 1 minute on high until smooth.',
        'Pour into glasses and enjoy immediately.'
      ]
    },
    {
      id: 'nourishing-green-smoothie',
      name: 'Nourishing Green Smoothie',
      time: '5 min',
      servings: 2,
      difficulty: 'Easy',
      brainBenefit: 'Spirulina and maca support cognitive function and energy',
      ingredients: [
        '1 cup coconut water',
        '½ cup goat\'s milk or almond milk',
        '1 handful raw almonds',
        '1 tbsp chia seeds',
        '1 tsp flaxseeds',
        '1 tsp acai berry powder',
        '1 tsp goji berries',
        '1 tbsp raw cacao powder',
        '1 tsp maca powder',
        '1 tbsp spirulina powder'
      ],
      instructions: [
        'Add all ingredients to a high-speed blender.',
        'Blend for 1 minute until completely smooth.',
        'Serve immediately for maximum nutrition.'
      ]
    },
    {
      id: 'spicy-berry-smoothie',
      name: 'Spicy Berry Smoothie',
      time: '5 min',
      servings: 2,
      difficulty: 'Easy',
      brainBenefit: 'Berries are antioxidant superstars, turmeric fights inflammation',
      ingredients: [
        '1 tbsp acai berry powder or ½ cup frozen acai',
        '1 handful frozen blueberries',
        '1 tsp goji berries',
        '1-inch piece fresh ginger',
        '½ organic apple',
        '1 tbsp spirulina powder',
        'Pinch of cayenne pepper',
        '½ tsp ground turmeric',
        '1 tbsp maple syrup',
        '2 cups filtered water'
      ],
      instructions: [
        'Add all ingredients to a high-speed blender.',
        'Blend for 1 minute on high until smooth.',
        'Taste and adjust sweetness if needed.',
        'Serve immediately.'
      ]
    }
  ]
};

export const SAMPLE_WEEKLY_PLAN = {
  name: 'Brain-Boosting Beginner Week',
  description: 'A simple week with just 5 recipes, designed for newbie cooks. Cook once, eat multiple times!',
  recipes: [
    'swiss-overnight-oats',
    'lentil-dal-spinach',
    'grilled-salmon-ginger',
    'rainbow-buddha-bowl',
    'brain-trail-mix'
  ],
  schedule: {
    monday: {
      breakfast: { recipe: 'swiss-overnight-oats', note: 'Prep Sunday night' },
      lunch: { recipe: 'lentil-dal-spinach', note: 'Make a big batch' },
      dinner: { recipe: 'grilled-salmon-ginger', note: 'Fresh salmon night!' },
      snack: { recipe: 'brain-trail-mix', note: 'Keep at your desk' }
    },
    tuesday: {
      breakfast: { recipe: 'swiss-overnight-oats', note: 'Leftovers' },
      lunch: { recipe: 'lentil-dal-spinach', note: 'Leftovers taste even better' },
      dinner: { recipe: 'rainbow-buddha-bowl', note: 'Colorful and filling' },
      snack: { recipe: 'brain-trail-mix', note: '' }
    },
    wednesday: {
      breakfast: { recipe: 'swiss-overnight-oats', note: 'Last of the batch' },
      lunch: { recipe: 'rainbow-buddha-bowl', note: 'Leftovers' },
      dinner: { recipe: 'lentil-dal-spinach', note: 'Freezes well too' },
      snack: { recipe: 'brain-trail-mix', note: '' }
    },
    thursday: {
      breakfast: { recipe: 'swiss-overnight-oats', note: 'Make fresh batch tonight' },
      lunch: { recipe: 'lentil-dal-spinach', note: 'Last of the dal' },
      dinner: { recipe: 'grilled-salmon-ginger', note: 'Salmon night #2' },
      snack: { recipe: 'brain-trail-mix', note: '' }
    },
    friday: {
      breakfast: { recipe: 'swiss-overnight-oats', note: 'Fresh batch' },
      lunch: { recipe: 'rainbow-buddha-bowl', note: 'Make fresh' },
      dinner: { recipe: 'rainbow-buddha-bowl', note: 'Buddha bowl dinner!' },
      snack: { recipe: 'brain-trail-mix', note: '' }
    }
  },
  groceryCategories: {
    produce: [
      'Baby spinach (2 bags)',
      'Sweet potatoes (4)',
      'Blueberries (2 pints)',
      'Apples (4)',
      'Lemons (4)',
      'Ginger root',
      'Garlic (1 head)',
      'Yellow onion (2)',
      'Fresh cilantro',
      'Broccolini (2 bunches)',
      'Mushrooms (8 oz)'
    ],
    protein: [
      'Wild Alaskan salmon fillets (12 oz)',
      'Chickpeas (2 cans)'
    ],
    dairy: [
      'Greek yogurt (32 oz)',
      'Organic whole milk (1 quart)'
    ],
    grains: [
      'Steel-cut oats (1 lb)',
      'Quinoa (1 lb)',
      'Red lentils (1 lb)'
    ],
    pantry: [
      'Extra virgin olive oil',
      'Coconut oil',
      'Tahini',
      'Maple syrup',
      'Tamari or soy sauce',
      'Vegetable broth (2 cartons)',
      'Diced tomatoes (2 cans)',
      'Coconut milk (1 can)',
      'Raw honey',
      'Turmeric powder',
      'Cumin powder',
      'Garam masala'
    ],
    nutsSeeds: [
      'Walnuts',
      'Almonds',
      'Chia seeds',
      'Hazelnuts',
      'Goji berries',
      'Pumpkin seeds',
      'Hemp hearts'
    ]
  }
};

export const BEGINNER_TIPS = [
  'Start with batch cooking - make big portions of dal and oats on Sunday',
  'Keep brain-healthy trail mix in small containers for grab-and-go snacks',
  'Frozen berries work just as well as fresh for smoothies and toppings',
  'Salmon can be swapped for any fatty fish like mackerel or sardines',
  'Turmeric absorbs better with black pepper - add a pinch when cooking',
  'Drink a glass of warm lemon water first thing every morning',
  'Aim for at least 8 glasses of water throughout the day'
];
