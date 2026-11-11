import ScenePhoto from "@components/scenePhoto";
import ScreenFrame from "@components/screenFrame";
import usePresentation from "@pages/public/presentation/hook";
import SlideLayout from "@pages/public/presentation/subcomponents/slideLayout";
import { Item, Point, Points } from "@pages/public/presentation/subcomponents/slideLayout/styles";

import { Screens } from "./styles";

import type { CSSProperties } from "react";

const Live = () => {
  const { data } = usePresentation();
  const live = data.live;

  return (
    <SlideLayout
      eyebrow={live.eyebrow}
      title={live.title}
      highlight={live.highlight}
      visual={
        <Screens>
          {live.screens.map((screen, index) => (
            <Item key={screen.label} style={{ "--i": index + 1 } as CSSProperties}>
              <ScreenFrame label={`telão ${screen.label}`} pin={screen.pin}>
                <ScenePhoto
                  kind={screen.photo.kind}
                  tone={screen.photo.tone}
                  author={index === 0 ? screen.photo.author : undefined}
                  caption={index === 0 ? screen.photo.caption : undefined}
                />
              </ScreenFrame>
            </Item>
          ))}
        </Screens>
      }
    >
      <Points data-columns="2">
        {live.points.map((point, index) => (
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

export default Live;
