## **Comandos Disponíveis**

* npm run dev: Inicia o servidor em modo de desenvolvimento (watch).  
* npm run build: Compila o projeto para o diretório dist/.  
* npm start: Inicia o servidor em modo de produção (a partir do dist/).  
* npm run check: Valida a tipagem TypeScript do projeto sem emitir arquivos.  


## **Guia Estrutural e Arquitetural da API**

> [!IMPORTANT]
> ### 🚫 **Proibição Absoluta de Barrel Files e Re-exports (Zero Barrel Files)**
> É **estritamente proibido** criar ou manter barrel files ou arquivos que centralizem/reexportem múltiplos módulos no backend.
> - **Zero arquivos centralizadores/reexportadores:** cada model, middleware, utilitário, schema ou repositório deve ser consumido via importação direta do arquivo que o define.
> - **O papel do `index.ts` do domínio:** o `index.ts` de cada domínio **não é um barrel file**. Sua única finalidade é exportar como `default` a definição tipada `DomainDefinition` com `name` e `actions` para o registrador no `server.ts`. É proibido reexportar repositórios, middlewares ou types no `index.ts` do domínio.
> - **Importação direta obrigatória:** todo e qualquer consumo deve ser feito via importação direta do arquivo específico (ex: `import { syncAuthUser } from '@domains/users/actions/auth'`, `import authMiddleware from '@domains/users/middlewares/auth'`, `import userRepository from '@domains/users/repositories'`).

> [!IMPORTANT]
> ### 🔒 **Validação Centralizada e Estrita de Variáveis de Ambiente (`src/config/env/`)**
> Toda e qualquer variável de ambiente utilizada no backend deve ser validada de forma estrita e centralizada em `src/config/env/` com schema Zod:
> - **Validação de Conteúdo com Zod:** Todas as variáveis devem ter seus formatos e conteúdos validados (URLs válidas, portas numéricas, prefixos específicos, tamanhos mínimos de chaves, enums de ambiente).
> - **Sem Fallbacks:** É **estritamente proibido** o uso de fallbacks ou valores padrão (`|| fallback`, `.default(...)`) nas variáveis de ambiente. Se qualquer variável estiver ausente ou com conteúdo inválido, a aplicação aborta imediatamente (`process.exit(1)`) impedindo o servidor de iniciar.
> - **Zero Validações em Serviços:** É proibido validar variáveis de ambiente de forma dispersa dentro de serviços (ex: banco de dados, Firebase, e-mail). Todos os serviços devem importar e consumir diretamente os valores já validados de `@config/env`.

> [!NOTE]
> ### 📁 **Padrão Obrigatório para Módulos de Configuração (`src/config/<modulo>/index.ts` e `types.ts`)**
> Cada configuração em `src/config/` deve residir em sua própria pasta isolada:
> - `<modulo>/index.ts`: Lógica de configuração e exportações principais.
> - `<modulo>/types.ts`: Tipagens, schemas e contratos TypeScript (quando necessário).

> [!NOTE]
> ### ⚙️ **Padrão Obrigatório para Middlewares (`<nome>/index.ts` e `<nome>/types.ts`)**
> Todos os middlewares (tanto globais em `src/middlewares/` quanto específicos de domínio em `src/domains/<dominio>/middlewares/`) devem seguir estritamente o padrão de diretório:
> - `<middleware>/index.ts` (lógica de execução e exportação)
> - `<middleware>/types.ts` (tipos, contratos e opções)

> [!NOTE]
> ### ⚡ **Padrão Obrigatório para Ações de Domínio (`domains/<dominio>/actions/<acao>/`)**
> Toda pasta de ação deve manter a separação estrita de responsabilidades:
> - `<acao>/index.ts`: Exclusivamente definições e exportações de ações via `defineAction`. É proibido declarar funções utilitárias ou tipagens diretamente no `index.ts`.
> - `<acao>/types.ts`: Tipagens DTOs inferidas do Zod e interfaces/tipos auxiliares da ação (ex: payloads de token, contratos internos).
> - `<acao>/schemas.ts`: Schemas Zod e documentação OpenAPI.
> - `<acao>/utils/`: Pasta separada para funções utilitárias e helpers específicos da ação (ex: `utils/<helper>.ts`), consumidos via importação direta.

> [!NOTE]
> ### 🛠️ **Padrão Obrigatório para Utilitários (`src/utils/<util>/index.ts` e `types.ts`)**
> Cada utilitário ou módulo helper em `src/utils/` deve residir isolado em sua própria pasta, contendo:
> - `<util>/index.ts`: Lógica da utilidade e exportações principais.
> - `<util>/types.ts`: Tipagens e contratos TypeScript (quando necessário).

Este documento define os padrões para desenvolvimento na API. Toda a aplicação fica centralizada diretamente em `src/`, utilizando path aliases dedicados por módulo (`@config/*`, `@database/*`, `@docs/*`, `@domains/*`, `@email/*`, `@error/*`, `@factories/*`, `@firebase/*`, `@middlewares/*`, `@payment/*`, `@routes/*`, `@utils/*`) além do alias base `@/*`.

### **Estrutura de Diretórios**

A pasta `src/` organiza a aplicação de forma limpa e modular:

* `src/server.ts` (Inicialização do servidor HTTP, conexões e rotinas)
* `src/app.ts` (Configuração da aplicação Express e middlewares globais)
* `src/routes/` (Roteamento central da API: `index.ts` e `api.ts`)
* `src/domains/` (Domínios de negócio isolados)
  * `users/` (Domínio de usuários e autenticação)
    * `actions/` (Ações de autenticação e perfil com separação em `index.ts`, `schemas.ts`, `types.ts` e `utils/`)
    * `repositories/` (Model Mongoose `UserModel` e `userRepository`)
    * `middlewares/` (Middlewares do domínio: `auth/` e `admin/`)
    * `index.ts` (Centralizador público do domínio)
  * `system/` (Domínio de infraestrutura e auditoria do sistema)
    * `actions/` (Ações do sistema)
    * `repositories/` (Model Mongoose `LogModel` e `logRepository`)
    * `index.ts` (Centralizador público do domínio)
* `src/middlewares/` (Middlewares globais padronizados com `index.ts` e `types.ts`)
  * `manageRequest/` (Middleware centralizador de validação Zod e execução de ações)
  * `rateLimit/` (Limitadores de taxa global e de rotas sensíveis)
  * `upload/` (Tratamento de uploads de arquivos via Multer em memória)
  * `permissions/` (Verificação de permissões do usuário)
* `src/database/` (Conexão e inicialização do MongoDB via Mongoose)
* `src/firebase/` (Serviços do Firebase: Auth e Storage)
* `src/payment/` (Gateway de pagamento AbacatePay: inicialização e cliente)
* `src/config/` (Configurações modulares com padrão `<modulo>/index.ts` e `types.ts`)
  * `app/` (Configuração global da aplicação e resolução de versão)
  * `cors/` (Configuração de origens CORS para o Express)
  * `domain/` (Definição, registro de domínios e mapeamento automático de endpoints)
  * `env/` (Validação centralizada estrita de variáveis de ambiente com schema Zod e exportação tipada)
* `src/utils/` (Utilitários reutilizáveis com padrão `<util>/index.ts` e `types.ts`)
  * `date/` (Formatação e cálculos de datas: `formatTimestamp`, `formatDateBR`, `addDays`, `isPast`)
  * `logger/` (Instância de log estilizado e prefixado: `createLogger` e tipo `Logger`)
  * `object/` (Manipulação de objetos e limpeza de campos: `filterObject`, `removeUndefined`)
* `src/docs/` (Gerador e registro do OpenAPI/Swagger)
* `src/factories/` (Factories utilitárias como `defineAction`, `pagination`, `filters`)

### **Regras de Implementação por Camada**

#### **1. Ações / Controllers (`domains/<dominio>/actions/entidade/index.ts`)**

As ações **não usam** controllers tradicionais do Express. Elas usam a factory `defineAction` que integra metadados da rota (`method`, `path`), validação Zod, OpenAPI, middlewares automáticos (autenticação via `authenticate: true` e permissões) e injeção de dependências (`ids`, `manageError`). A ação resultante é um `ActionHandler` executável diretamente pelo Express com seus metadados anexados para registro automático.

> [!IMPORTANT]
> **Regra estrita do `index.ts` da ação:**
> O arquivo `index.ts` destina-se **exclusivamente** à definição e exportação de ações com `defineAction`.
> - **Proibido no `index.ts`:** Nenhuma interface/tipo (`type`, `interface`) e nenhuma função utilitária/helper deve ser declarada no `index.ts`.
> - **Tipagens:** Devem residir no arquivo `types.ts` da ação.
> - **Funções utilitárias/helpers:** Devem residir em uma pasta `utils/` dedicada dentro do diretório da ação (ex: `utils/resolveFrontendBaseUrl.ts`) e consumidas via importação direta.

```ts
import defineAction from '@factories/defineAction'
import { schemaExemplo } from './schemas'  
import entidadeRepository from '@domains/entidade/repositories'

import type { ManageRequestResponse, ManageRequestBody } from '@middlewares/manageRequest/types'
import type { ExemploRequest, ExemploResponse } from './types'

export const criarExemplo = defineAction(  
  {  
    method: 'post',  
    path: '/entidades/create',  
    summary: 'Criar nova entidade',  
    tags: ['Entidades'],  
    authenticate: true,  
    responses: {  
      200: { description: 'Sucesso', schema: schemaExemplo }  
    }  
  },  
  async ({ ids, data, manageError }: ManageRequestBody<ExemploRequest>): ManageRequestResponse<ExemploResponse> => {  
    if (!ids.userId) return manageError({ code: 'unauthorized' })

    const entidade = await entidadeRepository.create(data)

    if (!entidade) return manageError({ code: 'conflict' })

    return entidade  
  },  
  { body: schemaExemplo }  
)
```

#### **2. Schemas Zod + OpenAPI (`domains/<dominio>/actions/entidade/schemas.ts`)**

Toda validação e documentação deve ser feita via Zod com o plugin `@asteasolutions/zod-to-openapi`.

```ts
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'  
import { z } from 'zod'

import { createPaginatedSchema, paginationQuerySchema } from '@factories/pagination/schemas'
import { createFilterQuerySchema } from '@factories/filters/schemas'

import type { FilterConfig } from '@factories/filters/types'

extendZodWithOpenApi(z)

export const entidadeFiltersConfig: FilterConfig = {  
  partial: ['nome', 'descricao'],  
  exact: ['status', 'id']  
}

export const entidadeSchema = z.object({  
  id: z.string().openapi({ example: 'chave-unica' }),  
  nome: z.string().min(1).openapi({ example: 'Nome Exemplo' })  
}).openapi('EntidadeResponse')

export const criarEntidadeSchema = z.object({  
  nome: z.string().min(1).openapi({ example: 'Nome Exemplo' })  
}).openapi('CriarEntidade')

export const listEntidadesQuerySchema = z.object({  
  status: z.string().optional()  
}).merge(paginationQuerySchema).merge(createFilterQuerySchema(entidadeFiltersConfig)).openapi('ListEntidadesQuery')

export const listEntidadesResponseSchema = createPaginatedSchema(entidadeSchema, 'ListEntidadesResponse')
```

#### **3. Tipos DTOs e Tipagens da Ação (`domains/<dominio>/actions/entidade/types.ts`)**

Os tipos DTOs de request e response devem ser obrigatoriamente inferidos do Zod. Além disso, quaisquer tipos ou interfaces auxiliares da ação (como payloads de tokens JWT, contratos internos ou opções) devem residir no `types.ts`, nunca no `index.ts`.

```ts
import { listEntidadesQuerySchema, listEntidadesResponseSchema, criarEntidadeSchema, entidadeSchema } from './schemas'

import type { z } from 'zod'

export type CriarEntidadeRequest = { body: z.infer<typeof criarEntidadeSchema> }

export type ListEntidadesRequest = { query: z.infer<typeof listEntidadesQuerySchema> }

export type EntidadeResponse = z.infer<typeof entidadeSchema>

export type ListEntidadesResponse = z.infer<typeof listEntidadesResponseSchema>

// Tipagens e interfaces auxiliares específicas da ação
export interface ExemploTokenPayload {
  purpose: 'exemplo'
  userId: string
}
```

#### **4. Funções Utilitárias da Ação (`domains/<dominio>/actions/entidade/utils/`)**

Funções utilitárias ou helpers específicos de uma ação **não devem** ser declarados no `index.ts`. Devem residir em uma pasta `utils/` dedicada dentro do diretório da ação, consumidos via importação direta:

```ts
// domains/users/actions/auth/utils/resolveFrontendBaseUrl.ts
export const resolveFrontendBaseUrl = (redirectUrl?: string, requestOrigin?: string): string => {
  // Lógica utilitária isolada
  return origin
}

export default resolveFrontendBaseUrl
```

#### **5. Repositórios e Models (`domains/<dominio>/repositories/`)**

Cada domínio isola seu próprio `model.ts`, `types.ts` e repositório `index.ts` encapsulando as operações no MongoDB.

```ts
// domains/entidade/repositories/model.ts
import mongoose, { Schema } from 'mongoose'
import type { EntidadeType } from './types'

const entidadeSchema = new Schema(
  {
    _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
    nome: { type: String, required: true },
    createdAt: { type: String, default: () => new Date().toISOString() }
  },
  { versionKey: false }
)

export const EntidadeModel = mongoose.models.Entidade || mongoose.model('Entidade', entidadeSchema)
export default EntidadeModel
```

```ts
// domains/entidade/repositories/index.ts
import EntidadeModel from './model'
import type { CreateEntidadePayload, EntidadeType } from './types'  

export const entidadeRepository = {  
  findById: async (id: string): Promise<EntidadeType | null> => {  
    const doc = await EntidadeModel.findById(id).lean()
    if (!doc) return null
    return { ...doc, id: String(doc._id) }
  },  
  create: async (data: CreateEntidadePayload): Promise<EntidadeType> => {  
    const created = await EntidadeModel.create(data)
    const doc = created.toObject ? created.toObject() : created
    return { ...doc, id: String(doc._id) }
  }  
}

export { EntidadeModel }
export * from './types'
export default entidadeRepository
```

#### **6. Definição do Domínio para Registro (`domains/<dominio>/index.ts`)**

O `index.ts` do domínio **não é um barrel file** (não reexporta repositories, middlewares ou models). Sua função exclusiva é exportar como `default` um objeto tipado `DomainDefinition` contendo o nome do domínio e suas ações para consumo do registrador:

```ts
// domains/users/index.ts
import * as authActions from './actions/auth'
import type { DomainDefinition } from '../types'

export const usersDomain: DomainDefinition<typeof authActions> = {
  name: 'users',
  actions: authActions
}

export default usersDomain
```

#### **7. Registrador de Domínios (`src/config/domain/index.ts` e `server.ts`)**

O registro dos domínios fica centralizado em `src/config/domain/index.ts`. O `server.ts` importa os domínios e inicializa o registro na inicialização da API:

```ts
// server.ts
import { registerDomains } from '@config/domain'
import usersDomain from '@domains/users'
import systemDomain from '@domains/system'

const startServer = async (): Promise<void> => {
  registerDomains([usersDomain, systemDomain])
  // inicialização do app e serviços...
}
```

```ts
// config/domain/index.ts
import type { DomainDefinition, DomainRegistry } from './types'

export const registeredDomains: DomainRegistry = new Map()

export const registerDomain = (domain: DomainDefinition): void => {
  const isAlreadyRegistered = registeredDomains.has(domain.name)
  registeredDomains.set(domain.name, domain)

  if (!isAlreadyRegistered) {
    const actionCount = Object.keys(domain.actions || {}).length
    logger.info(`Domain registered: [${domain.name}] with ${actionCount} actions`)
  }
}

export const registerDomains = (domains: DomainDefinition[]): void => {
  for (const domain of domains) {
    registerDomain(domain)
  }
}
```

#### **8. Registro Dinâmico de Endpoints por Domínio (`routes/api.ts` e `config/domain`)**

Os endpoints da API são registrados **dinamicamente a partir dos domínios cadastrados**, eliminando arquivos manuais e repetitivos de rotas (`routes/<dominio>.routes.ts`). Cada ação criada via `defineAction` já carrega seu método HTTP, path e cadeia de middlewares necessários:

```ts
// routes/api.ts
import { Router } from 'express'
import { registerDomainEndpoints } from '@config/domain'

export const createApiRouter = (): Router => {
  const apiRouter = Router()
  // Registra todos os endpoints automaticamente a partir das ações dos domínios
  registerDomainEndpoints(apiRouter)
  return apiRouter
}

export default createApiRouter
```

Ao executar, `registerDomainEndpoints` percorre as ações de cada domínio no registro e associa os endpoints ao roteador Express automaticamente, garantindo rastreabilidade com logs dedicados:
`[INFO] Endpoint registered: [POST] /auth/sync (users.syncAuthUser)`

#### **9. Utilitários e Helpers Globais (`utils/<nome>/index.ts` e `types.ts`)**

Cada utilitário fica isolado em seu próprio subdiretório, contendo a lógica central em `index.ts` e contratos de tipos em `types.ts` quando necessário:

```ts
// utils/logger/types.ts
export type LogLevel = 'info' | 'warn' | 'error' | 'success'

export interface Logger {
  info: (...args: unknown[]) => void
  warn: (...args: unknown[]) => void
  error: (...args: unknown[]) => void
  success: (...args: unknown[]) => void
}

// utils/logger/index.ts
import type { Logger } from './types'

export const createLogger = (prefix: string): Logger => {
  // Lógica de log estilizado
  return logger
}

export default createLogger
```

#### **10. Configuração e Validação de Ambiente (`src/config/env/index.ts` e `types.ts`)**

Todas as variáveis de ambiente devem ser declaradas no schema Zod em `types.ts` e validadas em `index.ts`. Fallbacks são terminantemente proibidos e qualquer inconsistência aborta o processo imediatamente:

```ts
// config/env/types.ts
import { z } from 'zod'

export const serverEnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  PORT: z.coerce.number().int().min(1).max(65535),
  FRONTEND_URL: z.string().url(),
  CORS_ORIGIN: z.string().min(1),
  JWT_SECRET: z.string().min(16),
  MONGODB_URI: z.string().regex(/^mongodb(\+srv)?:\/\//),
  MONGODB_DB_NAME: z.string().min(1),
  FIREBASE_PROJECT_ID: z.string().min(1),
  FIREBASE_CLIENT_EMAIL: z.string().email(),
  FIREBASE_PRIVATE_KEY: z.string().min(1),
  FIREBASE_STORAGE_BUCKET: z.string().min(1)
})

export type ServerEnv = z.infer<typeof serverEnvSchema>
```

```ts
// config/env/index.ts
import 'dotenv/config'
import createLogger from '@utils/logger'
import { serverEnvSchema, type ServerEnv } from './types'

const logger = createLogger('env')

const validateServerEnv = (): ServerEnv => {
  const result = serverEnvSchema.safeParse(process.env)

  if (!result.success) {
    logger.error('Configuração inválida de variáveis de ambiente (.env)')
    process.exit(1)
  }

  return result.data
}

export const env = validateServerEnv()
export const { PORT, NODE_ENV, ... } = env
export default env
```

