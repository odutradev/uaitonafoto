import path from 'path'
import fs from 'fs'

export const resolveAppVersion = (): string => {
  const candidates = [
    path.resolve(process.cwd(), 'uaitonafoto-package.json'),
    path.resolve(process.cwd(), '../uaitonafoto-package.json'),
    path.resolve(process.cwd(), '../package.json'),
    path.resolve(process.cwd(), 'package.json')
  ]

  for (const candidate of candidates) {
    try {
      if (fs.existsSync(candidate)) {
        const parsed = JSON.parse(fs.readFileSync(candidate, 'utf-8')) as { name?: string; version?: string }
        if (parsed.name === 'uaitonafoto' && parsed.version) {
          return parsed.version
        }
        if (parsed.version && !parsed.name?.includes('api') && !parsed.name?.includes('ui')) {
          return parsed.version
        }
      }
    } catch {}
  }

  return '1.0.0'
}

export const metadata = {
  title: 'uai to na foto API Documentation',
  version: resolveAppVersion(),
  description: `
Documentação automática das rotas do sistema.

## Padrões da API

### Paginação
Endpoints que retornam listas suportam paginação através dos seguintes query parameters:
- page (number): Define a página atual da listagem. O valor mínimo é 1 (padrão: 1).
- limit (number): Define a quantidade máxima de itens retornados por página. O valor máximo permitido é 100 (padrão: 10).

A resposta de endpoints paginados sempre seguirá a estrutura padrão contendo o objeto meta (com total de páginas, total de registros, limite e página atual) e o array data.

### Filtros Dinâmicos
Endpoints de listagem podem suportar filtragem dinâmica através do query parameter filters.
O formato esperado é uma string única onde chaves e valores são separados sequencialmente por vírgulas:
Formato padrão: chave1,valor1,chave2,valor2
Exemplo de uso: ?filters=username,admin,isResource,true

As regras de busca (exata ou busca parcial/iLike) dependem da configuração específica de cada entidade na camada de repositório. Consulte as opções de filtro na documentação de cada rota.
`.trim()
}

export const info = metadata
export default metadata
