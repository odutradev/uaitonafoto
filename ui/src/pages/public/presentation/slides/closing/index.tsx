import { Button } from "@mui/material";
import { ArrowForward as ArrowForwardIcon } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";

import usePresentation from "@pages/public/presentation/hook";
import SlideLayout from "@pages/public/presentation/subcomponents/slideLayout";
import { Item } from "@pages/public/presentation/subcomponents/slideLayout/styles";
import { brandColors } from "@styles/theme";

import { CtaWrap, QrBox } from "./styles";

import type { CSSProperties } from "react";

const Closing = () => {
  const { data } = usePresentation();
  const closing = data.closing;

  return (
    <SlideLayout
      eyebrow={closing.eyebrow}
      title={closing.title}
      highlight={closing.highlight}
      lead={closing.lead}
      tone="yellow"
      visual={
        <QrBox>
          <QRCodeSVG value={`https://${closing.domain}`} bgColor={brandColors.paper} fgColor={brandColors.ink} />
          <strong>{closing.domain}</strong>
        </QrBox>
      }
    >
      <Item style={{ "--i": 1 } as CSSProperties}>
        <CtaWrap>
          <Button component={RouterLink} to={closing.cta.href} variant="contained" endIcon={<ArrowForwardIcon />}>
            {closing.cta.text}
          </Button>
        </CtaWrap>
      </Item>
    </SlideLayout>
  );
};

export default Closing;
