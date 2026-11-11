import usePresentation from "@pages/public/presentation/hook";
import SlideLayout from "@pages/public/presentation/subcomponents/slideLayout";
import { Item, Point, Points } from "@pages/public/presentation/subcomponents/slideLayout/styles";

import type { CSSProperties } from "react";

const Audiences = () => {
  const { data } = usePresentation();
  const audiences = data.audiences;

  return (
    <SlideLayout eyebrow={audiences.eyebrow} title={audiences.title} highlight={audiences.highlight} tone="yellow">
      <Points data-columns="4">
        {audiences.points.map((point, index) => (
          <Item key={point.title} style={{ "--i": index } as CSSProperties}>
            <Point>
              <strong>{point.title}</strong>
              <span>{point.text}</span>
            </Point>
          </Item>
        ))}
      </Points>
    </SlideLayout>
  );
};

export default Audiences;
