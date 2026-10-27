type BotanicalProps = { className?: string };

// Ramita dibujada a mano para decorar los laterales de cada sección.
export function Sprig({ className }: BotanicalProps) {
  return (
    <svg viewBox="0 0 60 200" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true" className={className}>
      <path d="M18 194 C8 150 34 129 20 92 S12 38 39 8" />
      <path d="M20 112 Q2 102 8 88 Q25 89 20 112" />
      <path d="M23 151 Q42 137 48 151 Q38 166 23 151" />
      <path d="M28 62 Q45 48 52 62 Q44 78 28 62" />
      <path d="M35 28 Q19 25 22 12 Q38 9 35 28" />
      <circle cx="39" cy="8" r="2.5" className="fill-[#e8b9a3] stroke-[#c9876b]" />
    </svg>
  );
}

// Posiciones fijas (no aleatorias) para que el HTML del servidor y el del cliente coincidan.
const PETALS = [
  { left: 6, delay: 0, duration: 13, size: 12, leaf: false },
  { left: 18, delay: 4, duration: 16, size: 9, leaf: true },
  { left: 29, delay: 8, duration: 14, size: 11, leaf: false },
  { left: 41, delay: 2, duration: 18, size: 8, leaf: false },
  { left: 53, delay: 10, duration: 15, size: 12, leaf: true },
  { left: 64, delay: 6, duration: 13, size: 10, leaf: false },
  { left: 75, delay: 1, duration: 17, size: 9, leaf: false },
  { left: 86, delay: 9, duration: 14, size: 11, leaf: true },
  { left: 94, delay: 5, duration: 16, size: 8, leaf: false },
  { left: 35, delay: 12, duration: 15, size: 10, leaf: false },
];

export function FallingPetals() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {PETALS.map((petal, index) => (
        <span key={index} className="v3-petal absolute -top-6" style={{ left: `${petal.left}%`, animationDelay: `${petal.delay}s`, animationDuration: `${petal.duration}s` }}>
          <svg viewBox="0 0 20 20" width={petal.size * 1.6} height={petal.size * 1.6}>
            {petal.leaf
              ? <path d="M10 1 Q19 10 10 19 Q1 10 10 1 Z M10 3 V17" fill="#c4cbb2" stroke="#8a9873" strokeWidth="0.8" />
              : <path d="M10 2 C16 4 18 12 10 18 C2 12 4 4 10 2 Z" fill="#f2d4c6" stroke="#d8a48d" strokeWidth="0.8" />}
          </svg>
        </span>
      ))}
    </div>
  );
}

function Blossom({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      {[0, 72, 144, 216, 288].map((angle) => (
        <path key={angle} d="M0 0 C-6 -6 -5 -15 0 -17 C5 -15 6 -6 0 0 Z" transform={`rotate(${angle})`} fill="#f4dccf" stroke="#c9876b" strokeWidth="1" />
      ))}
      <circle r="3.2" fill="#e9c46a" stroke="#b98a3e" strokeWidth="0.8" />
    </g>
  );
}

// Ramillete de flores y hojas para las esquinas de la portada.
export function FloralCluster({ className }: BotanicalProps) {
  return (
    <svg viewBox="0 0 160 160" fill="none" aria-hidden="true" className={className}>
      <g className="v3-draw" stroke="#687653" strokeWidth="1.5" strokeLinecap="round">
        <path d="M8 152 C40 120 60 92 96 60" />
        <path d="M30 130 C34 104 52 86 70 78" />
        <path d="M54 104 C80 102 104 92 128 72" />
        <path d="M40 120 Q22 108 26 92 Q42 98 40 120" fill="#dfe4d2" />
        <path d="M66 92 Q60 72 74 62 Q80 80 66 92" fill="#dfe4d2" />
        <path d="M84 98 Q100 110 116 102 Q102 88 84 98" fill="#dfe4d2" />
        <path d="M78 70 Q96 76 104 62 Q88 56 78 70" fill="#dfe4d2" />
      </g>
      <Blossom x={100} y={56} />
      <Blossom x={132} y={70} scale={0.75} />
      <Blossom x={70} y={76} scale={0.6} />
      <circle cx="122" cy="40" r="3.5" fill="#f4dccf" stroke="#c9876b" />
      <circle cx="58" cy="60" r="2.5" fill="#f4dccf" stroke="#c9876b" />
    </svg>
  );
}

// Vestido de línea fina, con el mismo trazo que los iconos de lucide.
export function DressIcon({ className }: BotanicalProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      <path d="M9.5 2v3.5M14.5 2v3.5" />
      <path d="M9.5 5.5h5l-1 5h-3z" />
      <path d="M10.5 10.5 5 21.5h14l-5.5-11" />
      <path d="M9 15.5q3 1.5 6 0" />
    </svg>
  );
}

export function HeartDivider({ className }: BotanicalProps) {
  return (
    <div className={`flex items-center justify-center gap-3 text-[#687653] ${className ?? ""}`} aria-hidden="true">
      <svg viewBox="0 0 80 12" className="h-3 w-20" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M2 6 Q20 0 40 6 T78 6" /></svg>
      <svg viewBox="0 0 24 24" className="size-4 fill-current"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
      <svg viewBox="0 0 80 12" className="h-3 w-20" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M2 6 Q20 12 40 6 T78 6" /></svg>
    </div>
  );
}
