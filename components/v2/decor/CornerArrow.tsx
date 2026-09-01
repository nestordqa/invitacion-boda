type CornerArrowProps = {
  className?: string;
};

// Small curved gold arrow pointing toward the top-right corner button.
export function CornerArrow({ className = "" }: CornerArrowProps) {
  return (
    <svg viewBox="0 0 60 46" fill="none" aria-hidden="true" className={className}>
      <defs>
        <linearGradient id="corner-arrow-gold" x1="0" y1="46" x2="60" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#8a6a22" />
          <stop offset="55%" stopColor="#d4af37" />
          <stop offset="100%" stopColor="#f7e7a6" />
        </linearGradient>
      </defs>
      <path
        d="M4 40C14 20 28 10 50 6"
        stroke="url(#corner-arrow-gold)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M38 4.5L50 6L47 17"
        stroke="url(#corner-arrow-gold)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
