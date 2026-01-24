import React, { useState } from 'react';

interface DestinationImageProps {
  city: string;
  state?: string;
  alt?: string;
  className?: string;
  width?: number;
  height?: number;
}

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

  const searchQuery = encodeURIComponent(
    `${city}${state ? ` ${state}` : ''} travel landmark`
  );
  const imageUrl = `https://source.unsplash.com/${width}x${height}/?${searchQuery}`;

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
        <span className="placeholder-icon">\ud83c\udf0e</span>
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
