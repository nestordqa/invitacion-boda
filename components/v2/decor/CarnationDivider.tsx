type CarnationDividerProps = {
  className?: string;
};

// Watercolor-style carnation used as a section divider.
export function CarnationDivider({ className = "" }: CarnationDividerProps) {
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`} aria-hidden="true">
      <span className="h-px w-14 bg-[#D4AF37]/50 sm:w-20" />
      <svg viewBox="0 0 60 60" className="size-9">
        <g fill="#6B1D2F">
          <circle cx="30" cy="30" r="6" opacity="0.9" />
          <circle cx="21" cy="24" r="7" opacity="0.35" />
          <circle cx="39" cy="24" r="7" opacity="0.35" />
          <circle cx="21" cy="37" r="7" opacity="0.35" />
          <circle cx="39" cy="37" r="7" opacity="0.35" />
          <circle cx="30" cy="16" r="6" opacity="0.28" />
          <circle cx="30" cy="44" r="6" opacity="0.28" />
        </g>
      </svg>
      <span className="h-px w-14 bg-[#D4AF37]/50 sm:w-20" />
    </div>
  );
}
