# FermentaTrack

Aplicacao para cadastro e acompanhamento de dados fermentativos em cervejarias.

O projeto possui uma API REST em .NET e um frontend React. O sistema permite
cadastrar cervejas, tanques e parametros aceitaveis, registrar apontamentos
fermentativos e classificar automaticamente cada registro como:

- `dentro_padrao`
- `atencao`
- `fora_padrao`

## Stack

- .NET 8
- ASP.NET Core Web API
- C#
- React 18
- TypeScript
- Vite
- Tailwind CSS
- PostgreSQL
- Npgsql

## Estrutura

```text
controleArBrain/
  README.md
  controleFCervej/
    Program.cs
    controleFCervej.csproj
    appsettings.json
    FermentaTrack-api/
      cervejas/
      tanques/
      parametros/
      registros/
      lotes/
      dashboard/
      shared/
    agentes/
  frontend/
    src/
      components/
        layout/
        ui/
      icones/
      images/
      pages/
      services/
      types/
      utils/
      router.tsx
    tests/
    vite.config.ts
    package.json
```

No backend, cada modulo segue a separacao:

- `controller`: recebe requisicoes HTTP e retorna respostas.
- `service`: concentra validacoes, regras e orquestracao.
- `model`: define entidades e contratos de entrada/saida.
- `repository`: concentra o acesso aos dados no PostgreSQL.

## Banco de dados

Conexao local usada pelo backend:

```text
jdbc:postgresql://localhost:5432/postgres
usuario: postgres
senha: 12345
```

String equivalente no .NET, configurada em `controleFCervej/appsettings.json`:

```text
Host=localhost;Port=5432;Database=postgres;Username=postgres;Password=12345
```

A API executa a criacao das tabelas automaticamente ao iniciar, se elas ainda
nao existirem. O SQL completo esta documentado em:

```text
controleFCervej/agentes/postgresql-criacao-banco.md
```

## Como executar

### Backend

Antes de iniciar a API, deixe o PostgreSQL rodando em `localhost:5432`.

```bash
dotnet restore controleFCervej/controleFCervej.csproj
dotnet run --project controleFCervej --urls http://localhost:5077
```

A API ficara disponivel em:

```text
http://localhost:5077
```

Rota de status:

```http
GET /
```

### Frontend

Em outro terminal, na raiz do repositorio:

```bash
cd frontend
npm install
npm run dev
```

O frontend ficara disponivel em:

```text
http://127.0.0.1:5173
```

O Vite usa proxy para encaminhar `/api/*` para `http://localhost:5077`.

Como o caminho do projeto contem `C#`, o modo dev com transformacao em tempo
real do Vite pode falhar no Windows. Por isso, neste projeto `npm run dev`
compila e serve o `dist` em modo preview na porta `5173`.

## Frontend

O frontend usa um layout administrativo com topo, navbar horizontal, botao de
voltar nas telas internas e formularios em paginas dedicadas. Os cadastros nao
usam mais modal sobreposto.

### Rotas

| Rota | Tela |
|---|---|
| `/` | Dashboard |
| `/cervejas` | Lista de cervejas |
| `/cervejas/novo` | Cadastro de cerveja |
| `/cervejas/:id/editar` | Edicao de cerveja |
| `/tanques` | Lista de tanques |
| `/tanques/novo` | Cadastro de tanque |
| `/tanques/:id/editar` | Edicao de tanque |
| `/parametros` | Parametros aceitaveis por cerveja |
| `/registros` | Lista e filtros de registros fermentativos |
| `/registros/novo` | Cadastro de registro fermentativo |
| `/lotes` | Lista e historico de lotes |
| `/lotes/:numero` | Historico de um lote |

### Telas principais

- Dashboard: indicadores gerais e registros recentes.
- Cervejas: listagem, cadastro em tela separada, edicao e exclusao.
- Tanques: listagem, cadastro em tela separada, edicao e exclusao.
- Parametros: definicao de faixas aceitaveis por cerveja.
- Registros: filtros, listagem, exclusao e cadastro em tela separada.
- Lotes: selecao de lote e historico cronologico.

## Endpoints

### Cervejas

| Metodo | Rota | Descricao |
|---|---|---|
| GET | `/api/cervejas` | Lista cervejas |
| GET | `/api/cervejas/{id}` | Detalha uma cerveja |
| POST | `/api/cervejas` | Cadastra cerveja |
| PUT | `/api/cervejas/{id}` | Atualiza cerveja |
| DELETE | `/api/cervejas/{id}` | Remove cerveja |

Exemplo:

```http
POST /api/cervejas
Content-Type: application/json

{
  "nome": "IPA001",
  "estilo": "American IPA"
}
```

### Tanques

| Metodo | Rota | Descricao |
|---|---|---|
| GET | `/api/tanques` | Lista tanques |
| GET | `/api/tanques/{id}` | Detalha um tanque |
| POST | `/api/tanques` | Cadastra tanque |
| PUT | `/api/tanques/{id}` | Atualiza tanque |
| DELETE | `/api/tanques/{id}` | Remove tanque |

Exemplo:

```http
POST /api/tanques
Content-Type: application/json

{
  "nome": "Tanque 01",
  "capacidade": 1000
}
```

### Parametros aceitaveis

Os parametros sao definidos por cerveja.

| Metodo | Rota | Descricao |
|---|---|---|
| GET | `/api/cervejas/{cervejaId}/parametros` | Consulta parametros da cerveja |
| PUT | `/api/cervejas/{cervejaId}/parametros` | Cria ou atualiza parametros |

Exemplo:

```http
PUT /api/cervejas/{cervejaId}/parametros
Content-Type: application/json

{
  "tempMin": 10,
  "tempMax": 12,
  "phMin": 5.0,
  "phMax": 5.4,
  "extratoMin": 6,
  "extratoMax": 8
}
```

### Registros fermentativos

Ao cadastrar um registro, a API busca os parametros da cerveja e calcula o
status automaticamente.

| Metodo | Rota | Descricao |
|---|---|---|
| GET | `/api/registros` | Lista registros |
| GET | `/api/registros/{id}` | Detalha um registro |
| POST | `/api/registros` | Cadastra registro e classifica |
| DELETE | `/api/registros/{id}` | Remove registro |

Filtros opcionais em `GET /api/registros`:

```text
cervejaId
tanqueId
numeroLote
status
```

Exemplo:

```http
POST /api/registros
Content-Type: application/json

{
  "cervejaId": "00000000-0000-0000-0000-000000000000",
  "tanqueId": "00000000-0000-0000-0000-000000000000",
  "numeroLote": "IPA001",
  "dataHora": "2026-06-20T10:00:00Z",
  "temperatura": 10.5,
  "ph": 5.2,
  "extrato": 7,
  "observacoes": "Medicao dentro da faixa"
}
```

### Lotes

| Metodo | Rota | Descricao |
|---|---|---|
| GET | `/api/lotes` | Lista lotes distintos |
| GET | `/api/lotes/{numero}` | Historico cronologico do lote |

### Dashboard

| Metodo | Rota | Descricao |
|---|---|---|
| GET | `/api/dashboard` | Indicadores gerais por status |

Retorno esperado:

```json
{
  "totalRegistros": 3,
  "dentroPadrao": 1,
  "atencao": 1,
  "foraPadrao": 1
}
```

## Regra de classificacao

A classificacao compara os valores medidos com os parametros aceitaveis da
cerveja. O status final e definido pelo pior parametro encontrado.

Tolerancias da zona de atencao:

| Parametro | Tolerancia |
|---|---|
| Temperatura | +/- 2 C |
| pH | +/- 0,3 |
| Extrato | +/- 1,5 P |

Resultado:

- Todos os parametros dentro da faixa: `dentro_padrao`
- Algum parametro fora da faixa, mas dentro da tolerancia: `atencao`
- Algum parametro fora da tolerancia: `fora_padrao`

## Fluxo principal

1. Cadastre uma cerveja em `/cervejas/novo` ou `POST /api/cervejas`.
2. Cadastre um tanque em `/tanques/novo` ou `POST /api/tanques`.
3. Defina os parametros da cerveja em `/parametros`.
4. Registre uma medicao em `/registros/novo` ou `POST /api/registros`.
5. Consulte os indicadores em `/` ou `GET /api/dashboard`.
6. Consulte a evolucao de um lote em `/lotes` ou `GET /api/lotes/{numero}`.

## Verificacao

Comandos uteis:

```bash
dotnet build controleFCervej/controleFCervej.csproj
cd frontend
npm run build
npm run lint
npx playwright test
```

Ultimas verificacoes realizadas nesta atualizacao:

- Build do frontend com `npm run build`.
- Lint do frontend com `npm run lint`.

