## **Comandos Disponíveis**

* npm run dev: Inicia o servidor em modo de desenvolvimento (watch).  
* npm run build: Compila o projeto para o diretório dist/.  
* npm start: Inicia o servidor em modo de produção (a partir do dist/).  
* npm run check: Valida a tipagem TypeScript do projeto sem emitir arquivos.  


## **Guia Estrutural e Arquitetural da API**

Este documento define os padrões para desenvolvimento na API. Toda a aplicação fica centralizada diretamente em `src/`, utilizando o alias base `@/*`.

### **Estrutura de Diretórios**

A pasta `src/` organiza a aplicação de forma limpa e modular:

* `src/server.ts` (Inicialização do servidor HTTP, conexões e rotinas)
* `src/app.ts` (Configuração da aplicação Express e middlewares globais)
* `src/routes/` (Roteamento central da API: `index.ts` e `api.ts`)
* `src/actions/` (Controladores lógicos e definição OpenAPI via `defineAction`)
  * `entidade/index.ts` (Lógica e defineAction)
  * `entidade/schemas.ts` (Schemas Zod estendidos com OpenAPI)
  * `entidade/types.ts` (Tipagens inferidas dos schemas Zod)
* `src/repositories/` (Camada de acesso a dados usando Firebase Realtime Database)
  * `entidade/index.ts`
  * `entidade/types.ts`
* `src/services/` (Serviços e rotinas em background)
* `src/middlewares/` (Middlewares de autenticação, admin, manageRequest, upload, etc.)
* `src/database/` (Conexão e inicialização do Firebase)
* `src/config/` (Configurações de ambiente, CORS, etc.)
* `src/docs/` (Gerador e registro do OpenAPI/Swagger)
* `src/factories/` (Factories utilitárias como `defineAction`, `pagination`, `filters`)

### **Regras de Implementação por Camada**

#### **1. Ações / Controllers (actions/entidade/index.ts)**

As ações **não usam** controllers tradicionais do Express. Elas usam a factory `defineAction` que integra rotas, validação Zod, OpenAPI e injeção de dependências (`ids`, `manageError`).

```ts
import defineAction from '@/factories/defineAction'  
import { schemaExemplo } from './schemas'  
import repositorioEntidade from '@/repositories/entidade'

import type { ManageRequestResponse, ManageRequestBody } from '@/middlewares/manageRequest/types'  
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

import { createPaginatedSchema, paginationQuerySchema } from '@/factories/pagination/schemas'  
import { createFilterQuerySchema } from '@/factories/filters/schemas'

import type { FilterConfig } from '@/factories/filters/types'

extendZodWithOpenApi(z)

export const entidadeFiltersConfig: FilterConfig = {  
  partial: ['nome', 'descricao'],  
  exact: ['status', 'id']  
}

export const entidadeSchema = z.object({  
  id: z.string().openapi({ example: 'chave-unica-firebase' }),  
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

#### **4. Repositórios (repositories/entidade/index.ts)**

Centraliza as interações com o Firebase Realtime Database. Utiliza filtragem em memória para compensar limitações do RTDB em consultas complexas.

```ts
import { firebaseDb } from '@/database/connection'
import { entidadeFiltersConfig } from '@/actions/entidade/schemas'  
import { parseFilters, applyInMemoryFilters } from '@/factories/filters/utils'  
import { getPaginationOptions, buildPaginatedResponse } from '@/factories/pagination/utils'

import type { FindAllEntidadeFilters, CreateEntidadePayload, EntidadeType } from './types'  
import type { PaginatedResponse } from '@/factories/pagination/types'  

const REF_PATH = 'entidades'

const entidadeRepository = {  
  findAll: async (filters?: FindAllEntidadeFilters): Promise<PaginatedResponse<EntidadeType>> => {  
    const snapshot = await firebaseDb.ref(REF_PATH).once('value')
    const data = snapshot.val() as Record<string, EntidadeType> | null

    const parsedFilters = parseFilters(filters?.filters, entidadeFiltersConfig)
    const options = getPaginationOptions(filters)

    let rows: EntidadeType[] = []

    if (data) {
      const arrayData = Object.entries(data).map(([id, item]) => ({ ...item, id }))
      rows = applyInMemoryFilters(arrayData, parsedFilters, entidadeFiltersConfig)
    }

    const count = rows.length
    const paginatedRows = rows.slice(options.offset, options.offset + options.limit)

    return buildPaginatedResponse({ rows: paginatedRows, count }, options.page, options.limit)
  },  
  create: async (data: CreateEntidadePayload): Promise<EntidadeType> => {  
    const ref = firebaseDb.ref(REF_PATH).push()
    const id = ref.key as string

    const payload = { ...data, id, createdAt: new Date().toISOString() }

    await ref.set(payload)

    return payload
  }  
}

export default entidadeRepository
```

#### **5. Rotas Modulares por Domínio (routes/*.routes.ts e routes/api.ts)**

As rotas são organizadas por domínio em arquivos dedicados (`routes/<dominio>.routes.ts`) e agregadas no `routes/api.ts`.

```ts
// routes/entidade.routes.ts
import { Router } from 'express'
import { criarExemplo } from '@/actions/entidade/index'
import authMiddleware from '@/middlewares/auth'

const entidadeRoutes = Router()

entidadeRoutes.post('/create', authMiddleware, criarExemplo)

export default entidadeRoutes
```

```ts
// routes/api.ts
import { Router } from 'express'
import entidadeRoutes from '@/routes/entidade.routes'

const apiRouter = Router()

apiRouter.use('/entidades', entidadeRoutes)

export default apiRouter
```

