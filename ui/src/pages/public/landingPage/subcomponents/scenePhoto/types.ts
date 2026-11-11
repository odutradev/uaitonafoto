import type { photoTones } from "@styles/theme";

export type SceneKind = "toast" | "cake" | "bouquet" | "dance" | "selfie" | "cap" | "rings" | "sparkler";

export type SceneTone = keyof typeof photoTones;

export type SceneQuality = "original" | "compressed";

export interface ScenePhotoProps {
  kind: SceneKind;
  tone: SceneTone;
  caption?: string;
  author?: string;
  quality?: SceneQuality;
  className?: string;
}

export interface SceneArtProps {
  ink: string;
  light: string;
  accent: string;
}
