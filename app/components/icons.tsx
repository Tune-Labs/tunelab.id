// Small inline SVG icons ported from the original blog markup.

type IconProps = { size?: number; className?: string };

export function AppleIcon({ size = 14, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="white"
      className={className}
      aria-hidden="true"
    >
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  );
}

export function UserIcon({ size = 14, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  );
}

export function CalendarIcon({ size = 14, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

export function ClockIcon({ size = 14, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

export function ChevronLeftIcon({ size = 16, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

export function ImagePlaceholderIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      className={className}
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="m21 15-5-5L5 21" />
    </svg>
  );
}

export function EmptyDocIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      className={className}
      aria-hidden="true"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
}

export function LogoMark({ size = 28, className }: IconProps) {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="36" height="36" rx="6.87238" fill="#E9E8E8" />
      <g clip-path="url(#clip0_3868_18049)">
        <rect
          x="4.83984"
          y="4.83984"
          width="26.3163"
          height="26.3163"
          rx="6.87238"
          fill="#E9E8E8"
        />
        <path
          d="M17.998 31.1561C25.265 31.1561 31.1561 25.265 31.1561 17.998C31.1561 10.7309 25.265 4.83984 17.998 4.83984C10.7309 4.83984 4.83984 10.7309 4.83984 17.998C4.83984 25.265 10.7309 31.1561 17.998 31.1561Z"
          fill="#2D2D2D"
        />
        <path
          d="M17.9984 23.8717C21.2432 23.8717 23.8737 21.2413 23.8737 17.9964C23.8737 14.7516 21.2432 12.1211 17.9984 12.1211C14.7535 12.1211 12.123 14.7516 12.123 17.9964C12.123 21.2413 14.7535 23.8717 17.9984 23.8717Z"
          fill="white"
        />
        <path
          d="M25.5435 25.3605C26.4229 25.3605 27.1359 24.6475 27.1359 23.7681C27.1359 22.8887 26.4229 22.1758 25.5435 22.1758C24.6641 22.1758 23.9512 22.8887 23.9512 23.7681C23.9512 24.6475 24.6641 25.3605 25.5435 25.3605Z"
          fill="#F15B22"
        />
      </g>
      <defs>
        <clipPath id="clip0_3868_18049">
          <rect
            x="4.83984"
            y="4.83984"
            width="26.3163"
            height="26.3163"
            rx="6.87238"
            fill="white"
          />
        </clipPath>
      </defs>
    </svg>
  );
}
