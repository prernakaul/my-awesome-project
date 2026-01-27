import { useState } from 'react'
import { UserProfile, OnboardingQuestion } from '../../types'

interface QuestionFlowProps {
  onComplete: (profile: UserProfile) => void
}

const questions: OnboardingQuestion[] = [
  {
    id: '1',
    question: "What's your name?",
    type: 'text',
    placeholder: 'Enter your name',
    field: 'name'
  },
  {
    id: '2',
    question: 'How would you describe your cooking experience?',
    type: 'select',
    options: [
      { value: 'beginner', label: 'Beginner', description: "I'm new to cooking or stick to very simple recipes" },
      { value: 'intermediate', label: 'Intermediate', description: 'I can follow recipes and try new techniques' },
      { value: 'advanced', label: 'Advanced', description: 'I cook regularly and enjoy experimenting' }
    ],
    field: 'skillLevel'
  },
  {
    id: '3',
    question: 'How many servings do you typically need per meal?',
    type: 'select',
    options: [
      { value: '1', label: 'Just me (1 serving)', description: 'Cooking for one' },
      { value: '2', label: '2 servings', description: 'Perfect for a couple' },
      { value: '4', label: '4 servings', description: 'Family-sized portions' },
      { value: '6+', label: '6+ servings', description: 'Meal prep or larger family' }
    ],
    field: 'servings'
  },
  {
    id: '4',
    question: 'What are your brain-health goals?',
    type: 'multiselect',
    options: [
      { value: 'focus', label: 'Better Focus', description: 'Improve concentration and mental clarity' },
      { value: 'memory', label: 'Memory Support', description: 'Enhance memory and recall' },
      { value: 'energy', label: 'Mental Energy', description: 'Reduce brain fog and fatigue' },
      { value: 'mood', label: 'Mood Balance', description: 'Support emotional wellbeing' },
      { value: 'longevity', label: 'Brain Longevity', description: 'Protect against cognitive decline' }
    ],
    field: 'goals'
  },
  {
    id: '5',
    question: 'Do you have any dietary restrictions?',
    type: 'text',
    placeholder: 'e.g., vegetarian, gluten-free, nut allergy, or "none"',
    field: 'dietaryRestrictions'
  },
  {
    id: '6',
    question: 'How much time do you have for cooking on weekdays?',
    type: 'select',
    options: [
      { value: 'minimal', label: '15 minutes or less', description: 'Very quick meals only' },
      { value: 'limited', label: '15-30 minutes', description: 'Quick but can do some prep' },
      { value: 'moderate', label: '30-45 minutes', description: 'Can make most simple recipes' },
      { value: 'flexible', label: '45+ minutes', description: 'Comfortable with longer recipes' }
    ],
    field: 'cookingTime'
  }
]

export function QuestionFlow({ onComplete }: QuestionFlowProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({})
  const [currentAnswer, setCurrentAnswer] = useState<string | string[]>('')

  const currentQuestion = questions[currentStep]
  const isLastQuestion = currentStep === questions.length - 1
  const progress = ((currentStep + 1) / questions.length) * 100

  const handleNext = () => {
    const newAnswers = {
      ...answers,
      [currentQuestion.field]: currentAnswer
    }
    setAnswers(newAnswers)

    if (isLastQuestion) {
      const profile: UserProfile = {
        name: (newAnswers.name as string) || 'Friend',
        skillLevel: (newAnswers.skillLevel as 'beginner' | 'intermediate' | 'advanced') || 'beginner',
        servings: (newAnswers.servings as string) || '2',
        goals: (newAnswers.goals as string[]) || ['focus'],
        dietaryRestrictions: (newAnswers.dietaryRestrictions as string) || 'none',
        cookingTime: (newAnswers.cookingTime as string) || 'limited'
      }
      onComplete(profile)
    } else {
      setCurrentStep(currentStep + 1)
      const nextAnswer = answers[questions[currentStep + 1]?.field]
      setCurrentAnswer(nextAnswer || (questions[currentStep + 1].type === 'multiselect' ? [] : ''))
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setAnswers({
        ...answers,
        [currentQuestion.field]: currentAnswer
      })
      setCurrentStep(currentStep - 1)
      const prevAnswer = answers[questions[currentStep - 1].field]
      setCurrentAnswer(prevAnswer || (questions[currentStep - 1].type === 'multiselect' ? [] : ''))
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && canProceed()) {
      handleNext()
    }
  }

  const handleSelectOption = (value: string) => {
    if (currentQuestion.type === 'multiselect') {
      const currentArray = Array.isArray(currentAnswer) ? currentAnswer : []
      if (currentArray.includes(value)) {
        setCurrentAnswer(currentArray.filter(v => v !== value))
      } else {
        setCurrentAnswer([...currentArray, value])
      }
    } else {
      setCurrentAnswer(value)
    }
  }

  const canProceed = () => {
    if (currentQuestion.type === 'multiselect') {
      return Array.isArray(currentAnswer) && currentAnswer.length > 0
    }
    return typeof currentAnswer === 'string' && currentAnswer.trim() !== ''
  }

  return (
    <div className="question-flow">
      <div className="question-progress">
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="progress-text">
          Step {currentStep + 1} of {questions.length}
        </span>
      </div>

      <div className="question-card">
        <div className="question-number">Q{currentStep + 1}</div>
        <h2 className="question-text">{currentQuestion.question}</h2>

        {currentQuestion.type === 'text' ? (
          <input
            type="text"
            className="question-input-text"
            value={currentAnswer as string}
            onChange={(e) => setCurrentAnswer(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={currentQuestion.placeholder}
            autoFocus
          />
        ) : (
          <div className="options-grid">
            {currentQuestion.options?.map((option) => {
              const isSelected = currentQuestion.type === 'multiselect'
                ? (currentAnswer as string[]).includes(option.value)
                : currentAnswer === option.value

              return (
                <button
                  key={option.value}
                  className={`option-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleSelectOption(option.value)}
                >
                  <span className="option-label">{option.label}</span>
                  {option.description && (
                    <span className="option-description">{option.description}</span>
                  )}
                  {isSelected && (
                    <span className="option-check">✓</span>
                  )}
                </button>
              )
            })}
          </div>
        )}

        {currentQuestion.type === 'multiselect' && (
          <p className="multiselect-hint">Select all that apply</p>
        )}

        <div className="question-actions">
          {currentStep > 0 && (
            <button
              className="btn btn-secondary"
              onClick={handleBack}
            >
              Back
            </button>
          )}
          <button
            className="btn btn-primary"
            onClick={handleNext}
            disabled={!canProceed()}
          >
            {isLastQuestion ? 'Start Planning' : 'Continue'}
          </button>
        </div>
      </div>

      <div className="question-indicators">
        {questions.map((_, index) => (
          <div
            key={index}
            className={`indicator ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
          />
        ))}
      </div>
    </div>
  )
}
