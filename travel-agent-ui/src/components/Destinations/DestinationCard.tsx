import React from 'react';
import { Destination } from '../../types';
import { DestinationImage } from '../common';
import { getMockWeather, getWeatherIcon, formatTemperature } from '../../services/weatherService';

interface DestinationCardProps {
  destination: Destination;
  preferredMonth?: string;
  onSelect: (destination: Destination) => void;
}

export const DestinationCard: React.FC<DestinationCardProps> = ({
  destination,
  preferredMonth,
  onSelect
}) => {
  const month = preferredMonth ? parseInt(preferredMonth) : new Date().getMonth() + 1;
  const weather = getMockWeather(destination.state, month);

  const handleClick = () => {
    console.log('Destination selected:', destination.city);
    onSelect(destination);
  };

  return (
    <div className="destination-card" onClick={handleClick}>
      <div className="destination-image-container">
        <DestinationImage
          city={destination.city}
          state={destination.state}
          width={400}
          height={200}
        />
        <div className="destination-weather-badge">
          <span className="weather-icon">{getWeatherIcon(weather.condition)}</span>
          <span className="weather-temp">
            {formatTemperature(weather.tempHigh)} / {formatTemperature(weather.tempLow)}
          </span>
        </div>
      </div>

      <div className="destination-content">
        <h3 className="destination-title">
          {destination.city}, {destination.state}
        </h3>
        <p className="destination-description">{destination.description}</p>

        <div className="destination-highlights">
          {destination.highlights.slice(0, 3).map((highlight, idx) => (
            <span key={idx} className="highlight-tag">{highlight}</span>
          ))}
        </div>

        <div className="destination-meta">
          <div className="destination-cost">
            <span className="cost-label">Est. daily cost:</span>
            <span className="cost-value">
              ${destination.estimatedCost.low}-${destination.estimatedCost.high}
            </span>
          </div>
          <div className="destination-tags">
            {destination.bestFor.slice(0, 2).map((tag, idx) => (
              <span key={idx} className="best-for-tag">{tag}</span>
            ))}
          </div>
        </div>

        <button
          className="destination-select-btn"
          onClick={(e) => {
            e.stopPropagation();
            handleClick();
          }}
        >
          Plan This Trip \u2192
        </button>
      </div>
    </div>
  );
};
