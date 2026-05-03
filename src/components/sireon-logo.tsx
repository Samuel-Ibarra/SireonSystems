import { cn } from "@/lib/utils";

type SireonLogoProps = {
  className?: string;
  markClassName?: string;
  textClassName?: string;
  showTagline?: boolean;
};

export function SireonLogo({
  className,
  markClassName,
  textClassName,
  showTagline = false,
}: SireonLogoProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <svg
        className={cn("h-11 w-11 shrink-0", markClassName)}
        viewBox="0 0 332 392"
        role="img"
        aria-label="Sireon Systems"
      >
        <defs>
          <linearGradient id="sireon-mark-gradient" x1="36" x2="292" y1="48" y2="340">
            <stop offset="0%" stopColor="#00E5FF" />
            <stop offset="46%" stopColor="#19F6B1" />
            <stop offset="74%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#FF7A3D" />
          </linearGradient>
        </defs>
        <path
          d="M258 66H118C82 66 54 94 54 130s28 64 64 64h113"
          fill="none"
          stroke="url(#sireon-mark-gradient)"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="42"
        />
        <path
          d="M62 326h144c36 0 64-28 64-64s-28-64-64-64H94"
          fill="none"
          stroke="url(#sireon-mark-gradient)"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="42"
        />
        <path
          d="M260 66l-34 34M68 326l34-34"
          stroke="#FFFFFF"
          strokeLinecap="round"
          strokeWidth="18"
        />
        <path
          d="M120 197h88"
          stroke="#19F6B1"
          strokeLinecap="round"
          strokeWidth="18"
        />
      </svg>
      <div className={cn("leading-none", textClassName)}>
        <p className="font-display text-lg font-bold tracking-normal">
          Sireon Systems
        </p>
        {showTagline ? (
          <p className="mt-1 text-xs font-medium text-white/50">
            Sistemas inteligentes para negocios reales
          </p>
        ) : null}
      </div>
    </div>
  );
}
