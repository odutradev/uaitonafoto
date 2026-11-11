import { useMemo, useState } from "react";
import { toast } from "react-toastify";

import {
  copyLogoSvgToClipboard,
  downloadLogoPng,
  downloadLogoSvg,
  getLogoSvgString
} from "@utils/functions/brandAssets";
import createPageContext from "@utils/functions/createPageContext";
import useAction from "@hooks/useAction";
import { brandColors } from "@styles/theme";

import type { AspectRatioOption, LogoBackgroundOption, LogoColorScheme, LogoType } from "@utils/functions/brandAssets";
import type { BrandAnimation } from "@components/logo/types";
import type { UseBrandIdentityPageReturn } from "./types";

const useBrandIdentityPageState = (): UseBrandIdentityPageReturn => {
  const lastUpdated = "Novembro de 2026";
  const runAction = useAction();
  // Estado do Generator de Logos
  const [selectedType, setSelectedType] = useState<LogoType>("horizontal");
  const [selectedScheme, setSelectedScheme] = useState<LogoColorScheme>("light");
  const [selectedBg, setSelectedBg] = useState<LogoBackgroundOption>("transparent");
  const [selectedRatio, setSelectedRatio] = useState<AspectRatioOption>("original");
  const [selectedResolution, setSelectedResolution] = useState<number>(1024);
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const [copiedSvg, setCopiedSvg] = useState<boolean>(false);

  // Estado do Playground de Tipografia
  const [sampleText, setSampleText] = useState("Aponte a câmera, entre na foto e veja ela subir no telão na hora.");

  // Estado de Visualização Geométrica do Símbolo
  const [showGrid, setShowGrid] = useState(false);

  // Estado das Animações
  const [activeAnimKey, setActiveAnimKey] = useState<number>(0);

  // Paleta de Cores Oficial
  const brandPalette = [
    {
      name: "Amarelo Flash",
      role: "Cor primária / O flash da marca",
      hex: brandColors.flashYellow,
      rgb: "rgb(255, 207, 31)",
      token: "--yellow",
      textColor: brandColors.ink,
      description: "O flash e a energia da marca. Usado para fundos, destaques, botões e elementos vivos."
    },
    {
      name: "Tinta",
      role: "Cor estrutural / Texto e símbolo",
      hex: brandColors.ink,
      rgb: "rgb(23, 20, 15)",
      token: "--ink",
      textColor: "#FFFFFF",
      description: "Preto quente e aconchegante. Usado em textos, símbolo, contrastes altos e telão noturno."
    },
    {
      name: "Papel",
      role: "Fundo principal claro",
      hex: brandColors.paper,
      rgb: "rgb(251, 248, 241)",
      token: "--paper",
      textColor: brandColors.ink,
      description: "Substituto orgânico do branco estéril. Transmite sensação tátil e acolhedora."
    },
    {
      name: "Areia",
      role: "Superfície secundária",
      hex: brandColors.sand,
      rgb: "rgb(239, 233, 218)",
      token: "--sand",
      textColor: brandColors.ink,
      description: "Superfícies de cartões de suporte, chips e fundos de baixo contraste."
    },
    {
      name: "Borda Suave",
      role: "Divisões e contornos",
      hex: brandColors.lightBorder,
      rgb: "rgb(231, 225, 210)",
      token: "--border",
      textColor: brandColors.ink,
      description: "Delimitações sutis em cards, inputs e divisores no tema claro."
    },
    {
      name: "Escuro Noturno",
      role: "Fundo Dark Mode",
      hex: brandColors.darkBg,
      rgb: "rgb(18, 16, 12)",
      token: "--dark-bg",
      textColor: "#FFFFFF",
      description: "Base profunda e suave para experiências noturnas e telões ao vivo."
    }
  ];

  const handleCopyColor = (hex: string, label: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedColor(hex);
    toast.success(`Cor ${label} (${hex}) copiada!`);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  const handleDownloadSvg = () => {
    downloadLogoSvg({
      type: selectedType,
      colorScheme: selectedScheme,
      backgroundColor: selectedBg,
      aspectRatio: selectedRatio
    });
    toast.success("SVG baixado com sucesso!");
  };

  const handleDownloadPng = async () => {
    await runAction({
      action: () => {
        toast.info("Gerando imagem em alta resolução...");
        return downloadLogoPng(
          {
            type: selectedType,
            colorScheme: selectedScheme,
            backgroundColor: selectedBg,
            aspectRatio: selectedRatio
          },
          selectedResolution
        );
      },
      toastMessages: { success: `PNG (${selectedResolution}px) baixado com sucesso!`, error: "Erro ao gerar PNG." },
      shouldUseApiError: false
    });
  };

  const handleCopySvgCode = async () => {
    const success = await copyLogoSvgToClipboard({
      type: selectedType,
      colorScheme: selectedScheme,
      backgroundColor: selectedBg,
      aspectRatio: selectedRatio
    });
    if (success) {
      setCopiedSvg(true);
      toast.success("Código SVG copiado para a área de transferência!");
      setTimeout(() => setCopiedSvg(false), 2500);
    } else {
      toast.error("Não foi possível copiar o SVG.");
    }
  };

  // Preview SVG Data URL para renderização ao vivo
  const currentSvgRaw = useMemo(() => {
    return getLogoSvgString({
      type: selectedType,
      colorScheme: selectedScheme,
      backgroundColor: selectedBg,
      aspectRatio: selectedRatio
    });
  }, [selectedType, selectedScheme, selectedBg, selectedRatio]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const animationsList: { name: string; key: BrandAnimation; desc: string }[] = [
    { name: "1. Entrou na foto", key: "enter", desc: "Entrada dinâmica do símbolo com rotação e o ponto pousando." },
    { name: "2. Flash da câmera", key: "flash", desc: "Pulso de luz amarela simulando o disparo instantâneo." },
    { name: "3. Clique do obturador", key: "shutter", desc: "Compressão e disparo elástico do quadro e da lente." },
    { name: "4. Logo Reveal", key: "reveal", desc: "Subida em cascata das palavras uai · To · Na · Foto." },
    { name: "5. Olho curioso", key: "eye", desc: "O ponto amarelo se move e segue interativamente o cursor." },
    { name: "6. Revelação Polaroid", key: "develop", desc: "Efeito de imagem revelando gradualmente no papel." },
    {
      name: "7. Ao Vivo (Pulso)",
      key: "live",
      desc: "Ondas circulares contínuas transmitindo atividade em tempo real."
    },
    { name: "8. Respiração (Idle)", key: "breathe", desc: "Flutuação harmônica suave em estado de repouso." }
  ];

  return {
    lastUpdated,
    selectedType,
    setSelectedType,
    selectedScheme,
    setSelectedScheme,
    selectedBg,
    setSelectedBg,
    selectedRatio,
    setSelectedRatio,
    selectedResolution,
    setSelectedResolution,
    copiedColor,
    copiedSvg,
    sampleText,
    setSampleText,
    showGrid,
    setShowGrid,
    activeAnimKey,
    setActiveAnimKey,
    brandPalette,
    handleCopyColor,
    handleDownloadSvg,
    handleDownloadPng,
    handleCopySvgCode,
    currentSvgRaw,
    scrollToSection,
    animationsList
  };
};

const { PageProvider: BrandIdentityPageProvider, usePage: useBrandIdentityPage } = createPageContext(
  useBrandIdentityPageState,
  "useBrandIdentityPage"
);

export { BrandIdentityPageProvider };
export default useBrandIdentityPage;
