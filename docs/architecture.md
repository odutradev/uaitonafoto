# Arquitetura do Sistema — Uai, Tô na Foto

Documento de arquitetura técnica para o Micro-SaaS **Uai, Tô na Foto**, alinhado às definições de produto, modelo comercial e identidade visual presentes em `docs/`.

---

## 1. Visão Geral e Princípios Arquiteturais

O sistema é um monorepo enxuto composto por duas aplicações TypeScript independentes (`ui/` e `api/`), orquestradas via `docker-compose.yml` para deploy em VPS gerenciada pelo **Dokploy**.

### Princípios Diretores
1. **Pragmatismo Single-Node First:** Arquitetura otimizada para operar com baixo custo e baixa manutenção em uma única VPS no Dokploy (`ui` + `api` + `postgres`), sem introduzir filas externas, brokers ou microsserviços desnecessários no MVP.
2. **API Stateless e Zero Tráfego Binário no Upload:** Imagens nunca passam pelo Express durante o envio. O navegador comprime a foto localmente para WebP e faz upload direto (`PUT`) ao **Cloudflare R2** via *Presigned URL*, mantendo o uso de CPU/RAM da API previsível mesmo em picos de festa.
3. **Mesma Origem (Zero CORS Preflight no 4G):** O proxy reverso (Traefik do Dokploy / Nginx da UI) expõe a UI em `/` e a API em `/api/*` sob o mesmo domínio. Isso elimina requisições `OPTIONS` extras em redes 4G instáveis de salões e sítios e simplifica cookies `httpOnly`.
4. **Contabilidade Imutável por Créditos (`CreditLedger`):** Tanto compras avulsas B2C quanto assinaturas B2B convergem para um único razão contábil (`credit_transactions`), evitando ramificações duplicadas de regra de negócio na ativação de eventos.
5. **Isolamento de Integrações Externas (Ports & Adapters Leve):** Pagamentos (`BillingGateway` -> AbacatePay), armazenamento (`StorageProvider` -> Cloudflare R2) e filtro de conteúdo (`ModerationProvider`) ficam isolados atrás de interfaces simples.

---

## 2. Topologia de Infraestrutura (Dokploy + Cloudflare)

```mermaid
flowchart LR
    subgraph Clients["Clientes Web"]
        Guest["Convidado Mobile PWA (/e/:slug)"]
        Wall["Smart TV / Telão 16:9 (/e/:slug/wall)"]
        Mod["Moderador Mobile PIN (/e/:slug/mod)"]
        Host["Anfitrião / Agência (/app/*)"]
    end

    subgraph External["Serviços Externos"]
        R2["Cloudflare R2 + CDN (Zero Egress)"]
        Abacate["AbacatePay API v2 (Pix / Cartão / Recorrência)"]
    end

    subgraph VPS["VPS — Dokploy"]
        Traefik["Traefik Reverse Proxy (Auto SSL)"]

        subgraph Compose["docker-compose.yml"]
            UI["ui (Nginx Alpine + React Build)"]
            API["api (Node.js 22 + Express + TS)"]
            DB[("postgres (PostgreSQL 16 Alpine)")]
        end
    end

    Guest & Wall & Mod & Host -->|"HTTPS (/)"| Traefik
    Guest & Wall & Mod & Host -->|"HTTPS REST + SSE (/api/*)"| Traefik
    Traefik -->|"/"| UI
    Traefik -->|"/api/*"| API

    Guest -->|"1. PUT direto via Presigned URL"| R2
    Guest & Wall & Mod -->|"2. GET imagens otimizadas (Cache CDN)"| R2

    API -->|"TCP 5432 (rede interna)"| DB
    API -->|"Assinatura S3 / HeadObject / Stream ZIP"| R2
    API <-->|"Checkout + Webhooks HTTPS"| Abacate
```

### Decisões de Infraestrutura
* **Tempo Real via SSE (Server-Sent Events):** Como o fluxo em tempo real é estritamente do servidor para os clientes (nova foto aprovada, atualização de curtidas, remoção por moderação e destravamento do telão pós-pagamento) e as ações do usuário são pontuais via REST, o **SSE nativo no Express** substitui WebSockets com menor complexidade, reconexão automática nativa do navegador (`EventSource`) e compatibilidade direta com HTTP/2 no Traefik.
* **Sem Redis no MVP:** Em instância única da API (`replicas: 1`), o hub de conexões SSE (`Map<eventId, Set<Response>>`) e os contadores de *rate limit* residem em memória no processo Node.js. Se houver necessidade futura de escalar horizontalmente a API, basta plugar Redis Pub/Sub na interface do hub de eventos sem alterar rotas nem frontend.

---

## 3. Estrutura do Repositório

```text
uaitonafoto/
├── api/                          # Backend Express + TypeScript
│   ├── src/
│   │   ├── config/               # Validação de env (Zod), conexão DB e cliente R2
│   │   ├── db/                   # Schema Drizzle ORM e migrações SQL
│   │   ├── modules/
│   │   │   ├── auth/             # Magic Link / Google OAuth (Host) + Sessão PIN (Mod)
│   │   │   ├── workspaces/       # Gestão B2C/B2B, configurações White-Label e saldo
│   │   │   ├── billing/          # Interface BillingGateway, AbacatePayAdapter e Webhooks
│   │   │   ├── events/           # CRUD de eventos, ativação via Ledger e exportação .zip
│   │   │   ├── photos/           # Presigned URLs, confirmação, NSFW scan, likes e moderação
│   │   │   └── realtime/         # Hub SSE por sala de evento e keep-alive heartbeat
│   │   ├── providers/            # Implementações concretas (R2Storage, AbacatePay, NsfwFilter)
│   │   ├── shared/               # Middlewares (auth, rate-limit, error handler), logger (Pino)
│   │   ├── app.ts                # Configuração do Express e montagem de rotas
│   │   └── server.ts             # Bootstrap HTTP e graceful shutdown
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
├── ui/                           # Frontend React + Vite + TypeScript
│   ├── public/                   # Manifest PWA, ícones e assets estáticos
│   ├── src/
│   │   ├── app/                  # Router com code-splitting por contexto e providers globais
│   │   ├── design-system/        # Tokens CSS (#FFCF1F, #17140F, #FBF8F1), fontes e primitivos UI
│   │   ├── features/
│   │   │   ├── guest-feed/       # PWA do convidado (/e/:slug), compressão WebP e fila offline
│   │   │   ├── live-wall/        # Modo Telão 16:9 (/e/:slug/wall), fila spotlight 5s e mosaico
│   │   │   ├── moderation/       # Painel operacional por PIN (/e/:slug/mod) em 1 toque
│   │   │   ├── dashboard/        # Gestão de eventos, Cartão de Mesa QR Code e download .zip
│   │   │   └── billing/          # Compra de passe, assinatura Agência e extrato de créditos
│   │   ├── lib/                  # Cliente HTTP, hook useEventStream (SSE) e IndexedDB queue
│   │   └── main.tsx
│   ├── nginx.conf                # Fallback SPA, cache de assets e headers de segurança
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
├── docs/                         # Documentação de produto, identidade visual e arquitetura
├── docker-compose.yml            # Orquestração para o Dokploy
├── .env.example
└── .gitignore
```

---

## 4. Arquitetura do Frontend (`ui/`)

### 4.1. Stack Técnica Enxuta
* **Core:** React 19 + Vite + TypeScript.
* **Roteamento e Bundle Splitting:** React Router com `React.lazy` isolando as 4 experiências. O convidado que escaneia o QR Code no 4G baixa apenas o bundle enxuto de `guest-feed`, sem carregar bibliotecas do painel administrativo ou gerador de artes de impressão.
* **Estado e Sincronização:** TanStack Query para estado remoto aliado a um hook `useEventStream(slug)` que escuta eventos SSE e atualiza o cache local instantaneamente.
* **Estilização e White-Label:** Tailwind CSS parametrizado com CSS Variables baseadas na identidade oficial:
  * Tipografia: `Bricolage Grotesque` (títulos e marca) e `DM Sans` (interface e leitura).
  * Paleta padrão: Amarelo Flash (`#FFCF1F`), Tinta (`#17140F`), Papel (`#FBF8F1`) e Areia (`#EFE9DA`).
  * Quando `event.useAgencyBranding` estiver ativo em um evento `PRO_UNLOCKED` de Agência, a UI injeta dinamicamente `--brand-primary`, exibe o selo *"Experiência oferecida por [Logo da Agência]"* e habilita o CTA para o WhatsApp/Instagram da assessoria.

### 4.2. Pipeline de Upload Resiliente no Convidado (4G Instável)
1. **Identificação Zero Fricção:** No primeiro envio ou curtida, solicita apenas o primeiro nome e gera um `guestSessionId` (UUID v4) salvo no `localStorage`.
2. **Compressão Client-Side:** Antes de tocar na rede, a imagem original da câmera (8MB–15MB) é processada via `OffscreenCanvas` / `<canvas>`, corrigindo orientação EXIF, redimensionando para aresta máxima de `2048px` e codificando em **WebP** (~250KB–400KB). Essa resolução entrega nitidez total tanto em TVs 4K/1080p quanto na exportação `.zip`, reduzindo o payload em mais de $95\%$.
3. **Fila Persistente Local:** A foto comprimida e a legenda entram em uma fila no **IndexedDB**. Se o sinal 4G cair no salão, um worker de sincronização retoma o envio com *exponential backoff* assim que a conectividade retornar (`online` event / `visibilitychange`).

### 4.3. Máquina de Estados do Modo Telão (`/e/:slug/wall`)
* Layout horizontal fixo $16:9$ em fundo escuro (`#17140F`) para evitar ofuscamento no salão, mantendo o QR Code fixo na lateral.
* **Fila de Spotlight (5 segundos):** Novas fotos recebidas via SSE entram em uma fila FIFO local na UI. Cada foto assume o quadro de destaque principal por exatos **5 segundos** (exibindo a faixa em `#FFCF1F`: `"[nome] entrou na foto"`) antes de transicionar suavemente para o mosaico dinâmico, evitando que envios simultâneos se atropelem na tela.
* **Marca d'Água Condicional:** Eventos em `FREE_TRIAL` renderizam overlay de marca d'água padrão do SaaS no telão; ao receber o evento SSE `event:unlocked`, o bloqueio/marca d'água desaparece imediatamente sem exigir refresh na Smart TV.

---

## 5. Arquitetura do Backend (`api/`)

### 5.1. Stack Técnica Enxuta
* **Core:** Node.js 22 LTS + Express 5 + TypeScript.
* **Acesso a Dados:** PostgreSQL 16 + **Drizzle ORM** (tipagem estrita, zero overhead de binários externos em Alpine Linux e controle explícito de transações SQL `SELECT ... FOR UPDATE`).
* **Validação e Observabilidade:** Zod para contratos de entrada/ambiente e `pino` para logs JSON estruturados consumidos pelo painel de logs do Dokploy.
* **Mídia e Exportação:** `@aws-sdk/client-s3` + `@aws-sdk/s3-request-presigner` apontando para o endpoint S3 do Cloudflare R2, e `archiver` para streaming direto do `.zip`.

### 5.2. Fluxo de Envio, Moderação e Tempo Real

```mermaid
sequenceDiagram
    autonumber
    actor G as Convidado (PWA)
    participant API as Express API
    participant R2 as Cloudflare R2
    participant DB as PostgreSQL
    actor M as Moderador (PIN)
    actor W as Telão (Live Wall)

    G->>G: Comprime foto para WebP (~300KB) + salva no IndexedDB
    G->>API: POST /api/v1/events/:slug/photos/upload-url
    API->>DB: Valida evento ativo, limite FREE_TRIAL (25) e rate-limit
    API-->>G: { photoId, uploadUrl (Presigned PUT), storageKey }
    G->>R2: PUT WebP direto no R2
    G->>API: POST /api/v1/events/:slug/photos/:photoId/confirm

    API->>R2: HeadObject (confirma existência e Content-Type/tamanho)

    alt Evento em modo MANUAL_PIN
        API->>DB: Salva/atualiza foto como PENDING
        API-->>M: SSE "photo:pending"
        M->>API: PATCH /api/v1/events/:slug/mod/photos/:photoId (APPROVED)
        API->>DB: Atualiza status = APPROVED
        API-->>W: SSE "photo:approved" (entra na fila de 5s)
        API-->>G: SSE "photo:approved"
    else Evento em modo AUTO
        API->>API: Executa ModerationProvider (NSFW check)
        alt Conteúdo seguro
            API->>DB: Atualiza status = APPROVED
            API-->>W: SSE "photo:approved" (entra na fila de 5s)
            API-->>G: SSE "photo:approved"
        else Suspeito / falha de confiança
            API->>DB: Mantém status = PENDING (quarentena)
            API-->>M: SSE "photo:pending"
        end
    end
```

### 5.3. Exportação `.zip` em Memória Constante
Na rota `GET /api/v1/events/:id/export-zip` (exclusiva para eventos `PRO_UNLOCKED`), a API busca as chaves `APPROVED` no PostgreSQL, abre streams `GetObjectCommand` do R2 em concorrência controlada (ex: 5 por vez) e faz pipe direto via `archiver` para o `Response` HTTP (`Content-Disposition: attachment`). Nenhum arquivo temporário é gravado no disco da VPS.

### 5.4. Motor Financeiro, AbacatePay e Regras de Crédito

```mermaid
sequenceDiagram
    autonumber
    participant Abacate as AbacatePay Webhook
    participant API as Billing Module (API)
    participant DB as PostgreSQL (ACID)
    participant SSE as SSE Hub

    Abacate->>API: POST /api/v1/webhooks/abacatepay (Assinatura/Secret Header)
    API->>API: Valida autenticidade e payload (Zod)
    API->>DB: BEGIN TRANSACTION
    API->>DB: INSERT INTO processed_webhooks (external_event_id, provider) ON CONFLICT DO NOTHING
    alt Webhook já processado
        API->>DB: COMMIT
        API-->>Abacate: 200 OK (Idempotente)
    else Novo evento financeiro
        API->>DB: Registra crédito em credit_transactions (+1, +4 ou +10 com expires_at)
        API->>DB: Atualiza status do workspace / desbloqueia evento pendente (se B2C direto)
        API->>DB: COMMIT
        API->>SSE: Broadcast "event:unlocked" (destrava telão ao vivo)
        API-->>Abacate: 200 OK
    end
```

#### Regras Contábeis do `CreditLedger`
* **Rollover de 60 Dias e Teto $2\times$ (Agências):** Na renovação mensal (`SUBSCRIPTION_RENEWAL`), os novos créditos (`+4` ou `+10`) são gravados com `expires_at = NOW() + INTERVAL '60 days'`. Antes de creditar, a transação calcula o saldo ativo não expirado do workspace e limita a concessão para que o saldo total disponível nunca ultrapasse $2\times$ a franquia do plano ativo (`8` no Essencial, `20` no Pro).
* **Consumo FIFO na Ativação de Evento:** Ao ativar um evento (`EVENT_ACTIVATION`), a API bloqueia a linha do `workspace` (`SELECT ... FOR UPDATE`), verifica se há saldo válido (`expires_at > NOW()`) consumindo primeiro os créditos mais próximos do vencimento e grava a transação `-1` vinculada ao `event_id`.
* **Grace Period Operacional:** Se a assinatura da agência entrar em `PAST_DUE` ou `CANCELED`, o endpoint de ativação de *novos* eventos bloqueia o uso da franquia recorrente, mas eventos já marcados como `PRO_UNLOCKED` continuam operando normalmente até seu `expires_at` original.

---

## 6. Modelagem de Dados (PostgreSQL)

```mermaid
erDiagram
    users ||--o{ workspaces : "owns"
    workspaces ||--o{ credit_transactions : "ledger"
    workspaces ||--o{ events : "manages"
    events ||--o{ photos : "contains"
    photos ||--o{ photo_likes : "receives"

    users {
        uuid id PK
        text email UK
        text name
        text google_sub UK
        timestamptz created_at
    }

    workspaces {
        uuid id PK
        uuid owner_user_id FK
        text type "PERSONAL | AGENCY"
        text name
        text brand_logo_url
        text brand_primary_color
        text brand_whatsapp_url
        text abacate_customer_id
        text abacate_subscription_id
        text subscription_status "NONE | ACTIVE | PAST_DUE | CANCELED"
        text active_plan_code
        timestamptz created_at
    }

    credit_transactions {
        uuid id PK
        uuid workspace_id FK
        uuid event_id FK "nullable"
        int amount "+1 | +4 | +10 | -1"
        int remaining_amount "para consumo FIFO de lotes positivos"
        text reason "SINGLE_PURCHASE | SUBSCRIPTION_RENEWAL | EXTRA_CREDIT | EVENT_ACTIVATION"
        text external_payment_id
        timestamptz expires_at
        timestamptz created_at
    }

    events {
        uuid id PK
        uuid workspace_id FK
        text slug UK
        text title
        date event_date
        text tier "FREE_TRIAL | PRO_UNLOCKED"
        text moderation_mode "AUTO | MANUAL_PIN"
        text moderation_pin_hash
        boolean use_agency_branding
        timestamptz unlocked_at
        timestamptz expires_at
        timestamptz created_at
    }

    photos {
        uuid id PK
        uuid event_id FK
        text guest_name
        text guest_session_id
        text storage_key UK
        text caption
        text status "UPLOADING | PENDING | APPROVED | REJECTED"
        int likes_count
        timestamptz created_at
    }

    photo_likes {
        uuid photo_id PK "FK photos.id"
        text guest_session_id PK
        timestamptz created_at
    }

    processed_webhooks {
        text external_event_id PK
        text provider PK
        timestamptz processed_at
    }
```

### Índices Críticos
* `events (slug)` — `UNIQUE`, busca principal de todas as rotas públicas e SSE.
* `photos (event_id, status, created_at DESC)` — listagem paginada por cursor do feed mobile, fila de moderação e carga inicial do telão.
* `credit_transactions (workspace_id, expires_at)` — apuração rápida de saldo disponível e consumo FIFO.

---

## 7. Configuração de Containers e Deploy no Dokploy

O projeto utiliza um único `docker-compose.yml` na raiz, implantado no Dokploy como serviço **Compose**.

### 7.1. Requisitos de Rede e Proxy para SSE no Dokploy
Para que conexões SSE não sofram buffering nem desconexão prematura pelo Traefik/Nginx:
1. A API responde na rota `/api/v1/events/:slug/stream` com os headers:
   * `Content-Type: text/event-stream`
   * `Cache-Control: no-cache, no-transform`
   * `Connection: keep-alive`
   * `X-Accel-Buffering: no`
2. O Hub SSE envia um comentário de *heartbeat* (`: ping\n\n`) a cada **25 segundos** em todas as conexões abertas.

### 7.2. Desenho de Referência do `docker-compose.yml`

```yaml
services:
  postgres:
    image: postgres:16-alpine
    restart: unless-stopped
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - internal
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER} -d ${POSTGRES_DB}"]
      interval: 10s
      timeout: 5s
      retries: 5

  api:
    build:
      context: ./api
      dockerfile: Dockerfile
    restart: unless-stopped
    depends_on:
      postgres:
        condition: service_healthy
    environment:
      NODE_ENV: production
      PORT: 3000
      DATABASE_URL: postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}
      APP_URL: ${APP_URL}
      JWT_SECRET: ${JWT_SECRET}
      R2_ACCOUNT_ID: ${R2_ACCOUNT_ID}
      R2_ACCESS_KEY_ID: ${R2_ACCESS_KEY_ID}
      R2_SECRET_ACCESS_KEY: ${R2_SECRET_ACCESS_KEY}
      R2_BUCKET_NAME: ${R2_BUCKET_NAME}
      R2_PUBLIC_BASE_URL: ${R2_PUBLIC_BASE_URL}
      ABACATEPAY_API_KEY: ${ABACATEPAY_API_KEY}
      ABACATEPAY_WEBHOOK_SECRET: ${ABACATEPAY_WEBHOOK_SECRET}
    networks:
      - internal
      - dokploy-network
    healthcheck:
      test: ["CMD-SHELL", "wget -qO- http://localhost:3000/api/health || exit 1"]
      interval: 15s
      timeout: 5s
      retries: 3

  ui:
    build:
      context: ./ui
      dockerfile: Dockerfile
      args:
        VITE_API_BASE_URL: /api
        VITE_R2_PUBLIC_BASE_URL: ${R2_PUBLIC_BASE_URL}
    restart: unless-stopped
    depends_on:
      - api
    networks:
      - internal
      - dokploy-network

volumes:
  postgres_data:

networks:
  internal:
    driver: bridge
  dokploy-network:
    external: true
```

> [!NOTE]
> No painel do **Dokploy**, basta configurar o domínio principal apontando `/` para o serviço `ui` (porta `80`) e o path `/api` para o serviço `api` (porta `3000`) — ou deixar o `nginx.conf` do container `ui` fazer `proxy_pass http://api:3000/api/` internamente com `proxy_buffering off;`, expondo apenas o serviço `ui` ao Traefik. A segunda opção requer apenas **uma regra de domínio** no Dokploy.

### 7.3. Padrão dos Dockerfiles
* **`api/Dockerfile`:** Multi-stage em `node:22-alpine`. Estágio `builder` instala dependências e compila TypeScript (`tsc`); estágio `runner` instala apenas `omit=dev`, executa migrações Drizzle no entrypoint e sobe o processo sob usuário não-root (`USER node`).
* **`ui/Dockerfile`:** Multi-stage. Estágio `builder` em `node:22-alpine` gera `dist/` via Vite; estágio `runner` em `nginx:1.27-alpine` serve os arquivos estáticos com `try_files $uri $uri/ /index.html`, compressão `gzip` e proxy reverso `/api/` sem buffering para o serviço `api`.

---

## 8. Segurança, Rate Limiting e Ciclo de Vida

1. **Autenticação Segregada por Papel:**
   * **Anfitrião / Agência:** Sessão via JWT assinado em cookie `httpOnly`, `Secure`, `SameSite=Lax` (Magic Link por e-mail ou Google OAuth).
   * **Moderador Operacional (`/e/:slug/mod`):** Validação do PIN contra `moderation_pin_hash` (comparação *timing-safe* + *rate limit* estrito de 5 tentativas / 15 min por IP) emitindo um token curto escopado exclusivamente a `role: MODERATOR` e ao `eventId` correspondente, sem qualquer acesso a rotas financeiras ou outros eventos do workspace.
   * **Convidado:** Sem autenticação; identificado por `guestSessionId`, sujeito a *rate limit* combinado por `IP + guestSessionId` (ex: máx. 6 uploads/minuto por convidado, evitando congestionamento de NAT 4G onde vários convidados compartilham o mesmo IP de operadora).
2. **Restrições na Presigned URL do Cloudflare R2:**
   * Expiração curta (`120` segundos), método restrito a `PUT`, `Content-Type: image/webp` obrigatório e limite máximo de tamanho (`Content-Length` até `2MB`), impedindo abuso do bucket para hospedar arquivos arbitrários.
3. **Expiração e Limpeza Automática (Retention Job):**
   * Um job diário leve (`node-cron` dentro da própria API em horário de baixa, ex: `05:00 BRT`) localiza eventos cujo `expires_at` venceu (7 dias no `FREE_TRIAL`, 90 dias no `PRO_UNLOCKED`, 365 dias com Order Bump), remove os objetos correspondentes em lote no Cloudflare R2 (`DeleteObjectsCommand`) e marca a galeria como arquivada.
