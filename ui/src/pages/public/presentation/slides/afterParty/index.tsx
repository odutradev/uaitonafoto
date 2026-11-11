import ScenePhoto from "@components/scenePhoto";
import usePresentation from "@pages/public/presentation/hook";
import SlideLayout from "@pages/public/presentation/subcomponents/slideLayout";
import { Item, Point, Points } from "@pages/public/presentation/subcomponents/slideLayout/styles";

import { Polaroid, Polaroids } from "./styles";

import type { CSSProperties } from "react";

const rotations = ["-3deg", "2deg", "2.5deg", "-2deg"];

const AfterParty = () => {
  const { data } = usePresentation();
  const after = data.afterParty;

  return (
    <SlideLayout
      eyebrow={after.eyebrow}
      title={after.title}
      highlight={after.highlight}
      visual={
        <Polaroids>
          {after.photos.map((photo, index) => (
            <Item key={photo.id} style={{ "--i": index + 1 } as CSSProperties}>
              <Polaroid style={{ "--rot": rotations[index] } as CSSProperties}>
                <div>
                  <ScenePhoto kind={photo.kind} tone={photo.tone} />
                </div>
                <figcaption>
                  <span>{photo.caption}</span>
                  <span>{photo.time}</span>
                </figcaption>
              </Polaroid>
            </Item>
          ))}
        </Polaroids>
      }
    >
      <Points>
        {after.points.map((point, index) => (
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

export default AfterParty;
