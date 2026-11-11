import { useEffect, useState } from "react";
import { IconButton, Tooltip } from "@mui/material";
import {
  ChevronLeftRounded as PreviousIcon,
  ChevronRightRounded as NextIcon,
  FullscreenExitRounded as ExitFullscreenIcon,
  FullscreenRounded as FullscreenIcon
} from "@mui/icons-material";

import ThemeToggle from "@components/themeToggle";
import usePresentation from "@pages/public/presentation/hook";

import { Actions, Bar, Counter, Dot, Dots, Progress } from "./styles";

import type { CSSProperties } from "react";

const idleDelay = 2500;

const DeckControls = () => {
  const {
    slideIds,
    currentIndex,
    total,
    isFullscreen,
    handleNext,
    handlePrevious,
    handleGoTo,
    handleToggleFullscreen
  } = usePresentation();
  const [isIdle, setIsIdle] = useState(false);

  useEffect(() => {
    const timer = { id: 0 };
    const wake = () => {
      setIsIdle(false);
      window.clearTimeout(timer.id);
      timer.id = window.setTimeout(() => setIsIdle(true), idleDelay);
    };

    wake();
    window.addEventListener("pointermove", wake);
    window.addEventListener("keydown", wake);
    return () => {
      window.clearTimeout(timer.id);
      window.removeEventListener("pointermove", wake);
      window.removeEventListener("keydown", wake);
    };
  }, []);

  return (
    <>
      <Progress style={{ "--progress": (currentIndex + 1) / total } as CSSProperties} aria-hidden="true" />
      <Bar data-idle={isIdle}>
        <Dots role="tablist" aria-label="Slides">
          {slideIds.map((slideId, index) => (
            <Dot
              key={slideId}
              type="button"
              aria-current={index === currentIndex}
              aria-label={`Ir para o slide ${index + 1}`}
              onClick={() => handleGoTo(index)}
            />
          ))}
        </Dots>
        <Actions>
          <IconButton aria-label="Slide anterior" onClick={handlePrevious} disabled={currentIndex === 0}>
            <PreviousIcon />
          </IconButton>
          <Counter aria-live="polite">
            {currentIndex + 1} / {total}
          </Counter>
          <IconButton aria-label="Próximo slide" onClick={handleNext} disabled={currentIndex === total - 1}>
            <NextIcon />
          </IconButton>
          <Tooltip title="Trocar tema (T)">
            <span>
              <ThemeToggle showTooltip={false} />
            </span>
          </Tooltip>
          <Tooltip title="Tela cheia (F)">
            <IconButton
              aria-label={isFullscreen ? "Sair da tela cheia" : "Entrar em tela cheia"}
              onClick={handleToggleFullscreen}
            >
              {isFullscreen ? <ExitFullscreenIcon /> : <FullscreenIcon />}
            </IconButton>
          </Tooltip>
        </Actions>
      </Bar>
    </>
  );
};

export default DeckControls;
