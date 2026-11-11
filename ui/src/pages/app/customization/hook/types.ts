import type { CustomizationFormState, CustomizationPreviewTab } from "@pages/app/customization/types";
import type { NavigateFunction } from "react-router-dom";
import type { FormEvent } from "react";

export interface UseCustomizationPageReturn {
  navigate: NavigateFunction;
  hasPlan: boolean;
  form: CustomizationFormState;
  setField: <K extends keyof CustomizationFormState>(key: K, value: CustomizationFormState[K]) => void;
  previewTab: CustomizationPreviewTab;
  setPreviewTab: (tab: CustomizationPreviewTab) => void;
  isSaving: boolean;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  cleanPhone: string;
  whatsappUrl: string;
}
