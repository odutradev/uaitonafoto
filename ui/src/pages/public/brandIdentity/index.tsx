import { Alert, Box, Button, ButtonGroup, Chip, Container, Divider, FormControl, FormControlLabel, Grid, InputLabel, MenuItem, Paper, Select, Stack, Switch, TextField, Tooltip, Typography } from '@mui/material'
import { ArrowBack as ArrowBackIcon, Check as CheckIcon, Code as CodeIcon, ContentCopy as ContentCopyIcon, Download as DownloadIcon, Image as ImageIcon, PlayArrow as PlayArrowIcon, Visibility as VisibilityIcon } from '@mui/icons-material'
import { Link as RouterLink } from 'react-router-dom'

import Logo from '@components/logo'
import ThemeToggle from '@components/themeToggle'
import { brandColors } from '@styles/theme'
import { backgroundColors, colorSchemes, downloadLogoPng, downloadLogoSvg } from '@utils/functions/brandAssets'

import { badgeStyles, cardStyles, colorBlockStyles, footerBoxStyles, headerBoxStyles, headerContainerStyles, heroBoxStyles, heroLeadStyles, heroTitleStyles, pageWrapperStyles, previewCheckerboardStyles, sectionLeadStyles, sectionNavStyles, sectionTitleStyles } from './styles'
import useBrandIdentityPage, { BrandIdentityPageProvider } from './hook'

import type { AspectRatioOption, LogoBackgroundOption, LogoColorScheme, LogoType } from '@utils/functions/brandAssets'

const BrandIdentityContent = () => {
  const {
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
  } = useBrandIdentityPage()

  return (
    <Box sx={pageWrapperStyles}>
      {/* Header Fixo */}
      <Box component="header" sx={headerBoxStyles}>
        <Container maxWidth="lg" sx={headerContainerStyles}>
          <RouterLink to="/" style={{ textDecoration: 'none', display: 'inline-flex' }}>
            <Logo size="medium" variant="auto" animation="breathe" />
          </RouterLink>

          <Stack direction="row" spacing={1.5} alignItems="center">
            <ThemeToggle />
            <Button
              variant="contained"
              color="primary"
              size="small"
              startIcon={<DownloadIcon />}
              onClick={() => scrollToSection('downloads')}
              sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
            >
              Baixar Logos
            </Button>
            <Button
              component={RouterLink}
              to="/"
              variant="outlined"
              size="small"
              startIcon={<ArrowBackIcon />}
            >
              Início
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* Hero Section */}
      <Box component="section" sx={heroBoxStyles}>
        <Container maxWidth="lg">
          <Box sx={badgeStyles}>
            <VisibilityIcon sx={{ fontSize: 16 }} />
            Manual de Marca • Identidade Visual Oficial
          </Box>
          <Typography variant="h1" component="h1" sx={heroTitleStyles}>
            Identidade Visual do{' '}
            <Box component="span" sx={{ color: brandColors.flashYellow, bgcolor: brandColors.ink, px: 1.5, py: 0.2, borderRadius: 2 }}>
              uaiToNaFoto
            </Box>
          </Typography>
          <Typography variant="body1" sx={heroLeadStyles}>
            O guia definitivo de design, geometria, cores, tipografia, animações e assets vetoriais da marca. Criado para manter a consistência, a vibração e o calor humano em todas as telas e impressos.
          </Typography>

          {/* Navegação Rápida entre Seções */}
          <Box sx={sectionNavStyles}>
            <Button size="small" variant="outlined" onClick={() => scrollToSection('concept')}>
              Conceito
            </Button>
            <Button size="small" variant="outlined" onClick={() => scrollToSection('symbol')}>
              O Símbolo
            </Button>
            <Button size="small" variant="outlined" onClick={() => scrollToSection('logo')}>
              O Logotipo
            </Button>
            <Button size="small" variant="outlined" onClick={() => scrollToSection('colors')}>
              Cores & Tokens
            </Button>
            <Button size="small" variant="outlined" onClick={() => scrollToSection('typography')}>
              Tipografia
            </Button>
            <Button size="small" variant="outlined" onClick={() => scrollToSection('animations')}>
              Animações
            </Button>
            <Button size="small" variant="outlined" onClick={() => scrollToSection('applications')}>
              Aplicações
            </Button>
            <Button size="small" variant="contained" color="primary" onClick={() => scrollToSection('downloads')}>
              Central de Download
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Conteúdo Principal */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
        <Stack spacing={{ xs: 8, md: 12 }}>
          {/* 1. O CONCEITO */}
          <Box id="concept" component="section">
            <Typography variant="h2" component="h2" sx={sectionTitleStyles}>
              1. O Conceito e Essência
            </Typography>
            <Typography variant="body1" sx={sectionLeadStyles}>
              uaiToNaFoto nasce do encontro entre a hospitalidade e informalidade acolhedora do &ldquo;uai&rdquo; mineiro com a euforia e a celebração instantânea de quem vê sua foto subir no telão da festa em tempo real.
            </Typography>

            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 4 }}>
                <Paper elevation={0} sx={cardStyles}>
                  <Typography variant="h5" sx={{ mb: 1.5, fontWeight: 800 }}>
                    Calor & Pertencimento
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    Não é sobre tecnologia fria ou galerias esquecidas. É sobre o convidado se sentir parte essencial do evento. A marca acolhe, diverte e junta as pessoas.
                  </Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <Paper elevation={0} sx={cardStyles}>
                  <Typography variant="h5" sx={{ mb: 1.5, fontWeight: 800 }}>
                    Instantaneidade Sem Atrito
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    Aponte a câmera do celular para o QR Code da mesa, tire a selfie e veja a mágica acontecer instantaneamente no telão. Sem login pesado, sem aplicativo para instalar.
                  </Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <Paper elevation={0} sx={cardStyles}>
                  <Typography variant="h5" sx={{ mb: 1.5, fontWeight: 800 }}>
                    Energia & Elegância
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    A paleta contrasta a solidez elegante da Tinta (#17140F) e do Papel (#FBF8F1) com o brilho vibrante e contagiante do Amarelo Flash (#FFCF1F).
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Box>

          <Divider />

          {/* 2. O SÍMBOLO & GEOMETRIA */}
          <Box id="symbol" component="section">
            <Typography variant="h2" component="h2" sx={sectionTitleStyles}>
              2. Anatomia e Geometria do Símbolo
            </Typography>
            <Typography variant="body1" sx={sectionLeadStyles}>
              &ldquo;Um quadro e uma pessoa dentro dele. O ponto fora do centro é o convidado entrando na foto.&rdquo;
            </Typography>

            <Grid container spacing={4} alignItems="center">
              <Grid size={{ xs: 12, md: 6 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: (theme) => (theme.palette.mode === 'dark' ? brandColors.darkPaper : '#FFFFFF'),
                    border: 1,
                    borderColor: 'divider',
                    borderRadius: 4,
                    minHeight: 340,
                    position: 'relative'
                  }}
                >
                  <Box sx={{ position: 'relative', width: 200, height: 200, display: 'grid', placeItems: 'center' }}>
                    <svg viewBox="0 0 100 100" width="100%" height="100%">
                      {/* Grid de Construção */}
                      {showGrid && (
                        <g opacity="0.45" stroke="#FFCF1F" strokeWidth="0.6" strokeDasharray="2 2">
                          <rect x="4" y="4" width="92" height="92" fill="none" stroke="#5E584C" strokeWidth="0.8" />
                          <line x1="50" y1="0" x2="50" y2="100" />
                          <line x1="0" y1="50" x2="100" y2="50" />
                          <circle cx="50" cy="50" r="46" fill="none" />
                          {/* Coordenadas do ponto central do círculo */}
                          <line x1="59" y1="0" x2="59" y2="100" stroke="#FFCF1F" strokeWidth="1" />
                          <line x1="0" y1="42" x2="100" y2="42" stroke="#FFCF1F" strokeWidth="1" />
                        </g>
                      )}
                      {/* Elementos Reais */}
                      <rect x="4" y="4" width="92" height="92" rx="28" fill={brandColors.ink} />
                      <circle cx="59" cy="42" r="18" fill={brandColors.flashYellow} />
                      {showGrid && (
                        <circle cx="59" cy="42" r="2" fill="#FFFFFF" />
                      )}
                    </svg>
                  </Box>

                  <FormControlLabel
                    control={
                      <Switch
                        checked={showGrid}
                        onChange={(e) => setShowGrid(e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Exibir guias de proporção e grid (cx: 59, cy: 42, r: 18)"
                    sx={{ mt: 3 }}
                  />
                </Paper>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Stack spacing={2.5}>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
                      A Moldura (O Enquadramento)
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                      Um quadrado com dimensões de 92×92 unidades e cantos arredondados contínuos com raio de <strong>28px</strong>. Representa o enquadramento fotográfico, o display e a tela do telão.
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
                      O Ponto (O Convidado & O Flash)
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                      Um círculo perfeito com raio <strong>r=18</strong>. Está propositalmente <strong>descentralizado</strong> (coordenadas cx=59, cy=42). Essa assimetria intencional quebra a rigidez e simboliza o convidado chegando, entrando na cena no exato instante do clique.
                    </Typography>
                  </Box>
                  <Alert severity="info" sx={{ borderRadius: 2 }}>
                    <strong>Regra Áurea:</strong> Nunca centralize o ponto amarelo dentro da moldura. Sua posição descentralizada é a assinatura visual inconfundível da marca.
                  </Alert>
                </Stack>
              </Grid>
            </Grid>
          </Box>

          <Divider />

          {/* 3. O LOGOTIPO & CLEARSPACE */}
          <Box id="logo" component="section">
            <Typography variant="h2" component="h2" sx={sectionTitleStyles}>
              3. O Logotipo e Variações Oficiais
            </Typography>
            <Typography variant="body1" sx={sectionLeadStyles}>
              A assinatura tipográfica utiliza a fonte <strong>Bricolage Grotesque ExtraBold (800)</strong> com espaçamento refinado (-0.045em) e o jogo de maiúsculas no estilo camelCase: <strong>uaiToNaFoto</strong>.
            </Typography>

            <Grid container spacing={3}>
              {/* Variação Horizontal */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Paper elevation={0} sx={cardStyles}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
                    Versão Principal • Horizontal
                  </Typography>
                  <Box
                    sx={{
                      p: 4,
                      bgcolor: brandColors.paper,
                      borderRadius: 2.5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minHeight: 140,
                      border: 1,
                      borderColor: brandColors.lightBorder,
                      mb: 2
                    }}
                  >
                    <Logo size="large" variant="light" display="both" />
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Aplicação preferencial para cabeçalhos, sites, assinaturas de e-mail e peças horizontais.
                  </Typography>
                </Paper>
              </Grid>

              {/* Variação Noturna / Invertida */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Paper elevation={0} sx={cardStyles}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
                    Versão Noturna • Alto Contraste
                  </Typography>
                  <Box
                    sx={{
                      p: 4,
                      bgcolor: brandColors.ink,
                      borderRadius: 2.5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minHeight: 140,
                      border: 1,
                      borderColor: '#2E2A22',
                      mb: 2
                    }}
                  >
                    <Logo size="large" variant="dark" display="both" />
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Ideal para telões ao vivo no escuro, fundos pretos e ambientes com pouca luz.
                  </Typography>
                </Paper>
              </Grid>

              {/* Variação Vertical / Empilhada */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Paper elevation={0} sx={cardStyles}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
                    Versão Empilhada • Vertical
                  </Typography>
                  <Box
                    sx={{
                      p: 4,
                      bgcolor: brandColors.sand,
                      borderRadius: 2.5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minHeight: 180,
                      mb: 2
                    }}
                  >
                    <Stack spacing={1.5} alignItems="center">
                      <svg width="64" height="64" viewBox="0 0 100 100">
                        <rect x="4" y="4" width="92" height="92" rx="28" fill={brandColors.ink} />
                        <circle cx="59" cy="42" r="18" fill={brandColors.flashYellow} />
                      </svg>
                      <Typography
                        sx={{
                          fontFamily: "'Bricolage Grotesque', sans-serif",
                          fontWeight: 800,
                          fontSize: '1.6rem',
                          letterSpacing: '-0.045em',
                          color: brandColors.ink
                        }}
                      >
                        uaiToNaFoto
                      </Typography>
                    </Stack>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Indicada para cartões de mesa verticais, totens, crachás e banners estreitos.
                  </Typography>
                </Paper>
              </Grid>

              {/* Símbolo Isolado / Ícone */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Paper elevation={0} sx={cardStyles}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
                    Símbolo Isolado • Ícone & Favicon
                  </Typography>
                  <Box
                    sx={{
                      p: 4,
                      bgcolor: brandColors.paper,
                      borderRadius: 2.5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 3,
                      minHeight: 180,
                      border: 1,
                      borderColor: brandColors.lightBorder,
                      mb: 2
                    }}
                  >
                    <Logo size="large" variant="light" display="symbol" />
                    <Box sx={{ p: 2, bgcolor: brandColors.flashYellow, borderRadius: 3 }}>
                      <Logo size="medium" variant="light" display="symbol" />
                    </Box>
                    <Box sx={{ p: 2, bgcolor: brandColors.ink, borderRadius: 3 }}>
                      <Logo size="medium" variant="dark" display="symbol" />
                    </Box>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Uso exclusivo para fotos de perfil, favicon de navegador, botões flutuantes e app icon.
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Box>

          <Divider />

          {/* 4. PALETA DE CORES */}
          <Box id="colors" component="section">
            <Typography variant="h2" component="h2" sx={sectionTitleStyles}>
              4. Paleta de Cores & Tokens
            </Typography>
            <Typography variant="body1" sx={sectionLeadStyles}>
              Clique em qualquer amostra de cor abaixo para copiar instantaneamente o código HEX para o seu clipboard.
            </Typography>

            <Grid container spacing={3}>
              {brandPalette.map((col) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={col.hex}>
                  <Paper elevation={0} sx={cardStyles}>
                    <Tooltip title="Clique para copiar o HEX" arrow>
                      <Box
                        sx={colorBlockStyles(col.hex)}
                        onClick={() => handleCopyColor(col.hex, col.name)}
                      >
                        <Stack direction="row" justifyContent="space-between" alignItems="center" width="100%">
                          <Typography sx={{ fontWeight: 800, color: col.textColor, fontSize: '0.95rem' }}>
                            {col.hex}
                          </Typography>
                          <Chip
                            size="small"
                            icon={copiedColor === col.hex ? <CheckIcon sx={{ '&&': { color: 'inherit' } }} /> : <ContentCopyIcon sx={{ '&&': { color: 'inherit' } }} />}
                            label={copiedColor === col.hex ? 'Copiado!' : 'Copiar'}
                            sx={{
                              bgcolor: 'rgba(0, 0, 0, 0.12)',
                              color: col.textColor,
                              fontWeight: 700,
                              fontSize: '0.75rem'
                            }}
                          />
                        </Stack>
                      </Box>
                    </Tooltip>
                    <Box sx={{ pt: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 800, mb: 0.5 }}>
                        {col.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1, fontFamily: 'monospace' }}>
                        {col.rgb} • {col.token}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.88rem' }}>
                        {col.description}
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>

          <Divider />

          {/* 5. TIPOGRAFIA */}
          <Box id="typography" component="section">
            <Typography variant="h2" component="h2" sx={sectionTitleStyles}>
              5. Tipografia do Sistema
            </Typography>
            <Typography variant="body1" sx={sectionLeadStyles}>
              Dois pilares tipográficos formam o equilíbrio visual: a expressividade viva da Bricolage Grotesque e a clareza amigável da DM Sans.
            </Typography>

            <Grid container spacing={4}>
              {/* Bricolage Grotesque */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Paper elevation={0} sx={cardStyles}>
                  <Chip label="Títulos & Logotipo" color="primary" size="small" sx={{ alignSelf: 'flex-start', mb: 2, fontWeight: 800 }} />
                  <Typography variant="h4" sx={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, mb: 1 }}>
                    Bricolage Grotesque
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Pesos utilizados: <strong>ExtraBold (800)</strong> e <strong>Bold (700)</strong>. Caracterizada por ritmo enérgico, tracking negativo (-0.045em) e curvas humanistas.
                  </Typography>
                  <Box sx={{ p: 3, bgcolor: 'background.default', borderRadius: 2.5, mb: 2 }}>
                    <Typography
                      sx={{
                        fontFamily: "'Bricolage Grotesque', sans-serif",
                        fontWeight: 800,
                        fontSize: { xs: '2rem', sm: '2.5rem' },
                        letterSpacing: '-0.045em',
                        lineHeight: 1.1,
                        color: 'text.primary'
                      }}
                    >
                      {sampleText}
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700, fontSize: '0.9rem' }}>
                    Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm Nn Oo Pp Qq Rr Ss Tt Uu Vv Ww Xx Yy Zz 0123456789
                  </Typography>
                </Paper>
              </Grid>

              {/* DM Sans */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Paper elevation={0} sx={cardStyles}>
                  <Chip label="Texto & Interface" variant="outlined" size="small" sx={{ alignSelf: 'flex-start', mb: 2, fontWeight: 700 }} />
                  <Typography variant="h4" sx={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, mb: 1 }}>
                    DM Sans
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Pesos utilizados: <strong>Regular (400)</strong>, <strong>Medium (500)</strong> e <strong>Bold (700)</strong>. Geometria moderna, neutra e de altíssima legibilidade para celulares e telões.
                  </Typography>
                  <Box sx={{ p: 3, bgcolor: 'background.default', borderRadius: 2.5, mb: 2 }}>
                    <Typography
                      sx={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontWeight: 400,
                        fontSize: '1.15rem',
                        lineHeight: 1.6,
                        color: 'text.primary'
                      }}
                    >
                      {sampleText}
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.9rem' }}>
                    Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm Nn Oo Pp Qq Rr Ss Tt Uu Vv Ww Xx Yy Zz 0123456789
                  </Typography>
                </Paper>
              </Grid>

              {/* Testador Interativo */}
              <Grid size={{ xs: 12 }}>
                <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: 1, borderColor: 'divider' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1 }}>
                    Playground Tipográfico: Digite sua própria frase para testar
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    value={sampleText}
                    onChange={(e) => setSampleText(e.target.value)}
                    placeholder="Digite uma frase para testar as fontes..."
                  />
                </Paper>
              </Grid>
            </Grid>
          </Box>

          <Divider />

          {/* 6. ANIMAÇÕES DA MARCA */}
          <Box id="animations" component="section">
            <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} sx={{ mb: 2 }}>
              <Box>
                <Typography variant="h2" component="h2" sx={sectionTitleStyles}>
                  6. Animações e Comportamento
                </Typography>
                <Typography variant="body1" sx={sectionLeadStyles}>
                  A marca possui 8 animações proprietárias que dão vida à experiência visual no site, no app do convidado e no telão ao vivo.
                </Typography>
              </Box>
              <Button
                variant="outlined"
                startIcon={<PlayArrowIcon />}
                onClick={() => setActiveAnimKey((prev) => prev + 1)}
                sx={{ mb: { xs: 3, sm: 0 }, alignSelf: { xs: 'flex-start', sm: 'auto' } }}
              >
                Reiniciar Animações
              </Button>
            </Stack>

            <Grid container spacing={3} key={activeAnimKey}>
              {animationsList.map((item) => (
                <Grid size={{ xs: 12, sm: 6, md: 3 }} key={item.key}>
                  <Paper elevation={0} sx={cardStyles}>
                    <Box
                      sx={{
                        height: 140,
                        bgcolor: brandColors.sand,
                        borderRadius: 2.5,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 2,
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                    >
                      <Logo
                        size="medium"
                        variant="light"
                        display={item.key === 'reveal' ? 'both' : 'symbol'}
                        animation={item.key}
                        play
                        interactive
                      />
                    </Box>
                    <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 800, mb: 0.5 }}>
                      {item.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem', lineHeight: 1.5 }}>
                      {item.desc}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>

          <Divider />

          {/* 7. APLICAÇÕES NO MUNDO REAL */}
          <Box id="applications" component="section">
            <Typography variant="h2" component="h2" sx={sectionTitleStyles}>
              7. Aplicações Práticas
            </Typography>
            <Typography variant="body1" sx={sectionLeadStyles}>
              Como a identidade visual se materializa nos principais pontos de contato com o usuário e os convidados.
            </Typography>

            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 4 }}>
                <Paper elevation={0} sx={cardStyles}>
                  <Box
                    sx={{
                      height: 160,
                      bgcolor: brandColors.ink,
                      color: brandColors.flashYellow,
                      borderRadius: 2.5,
                      p: 3,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      mb: 2,
                      border: 1,
                      borderColor: '#383227'
                    }}
                  >
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Logo size="small" variant="dark" display="both" />
                      <Chip label="AO VIVO" size="small" sx={{ bgcolor: '#FF334B', color: '#FFFFFF', fontWeight: 800, fontSize: '0.7rem' }} />
                    </Stack>
                    <Typography sx={{ color: '#FBF8F1', fontSize: '0.9rem' }}>
                      Fotos subindo ao vivo na tela grande com feed dinâmico e transições elegantes.
                    </Typography>
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 800, mb: 0.5 }}>
                    Telão do Evento (HD / 4K)
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Contraste máximo, fundo noturno para evitar reflexos na festa e animação constante de pulso ao vivo.
                  </Typography>
                </Paper>
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <Paper elevation={0} sx={cardStyles}>
                  <Box
                    sx={{
                      height: 160,
                      bgcolor: brandColors.paper,
                      borderRadius: 2.5,
                      p: 3,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      mb: 2,
                      border: 1,
                      borderColor: brandColors.lightBorder
                    }}
                  >
                    <Logo size="small" variant="light" display="both" />
                    <Button variant="contained" color="primary" fullWidth size="small">
                      Tirar Foto & Subir
                    </Button>
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 800, mb: 0.5 }}>
                    Web App do Convidado
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Interface leve no celular do convidado, foco no botão de disparo e velocidade instantânea de upload.
                  </Typography>
                </Paper>
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <Paper elevation={0} sx={cardStyles}>
                  <Box
                    sx={{
                      height: 160,
                      bgcolor: brandColors.sand,
                      borderRadius: 2.5,
                      p: 3,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 1.5,
                      mb: 2
                    }}
                  >
                    <Typography sx={{ fontFamily: "'Bricolage Grotesque'", fontWeight: 800, fontSize: '1.1rem', color: brandColors.ink }}>
                      Aponte e participe!
                    </Typography>
                    <Box sx={{ width: 64, height: 64, bgcolor: '#FFFFFF', p: 1, borderRadius: 2, display: 'grid', placeItems: 'center' }}>
                      <Logo size="small" variant="light" display="symbol" />
                    </Box>
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 800, mb: 0.5 }}>
                    Cartão de Mesa & Display Impresso
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Peças de acrílico ou papel couché com QR Code de alta precisão colocadas nas mesas dos convidados.
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Box>

          <Divider />

          {/* 8. CENTRAL AVANÇADA DE DOWNLOAD (STUDIO) */}
          <Box id="downloads" component="section">
            <Typography variant="h2" component="h2" sx={sectionTitleStyles}>
              8. Central de Download de Logos
            </Typography>
            <Typography variant="body1" sx={sectionLeadStyles}>
              Gere e baixe qualquer versão da logo em proporções, cores, temas e formatos vetoriais (SVG) e rasterizados de alta resolução (PNG).
            </Typography>

            <Grid container spacing={4}>
              {/* Controles de Configuração */}
              <Grid size={{ xs: 12, lg: 5 }}>
                <Paper elevation={0} sx={{ p: { xs: 3, sm: 4 }, borderRadius: 3.5, border: 1, borderColor: 'divider' }}>
                  <Typography variant="h5" sx={{ fontWeight: 800, mb: 3 }}>
                    Configurar Asset
                  </Typography>

                  <Stack spacing={3}>
                    {/* 1. Tipo de Logo */}
                    <FormControl fullWidth size="small">
                      <InputLabel id="logo-type-label">Tipo de Logo</InputLabel>
                      <Select
                        labelId="logo-type-label"
                        value={selectedType}
                        label="Tipo de Logo"
                        onChange={(e) => setSelectedType(e.target.value as LogoType)}
                      >
                        <MenuItem value="horizontal">Horizontal Completa (Símbolo + Texto)</MenuItem>
                        <MenuItem value="vertical">Vertical / Empilhada (Símbolo + Texto)</MenuItem>
                        <MenuItem value="symbol">Apenas Símbolo (Moldura + Ponto)</MenuItem>
                        <MenuItem value="wordmark">Apenas Tipografia (uaiToNaFoto)</MenuItem>
                        <MenuItem value="favicon">Favicon / App Icon (1:1)</MenuItem>
                      </Select>
                    </FormControl>

                    {/* 2. Cores do Logo */}
                    <FormControl fullWidth size="small">
                      <InputLabel id="logo-color-label">Paleta de Cores</InputLabel>
                      <Select
                        labelId="logo-color-label"
                        value={selectedScheme}
                        label="Paleta de Cores"
                        onChange={(e) => setSelectedScheme(e.target.value as LogoColorScheme)}
                      >
                        {(Object.keys(colorSchemes) as LogoColorScheme[]).map((key) => (
                          <MenuItem value={key} key={key}>
                            {colorSchemes[key].name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    {/* 3. Fundo do Arquivo */}
                    <FormControl fullWidth size="small">
                      <InputLabel id="logo-bg-label">Cor de Fundo</InputLabel>
                      <Select
                        labelId="logo-bg-label"
                        value={selectedBg}
                        label="Cor de Fundo"
                        onChange={(e) => setSelectedBg(e.target.value as LogoBackgroundOption)}
                      >
                        {(Object.keys(backgroundColors) as LogoBackgroundOption[]).map((key) => (
                          <MenuItem value={key} key={key}>
                            {backgroundColors[key].name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    {/* 4. Proporção */}
                    <FormControl fullWidth size="small">
                      <InputLabel id="logo-ratio-label">Proporção (Aspect Ratio)</InputLabel>
                      <Select
                        labelId="logo-ratio-label"
                        value={selectedRatio}
                        label="Proporção (Aspect Ratio)"
                        onChange={(e) => setSelectedRatio(e.target.value as AspectRatioOption)}
                      >
                        <MenuItem value="original">Proporção Original</MenuItem>
                        <MenuItem value="1:1">Quadrado 1:1 (Avatares, App Icon)</MenuItem>
                        <MenuItem value="16:9">Paisagem 16:9 (Telão, Banners)</MenuItem>
                        <MenuItem value="9:16">Story 9:16 (Redes Sociais, Mobile)</MenuItem>
                        <MenuItem value="4:5">Post 4:5 (Feed Instagram)</MenuItem>
                      </Select>
                    </FormControl>

                    {/* 5. Resolução PNG */}
                    <FormControl fullWidth size="small">
                      <InputLabel id="logo-res-label">Resolução do PNG</InputLabel>
                      <Select
                        labelId="logo-res-label"
                        value={selectedResolution}
                        label="Resolução do PNG"
                        onChange={(e) => setSelectedResolution(Number(e.target.value))}
                      >
                        <MenuItem value={512}>512 px (1x Web Padrão)</MenuItem>
                        <MenuItem value={1024}>1024 px (2x Retina HD)</MenuItem>
                        <MenuItem value={2048}>2048 px (4x Ultra HD)</MenuItem>
                        <MenuItem value={4096}>4096 px (8x Impressão Gráfica)</MenuItem>
                      </Select>
                    </FormControl>
                  </Stack>
                </Paper>
              </Grid>

              {/* Prévia em Tempo Real & Download */}
              <Grid size={{ xs: 12, lg: 7 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 3, sm: 4 },
                    borderRadius: 3.5,
                    border: 1,
                    borderColor: 'divider',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%'
                  }}
                >
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                    <Typography variant="h5" sx={{ fontWeight: 800 }}>
                      Prévia em Tempo Real
                    </Typography>
                    <Chip
                      size="small"
                      label={selectedBg === 'transparent' ? 'Fundo Transparente' : `Fundo ${selectedBg}`}
                      variant="outlined"
                    />
                  </Stack>

                  {/* Quadro de Pré-visualização */}
                  <Box sx={previewCheckerboardStyles}>
                    <Box
                      sx={{
                        width: '100%',
                        maxWidth: '90%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.06))',
                        '& svg': {
                          maxWidth: '100%',
                          height: 'auto',
                          maxHeight: 240,
                          display: 'block'
                        }
                      }}
                      dangerouslySetInnerHTML={{ __html: currentSvgRaw }}
                    />
                  </Box>

                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2, mb: 3, fontSize: '0.85rem' }}>
                    {colorSchemes[selectedScheme].description} O arquivo exportado respeita a proporção {selectedRatio} e o fundo selecionado.
                  </Typography>

                  {/* Botões de Ação de Download */}
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 'auto' }}>
                    <Button
                      variant="contained"
                      color="primary"
                      size="large"
                      startIcon={<DownloadIcon />}
                      onClick={handleDownloadSvg}
                      fullWidth
                    >
                      Baixar SVG (Vetorial)
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      size="large"
                      startIcon={<ImageIcon />}
                      onClick={handleDownloadPng}
                      fullWidth
                    >
                      Baixar PNG ({selectedResolution}px)
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      startIcon={copiedSvg ? <CheckIcon /> : <CodeIcon />}
                      onClick={handleCopySvgCode}
                      sx={{ minWidth: { sm: '140px' } }}
                    >
                      {copiedSvg ? 'Copiado!' : 'Copiar SVG'}
                    </Button>
                  </Stack>
                </Paper>
              </Grid>
            </Grid>

            {/* Quick Kit (Download Imediato em 1 Clique) */}
            <Box sx={{ mt: 6 }}>
              <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, fontSize: '1.5rem' }}>
                Kit de Download Rápido (Arquivos Prontos)
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Acesso direto aos assets mais populares em um só clique, sem precisar configurar nada:
              </Typography>

              <Grid container spacing={2.5}>
                {/* 1. Logo Claro */}
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, border: 1, borderColor: 'divider' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 0.5 }}>
                      Logo Oficial Claro (Padrão)
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                      Tinta sobre transparente • Ideal para web e peças claras
                    </Typography>
                    <ButtonGroup fullWidth size="small" variant="outlined">
                      <Button onClick={() => downloadLogoSvg({ type: 'horizontal', colorScheme: 'light' })}>
                        SVG
                      </Button>
                      <Button onClick={() => downloadLogoPng({ type: 'horizontal', colorScheme: 'light' }, 2048)}>
                        PNG (2048px)
                      </Button>
                    </ButtonGroup>
                  </Paper>
                </Grid>

                {/* 2. Logo Escuro */}
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, border: 1, borderColor: 'divider' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 0.5 }}>
                      Logo Oficial Escuro (Invertido)
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                      Amarelo sobre transparente • Ideal para telão e dark mode
                    </Typography>
                    <ButtonGroup fullWidth size="small" variant="outlined">
                      <Button onClick={() => downloadLogoSvg({ type: 'horizontal', colorScheme: 'dark' })}>
                        SVG
                      </Button>
                      <Button onClick={() => downloadLogoPng({ type: 'horizontal', colorScheme: 'dark' }, 2048)}>
                        PNG (2048px)
                      </Button>
                    </ButtonGroup>
                  </Paper>
                </Grid>

                {/* 3. Símbolo Claro */}
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, border: 1, borderColor: 'divider' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 0.5 }}>
                      Símbolo Oficial Claro
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                      Ícone 1:1 • Perfeito para avatares e redes sociais
                    </Typography>
                    <ButtonGroup fullWidth size="small" variant="outlined">
                      <Button onClick={() => downloadLogoSvg({ type: 'symbol', colorScheme: 'light' })}>
                        SVG
                      </Button>
                      <Button onClick={() => downloadLogoPng({ type: 'symbol', colorScheme: 'light' }, 1024)}>
                        PNG (1024px)
                      </Button>
                    </ButtonGroup>
                  </Paper>
                </Grid>

                {/* 4. Símbolo Escuro */}
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, border: 1, borderColor: 'divider' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 0.5 }}>
                      Símbolo Oficial Escuro
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                      Amarelo com ponto preto • Fundo transparente
                    </Typography>
                    <ButtonGroup fullWidth size="small" variant="outlined">
                      <Button onClick={() => downloadLogoSvg({ type: 'symbol', colorScheme: 'dark' })}>
                        SVG
                      </Button>
                      <Button onClick={() => downloadLogoPng({ type: 'symbol', colorScheme: 'dark' }, 1024)}>
                        PNG (1024px)
                      </Button>
                    </ButtonGroup>
                  </Paper>
                </Grid>

                {/* 5. Logo Monocromático Branco */}
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, border: 1, borderColor: 'divider' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 0.5 }}>
                      Monocromático Branco (100% Branco)
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                      Marca d&apos;água para fotos, vídeos e estampas
                    </Typography>
                    <ButtonGroup fullWidth size="small" variant="outlined">
                      <Button onClick={() => downloadLogoSvg({ type: 'horizontal', colorScheme: 'mono-white' })}>
                        SVG
                      </Button>
                      <Button onClick={() => downloadLogoPng({ type: 'horizontal', colorScheme: 'mono-white' }, 2048)}>
                        PNG (2048px)
                      </Button>
                    </ButtonGroup>
                  </Paper>
                </Grid>

                {/* 6. Logo Monocromático Preto */}
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, border: 1, borderColor: 'divider' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 0.5 }}>
                      Monocromático Preto (100% Tinta)
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                      Para carimbos, documentos e impressões 1 cor
                    </Typography>
                    <ButtonGroup fullWidth size="small" variant="outlined">
                      <Button onClick={() => downloadLogoSvg({ type: 'horizontal', colorScheme: 'mono-black' })}>
                        SVG
                      </Button>
                      <Button onClick={() => downloadLogoPng({ type: 'horizontal', colorScheme: 'mono-black' }, 2048)}>
                        PNG (2048px)
                      </Button>
                    </ButtonGroup>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Stack>
      </Container>

      {/* Footer */}
      <Box component="footer" sx={footerBoxStyles}>
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Identidade Visual • uaiToNaFoto • Versão atualizada em {lastUpdated}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            © {new Date().getFullYear()} uaiToNaFoto • Lite Technology LTDA • CNPJ 55.717.105/0001-58
          </Typography>
        </Container>
      </Box>
    </Box>
  )
}

export const BrandIdentity = () => (
  <BrandIdentityPageProvider>
    <BrandIdentityContent />
  </BrandIdentityPageProvider>
)

export default BrandIdentity
