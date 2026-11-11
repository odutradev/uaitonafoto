export type SectionTone = "dark" | "light" | "yellow";

export interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  highlight?: string;
  description?: string;
  tone?: SectionTone;
  align?: "left" | "center";
}
