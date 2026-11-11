import { useRef } from "react";
import { Button } from "@mui/material";
import { ArrowForward as ArrowForwardIcon } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";

import useScrollProgress from "@hooks/useScrollProgress";
import useLandingPage from "@pages/public/landingPage/hook";
import Reveal from "@pages/public/landingPage/subcomponents/reveal";
import ScenePhoto from "@components/scenePhoto";
import { brandColors } from "@styles/theme";

import { Block, ButtonWrap, Content, Copy, Floating, QrBox, Section } from "./styles";

import type { CSSProperties } from "react";

const floatingSlots = [
  { top: "-30px", right: "28%", rot: "8deg", depth: "120px", delay: "0s" },
  { top: "40%", right: "-20px", rot: "-10deg", depth: "60px", delay: "1.2s" },
  { bottom: "-40px", right: "40%", rot: "-4deg", depth: "160px", delay: "2.4s" }
];

const FinalCta = () => {
  const { data } = useLandingPage();
  const cta = data.finalCta;
  const sectionRef = useRef<HTMLElement>(null);
  useScrollProgress(sectionRef, { mode: "through", steps: 1 });
  const photos = data.hero.photos.slice(0, floatingSlots.length);

  return (
    <Section ref={sectionRef}>
      <Block>
        {photos.map((photo, index) => {
          const slot = floatingSlots[index];
          return (
            <Floating
              key={photo.id}
              aria-hidden="true"
              style={
                {
                  top: slot.top,
                  right: slot.right,
                  bottom: slot.bottom,
                  "--rot": slot.rot,
                  "--depth": slot.depth,
                  "--delay": slot.delay
                } as CSSProperties
              }
            >
              <div>
                <ScenePhoto kind={photo.kind} tone={photo.tone} />
              </div>
            </Floating>
          );
        })}
        <Content>
          <Copy>
            <Reveal>
              <h2>{cta.title}</h2>
            </Reveal>
            <Reveal delay={60}>
              <p>{cta.description}</p>
            </Reveal>
            <Reveal delay={100}>
              <ButtonWrap>
                <Button
                  component={RouterLink}
                  to={cta.button.href}
                  variant="contained"
                  endIcon={<ArrowForwardIcon />}
                  data-cursor="bora!"
                >
                  {cta.button.text}
                </Button>
              </ButtonWrap>
            </Reveal>
          </Copy>
          <Reveal effect="slideLeft" delay={100}>
            <QrBox>
              <QRCodeSVG value={`https://${cta.domain}`} bgColor={brandColors.paper} fgColor={brandColors.ink} />
              <div>
                <strong>{cta.domain}</strong>
                <small>crie seu evento agora</small>
              </div>
            </QrBox>
          </Reveal>
        </Content>
      </Block>
    </Section>
  );
};

export default FinalCta;
