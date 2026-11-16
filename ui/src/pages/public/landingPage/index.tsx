import { GlobalStyles } from "@mui/material";

import usePageTitle from "@hooks/usePageTitle";

import { LandingPageProvider } from "./hook";
import AfterParty from "./sections/afterParty";
import Faq from "./sections/faq";
import Features from "./sections/features";
import FinalCta from "./sections/finalCta";
import GuestJourney from "./sections/guestJourney";
import Hero from "./sections/hero";
import HostSteps from "./sections/hostSteps";
import LiveEvent from "./sections/liveEvent";
import OrganizerView from "./sections/organizerView";
import Plans from "./sections/plans";
import Problem from "./sections/problem";
import { Footer } from "./subcomponents/footer";
import { Navbar } from "./subcomponents/navbar";
import ViewfinderCursor from "./subcomponents/viewfinderCursor";
import { Page, smoothScrollStyles } from "./styles";

const LandingPageContent = () => (
  <Page>
    <GlobalStyles styles={smoothScrollStyles} />
    <ViewfinderCursor />
    <Navbar />
    <main>
      <Hero />
      <Problem />
      <GuestJourney />
      <LiveEvent />
      <OrganizerView />
      <AfterParty />
      <HostSteps />
      <Features />
      <Plans />
      <Faq />
      <FinalCta />
    </main>
    <Footer />
  </Page>
);

const LandingPage = () => {
  usePageTitle("landing");

  return (
    <LandingPageProvider>
      <LandingPageContent />
    </LandingPageProvider>
  );
};

export default LandingPage;
