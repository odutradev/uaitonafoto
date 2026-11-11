import ScenePhoto from "@components/scenePhoto";
import usePresentation from "@pages/public/presentation/hook";
import SlideLayout from "@pages/public/presentation/subcomponents/slideLayout";
import { Item, Point, Points } from "@pages/public/presentation/subcomponents/slideLayout/styles";
import type { SceneKind, SceneTone } from "@components/scenePhoto/types";

import { Conclusion, Thumb } from "./styles";

import type { CSSProperties } from "react";

const thumbs: { kind: SceneKind; tone: SceneTone }[] = [
  { kind: "selfie", tone: "sky" },
  { kind: "toast", tone: "amber" },
  { kind: "bouquet", tone: "rose" }
];

const Problem = () => {
  const { data } = usePresentation();
  const problem = data.problem;

  return (
    <SlideLayout eyebrow={problem.eyebrow} title={problem.title} highlight={problem.highlight} tone="light">
      <Points data-columns="3">
        {problem.points.map((point, index) => (
          <Item key={point.title} style={{ "--i": index } as CSSProperties}>
            <Point>
              <Thumb>
                <ScenePhoto kind={thumbs[index].kind} tone={thumbs[index].tone} quality="compressed" />
              </Thumb>
              <strong>{point.title}</strong>
              <span>{point.text}</span>
            </Point>
          </Item>
        ))}
      </Points>
      <Item style={{ "--i": 4 } as CSSProperties}>
        <Conclusion>{problem.conclusion}</Conclusion>
      </Item>
    </SlideLayout>
  );
};

export default Problem;
