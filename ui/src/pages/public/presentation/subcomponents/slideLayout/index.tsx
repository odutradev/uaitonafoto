import usePresentation from "@pages/public/presentation/hook";

import { Copy, Eyebrow, Lead, Mark, Slide, Title, Visual } from "./styles";
import type { SlideLayoutProps } from "./types";

const SlideLayout = ({ eyebrow, title, highlight, tone = "dark", lead, visual, children }: SlideLayoutProps) => {
  const { themeMode } = usePresentation();
  const resolvedTone = tone === "dark" && themeMode === "light" ? "light" : tone;

  return (
    <Slide data-tone={resolvedTone} data-full={!visual}>
      <Copy>
        <Eyebrow>{eyebrow}</Eyebrow>
        <Title>
          {title} <Mark>{highlight}</Mark>
        </Title>
        {lead && <Lead>{lead}</Lead>}
        {children}
      </Copy>
      {visual && <Visual>{visual}</Visual>}
    </Slide>
  );
};

export default SlideLayout;
