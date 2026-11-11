import { useRef } from "react";

import useInView from "@hooks/useInView";

import Reveal from "@pages/public/landingPage/subcomponents/reveal";
import { Description, Eyebrow, Heading, Mark, Title } from "./styles";
import type { SectionHeadingProps } from "./types";

const SectionHeading = ({
  eyebrow,
  title,
  highlight,
  description,
  tone = "dark",
  align = "left"
}: SectionHeadingProps) => {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { threshold: 0.4 });

  return (
    <Heading ref={ref} data-tone={tone} data-align={align} data-visible={isInView}>
      <Reveal effect="fade">
        <Eyebrow>{eyebrow}</Eyebrow>
      </Reveal>
      <Reveal delay={80}>
        <Title>
          {title}
          {highlight && (
            <>
              {" "}
              <Mark>{highlight}</Mark>
            </>
          )}
        </Title>
      </Reveal>
      {description && (
        <Reveal delay={160}>
          <Description>{description}</Description>
        </Reveal>
      )}
    </Heading>
  );
};

export default SectionHeading;
