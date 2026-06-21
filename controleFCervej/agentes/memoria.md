# Memoria - FermentaTrack

Este arquivo guarda contexto consolidado para proximas interacoes da IA no projeto.

## Frontend

Fonte analisada: `controleFCervej/agentes/fermentatrack-frontend.md`.

O frontend planejado deve ser uma aplicacao React + TypeScript criada com Vite.
Ele deve consumir a API .NET existente em:

```text
http://localhost:5077
```

Em desenvolvimento, o Vite deve usar proxy para redirecionar chamadas `/api/*` para a API:

```ts
server: {
  proxy: {
    '/api': 'http://localhost:5077',
  },
}
```

## Stack do frontend

- React
- TypeScript
- Vite
- React Router
- Axios
- Tailwind CSS

## Design system ArBrain

Fonte principal:

```text
Montserrat
```

Paleta:

```text
#1D1D2D - brand-dark, sidebar e headers
#063852 - brand-navy, elementos secundarios escuros
#ACBBCD - brand-slate, bordas e textos secundarios
#A4A4A4 - brand-gray, textos desabilitados
#EBEBEB - brand-light, fundo de paginas e inputs
#FFC524 - brand-yellow, acao primaria, destaques e atencao
#9CD497 - brand-green, dentro do padrao
#FA9897 - brand-red, fora do padrao
```

Status exibidos no frontend:

```text
dentro_padrao -> Dentro do Padrao -> verde
atencao       -> Atencao          -> amarelo
fora_padrao  -> Fora do Padrao   -> vermelho
```

## Estrutura frontend esperada

```text
src/
  components/
    layout/
      Sidebar.tsx
      Header.tsx
      PageWrapper.tsx
    ui/
      Badge.tsx
      Button.tsx
      Card.tsx
      Input.tsx
      Select.tsx
      Table.tsx
  pages/
    Dashboard.tsx
    Cervejas.tsx
    Tanques.tsx
    Parametros.tsx
    Registros.tsx
    Lotes.tsx
  services/
    api.ts
    cervejas.ts
    tanques.ts
    parametros.ts
    registros.ts
    lotes.ts
    dashboard.ts
  types/
    index.ts
  router.tsx
  main.tsx
```

## Paginas obrigatorias

### F5 - Dashboard

Rota: `/`

Deve mostrar:

- total de registros;
- registros dentro do padrao;
- registros em atencao;
- registros fora do padrao.

Consumir:

```text
GET /api/dashboard
```

### F1 - Cervejas

Rota: `/cervejas`

Deve listar, cadastrar, editar e excluir cervejas.
Campos: `nome`, `estilo`.

Consumir:

```text
GET    /api/cervejas
POST   /api/cervejas
PUT    /api/cervejas/{id}
DELETE /api/cervejas/{id}
```

### F2 - Tanques

Rota: `/tanques`

Deve listar, cadastrar, editar e excluir tanques.
Campos: `nome`, `capacidade`.

Consumir:

```text
GET    /api/tanques
POST   /api/tanques
PUT    /api/tanques/{id}
DELETE /api/tanques/{id}
```

### F3 - Parametros aceitaveis

Rota: `/parametros`

Deve permitir selecionar uma cerveja e editar os parametros aceitaveis dela.

Campos:

```text
tempMin
tempMax
phMin
phMax
extratoMin
extratoMax
```

Consumir:

```text
GET /api/cervejas/{cervejaId}/parametros
PUT /api/cervejas/{cervejaId}/parametros
```

### F4 - Registros fermentativos

Rota: `/registros`

Deve listar registros, cadastrar novo registro e filtrar por cerveja, tanque, lote e status.

Campos de cadastro:

```text
cervejaId
tanqueId
numeroLote
dataHora
temperatura
ph
extrato
observacoes
```

O frontend nao deve calcular status como verdade final. A API retorna o registro ja classificado.

Consumir:

```text
GET    /api/registros
POST   /api/registros
DELETE /api/registros/{id}
```

### F6 - Historico de lotes

Rota: `/lotes`

Deve listar lotes e mostrar os registros do lote em ordem cronologica.

Consumir:

```text
GET /api/lotes
GET /api/lotes/{numero}
```

## Tipos TypeScript importantes

Tipos esperados no frontend:

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
```

## Pontos de atencao encontrados

- O arquivo `fermentatrack-frontend.md` esta com caracteres quebrados no terminal, mas o conteudo e compreensivel.
- A documentacao frontend sugere `getLotes(): string[]`, mas a API atual retorna objetos de resumo de lote, nao apenas strings.
- Para o frontend, ajustar o tipo de lotes para refletir a API atual:

```ts
export interface LoteResumo {
  numeroLote: string
  totalRegistros: number
  primeiraMedicao: string
  ultimaMedicao: string
  ultimoStatus: StatusFermentacao
}
```

- A API atual usa `capacidade` no cadastro de tanques, nao `capacidadeL`.
- Usar `Badge` para mapear status da API para labels amigaveis.
- Prever loading, estado vazio e mensagens de erro amigaveis em todas as paginas.
- Evitar `any`; tipar todos os retornos da API.

## Ordem recomendada para implementar frontend

1. Criar projeto Vite React TypeScript.
2. Configurar Tailwind, Montserrat e proxy do Vite.
3. Criar tipos em `src/types/index.ts`.
4. Criar camada `services/` com Axios.
5. Criar layout base: Sidebar, Header e PageWrapper.
6. Criar componentes UI: Badge, Button, Card, Input, Select e Table.
7. Implementar Dashboard.
8. Implementar Cervejas.
9. Implementar Tanques.
10. Implementar Parametros.
11. Implementar Registros.
12. Implementar Lotes.
