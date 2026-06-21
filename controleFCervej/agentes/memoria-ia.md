# Memoria da IA - FermentaTrack

Este arquivo serve como contexto rapido para proximas interacoes da IA no projeto.

## Projeto

O projeto atual e uma API ASP.NET Core Web API em .NET 8 chamada `controleFCervej`.
A aplicacao representa o backend inicial do FermentaTrack, sistema para cadastro e acompanhamento de dados fermentativos em cervejarias.

## Estrutura atual da API

A API esta dentro de:

```text
controleFCervej/
  Program.cs
  RESTAPI/
    cervejas/
    tanques/
    parametros/
    registros/
    lotes/
    dashboard/
```

O padrao usado por dominio e:

```text
dominio/
  controller/
  service/
  model/
  repository/
```

## Modulos atuais

### Cervejas

O modulo `cervejas` esta implementado com CRUD em memoria.

Endpoints existentes:

```text
GET    /api/cervejas
GET    /api/cervejas/{id}
POST   /api/cervejas
PUT    /api/cervejas/{id}
DELETE /api/cervejas/{id}
```

Arquivos principais:

```text
RESTAPI/cervejas/controller/CervejaController.cs
RESTAPI/cervejas/service/CervejaService.cs
RESTAPI/cervejas/model/Cerveja.cs
RESTAPI/cervejas/model/CervejaRequests.cs
RESTAPI/cervejas/repository/CervejaRepository.cs
```

O armazenamento atual usa `ConcurrentDictionary<Guid, Cerveja>` em memoria.
Os dados somem quando a aplicacao reinicia.

### Tanques

O modulo `tanques` esta implementado com CRUD em memoria.

```text
GET    /api/tanques
GET    /api/tanques/{id}
POST   /api/tanques
PUT    /api/tanques/{id}
DELETE /api/tanques/{id}
```

### Parametros aceitaveis

Os parametros sao vinculados a uma cerveja.

```text
GET /api/cervejas/{id}/parametros
PUT /api/cervejas/{id}/parametros
```

### Registros fermentativos

O modulo `registros` salva medicoes fermentativas e classifica automaticamente cada registro.

```text
GET    /api/registros
GET    /api/registros/{id}
POST   /api/registros
DELETE /api/registros/{id}
```

Filtros opcionais em `GET /api/registros`:

```text
cervejaId
tanqueId
numeroLote
status
```

### Lotes e dashboard

```text
GET /api/lotes
GET /api/lotes/{numero}
GET /api/dashboard
```

### Usuarios

A API de usuarios foi removida.
Nao recriar o modulo `usuario` a menos que o usuario peca explicitamente.

## Decisoes atuais

- Manter a organizacao por dominio dentro de `RESTAPI`.
- Manter controller, service, model e repository separados.
- Validacoes de regra simples ficam no service.
- Repository concentra armazenamento/acesso a dados.
- A API ainda nao usa banco de dados.
- A API ainda nao tem Swagger, CORS, autenticacao ou autorizacao.

## Padrao visual AirBrain

O arquivo `controleFCervej/agentes/padrao-design.md` define o padrao visual AirBrain.

Fonte principal:

```text
Montserrat
```

Paleta principal:

```text
#1D1D2D - preto azulado, fundo principal
#063852 - azul escuro
#ACBBCD - azul medio
#A4A4A4 - cinza medio
#EBEBEB - cinza claro
#FFC524 - amarelo destaque
#BCDA97 - verde claro
#FA0897 - rosa/magenta alerta
```

Diretriz de icones:

- As solucoes AirBrain usam paletas proprias de icones.
- Os icones devem usar preferencialmente as cores primitivas do projeto.
- Icones mobile sao otimizados para interfaces compactas, em grade sobre fundo cinza escuro `#3A3A3A`.
- Icones desktop podem ter maior densidade e variacoes adicionais, tambem organizados sobre fundo cinza escuro.

## Fluxo de negocio esperado

O objetivo maior do FermentaTrack e:

1. Cadastrar cervejas.
2. Cadastrar tanques.
3. Definir parametros aceitaveis por cerveja.
4. Registrar medicoes fermentativas.
5. Classificar automaticamente cada registro.
6. Exibir resultado no dashboard e no historico de lote.

## Regra central implementada

A parte mais importante do sistema e a classificacao automatica do registro fermentativo.
Ela deve comparar os valores medidos com os parametros aceitaveis da cerveja.
O status final deve seguir a pior condicao encontrada entre temperatura, pH e extrato.

Status esperados:

```text
dentro_padrao
atencao
fora_padrao
```

A implementacao atual usa as tolerancias absolutas documentadas em `fermentatrack-arquitetura.md`:

```text
Temperatura: +/- 2 C
pH: +/- 0,3
Extrato: +/- 1,5 P
```

O percentual fora da faixa exibido em `fluxo_fermentatrck.png` ainda nao foi usado no codigo.

## Cuidados para proximas IAs

- Nao alterar documentacao ou arquitetura sem necessidade.
- Se mudar estrutura de pastas, atualizar `controleFCervej/agentes/fermentatrack-arquitetura.md`.
- Preferir mudancas pequenas e coerentes com o padrao atual.
- Rodar `dotnet build` depois de alterar codigo C#.
- Nao adicionar banco, Swagger ou frontend sem pedido explicito.
