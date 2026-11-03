## **Comandos Disponíveis**

* npm run dev: Inicia o servidor em modo de desenvolvimento (watch).  
* npm run build: Compila o projeto para o diretório dist/.  
* npm start: Inicia o servidor em modo de produção (a partir do dist/).  
* npm run check: Valida a tipagem TypeScript do projeto sem emitir arquivos.  


## **Guia Estrutural e Arquitetural da API**

> [!IMPORTANT]
> ### 🚫 **Proibição Absoluta de Barrel Exports e Arquivos Centralizadores (Zero Barrel Files)**
> É **estritamente proibido** criar ou manter arquivos de barril ou qualquer arquivo que centralize/reexporte múltiplos módulos no backend (ex: `repositories/model.ts`, `models.ts`, `repositories/index.ts`, `services/index.ts`).
> - **Zero arquivos centralizadores:** cada model, entidade, serviço ou repositório deve ficar isolado exclusivamente dentro de sua pasta de domínio (ex: `src/repositories/user/model.ts`, `src/repositories/log/model.ts`). É proibido criar arquivos com a finalidade de agrupar ou reexportar múltiplos models ou módulos de entidades diferentes.
> - **Importação direta obrigatória:** todo e qualquer consumo deve ser feito via importação direta do arquivo específico do domínio (ex: `import UserModel from '@repositories/user/model'`, `import { connectDatabase } from '@database/connect'`).

Este documento define os padrões para desenvolvimento na API. Toda a aplicação fica centralizada diretamente em `src/`, utilizando path aliases dedicados por módulo (`@actions/*`, `@config/*`, `@database/*`, `@docs/*`, `@email/*`, `@error/*`, `@factories/*`, `@firebase/*`, `@middlewares/*`, `@repositories/*`, `@routes/*`, `@utils/*`) além do alias base `@/*`.

### **Estrutura de Diretórios**

A pasta `src/` organiza a aplicação de forma limpa e modular:

* `src/server.ts` (Inicialização do servidor HTTP, conexões e rotinas)
* `src/app.ts` (Configuração da aplicação Express e middlewares globais)
* `src/routes/` (Roteamento central da API: `index.ts` e `api.ts`)
* `src/actions/` (Controladores lógicos e definição OpenAPI via `defineAction`)
  * `entidade/index.ts` (Lógica e defineAction)
  * `entidade/schemas.ts` (Schemas Zod estendidos com OpenAPI)
  * `entidade/types.ts` (Tipagens inferidas dos schemas Zod)
* `src/repositories/` (Camada de acesso a dados usando MongoDB via Mongoose)
  * `entidade/index.ts` (Métodos do repositório)
  * `entidade/model.ts` (Schema e Model Mongoose individual da entidade)
  * `entidade/types.ts` (Tipagens da entidade e payloads)
* `src/services/` (Serviços e rotinas em background)
* `src/middlewares/` (Middlewares de autenticação, admin, manageRequest, upload, etc.)
* `src/database/` (Conexão e inicialização do MongoDB via Mongoose)
* `src/firebase/` (Serviços do Firebase: Auth e Storage)
* `src/config/` (Configurações de ambiente, CORS, etc.)
* `src/docs/` (Gerador e registro do OpenAPI/Swagger)
* `src/factories/` (Factories utilitárias como `defineAction`, `pagination`, `filters`)

### **Regras de Implementação por Camada**

#### **1. Ações / Controllers (actions/entidade/index.ts)**

As ações **não usam** controllers tradicionais do Express. Elas usam a factory `defineAction` que integra rotas, validação Zod, OpenAPI e injeção de dependências (`ids`, `manageError`).

```ts
import defineAction from '@factories/defineAction'
import { schemaExemplo } from './schemas'  
import repositorioEntidade from '@repositories/entidade'

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

    const entidade = await repositorioEntidade.create(data)

    if (!entidade) return manageError({ code: 'conflict' })

    return entidade  
  },  
  { body: schemaExemplo }  
)
```

#### **2. Schemas Zod + OpenAPI (actions/entidade/schemas.ts)**

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

#### **3. Tipos DTOs (actions/entidade/types.ts)**

Os tipos devem ser obrigatoriamente inferidos do Zod.

```ts
import { listEntidadesQuerySchema, listEntidadesResponseSchema, criarEntidadeSchema, entidadeSchema } from './schemas'

import type { z } from 'zod'

export type CriarEntidadeRequest = { body: z.infer<typeof criarEntidadeSchema> }

export type ListEntidadesRequest = { query: z.infer<typeof listEntidadesQuerySchema> }

export type EntidadeResponse = z.infer<typeof entidadeSchema>

export type ListEntidadesResponse = z.infer<typeof listEntidadesResponseSchema>
```

#### **4. Repositórios e Models (repositories/entidade/index.ts e model.ts)**

Cada entidade possui seu próprio `model.ts` e seu repositório `index.ts` encapsulando as operações no MongoDB. Não existem arquivos de barril ou agregadores de models no nível `repositories/`.

```ts
// repositories/entidade/model.ts
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
// repositories/entidade/index.ts
import EntidadeModel from './model'
import type { CreateEntidadePayload, EntidadeType } from './types'  

const entidadeRepository = {  
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

export default entidadeRepository
```

#### **5. Rotas Modulares por Domínio (routes/*.routes.ts e routes/api.ts)**

As rotas são organizadas por domínio em arquivos dedicados (`routes/<dominio>.routes.ts`) e agregadas no `routes/api.ts`.

```ts
// routes/entidade.routes.ts
import { Router } from 'express'
import { criarExemplo } from '@actions/entidade'
import authMiddleware from '@middlewares/auth'

const entidadeRoutes = Router()

entidadeRoutes.post('/create', authMiddleware, criarExemplo)

export default entidadeRoutes
```

```ts
// routes/api.ts
import { Router } from 'express'
import entidadeRoutes from '@routes/entidade.routes'

const apiRouter = Router()

apiRouter.use('/entidades', entidadeRoutes)

export default apiRouter
```
