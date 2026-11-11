import { Button } from "@mui/material";
import { ArrowForward as ArrowForwardIcon } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";

import Reveal from "@pages/public/landingPage/subcomponents/reveal";
import { Actions, Box, Copy } from "./styles";
import type { InlineCtaProps } from "./types";

const InlineCta = ({ title, text, primary, secondary, tone = "light", layout = "bar" }: InlineCtaProps) => (
  <Reveal>
    <Box data-tone={tone} data-layout={layout}>
      <Copy>
        <strong>{title}</strong>
        <span>{text}</span>
      </Copy>
      <Actions>
        <Button
          component={RouterLink}
          to={primary.href}
          variant="contained"
          endIcon={<ArrowForwardIcon />}
          data-cursor="bora!"
        >
          {primary.text}
        </Button>
        <Button component="a" href={secondary.href} variant="outlined" data-cursor="rolar">
          {secondary.text}
        </Button>
      </Actions>
    </Box>
  </Reveal>
);

export default InlineCta;
