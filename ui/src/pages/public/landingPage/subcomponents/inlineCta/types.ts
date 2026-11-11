import type { InlineCtaData } from "@pages/public/landingPage/data";

export type InlineCtaTone = "dark" | "light";

export interface InlineCtaProps extends InlineCtaData {
  tone?: InlineCtaTone;
  layout?: "bar" | "stack";
}
