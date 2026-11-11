import { Button, IconButton, Tooltip } from "@mui/material";
import {
  ArrowForward as ArrowForwardIcon,
  AutoAwesome as AutoAwesomeIcon,
  CheckCircle as CheckCircleIcon,
  InfoOutlined as InfoOutlinedIcon
} from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";

import useLandingPage from "@pages/public/landingPage/hook";
import Reveal from "@pages/public/landingPage/subcomponents/reveal";
import SectionHeading from "@pages/public/landingPage/subcomponents/sectionHeading";

import { resolvePlanFeature } from "./featuresMap";
import PlansSkeleton from "./skeleton";
import {
  Audience,
  Audiences,
  Cta,
  Description,
  Feature,
  Features,
  Grid,
  Inherited,
  Inner,
  PlanCard,
  Popular,
  Price,
  Section,
  SubBadge,
  Tag,
  Title,
  tooltipSlotProps
} from "./styles";
import type { PlanCardData } from "./types";

import type { CSSProperties } from "react";

const inheritancePrefixes = [
  "tudo que tem no avulso",
  "tudo que tem no essencial",
  "tudo do avulso",
  "tudo do essencial"
];

const isInheritanceHeader = (feature: string) =>
  inheritancePrefixes.some((prefix) => feature.toLowerCase().startsWith(prefix));

const visibleFeatures = (plan: PlanCardData) => {
  const isProPlan = plan.id?.toLowerCase().includes("pro") || plan.title?.toLowerCase().includes("pro");
  if (!isProPlan) return plan.features;
  return plan.features.filter((feature) => {
    const lower = feature.toLowerCase();
    return !(lower.includes("créditos acumulativos") || lower.includes("crédito extra"));
  });
};

const Plans = () => {
  const { plans, isLoadingPlans, isAuthenticated, onSelectPlan, data } = useLandingPage();
  const content = data.plans;

  if (isLoadingPlans) return <PlansSkeleton data={content} />;
  if (!plans || plans.length === 0) return null;

  return (
    <Section id="planos">
      <Inner>
        <SectionHeading eyebrow={content.tag} title={content.title} description={content.subtitle} tone="light" />

        <Grid style={{ "--columns": Math.min(plans.length, 4) } as CSSProperties}>
          {plans.map((plan, index) => (
            <Reveal key={plan.id} delay={index * 90}>
              <PlanCard data-highlighted={plan.highlighted}>
                {plan.badge && <Popular>{plan.badge}</Popular>}
                <Tag>{plan.tag}</Tag>
                <Title>{plan.title}</Title>
                <Price>
                  <strong>{plan.price}</strong>
                  <span>{plan.period}</span>
                </Price>
                {plan.costPerEvent ? (
                  <SubBadge data-variant="saving">{plan.costPerEvent}</SubBadge>
                ) : (
                  plan.subBadge && <SubBadge>{plan.subBadge}</SubBadge>
                )}
                <Description>{plan.description}</Description>

                <Features>
                  {visibleFeatures(plan).map((feature, featureIndex) => {
                    if (isInheritanceHeader(feature)) {
                      return (
                        <Inherited key={featureIndex}>
                          <AutoAwesomeIcon />
                          {feature}
                        </Inherited>
                      );
                    }

                    const info = resolvePlanFeature(feature);
                    return (
                      <Feature key={featureIndex}>
                        <span>
                          <CheckCircleIcon />
                          <span>{info.label}</span>
                        </span>
                        <Tooltip
                          title={info.tooltip}
                          arrow
                          placement="top"
                          enterTouchDelay={50}
                          leaveTouchDelay={3500}
                          slotProps={tooltipSlotProps}
                        >
                          <IconButton size="small" aria-label={`Mais informações sobre ${info.label}`}>
                            <InfoOutlinedIcon fontSize="inherit" />
                          </IconButton>
                        </Tooltip>
                      </Feature>
                    );
                  })}
                </Features>

                <Cta>
                  <Button
                    component={RouterLink}
                    to={
                      isAuthenticated
                        ? `/app/billing?checkout=${encodeURIComponent(plan.ctaHref)}`
                        : `/signin?planId=${encodeURIComponent(plan.ctaHref)}`
                    }
                    onClick={() => onSelectPlan(plan)}
                    variant={plan.highlighted ? "contained" : "outlined"}
                    disableElevation
                    endIcon={<ArrowForwardIcon />}
                    data-cursor="escolher"
                  >
                    {plan.ctaText}
                  </Button>
                </Cta>
              </PlanCard>
            </Reveal>
          ))}
        </Grid>

        <Audiences>
          {data.audiences.map((audience, index) => (
            <Reveal key={audience.title} delay={index * 80} effect="fade">
              <Audience>
                <strong>{audience.title}</strong>
                <p>{audience.text}</p>
              </Audience>
            </Reveal>
          ))}
        </Audiences>
      </Inner>
    </Section>
  );
};

export default Plans;
