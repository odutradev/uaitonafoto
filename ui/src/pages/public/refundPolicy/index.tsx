import { Box, Button, Container, Link, Paper, Stack, Typography } from "@mui/material";
import { ArrowBack as ArrowBackIcon, VerifiedUser as VerifiedUserIcon } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";

import Logo from "@components/logo";
import ThemeToggle from "@components/themeToggle";

import {
  cdcAlertBoxStyles,
  contentContainerStyles,
  contentPaperStyles,
  footerBoxStyles,
  headerBoxStyles,
  headerContainerStyles,
  listStyles,
  pageWrapperStyles,
  paragraphStyles,
  sectionTitleStyles,
  stepBoxStyles,
  subtitleStyles,
  titleStyles
} from "./styles";
import type { RefundPolicyProps } from "./types";

export const RefundPolicy = ({ lastUpdated = "04 de novembro de 2026" }: RefundPolicyProps) => {
  return (
    <Box sx={pageWrapperStyles}>
      <Box component="header" sx={headerBoxStyles}>
        <Container maxWidth="lg" sx={headerContainerStyles}>
          <RouterLink to="/" style={{ textDecoration: "none", display: "inline-flex" }}>
            <Logo size="medium" variant="auto" animation="breathe" />
          </RouterLink>

          <Stack direction="row" spacing={1.5} alignItems="center">
            <ThemeToggle />
            <Button component={RouterLink} to="/" variant="outlined" size="small" startIcon={<ArrowBackIcon />}>
              Início
            </Button>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="md" sx={contentContainerStyles}>
        <Paper elevation={0} sx={contentPaperStyles}>
          <Typography variant="h1" component="h1" sx={titleStyles}>
            Política de Cancelamento e Reembolso
          </Typography>
          <Typography variant="body2" sx={subtitleStyles}>
            Última atualização: {lastUpdated}
          </Typography>

          <Box sx={cdcAlertBoxStyles}>
            <Stack direction="row" spacing={1.5} alignItems="flex-start">
              <VerifiedUserIcon color="primary" sx={{ mt: 0.2, fontSize: 28, flexShrink: 0 }} />
              <Box>
                <Typography variant="h6" component="h2" sx={{ fontWeight: 800, mb: 0.5, color: "text.primary" }}>
                  Direito de Arrependimento de 7 Dias (Código de Defesa do Consumidor)
                </Typography>
                <Typography variant="body2" sx={{ color: "text.primary", lineHeight: 1.6 }}>
                  Nos termos do{" "}
                  <strong>Artigo 49 da Lei Federal nº 8.078/1990 (Código de Defesa do Consumidor - CDC)</strong>, o
                  cliente que contratar qualquer plano ou serviço na plataforma <strong>uaiToNaFoto</strong> tem o
                  direito incondicional de desistir da contratação no prazo de até{" "}
                  <strong>7 (sete) dias corridos</strong> a partir da confirmação do pagamento, com direito ao{" "}
                  <strong>reembolso integral de 100%</strong> dos valores pagos, sem multas, taxas de cancelamento ou
                  burocracia.
                </Typography>
              </Box>
            </Stack>
          </Box>

          <Typography variant="body1" sx={paragraphStyles}>
            A presente Política de Cancelamento e Reembolso estabelece as regras e procedimentos aplicáveis às
            contratações realizadas no <strong>uaiToNaFoto</strong>, plataforma operada por{" "}
            <strong>Lite Technology LTDA</strong>, inscrita no CNPJ sob o nº <strong>55.717.105/0001-58</strong>.
          </Typography>

          <Typography variant="h2" component="h2" sx={sectionTitleStyles}>
            1. Cancelamento de Passe Avulso de Evento (B2C)
          </Typography>
          <Typography variant="body1" sx={paragraphStyles}>
            Para anfitriões que adquirem o Passe de Evento Completo ou serviços adicionais (como extensão de galeria /
            order bump):
          </Typography>
          <Box component="ul" sx={listStyles}>
            <li>
              <strong>Solicitação em até 7 dias corridos:</strong> Se a solicitação de cancelamento for realizada em até
              7 (sete) dias após a compra e antes da data de realização do evento, o reembolso será processado
              integralmente (100% do valor pago).
            </li>
            <li>
              <strong>Eventos já realizados:</strong> Caso o evento já tenha ocorrido e a plataforma tenha sido
              efetivamente utilizada no dia festivo (projeção no telão e uploads efetuados), o serviço considera-se
              plenamente prestado e consumado, não sendo cabível o reembolso após o evento ter acontecido com sucesso.
            </li>
            <li>
              <strong>Cancelamento após o prazo de 7 dias:</strong> Solicitações realizadas após o prazo de 7 dias
              corridos da contratação e que antecedam a realização do evento poderão ser convertidas em créditos ou
              reagendamento de data mediante análise pelo suporte ao cliente.
            </li>
          </Box>

          <Typography variant="h2" component="h2" sx={sectionTitleStyles}>
            2. Cancelamento de Assinaturas Recorrentes (B2B - Agências e Cerimonialistas)
          </Typography>
          <Typography variant="body1" sx={paragraphStyles}>
            Para profissionais de eventos que contratam planos mensais com franquia de créditos (Agência Essencial,
            Agência Pro ou equivalentes):
          </Typography>
          <Box component="ul" sx={listStyles}>
            <li>
              <strong>Garantia de 7 dias no primeiro ciclo:</strong> O assinante tem até 7 (sete) dias corridos a partir
              da primeira assinatura para solicitar o cancelamento com reembolso total.
            </li>
            <li>
              <strong>Cancelamento a qualquer momento sem fidelidade:</strong> Não há cláusula de carência nem multa
              rescisória. O cancelamento da renovação automática pode ser solicitado a qualquer instante pelo painel ou
              canal de atendimento.
            </li>
            <li>
              <strong>Proteção de Eventos e Créditos:</strong> Caso a assinatura seja cancelada ou deixe de ser
              renovada, o sistema apenas interrompe a liberação de novos créditos mensais; créditos já adquiridos
              permanecem disponíveis na conta e <strong>eventos já ativados jamais são interrompidos</strong>.
            </li>
          </Box>

          <Typography variant="h2" component="h2" sx={sectionTitleStyles}>
            3. Métodos e Prazos para Efetivação do Reembolso
          </Typography>
          <Typography variant="body1" sx={paragraphStyles}>
            Uma vez aprovada a solicitação de reembolso, a devolução financeira seguirá os prazos estipulados de acordo
            com a forma de pagamento originalmente utilizada no checkout:
          </Typography>

          <Box sx={stepBoxStyles}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5, color: "text.primary" }}>
              • Pagamentos via PIX:
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.6 }}>
              A devolução é creditada diretamente na mesma conta bancária ou chave Pix utilizada pelo pagador, no prazo
              máximo de <strong>24 a 48 horas úteis</strong> após a confirmação do estorno pelo nosso departamento
              financeiro.
            </Typography>
          </Box>

          <Box sx={stepBoxStyles}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5, color: "text.primary" }}>
              • Pagamentos via Cartão de Crédito:
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.6 }}>
              A ordem de estorno é transmitida imediatamente ao gateway de pagamentos (AbacatePay) e à adquirente do
              cartão. O valor estornado será visualizado em até <strong>1 ou 2 faturas subsequentes</strong>, a depender
              exclusivamente da data de fechamento e das políticas da administradora do cartão do titular.
            </Typography>
          </Box>

          <Typography variant="h2" component="h2" sx={sectionTitleStyles}>
            4. Procedimento Passo a Passo para Solicitar Reembolso
          </Typography>
          <Typography variant="body1" sx={paragraphStyles}>
            Para exercer seu direito de cancelamento ou arrependimento com rapidez e segurança, siga os seguintes
            passos:
          </Typography>
          <Box component="ol" sx={listStyles}>
            <li>
              Envie um e-mail para <strong>contato@uaitonafoto.odutra.com</strong> com o assunto:{" "}
              <code>Solicitação de Cancelamento e Reembolso</code>.
            </li>
            <li>
              Informe no corpo do e-mail:
              <Box component="ul" sx={{ pl: 2, mt: 0.5 }}>
                <li>Nome completo do contratante;</li>
                <li>E-mail cadastrado na plataforma;</li>
                <li>Identificador da transação ou código do evento;</li>
                <li>Chave Pix (no caso de compras realizadas via Pix).</li>
              </Box>
            </li>
            <li>
              Nossa equipe acusará o recebimento e responderá à sua solicitação em até <strong>1 dia útil</strong> com o
              comprovante do estorno.
            </li>
          </Box>

          <Typography variant="h2" component="h2" sx={sectionTitleStyles}>
            5. Disposições Gerais
          </Typography>
          <Typography variant="body1" sx={paragraphStyles}>
            Esta política integra indissociavelmente os{" "}
            <Link component={RouterLink} to="/termos-de-uso" underline="hover" color="primary">
              Termos de Uso
            </Link>{" "}
            do <strong>uaiToNaFoto</strong> e foi elaborada em estrita conformidade com a legislação de proteção ao
            consumidor brasileira.
          </Typography>
        </Paper>
      </Container>

      <Box component="footer" sx={footerBoxStyles}>
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} uaiToNaFoto • Lite Technology LTDA • CNPJ 55.717.105/0001-58
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default RefundPolicy;
