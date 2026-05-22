import Link from "next/link";

interface LogoProps {
  variant?: "default" | "white" | "dark";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  sm: { width: 120, height: 36 },
  md: { width: 160, height: 48 },
  lg: { width: 220, height: 66 },
};

export function Logo({ variant = "default", size = "md", className = "" }: LogoProps) {
  const { width, height } = sizes[size];

  const primaryColor = variant === "white" ? "#FFFFFF" : "#FF006E";
  const accentColor = variant === "white" ? "rgba(255,255,255,0.8)" : "#FFB627";
  const textColor = variant === "white" ? "#FFFFFF" : "#1A1A2E";
  const subtitleColor = variant === "white" ? "rgba(255,255,255,0.65)" : "#FF006E";

  return (
    <Link href="/" className={`inline-flex items-center ${className}`} aria-label="Giselle Silva - Joias & Semijoias - Ir para a página inicial">
      <svg
        width={width}
        height={height}
        viewBox="0 0 160 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-hidden="true"
      >
        {/* Diamante geométrico */}
        <g transform="translate(0, 8)">
          {/* Topo do diamante */}
          <polygon
            points="14,0 20,8 8,8"
            fill={primaryColor}
            opacity="0.9"
          />
          {/* Base esquerda */}
          <polygon
            points="8,8 14,16 14,8"
            fill={accentColor}
            opacity="0.85"
          />
          {/* Base direita */}
          <polygon
            points="14,8 20,8 14,16"
            fill={primaryColor}
            opacity="0.7"
          />
          {/* Reflexo */}
          <polygon
            points="14,3 17,8 14,8"
            fill="white"
            opacity="0.4"
          />
        </g>

        {/* Nome "Giselle" — grotesque, bold */}
        <text
          x="26"
          y="22"
          fontFamily="'Bricolage Grotesque', system-ui, sans-serif"
          fontSize="16"
          fontWeight="700"
          letterSpacing="-0.3"
          fill={textColor}
        >
          Giselle
        </text>

        {/* Nome "Silva" — serifado, italic, menor */}
        <text
          x="26"
          y="36"
          fontFamily="'Playfair Display', Georgia, serif"
          fontSize="13"
          fontStyle="italic"
          fontWeight="500"
          letterSpacing="0.5"
          fill={primaryColor}
        >
          Silva
        </text>

        {/* Separador linha */}
        <line x1="26" y1="39" x2="100" y2="39" stroke={accentColor} strokeWidth="0.8" opacity="0.6" />

        {/* Tagline */}
        <text
          x="26"
          y="46"
          fontFamily="'Inter', system-ui, sans-serif"
          fontSize="7"
          fontWeight="400"
          letterSpacing="1.5"
          fill={subtitleColor}
          textAnchor="start"
        >
          JOIAS &amp; SEMIJOIAS
        </text>
      </svg>
    </Link>
  );
}
