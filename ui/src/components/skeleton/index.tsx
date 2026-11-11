import { Skeleton as MuiSkeleton } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import { getSkeletonStyles } from "./styles";
import type { SkeletonProps } from "./types";

export const Skeleton = ({
  variant = "rounded",
  animation = "wave",
  color = "primary",
  borderRadius,
  sx,
  ...rest
}: SkeletonProps) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <MuiSkeleton
      variant={variant}
      animation={animation}
      sx={[getSkeletonStyles(isDark, borderRadius, color), ...(Array.isArray(sx) ? sx : [sx])]}
      {...rest}
    />
  );
};

export default Skeleton;
export * from "./types";
