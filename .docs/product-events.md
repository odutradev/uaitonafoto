# UaiTôNaFoto — Produto e Regras de Negócio (Eventos)

## 1. Definição do produto

Galeria de fotos colaborativa para eventos (aniversários, casamentos, eventos corporativos etc.).
Convidados acessam o evento por **link** e enviam fotos. As fotos seguem três caminhos:

| Caminho | Descrição | Status |
|---|---|---|
| **Telão** | Exibição contínua das fotos do evento em tela | Planejado |
| **Feed** | Linha do tempo onde convidados podem curtir fotos | Planejado |
| **Álbum** | Acesso da equipe organizadora, após o fim do evento, com a perspectiva dos convidados | Planejado |

> Implementado até agora: domínio `events` (evento, configurações e equipe). Fotos, telão, feed, curtidas e álbum ainda não existem.

## 2. Atores

| Ator | Autenticação | O que faz |
|---|---|---|
| **Criador** (`creator`) | Conta | Quem cria o evento. Um por evento, não removível. |
| **Organizador** (`organizer`) | Conta | Convidado pelo criador para ajudar na gestão. |
| **Convidado** | Sem conta, via link (`guestToken`) | Envia fotos, vê o feed e curte (planejado). |

### Permissões da equipe

| Ação | Criador | Organizador |
|---|:-:|:-:|
| Ver evento e equipe | ✅ | ✅ |
| Editar dados e configurações | ✅ | ✅ |
| Excluir evento | ✅ | ❌ |
| Adicionar organizador | ✅ | ❌ |
| Remover organizador | ✅ | ✅ (somente a si mesmo) |
| Remover o criador | ❌ | ❌ |

## 3. Modelo de Evento

| Campo | Descrição |
|---|---|
| `name` | Nome (1–120 caracteres) |
| `description` | Opcional (até 500) |
| `type` | `birthday`, `wedding`, `corporate`, `other` |
| `startsAt` / `endsAt` | Início e fim do evento (ISO 8601). `endsAt` deve ser posterior a `startsAt` |
| `guestToken` | Token único gerado automaticamente, usado no link de acesso dos convidados |
| `settings` | Configurações base (abaixo) |
| `members` | Equipe: `{ userId, role, addedAt }` |

### Configurações (`settings`)

| Campo | Regra | Padrão |
|---|---|---|
| `uploadWindowHours` | Horas **após `endsAt`** em que ainda é possível enviar fotos (0–168). O envio abre em `startsAt`. | 24 |
| `galleryDurationDays` | Dias de disponibilidade da galeria após `endsAt` (1–365) | 30 |
| `maxPhotosPerGuest` | Máximo de fotos por convidado (1–100) | 10 |
| `photoVisibility` | `during_event`: fotos visíveis (telão/feed) no dia do evento · `after_event`: visíveis apenas quando o evento acabar | `during_event` |

Janelas derivadas:

- **Envio de fotos:** `startsAt` → `endsAt + uploadWindowHours`
- **Galeria disponível:** `startsAt` → `endsAt + galleryDurationDays`

> As janelas são calculadas a partir dos campos; ainda não há enforcement pois dependem do domínio de fotos.

## 4. API (domínio `events`)

Todas as rotas exigem autenticação e membro da equipe.

| Método | Rota | Descrição | Acesso |
|---|---|---|---|
| POST | `/events` | Cria evento (usuário vira criador) | Autenticado |
| GET | `/events` | Lista eventos do usuário (paginado) | Membro |
| GET | `/events/:id` | Detalhes do evento | Membro |
| PUT | `/events/:id` | Atualiza dados/configurações (parcial) | Criador/Organizador |
| DELETE | `/events/:id` | Exclui evento | Criador |
| GET | `/events/:id/team` | Lista equipe (com nome e e-mail) | Membro |
| POST | `/events/:id/team` | Adiciona organizador por e-mail (usuário já cadastrado) | Criador |
| DELETE | `/events/:id/team/:userId` | Remove organizador | Criador / o próprio organizador |

Erros: `400` período inválido, `403` sem permissão, `404` evento/usuário inexistente, `409` usuário já na equipe.

## 5. Regras gerais

1. O criador é sempre membro e não pode ser removido nem duplicado como organizador.
2. Um usuário tem um único papel por evento.
3. Organizadores só podem ser adicionados se já possuírem conta.
4. Atualização de datas é validada contra os valores já salvos (`endsAt > startsAt`).
5. A listagem retorna `myRole` com o papel do usuário em cada evento.

## 6. Estrutura de código

`api/src/domains/events/`: `repositories/` (model, types, repository), `actions/event/` (CRUD) e `actions/team/` (equipe), registrado em `server.ts`.

## 7. Próximos passos (fora do escopo atual)

- Domínio de fotos (upload via link, limite por convidado, enforcement das janelas)
- Identificação leve de convidado (nome/identificador por dispositivo) para aplicar `maxPhotosPerGuest`
- Telão, feed com curtidas e álbum da equipe
- Consumo de créditos do usuário na criação do evento e relação com `extraStorageDays` dos planos
- Exclusão em cascata das fotos ao excluir evento e expiração automática da galeria (rotina)
