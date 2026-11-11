import usePresentation from "@pages/public/presentation/hook";
import SlideLayout from "@pages/public/presentation/subcomponents/slideLayout";
import { Item } from "@pages/public/presentation/subcomponents/slideLayout/styles";

import { Badge, Card, Grid, Notice, Price } from "./styles";

import type { CSSProperties } from "react";

const Plans = () => {
  const { data, plans, isLoadingPlans } = usePresentation();
  const content = data.plans;

  return (
    <SlideLayout
      eyebrow={content.eyebrow}
      title={content.title}
      highlight={content.highlight}
      lead={content.lead}
      tone="light"
    >
      {isLoadingPlans && <Notice>Carregando planos…</Notice>}
      {!isLoadingPlans && plans.length === 0 && <Notice>{content.fallback}</Notice>}
      {plans.length > 0 && (
        <Grid style={{ "--columns": Math.min(plans.length, 4) } as CSSProperties}>
          {plans.map((plan, index) => (
            <Item key={plan.id} style={{ "--i": index } as CSSProperties}>
              <Card data-highlighted={plan.isHighlighted}>
                {plan.badge && <Badge>{plan.badge}</Badge>}
                <h3>{plan.title}</h3>
                <Price>
                  <strong>{plan.price}</strong>
                  <span>{plan.period}</span>
                </Price>
                <ul>
                  {plan.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
              </Card>
            </Item>
          ))}
        </Grid>
      )}
    </SlideLayout>
  );
};

export default Plans;
