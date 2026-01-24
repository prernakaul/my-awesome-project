import React from 'react';
import { Destination } from '../../types';
import { DestinationCard } from './DestinationCard';

interface DestinationGridProps {
  destinations: Destination[];
  onSelect: (destination: Destination) => void;
  preferredMonth?: string;
}

export const DestinationGrid: React.FC<DestinationGridProps> = ({
  destinations,
  onSelect,
  preferredMonth
}) => {
  if (destinations.length === 0) {
    return null;
  }

  return (
    <div className="destination-grid">
      {destinations.map(destination => (
        <DestinationCard
          key={destination.id}
          destination={destination}
          preferredMonth={preferredMonth}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
};
