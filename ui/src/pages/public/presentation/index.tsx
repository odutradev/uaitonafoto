import { PresentationProvider } from "./hook";
import usePresentation from "./hook";
import AfterParty from "./slides/afterParty";
import Audiences from "./slides/audiences";
import Closing from "./slides/closing";
import Cover from "./slides/cover";
import Live from "./slides/live";
import Organizer from "./slides/organizer";
import Plans from "./slides/plans";
import Problem from "./slides/problem";
import Setup from "./slides/setup";
import Solution from "./slides/solution";
import DeckControls from "./subcomponents/deckControls";
import { Canvas, SlideFrame, Viewport } from "./styles";
import type { SlideId } from "./hook/types";

import type { ComponentType, CSSProperties } from "react";

const slideComponents: Record<SlideId, ComponentType> = {
  cover: Cover,
  problem: Problem,
  solution: Solution,
  live: Live,
  organizer: Organizer,
  afterParty: AfterParty,
  setup: Setup,
  audiences: Audiences,
  plans: Plans,
  closing: Closing
};

const PresentationContent = () => {
  const { currentSlide, currentIndex, direction, scale, total, handlePointerDown, handlePointerUp } = usePresentation();
  const CurrentSlide = slideComponents[currentSlide];

  return (
    <Viewport
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      aria-roledescription="apresentação"
      aria-label={`Slide ${currentIndex + 1} de ${total}`}
    >
      <Canvas style={{ "--scale": scale } as CSSProperties}>
        <SlideFrame key={currentIndex} data-direction={direction}>
          <CurrentSlide />
        </SlideFrame>
      </Canvas>
      <DeckControls />
    </Viewport>
  );
};

const Presentation = () => (
  <PresentationProvider>
    <PresentationContent />
  </PresentationProvider>
);

export default Presentation;
