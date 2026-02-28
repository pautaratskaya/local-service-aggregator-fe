interface BelarusFlagIconProps {
  className?: string;
}

function BelarusFlagIcon({ className }: BelarusFlagIconProps) {
  return (
    <svg
      width="24"
      height="18"
      viewBox="0 0 24 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="M4 0C1.79 0 0 1.79 0 4V12H24V4C24 1.79 22.21 0 20 0H4Z" fill="#CE1720" />
      <path d="M0 12H24V14C24 16.21 22.21 18 20 18H4C1.79 18 0 16.21 0 14V12Z" fill="#00A651" />
    </svg>
  );
}

export default BelarusFlagIcon;
