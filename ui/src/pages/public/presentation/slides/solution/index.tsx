import PhoneFrame from "@components/phoneFrame";
import ScenePhoto from "@components/scenePhoto";
import usePresentation from "@pages/public/presentation/hook";
import SlideLayout from "@pages/public/presentation/subcomponents/slideLayout";
import { Item, Point, Points, StepNumber } from "@pages/public/presentation/subcomponents/slideLayout/styles";

import { Delivered, PhoneSlot, PhotoArea, Stats } from "./styles";

import type { CSSProperties } from "react";

const Solution = () => {
  const { data } = usePresentation();
  const solution = data.solution;

  return (
    <SlideLayout
      eyebrow={solution.eyebrow}
      title={solution.title}
      highlight={solution.highlight}
      visual={
        <PhoneSlot>
          <PhoneFrame>
            <PhotoArea>
              <ScenePhoto kind={solution.photo.kind} tone={solution.photo.tone} />
            </PhotoArea>
            <Delivered>no telão agora ✓</Delivered>
          </PhoneFrame>
        </PhoneSlot>
      }
    >
      <Points data-columns="3">
        {solution.steps.map((step, index) => (
          <Item key={step.title} style={{ "--i": index } as CSSProperties}>
            <Point>
              <StepNumber>{index + 1}</StepNumber>
              <strong>{step.title}</strong>
              <span>{step.text}</span>
            </Point>
          </Item>
        ))}
      </Points>
      <Item style={{ "--i": 4 } as CSSProperties}>
        <Stats>
          {solution.stats.map((stat) => (
            <div key={stat.text}>
              <strong>{stat.title}</strong>
              <span>{stat.text}</span>
            </div>
          ))}
        </Stats>
      </Item>
    </SlideLayout>
  );
};

export default Solution;
