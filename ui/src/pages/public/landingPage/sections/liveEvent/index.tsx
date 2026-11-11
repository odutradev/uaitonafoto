import { useEffect, useRef, useState } from "react";

import useInView from "@hooks/useInView";
import useScrollProgress from "@hooks/useScrollProgress";
import useLandingPage from "@pages/public/landingPage/hook";
import Marquee from "@pages/public/landingPage/subcomponents/marquee";
import Reveal from "@pages/public/landingPage/subcomponents/reveal";
import ScenePhoto from "@pages/public/landingPage/subcomponents/scenePhoto";
import ScreenFrame from "@pages/public/landingPage/subcomponents/screenFrame";
import SectionHeading from "@pages/public/landingPage/subcomponents/sectionHeading";

import {
  Highlight,
  Highlights,
  Inner,
  Missions,
  MissionsCopy,
  Mosaic,
  ScreenPhoto,
  ScreenSlot,
  Section,
  Ticker,
  Wall
} from "./styles";

const positions = ["left", "center", "right"] as const;

const LiveEvent = () => {
  const { data } = useLandingPage();
  const live = data.liveEvent;
  const sectionRef = useRef<HTMLElement>(null);
  const wallRef = useRef<HTMLDivElement>(null);
  const isWallVisible = useInView(wallRef, { once: false, threshold: 0.1 });
  const [tick, setTick] = useState(0);
  useScrollProgress(sectionRef, { mode: "through", steps: 1 });

  useEffect(() => {
    if (!isWallVisible) return;
    const timer = window.setInterval(() => setTick((value) => value + 1), 2200);
    return () => window.clearInterval(timer);
  }, [isWallVisible]);

  const orderedScreens = [live.screens[1], live.screens[0], live.screens[2]];
  const allPhotos = live.screens.flatMap((screen) => screen.photos);
  const tickerItems = data.hero.toasts;

  return (
    <Section id="ao-vivo" ref={sectionRef}>
      <Inner>
        <SectionHeading
          eyebrow={live.eyebrow}
          title={live.title}
          highlight={live.highlight}
          description={live.description}
          align="center"
        />

        <Wall ref={wallRef}>
          {orderedScreens.map((screen, index) => {
            const photo = screen.photos[(tick + index) % screen.photos.length];
            const position = positions[index];
            return (
              <ScreenSlot key={screen.label} data-position={position}>
                <Reveal effect="zoom" delay={index * 120}>
                  <ScreenFrame label={`telão ${screen.label}`} pin={screen.pin}>
                    <ScreenPhoto key={`${photo.id}-${tick}`}>
                      <ScenePhoto kind={photo.kind} tone={photo.tone} author={photo.author} caption={photo.caption} />
                    </ScreenPhoto>
                    <Mosaic aria-hidden="true">
                      {[1, 2, 3].map((offset) => {
                        const thumb = allPhotos[(tick + offset * 2) % allPhotos.length];
                        return (
                          <div key={`${thumb.id}-${tick}-${offset}`}>
                            <ScenePhoto kind={thumb.kind} tone={thumb.tone} />
                          </div>
                        );
                      })}
                    </Mosaic>
                  </ScreenFrame>
                </Reveal>
              </ScreenSlot>
            );
          })}
        </Wall>

        <Ticker aria-hidden="true">
          <div>
            {[...tickerItems, ...tickerItems].map((item, index) => (
              <span key={`${item.author}-${index}`}>
                <strong>{item.author}</strong> {item.text}
              </span>
            ))}
          </div>
        </Ticker>

        <Missions>
          <Reveal effect="slideRight">
            <MissionsCopy>
              <h3>{live.missionsTitle}</h3>
              <p>{live.missionsText}</p>
            </MissionsCopy>
          </Reveal>
          <Reveal effect="fade" delay={150}>
            <Marquee rows={live.missions} duration={36} />
          </Reveal>
        </Missions>

        <Highlights>
          {live.highlights.map((item, index) => (
            <Reveal key={item.title} delay={index * 100}>
              <Highlight>
                <strong>{item.title}</strong>
                <span>{item.text}</span>
              </Highlight>
            </Reveal>
          ))}
        </Highlights>
      </Inner>
    </Section>
  );
};

export default LiveEvent;
