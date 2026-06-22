# Criacao do banco PostgreSQL - FermentaTrack

Este documento registra o SQL usado pela API para criar a estrutura do banco.

## Conexao local

```text
JDBC: jdbc:postgresql://localhost:5432/postgres
Host: localhost
Porta: 5432
Database: postgres
Usuario: postgres
Senha: 12345
```

String usada pela API .NET:

```text
Host=localhost;Port=5432;Database=postgres;Username=postgres;Password=1216
```

## Observacao

A API executa este SQL automaticamente ao iniciar, caso as tabelas ainda nao existam.
O script abaixo tambem pode ser executado manualmente em uma ferramenta como pgAdmin,
DBeaver ou psql.

## SQL

```sql
CREATE TABLE IF NOT EXISTS cervejas (
    id UUID PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    estilo VARCHAR(100) NOT NULL,
    criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tanques (
    id UUID PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    capacidade_l NUMERIC(10,2) NOT NULL CHECK (capacidade_l > 0),
    criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS parametros_aceitaveis (
    id UUID PRIMARY KEY,
    cerveja_id UUID NOT NULL UNIQUE REFERENCES cervejas(id) ON DELETE CASCADE,
    temp_min NUMERIC(5,2) NOT NULL,
    temp_max NUMERIC(5,2) NOT NULL,
    ph_min NUMERIC(4,2) NOT NULL,
    ph_max NUMERIC(4,2) NOT NULL,
    extrato_min NUMERIC(5,2) NOT NULL,
    extrato_max NUMERIC(5,2) NOT NULL,
    criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CHECK (temp_min <= temp_max),
    CHECK (ph_min <= ph_max),
    CHECK (extrato_min <= extrato_max),
    CHECK (ph_min >= 0 AND ph_max <= 14)
);

CREATE TABLE IF NOT EXISTS registros_fermentativos (
    id UUID PRIMARY KEY,
    cerveja_id UUID NOT NULL REFERENCES cervejas(id) ON DELETE CASCADE,
    tanque_id UUID NOT NULL REFERENCES tanques(id) ON DELETE CASCADE,
    numero_lote VARCHAR(50) NOT NULL,
    data_hora TIMESTAMPTZ NOT NULL,
    temperatura NUMERIC(5,2) NOT NULL,
    ph NUMERIC(4,2) NOT NULL,
    extrato NUMERIC(5,2) NOT NULL,
    observacoes TEXT,
    status VARCHAR(20) NOT NULL CHECK (status IN ('dentro_padrao', 'atencao', 'fora_padrao')),
    criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CHECK (ph >= 0 AND ph <= 14)
);

CREATE INDEX IF NOT EXISTS idx_registros_lote
    ON registros_fermentativos (numero_lote);

CREATE INDEX IF NOT EXISTS idx_registros_cerveja
    ON registros_fermentativos (cerveja_id);

CREATE INDEX IF NOT EXISTS idx_registros_tanque
    ON registros_fermentativos (tanque_id);

CREATE INDEX IF NOT EXISTS idx_registros_status
    ON registros_fermentativos (status);
```

## Relacionamentos

- `parametros_aceitaveis.cerveja_id` referencia `cervejas.id`.
- `registros_fermentativos.cerveja_id` referencia `cervejas.id`.
- `registros_fermentativos.tanque_id` referencia `tanques.id`.
- As relacoes usam `ON DELETE CASCADE`: ao remover cerveja ou tanque, seus dados dependentes tambem sao removidos.
