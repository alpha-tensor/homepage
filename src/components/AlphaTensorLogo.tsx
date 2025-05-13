export default function AlphaTensorLogo({
  className = "",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 220 40"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="AlphaTensor Logo"
    >
      <text
        x="0"
        y="22"
        fontFamily="Inter, sans-serif"
        fontWeight="bold"
        fontSize="23"
        fill="#F97316"
      >
        α
      </text>
      <text
        x="20"
        y="28"
        fontFamily="Inter, sans-serif"
        fontWeight="bold"
        fontSize="24"
        fill="#F97316"
      >
        Alpha
      </text>
      <text
        x="85"
        y="28"
        fontFamily="Inter, sans-serif"
        fontWeight="normal"
        fontSize="24"
        fill="currentColor"
      >
        Tensor
      </text>
    </svg>
  );
}
