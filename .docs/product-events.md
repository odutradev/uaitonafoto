# UaiTôNaFoto — Produto e Regras de Negócio (Eventos)

## 1. Definição do produto

Galeria de fotos colaborativa para eventos (aniversários, casamentos, eventos corporativos etc.).
Convidados acessam o evento por **link**, sem criar conta, e enviam fotos. Cada foto segue três caminhos:

| Caminho | Descrição | Quem usa |
|---|---|---|
| **Telão** | Exibição contínua das fotos do evento em uma tela (polling por cursor) | Equipe |
| **Feed** | Linha do tempo com curtidas | Convidados |
| **Álbum** | Todas as fotos, na perspectiva dos convidados, após o término do evento | Equipe |

## 2. Atores

| Ator | Autenticação | O que faz |
|---|---|---|
| **Criador** (`creator`) | Conta (Firebase/JWT) | Cria o evento. Um por evento, não removível. |
| **Organizador** (`organizer`) | Conta | Adicionado pelo criador para ajudar na gestão. |
| **Convidado** | Sem conta. Entra pelo `guestToken` do link informando um nome e recebe um JWT de sessão | Envia fotos, vê o feed, curte. |

### Permissões da equipe

| Ação | Criador | Organizador |
|---|:-:|:-:|
| Ver evento, equipe, convidados | ✅ | ✅ |
| Editar dados e configurações | ✅ | ✅ |
| Telão e álbum | ✅ | ✅ |
| Remover foto (moderação) | ✅ | ✅ |
| Excluir evento | ✅ | ❌ |
| Adicionar organizador | ✅ | ❌ |
| Remover organizador | ✅ | ✅ (somente a si mesmo) |
| Remover o criador | ❌ | ❌ |

## 3. Modelo de Evento

| Campo | Descrição |
|---|---|
| `name` | Nome (1–120) |
| `description` | Opcional (até 500) |
| `type` | `birthday`, `wedding`, `corporate`, `other` |
| `startsAt` / `endsAt` | Início e fim do evento (ISO 8601). `endsAt > startsAt` |
| `guestToken` | Token único gerado automaticamente, usado no link dos convidados |
| `settings` | Configurações base (abaixo) |
| `uploadsCloseAt` | **Calculado**: `endsAt + uploadWindowHours` |
| `galleryExpiresAt` | **Calculado**: `endsAt + galleryDurationDays` |
| `galleryCleanedAt` | Preenchido quando a rotina apagou as fotos |
| `members` | Equipe: `{ userId, role, addedAt }` |

Os campos calculados são recalculados a cada alteração de `endsAt` ou `settings`.

### Configurações (`settings`)

| Campo | Regra | Padrão |
|---|---|---|
| `uploadWindowHours` | Horas **após `endsAt`** em que ainda é possível enviar fotos (0–168) | 24 |
| `galleryDurationDays` | Dias de disponibilidade da galeria após `endsAt` (1–365) | 30 |
| `maxPhotosPerGuest` | Máximo de fotos por convidado (1–100) | 10 |
| `photoVisibility` | `during_event`: fotos visíveis (telão/feed) já durante o evento · `after_event`: visíveis só após `endsAt` | `during_event` |

## 4. Fases do evento

| Fase | Intervalo | Envio de fotos | Feed / telão |
|---|---|:-:|:-:|
| `upcoming` | antes de `startsAt` | ❌ | ❌ |
| `open` | `startsAt` → `uploadsCloseAt` | ✅ | conforme `photoVisibility` |
| `closed` | `uploadsCloseAt` → `galleryExpiresAt` | ❌ | ✅ |
| `expired` | após `galleryExpiresAt` | ❌ | ❌ (fotos apagadas) |

- Com `after_event`, feed e telão só mostram fotos a partir de `endsAt`, mesmo com o envio já aberto.
- **Álbum da equipe:** liberado a partir de `endsAt` (independe de `photoVisibility`).
- Convidados não entram em eventos `expired`; o JWT do convidado expira em `galleryExpiresAt`.

## 5. Fotos

- Envio: `multipart/form-data`, campo `file`; JPEG, PNG ou WebP; até **10 MB**.
- O tipo é validado pelo **conteúdo** (assinatura do arquivo), não só pelo header.
- Armazenamento: Firebase Storage em `events/{eventId}/photos/{photoId}.{ext}` com URL pública e cache longo. O `photoId` aleatório torna a URL não adivinhável.
- Limite por convidado (`maxPhotosPerGuest`) validado no envio (409 ao exceder).
- Convidado pode excluir as próprias fotos; a equipe pode excluir qualquer foto.
- Se o registro no banco falhar após o upload, o arquivo é removido do storage.

### Curtidas
- Uma curtida por convidado por foto; a rota alterna (curtir/descurtir) e devolve `liked` e `likesCount`.
- Exige fotos visíveis (mesma regra do feed). `likesCount` é denormalizado na foto.

### Telão
- `GET /events/:id/screen?since=<cursor>`: devolve fotos novas em ordem cronológica e `nextSince`. O cliente repete a chamada com o cursor recebido.

## 6. Ciclo de vida e limpeza

- **Excluir evento** (criador): apaga fotos no storage, fotos, curtidas, convidados e o evento.
- **Rotina `expireGalleries`** (a cada hora e na subida): para eventos com `galleryExpiresAt` vencido, apaga fotos e curtidas e define `galleryCleanedAt`. O evento e os convidados são mantidos como histórico.

## 7. API

### Equipe (autenticado — Bearer token de usuário)

| Método | Rota | Descrição | Acesso |
|---|---|---|---|
| POST | `/events` | Cria evento | Autenticado |
| GET | `/events` | Lista eventos do usuário (paginado) | Membro |
| GET | `/events/:id` | Detalhes | Membro |
| PUT | `/events/:id` | Atualiza (parcial) | Criador/Organizador |
| DELETE | `/events/:id` | Exclui evento e dados | Criador |
| GET | `/events/:id/team` | Lista equipe | Membro |
| POST | `/events/:id/team` | Adiciona organizador por e-mail (usuário já cadastrado) | Criador |
| DELETE | `/events/:id/team/:userId` | Remove organizador | Criador / o próprio |
| GET | `/events/:id/guests` | Convidados com nº de fotos | Membro |
| GET | `/events/:id/screen` | Telão (cursor `since`, `limit`) | Membro |
| GET | `/events/:id/album` | Álbum paginado (`guestId` opcional), só após `endsAt` | Membro |
| DELETE | `/events/:id/photos/:photoId` | Remove foto | Membro |

### Convidado

| Método | Rota | Auth | Descrição |
|---|---|---|---|
| GET | `/guest/events/:token` | Pública | Dados públicos do evento e `phase` |
| POST | `/guest/events/:token/join` | Pública (rate limit) | Cria convidado, devolve `guestToken` (JWT) |
| GET | `/guest/me` | Convidado | Sessão, evento e cota (`photosSent`/`photosRemaining`) |
| POST | `/guest/photos` | Convidado (rate limit) | Upload da foto |
| GET | `/guest/feed` | Convidado | Feed paginado, com `likedByMe` e `mine` |
| POST | `/guest/photos/:id/like` | Convidado | Alterna curtida |
| DELETE | `/guest/photos/:id` | Convidado | Exclui foto própria |

Erros comuns: `400` arquivo/período inválido, `401` token ausente/inválido, `403` fase ou permissão, `404` inexistente, `409` conflito ou limite atingido.

## 8. Rotas e Telas do Frontend (`ui/`)

O link de acesso dos convidados utiliza exclusivamente o conjunto aleatório de caracteres (`guestToken` de 12 caracteres base64url gerado pela API), nunca o nome do evento:

- **Link do convidado:** `/e/:token` (ex: `/e/k3J9xQ2mZ1aB`)

| Rota | Acesso | Descrição |
|---|---|---|
| `/app` | Autenticado | Lista os eventos do usuário (criador/organizador) e modal de criação |
| `/app/events/:id` | Equipe | Painel do evento: link aleatório + QR Code, álbum pós-evento (com filtro por convidado e remoção de fotos), edição de configurações, gestão da equipe e exclusão (criador) |
| `/app/events/:id/screen` | Equipe | Telão em tela cheia com rotação automática das fotos, polling incremental (`since`) e QR Code enquanto aguarda fotos |
| `/e/:token` | Público / Convidado | Página mobile-first do convidado: identificação por nome (gera sessão salva em `localStorage`), envio de fotos respeitando `maxPhotosPerGuest` e janela de upload, feed paginado com curtidas e exclusão da própria foto |

## 9. Estrutura de código

```
api/src/domains/events/
  repositories/ events | guests | photos | likes
  middlewares/  guestSession      (JWT de convidado)
  utils/        eventWindows, guestToken, detectImageType, photoStorage,
                loadGuestContext, loadTeamAccess, purgeEventPhotos
  actions/      event | team | guest | photo | album
api/src/routines/events/expireGalleries

ui/src/
  api/actions/  events | guest
  config/       events.ts, eventPhase.ts
  components/   eventFormFields
  pages/app/    home | eventDetails | eventScreen
  pages/public/ guestEvent
```

## 10. Pontos de atenção / pendências

- Limite por convidado é "soft": convidado pode criar outra sessão com novo nome. Para reforçar, associar à sessão do dispositivo/IP.
- Fotos têm URL pública (não adivinhável). Para privacidade total, migrar para URLs assinadas.
- Moderação limitada à exclusão (sem fila de aprovação).
- Créditos do usuário (`payments`) ainda não são cobrados na criação do evento.
- Sem redimensionamento/thumbnails; as imagens são guardadas no tamanho original.
- Download em lote do álbum (ZIP) não implementado.
