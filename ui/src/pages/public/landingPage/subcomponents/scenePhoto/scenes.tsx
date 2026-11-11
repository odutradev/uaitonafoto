import type { ReactElement } from "react";

import type { SceneArtProps, SceneKind } from "./types";

const renderToast = ({ ink, light }: SceneArtProps) => (
  <g>
    <g fill={ink} opacity="0.9">
      <g transform="rotate(-14 46 72)">
        <path d="M36 38h20l-3 22a7 7 0 0 1-14 0z" />
        <rect x="44.5" y="66" width="3" height="22" />
        <rect x="38" y="87" width="16" height="3" rx="1.5" />
      </g>
      <g transform="rotate(14 74 72)">
        <path d="M64 38h20l-3 22a7 7 0 0 1-14 0z" />
        <rect x="72.5" y="66" width="3" height="22" />
        <rect x="66" y="87" width="16" height="3" rx="1.5" />
      </g>
    </g>
    <path d="M60 16l2.5 7.5 7.5 2.5-7.5 2.5-2.5 7.5-2.5-7.5-7.5-2.5 7.5-2.5z" fill={light} />
    <circle cx="44" cy="30" r="1.6" fill={light} />
    <circle cx="78" cy="26" r="1.2" fill={light} />
  </g>
);

const renderCake = ({ ink, light, accent }: SceneArtProps) => (
  <g>
    <g fill={ink} opacity="0.9">
      <rect x="34" y="70" width="52" height="22" rx="3" />
      <rect x="42" y="52" width="36" height="18" rx="3" />
      <rect x="28" y="92" width="64" height="4" rx="2" />
      <rect x="51" y="40" width="3" height="12" rx="1" />
      <rect x="58.5" y="38" width="3" height="14" rx="1" />
      <rect x="66" y="40" width="3" height="12" rx="1" />
    </g>
    <g fill={accent}>
      <ellipse cx="52.5" cy="36" rx="2.2" ry="3.6" />
      <ellipse cx="60" cy="34" rx="2.2" ry="3.6" />
      <ellipse cx="67.5" cy="36" rx="2.2" ry="3.6" />
    </g>
    <path
      d="M42 62q6 4 12 0t12 0 12 0M34 80q6 4 13 0t13 0 13 0 13 0"
      stroke={light}
      strokeWidth="2"
      fill="none"
      opacity="0.6"
    />
  </g>
);

const renderBouquet = ({ ink, light, accent }: SceneArtProps) => (
  <g>
    <path d="M44 66l16 40 16-40z" fill={ink} opacity="0.9" />
    <g fill={light} opacity="0.95">
      <circle cx="48" cy="56" r="10" />
      <circle cx="70" cy="54" r="11" />
      <circle cx="60" cy="40" r="10" />
      <circle cx="42" cy="40" r="7" />
      <circle cx="78" cy="38" r="7" />
    </g>
    <g fill={accent}>
      <circle cx="48" cy="56" r="3.5" />
      <circle cx="70" cy="54" r="4" />
      <circle cx="60" cy="40" r="3.5" />
    </g>
    <path
      d="M38 64q-8-6-6-16M82 62q8-6 6-16"
      stroke={ink}
      strokeWidth="3"
      fill="none"
      strokeLinecap="round"
      opacity="0.8"
    />
  </g>
);

const dancers = [40, 60, 80];

const renderDance = ({ ink, light }: SceneArtProps) => (
  <g>
    <line x1="60" y1="0" x2="60" y2="14" stroke={light} strokeWidth="1" opacity="0.7" />
    <circle cx="60" cy="26" r="12" fill={light} opacity="0.9" />
    <path
      d="M48 26h24M60 14v24M51 18q9 8 18 0M51 34q9-8 18 0"
      stroke={ink}
      strokeWidth="0.8"
      fill="none"
      opacity="0.35"
    />
    <g fill={ink} opacity="0.9">
      {dancers.map((x, index) => (
        <g key={x} transform={`translate(0 ${index === 1 ? -4 : 2})`}>
          <circle cx={x} cy="64" r="6" />
          <path d={`M${x - 9} 108q0-30 9-34q9 4 9 34z`} />
          <path
            d={index === 1 ? `M${x - 5} 76l-8-16M${x + 5} 76l8-16` : `M${x - 5} 76l-10-10M${x + 5} 76l9 6`}
            stroke={ink}
            strokeWidth="4"
            strokeLinecap="round"
          />
        </g>
      ))}
    </g>
  </g>
);

const renderSelfie = ({ ink, light }: SceneArtProps) => (
  <g>
    <g fill={ink} opacity="0.9">
      <circle cx="50" cy="60" r="13" />
      <circle cx="74" cy="64" r="12" />
      <path d="M26 120q2-34 24-40q14 4 18 16q6-12 18-12q20 6 22 36z" />
    </g>
    <path d="M86 84l14-34" stroke={ink} strokeWidth="6" strokeLinecap="round" opacity="0.9" />
    <rect x="94" y="30" width="14" height="22" rx="3" fill={ink} transform="rotate(20 101 41)" />
    <path d="M44 58q3 3 6 0M68 62q3 3 6 0" stroke={light} strokeWidth="1.6" fill="none" strokeLinecap="round" />
  </g>
);

const renderCap = ({ ink, light, accent }: SceneArtProps) => (
  <g>
    <g fill={ink} opacity="0.92">
      <path d="M60 46l32 14-32 14-32-14z" />
      <path d="M44 67v12q16 8 32 0V67l-16 7z" />
    </g>
    <path d="M60 60l26 6v14" stroke={accent} strokeWidth="2" fill="none" />
    <circle cx="86" cy="82" r="3" fill={accent} />
    <g transform="rotate(-24 32 26)" opacity="0.7">
      <path d="M32 18l14 6-14 6-14-6z" fill={ink} />
    </g>
    <g transform="rotate(18 94 24)" opacity="0.55">
      <path d="M94 18l10 4.5-10 4.5-10-4.5z" fill={ink} />
    </g>
    <circle cx="20" cy="70" r="1.6" fill={light} />
    <circle cx="102" cy="58" r="1.6" fill={light} />
  </g>
);

const renderRings = ({ ink, light, accent }: SceneArtProps) => (
  <g>
    <ellipse cx="60" cy="96" rx="34" ry="6" fill={ink} opacity="0.25" />
    <circle cx="50" cy="66" r="17" stroke={light} strokeWidth="5" fill="none" />
    <circle cx="70" cy="66" r="17" stroke={accent} strokeWidth="5" fill="none" />
    <path d="M70 43l5-6 5 6-5 5z" fill={light} />
    <path d="M30 28l1.6 4.8 4.8 1.6-4.8 1.6-1.6 4.8-1.6-4.8-4.8-1.6 4.8-1.6z" fill={light} />
  </g>
);

const sparks = Array.from({ length: 12 }, (_, index) => (index * Math.PI) / 6);

const renderSparkler = ({ ink, light, accent }: SceneArtProps) => (
  <g>
    <g stroke={light} strokeLinecap="round">
      {sparks.map((angle, index) => (
        <line
          key={angle}
          x1={60 + Math.cos(angle) * 6}
          y1={44 + Math.sin(angle) * 6}
          x2={60 + Math.cos(angle) * (index % 2 ? 18 : 26)}
          y2={44 + Math.sin(angle) * (index % 2 ? 18 : 26)}
          strokeWidth={index % 2 ? 1.4 : 2.2}
        />
      ))}
    </g>
    <circle cx="60" cy="44" r="5" fill={accent} />
    <path d="M60 48l-18 52" stroke={ink} strokeWidth="2.4" />
    <path d="M28 120q4-24 16-26q10 2 12 26z" fill={ink} opacity="0.9" />
  </g>
);

export const sceneArts: Record<SceneKind, (props: SceneArtProps) => ReactElement> = {
  toast: renderToast,
  cake: renderCake,
  bouquet: renderBouquet,
  dance: renderDance,
  selfie: renderSelfie,
  cap: renderCap,
  rings: renderRings,
  sparkler: renderSparkler
};

export const bokehDots = [
  { cx: 18, cy: 22, r: 10, opacity: 0.22 },
  { cx: 100, cy: 16, r: 7, opacity: 0.3 },
  { cx: 96, cy: 94, r: 13, opacity: 0.18 },
  { cx: 14, cy: 98, r: 8, opacity: 0.24 },
  { cx: 74, cy: 8, r: 4, opacity: 0.35 }
];
