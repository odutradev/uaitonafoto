import { useRef } from "react";

import useScrollProgress from "@hooks/useScrollProgress";
import useLandingPage from "@pages/public/landingPage/hook";
import InlineCta from "@pages/public/landingPage/subcomponents/inlineCta";
import SectionHeading from "@pages/public/landingPage/subcomponents/sectionHeading";

import { Aside, Inner, Item, List, Section, StepNumber } from "./styles";

const HostSteps = () => {
  const { data } = useLandingPage();
  const host = data.hostSteps;
  const listRef = useRef<HTMLOListElement>(null);
  const progress = useScrollProgress(listRef, { mode: "center" });
  const reached = Math.floor(progress * host.steps.length + 0.15);

  return (
    <Section id="como-funciona">
      <Inner>
        <Aside>
          <SectionHeading
            eyebrow={host.eyebrow}
            title={host.title}
            highlight={host.highlight}
            description={host.description}
            tone="light"
          />
          <InlineCta {...data.inlineCtas.hostSteps} tone="light" layout="stack" />
        </Aside>
        <List ref={listRef}>
          {host.steps.map((step, index) => (
            <Item key={step.title} data-active={index < Math.max(1, reached)}>
              <StepNumber aria-hidden="true">{index + 1}</StepNumber>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
              <code>{step.path}</code>
            </Item>
          ))}
        </List>
      </Inner>
    </Section>
  );
};

export default HostSteps;
