import { useId } from 'react';

const SRC = '/mariposa.png';

export default function MaeButterflySvg({ className = '' }) {
  const uid = `mae${useId().replace(/[^a-zA-Z0-9]/g, '')}`;

  return (
    <div className={`mae-bf ${className}`.trim()} aria-hidden="true">
      <div className="mae-bf-3d">
        <div className="mae-bf-wing mae-bf-wing-left">
          <svg viewBox="0 0 1024 819" preserveAspectRatio="xMidYMid meet">
            <defs>
              <mask id={`${uid}-maskLeft`} maskUnits="userSpaceOnUse">
                <rect x="0" y="0" width="516" height="819" fill="#fff" />
                <ellipse cx="511" cy="272" rx="46" ry="43" fill="#000" />
              </mask>
            </defs>
            <image href={SRC} width="1024" height="819" mask={`url(#${uid}-maskLeft)`} />
          </svg>
        </div>
        <div className="mae-bf-wing mae-bf-wing-right">
          <svg viewBox="0 0 1024 819" preserveAspectRatio="xMidYMid meet">
            <defs>
              <mask id={`${uid}-maskRight`} maskUnits="userSpaceOnUse">
                <rect x="508" y="0" width="516" height="819" fill="#fff" />
                <ellipse cx="511" cy="272" rx="46" ry="43" fill="#000" />
              </mask>
            </defs>
            <image href={SRC} width="1024" height="819" mask={`url(#${uid}-maskRight)`} />
          </svg>
        </div>
      </div>
      <div className="mae-bf-head">
        <svg viewBox="0 0 1024 819" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id={`${uid}-bodyVol`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#2e1065" />
              <stop offset="18%" stopColor="#6d28d9" />
              <stop offset="38%" stopColor="#e9d5ff" />
              <stop offset="52%" stopColor="#c084fc" />
              <stop offset="78%" stopColor="#7c3aed" />
              <stop offset="100%" stopColor="#3b0764" />
            </linearGradient>
            <linearGradient id={`${uid}-bodyShade`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f3e8ff" stopOpacity="0.28" />
              <stop offset="45%" stopColor="#7c3aed" stopOpacity="0" />
              <stop offset="100%" stopColor="#1e0a3c" stopOpacity="0.45" />
            </linearGradient>
            <filter id={`${uid}-bodySoft`} x="-20%" y="-10%" width="140%" height="120%">
              <feGaussianBlur stdDeviation="0.6" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <mask id={`${uid}-maskHead`} maskUnits="userSpaceOnUse">
              <rect width="1024" height="819" fill="#000" />
              <ellipse cx="511" cy="272" rx="43" ry="41" fill="#fff" />
            </mask>
          </defs>
          <g filter={`url(#${uid}-bodySoft)`}>
            <path
              d="M511,318
                 C538,328 546,355 542,385
                 C538,430 532,475 524,520
                 C520,548 516,572 511,590
                 C506,572 502,548 498,520
                 C490,475 484,430 480,385
                 C476,355 484,328 511,318 Z"
              fill={`url(#${uid}-bodyVol)`}
            />
            <path
              d="M511,318
                 C538,328 546,355 542,385
                 C538,430 532,475 524,520
                 C520,548 516,572 511,590
                 C506,572 502,548 498,520
                 C490,475 484,430 480,385
                 C476,355 484,328 511,318 Z"
              fill={`url(#${uid}-bodyShade)`}
            />
            <path
              d="M498,338 C500,360 501,400 503,455"
              fill="none"
              stroke="#f3e8ff"
              strokeOpacity="0.35"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </g>
          <image href={SRC} width="1024" height="819" mask={`url(#${uid}-maskHead)`} />
        </svg>
      </div>
    </div>
  );
}
