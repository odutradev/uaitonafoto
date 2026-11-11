import ScenePhoto from "@components/scenePhoto";
import usePresentation from "@pages/public/presentation/hook";
import SlideLayout from "@pages/public/presentation/subcomponents/slideLayout";
import { Item, Point, Points } from "@pages/public/presentation/subcomponents/slideLayout/styles";

import { Actions, Header, Meta, Panel, Photo } from "./styles";

import type { CSSProperties } from "react";

const Organizer = () => {
  const { data } = usePresentation();
  const organizer = data.organizer;
  const photo = organizer.queue;

  return (
    <SlideLayout
      eyebrow={organizer.eyebrow}
      title={organizer.title}
      highlight={organizer.highlight}
      tone="light"
      visual={
        <Panel aria-hidden="true">
          <Header>
            <span>aguardando aprovação</span>
            <em>ao vivo</em>
          </Header>
          <Photo>
            <ScenePhoto kind={photo.kind} tone={photo.tone} />
          </Photo>
          <Meta>
            <div>
              <strong>{photo.author}</strong>
              <small>{photo.table}</small>
            </div>
            <em>missão: {photo.mission}</em>
          </Meta>
          <Actions>
            <span>✕ rejeitar</span>
            <span>✓ aprovar</span>
          </Actions>
        </Panel>
      }
    >
      <Points data-columns="2">
        {organizer.points.map((point, index) => (
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

export default Organizer;
