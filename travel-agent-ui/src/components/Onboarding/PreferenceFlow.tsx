import React, { useState } from 'react';
import { UserPreferences, OnboardingQuestion } from '../../types';

const ONBOARDING_QUESTIONS: OnboardingQuestion[] = [
  {
    id: 'name',
    question: 'What\'s your name?',
    type: 'text',
    placeholder: 'Enter your name',
    preferenceKey: 'name',
    required: true
  },
  {
    id: 'duration',
    question: 'How long is your ideal trip?',
    type: 'select',
    options: ['Weekend (2-3 days)', '1 week', '2 weeks', 'Extended (3+ weeks)'],
    preferenceKey: 'tripDuration',
    required: true
  },
  {
    id: 'timeline',
    question: 'When are you planning to travel?',
    type: 'select',
    options: ['Within 1 month', '1-3 months', '3-6 months', 'Flexible / Just exploring'],
    preferenceKey: 'travelTimeline',
    required: true
  },
  {
    id: 'month',
    question: 'Which month would you prefer to travel?',
    type: 'select',
    options: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    preferenceKey: 'preferredMonth',
    required: true
  },
  {
    id: 'travelers',
    question: 'Who are you traveling with?',
    type: 'select',
    options: ['Solo', 'Partner/Couple', 'Family with kids', 'Friends group', 'Large group (6+)'],
    preferenceKey: 'travelerRelationships',
    required: true
  },
  {
    id: 'budget',
    question: 'What\'s your daily budget per person?',
    type: 'select',
    options: ['Budget ($50-100)', 'Moderate ($100-200)', 'Comfortable ($200-350)', 'Luxury ($350+)'],
    preferenceKey: 'budgetMax',
    required: true
  },
  {
    id: 'style',
    question: 'What\'s your travel style?',
    type: 'multiselect',
    options: ['Adventure & Outdoors', 'Relaxation & Wellness', 'Cultural & Historical', 'Food & Culinary', 'Beach & Water', 'City Exploration', 'Nature & Wildlife'],
    preferenceKey: 'travelStyle',
    required: true
  }
];

interface PreferenceFlowProps {
  onComplete: (preferences: Partial<UserPreferences>) => void;
}

export const PreferenceFlow: React.FC<PreferenceFlowProps> = ({
  onComplete
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [selectedMulti, setSelectedMulti] = useState<string[]>([]);
  const [textInput, setTextInput] = useState('');

  const currentQuestion = ONBOARDING_QUESTIONS[currentStep];
  const isLastStep = currentStep === ONBOARDING_QUESTIONS.length - 1;

  const handleSelect = (value: string) => {
    if (currentQuestion.type === 'multiselect') {
      setSelectedMulti(prev =>
        prev.includes(value)
          ? prev.filter(v => v !== value)
          : [...prev, value]
      );
    } else {
      setAnswers(prev => ({ ...prev, [currentQuestion.preferenceKey]: value }));
      // Auto-advance for single select
      setTimeout(() => handleNext(), 300);
    }
  };

  const handleTextSubmit = () => {
    if (textInput.trim()) {
      setAnswers(prev => ({ ...prev, [currentQuestion.preferenceKey]: textInput.trim() }));
      setTextInput('');
      handleNext();
    }
  };

  const handleNext = () => {
    if (currentQuestion.type === 'multiselect' && selectedMulti.length > 0) {
      setAnswers(prev => ({
        ...prev,
        [currentQuestion.preferenceKey]: selectedMulti.join(', ')
      }));
      setSelectedMulti([]);
    }

    if (isLastStep) {
      // Convert answers to preferences format
      const preferences: Partial<UserPreferences> = {};

      Object.entries(answers).forEach(([key, value]) => {
        if (key === 'budgetMax') {
          // Parse budget range
          const match = String(value).match(/\$(\d+)-?(\d+)?/);
          if (match) {
            preferences.budgetMin = match[1];
            preferences.budgetMax = match[2] || '500';
          }
        } else if (key === 'preferredMonth') {
          // Convert month name to number - find the month question (index 3 now with name added)
          const monthQuestion = ONBOARDING_QUESTIONS.find(q => q.id === 'month');
          const monthIndex = monthQuestion?.options?.indexOf(String(value)) ?? -1;
          preferences.preferredMonth = String(monthIndex + 1);
        } else {
          (preferences as any)[key] = value;
        }
      });

      // Add the current multiselect if we're on the last question
      if (currentQuestion.type === 'multiselect' && selectedMulti.length > 0) {
        (preferences as any)[currentQuestion.preferenceKey] = selectedMulti.join(', ');
      }

      preferences.budgetCurrency = 'USD';
      onComplete(preferences);
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const currentValue = answers[currentQuestion.preferenceKey];
  const isMultiSelectValid = currentQuestion.type === 'multiselect' && selectedMulti.length > 0;
  const isTextValid = currentQuestion.type === 'text' && textInput.trim().length > 0;
  const canProceed = currentValue || isMultiSelectValid || isTextValid;

  return (
    <div className="preference-flow">
      <div className="flow-header">
        <div className="flow-progress">
          <div
            className="flow-progress-bar"
            style={{ width: `${((currentStep + 1) / ONBOARDING_QUESTIONS.length) * 100}%` }}
          />
        </div>
        <span className="flow-step-indicator">
          {currentStep + 1} of {ONBOARDING_QUESTIONS.length}
        </span>
      </div>

      <div className="flow-content">
        <h2 className="flow-question">{currentQuestion.question}</h2>

        {currentQuestion.type === 'text' ? (
          <div className="flow-text-input">
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder={currentQuestion.placeholder}
              onKeyDown={(e) => e.key === 'Enter' && handleTextSubmit()}
              autoFocus
            />
          </div>
        ) : (
          <div className="flow-options">
            {currentQuestion.options?.map(option => {
              const isSelected = currentQuestion.type === 'multiselect'
                ? selectedMulti.includes(option)
                : currentValue === option;

              return (
                <button
                  key={option}
                  className={`flow-option ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleSelect(option)}
                >
                  {currentQuestion.type === 'multiselect' && (
                    <span className="option-checkbox">
                      {isSelected ? '\u2713' : ''}
                    </span>
                  )}
                  {option}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="flow-actions">
        {currentStep > 0 && (
          <button className="flow-back-btn" onClick={handleBack}>
            Back
          </button>
        )}
        {(currentQuestion.type === 'multiselect' || currentQuestion.type === 'text' || isLastStep) && (
          <button
            className="flow-next-btn"
            onClick={currentQuestion.type === 'text' ? handleTextSubmit : handleNext}
            disabled={!canProceed}
          >
            {isLastStep ? 'Start Planning' : 'Next'}
          </button>
        )}
      </div>
    </div>
  );
};
