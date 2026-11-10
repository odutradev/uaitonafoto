# uai to na foto

Plataforma em tempo real para compartilhamento e exibição de fotos em eventos (casamentos, aniversários, formaturas, confraternizações).

O convidado escaneia um QR Code, informa o nome e publica fotos direto do navegador — sem app e sem cadastro. As fotos aparecem ao vivo no feed dos convidados e no telão do evento.

## Funcionalidades

- **Feed do convidado** (`/e/:token`): envio de fotos, curtidas e feed ao vivo.
- **Modo telão** (`/e/:token/screen`): exibição em TV/projetor atualizada em tempo real, com QR Code fixo.
- **Painel do anfitrião** (`/app`): criação e gestão de eventos, equipe, convidados, moderação de fotos, desafios fotográficos, telões e download do álbum em `.zip`.
- **Pagamentos**: passe avulso, planos de assinatura para agências, créditos e free trial via AbacatePay (PIX e cartão).
- **Personalização white-label** para agências.
- **Admin**: métricas, gestão de usuários e créditos, logs do sistema.

## Stack

| Camada | Tecnologias |
| --- | --- |
| **API** (`api/`) | Node.js, TypeScript, Express, Mongoose (MongoDB), Zod + OpenAPI (Swagger), Firebase Admin (Auth e Storage), AbacatePay SDK, Nodemailer, node-cron, SSE |
| **UI** (`ui/`) | React 19, Vite, TypeScript, MUI 7 + styled-components, Zustand, React Router 7, axios, Firebase Auth, Recharts |
| **Infra** | Docker, Docker Compose, nginx |

## Arquitetura

```
Navegador ──► nginx (container ui)
               ├─ /          → SPA React (build estático)
               └─ /api/*     → proxy → container api
                                  │
                       API Express
                       ├─ MongoDB ............ dados
                       ├─ Firebase Storage ... arquivos das fotos
                       ├─ Firebase Auth ...... login dos anfitriões
                       ├─ AbacatePay ......... checkout, assinaturas, webhook
                       ├─ SMTP ............... e-mails transacionais
                       ├─ SSE ................ tempo real por evento
                       └─ node-cron .......... rotinas periódicas
```

### API

Organizada por **domínios** em `api/src/domains/`:

| Domínio | Responsabilidade |
| --- | --- |
| `users` | Autenticação (sincronização com Firebase), perfil, recuperação de senha |
| `events` | Eventos, equipe, convidados, fotos, curtidas, telões, moderação, desafios, álbum |
| `payments` | Planos, checkout, free trial, assinaturas, transações, créditos, webhook |
| `system` | Health check, logs e painel administrativo |

Cada endpoint é declarado com `defineAction` (`api/src/factories/defineAction`), que combina validação Zod, autenticação, rate limit e documentação OpenAPI automática. Os domínios são registrados em `server.ts` e suas rotas montadas dinamicamente.

Existem três tipos de sessão: **anfitrião** (JWT / Firebase ID token), **convidado** (token de convidado) e **telão** (token de tela).

Rotinas periódicas (`api/src/routines/`):

- `events.expireGalleries` — expira galerias vencidas (a cada hora)
- `payments.reconcileSubscriptions` — reconcilia assinaturas (a cada hora)
- `payments.expirePendingTransactions` — expira transações pendentes (a cada 15 min)

### UI

- `src/pages/` — páginas públicas, de autenticação e do painel (`app/`)
- `src/components/` — componentes compartilhados
- `src/api/` — cliente HTTP (axios com interceptor de token) e actions por recurso
- `src/stores/` — estado global (Zustand)

Padrões detalhados: [api/CODEGUIDE.md](api/CODEGUIDE.md) e [ui/CODEGUIDE.md](ui/CODEGUIDE.md).

## Estrutura do repositório

```
uaitonafoto/
├── api/                  # Backend Express
│   ├── src/
│   │   ├── config/       # env, cors, docs, registro de domínios e rotinas
│   │   ├── domains/      # users, events, payments, system
│   │   ├── factories/    # defineAction, paginação, schemas de erro
│   │   ├── middlewares/  # rate limit, upload, raw body, manageRequest
│   │   ├── realtime/     # SSE por evento
│   │   ├── routines/     # tarefas agendadas
│   │   ├── payment/      # cliente AbacatePay e seed de planos
│   │   ├── firebase/     # Auth e Storage
│   │   └── email/        # envio e templates
│   └── Dockerfile
├── ui/                   # Frontend React
│   ├── src/
│   ├── nginx.conf
│   └── Dockerfile
├── .docs/                # documentação de produto e identidade visual
├── docker-compose.yml
└── package.json          # scripts que orquestram api e ui
```

## Pré-requisitos

- Node.js 22+
- npm
- Um banco MongoDB (local ou Atlas)
- Projeto Firebase com Authentication e Storage habilitados (credenciais de service account para a API e config web para a UI)
- Conta AbacatePay (chave de API e segredo de webhook)
- Servidor SMTP para e-mails

## Rodando localmente

1. **Instale as dependências**

   ```bash
   npm install
   npm --prefix api install
   npm --prefix ui install
   ```

2. **Configure as variáveis de ambiente**

   ```bash
   cp api/.env.example api/.env
   cp ui/.env.example ui/.env
   ```

   Preencha os valores. Para desenvolvimento local, aponte a UI para a API local em `ui/.env`:

   ```
   VITE_BASE_URL=http://localhost:3000
   ```

3. **(Opcional) Cadastre os planos na AbacatePay**

   ```bash
   npm --prefix api run seed
   ```

4. **Suba API e UI juntas**

   ```bash
   npm run dev
   ```

   - UI: http://localhost:1000
   - API: http://localhost:3000
   - Swagger: http://localhost:3000/docs (com `SWAGGER_ENABLED=true`)

## Scripts

### Raiz

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Sobe API e UI em modo desenvolvimento |
| `npm run dev:api` / `npm run dev:ui` | Sobe apenas um dos apps |
| `npm run build` | Compila API e UI |
| `npm run publish` | Incrementa versão, compila e publica |

### API (`api/`)

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Build em watch (tsup) |
| `npm run build` | Compila para `dist/` |
| `npm start` | Inicia a versão compilada |
| `npm run check` | Checagem de tipos |
| `npm run seed` | Cadastra os planos na AbacatePay |
| `npm run webhook:secret` | Gera um segredo para o webhook |

### UI (`ui/`)

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Servidor Vite (porta 1000) |
| `npm run build` | Build de produção |
| `npm run check` | Checagem de tipos |
| `npm run lint` | ESLint |
| `npm run preview` | Pré-visualiza o build |

## Variáveis de ambiente

### API

| Variável | Descrição |
| --- | --- |
| `PORT`, `NODE_ENV`, `ENV` | Porta e ambiente |
| `FRONTEND_URL` | URL pública da UI (links em e-mails e checkout) |
| `CORS_ORIGIN`, `CORS_ALLOWED_ORIGINS` | Origens permitidas |
| `JWT_SECRET` | Segredo para assinar tokens |
| `SWAGGER_ENABLED` | Habilita `/docs` |
| `ENABLE_ROUTINES` | Habilita as rotinas agendadas |
| `CHECKOUT_EXPIRATION_HOURS` | Validade de checkouts pendentes |
| `MONGODB_URI`, `MONGODB_DB_NAME` | Conexão MongoDB |
| `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`, `FIREBASE_STORAGE_BUCKET` | Firebase Admin |
| `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS`, `EMAIL_FROM` | SMTP |
| `ABACATEPAY_API_KEY`, `ABACATEPAY_WEBHOOK_SECRET` | AbacatePay |
| `ABACATEPAY_PIX_ONLY` | `true` para aceitar apenas PIX |

### UI (injetadas no build)

| Variável | Descrição |
| --- | --- |
| `VITE_BASE_URL` | URL da API |
| `VITE_FIREBASE_*` | Configuração web do Firebase |
| `VITE_CLARITY_PROJECT_ID` | Microsoft Clarity (opcional) |

## Deploy com Docker

1. Copie e preencha o arquivo de ambiente da raiz (usado pelo Compose):

   ```bash
   cp .env.example .env
   ```

2. Suba os containers:

   ```bash
   docker compose up -d --build
   ```

Os serviços `api` e `ui` apenas **expõem** a porta 80 na rede interna `uaitonafoto-network`. Para acesso externo, coloque um proxy reverso (Traefik, Caddy, nginx etc.) na frente do container `ui` ou adicione um mapeamento `ports` no `docker-compose.yml`. O nginx da UI encaminha `/api/*` para a API e redireciona `/docs` e `/health` para `/api/docs` e `/api/health`.

O container da API possui health check em `api/healthcheck.js`.

## Endpoints úteis

- `GET /api/health` — status da API e do banco
- `GET /api/docs` — documentação Swagger (quando habilitada)
- `POST /api/payments/webhook` — webhook da AbacatePay

## Documentação adicional

- [.docs/project-resume.md](.docs/project-resume.md) — visão de produto e modelo de negócio (parte da arquitetura técnica descrita ali difere da implementação atual)
- [.docs/product-events.md](.docs/product-events.md) — eventos de produto
- [api/CODEGUIDE.md](api/CODEGUIDE.md) / [ui/CODEGUIDE.md](ui/CODEGUIDE.md) — guias de código
