import React, { useState } from 'react';
import { DayPlan } from '../../types';
import { ActivityCard } from './ActivityCard';
import { getWeatherIcon, formatTemperature } from '../../services/weatherService';

interface DayCardProps {
  day: DayPlan;
  isExpanded?: boolean;
}

export const DayCard: React.FC<DayCardProps> = ({ day, isExpanded = false }) => {
  const [expanded, setExpanded] = useState(isExpanded);

  return (
    <div className={`day-card ${expanded ? 'expanded' : ''}`}>
      <div className="day-header" onClick={() => setExpanded(!expanded)}>
        <div className="day-title-section">
          <span className="day-number">Day {day.day}</span>
          <h3 className="day-title">{day.title}</h3>
        </div>

        <div className="day-meta">
          {day.weather && (
            <div className="day-weather">
              <span className="weather-icon">{getWeatherIcon(day.weather.condition)}</span>
              <span className="weather-temp">
                {formatTemperature(day.weather.tempHigh)}
              </span>
            </div>
          )}
          <span className="expand-icon">{expanded ? '▲' : '▼'}</span>
        </div>
      </div>

      {expanded && (
        <div className="day-content">
          <div className="activities-list">
            {day.activities.map((activity, idx) => (
              <ActivityCard key={idx} activity={activity} />
            ))}
          </div>

          {day.meals && (
            <div className="day-meals">
              <h4>Dining Suggestions</h4>
              <div className="meals-grid">
                {day.meals.breakfast && (
                  <div className="meal-item">
                    <span className="meal-icon">☕</span>
                    <div>
                      <span className="meal-label">Breakfast</span>
                      <span className="meal-name">{day.meals.breakfast}</span>
                    </div>
                  </div>
                )}
                {day.meals.lunch && (
                  <div className="meal-item">
                    <span className="meal-icon">🍽️</span>
                    <div>
                      <span className="meal-label">Lunch</span>
                      <span className="meal-name">{day.meals.lunch}</span>
                    </div>
                  </div>
                )}
                {day.meals.dinner && (
                  <div className="meal-item">
                    <span className="meal-icon">🍷</span>
                    <div>
                      <span className="meal-label">Dinner</span>
                      <span className="meal-name">{day.meals.dinner}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {day.notes && (
            <div className="day-notes">
              <span className="notes-icon">📝</span>
              {day.notes}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
