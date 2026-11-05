import { Box, Button, Container, Link, Paper, Stack, Typography } from '@mui/material'
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material'
import { Link as RouterLink } from 'react-router-dom'

import Logo from '@components/logo'
import ThemeToggle from '@components/themeToggle'

import {
  contentContainerStyles,
  contentPaperStyles,
  footerBoxStyles,
  headerBoxStyles,
  headerContainerStyles,
  highlightBoxStyles,
  listStyles,
  pageWrapperStyles,
  paragraphStyles,
  sectionTitleStyles,
  subtitleStyles,
  titleStyles
} from './styles'
import type { TermsOfUseProps } from './types'

export const TermsOfUse = ({ lastUpdated = '04 de novembro de 2026' }: TermsOfUseProps) => {
  return (
    <Box sx={pageWrapperStyles}>
      <Box component="header" sx={headerBoxStyles}>
        <Container maxWidth="lg" sx={headerContainerStyles}>
          <RouterLink to="/" style={{ textDecoration: 'none', display: 'inline-flex' }}>
            <Logo size="medium" variant="auto" animation="breathe" />
          </RouterLink>

          <Stack direction="row" spacing={1.5} alignItems="center">
            <ThemeToggle />
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

      <Container maxWidth="md" sx={contentContainerStyles}>
        <Paper elevation={0} sx={contentPaperStyles}>
          <Typography variant="h1" component="h1" sx={titleStyles}>
            Termos de Uso
          </Typography>
          <Typography variant="body2" sx={subtitleStyles}>
            Última atualização: {lastUpdated}
          </Typography>

          <Typography variant="body1" sx={paragraphStyles}>
            Estes Termos de Uso regem a utilização da plataforma <strong>uai to na foto</strong> (&quot;Plataforma&quot;), desenvolvida e operada por <strong>Lite Technology LTDA</strong>, pessoa jurídica de direito privado, inscrita no CNPJ sob o nº <strong>55.717.105/0001-58</strong>.
          </Typography>

          <Typography variant="body1" sx={paragraphStyles}>
            Ao acessar a Plataforma, criar uma conta, contratar planos ou interagir como convidado em eventos através de QR Code, você expressa sua concordância integral e irrevogável com todas as condições aqui estabelecidas. Caso não concorde com qualquer item destes termos, recomendamos que não utilize os serviços.
          </Typography>

          <Typography variant="h2" component="h2" sx={sectionTitleStyles}>
            1. Objeto e Definição dos Serviços
          </Typography>
          <Typography variant="body1" sx={paragraphStyles}>
            O <strong>uai to na foto</strong> é uma plataforma SaaS (Software as a Service) voltada para transmissão e compartilhamento em tempo real de fotografias em eventos sociais e corporativos (como casamentos, formaturas, aniversários e encontros empresariais).
          </Typography>
          <Typography variant="body1" sx={paragraphStyles}>
            A Plataforma é composta por:
          </Typography>
          <Box component="ul" sx={listStyles}>
            <li><strong>Feed Mobile do Convidado:</strong> Aplicação web progressiva (PWA) de acesso instantâneo sem necessidade de download ou cadastro complexo, acionada via leitura de QR Code.</li>
            <li><strong>Modo Telão / Live Wall:</strong> Interface de projeção em tempo real otimizada para Smart TVs, projetores e telões de LED, exibindo dinamicamente as fotos compartilhadas.</li>
            <li><strong>Painel de Gestão e Moderação:</strong> Módulo administrativo acessível pelo anfitrião ou cerimonialista para controle de eventos, moderação por PIN, aprovação ou ocultação de fotos e exportação da galeria em alta resolução.</li>
          </Box>

          <Typography variant="h2" component="h2" sx={sectionTitleStyles}>
            2. Cadastro e Contas de Usuário
          </Typography>
          <Typography variant="body1" sx={paragraphStyles}>
            Para criar eventos e contratar planos, o usuário deve realizar cadastro informando dados verídicos, completos e atualizados. A guarda de senhas e acessos é de responsabilidade exclusiva do usuário titular.
          </Typography>
          <Typography variant="body1" sx={paragraphStyles}>
            Para convidados dos eventos, o acesso ocorre sem necessidade de criação de conta formal: requer-se apenas a indicação de um primeiro nome para identificação das fotos postadas no feed do evento correspondente.
          </Typography>

          <Typography variant="h2" component="h2" sx={sectionTitleStyles}>
            3. Conduta, Uso Aceitável e Moderação de Conteúdo
          </Typography>
          <Typography variant="body1" sx={paragraphStyles}>
            É expressamente vedado utilizar o <strong>uai to na foto</strong> para publicar, transmitir ou exibir conteúdos que contenham:
          </Typography>
          <Box component="ul" sx={listStyles}>
            <li>Material pornográfico, nudez explícita, pedofilia ou atos sexuais;</li>
            <li>Apologia ao crime, violência, armas de fogo ou substâncias ilícitas;</li>
            <li>Discurso de ódio, racismo, homofobia, discriminação de qualquer natureza ou assédio;</li>
            <li>Violação de direitos autorais, marcas ou propriedade intelectual de terceiros;</li>
            <li>Tentativas de sobrecarga (DDoS), invasão, engenharia reversa ou desestabilização da infraestrutura técnica.</li>
          </Box>
          <Typography variant="body1" sx={paragraphStyles}>
            A Plataforma disponibiliza filtros automatizados de moderação preventiva e painel de moderação com controle por PIN para os anfitriões e organizadores. A Lite Technology LTDA reserva-se o direito de suspender ou remover eventos e conteúdos que violem estes Termos ou a legislação em vigor.
          </Typography>

          <Typography variant="h2" component="h2" sx={sectionTitleStyles}>
            4. Direitos Autorais e Cessão de Imagem
          </Typography>
          <Typography variant="body1" sx={paragraphStyles}>
            Ao submeter uma foto através da Plataforma em um evento específico, o usuário ou convidado declara possuir os direitos de uso e imagem necessários, autorizando a exibição pública temporária no telão do respectivo evento e na galeria privada disponibilizada ao anfitrião organizador.
          </Typography>
          <Typography variant="body1" sx={paragraphStyles}>
            A Plataforma não comercializa nem transfere a propriedade das fotografias enviadas a terceiros não autorizados.
          </Typography>

          <Typography variant="h2" component="h2" sx={sectionTitleStyles}>
            5. Planos Comerciais e Pagamentos
          </Typography>
          <Typography variant="body1" sx={paragraphStyles}>
            A Plataforma opera sob modelo híbrido:
          </Typography>
          <Box component="ul" sx={listStyles}>
            <li><strong>Passe Avulso por Evento (B2C):</strong> Pagamento único com liberação do Modo Telão sem marca d&apos;água bloqueante, fotos e convidados ilimitados e armazenamento da galeria conforme o período contratado.</li>
            <li><strong>Planos de Assinatura para Agências / Cerimonialistas (B2B):</strong> Cobrança recorrente mensal com franquia de eventos, personalização white-label e acúmulo de créditos conforme as regras do plano ativo.</li>
          </Box>
          <Typography variant="body1" sx={paragraphStyles}>
            As transações financeiras são intermediadas por processadores e instituições de pagamento autorizadas pelo Banco Central do Brasil (incluindo o gateway AbacatePay), aceitando modalidades como PIX e Cartão de Crédito.
          </Typography>

          <Typography variant="h2" component="h2" sx={sectionTitleStyles}>
            6. Cancelamento, Reembolso e Direito de Arrependimento
          </Typography>
          <Box sx={highlightBoxStyles}>
            <Typography variant="body1" sx={{ ...paragraphStyles, mb: 1, fontWeight: 600, color: 'text.primary' }}>
              Direito de Arrependimento (Art. 49 do Código de Defesa do Consumidor):
            </Typography>
            <Typography variant="body2" sx={{ ...paragraphStyles, mb: 1 }}>
              O consumidor tem o direito legal de desistir da contratação no prazo de até <strong>7 (sete) dias corridos</strong> a contar da data de confirmação do pagamento, com reembolso integral de 100% dos valores despendidos.
            </Typography>
            <Typography variant="body2" sx={{ ...paragraphStyles, mb: 0 }}>
              As regras completas, condições específicas para eventos já executados e prazos bancários de estorno estão detalhados em nossa{' '}
              <Link component={RouterLink} to="/politica-de-cancelamento" underline="hover" color="primary">
                Política de Cancelamento e Reembolso
              </Link>.
            </Typography>
          </Box>

          <Typography variant="h2" component="h2" sx={sectionTitleStyles}>
            7. Disponibilidade e Limitação de Responsabilidade
          </Typography>
          <Typography variant="body1" sx={paragraphStyles}>
            A Lite Technology LTDA emprega tecnologia de ponta, compressão no navegador do cliente (client-side) e servidores de alta escalabilidade para assegurar máxima performance. Contudo, o funcionamento da transmissão em tempo real depende diretamente da qualidade da conexão de internet disponível no local físico do evento (sítios, salões e espaços de festas), pela qual a Plataforma não pode ser responsabilizada.
          </Typography>

          <Typography variant="h2" component="h2" sx={sectionTitleStyles}>
            8. Privacidade e Proteção de Dados (LGPD)
          </Typography>
          <Typography variant="body1" sx={paragraphStyles}>
            O tratamento de dados pessoais realizado pela Plataforma obedece rigorosamente às disposições da Lei Geral de Proteção de Dados Pessoais (Lei Federal nº 13.709/2018 - LGPD), pautando-se na minimização da coleta, segurança e transparência.
          </Typography>

          <Typography variant="h2" component="h2" sx={sectionTitleStyles}>
            9. Disposições Gerais e Foro
          </Typography>
          <Typography variant="body1" sx={paragraphStyles}>
            Estes Termos de Uso são regidos pelas leis da República Federativa do Brasil. Para a resolução de eventuais litígios decorrentes deste instrumento, fica eleito o Foro da Comarca de Belo Horizonte, Estado de Minas Gerais, com renúncia expressa a qualquer outro, por mais privilegiado que seja.
          </Typography>

          <Typography variant="h2" component="h2" sx={sectionTitleStyles}>
            10. Contato e Atendimento
          </Typography>
          <Typography variant="body1" sx={paragraphStyles}>
            Em caso de dúvidas, esclarecimentos ou solicitações relacionadas a estes Termos, entre em contato com nossa equipe pelo canal oficial de suporte:
          </Typography>
          <Box component="ul" sx={listStyles}>
            <li><strong>Razão Social:</strong> Lite Technology LTDA</li>
            <li><strong>CNPJ:</strong> 55.717.105/0001-58</li>
            <li><strong>E-mail de Suporte:</strong> contato@uaitonafoto.odutra.com</li>
          </Box>
        </Paper>
      </Container>

      <Box component="footer" sx={footerBoxStyles}>
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} uai to na foto • Lite Technology LTDA • CNPJ 55.717.105/0001-58
          </Typography>
        </Container>
      </Box>
    </Box>
  )
}

export default TermsOfUse

