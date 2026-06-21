function UstaadMascot({ className = "" }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 320 320"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="mascotGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#58CC02" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#58CC02" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="bodyGrad" x1="160" y1="80" x2="160" y2="260" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6FE018" />
          <stop stopColor="#58CC02" />
          <stop stopColor="#46A302" />
        </linearGradient>
      </defs>

      <circle cx="160" cy="165" r="130" fill="url(#mascotGlow)" />

      {/* wings */}
      <ellipse cx="72" cy="175" rx="38" ry="52" fill="#58CC02" className="mascot-wing mascot-wing-left" />
      <ellipse cx="248" cy="175" rx="38" ry="52" fill="#58CC02" className="mascot-wing mascot-wing-right" />

      {/* body */}
      <ellipse cx="160" cy="190" rx="72" ry="82" fill="url(#bodyGrad)" />

      {/* belly */}
      <ellipse cx="160" cy="205" rx="48" ry="52" fill="#7AE026" opacity="0.55" />

      {/* eyes */}
      <circle cx="128" cy="155" r="28" fill="#fff" />
      <circle cx="192" cy="155" r="28" fill="#fff" />
      <circle cx="132" cy="158" r="14" fill="#4B4B4B" />
      <circle cx="196" cy="158" r="14" fill="#4B4B4B" />
      <circle cx="136" cy="152" r="5" fill="#fff" />
      <circle cx="200" cy="152" r="5" fill="#fff" />

      {/* beak */}
      <path d="M160 178 L148 196 L172 196 Z" fill="#FFB020" />
      <path d="M160 196c-8 0-14 4-14 9 0 6 14 6 14 6s14 0 14-6c0-5-6-9-14-9z" fill="#FF9500" />

      {/* graduation cap */}
      <rect x="108" y="88" width="104" height="14" rx="4" fill="#1CB0F6" />
      <polygon points="160,58 108,92 212,92" fill="#1CB0F6" />
      <circle cx="212" cy="92" r="6" fill="#FFB020" />
      <path d="M212 92v28" stroke="#FFB020" strokeWidth="3" strokeLinecap="round" />

      {/* tuft */}
      <path d="M140 108c0-18 8-28 20-32 12 4 20 14 20 32" fill="#46A302" />
      <path d="M160 76c-6-10-2-18 6-22 8 4 12 12 6 22" fill="#58CC02" />

      {/* feet */}
      <ellipse cx="132" cy="262" rx="16" ry="8" fill="#FFB020" />
      <ellipse cx="188" cy="262" rx="16" ry="8" fill="#FFB020" />
    </svg>
  );
}

export default UstaadMascot;
