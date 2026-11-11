import {
  ConnectedTvRounded as TvIcon,
  FavoriteRounded as FeedIcon,
  GpsFixedRounded as MissionsIcon,
  QrCode2Rounded as TableIcon,
  SellRounded as WhiteLabelIcon,
  VerifiedUserRounded as ModerationIcon
} from "@mui/icons-material";

import useLandingPage from "@pages/public/landingPage/hook";
import Reveal from "@pages/public/landingPage/subcomponents/reveal";
import SectionHeading from "@pages/public/landingPage/subcomponents/sectionHeading";
import type { FeatureItem } from "@pages/public/landingPage/data";

import { Badge, Card, Grid, Icon, Inner, Section } from "./styles";

import type { PointerEvent as ReactPointerEvent } from "react";

const featureIcons: Record<FeatureItem["icon"], typeof TvIcon> = {
  tv: TvIcon,
  missions: MissionsIcon,
  moderation: ModerationIcon,
  table: TableIcon,
  whitelabel: WhiteLabelIcon,
  feed: FeedIcon
};

const handleSpotlight = (event: ReactPointerEvent<HTMLElement>) => {
  const rect = event.currentTarget.getBoundingClientRect();
  event.currentTarget.style.setProperty("--x", `${event.clientX - rect.left}px`);
  event.currentTarget.style.setProperty("--y", `${event.clientY - rect.top}px`);
};

const Features = () => {
  const { data } = useLandingPage();
  const features = data.features;

  return (
    <Section id="recursos">
      <Inner>
        <SectionHeading eyebrow={features.eyebrow} title={features.title} highlight={features.highlight} />
        <Grid>
          {features.items.map((item, index) => {
            const FeatureIcon = featureIcons[item.icon];
            return (
              <Reveal key={item.id} delay={(index % 3) * 50}>
                <Card onPointerMove={handleSpotlight}>
                  <Icon>
                    <FeatureIcon />
                  </Icon>
                  <h3>
                    {item.title}
                    {item.badge && <Badge>{item.badge}</Badge>}
                  </h3>
                  <p>{item.description}</p>
                </Card>
              </Reveal>
            );
          })}
        </Grid>
      </Inner>
    </Section>
  );
};

export default Features;
