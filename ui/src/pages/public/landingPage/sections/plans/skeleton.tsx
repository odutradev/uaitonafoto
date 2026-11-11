import Skeleton from "@components/skeleton";
import SectionHeading from "@pages/public/landingPage/subcomponents/sectionHeading";

import { Grid, Inner, PlanCard, Section } from "./styles";

export interface PlansSkeletonProps {
  data: {
    tag: string;
    title: string;
    subtitle: string;
  };
}

export const PlansSkeleton = ({ data }: PlansSkeletonProps) => (
  <Section id="planos" aria-busy="true">
    <Inner>
      <SectionHeading eyebrow={data.tag} title={data.title} description={data.subtitle} tone="light" />
      <Grid>
        {[0, 1, 2, 3].map((index) => (
          <PlanCard key={index}>
            <Skeleton width={80} height={16} />
            <Skeleton width={150} height={28} sx={{ mt: 1.5 }} />
            <Skeleton width={120} height={40} sx={{ mt: 2 }} />
            <Skeleton width="100%" height={16} sx={{ mt: 3 }} />
            <Skeleton width="80%" height={16} sx={{ mt: 1 }} />
            {[1, 2, 3, 4, 5].map((item) => (
              <Skeleton key={item} width={`${90 - item * 7}%`} height={14} sx={{ mt: 1.5 }} />
            ))}
            <Skeleton variant="rounded" width="100%" height={50} borderRadius="999px" sx={{ mt: 4 }} />
          </PlanCard>
        ))}
      </Grid>
    </Inner>
  </Section>
);

export default PlansSkeleton;
