import { Copy, Eyebrow, Lead, Mark, Slide, Title, Visual } from "./styles";
import type { SlideLayoutProps } from "./types";

const SlideLayout = ({ eyebrow, title, highlight, tone = "dark", lead, visual, children }: SlideLayoutProps) => (
  <Slide data-tone={tone} data-full={!visual}>
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

export default SlideLayout;
