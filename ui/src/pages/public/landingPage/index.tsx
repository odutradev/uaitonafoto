import { Box } from "@mui/material";

import { LandingPageProvider } from "./hook";
import Features from "./sections/features";
import FinalCta from "./sections/finalCta";
import Hero from "./sections/hero";
import HowItWorks from "./sections/howItWorks";
import InteractiveDemo from "./sections/interactiveDemo";
import Plans from "./sections/plans";
import { Footer } from "./subcomponents/footer";
import { Navbar } from "./subcomponents/navbar";

const LandingPageContent = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.default",
        overflowX: "hidden",
        width: "100%"
      }}
    >
      <Navbar />
      <Hero />
      <HowItWorks />
      <InteractiveDemo />
      <Features />
      <Plans />
      <FinalCta />
      <Footer />
    </Box>
  );
};

const LandingPage = () => (
  <LandingPageProvider>
    <LandingPageContent />
  </LandingPageProvider>
);

export default LandingPage;
