import { Fragment, useEffect, useRef, useState } from "react";
import { Button } from "@mui/material";
import { ArrowForward as ArrowForwardIcon } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";

import useLandingPage from "@pages/public/landingPage/hook";
import ScenePhoto from "@pages/public/landingPage/subcomponents/scenePhoto";
import PhoneFrame from "@pages/public/landingPage/subcomponents/phoneFrame";
import { brandColors } from "@styles/theme";

import {
  Actions,
  Board,
  Chip,
  Chips,
  Copy,
  Description,
  Eyebrow,
  FlyingPhoto,
  Inner,
  LiveBadge,
  MainPhoto,
  MainSlot,
  Phone,
  QrCard,
  ScrollCue,
  Section,
  ShootButton,
  ShutterFlash,
  Side,
  Stage,
  StageTilt,
  Tile,
  Title,
  Toast,
  Viewfinder,
  Word
} from "./styles";

import type { CSSProperties, PointerEvent as ReactPointerEvent, ReactNode } from "react";

const cycleInterval = 2400;

const renderEmphasis = (text: string, phrases: string[]): ReactNode[] =>
  phrases.reduce<ReactNode[]>(
    (parts, phrase) =>
      parts.flatMap((part) => {
        if (typeof part !== "string" || !part.includes(phrase)) return [part];
        const [before, ...rest] = part.split(phrase);
        return [before, <strong key={phrase}>{phrase}</strong>, rest.join(phrase)];
      }),
    [text]
  );

const Hero = () => {
  const { data } = useLandingPage();
  const hero = data.hero;
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => setCycle((value) => value + 1), cycleInterval);
    return () => window.clearInterval(timer);
  }, []);

  const handlePointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!section || !stage) return;
    const rect = section.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    section.style.setProperty("--mx", `${x * 100}%`);
    section.style.setProperty("--my", `${y * 100}%`);
    stage.style.setProperty("--ry", `${(x - 0.5) * 10}deg`);
    stage.style.setProperty("--rx", `${(0.5 - y) * 8}deg`);
  };

  const handlePointerLeave = () => {
    stageRef.current?.style.setProperty("--ry", "0deg");
    stageRef.current?.style.setProperty("--rx", "0deg");
  };

  const total = hero.photos.length;
  const photoAt = (offset: number) => hero.photos[(((cycle + offset) % total) + total) % total];
  const mainPhoto = photoAt(0);
  const nextPhoto = photoAt(1);
  const sidePhotos = [photoAt(-1), photoAt(-2), photoAt(-3), photoAt(-4)];
  const toast = hero.toasts[cycle % hero.toasts.length];
  const titleWords = [
    ...hero.title.split(" ").map((word) => ({ word, isHighlight: false })),
    ...hero.highlight.split(" ").map((word) => ({ word, isHighlight: true }))
  ];

  return (
    <Section ref={sectionRef} onPointerMove={handlePointerMove} onPointerLeave={handlePointerLeave}>
      <Inner>
        <Copy>
          <Eyebrow>{hero.eyebrow}</Eyebrow>
          <Title aria-label={`${hero.title} ${hero.highlight}`}>
            {titleWords.map(({ word, isHighlight }, index) => (
              <Fragment key={`${word}-${index}`}>
                <Word aria-hidden="true" data-highlight={isHighlight} style={{ "--i": index } as CSSProperties}>
                  <span>{word}</span>
                </Word>
                {index < titleWords.length - 1 && " "}
              </Fragment>
            ))}
          </Title>
          <Description>{renderEmphasis(hero.description, hero.emphasis)}</Description>
          <Chips>
            {hero.chips.map((chip) => (
              <Chip key={chip} data-strong="true">
                {chip}
              </Chip>
            ))}
            {hero.occasions.map((occasion) => (
              <Chip key={occasion}>{occasion}</Chip>
            ))}
          </Chips>
          <Actions>
            <Button
              component={RouterLink}
              to={hero.primaryCta.href}
              variant="contained"
              color="primary"
              endIcon={<ArrowForwardIcon />}
              data-cursor="criar evento"
            >
              {hero.primaryCta.text}
            </Button>
            <Button component="a" href={hero.secondaryCta.href} variant="outlined" data-cursor="rolar">
              {hero.secondaryCta.text}
            </Button>
          </Actions>
        </Copy>

        <Stage ref={stageRef} aria-label="Simulação do telão ao vivo recebendo fotos dos convidados" role="img">
          <StageTilt>
            <Board>
              <MainSlot>
                <LiveBadge>ao vivo</LiveBadge>
                <MainPhoto key={`main-${cycle}`}>
                  <ScenePhoto kind={mainPhoto.kind} tone={mainPhoto.tone} />
                </MainPhoto>
                <ShutterFlash key={`flash-${cycle}`} />
                <Toast key={`toast-${cycle}`}>
                  <strong>{toast.author}</strong> {toast.text}
                </Toast>
              </MainSlot>
              <Side>
                {sidePhotos.map((photo, index) => (
                  <Tile key={`${photo.id}-${cycle}-${index}`}>
                    <ScenePhoto kind={photo.kind} tone={photo.tone} />
                  </Tile>
                ))}
                <QrCard>
                  <QRCodeSVG value="https://uaitonafoto.com.br" bgColor={brandColors.paper} fgColor={brandColors.ink} />
                  <span>{hero.qrLabel}</span>
                </QrCard>
              </Side>
            </Board>
            <FlyingPhoto key={`fly-${cycle}`}>
              <ScenePhoto kind={mainPhoto.kind} tone={mainPhoto.tone} />
            </FlyingPhoto>
            <Phone>
              <PhoneFrame>
                <Viewfinder>
                  <ScenePhoto kind={nextPhoto.kind} tone={nextPhoto.tone} />
                </Viewfinder>
                <ShootButton />
              </PhoneFrame>
            </Phone>
          </StageTilt>
        </Stage>
      </Inner>
      <ScrollCue href="#produto" aria-label="Rolar para conhecer o produto" />
    </Section>
  );
};

export default Hero;
