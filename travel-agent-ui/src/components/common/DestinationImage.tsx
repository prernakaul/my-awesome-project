import React, { useState } from 'react';

interface DestinationImageProps {
  city: string;
  state?: string;
  alt?: string;
  className?: string;
  width?: number;
  height?: number;
}

// Curated travel images for popular destinations
const cityImages: Record<string, string> = {
  'san diego': 'https://images.unsplash.com/photo-1538964173425-93c8f373dbe0?w=400&h=300&fit=crop',
  'austin': 'https://images.unsplash.com/photo-1531218150217-54595bc2b934?w=400&h=300&fit=crop',
  'sedona': 'https://images.unsplash.com/photo-1502375751885-4f494926ce5c?w=400&h=300&fit=crop',
  'new york': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=300&fit=crop',
  'los angeles': 'https://images.unsplash.com/photo-1534190760961-74e8c1c5c3da?w=400&h=300&fit=crop',
  'miami': 'https://images.unsplash.com/photo-1506966953602-c20cc11f75e3?w=400&h=300&fit=crop',
  'seattle': 'https://images.unsplash.com/photo-1438401171849-74ac270044ee?w=400&h=300&fit=crop',
  'denver': 'https://images.unsplash.com/photo-1546156929-a4c0ac411f47?w=400&h=300&fit=crop',
  'chicago': 'https://images.unsplash.com/photo-1494522855154-9297ac14b55f?w=400&h=300&fit=crop',
  'san francisco': 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=300&fit=crop',
  'new orleans': 'https://images.unsplash.com/photo-1568402102990-bc541580b59f?w=400&h=300&fit=crop',
  'nashville': 'https://images.unsplash.com/photo-1545419913-775e3e0e8f84?w=400&h=300&fit=crop',
  'savannah': 'https://images.unsplash.com/photo-1588416936097-41850ab3d86d?w=400&h=300&fit=crop',
  'boston': 'https://images.unsplash.com/photo-1501979376754-1d87814c7e55?w=400&h=300&fit=crop',
  'portland': 'https://images.unsplash.com/photo-1507245351456-d770d66af46c?w=400&h=300&fit=crop',
  'las vegas': 'https://images.unsplash.com/photo-1581351721010-8cf859cb14a4?w=400&h=300&fit=crop',
  'honolulu': 'https://images.unsplash.com/photo-1507876466758-bc54f384809c?w=400&h=300&fit=crop',
  'phoenix': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
  'washington': 'https://images.unsplash.com/photo-1501466044931-62695aada8e9?w=400&h=300&fit=crop',
  'orlando': 'https://images.unsplash.com/photo-1575089776834-8be34c8a652e?w=400&h=300&fit=crop',
};

const getImageUrl = (city: string): string => {
  const lowerCity = city.toLowerCase();
  if (cityImages[lowerCity]) {
    return cityImages[lowerCity];
  }
  // Fallback: Use Lorem Picsum with a seed based on city name
  const seed = city.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return `https://picsum.photos/seed/${seed}/400/300`;
};

export const DestinationImage: React.FC<DestinationImageProps> = ({
  city,
  state,
  alt,
  className = '',
  width = 400,
  height = 300
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const imageUrl = getImageUrl(city);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  if (hasError) {
    return (
      <div
        className={`destination-image-placeholder ${className}`}
        style={{ width, height }}
      >
        <span className="placeholder-icon">🌎</span>
        <span className="placeholder-text">{city}</span>
      </div>
    );
  }

  return (
    <div className={`destination-image-wrapper ${className}`}>
      {isLoading && (
        <div className="image-loading-skeleton" style={{ width, height }} />
      )}
      <img
        src={imageUrl}
        alt={alt || `${city}${state ? `, ${state}` : ''}`}
        className={`destination-image ${isLoading ? 'loading' : ''}`}
        onLoad={handleLoad}
        onError={handleError}
        width={width}
        height={height}
      />
    </div>
  );
};
