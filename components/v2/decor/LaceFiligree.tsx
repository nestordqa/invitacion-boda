type LaceFiligreeProps = {
  className?: string;
};

// Subtle lace-like corner filigree in gold, used as a background accent.
export function LaceFiligree({ className = "" }: LaceFiligreeProps) {
  return (
    <svg viewBox="0 0 220 220" fill="none" aria-hidden="true" className={className}>
      <circle cx="18" cy="18" r="6" stroke="currentColor" strokeWidth="0.8" />
      <circle cx="18" cy="18" r="14" stroke="currentColor" strokeWidth="0.6" />
      <path d="M18 18C60 22 90 40 108 78" stroke="currentColor" strokeWidth="0.8" />
      <path d="M18 18C22 60 40 90 78 108" stroke="currentColor" strokeWidth="0.8" />
      <path d="M40 30C70 34 88 52 94 78" stroke="currentColor" strokeWidth="0.5" />
      <path d="M30 40C34 70 52 88 78 94" stroke="currentColor" strokeWidth="0.5" />
      <circle cx="108" cy="78" r="3" stroke="currentColor" strokeWidth="0.6" />
      <circle cx="78" cy="108" r="3" stroke="currentColor" strokeWidth="0.6" />
      <path d="M60 24C64 24 66 27 63 30C60 33 56 30 60 24Z" stroke="currentColor" strokeWidth="0.5" />
      <path d="M24 60C24 64 27 66 30 63C33 60 30 56 24 60Z" stroke="currentColor" strokeWidth="0.5" />
    </svg>
  );
}
