import usePresentation from "@pages/public/presentation/hook";
import SlideLayout from "@pages/public/presentation/subcomponents/slideLayout";
import { Item, Point, Points, StepNumber } from "@pages/public/presentation/subcomponents/slideLayout/styles";

import type { CSSProperties } from "react";

const Setup = () => {
  const { data } = usePresentation();
  const setup = data.setup;

  return (
    <SlideLayout eyebrow={setup.eyebrow} title={setup.title} highlight={setup.highlight} tone="light">
      <Points data-columns="3">
        {setup.steps.map((step, index) => (
          <Item key={step.title} style={{ "--i": index } as CSSProperties}>
            <Point>
              <StepNumber>{index + 1}</StepNumber>
              <strong>{step.title}</strong>
              <span>{step.text}</span>
            </Point>
          </Item>
        ))}
      </Points>
    </SlideLayout>
  );
};

export default Setup;
