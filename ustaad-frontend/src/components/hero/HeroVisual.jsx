import UstaadMascot from "./UstaadMascot";

const floaters = [
  {
    id: "book",
    className: "hero-float hero-float-1",
    content: (
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <rect x="12" y="10" width="40" height="44" rx="6" fill="#1CB0F6" />
        <rect x="18" y="16" width="28" height="4" rx="2" fill="#fff" opacity="0.9" />
        <rect x="18" y="26" width="22" height="3" rx="1.5" fill="#fff" opacity="0.7" />
        <rect x="18" y="34" width="26" height="3" rx="1.5" fill="#fff" opacity="0.7" />
      </svg>
    ),
  },
  {
    id: "math",
    className: "hero-float hero-float-2",
    content: (
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <circle cx="32" cy="32" r="26" fill="#FFB020" />
        <text x="32" y="40" textAnchor="middle" fill="#fff" fontSize="28" fontWeight="800">π</text>
      </svg>
    ),
  },
  {
    id: "star",
    className: "hero-float hero-float-3",
    content: (
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <path
          d="M32 8l7.6 18.4L60 28.8 42.8 42.4 48.8 62 32 51.2 15.2 62 21.2 42.4 4 28.8l20.4-2.4L32 8z"
          fill="#58CC02"
        />
      </svg>
    ),
  },
  {
    id: "bulb",
    className: "hero-float hero-float-4",
    content: (
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <circle cx="32" cy="28" r="18" fill="#FFE566" />
        <rect x="24" y="44" width="16" height="8" rx="3" fill="#C9A227" />
        <path d="M26 52h12v4H26z" fill="#A88420" />
      </svg>
    ),
  },
  {
    id: "atom",
    className: "hero-float hero-float-5",
    content: (
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <ellipse cx="32" cy="32" rx="24" ry="10" stroke="#1CB0F6" strokeWidth="3" />
        <ellipse cx="32" cy="32" rx="24" ry="10" stroke="#1CB0F6" strokeWidth="3" transform="rotate(60 32 32)" />
        <ellipse cx="32" cy="32" rx="24" ry="10" stroke="#1CB0F6" strokeWidth="3" transform="rotate(120 32 32)" />
        <circle cx="32" cy="32" r="6" fill="#1CB0F6" />
      </svg>
    ),
  },
  {
    id: "trophy",
    className: "hero-float hero-float-6",
    content: (
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <path d="M18 18h28v12c0 10-6 16-14 16s-14-6-14-16V18z" fill="#FFB020" />
        <rect x="26" y="46" width="12" height="6" fill="#C9A227" />
        <rect x="22" y="52" width="20" height="5" rx="2" fill="#A88420" />
        <path d="M18 22H10c0 8 4 12 8 14M46 22h8c0 8-4 12-8 14" stroke="#FFB020" strokeWidth="4" strokeLinecap="round" />
      </svg>
    ),
  },
];

function HeroVisual() {
  return (
    <div className="hero-visual" aria-hidden="true">
      <div className="hero-orbit-ring hero-orbit-ring-1" />
      <div className="hero-orbit-ring hero-orbit-ring-2" />

      {floaters.map((item) => (
        <div key={item.id} className={item.className}>
          {item.content}
        </div>
      ))}

      <div className="hero-mascot-wrapper">
        <div className="hero-bird-glow" />
        <UstaadMascot className="hero-mascot" />
      </div>
    </div>
  );
}

export default HeroVisual;
