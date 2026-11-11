import type { BoxProps } from "@mui/material";

export interface LogoCustomDimensions {
  symbolSize?: number | string | Record<string, number | string>;
  fontSize?: number | string | Record<string, number | string>;
  gap?: number | string | Record<string, number | string>;
}

export type LogoSize =
  "small" | "medium" | "large" | number | string | Record<string, number | string> | LogoCustomDimensions;
export type LogoVariant = "light" | "dark" | "auto";
export type LogoDisplay = "both" | "symbol" | "text" | "wordmark";

export type BrandAnimation =
  "enter" | "flash" | "shutter" | "reveal" | "eye" | "develop" | "live" | "breathe" | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export type LoadingAnimation =
  "orbit" | "blink" | "dots" | "draw" | "morph" | "l1" | "l2" | "l3" | "l4" | "l9" | "L1" | "L2" | "L3" | "L4" | "L9";

export type LogoAnimation = BrandAnimation | LoadingAnimation;

export interface LogoDimensions {
  symbolSize: number | string | Record<string, number | string>;
  fontSize: number | string | Record<string, number | string>;
  gap: number | string | Record<string, number | string>;
}

export interface LogoProps extends Omit<BoxProps, "display"> {
  size?: LogoSize;
  variant?: LogoVariant;
  display?: LogoDisplay;
  symbolOnly?: boolean;
  textOnly?: boolean;
  wordmarkOnly?: boolean;
  animation?: LogoAnimation;
  loading?: boolean | LoadingAnimation;
  play?: boolean;
  interactive?: boolean;
}
