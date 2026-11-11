import { Badge, Badges, Bezel, Display, Stand, Wrapper } from "./styles";
import type { ScreenFrameProps } from "./types";

const ScreenFrame = ({ children, label, pin, isLive = true, className }: ScreenFrameProps) => (
  <Wrapper className={className}>
    <Bezel>
      <Display>
        <Badges>
          {isLive ? <Badge data-live="true">ao vivo</Badge> : <span />}
          {(label || pin) && <Badge>{[label, pin && `PIN ${pin}`].filter(Boolean).join(" · ")}</Badge>}
        </Badges>
        {children}
      </Display>
    </Bezel>
    <Stand aria-hidden="true" />
  </Wrapper>
);

export default ScreenFrame;
