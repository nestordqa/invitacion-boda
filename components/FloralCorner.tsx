type FloralCornerProps = {
  className?: string;
};

export function FloralCorner({ className = "" }: FloralCornerProps) {
  return (
    <svg
      viewBox="0 0 180 180"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path d="M6 173C33 137 48 107 73 74C98 41 126 23 174 7" />
      <path d="M35 133C13 109 15 78 38 72C64 67 70 100 35 133Z" />
      <path d="M64 94C42 69 53 44 75 45C94 51 92 77 64 94Z" />
      <path d="M91 60C80 35 97 21 116 29C131 42 117 61 91 60Z" />
      <path d="M31 139C61 119 84 101 107 76" />
      <path d="M40 128C35 107 45 88 59 82C68 103 59 120 40 128Z" />
      <path d="M68 90C70 69 83 55 99 51C103 72 91 88 68 90Z" />
      <path d="M96 60C105 43 122 36 136 40C130 57 117 65 96 60Z" />
      <path d="M121 38C134 24 151 22 164 29C151 42 138 46 121 38Z" />
    </svg>
  );
}