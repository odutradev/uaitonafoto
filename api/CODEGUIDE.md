## **Comandos Disponíveis**

* npm run dev: Inicia o servidor em modo de desenvolvimento (watch).  
* npm run build: Compila o projeto para o diretório dist/.  
* npm start: Inicia o servidor em modo de produção (a partir do dist/).  
* npm run check: Valida a tipagem TypeScript do projeto sem emitir arquivos.  


## **Guia Estrutural e Arquitetural da API**

> [!IMPORTANT]
> ### 🏛️ **Arquitetura Orientada a Domínios (`src/domains/`)**
> Toda lógica de negócio, repositórios de dados e controladores pertencem a domínios de negócio isolados em `src/domains/<dominio>/`.
> - **Estrutura interna de cada domínio:**
>   - `actions/`: Ações/controladores HTTP via `defineAction`, schemas Zod e DTOs tipados.
>   - `repositories/`: Modelos Mongoose, contratos de tipos e repositório de acesso ao MongoDB.
>   - `middlewares/` *(quando aplicável)*: Middlewares exclusivos do domínio, seguindo obrigatoriamente a convenção de pasta com `<nome>/index.ts` e `<nome>/types.ts`.
>   - `index.ts`: Arquivo centralizador do domínio que expõe publicamente actions, repositories, middlewares e tipagens.
> - **Consumo via Alias `@domains/*`:**
>   O consumo de elementos de um domínio por rotas ou outros serviços pode ser feito via import direto do domínio (ex: `import { userRepository, authMiddleware } from '@domains/users'`).

> [!NOTE]
> ### ⚙️ **Padrão Obrigatório para Middlewares (`<nome>/index.ts` e `<nome>/types.ts`)**
> Todos os middlewares (tanto globais em `src/middlewares/` quanto específicos de domínio em `src/domains/<dominio>/middlewares/`) devem seguir estritamente o padrão de diretório:
> - `<middleware>/index.ts` (lógica de execução e exportação)
> - `<middleware>/types.ts` (tipos, contratos e opções)

Este documento define os padrões para desenvolvimento na API. Toda a aplicação fica centralizada diretamente em `src/`, utilizando path aliases dedicados por módulo (`@config/*`, `@database/*`, `@docs/*`, `@domains/*`, `@email/*`, `@error/*`, `@factories/*`, `@firebase/*`, `@middlewares/*`, `@routes/*`, `@utils/*`) além do alias base `@/*`.

### **Estrutura de Diretórios**

A pasta `src/` organiza a aplicação de forma limpa e modular:

* `src/server.ts` (Inicialização do servidor HTTP, conexões e rotinas)
* `src/app.ts` (Configuração da aplicação Express e middlewares globais)
* `src/routes/` (Roteamento central da API: `index.ts`, `api.ts` e `<dominio>.routes.ts`)
* `src/domains/` (Domínios de negócio isolados)
  * `users/` (Domínio de usuários e autenticação)
    * `actions/` (Ações de autenticação e perfil: `syncAuthUser`, `getMe`, `updateMe`, `forgotPassword`, `resetPassword`)
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
* `src/config/` (Configurações de ambiente, CORS, etc.)
* `src/docs/` (Gerador e registro do OpenAPI/Swagger)
* `src/factories/` (Factories utilitárias como `defineAction`, `pagination`, `filters`)

### **Regras de Implementação por Camada**

#### **1. Ações / Controllers (`domains/<dominio>/actions/entidade/index.ts`)**

As ações **não usam** controllers tradicionais do Express. Elas usam a factory `defineAction` que integra rotas, validação Zod, OpenAPI e injeção de dependências (`ids`, `manageError`).

```ts
import defineAction from '@factories/defineAction'
import { schemaExemplo } from './schemas'  
import { entidadeRepository } from '@domains/entidade'

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

#### **3. Tipos DTOs (`domains/<dominio>/actions/entidade/types.ts`)**

Os tipos devem ser obrigatoriamente inferidos do Zod.

```ts
import { listEntidadesQuerySchema, listEntidadesResponseSchema, criarEntidadeSchema, entidadeSchema } from './schemas'

import type { z } from 'zod'

export type CriarEntidadeRequest = { body: z.infer<typeof criarEntidadeSchema> }

export type ListEntidadesRequest = { query: z.infer<typeof listEntidadesQuerySchema> }

export type EntidadeResponse = z.infer<typeof entidadeSchema>

export type ListEntidadesResponse = z.infer<typeof listEntidadesResponseSchema>
```

#### **4. Repositórios e Models (`domains/<dominio>/repositories/`)**

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

#### **5. Centralizador do Domínio (`domains/<dominio>/index.ts`)**

Cada domínio centraliza suas exportações públicas em um único `index.ts`:

```ts
// domains/users/index.ts
export * from './actions'
export { default as userRepository, UserModel } from './repositories'
export * from './repositories/types'
export { default as authMiddleware } from './middlewares/auth'
export { default as adminMiddleware } from './middlewares/admin'
export * from './middlewares/auth/types'
export * from './middlewares/admin/types'
```

#### **6. Rotas Modulares por Domínio (`routes/*.routes.ts` e `routes/api.ts`)**

As rotas são organizadas por domínio em arquivos dedicados (`routes/<dominio>.routes.ts`) consumindo diretamente do domínio e agregadas no `routes/api.ts`.

```ts
// routes/auth.routes.ts
import { Router } from 'express'
import { syncAuthUser, getMe, updateMe, forgotPassword, resetPassword, authMiddleware } from '@domains/users'

const authRoutes = Router()

authRoutes.post('/sync', syncAuthUser)
authRoutes.post('/forgot-password', forgotPassword)
authRoutes.post('/reset-password', resetPassword)
authRoutes.get('/me', authMiddleware, getMe)
authRoutes.patch('/me', authMiddleware, updateMe)

export default authRoutes
```

```ts
// routes/api.ts
import { Router } from 'express'
import authRoutes from '@routes/auth.routes'

const apiRouter = Router()

apiRouter.use('/auth', authRoutes)

export default apiRouter
```
