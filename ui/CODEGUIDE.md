## **Diretrizes Críticas e Fundamentais (Mobile-First, Nomenclatura & Zero Barrel)**

> [!IMPORTANT]
> ### 📱 **Prioridade Absoluta: Mobile-First e Responsividade Perfeita**
> O maior volume de uso deste SaaS é e será em dispositivos móveis (smartphones dos convidados escaneando QR code em eventos, tirando fotos em tempo real, interagindo no feed e acompanhando o evento).  
> **A Landing Page e todas as telas DEVEM funcionar perfeitamente no mobile:**
> - **Nenhum elemento deve quebrar ou transbordar:** é expressamente proibido qualquer componente causar overflow horizontal (scroll lateral indesejado).
> - **Ajuste de proporções e dimensões:** nenhum item pode ficar grande demais ou desajustado em telas pequenas (a partir de 360px de largura).
> - **Escalabilidade responsiva:** tipografia, botões, espaçamentos (paddings/margins), logos e grids devem utilizar os breakpoints do Material-UI (`xs`, `sm`, `md`, `lg`) com abordagem Mobile-First.
> - **Botões e alvos de toque:** botões e CTAs devem ocupar largura total ou confortável no mobile (`width: { xs: '100%', sm: 'auto' }`), com alturas e áreas de toque acessíveis (mínimo 48px).

> [!IMPORTANT]
> ### 🚫 **Proibição Absoluta de Barrel Exports (Zero Barrel Files)**
> É **estritamente proibido** criar ou manter arquivos de barril (barrel exports / `index.ts` que apenas centralizam ou reexportam módulos, componentes, páginas, tipos ou utilitários) em qualquer lugar deste projeto (`src/components/`, `src/pages/`, `src/pages/[pagina]/sections/`, `src/pages/[pagina]/subcomponents/`, `src/api/`, etc.).
> - **Zero arquivos `index.ts` reexportadores:** não crie arquivos cujo único papel seja fazer `export * from` ou `export { X } from './X'`.
> - **Importação direta obrigatória:** todo e qualquer consumo deve ser feito via import direto do arquivo ou pasta específica de destino (`import Hero from './sections/hero'`, `import { Navbar } from './subcomponents/navbar'`, `import Logo from '@components/logo'`).

> [!IMPORTANT]
> ### 📁 **Nomenclatura Obrigatória de Pastas: Sempre camelCase (Letra Minúscula Inicial)**
> Todas as pastas de componentes — compartilhados em `src/components/`, páginas em `src/pages/`, seções em `src/pages/[pagina]/sections/` e subcomponentes em `src/pages/[pagina]/subcomponents/` — **DEVEM OBRIGATORIAMENTE começar com letra minúscula seguindo camelCase**.  
> - **Correto:** `landingPage/`, `authPage/`, `resetPassword/`, `errorPage/`, `notFound/`, `navbar/`, `hero/`, `howItWorks/`, `interactiveDemo/`, `liveWall/`, `guestFeed/`, `finalCta/`, `footer/`, `brandSymbol/`, `logo/`, `themeToggle/`  
> - **Proibido:** `LandingPage/`, `Hero/`, `LoginForm/` (PascalCase em pastas é proibido)  
> *Nota: Os componentes React (funções) e tipos continuam utilizando PascalCase no código (`LandingPage`, `HeroProps`), apenas as pastas seguem camelCase.*

---

## **Comandos Disponíveis**

* `npm run dev`: Inicia a aplicação em modo de desenvolvimento via Vite.
* `npm run build`: Compila a aplicação para produção (`tsc -b && vite build`).
* `npm run check`: Valida a tipagem TypeScript do projeto sem emitir arquivos (`tsc -b`).
* `npm run lint`: Executa a validação de linter com ESLint.
* `npm run preview`: Executa um servidor local para visualizar a build gerada.


## **Guia Estrutural e Arquitetural do Frontend (UI)**

Este documento define os padrões para desenvolvimento no Frontend. Toda a aplicação fica centralizada em `src/`, utilizando path aliases dedicados por módulo (`@actions`, `@assets`, `@components`, `@config`, `@hooks`, `@interceptor`, `@pages`, `@stores`, `@theme`) além do alias base `@/*`.

### **Estrutura de Diretórios**

A pasta `src/` organiza a aplicação de forma limpa, modular e desacoplada:

* `src/main.tsx` (Ponto de entrada do React, inicialização do DOM e Providers)
* `src/router.tsx` (Definição de rotas da aplicação via React Router)
* `src/theme/` (Configurações do tema MUI, paleta de cores e tipografia)
* `src/stores/` (Gerenciamento de estado global com Zustand)
* `src/api/` (Integração com API REST e autenticação)
  * `interceptor/` (Instância do Axios, types e interceptors para injeção de token e refresh automático)
  * `actions/` (Ações de API segregadas por domínio, ex: `auth`, com suas funções diretas)
* `src/hooks/` (Hooks customizados reutilizáveis)
* `src/components/` (Componentes compartilhados e globais — sem barrel file)
* `src/pages/` (Páginas da aplicação, suas sections/ estruturais e subcomponents/ locais — sem barrel file)

---

### **Padrão Obrigatório de Pastas: A Tríade (index, styles, types)**

Tanto os componentes compartilhados (`src/components/`) quanto as seções (`src/pages/[pagina]/sections/`) e os subcomponentes locais (`src/pages/[pagina]/subcomponents/`) devem **obrigatoriamente** ser organizados em pastas individuais (convenção camelCase) contendo a seguinte estrutura com 3 arquivos:

1. `index.tsx`: O componente React com a estrutura do JSX. Deve conter `export default NomeComponente`. **Não** deve reexportar tipos do arquivo `types.ts`.
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
└── brandSymbol/
    ├── index.tsx
    ├── styles.ts
    └── types.ts
```

> **Atenção:** **NÃO deve existir** arquivo barrel (`src/components/index.ts`) para reexportar componentes. Todo consumo deve ser feito via import direto pelo path alias: `import Logo from '@components/logo'`.

#### **Estrutura de Exemplo para Páginas (`src/pages/`):**

Nas páginas, organizamos os elementos de forma modular sem qualquer arquivo de barril:
- **`sections/`:** Contém as seções verticais estruturais que compõem o fluxo/narrativa da página (ex: `hero/`, `howItWorks/`, `interactiveDemo/`, `finalCta/`).
- **`subcomponents/`:** Contém os componentes dedicados da página (ex: `navbar/`, `footer/`, `liveWall/`, `guestFeed/`).

```
src/pages/
├── landingPage/
│   ├── index.tsx
│   ├── data.ts
│   ├── sections/
│   │   ├── hero/
│   │   │   ├── index.tsx
│   │   │   ├── styles.ts
│   │   │   └── types.ts
│   │   ├── howItWorks/
│   │   ├── interactiveDemo/
│   │   └── finalCta/
│   └── subcomponents/
│       ├── navbar/
│       │   ├── index.tsx
│       │   ├── styles.ts
│       │   └── types.ts
│       ├── footer/
│       ├── liveWall/
│       └── guestFeed/
├── authPage/
│   ├── index.tsx
│   ├── styles.ts
│   ├── types.ts
│   └── hooks/
│       └── useAuthForm.ts
├── resetPassword/
│   ├── index.tsx
│   ├── hooks/
│   └── subcomponents/
│       └── resetPasswordForm/
├── errorPage/
│   ├── index.tsx
│   └── subcomponents/
│       └── errorContent/
└── notFound/
    ├── index.tsx
    └── subcomponents/
        └── notFoundContent/
```

---

### **Regras de Implementação para Componentes**

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
Isole todos os estilos visuais utilizando a tipagem `SxProps<Theme>` do MUI ou funções geradoras:

```ts
import type { SxProps, Theme } from '@mui/material'
import { brandColors } from '@theme'

export const getLogoContainerStyles = (isDark: boolean, gap: number | string): SxProps<Theme> => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap,
  userSelect: 'none',
  textDecoration: 'none',
  color: isDark ? brandColors.flashYellow : brandColors.ink
})
```

#### **3. Componente (`index.tsx`)**
Consome os estilos e os tipos criados nos arquivos adjacentes. Deve manter `export default`:

```tsx
import { Box } from '@mui/material'
import { useTheme } from '@mui/material/styles'

import { getLogoContainerStyles } from './styles'
import type { LogoProps } from './types'

const Logo = ({ size = 'medium', sx, ...rest }: LogoProps) => {
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

export default Logo
```

#### **4. Padrão de Importação Direta (Zero Barrel Files)**
Importe componentes, seções e subcomponentes diretamente pela pasta ou arquivo correspondente:

```tsx
// Correto:
import Logo from '@components/logo'
import ThemeToggle from '@components/themeToggle'
import BrandSymbol from '@components/brandSymbol'
import Hero from './sections/hero'
import { Navbar } from './subcomponents/navbar'

// Caso necessite tipagens externamente, importe diretamente de /types:
import type { LogoProps } from '@components/logo/types'

// Proibido (qualquer arquivo barrel / index.ts que reexporta):
// import { Logo } from '@components'
// import { Hero, HowItWorks } from './sections'
// import { Navbar, Footer } from './subcomponents'
```
