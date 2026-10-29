# Visão Geral e Especificação Unificada — Live Event Photo Micro-SaaS

Documento mestre contendo todas as decisões de produto, modelo comercial, pagamentos e arquitetura técnica definidas para o projeto.

---

## 1. Proposta de Valor e Mecânica do Produto

Plataforma em tempo real para compartilhamento e exibição de fotos em eventos sociais e corporativos (casamentos, aniversários, formaturas e confraternizações), desenhada sob o princípio de **Zero Fricção**.

* **Acesso Instantâneo (Sem App / Sem Cadastro):** O convidado escaneia um QR Code na mesa ou no telão, abre uma aplicação web leve (PWA), informa apenas o primeiro nome (persistido via `localStorage`) e publica fotos em menos de 10 segundos.
* **Dupla Experiência Sincronizada:**
  1. **Feed Mobile (`/e/[slug]`):** Interface vertical para convidados tirarem fotos, adicionarem legendas curtas, reagirem/curtirem publicações e visualizarem o mural em tempo real.
  2. **Modo Telão / Live Wall (`/e/[slug]/wall`):** Layout horizontal ($16:9$) para Smart TVs e projetores. Cada nova foto aprovada ganha destaque principal por 5 segundos antes de integrar o mosaico dinâmico, mantendo o QR Code fixo na tela para retroalimentar o engajamento.

---

## 2. Modelo de Negócio e Precificação

Estrutura híbrida que combina caixa rápido no cliente final (B2C) com receita recorrente mensal (MRR) através de agências e cerimonialistas (B2B2C).

### 2.1. Perfil A — Cliente Final (B2C: Pagamento Único)
Focado em anfitriões (noivos, aniversariantes e formandos) contratando para uma única data:

| Oferta | Preço | Escopo e Regras |
| :--- | :--- | :--- |
| **Modo Degustação** | Grátis | Até 25 fotos no feed, marca d'água padrão do SaaS no telão e galeria ativa por 7 dias. |
| **Passe Evento Completo** | R\$ 147,00 (único) | Fotos e convidados ilimitados, Modo Telão liberado sem marca d'água bloqueante, moderação por PIN, download `.zip` em alta resolução e galeria por 90 dias. |
| **Order Bump (Pós-Checkout)** | + R\$ 39,00 (único) | Extensão da galeria online para 1 ano + Modo Cápsula do Tempo. |

### 2.2. Perfil B — Cerimonialista / Agência (B2B: Assinatura com Franquia)
Focado em profissionais de eventos com demanda recorrente, ancorado em desconto progressivo sobre o passe avulso de R\$ 147,00:

| Plano Mensal | Preço | Franquia Inclusa | Custo Efetivo / Evento | Crédito Extra Avulso |
| :--- | :--- | :--- | :--- | :--- |
| **Agência Essencial** | R\$ 247,00/mês | 4 eventos/mês | R\$ 61,75 ($58\%$ OFF) | R\$ 69,00 |
| **Agência Pro** | R\$ 447,00/mês | 10 eventos/mês | R\$ 44,70 ($70\%$ OFF) | R\$ 49,00 |

**Diferenciais Exclusivos do Plano Agência:**
* **Selo White-Label Gerador de Leads:** Exibição da marca da assessoria no telão e no topo do app mobile (*"Experiência oferecida por [Logo da Agência]"*) com botão clicável para WhatsApp/Instagram da cerimonialista.
* **Rollover contra Sazonalidade (60 dias):** Créditos mensais não utilizados acumulam por mais 30 dias (limitado ao teto de $2\times$ a franquia do plano), evitando cancelamentos em meses de baixa temporada.
* **Acesso Operacional de Equipe:** Link de moderação protegido apenas por PIN para recepcionistas operarem na festa sem acesso ao painel financeiro da agência.

---

## 3. Gateway de Pagamento Definido: AbacatePay

A **AbacatePay (API v2)** é o provedor oficial escolhido devido à facilidade de integração (CPF/CNPJ), Pix com taxa fixa de R\$ 0,80 por transação liquidada e suporte nativo a recorrência.

### 3.1. Catálogo de Produtos na AbacatePay
1. `prod_b2c_event_pass` — `14700` centavos (Avulso)
2. `prod_b2c_upsell_year` — `3900` centavos (Avulso / `upSellProductId`)
3. `prod_agency_essential` — `24700` centavos (`cycle: MONTHLY`)
4. `prod_agency_pro` — `44700` centavos (`cycle: MONTHLY`)
5. `prod_agency_extra_credit` — `6900` centavos (Avulso — restrito a assinantes ativos)

### 3.2. Regras de Checkout e Operação Financeira
* **Checkout B2C:** Métodos `["PIX", "CARD"]` em sessão hospedada, configurando `card: { maxInstallments: 4, passFeesToCustomer: true }` para preservar $100\%$ da margem líquida no parcelamento.
* **Checkout B2B:** Assinatura (`frequency: SUBSCRIPTION`) habilitando **Pix Recorrente** e **Cartão de Crédito Recorrente**.
* **Padrão Adapter & Idempotência:** Isolamento da AbacatePay atrás de uma interface `BillingGateway` e registro obrigatório em tabela `processed_webhooks` antes da liberação de saldo.
* **Grace Period Operacional (Proteção de Eventos):** Caso a assinatura de uma cerimonialista entre em `PAST_DUE` ou seja cancelada, o sistema bloqueia a ativação de *novos* eventos, mas **jamais interrompe** eventos já ativados anteriormente com créditos válidos.

---

## 4. Arquitetura Técnica e Soluções de Engenharia

### 4.1. Desafios Críticos Resolvidos
1. **Redes 4G Instáveis em Salões e Sítios:** Compressão e redimensionamento **Client-Side** no navegador do convidado (convertendo arquivos brutos de 8MB+ para WebP otimizado de ~300KB antes do envio) aliado a fila local resiliente a oscilações.
2. **Custo Zero de Banda de Saída (Egress):** Upload direto do navegador para o **Cloudflare R2** utilizando *Presigned URLs* geradas pelo backend, mantendo o servidor de aplicação leve e sem cobrança de tráfego de leitura no feed/telão.
3. **Segurança de Conteúdo no Telão ("Open Bar"):** Dupla camada composta por filtro automático de NSFW antes do broadcast e painel mobile de aprovação/ocultação em 1 toque (`/e/[slug]/mod?pin=XXXX`), além de *rate limit* por sessão/dispositivo contra flood.
4. **Atualização Instantânea:** Broadcast via WebSockets ou Server-Sent Events (SSE) por sala de evento, atualizando tanto o mural de fotos quanto o destravamento imediato do telão após confirmação do webhook de pagamento.

### 4.2. Modelagem Central de Dados (Unificada por Créditos)
Para evitar duplicação de fluxos entre B2C e B2B, toda liberação de evento opera sobre `Workspaces` e um razão contábil imutável de créditos (`CreditLedger`):

* **`workspaces`:** `id`, `ownerUserId`, `type` (`PERSONAL` | `AGENCY`), `name`, `brandLogoUrl`, `brandPrimaryColor`, `brandWhatsappUrl`, `abacateCustomerId`, `abacateSubscriptionId`, `subscriptionStatus` (`NONE` | `ACTIVE` | `PAST_DUE` | `CANCELED`), `activePlanCode`.
* **`credit_transactions` (Append-Only):** `id`, `workspaceId`, `amount` (`+1`, `+4`, `+10`, `-1`), `reason` (`SINGLE_PURCHASE` | `SUBSCRIPTION_RENEWAL` | `EXTRA_CREDIT` | `EVENT_ACTIVATION`), `expiresAt`, `externalPaymentId`.
* **`events`:** `id`, `workspaceId`, `slug`, `title`, `eventDate`, `tier` (`FREE_TRIAL` | `PRO_UNLOCKED`), `moderationMode` (`AUTO` | `MANUAL_PIN`), `moderationPin`, `useAgencyBranding`, `unlockedAt`, `expiresAt`.
* **`photos`:** `id`, `eventId`, `guestName`, `guestSessionId`, `storageKey`, `caption`, `status` (`PENDING` | `APPROVED` | `REJECTED`), `likesCount`, `createdAt`.
* **`processed_webhooks`:** `externalEventId`, `provider`, `processedAt`.

---

## 5. Escopo Fechado do MVP vs. Pós-Validação

### Escopo MVP (Versão 1.0)
* Autenticação enxuta para anfitriões e agências (Magic Link / Google OAuth).
* Gestão de Workspace (perfil pessoal ou configuração White-Label da agência) e compra/assinatura via AbacatePay.
* CRUD de eventos com gerador de arte de QR Code pronto para impressão e exportação das fotos em `.zip`.
* Web App do convidado (`/e/[slug]`) com compressão client-side, envio direto ao R2, curtidas e feed ao vivo.
* Modo Telão (`/e/[slug]/wall`) e Painel de Moderação por PIN (`/e/[slug]/mod`).

### Roadmap Pós-MVP (Versão 2.0+)
1. **Modo Cápsula do Tempo:** Fotos capturadas na festa e reveladas simultaneamente para todos no dia seguinte.
2. **Selfie Finder (Reconhecimento Facial):** Convidado tira uma selfie e recebe automaticamente todas as fotos em que aparece.
3. **Gamificação de Mesas:** Missões fotográficas interativas exibidas no telão para engajar convidados.