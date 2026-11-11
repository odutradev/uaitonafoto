import type { SkeletonProps as MuiSkeletonProps } from "@mui/material";

export interface SkeletonProps extends MuiSkeletonProps {
  borderRadius?: number | string;
  color?: "primary" | "neutral";
}
