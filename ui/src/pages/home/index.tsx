import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Stack,
  Typography
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import {
  ArrowForward as ArrowForwardIcon,
  ConnectedTv as ConnectedTvIcon,
  Favorite as FavoriteIcon,
  PhotoCamera as PhotoCameraIcon,
  QrCode2 as QrCodeIcon
} from '@mui/icons-material'
import { Link as RouterLink } from 'react-router-dom'

import { BrandSymbol, Logo, ThemeToggle } from '@components/index'
import { brandColors } from '@theme/theme'

const Home = () => {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
      {/* ─── NAVBAR ─── */}
      <Box
        component="header"
        sx={{
          py: 2,
          px: { xs: 2, md: 5 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: 1,
          borderColor: 'divider',
          bgcolor: isDark ? 'rgba(18, 16, 12, 0.85)' : 'rgba(251, 248, 241, 0.85)',
          position: 'sticky',
          top: 0,
          zIndex: 10,
          backdropFilter: 'blur(10px)'
        }}
      >
        <RouterLink to="/" style={{ textDecoration: 'none' }}>
          <Logo size="medium" variant="auto" />
        </RouterLink>

        <Stack direction="row" spacing={1.5} alignItems="center">
          <Box
            sx={{
              display: { xs: 'none', sm: 'flex' },
              alignItems: 'center',
              gap: 1,
              fontSize: '0.8125rem',
              fontWeight: 800,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: isDark ? brandColors.amareloFlash : brandColors.tinta,
              px: 1.5,
              py: 0.5,
              borderRadius: '9999px',
              bgcolor: isDark ? 'rgba(255, 207, 31, 0.1)' : 'rgba(23, 20, 15, 0.05)'
            }}
          >
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: isDark ? brandColors.amareloFlash : brandColors.tinta
              }}
            />
            <span>ao vivo</span>
          </Box>

          <ThemeToggle />

          <Button
            component={RouterLink}
            to="/login"
            variant="contained"
            color="primary"
            size="medium"
            endIcon={<ArrowForwardIcon />}
            sx={{
              px: 2.5,
              fontWeight: 800,
              fontSize: '0.9375rem'
            }}
          >
            Entrar
          </Button>
        </Stack>
      </Box>

      {/* ─── HERO SECTION ─── */}
      <Container maxWidth="lg" sx={{ pt: { xs: 6, md: 10 }, pb: { xs: 6, md: 9 } }}>
        <Stack spacing={3.5} alignItems="center" textAlign="center" maxWidth="860px" mx="auto">
          <Chip
            icon={
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: isDark ? brandColors.amareloFlash : brandColors.tinta,
                  ml: 1
                }}
              />
            }
            label="compartilhamento de fotos em tempo real"
            sx={{
              bgcolor: isDark ? brandColors.darkSurface : brandColors.areia,
              color: isDark ? brandColors.amareloFlash : brandColors.tinta,
              fontWeight: 700,
              fontSize: '0.875rem',
              letterSpacing: '0.02em',
              py: 2.2,
              px: 1,
              borderRadius: '9999px',
              border: 1,
              borderColor: 'divider'
            }}
          />

          <Typography
            variant="h1"
            component="h1"
            sx={{
              fontSize: { xs: '2.5rem', sm: '3.75rem', md: '4.75rem' },
              letterSpacing: '-0.05em',
              lineHeight: { xs: 1.08, md: 0.98 },
              color: 'text.primary'
            }}
          >
            aponte a câmera, entre na foto e veja ela subir no telão.
          </Typography>

          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: '1.125rem', md: '1.3rem' },
              lineHeight: 1.55,
              color: 'text.secondary',
              maxWidth: '680px'
            }}
          >
            A experiência definitiva para casamentos, festas e eventos corporativos.
            Zero fricção: o convidado escaneia o QR Code, tira a foto e ela vai pro telão na hora.
            Sem aplicativo e sem cadastro.
          </Typography>

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            sx={{ pt: 1.5, width: { xs: '100%', sm: 'auto' } }}
          >
            <Button
              component={RouterLink}
              to="/login"
              variant="contained"
              color="primary"
              size="large"
              sx={{
                height: 56,
                px: 4,
                fontSize: '1.125rem',
                fontWeight: 800
              }}
              endIcon={<ArrowForwardIcon />}
            >
              Criar meu evento
            </Button>

            <Button
              component={RouterLink}
              to="/login"
              variant="outlined"
              size="large"
              sx={{
                height: 56,
                px: 4,
                fontSize: '1.125rem',
                fontWeight: 700
              }}
            >
              Acessar plataforma
            </Button>
          </Stack>
        </Stack>
      </Container>

      {/* ─── ZERO FRICÇÃO / COMO FUNCIONA ─── */}
      <Box
        sx={{
          bgcolor: isDark ? brandColors.darkSurface : brandColors.areia,
          py: { xs: 8, md: 10 },
          borderTop: 1,
          borderBottom: 1,
          borderColor: 'divider',
          transition: 'background-color 0.3s ease'
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={2} textAlign="center" alignItems="center" mb={6}>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '2rem', md: '2.75rem' },
                color: 'text.primary'
              }}
            >
              como o uai to na foto funciona
            </Typography>
            <Typography
              variant="body1"
              sx={{
                maxWidth: '540px',
                fontSize: '1.1rem',
                color: 'text.secondary'
              }}
            >
              Três passos simples que qualquer convidado faz em menos de 10 segundos.
            </Typography>
          </Stack>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
              gap: 3.5
            }}
          >
            {/* Passo 1 */}
            <Card
              elevation={0}
              sx={{
                borderRadius: '24px',
                p: 2,
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: '16px',
                    bgcolor: brandColors.amareloFlash,
                    color: brandColors.tinta,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <QrCodeIcon sx={{ fontSize: 32 }} />
                </Box>
                <Typography variant="h4" sx={{ fontSize: '1.6rem', color: 'text.primary' }}>
                  1. escaneia o qr code
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.6, color: 'text.secondary' }}>
                  O convidado aponta a câmera do celular para o QR Code na mesa ou no telão. Abre direto no navegador sem precisar instalar nada.
                </Typography>
              </CardContent>
            </Card>

            {/* Passo 2 */}
            <Card
              elevation={0}
              sx={{
                borderRadius: '24px',
                p: 2,
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: '16px',
                    bgcolor: isDark ? brandColors.amareloFlash : brandColors.tinta,
                    color: isDark ? brandColors.tinta : brandColors.amareloFlash,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <PhotoCameraIcon sx={{ fontSize: 32 }} />
                </Box>
                <Typography variant="h4" sx={{ fontSize: '1.6rem', color: 'text.primary' }}>
                  2. entra na foto
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.6, color: 'text.secondary' }}>
                  Informa apenas o primeiro nome, tira a foto ou escolhe da galeria. Compressão automática inteligente para redes móveis no evento.
                </Typography>
              </CardContent>
            </Card>

            {/* Passo 3 */}
            <Card
              elevation={0}
              sx={{
                borderRadius: '24px',
                p: 2,
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: '16px',
                    bgcolor: brandColors.amareloFlash,
                    color: brandColors.tinta,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <ConnectedTvIcon sx={{ fontSize: 32 }} />
                </Box>
                <Typography variant="h4" sx={{ fontSize: '1.6rem', color: 'text.primary' }}>
                  3. sobe pro telão
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.6, color: 'text.secondary' }}>
                  A foto ganha destaque instantâneo no telão da festa, integra o mosaico dinâmico e fica disponível para todos curtirem no feed mobile.
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Container>
      </Box>

      {/* ─── DUPLA EXPERIÊNCIA (FEED MOBILE & TELÃO) ─── */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1.35fr 1fr' },
            gap: 4,
            alignItems: 'center'
          }}
        >
          {/* Card Telão (Visual de Smart TV / Projeção cinematográfica) */}
          <Box
            sx={{
              bgcolor: '#12100C',
              color: brandColors.papel,
              borderRadius: '28px',
              p: { xs: 3, md: 4.5 },
              display: 'flex',
              flexDirection: 'column',
              gap: 3,
              border: 1,
              borderColor: brandColors.darkBorder,
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <BrandSymbol size={32} variant="dark" />
                <Typography
                  sx={{
                    fontFamily: "'Bricolage Grotesque', sans-serif",
                    fontWeight: 800,
                    fontSize: '1.25rem',
                    letterSpacing: '-0.04em',
                    color: brandColors.amareloFlash
                  }}
                >
                  uai to na foto
                </Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  color: brandColors.amareloFlash,
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase'
                }}
              >
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: brandColors.amareloFlash }} />
                telão ao vivo
              </Box>
            </Box>

            <Box
              sx={{
                bgcolor: '#1E1A14',
                borderRadius: '20px',
                p: { xs: 3, sm: 5 },
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                minHeight: 220,
                border: `1px solid ${brandColors.darkBorder}`
              }}
            >
              <Typography
                variant="h3"
                sx={{
                  color: brandColors.amareloFlash,
                  fontSize: { xs: '1.75rem', sm: '2.4rem' },
                  mb: 1
                }}
              >
                transmita em smart tvs e projetores
              </Typography>
              <Typography variant="body1" sx={{ color: '#CFC8B8', maxWidth: '420px', lineHeight: 1.5 }}>
                Modo 16:9 otimizado com destaque de cada foto por 5 segundos antes de alimentar o mosaico ao vivo.
              </Typography>
            </Box>

            <Stack direction="row" spacing={1.5}>
              <Box sx={{ flex: 1, height: 48, bgcolor: '#28231B', borderRadius: '12px' }} />
              <Box sx={{ flex: 1, height: 48, bgcolor: '#383227', borderRadius: '12px' }} />
              <Box sx={{ flex: 1, height: 48, bgcolor: '#1E1A14', borderRadius: '12px' }} />
              <Box sx={{ flex: 1, height: 48, bgcolor: '#28231B', borderRadius: '12px' }} />
            </Stack>
          </Box>

          {/* Card Mobile */}
          <Box
            sx={{
              bgcolor: 'background.paper',
              borderRadius: '28px',
              p: { xs: 3, sm: 4 },
              border: 1,
              borderColor: 'divider',
              display: 'flex',
              flexDirection: 'column',
              gap: 2.5
            }}
          >
            <Chip
              label="Feed Mobile do Convidado"
              sx={{
                alignSelf: 'flex-start',
                bgcolor: isDark ? brandColors.darkSurface : brandColors.areia,
                color: 'text.primary',
                fontWeight: 700
              }}
            />
            <Typography variant="h3" sx={{ fontSize: { xs: '1.75rem', sm: '2.2rem' }, color: 'text.primary' }}>
              interação na palma da mão
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.6, color: 'text.secondary' }}>
              Os convidados curtem fotos em tempo real com o botão de coração, adicionam legendas divertidas e baixam recordações direto pelo celular.
            </Typography>

            <Box
              sx={{
                bgcolor: isDark ? brandColors.darkSurface : brandColors.papel,
                p: 2.5,
                borderRadius: '20px',
                border: 1,
                borderColor: 'divider',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <Stack spacing={0.5}>
                <Typography variant="subtitle1" fontWeight={800} color="text.primary">
                  marina entrou na foto
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  há 2 minutos
                </Typography>
              </Stack>
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  bgcolor: brandColors.amareloFlash,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: brandColors.tinta
                }}
              >
                <FavoriteIcon sx={{ fontSize: 22 }} />
              </Box>
            </Box>

            <Button
              component={RouterLink}
              to="/login"
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              sx={{ height: 52, fontWeight: 800 }}
            >
              Experimentar agora
            </Button>
          </Box>
        </Box>
      </Container>

      {/* ─── CALL TO ACTION FINAL ─── */}
      <Container maxWidth="lg" sx={{ pb: { xs: 8, md: 10 } }}>
        <Box
          sx={{
            bgcolor: isDark ? brandColors.darkPaper : brandColors.tinta,
            color: brandColors.papel,
            borderRadius: '32px',
            p: { xs: 4, sm: 6, md: 8 },
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 3.5,
            border: 1,
            borderColor: isDark ? brandColors.darkBorder : 'transparent',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
          }}
        >
          <Logo size="large" variant="dark" />

          <Typography
            variant="h2"
            sx={{
              color: brandColors.papel,
              fontSize: { xs: '2rem', sm: '3rem', md: '3.75rem' },
              maxWidth: '780px'
            }}
          >
            pronto para transformar as fotos do seu próximo evento?
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: '#CFC8B8',
              fontSize: { xs: '1.1rem', sm: '1.25rem' },
              maxWidth: '560px'
            }}
          >
            Casamentos, formaturas, aniversários ou eventos corporativos com a melhor experiência de live wall do Brasil.
          </Typography>

          <Button
            component={RouterLink}
            to="/login"
            variant="contained"
            color="primary"
            size="large"
            endIcon={<ArrowForwardIcon />}
            sx={{
              height: 58,
              px: 5,
              fontSize: '1.2rem',
              fontWeight: 800,
              mt: 1
            }}
          >
            Ir para o Login
          </Button>
        </Box>
      </Container>

      {/* ─── FOOTER ─── */}
      <Box
        component="footer"
        sx={{
          py: 4,
          px: 3,
          borderTop: 1,
          borderColor: 'divider',
          bgcolor: 'background.default',
          mt: 'auto'
        }}
      >
        <Container
          maxWidth="lg"
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2
          }}
        >
          <Logo size="small" variant="auto" />

          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} uai to na foto. todos os direitos reservados.
          </Typography>

          <Stack direction="row" spacing={1} alignItems="center">
            <ThemeToggle showTooltip={false} size="small" />
            <Button
              component={RouterLink}
              to="/login"
              variant="text"
              size="small"
              sx={{ color: 'text.primary', fontWeight: 700 }}
            >
              Login
            </Button>
          </Stack>
        </Container>
      </Box>
    </Box>
  )
}

export default Home
