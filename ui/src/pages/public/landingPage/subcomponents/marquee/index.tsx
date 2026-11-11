import { Item, Row, Track } from "./styles";
import type { MarqueeProps } from "./types";

import type { CSSProperties } from "react";

const Marquee = ({ rows, duration = 40 }: MarqueeProps) => (
  <Track data-marquee="" style={{ "--marquee-duration": `${duration}s` } as CSSProperties}>
    {rows.map((items, rowIndex) => (
      <Row key={items.join("|")} data-reverse={rowIndex % 2 === 1}>
        {[...items, ...items].map((item, index) => (
          <Item key={`${item}-${index}`} aria-hidden={index >= items.length}>
            {item}
          </Item>
        ))}
      </Row>
    ))}
  </Track>
);

export default Marquee;
