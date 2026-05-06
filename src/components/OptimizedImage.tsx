import React from 'react';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
}

/**
 * A performance-optimized image component for the PoliDash ecosystem.
 * Implements lazy loading, async decoding, and layout stability best practices.
 */
const OptimizedImage: React.FC<OptimizedImageProps> = ({ src, alt, className, ...props }) => {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      decoding="async"
      // Default to square aspect ratio for headshots unless overridden
      width={400}
      height={400}
      {...props}
    />
  );
};

export default OptimizedImage;
