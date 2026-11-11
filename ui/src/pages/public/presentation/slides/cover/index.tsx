import { QRCodeSVG } from "qrcode.react";

import Logo from "@components/logo";
import ScenePhoto from "@components/scenePhoto";
import ScreenFrame from "@components/screenFrame";
import usePresentation from "@pages/public/presentation/hook";
import SlideLayout from "@pages/public/presentation/subcomponents/slideLayout";
import { Item } from "@pages/public/presentation/subcomponents/slideLayout/styles";
import { brandColors } from "@styles/theme";

import { Chips, QrCard, Scene } from "./styles";

import type { CSSProperties } from "react";

const Cover = () => {
  const { data } = usePresentation();
  const cover = data.cover;

  return (
    <SlideLayout
      eyebrow={cover.eyebrow}
      title={cover.title}
      highlight={cover.highlight}
      lead={cover.lead}
      visual={
        <Scene>
          <ScreenFrame label="telão" pin="4821">
            <ScenePhoto
              kind={cover.photo.kind}
              tone={cover.photo.tone}
              author={cover.photo.author}
              caption={cover.photo.caption}
            />
          </ScreenFrame>
          <QrCard>
            <QRCodeSVG value="https://uaitonafoto.com.br" bgColor={brandColors.paper} fgColor={brandColors.ink} />
            <span>{cover.qrLabel}</span>
          </QrCard>
        </Scene>
      }
    >
      <Item style={{ "--i": 1 } as CSSProperties}>
        <Chips>
          {cover.chips.map((chip) => (
            <span key={chip}>{chip}</span>
          ))}
        </Chips>
      </Item>
      <Item style={{ "--i": 2 } as CSSProperties}>
        <Logo size="large" variant="dark" />
      </Item>
    </SlideLayout>
  );
};

export default Cover;
