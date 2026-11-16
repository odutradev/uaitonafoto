import { ExpandMoreRounded as ExpandMoreIcon } from "@mui/icons-material";

import useLandingPage from "@pages/public/landingPage/hook";
import Reveal from "@pages/public/landingPage/subcomponents/reveal";
import SectionHeading from "@pages/public/landingPage/subcomponents/sectionHeading";

import { Answer, Inner, Item, List, Question, Section } from "./styles";

const Faq = () => {
  const { data } = useLandingPage();
  const faq = data.faq;

  return (
    <Section id="duvidas" aria-labelledby="duvidas-title">
      <Inner>
        <SectionHeading eyebrow={faq.eyebrow} title={faq.title} highlight={faq.highlight} tone="light" />
        <List>
          {faq.items.map((item, index) => (
            <Reveal key={item.question} delay={(index % 3) * 40}>
              <Item>
                <Question>
                  <h3>{item.question}</h3>
                  <ExpandMoreIcon aria-hidden="true" />
                </Question>
                <Answer>{item.answer}</Answer>
              </Item>
            </Reveal>
          ))}
        </List>
      </Inner>
    </Section>
  );
};

export default Faq;
