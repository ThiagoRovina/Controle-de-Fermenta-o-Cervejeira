# FermentaTrack — Arquitetura do projeto

> Aplicação web para registro e acompanhamento de dados fermentativos em cervejarias.

---

## Visão geral

```
fermentatrack/
├── frontend/          # React + Vite + TypeScript
├── backend/           # ASP.NET Core Web API (.NET 8)
├── database/          # PostgreSQL (migrations + seeds)
└── docs/              # Documentação técnica
```

A aplicação segue arquitetura **cliente-servidor** desacoplada:
o frontend consome uma API REST provida pelo backend,
que por sua vez persiste os dados em um banco relacional.

---

## Backend atual — `controleFCervej/FermentaTrack-api/`

O backend esta sendo implementado em C# com ASP.NET Core Web API (.NET 8).
A organizacao atual segue modulos por dominio, cada um separado em
`controller`, `service`, `model` e `repository`.

```
controleFCervej/
├── Program.cs
├── controleFCervej.csproj
└── FermentaTrack-api/
    ├── cervejas/
    ├── tanques/
    ├── parametros/
    ├── registros/
    ├── lotes/
    └── dashboard/
```

Cada modulo segue a estrutura `controller/`, `service/`, `model` e, quando precisa
de acesso a dados proprio, `repository/`.

Responsabilidades:

- `controller`: recebe as requisicoes HTTP e devolve respostas da API.
- `service`: concentra regras da funcionalidade, validacoes e orquestracao.
- `model`: define entidades e contratos usados pela API.
- `repository`: concentra o acesso aos dados no PostgreSQL.

Endpoints implementados nesta etapa:

| Metodo | Rota | Descricao |
|---|---|---|
| GET | `/api/cervejas` | Lista todas as cervejas |
| POST | `/api/cervejas` | Cadastra nova cerveja |
| GET | `/api/cervejas/{id}` | Detalha uma cerveja |
| PUT | `/api/cervejas/{id}` | Edita uma cerveja |
| DELETE | `/api/cervejas/{id}` | Remove uma cerveja |
| GET | `/api/tanques` | Lista todos os tanques |
| POST | `/api/tanques` | Cadastra novo tanque |
| GET | `/api/tanques/{id}` | Detalha um tanque |
| PUT | `/api/tanques/{id}` | Edita um tanque |
| DELETE | `/api/tanques/{id}` | Remove um tanque |
| GET | `/api/cervejas/{id}/parametros` | Consulta parametros aceitaveis da cerveja |
| PUT | `/api/cervejas/{id}/parametros` | Cria ou atualiza parametros aceitaveis |
| GET | `/api/registros` | Lista registros com filtros opcionais |
| POST | `/api/registros` | Salva registro e classifica automaticamente |
| GET | `/api/registros/{id}` | Detalha um registro |
| DELETE | `/api/registros/{id}` | Remove um registro |
| GET | `/api/lotes` | Lista lotes distintos |
| GET | `/api/lotes/{numero}` | Historico de apontamentos do lote |
| GET | `/api/dashboard` | Indicadores gerais de status |

---

## Frontend — `frontend/`

```
frontend/
├── public/
├── src/
│   ├── assets/
│   ├── components/           # Componentes reutilizáveis
│   │   ├── ui/
│   │   │   ├── Badge.tsx         # Badge de status (Dentro/Atenção/Fora)
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Select.tsx
│   │   │   └── Table.tsx
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Header.tsx
│   │   │   └── PageWrapper.tsx
│   │   └── charts/
│   │       └── StatusPieChart.tsx
│   │
│   ├── pages/                # Uma pasta por funcionalidade
│   │   ├── dashboard/
│   │   │   └── DashboardPage.tsx     # F5 — indicadores gerais
│   │   ├── cervejas/
│   │   │   ├── CervejasPage.tsx      # F1 — lista de cervejas
│   │   │   ├── CervejaForm.tsx       # F1 — cadastro / edição
│   │   │   └── ParametrosForm.tsx    # F3 — parâmetros aceitáveis
│   │   ├── tanques/
│   │   │   ├── TanquesPage.tsx       # F2 — lista de tanques
│   │   │   └── TanqueForm.tsx        # F2 — cadastro / edição
│   │   ├── registros/
│   │   │   ├── RegistrosPage.tsx     # F4 — lista de registros
│   │   │   └── RegistroForm.tsx      # F4 — novo apontamento
│   │   └── lotes/
│   │       ├── LotesPage.tsx         # F6 — lista de lotes
│   │       └── LoteHistoricoPage.tsx # F6 — evolução de um lote
│   │
│   ├── services/             # Chamadas HTTP (axios / fetch)
│   │   ├── api.ts                # instância base com baseURL
│   │   ├── cervejas.service.ts
│   │   ├── tanques.service.ts
│   │   ├── parametros.service.ts
│   │   ├── registros.service.ts
│   │   └── lotes.service.ts
│   │
│   ├── hooks/                # React hooks customizados
│   │   ├── useCervejas.ts
│   │   ├── useTanques.ts
│   │   └── useRegistros.ts
│   │
│   ├── types/                # Interfaces TypeScript compartilhadas
│   │   └── index.ts
│   │
│   ├── utils/
│   │   └── classificacao.ts  # Lógica de classificação (mirror do backend)
│   │
│   ├── router.tsx            # React Router — definição de rotas
│   └── main.tsx
│
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```

### Rotas do frontend

| Rota | Página | Funcionalidade |
|---|---|---|
| `/` | DashboardPage | Dashboard com indicadores |
| `/cervejas` | CervejasPage | Lista de cervejas |
| `/cervejas/nova` | CervejaForm | Cadastrar cerveja |
| `/cervejas/:id/editar` | CervejaForm | Editar cerveja |
| `/cervejas/:id/parametros` | ParametrosForm | Definir parâmetros aceitáveis |
| `/tanques` | TanquesPage | Lista de tanques |
| `/tanques/novo` | TanqueForm | Cadastrar tanque |
| `/registros` | RegistrosPage | Lista de apontamentos |
| `/registros/novo` | RegistroForm | Novo apontamento fermentativo |
| `/lotes` | LotesPage | Lista de lotes |
| `/lotes/:numero` | LoteHistoricoPage | Histórico de evolução do lote |

---

## Backend planejado inicialmente — `backend/`

```
backend/
├── src/
│   ├── config/
│   │   └── database.ts       # Conexão com PostgreSQL (pg / Knex)
│   │
│   ├── modules/              # Um módulo por entidade de domínio
│   │   ├── cervejas/
│   │   │   ├── cervejas.controller.ts
│   │   │   ├── cervejas.service.ts
│   │   │   ├── cervejas.repository.ts
│   │   │   └── cervejas.routes.ts
│   │   │
│   │   ├── tanques/
│   │   │   ├── tanques.controller.ts
│   │   │   ├── tanques.service.ts
│   │   │   ├── tanques.repository.ts
│   │   │   └── tanques.routes.ts
│   │   │
│   │   ├── parametros/
│   │   │   ├── parametros.controller.ts
│   │   │   ├── parametros.service.ts
│   │   │   ├── parametros.repository.ts
│   │   │   └── parametros.routes.ts
│   │   │
│   │   ├── registros/
│   │   │   ├── registros.controller.ts
│   │   │   ├── registros.service.ts      # ← classificação automática aqui
│   │   │   ├── registros.repository.ts
│   │   │   └── registros.routes.ts
│   │   │
│   │   └── lotes/
│   │       ├── lotes.controller.ts
│   │       ├── lotes.service.ts
│   │       ├── lotes.repository.ts
│   │       └── lotes.routes.ts
│   │
│   ├── shared/
│   │   ├── classificacao.ts  # Motor de classificação (regra de negócio central)
│   │   ├── errors.ts         # Classes de erro customizadas
│   │   └── validators.ts     # Validação de entrada (Zod / Joi)
│   │
│   ├── middlewares/
│   │   ├── errorHandler.ts
│   │   └── requestLogger.ts
│   │
│   ├── app.ts                # Express app + registro de rotas
│   └── server.ts             # Ponto de entrada (listen)
│
├── tsconfig.json
└── package.json
```

### Endpoints da API

#### Cervejas
| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/cervejas` | Lista todas as cervejas |
| POST | `/api/cervejas` | Cadastra nova cerveja |
| GET | `/api/cervejas/:id` | Detalha uma cerveja |
| PUT | `/api/cervejas/:id` | Edita uma cerveja |
| DELETE | `/api/cervejas/:id` | Remove uma cerveja |

#### Tanques
| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/tanques` | Lista todos os tanques |
| POST | `/api/tanques` | Cadastra novo tanque |
| PUT | `/api/tanques/:id` | Edita um tanque |
| DELETE | `/api/tanques/:id` | Remove um tanque |

#### Parâmetros aceitáveis
| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/cervejas/:id/parametros` | Parâmetros da cerveja |
| PUT | `/api/cervejas/:id/parametros` | Atualiza parâmetros |

#### Registros fermentativos
| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/registros` | Lista registros (com filtros opcionais) |
| POST | `/api/registros` | Salva novo registro + classifica automaticamente |
| GET | `/api/registros/:id` | Detalha um registro |
| DELETE | `/api/registros/:id` | Remove um registro |

#### Lotes
| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/lotes` | Lista lotes distintos |
| GET | `/api/lotes/:numero` | Histórico de apontamentos do lote |

#### Dashboard
| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/dashboard` | Indicadores: total, dentro, atenção, fora |

---

## Banco de dados — `database/`

```
database/
├── migrations/
│   ├── 001_create_cervejas.sql
│   ├── 002_create_tanques.sql
│   ├── 003_create_parametros.sql
│   └── 004_create_registros.sql
└── seeds/
    ├── cervejas.sql
    ├── tanques.sql
    └── parametros.sql
```

### Modelo de dados

```
cervejas
  id            UUID PK
  nome          VARCHAR(100) NOT NULL
  estilo        VARCHAR(100) NOT NULL
  criado_em     TIMESTAMP DEFAULT NOW()

tanques
  id            UUID PK
  nome          VARCHAR(100) NOT NULL
  capacidade_l  DECIMAL(10,2) NOT NULL
  criado_em     TIMESTAMP DEFAULT NOW()

parametros_aceitaveis
  id            UUID PK
  cerveja_id    UUID FK → cervejas.id
  temp_min      DECIMAL(5,2) NOT NULL
  temp_max      DECIMAL(5,2) NOT NULL
  ph_min        DECIMAL(4,2) NOT NULL
  ph_max        DECIMAL(4,2) NOT NULL
  extrato_min   DECIMAL(5,2) NOT NULL
  extrato_max   DECIMAL(5,2) NOT NULL

registros_fermentativos
  id            UUID PK
  cerveja_id    UUID FK → cervejas.id
  tanque_id     UUID FK → tanques.id
  numero_lote   VARCHAR(50) NOT NULL
  data_hora     TIMESTAMP NOT NULL
  temperatura   DECIMAL(5,2) NOT NULL
  ph            DECIMAL(4,2) NOT NULL
  extrato       DECIMAL(5,2) NOT NULL
  observacoes   TEXT
  status        ENUM('dentro_padrao','atencao','fora_padrao') NOT NULL
  criado_em     TIMESTAMP DEFAULT NOW()
```

---

## Regra de negócio — classificação automática

Localização planejada: `controleFCervej/RESTAPI/registros/service/` ou módulo compartilhado da RESTAPI.

A classificação compara cada parâmetro medido com os limites definidos para a cerveja.
O status final é determinado pelo **pior parâmetro** (regra do elo mais fraco).

```typescript
type Status = 'dentro_padrao' | 'atencao' | 'fora_padrao';

function classificarParametro(
  valor: number,
  min: number,
  max: number,
  tolerancia: number   // zona de atenção
): 0 | 1 | 2 {        // 0 = ok, 1 = atenção, 2 = fora
  if (valor >= min && valor <= max) return 0;
  const desvio = Math.max(valor - max, min - valor);
  return desvio <= tolerancia ? 1 : 2;
}

function classificarRegistro(
  medido: { temperatura: number; ph: number; extrato: number },
  params: { temp_min: number; temp_max: number; ph_min: number;
            ph_max: number; extrato_min: number; extrato_max: number }
): Status {
  const scores = [
    classificarParametro(medido.temperatura, params.temp_min, params.temp_max, 2),
    classificarParametro(medido.ph,          params.ph_min,   params.ph_max,   0.3),
    classificarParametro(medido.extrato,     params.extrato_min, params.extrato_max, 1.5),
  ];
  const pior = Math.max(...scores);
  return ['dentro_padrao', 'atencao', 'fora_padrao'][pior] as Status;
}
```

### Tolerâncias da zona de atenção

| Parâmetro | Tolerância | Justificativa |
|---|---|---|
| Temperatura | ±2 °C | Variação aceitável de sensor e ambiente |
| pH | ±0,3 | Faixa típica de oscilação natural da fermentação |
| Extrato | ±1,5 °P | Margem para erros de leitura do refratômetro |

---

## Stack tecnológica

| Camada | Tecnologia | Justificativa |
|---|---|---|
| Frontend | React 18 + Vite + TypeScript | Componentes reativos, build rápido |
| Estilização | Tailwind CSS | Consistência visual sem CSS manual excessivo |
| Roteamento | React Router v6 | Padrão de mercado para SPAs |
| HTTP client | Axios | Interceptors, cancelamento, tipagem fácil |
| Backend | ASP.NET Core Web API + C# + .NET 8 | Estrutura simples para API REST e boa organização por controllers/services/models |
| Validação | Zod | Schema-first, integra bem com TypeScript |
| Banco | PostgreSQL | Relacional, suporta UUIDs e enums nativamente |
| Query builder | Knex.js | Migrations + queries tipadas sem ORM pesado |

---

## Fluxo de uma requisição POST /api/registros

```
RegistroForm.tsx
  └─ registros.service.ts (POST /api/registros)
       └─ registros.routes.ts
            └─ registros.controller.ts
                 ├─ validators.ts         → valida campos obrigatórios
                 └─ registros.service.ts
                      ├─ parametros.repository.ts  → busca parâmetros da cerveja
                      ├─ classificacao.ts           → calcula status
                      └─ registros.repository.ts   → INSERT com status já definido
                           └─ { registro + status } → 201 Created
```

---

## Decisões de projeto

**Classificação no backend, não no frontend**
O status é calculado e persistido no momento do INSERT. O frontend apenas exibe — nunca recalcula. Isso garante rastreabilidade: um registro salvo tem o status imutável referente ao momento da medição, mesmo que os parâmetros da cerveja sejam alterados depois.

**UUID como chave primária**
Evita colisões em caso de futura distribuição, facilita integração com outros sistemas e não expõe sequência de inserção.

**Lote como campo string, não entidade separada**
O lote existe como agrupador de registros, não como entidade com ciclo de vida próprio. O histórico de um lote é consultado filtrando `numero_lote` na tabela de registros — simples e sem overhead de tabela extra.

**Status persistido como ENUM no banco**
Facilita filtros, índices e relatórios sem recalcular. O valor é auditável: reflete o estado dos parâmetros no momento do registro.
