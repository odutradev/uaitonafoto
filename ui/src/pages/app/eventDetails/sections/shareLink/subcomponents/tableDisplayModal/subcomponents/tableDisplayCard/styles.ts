import type { SxProps, Theme } from "@mui/material";
import type { TableDisplayTemplateId } from "@pages/app/eventDetails/sections/shareLink/subcomponents/tableDisplayModal/types";

export interface TemplateTheme {
  background: string;
  color: string;
  secondaryColor: string;
  accentColor: string;
  borderColor: string;
  qrBackground: string;
  pinBg: string;
  pinColor: string;
  pinBorder?: string;
  stepBg: string;
  stepNumberBg: string;
  stepNumberColor: string;
  stepTextColor: string;
  badgeBorder?: string;
  cardBorder?: string;
  fontFamily: string;
  titleFont: string;
}

export const templateThemes: Record<TableDisplayTemplateId, TemplateTheme> = {
  wedding: {
    background: "#FAF7F2",
    color: "#2B2623",
    secondaryColor: "#6E675F",
    accentColor: "#9E7D47",
    borderColor: "#DFD5C6",
    qrBackground: "#FFFFFF",
    pinBg: "#F3ECE0",
    pinColor: "#2B2623",
    pinBorder: "1px solid #D4C3AC",
    stepBg: "#FFFFFF",
    stepNumberBg: "#9E7D47",
    stepNumberColor: "#FFFFFF",
    stepTextColor: "#4A433D",
    cardBorder: "1px solid #E6DCCD",
    fontFamily: '"DM Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    titleFont: '"Playfair Display", "Georgia", "Times New Roman", serif'
  },
  modern: {
    background: "#FFCF1F",
    color: "#17140F",
    secondaryColor: "#363023",
    accentColor: "#17140F",
    borderColor: "#17140F",
    qrBackground: "#FFFFFF",
    pinBg: "#17140F",
    pinColor: "#FFCF1F",
    pinBorder: "2px solid #17140F",
    stepBg: "rgba(255, 255, 255, 0.65)",
    stepNumberBg: "#17140F",
    stepNumberColor: "#FFCF1F",
    stepTextColor: "#17140F",
    cardBorder: "2px solid #17140F",
    fontFamily: '"DM Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    titleFont: '"DM Sans", "Bricolage Grotesque", -apple-system, sans-serif'
  },
  corporate: {
    background: "linear-gradient(175deg, #0F172A 0%, #1E293B 100%)",
    color: "#F8FAFC",
    secondaryColor: "#94A3B8",
    accentColor: "#38BDF8",
    borderColor: "rgba(255, 255, 255, 0.1)",
    qrBackground: "#FFFFFF",
    pinBg: "rgba(56, 189, 248, 0.12)",
    pinColor: "#38BDF8",
    pinBorder: "1px solid rgba(56, 189, 248, 0.4)",
    stepBg: "rgba(255, 255, 255, 0.05)",
    stepNumberBg: "#38BDF8",
    stepNumberColor: "#0F172A",
    stepTextColor: "#E2E8F0",
    cardBorder: "1px solid rgba(255, 255, 255, 0.12)",
    fontFamily: '"DM Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    titleFont: '"DM Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  minimal: {
    background: "#FFFFFF",
    color: "#111827",
    secondaryColor: "#6B7280",
    accentColor: "#111827",
    borderColor: "#E5E7EB",
    qrBackground: "#FFFFFF",
    pinBg: "#F3F4F6",
    pinColor: "#111827",
    pinBorder: "1px solid #D1D5DB",
    stepBg: "#F9FAFB",
    stepNumberBg: "#111827",
    stepNumberColor: "#FFFFFF",
    stepTextColor: "#374151",
    cardBorder: "1px solid #E5E7EB",
    fontFamily: '"DM Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    titleFont: '"DM Sans", -apple-system, BlinkMacSystemFont, sans-serif'
  },
  party: {
    background: "linear-gradient(160deg, #130B1C 0%, #200E2E 100%)",
    color: "#FFFFFF",
    secondaryColor: "#E2D9F3",
    accentColor: "#F43F5E",
    borderColor: "rgba(244, 63, 94, 0.35)",
    qrBackground: "#FFFFFF",
    pinBg: "rgba(244, 63, 94, 0.18)",
    pinColor: "#FDA4AF",
    pinBorder: "1px solid rgba(244, 63, 94, 0.5)",
    stepBg: "rgba(255, 255, 255, 0.08)",
    stepNumberBg: "#F43F5E",
    stepNumberColor: "#FFFFFF",
    stepTextColor: "#F1F5F9",
    cardBorder: "1px solid rgba(244, 63, 94, 0.35)",
    fontFamily: '"DM Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    titleFont: '"Bricolage Grotesque", "DM Sans", -apple-system, sans-serif'
  },
  rustic: {
    background: "#F5EFEB",
    color: "#382D26",
    secondaryColor: "#6B5B52",
    accentColor: "#4A5D4E",
    borderColor: "#D6C8BC",
    qrBackground: "#FFFFFF",
    pinBg: "#E8DFD5",
    pinColor: "#382D26",
    pinBorder: "1px solid #C4B5A5",
    stepBg: "#ECE3D9",
    stepNumberBg: "#4A5D4E",
    stepNumberColor: "#FFFFFF",
    stepTextColor: "#382D26",
    cardBorder: "1px solid #D6C8BC",
    fontFamily: '"DM Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    titleFont: '"Playfair Display", "Georgia", serif'
  }
};

export const cardContainerStyles = (theme: TemplateTheme): SxProps<Theme> => ({
  background: theme.background,
  color: theme.color,
  fontFamily: theme.fontFamily,
  border: theme.cardBorder || "none",
  borderRadius: "16px",
  boxSizing: "border-box",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  position: "relative",
  overflow: "hidden",
  userSelect: "none",
  boxShadow: "0 8px 30px rgba(0, 0, 0, 0.08)"
});
