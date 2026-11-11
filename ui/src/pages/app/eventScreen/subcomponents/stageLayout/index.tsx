import { Box, Typography } from "@mui/material";

import ScreenBrand from "@pages/app/eventScreen/subcomponents/screenBrand";
import ScreenPhotoTile from "@pages/app/eventScreen/subcomponents/screenPhotoTile";
import ScreenQrBlock from "@pages/app/eventScreen/subcomponents/screenQrBlock";
import useEventScreenPage from "@pages/app/eventScreen/hook";

export const StageLayout = () => {
  const {
    currentPhoto,
    isNewArrival,
    photos,
    currentIndex,
    selectPhoto: onSelectPhoto,
    guestLink,
    pin,
    showPin,
    photoFit,
    handleFullscreen: onFullscreen,
    handleOpenSettings: onOpenSettings,
    event
  } = useEventScreenPage();
  const customization = event?.customization;

  // Pega até 5 fotos recentes
  const recentPhotos = Array.from({ length: 5 }, (_, idx) => {
    if (photos.length <= 1) return null;
    const targetIdx = (currentIndex - 1 - idx + photos.length) % photos.length;
    return { photo: photos[targetIdx], index: targetIdx };
  });

  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        p: "2.5cqh",
        position: "relative",
        zIndex: 1,
        minHeight: 0,
        boxSizing: "border-box"
      }}
    >
      {/* Top Bar: Marca uaiToNaFoto AO VIVO na esquerda e Assessoria + Controles na direita */}
      <Box
        sx={{
          mb: "2cqh",
          width: "100%",
          flexShrink: 0
        }}
      >
        <ScreenBrand customization={customization} onFullscreen={onFullscreen} onOpenSettings={onOpenSettings} />
      </Box>

      {/* Grid Principal: 3 colunas (QR Code, Palco Central, Fotos Recentes) */}
      <Box
        sx={{
          flex: 1,
          display: "grid",
          gridTemplateColumns: "1fr 49.8cqh 1fr",
          gap: "2cqh",
          minHeight: 0
        }}
      >
        {/* Coluna da esquerda: QR Code */}
        <ScreenQrBlock guestLink={guestLink} pin={pin} showPin={showPin} variant="stack" />

        {/* Coluna central: Foto no centro com legenda sobreposta na base */}
        <ScreenPhotoTile
          photo={currentPhoto}
          photoFit={photoFit}
          isMain
          isNewArrival={isNewArrival}
          showOverlay
          aspectRatio="9 / 16"
          sx={{ height: "100%", width: "100%", justifySelf: "center" }}
        />

        {/* Coluna da direita: Fotos recentes */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            minHeight: 0,
            minWidth: 0
          }}
        >
          <Box>
            <Typography
              sx={(theme) => ({
                fontFamily: "'Bricolage Grotesque', system-ui, sans-serif",
                fontSize: "2.4cqh",
                fontWeight: 700,
                mb: "1.4cqh",
                color: theme.palette.mode === "dark" ? "#d9d2bf" : "#5b6166",
                letterSpacing: "-0.01em"
              })}
            >
              Fotos recentes
            </Typography>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "1.6cqh"
              }}
            >
              {recentPhotos.map((item, idx) => (
                <ScreenPhotoTile
                  key={item?.photo ? item.photo.id : `recent-${idx}`}
                  photo={item?.photo || null}
                  photoFit={photoFit}
                  aspectRatio="9 / 16"
                  onClick={item?.photo ? () => onSelectPhoto(item.index) : undefined}
                />
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default StageLayout;
