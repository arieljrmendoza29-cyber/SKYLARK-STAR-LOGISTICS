import { useState } from 'react';
import { Truck } from 'lucide-react';

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: 'eager' | 'lazy';
}

export function SafeImage({
  src,
  alt,
  className = 'w-full h-full object-cover',
  loading = 'lazy',
}: SafeImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        role="img"
        aria-label={alt}
        className="w-full h-full bg-gradient-to-br from-[#171717] via-[#262626] to-[#171717] flex flex-col items-center justify-center p-6 text-center text-[#FFF5EB]"
      >
        <Truck className="w-10 h-10 text-[#FF6500] mb-3" strokeWidth={1.6} aria-hidden="true" />
        <span className="text-sm font-medium text-[#FFF5EB]/85 max-w-xs">{alt}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
}
