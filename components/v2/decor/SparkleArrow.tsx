type SparkleArrowProps = {
  className?: string;
};

// Curved gold flourish whose tip points to a twinkling sparkle burst.
export function SparkleArrow({ className = "" }: SparkleArrowProps) {
  return (
    <svg viewBox="0 0 110 110" fill="none" aria-hidden="true" className={className}>
      <defs>
        <linearGradient id="sparkle-arrow-gold" x1="0" y1="0" x2="110" y2="110" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#8a6a22" />
          <stop offset="45%" stopColor="#f7e7a6" />
          <stop offset="100%" stopColor="#d4af37" />
        </linearGradient>
        <radialGradient id="sparkle-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff6d8" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#fff6d8" stopOpacity="0" />
        </radialGradient>
      </defs>
      <path
        d="M16 14C54 4 86 26 80 54C76 70 60 78 46 70"
        stroke="url(#sparkle-arrow-gold)"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <circle cx="44" cy="74" r="22" fill="url(#sparkle-glow)" className="sparkle-pulse" />
      <path
        d="M44 57L48.6 69L61 74L48.6 79L44 91L39.4 79L27 74L39.4 69Z"
        fill="url(#sparkle-arrow-gold)"
        className="sparkle-pulse"
      />
    </svg>
  );
}


