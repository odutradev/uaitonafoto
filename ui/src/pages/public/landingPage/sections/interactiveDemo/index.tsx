import { Box, Container } from "@mui/material";
import { brandColors } from "@styles/theme";

import { GuestFeed } from "@pages/public/landingPage/subcomponents/guestFeed";
import { LiveWall } from "@pages/public/landingPage/subcomponents/liveWall";
import { demoContainerStyles, demoGridStyles } from "./styles";
import useLandingPage from "@pages/public/landingPage/hook";

export const InteractiveDemo = () => {
  const { isDark, data: content } = useLandingPage();
  const liveWallData = content.liveWall;
  const guestFeedData = content.guestFeed;

  const liveWallAccent = isDark ? brandColors.flashYellow : brandColors.ink;
  const mosaicTiles = isDark
    ? [brandColors.darkSurface, brandColors.darkBorder, brandColors.darkPaper]
    : [brandColors.sand, brandColors.sandDark, brandColors.lightBorder];

  return (
    <Container maxWidth="lg" sx={demoContainerStyles}>
      <Box sx={demoGridStyles}>
        <LiveWall data={liveWallData} isDark={isDark} liveWallAccent={liveWallAccent} mosaicTiles={mosaicTiles} />
        <GuestFeed data={guestFeedData} isDark={isDark} />
      </Box>
    </Container>
  );
};

export default InteractiveDemo;
