import React from 'react';
import { Itinerary } from '../../types';
import { DayCard } from './DayCard';
import { DestinationImage } from '../common';

interface ItineraryDisplayProps {
  itinerary: Itinerary;
}

export const ItineraryDisplay: React.FC<ItineraryDisplayProps> = ({ itinerary }) => {
  return (
    <div className="itinerary-display">
      <div className="itinerary-header">
        <DestinationImage
          city={itinerary.destination.city}
          state={itinerary.destination.state}
          width={800}
          height={300}
          className="itinerary-hero-image"
        />
        <div className="itinerary-header-content">
          <h2>
            {itinerary.destination.city}, {itinerary.destination.state}
          </h2>
          <div className="itinerary-meta">
            <span className="meta-item">
              <span className="meta-icon">📅</span>
              {itinerary.totalDays} days
            </span>
            <span className="meta-item">
              <span className="meta-icon">💰</span>
              ${itinerary.totalBudget.low}-${itinerary.totalBudget.high} total
            </span>
          </div>
        </div>
      </div>

      <div className="itinerary-days">
        {itinerary.days.map((day, idx) => (
          <DayCard key={day.day} day={day} isExpanded={idx === 0} />
        ))}
      </div>

      {itinerary.packingList && itinerary.packingList.length > 0 && (
        <div className="itinerary-section packing-list">
          <h3>🎒 Packing Suggestions</h3>
          <ul>
            {itinerary.packingList.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {itinerary.travelTips && itinerary.travelTips.length > 0 && (
        <div className="itinerary-section travel-tips">
          <h3>💡 Travel Tips</h3>
          <ul>
            {itinerary.travelTips.map((tip, idx) => (
              <li key={idx}>{tip}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
