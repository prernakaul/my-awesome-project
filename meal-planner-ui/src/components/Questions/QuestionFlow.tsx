import { useState } from 'react'
import { UserProfile, OnboardingQuestion } from '../../types'

interface QuestionFlowProps {
  onComplete: (profile: UserProfile) => void
}

const questions: OnboardingQuestion[] = [
  {
    id: '1',
    question: 'Do you have any dietary restrictions, allergies, or preferences?',
    placeholder: 'e.g., vegetarian, gluten-free, nut allergy, halal, kosher',
    field: 'dietaryRestrictions'
  },
  {
    id: '2',
    question: 'What are your primary health or nutrition goals?',
    placeholder: 'e.g., weight loss, muscle building, managing diabetes, heart health, more energy',
    field: 'healthGoals'
  },
  {
    id: '3',
    question: 'How many people are you cooking for, and what\'s your weekly grocery budget?',
    placeholder: 'e.g., 2 people, $150/week',
    field: 'householdSize'
  },
  {
    id: '4',
    question: 'How much time do you typically have for cooking, and how would you rate your cooking skills?',
    placeholder: 'e.g., 30 minutes on weekdays, intermediate',
    field: 'cookingTime'
  },
  {
    id: '5',
    question: 'What cuisines or types of food do you enjoy most? Any foods you absolutely want to avoid?',
    placeholder: 'e.g., Love Italian and Thai, hate mushrooms',
    field: 'cuisinePreferences'
  }
]

export function QuestionFlow({ onComplete }: QuestionFlowProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [currentAnswer, setCurrentAnswer] = useState('')

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
        dietaryRestrictions: newAnswers.dietaryRestrictions || '',
        healthGoals: newAnswers.healthGoals || '',
        householdSize: newAnswers.householdSize?.split(',')[0]?.trim() || '',
        budget: newAnswers.householdSize?.split(',')[1]?.trim() || '',
        cookingTime: newAnswers.cookingTime?.split(',')[0]?.trim() || '',
        skillLevel: newAnswers.cookingTime?.split(',')[1]?.trim() || 'beginner',
        cuisinePreferences: newAnswers.cuisinePreferences?.split(',')[0]?.trim() || '',
        foodsToAvoid: newAnswers.cuisinePreferences?.split(',')[1]?.trim() || ''
      }
      onComplete(profile)
    } else {
      setCurrentStep(currentStep + 1)
      setCurrentAnswer(answers[questions[currentStep + 1]?.field] || '')
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setAnswers({
        ...answers,
        [currentQuestion.field]: currentAnswer
      })
      setCurrentStep(currentStep - 1)
      setCurrentAnswer(answers[questions[currentStep - 1].field] || '')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && currentAnswer.trim()) {
      handleNext()
    }
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
          Question {currentStep + 1} of {questions.length}
        </span>
      </div>

      <div className="question-card">
        <div className="question-number">Q{currentStep + 1}</div>
        <h2 className="question-text">{currentQuestion.question}</h2>

        <textarea
          className="question-input"
          value={currentAnswer}
          onChange={(e) => setCurrentAnswer(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={currentQuestion.placeholder}
          rows={3}
          autoFocus
        />

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
            disabled={!currentAnswer.trim()}
          >
            {isLastQuestion ? 'Start Planning' : 'Next'}
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
