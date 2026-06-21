# FermentaTrack — Guia de implementação do Frontend

> Documento para ser seguido por uma IA ao implementar o frontend React + TypeScript
> do sistema de controle fermentativo para cervejarias.

---

## Contexto do projeto

Sistema web para registro e acompanhamento de dados fermentativos em cervejarias.
O backend é uma API REST em C#/.NET 8 rodando em `http://localhost:5077`.

**O frontend deve:**
- Consumir a API REST já existente
- Seguir o design system da ArBrain (detalhado abaixo)
- Cobrir as 6 funcionalidades obrigatórias
- Ser implementado em React + TypeScript com Vite

---

## Design system ArBrain

### Fonte
**Montserrat** (Google Fonts) — usar em todos os textos.

```html
<!-- Adicionar no index.html -->
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet">
```

### Paleta de cores

| Nome | Hex | Uso |
|---|---|---|
| `brand-dark` | `#1D1D2D` | Fundo do sidebar, headers |
| `brand-navy` | `#063852` | Elementos secundários escuros |
| `brand-slate` | `#ACBBCD` | Bordas, textos secundários |
| `brand-gray` | `#A4A4A4` | Textos desabilitados |
| `brand-light` | `#EBEBEB` | Fundo de páginas, inputs |
| `brand-yellow` | `#FFC524` | Ação primária, destaques, logo |
| `brand-green` | `#9CD497` | Status "Dentro do Padrão" |
| `brand-red` | `#FA9897` | Status "Fora do Padrão" |

### Status de classificação

| Status (API) | Label exibido | Cor |
|---|---|---|
| `dentro_padrao` | Dentro do Padrão | `#9CD497` (verde) |
| `atencao` | Atenção | `#FFC524` (amarelo) |
| `fora_padrao` | Fora do Padrão | `#FA9897` (vermelho) |

---

## Setup inicial

### 1. Criar o projeto

```bash
npm create vite@latest fermentatrack-web -- --template react-ts
cd fermentatrack-web
npm install
```

### 2. Instalar dependências

```bash
npm install react-router-dom axios
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### 3. Configurar Tailwind (`tailwind.config.js`)

```js
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
      },
      colors: {
        brand: {
          dark:   '#1D1D2D',
          navy:   '#063852',
          slate:  '#ACBBCD',
          gray:   '#A4A4A4',
          light:  '#EBEBEB',
          yellow: '#FFC524',
          green:  '#9CD497',
          red:    '#FA9897',
        },
      },
    },
  },
  plugins: [],
}
```

### 4. Configurar CSS global (`src/index.css`)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  font-family: 'Montserrat', sans-serif;
  background-color: #EBEBEB;
}
```

### 5. Configurar proxy no Vite (`vite.config.ts`)

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:5077',
    },
  },
})
```

> O proxy evita erros de CORS em desenvolvimento. Todas as chamadas `/api/*`
> são redirecionadas para a API .NET automaticamente.

---

## Estrutura de pastas

```
src/
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx          # Navegação lateral
│   │   ├── Header.tsx           # Cabeçalho da página
│   │   └── PageWrapper.tsx      # Wrapper com sidebar + conteúdo
│   └── ui/
│       ├── Badge.tsx            # Badge de status (Dentro/Atenção/Fora)
│       ├── Button.tsx           # Botão padrão
│       ├── Card.tsx             # Card de conteúdo
│       ├── Input.tsx            # Campo de texto
│       ├── Select.tsx           # Campo select
│       └── Table.tsx            # Tabela genérica
├── pages/
│   ├── Dashboard.tsx            # F5 — indicadores
│   ├── Cervejas.tsx             # F1 — lista + cadastro
│   ├── Tanques.tsx              # F2 — lista + cadastro
│   ├── Parametros.tsx           # F3 — parâmetros por cerveja
│   ├── Registros.tsx            # F4 — lista + novo registro
│   └── Lotes.tsx                # F6 — histórico de lote
├── services/
│   ├── api.ts                   # Instância axios com baseURL
│   ├── cervejas.ts
│   ├── tanques.ts
│   ├── parametros.ts
│   ├── registros.ts
│   ├── lotes.ts
│   └── dashboard.ts
├── types/
│   └── index.ts                 # Interfaces TypeScript
├── router.tsx                   # Definição de rotas
└── main.tsx
```

---

## Tipos TypeScript (`src/types/index.ts`)

```ts
export interface Cerveja {
  id: string
  nome: string
  estilo: string
}

export interface Tanque {
  id: string
  nome: string
  capacidade: number
}

export interface Parametros {
  cervejaId: string
  tempMin: number
  tempMax: number
  phMin: number
  phMax: number
  extratoMin: number
  extratoMax: number
}

export type StatusFermentacao = 'dentro_padrao' | 'atencao' | 'fora_padrao'

export interface Registro {
  id: string
  cervejaId: string
  cervejaNome?: string
  tanqueId: string
  tanqueNome?: string
  numeroLote: string
  dataHora: string
  temperatura: number
  ph: number
  extrato: number
  observacoes?: string
  status: StatusFermentacao
}

export interface DashboardData {
  totalRegistros: number
  dentroPadrao: number
  atencao: number
  foraPadrao: number
}

export interface LoteHistorico {
  numeroLote: string
  registros: Registro[]
}
```

---

## Serviços (`src/services/`)

### `api.ts`
```ts
import axios from 'axios'

// Base URL usa proxy do Vite em dev; em produção apontar para URL da API
const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

export default api
```

### `cervejas.ts`
```ts
import api from './api'
import { Cerveja } from '../types'

export const getCervejas = () => api.get<Cerveja[]>('/cervejas')
export const getCerveja = (id: string) => api.get<Cerveja>(`/cervejas/${id}`)
export const createCerveja = (data: Omit<Cerveja, 'id'>) => api.post<Cerveja>('/cervejas', data)
export const updateCerveja = (id: string, data: Omit<Cerveja, 'id'>) => api.put<Cerveja>(`/cervejas/${id}`, data)
export const deleteCerveja = (id: string) => api.delete(`/cervejas/${id}`)
```

### `tanques.ts`
```ts
import api from './api'
import { Tanque } from '../types'

export const getTanques = () => api.get<Tanque[]>('/tanques')
export const createTanque = (data: Omit<Tanque, 'id'>) => api.post<Tanque>('/tanques', data)
export const updateTanque = (id: string, data: Omit<Tanque, 'id'>) => api.put<Tanque>(`/tanques/${id}`, data)
export const deleteTanque = (id: string) => api.delete(`/tanques/${id}`)
```

### `parametros.ts`
```ts
import api from './api'
import { Parametros } from '../types'

export const getParametros = (cervejaId: string) =>
  api.get<Parametros>(`/cervejas/${cervejaId}/parametros`)

export const saveParametros = (cervejaId: string, data: Omit<Parametros, 'cervejaId'>) =>
  api.put<Parametros>(`/cervejas/${cervejaId}/parametros`, data)
```

### `registros.ts`
```ts
import api from './api'
import { Registro } from '../types'

export const getRegistros = (filtros?: {
  cervejaId?: string
  tanqueId?: string
  numeroLote?: string
  status?: string
}) => api.get<Registro[]>('/registros', { params: filtros })

export const getRegistro = (id: string) => api.get<Registro>(`/registros/${id}`)

export const createRegistro = (data: Omit<Registro, 'id' | 'status'>) =>
  api.post<Registro>('/registros', data)

export const deleteRegistro = (id: string) => api.delete(`/registros/${id}`)
```

### `lotes.ts`
```ts
import api from './api'
import { LoteHistorico } from '../types'

export const getLotes = () => api.get<string[]>('/lotes')
export const getLoteHistorico = (numero: string) =>
  api.get<LoteHistorico>(`/lotes/${numero}`)
```

### `dashboard.ts`
```ts
import api from './api'
import { DashboardData } from '../types'

export const getDashboard = () => api.get<DashboardData>('/dashboard')
```

---

## Rotas (`src/router.tsx`)

```tsx
import { createBrowserRouter } from 'react-router-dom'
import PageWrapper from './components/layout/PageWrapper'
import Dashboard from './pages/Dashboard'
import Cervejas from './pages/Cervejas'
import Tanques from './pages/Tanques'
import Parametros from './pages/Parametros'
import Registros from './pages/Registros'
import Lotes from './pages/Lotes'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PageWrapper />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'cervejas', element: <Cervejas /> },
      { path: 'tanques', element: <Tanques /> },
      { path: 'parametros', element: <Parametros /> },
      { path: 'registros', element: <Registros /> },
      { path: 'lotes', element: <Lotes /> },
      { path: 'lotes/:numero', element: <Lotes /> },
    ],
  },
])
```

---

## Layout (`src/components/layout/`)

### Sidebar
- Fundo `brand-dark` (`#1D1D2D`)
- Logo ArBrain no topo com acento `brand-yellow`
- Links de navegação: Dashboard, Cervejas, Tanques, Parâmetros, Registros, Lotes
- Link ativo destacado com borda esquerda `brand-yellow` e fundo levemente mais claro
- Largura fixa: `240px`

### Header
- Fundo branco com sombra sutil
- Título da página atual
- Fundo do conteúdo: `brand-light` (`#EBEBEB`)

### PageWrapper
- Layout: `flex` com sidebar fixo à esquerda + conteúdo principal à direita
- Conteúdo com padding `p-8`

---

## Componente Badge (`src/components/ui/Badge.tsx`)

```tsx
import { StatusFermentacao } from '../../types'

const config: Record<StatusFermentacao, { label: string; className: string }> = {
  dentro_padrao: {
    label: 'Dentro do Padrão',
    className: 'bg-brand-green text-green-900',
  },
  atencao: {
    label: 'Atenção',
    className: 'bg-brand-yellow text-yellow-900',
  },
  fora_padrao: {
    label: 'Fora do Padrão',
    className: 'bg-brand-red text-red-900',
  },
}

export default function Badge({ status }: { status: StatusFermentacao }) {
  const { label, className } = config[status]
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${className}`}>
      {label}
    </span>
  )
}
```

---

## Páginas — especificação por funcionalidade

### F5 — Dashboard (`/`)
**Indicadores obrigatórios:**
- Total de registros fermentativos
- Registros dentro do padrão
- Registros que requerem atenção
- Registros fora do padrão

**Layout:** 4 cards lado a lado com número grande e label abaixo.
Cores dos cards seguem o status (verde, amarelo, vermelho, azul escuro para total).
Consumir: `GET /api/dashboard`

---

### F1 — Cervejas (`/cervejas`)
**Funcionalidades:**
- Listar cervejas em tabela (Nome, Estilo, ações)
- Formulário inline ou modal para cadastrar nova cerveja
- Editar e excluir cerveja existente
- Botão "Definir parâmetros" que leva para F3

**Campos do formulário:** `nome` (obrigatório), `estilo` (obrigatório)
Consumir: `GET/POST/PUT/DELETE /api/cervejas`

---

### F2 — Tanques (`/tanques`)
**Funcionalidades:**
- Listar tanques em tabela (Nome, Capacidade em litros, ações)
- Formulário para cadastrar, editar e excluir tanque

**Campos do formulário:** `nome` (obrigatório), `capacidade` em litros (obrigatório, número)
Consumir: `GET/POST/PUT/DELETE /api/tanques`

---

### F3 — Parâmetros aceitáveis (`/parametros`)
**Funcionalidades:**
- Selecionar uma cerveja (dropdown)
- Exibir e editar os parâmetros aceitáveis dela

**Campos:** `tempMin`, `tempMax`, `phMin`, `phMax`, `extratoMin`, `extratoMax`
Consumir: `GET/PUT /api/cervejas/{cervejaId}/parametros`

> Exibir unidades ao lado de cada campo: °C para temperatura, sem unidade para pH, °P para extrato.

---

### F4 — Registros fermentativos (`/registros`)
**Funcionalidades:**
- Listar registros com badge de status
- Formulário para novo registro
- Filtros por cerveja, tanque, lote e status

**Campos do formulário:**
- `cervejaId` — select com cervejas cadastradas
- `tanqueId` — select com tanques cadastrados
- `numeroLote` — texto livre
- `dataHora` — datetime
- `temperatura` — número decimal
- `ph` — número decimal
- `extrato` — número decimal
- `observacoes` — texto opcional

**Ao salvar:** a API retorna o registro já com o `status` classificado automaticamente.
Exibir o resultado com o Badge correspondente.

Consumir: `GET/POST/DELETE /api/registros`

---

### F6 — Histórico de lotes (`/lotes`)
**Funcionalidades:**
- Listar lotes distintos disponíveis
- Ao selecionar um lote, exibir todos os registros em ordem cronológica
- Mostrar evolução: data, temperatura, pH, extrato, status

**Layout:** lista de lotes à esquerda, timeline de registros à direita.
Exibir data formatada em `dd/MM` conforme exemplo do desafio.

Consumir: `GET /api/lotes` e `GET /api/lotes/{numero}`

---

## Regras gerais de implementação

- **Comentários obrigatórios:** o desafio exige comentários explicativos no código.
  Comentar a lógica de cada componente, serviço e decisão não óbvia.
- **Tratamento de erro:** exibir mensagem amigável quando a API falhar.
- **Estado de carregamento:** exibir indicador de loading enquanto aguarda resposta da API.
- **Estado vazio:** exibir mensagem orientativa quando não houver dados ("Nenhuma cerveja cadastrada ainda.").
- **Responsividade:** o layout deve funcionar em telas a partir de 1024px.
- **TypeScript estrito:** sem uso de `any`. Todos os dados da API tipados via `src/types/index.ts`.

---

## Ordem de implementação recomendada

1. Setup do projeto (Vite, Tailwind, dependências)
2. `src/types/index.ts`
3. `src/services/api.ts` + serviços individuais
4. Layout base: `Sidebar`, `Header`, `PageWrapper`, `router.tsx`
5. Componentes UI: `Badge`, `Button`, `Card`, `Input`, `Select`, `Table`
6. Página Dashboard (F5) — valida a integração com a API
7. Página Cervejas (F1)
8. Página Tanques (F2)
9. Página Parâmetros (F3)
10. Página Registros (F4) — mais complexa, depende de F1, F2 e F3
11. Página Lotes (F6)
12. Revisão de comentários e tratamento de erros
