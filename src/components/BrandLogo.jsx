export const DEFAULT_LOGO = '/logo.png';

export function getLogoUrl(settings) {
  const url = settings?.logoUrl?.trim();
  return url || DEFAULT_LOGO;
}

export default function BrandLogo({ settings, className = 'h-10 w-auto', alt = 'Quads Fitness logo' }) {
  return (
    <img
      src={getLogoUrl(settings)}
      alt={alt}
      className={`object-contain ${className}`}
    />
  );
}
