import type { ReactNode } from "react";
import type { SxProps, Theme } from "@mui/material";

export interface StepItem {
  label: string;
  description?: string;
  icon?: ReactNode;
}

export interface StepperProps {
  steps: Array<StepItem | string>;
  activeStep: number;
  onStepClick?: (stepIndex: number) => void;
  clickablePastSteps?: boolean;
  sx?: SxProps<Theme>;
}
