interface LogoProps {
  size?: "sm" | "md" | "lg";
  showIsotype?: boolean;
}

const sizes = {
  sm: { isotype: 28, wordmark: "text-lg" },
  md: { isotype: 36, wordmark: "text-2xl" },
  lg: { isotype: 48, wordmark: "text-3xl" },
};

export default function Logo({ size = "md", showIsotype = true }: LogoProps) {
  const s = sizes[size];

  return (
    <div className="flex items-center gap-2.5">
      {showIsotype && (
        <svg
          width={s.isotype}
          height={s.isotype}
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Chat bubble body */}
          <rect x="2" y="4" width="40" height="32" rx="10" fill="#2D2D44" stroke="#FF6B6B" strokeWidth="2.5" />
          {/* Chat bubble tail */}
          <path d="M10 36 L6 44 L18 38" fill="#2D2D44" stroke="#FF6B6B" strokeWidth="2.5" strokeLinejoin="round" />
          {/* </> text */}
          <text
            x="24"
            y="27"
            textAnchor="middle"
            fontFamily="JetBrains Mono, monospace"
            fontWeight="700"
            fontSize="14"
            fill="#FFE66D"
          >
            &lt;/&gt;
          </text>
          {/* Teal notification dot */}
          <circle cx="38" cy="8" r="6" fill="#4ECDC4" />
        </svg>
      )}
      <span
        className={`${s.wordmark} font-bold leading-none`}
        style={{ fontFamily: "Space Grotesk, sans-serif" }}
      >
        <span style={{ color: "#FFFFFF" }}>Audit</span>
        <span style={{ color: "#FFE66D" }}>AI</span>
      </span>
    </div>
  );
}
