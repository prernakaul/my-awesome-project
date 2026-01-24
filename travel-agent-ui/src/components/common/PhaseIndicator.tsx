import React from 'react';
import { AppPhase } from '../../types';

interface PhaseIndicatorProps {
  currentPhase: AppPhase;
}

const PHASES: { key: AppPhase; label: string; icon: string }[] = [
  { key: 'onboarding', label: 'Preferences', icon: '📝' },
  { key: 'destination_selection', label: 'Destinations', icon: '🌎' },
  { key: 'itinerary', label: 'Itinerary', icon: '📅' },
  { key: 'chat', label: 'Chat', icon: '💬' }
];

export const PhaseIndicator: React.FC<PhaseIndicatorProps> = ({ currentPhase }) => {
  const currentIndex = PHASES.findIndex(p => p.key === currentPhase);

  return (
    <div className="phase-indicator">
      {PHASES.map((phase, index) => {
        const isActive = phase.key === currentPhase;
        const isCompleted = index < currentIndex;

        return (
          <React.Fragment key={phase.key}>
            <div
              className={`phase-step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
            >
              <div className="phase-icon">
                {isCompleted ? '✓' : phase.icon}
              </div>
              <span className="phase-label">{phase.label}</span>
            </div>
            {index < PHASES.length - 1 && (
              <div className={`phase-connector ${isCompleted ? 'completed' : ''}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
