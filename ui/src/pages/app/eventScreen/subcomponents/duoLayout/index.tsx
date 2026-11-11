import { Box } from "@mui/material";

import ScreenBrand from "@pages/app/eventScreen/subcomponents/screenBrand";
import ScreenPhotoTile from "@pages/app/eventScreen/subcomponents/screenPhotoTile";
import ScreenQrBlock from "@pages/app/eventScreen/subcomponents/screenQrBlock";
import useEventScreenPage from "@pages/app/eventScreen/hook";

export const DuoLayout = () => {
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

  // Foto anterior (rec(1)[0])
  const previousIndex = photos.length > 1 ? (currentIndex - 1 + photos.length) % photos.length : -1;
  const previousPhoto = previousIndex >= 0 ? photos[previousIndex] : null;

  // 3 miniaturas recentes adicionais
  const recentMiniatures = Array.from({ length: 3 }, (_, idx) => {
    if (photos.length <= 2) return null;
    const targetIdx = (currentIndex - 2 - idx + photos.length) % photos.length;
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

      {/* Palco Duo: 3 colunas (Foto Atual, Foto Anterior, Lateral com QR e Recentes) */}
      <Box
        sx={{
          flex: 1,
          display: "grid",
          gridTemplateColumns: "49.8cqh 49.8cqh 1fr",
          gap: "2cqh",
          minHeight: 0
        }}
      >
        {/* Coluna 1: Foto atual com overlay de legenda */}
        <ScreenPhotoTile
          photo={currentPhoto}
          photoFit={photoFit}
          isMain
          isNewArrival={isNewArrival}
          showOverlay
          aspectRatio="9 / 16"
          sx={{ height: "100%" }}
        />

        {/* Coluna 2: Foto anterior em mesma altura com badge "Anterior" */}
        <ScreenPhotoTile
          photo={previousPhoto}
          photoFit={photoFit}
          label="Anterior"
          aspectRatio="9 / 16"
          sx={{ height: "100%" }}
          onClick={previousPhoto ? () => onSelectPhoto(previousIndex) : undefined}
        />

        {/* Coluna 3: QR Code empilhado + 3 miniaturas */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            gap: "2cqh",
            minHeight: 0,
            minWidth: 0
          }}
        >
          <ScreenQrBlock
            guestLink={guestLink}
            pin={pin}
            showPin={showPin}
            variant="stack"
            sx={{ flex: 1, minHeight: 0 }}
          />

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "1.4cqh",
              flexShrink: 0
            }}
          >
            {recentMiniatures.map((item, idx) => (
              <ScreenPhotoTile
                key={item?.photo ? item.photo.id : `duo-thumb-${idx}`}
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
  );
};

export default DuoLayout;
