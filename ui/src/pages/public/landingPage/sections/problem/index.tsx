import { useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { DownloadRounded as DownloadIcon } from "@mui/icons-material";

import useScrollProgress from "@hooks/useScrollProgress";
import useLandingPage from "@pages/public/landingPage/hook";
import ScenePhoto from "@components/scenePhoto";
import { brandColors } from "@styles/theme";

import {
  Album,
  AlbumLabel,
  Canvas,
  Copy,
  Eyebrow,
  Heading,
  Inner,
  Item,
  QrHub,
  Rail,
  RailSegment,
  Section,
  Shell,
  Stage,
  StageLabel,
  StageText,
  StageTitle,
  Sticky,
  TrapLabel
} from "./styles";

import type { CSSProperties } from "react";

const Problem = () => {
  const { data } = useLandingPage();
  const problem = data.problem;
  const sectionRef = useRef<HTMLElement>(null);
  const progress = useScrollProgress(sectionRef);
  const stageCount = problem.stages.length;
  const stageIndex = Math.min(stageCount - 1, Math.floor(progress * stageCount));
  const stage = problem.stages[stageIndex];

  return (
    <Section id="produto" ref={sectionRef}>
      <Sticky>
        <Inner>
          <Copy>
            <Eyebrow>{problem.eyebrow}</Eyebrow>
            <Heading>
              {problem.title} <span>{problem.highlight}</span>
            </Heading>
            <Stage key={stageIndex} aria-live="polite">
              <StageLabel data-stage={stageIndex}>{stage.label}</StageLabel>
              <StageTitle>{stage.title}</StageTitle>
              <StageText>{stage.text}</StageText>
            </Stage>
            <Rail aria-hidden="true">
              {problem.stages.map((item, index) => (
                <RailSegment
                  key={item.label}
                  style={{ "--fill": Math.min(1, Math.max(0, progress * stageCount - index)) } as CSSProperties}
                />
              ))}
            </Rail>
          </Copy>

          <Canvas data-stage={stageIndex} role="img" aria-label={stage.title}>
            <Album>
              <AlbumLabel>
                <DownloadIcon fontSize="small" />
                {problem.albumLabel}
              </AlbumLabel>
            </Album>
            <QrHub>
              <QRCodeSVG
                value="https://uaitonafoto.com.br"
                bgColor={brandColors.flashYellow}
                fgColor={brandColors.ink}
              />
            </QrHub>
            {problem.photos.map((photo, index) => (
              <Item key={photo.id}>
                <TrapLabel>
                  {problem.traps[index].label}
                  <small>{problem.traps[index].note}</small>
                </TrapLabel>
                <Shell>
                  <ScenePhoto
                    kind={photo.kind}
                    tone={photo.tone}
                    quality={stageIndex === 0 ? "compressed" : "original"}
                    author={stageIndex === 2 ? photo.author : undefined}
                    caption={stageIndex === 2 ? photo.caption : undefined}
                  />
                </Shell>
              </Item>
            ))}
          </Canvas>
        </Inner>
      </Sticky>
    </Section>
  );
};

export default Problem;
