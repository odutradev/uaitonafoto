## **Comandos Disponíveis**

* `npm run dev`: Inicia a aplicação em modo de desenvolvimento via Vite.
* `npm run build`: Compila a aplicação para produção (`tsc -b && vite build`).
* `npm run check`: Valida a tipagem TypeScript do projeto sem emitir arquivos (`tsc -b`).
* `npm run lint`: Executa a validação de linter com ESLint.
* `npm run preview`: Executa um servidor local para visualizar a build gerada.


## **Guia Estrutural e Arquitetural do Frontend (UI)**

Este documento define os padrões para desenvolvimento no Frontend. Toda a aplicação fica centralizada em `src/`, utilizando path aliases dedicados por módulo (`@assets`, `@components`, `@config`, `@hooks`, `@lib`, `@pages`, `@services`, `@stores`, `@theme`, `@appTypes`, `@utils`) além do alias base `@/*`.

### **Estrutura de Diretórios**

A pasta `src/` organiza a aplicação de forma limpa, modular e desacoplada:

* `src/main.tsx` (Ponto de entrada do React, inicialização do DOM e Providers)
* `src/router.tsx` (Definição de rotas da aplicação via React Router)
* `src/theme/` (Configurações do tema MUI, paleta de cores e tipografia)
* `src/stores/` (Gerenciamento de estado global com Zustand)
* `src/services/` (Comunicação com APIs externas e serviços Firebase)
* `src/hooks/` (Hooks customizados reutilizáveis)
* `src/components/` (Componentes compartilhados e globais)
* `src/pages/` (Páginas da aplicação e seus subcomponentes locais)

---

### **Padrão Obrigatório de Pastas: A Tríade (index, styles, types)**

Tanto os componentes compartilhados (`src/components/`) quanto as páginas e seus subcomponentes (`src/pages/`) devem **obrigatoriamente** ser organizados em pastas individuais contendo a seguinte estrutura com 3 arquivos:

1. `index.tsx`: O componente React responsável pela lógica e estrutura do JSX. Exporta o componente de forma nomeada e default, e reexporta suas interfaces de propriedades.
2. `styles.ts`: Objeto de estilos ou funções geradoras com tipagem `SxProps<Theme>` do Material-UI (`@mui/material`). Nenhum estilo inline complexo deve permanecer no JSX.
3. `types.ts`: Definições de tipos, contratos e interfaces TypeScript exclusivas do componente.

#### **Estrutura de Exemplo para Componentes (`src/components/`):**

```
src/components/
├── logo/
│   ├── index.tsx
│   ├── styles.ts
│   └── types.ts
├── themeToggle/
│   ├── index.tsx
│   ├── styles.ts
│   └── types.ts
├── brandSymbol/
│   ├── index.tsx
│   ├── styles.ts
│   └── types.ts
└── index.ts  <-- Barrel export centralizado de todos os componentes
```

#### **Estrutura de Exemplo para Páginas (`src/pages/`):**

```
src/pages/
├── home/
│   ├── index.tsx
│   ├── data.ts
│   ├── subcomponents/
│   │   ├── Navbar/
│   │   │   ├── index.tsx
│   │   │   ├── styles.ts
│   │   │   └── types.ts
│   │   ├── Hero/
│   │   │   ├── index.tsx
│   │   │   ├── styles.ts
│   │   │   └── types.ts
│   │   └── index.ts
├── login/
│   ├── index.tsx
│   ├── hooks/
│   └── subcomponents/
│       ├── LoginForm/
│       │   ├── index.tsx
│       │   ├── styles.ts
│       │   └── types.ts
│       └── index.ts
└── index.ts
```

---

### **Regras de Implementação**

#### **1. Types (`types.ts`)**
Centralize todas as interfaces e tipos que definem as propriedades e variações visuais aceitas pelo componente:

```ts
import type { BoxProps } from '@mui/material'

export type LogoSize = 'small' | 'medium' | 'large' | number
export type LogoVariant = 'light' | 'dark' | 'auto'

export interface LogoProps extends BoxProps {
  size?: LogoSize
  variant?: LogoVariant
  symbolOnly?: boolean
}
```

#### **2. Styles (`styles.ts`)**
Isole todos os estilos visuais utilizando a tipagem `SxProps<Theme>` do MUI ou funções que dependem do tema / propriedades:

```ts
import type { SxProps, Theme } from '@mui/material'
import { brandColors } from '@theme/theme'

export const getLogoContainerStyles = (isDark: boolean, gap: number | string): SxProps<Theme> => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap,
  userSelect: 'none',
  textDecoration: 'none',
  color: isDark ? brandColors.amareloFlash : brandColors.tinta
})
```

#### **3. Componente (`index.tsx`)**
Consome os estilos e os tipos criados nos arquivos adjacentes, mantendo o JSX limpo e focado em apresentação estrutural:

```tsx
import { Box } from '@mui/material'
import { useTheme } from '@mui/material/styles'

import { getLogoContainerStyles } from './styles'
import type { LogoProps } from './types'

export const Logo = ({ size = 'medium', sx, ...rest }: LogoProps) => {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'

  return (
    <Box
      sx={[
        getLogoContainerStyles(isDark, 1),
        ...(Array.isArray(sx) ? sx : [sx])
      ]}
      {...rest}
    />
  )
}

export type { LogoProps } from './types'
export default Logo
```

#### **4. Barrel Export (`src/components/index.ts`)**
Todos os componentes são centralizados e exportados através de `src/components/index.ts` para facilitar os imports pelo alias `@components/index` ou `@components`:

```ts
export { BrandSymbol } from './brandSymbol'
export type { BrandSymbolProps } from './brandSymbol'
export { Logo } from './logo'
export type { LogoProps } from './logo'
export { ThemeToggle } from './themeToggle'
export type { ThemeToggleProps } from './themeToggle'
```
