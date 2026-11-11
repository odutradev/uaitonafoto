import { useRef } from "react";
import { QRCodeSVG } from "qrcode.react";

import useScrollProgress from "@hooks/useScrollProgress";
import useLandingPage from "@pages/public/landingPage/hook";
import PhoneFrame from "@components/phoneFrame";
import ScenePhoto from "@components/scenePhoto";
import ScreenFrame from "@components/screenFrame";
import { brandColors } from "@styles/theme";

import {
  CameraView,
  Copy,
  Description,
  Devices,
  EventTag,
  Eyebrow,
  Feed,
  FeedHeader,
  Heading,
  Hint,
  Inner,
  Input,
  LinkPill,
  MissionChip,
  PhoneSlot,
  Placeholder,
  PrimaryButton,
  Progress,
  Prompt,
  ScanFrame,
  Screen,
  Section,
  Step,
  Steps,
  Sticky,
  TableCard,
  Timer,
  TvFlash,
  TvPhoto,
  TvSlot,
  TvWaiting,
  Upload
} from "./styles";

import type { CSSProperties } from "react";

const totalSeconds = 9.6;

const clamp = (value: number) => Math.min(1, Math.max(0, value));

const GuestJourney = () => {
  const { data } = useLandingPage();
  const journey = data.guestJourney;
  const sectionRef = useRef<HTMLElement>(null);
  const progress = useScrollProgress(sectionRef, { steps: 200 });
  const stepCount = journey.steps.length;
  const stepIndex = Math.min(stepCount - 1, Math.floor(progress * stepCount));
  const stepProgress = clamp(progress * stepCount - stepIndex);
  const seconds = (progress * totalSeconds).toFixed(1).replace(".", ",");
  const typedName = journey.guestName.slice(0, Math.ceil(clamp(stepProgress * 1.6) * journey.guestName.length));
  const uploadProgress = stepIndex === 2 ? clamp(stepProgress * 1.8) : 0;
  const isDelivered = stepIndex === 2 && uploadProgress >= 1;
  const isScanned = stepIndex === 0 && stepProgress > 0.55;
  const screenState = (index: number) => ({
    "data-visible": stepIndex === index,
    style: { "--exit": index < stepIndex ? "-30px" : "30px" } as CSSProperties
  });

  return (
    <Section id="convidado" ref={sectionRef}>
      <Sticky>
        <Inner>
          <Copy>
            <Eyebrow>{journey.eyebrow}</Eyebrow>
            <Heading>
              {journey.title} <span>{journey.highlight}</span>
            </Heading>
            <Description>{journey.description}</Description>
            <Timer aria-hidden="true">
              00:0{seconds}
              <small>segundos</small>
            </Timer>
            <Steps>
              {journey.steps.map((step, index) => (
                <Step
                  key={step.title}
                  data-active={index === stepIndex}
                  style={{ "--fill": index < stepIndex ? 1 : index === stepIndex ? stepProgress : 0 } as CSSProperties}
                >
                  <em>{step.time}</em>
                  <strong>{step.title}</strong>
                  <span>{step.text}</span>
                </Step>
              ))}
            </Steps>
          </Copy>

          <Devices role="img" aria-label={journey.steps[stepIndex].title}>
            <TvSlot>
              <ScreenFrame label="palco" pin="4821">
                {isDelivered ? (
                  <>
                    <TvPhoto>
                      <ScenePhoto
                        kind={journey.photo.kind}
                        tone={journey.photo.tone}
                        author={journey.guestName}
                        caption={journey.photo.caption}
                      />
                    </TvPhoto>
                    <TvFlash />
                  </>
                ) : (
                  <TvWaiting>aguardando fotos…</TvWaiting>
                )}
              </ScreenFrame>
            </TvSlot>
            <PhoneSlot>
              <PhoneFrame>
                <Screen {...screenState(0)}>
                  <CameraView />
                  <TableCard style={{ "--zoom": 1 + stepProgress * 0.25 } as CSSProperties}>
                    <QRCodeSVG
                      value="https://uaitonafoto.com.br"
                      bgColor={brandColors.paper}
                      fgColor={brandColors.ink}
                    />
                    mesa 4 · aponte a câmera
                  </TableCard>
                  <ScanFrame />
                  <LinkPill data-visible={isScanned}>
                    uaitonafoto.com.br
                    <small>{journey.eventName}</small>
                  </LinkPill>
                </Screen>

                <Screen {...screenState(1)}>
                  <EventTag>{journey.eventName}</EventTag>
                  <Prompt>como você se chama?</Prompt>
                  <Hint>sem app, sem senha, sem cadastro</Hint>
                  <Input>{typedName ? typedName : <Placeholder>seu primeiro nome</Placeholder>}</Input>
                  <PrimaryButton style={{ "--press": stepProgress > 0.8 ? 0.94 : 1 } as CSSProperties}>
                    entrar no mural
                  </PrimaryButton>
                </Screen>

                <Screen {...screenState(2)}>
                  <Feed>
                    <FeedHeader>
                      <span>olá, {journey.guestName}</span>
                      <span>♥ 12</span>
                    </FeedHeader>
                    <Upload>
                      <ScenePhoto kind={journey.photo.kind} tone={journey.photo.tone} />
                      <Progress data-done={isDelivered} style={{ "--upload": uploadProgress } as CSSProperties}>
                        {isDelivered ? "no telão agora! ✓" : `enviando em alta… ${Math.round(uploadProgress * 100)}%`}
                        {!isDelivered && <i />}
                      </Progress>
                    </Upload>
                    <MissionChip data-visible={isDelivered}>
                      <span>missão cumprida: {journey.photo.caption}</span>
                      <b>+1</b>
                    </MissionChip>
                  </Feed>
                </Screen>
              </PhoneFrame>
            </PhoneSlot>
          </Devices>
        </Inner>
      </Sticky>
    </Section>
  );
};

export default GuestJourney;
