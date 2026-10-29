import { useState } from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  onClick?: () => void;
}

export function LazyImage({ src, alt, className = '', onClick }: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div className={`lazy-image-wrapper ${isLoaded ? 'loaded' : ''} ${hasError ? 'error' : ''}`} onClick={onClick}>
      {!hasError ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          className={className}
        />
      ) : (
        <div className="image-fallback">Obra indisponível</div>
      )}
    </div>
  );
}