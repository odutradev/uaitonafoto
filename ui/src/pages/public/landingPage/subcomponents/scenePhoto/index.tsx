import { useId } from "react";

import { brandColors, landingColors, photoTones } from "@styles/theme";

import { bokehDots, sceneArts } from "./scenes";
import { Caption, Frame } from "./styles";
import type { ScenePhotoProps } from "./types";

const ScenePhoto = ({ kind, tone, caption, author, quality = "original", className }: ScenePhotoProps) => {
  const gradientId = useId();
  const [from, to] = photoTones[tone];
  const renderArt = sceneArts[kind];

  return (
    <Frame className={className} data-quality={quality}>
      <svg viewBox="0 0 120 120" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={from} />
            <stop offset="1" stopColor={to} />
          </linearGradient>
        </defs>
        <rect width="120" height="120" fill={`url(#${gradientId})`} />
        {bokehDots.map((dot) => (
          <circle
            key={`${dot.cx}-${dot.cy}`}
            cx={dot.cx}
            cy={dot.cy}
            r={dot.r}
            fill={landingColors.flashWhite}
            opacity={dot.opacity}
          />
        ))}
        {renderArt({ ink: brandColors.ink, light: landingColors.flashWhite, accent: brandColors.flashYellow })}
      </svg>
      {(caption || author) && (
        <Caption>
          {author && <strong>{author}</strong>}
          {caption && <span>{caption}</span>}
        </Caption>
      )}
    </Frame>
  );
};

export default ScenePhoto;
