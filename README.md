# uaiToNaFoto

> **Suas fotos no telão em tempo real.** Sem app, sem cadastro.

O **uaiToNaFoto** transforma os convidados de um evento em fotógrafos da festa. Cada um aponta a câmera do celular para um QR Code, digita o primeiro nome e começa a enviar fotos — que aparecem **na hora** no telão do salão e no mural interativo que todos acompanham pelo celular.

Feito para casamentos, aniversários, formaturas, eventos corporativos e confraternizações — e para as **assessorias e cerimonialistas** que organizam esses eventos todo mês.

🌐 [uaitonafoto.com.br](https://uaitonafoto.com.br)

---

## O problema

As melhores fotos de uma festa ficam espalhadas nos celulares dos convidados e quase nunca chegam aos anfitriões. Grupos de WhatsApp comprimem as imagens, links de drive ninguém lembra de abrir, e apps que exigem download e cadastro simplesmente não são usados.

## A solução

Uma experiência de **zero fricção**, direto no navegador:

1. **Escaneia o QR Code** — no display da mesa ou no próprio telão. Nada para instalar.
2. **Fotos & missões** — o convidado digita o nome, cumpre desafios divertidos e envia suas fotos.
3. **Ao vivo no telão** — a foto entra imediatamente no telão e no mural da festa.

Depois do evento, o anfitrião baixa **todas as fotos originais em alta resolução** num único `.zip`.

---

## Experiências

### 📱 Mural do convidado
Feed no celular onde os convidados acompanham as fotos de todo mundo, curtem em tempo real e veem as missões do evento. Entrada só com o nome (e um PIN, se o anfitrião quiser).

### 📺 Telão ao vivo
Tela cheia para Smart TVs, LEDs e projetores, com mosaico dinâmico, rotação contínua e QR Code fixo para puxar novos participantes. Dá para conectar **vários telões ao mesmo tempo** (palco, entrada, lounge), cada um com seu PIN, e monitorar o sinal de cada tela pelo painel.

### 🎯 Missões fotográficas
Desafios temáticos que animam a festa — *"o brinde mais bonito da sua mesa"*, *"selfie com o buquê da noiva"*, *"o melhor passinho na pista"*. Há listas prontas por tipo de evento e o anfitrião pode criar, ativar ou desativar as suas.

### 🛡️ Moderação ao vivo
O anfitrião e a equipe aprovam ou rejeitam fotos antes de irem para o telão, removem fotos e bloqueiam convidados — tudo pelo celular, durante a festa.

### 🖨️ Display de mesa
Cartões com QR Code em alta definição, prontos para imprimir e espalhar pelas mesas.

### 🏷️ White-label para agências
A marca da assessoria no telão e no app dos convidados, com botão direto para o WhatsApp — cada festa vira vitrine para fechar o próximo contrato.

### 🖼️ Álbum e download
Galeria online disponível depois do evento e download de todas as fotos em alta resolução (`.zip`).

---

## Para quem é

| Perfil | Como usa |
|---|---|
| **Anfitrião** (noivos, aniversariantes, formandos, empresas) | Compra um passe para o seu evento, configura em minutos e acompanha tudo pelo painel. |
| **Equipe organizadora** | Membros convidados pelo anfitrião ajudam a moderar fotos e cuidar dos telões. |
| **Convidado** | Entra pelo QR Code, envia fotos, curte e cumpre missões — sem conta e sem app. |
| **Assessoria / cerimonialista** | Assina um plano mensal com créditos de eventos, usa a própria marca e gera leads em cada festa. |

---

## Planos

| Plano | Preço | Inclui |
|---|---|---|
| **Teste Grátis** | R$ 0 | Até 25 fotos no mural · 4h de mural e telão · telão com marca d'água · QR Code e mural mobile · galeria por 14 dias |
| **Passe do Evento** | R$ 99,00 por evento | Fotos e convidados ilimitados · 8h de telão ao vivo · 2 telões simultâneos · 1 organizador na equipe · moderação com PIN · missões · display de mesa · download `.zip` · galeria por 90 dias |
| **Agência Essencial** | R$ 247,00/mês | Tudo do Passe + 4 eventos/mês · 3 telões por evento · 2 organizadores · white-label · créditos acumulativos · crédito extra por R$ 69,00 |
| **Agência Pro** | R$ 447,00/mês | Tudo do Essencial + 10 eventos/mês · 4 telões por evento · 5 organizadores · marca em destaque · botão de WhatsApp no mural |

Pagamentos via **PIX** e **cartão** pela AbacatePay. Os planos são cadastrados pelo seed em `api/src/payment/seed/plans.ts`; a AbacatePay é a fonte da verdade dos preços em produção.

---

## Como funciona por dentro

| Camada | Tecnologias |
| --- | --- |
| **API** (`api/`) | Node.js, TypeScript, Express, MongoDB (Mongoose), Zod + Swagger, Firebase Admin (Auth e Storage), AbacatePay, Nodemailer, node-cron, Server-Sent Events |
| **UI** (`ui/`) | React 19, Vite, TypeScript, MUI 7 + styled-components, Zustand, React Router 7, Firebase Auth |
| **Infra** | Docker Compose, nginx |

```
Navegador ──► nginx (container ui)
               ├─ /          → SPA React
               └─ /api/*     → API Express
                                ├─ MongoDB ............ eventos, convidados, fotos, pagamentos
                                ├─ Firebase Storage ... arquivos das fotos
                                ├─ Firebase Auth ...... login dos anfitriões
                                ├─ AbacatePay ......... checkout, assinaturas, webhook
                                ├─ SSE ................ fotos e telões em tempo real
                                └─ node-cron .......... expiração de galerias e cobranças
```

- A API é organizada por domínios em `api/src/domains/`: `users`, `events`, `payments` e `system`. Cada endpoint é declarado com `defineAction`, que reúne validação Zod, autenticação, rate limit e documentação OpenAPI.
- Há três tipos de sessão: **anfitrião** (conta Firebase/JWT), **convidado** (token do link do evento) e **telão** (token de tela pareado por PIN).
- Rotinas agendadas expiram galerias vencidas, reconciliam assinaturas e expiram checkouts pendentes.

Guias de código: [api/CODEGUIDE.md](api/CODEGUIDE.md) e [ui/CODEGUIDE.md](ui/CODEGUIDE.md). Regras de negócio dos eventos: [.docs/product-events.md](.docs/product-events.md).

---

## Rodando localmente

**Pré-requisitos:** Node.js 22+, um MongoDB, um projeto Firebase (Authentication e Storage), conta AbacatePay e um servidor SMTP.

```bash
npm install
npm --prefix api install
npm --prefix ui install
```

```bash
cp api/.env.example api/.env
cp ui/.env.example ui/.env
```

Preencha os valores e, para desenvolvimento, aponte a UI para a API local em `ui/.env`:

```
VITE_BASE_URL=http://localhost:3000
```

Opcionalmente, cadastre os planos na AbacatePay:

```bash
npm --prefix api run seed
```

Suba tudo:

```bash
npm run dev
```

- UI: http://localhost:1000
- API: http://localhost:3000
- Swagger: http://localhost:3000/docs (com `SWAGGER_ENABLED=true`)

### Scripts

| Onde | Comando | Descrição |
| --- | --- | --- |
| raiz | `npm run dev` | API e UI em modo desenvolvimento |
| raiz | `npm run build` | Compila API e UI |
| raiz | `npm run publish` | Incrementa a versão, compila e faz push |
| `api/` | `npm run check` | Checagem de tipos |
| `api/` | `npm run seed` | Cadastra os planos na AbacatePay |
| `api/` | `npm run webhook:secret` | Gera um segredo para o webhook |
| `ui/` | `npm run check` / `npm run lint` | Tipos e ESLint |

### Variáveis de ambiente

Os modelos completos estão em [api/.env.example](api/.env.example), [ui/.env.example](ui/.env.example) e, para o Docker Compose, [.env.example](.env.example). Em resumo:

- **API:** porta e ambiente, URL do frontend e CORS, `JWT_SECRET`, MongoDB, credenciais do Firebase Admin, SMTP, chaves da AbacatePay (`ABACATEPAY_PIX_ONLY=true` aceita só PIX), `SWAGGER_ENABLED` e `ENABLE_ROUTINES`.
- **UI** (injetadas no build): `VITE_BASE_URL`, configuração web do Firebase (`VITE_FIREBASE_*`) e `VITE_CLARITY_PROJECT_ID` (opcional).

---

## Deploy

```bash
cp .env.example .env
```

```bash
docker compose up -d --build
```

Os containers `api` e `ui` só expõem a porta 80 na rede interna. Coloque um proxy reverso na frente do container `ui` (ou adicione `ports` no `docker-compose.yml`). O nginx da UI encaminha `/api/*` para a API; o health check fica em `/api/health`.

---

© Lite Technology LTDA — todos os direitos reservados.
