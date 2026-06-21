# FermentaTrack Frontend

Frontend React + TypeScript do FermentaTrack.

## Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Axios
- Tabler Icons

## Scripts

```bash
npm install
npm run dev
npm run build
npm run lint
npx playwright test
```

`npm run dev` executa o build e serve o `dist` em modo preview na porta `5173`.
Esse ajuste evita problemas no Windows quando o caminho do projeto contem `C#`.

## API

O Vite encaminha requisicoes `/api/*` para:

```text
http://localhost:5077
```

Antes de usar o frontend, inicie o backend:

```bash
dotnet run --project ../controleFCervej --urls http://localhost:5077
```

## Rotas

| Rota | Tela |
|---|---|
| `/` | Dashboard |
| `/cervejas` | Lista de cervejas |
| `/cervejas/novo` | Cadastro de cerveja |
| `/cervejas/:id/editar` | Edicao de cerveja |
| `/tanques` | Lista de tanques |
| `/tanques/novo` | Cadastro de tanque |
| `/tanques/:id/editar` | Edicao de tanque |
| `/parametros` | Parametros aceitaveis |
| `/registros` | Lista e filtros de registros |
| `/registros/novo` | Cadastro de registro |
| `/lotes` | Historico de lotes |

## Padrao de telas

- Cadastros e edicoes usam paginas dedicadas.
- Listagens mantem as acoes principais no cabecalho.
- Telas internas possuem botao voltar usando `src/icones/icon_001.png`.
- A logo do topo usa `src/images/logo-arbrain-dark.png`.
