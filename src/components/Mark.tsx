export function Mark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 80 80"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <g transform="rotate(-8 40 38)">
        <rect x="22" y="24" width="24" height="20" rx="6" fill="#f3ede4" />
        <rect x="34" y="20" width="24" height="20" rx="6" fill="#5d7d90" />
        <path
          fill="#3f4542"
          d="M34 24h12a6 6 0 0 1 6 6v8H40a6 6 0 0 1-6-6z"
        />
        <rect
          x="16"
          y="14"
          width="48"
          height="36"
          rx="8"
          stroke="#8eafc4"
          strokeWidth="5"
        />
        <path fill="#8eafc4" d="M31 54h18l3.5 9H27.5L31 54z" />
      </g>
    </svg>
  );
}
