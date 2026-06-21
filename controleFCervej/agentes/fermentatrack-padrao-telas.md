# FermentaTrack — Padrão de telas

> Documento de referência para implementação do layout e das telas do frontend.

---

## Estrutura geral do layout

O layout é composto por **três faixas horizontais empilhadas**, sem sidebar lateral:

```
┌─────────────────────────────────────────────┐
│                   HEADER                    │  ← fixo no topo
├─────────────────────────────────────────────┤
│                   NAVBAR                    │  ← navegação secundária
├─────────────────────────────────────────────┤
│                                             │
│                  CONTEÚDO                   │  ← área livre por tela
│                                             │
└─────────────────────────────────────────────┘
```

---

## Header

- Ocupa **100% da largura** da tela
- Fundo: `brand-dark` (`#1D1D2D`)
- Altura: `60px`
- Dividido em dois blocos com `justify-content: space-between`:

**Bloco esquerdo — identidade visual**
- Ícone/logo da aplicação em destaque com fundo `brand-yellow` (`#FFC524`)
- Nome da aplicação ao lado, em branco, com sufixo em `brand-yellow`

**Bloco direito — usuário**
- Nome do usuário em branco (`12px`, `font-weight: 500`)
- Link "sair" abaixo do nome em `brand-yellow`, com ícone à esquerda
- Avatar circular (`36px`) com ícone de usuário, fundo `brand-slate` (`#ACBBCD`)

---

## Navbar (barra de navegação secundária)

- Fundo: branco (`#fff`)
- Altura: `40px`
- Borda inferior: `0.5px solid #ddd`
- Itens alinhados horizontalmente com `padding: 0 24px`, `gap: 4px`

**Item de navegação**
- Fonte: `12px`, `font-weight: 500`, cor padrão: `#A4A4A4`
- Hover: cor muda para `brand-dark`
- **Item ativo**: cor `brand-dark`, borda inferior `2px solid brand-yellow`
- Sem background colorido no item ativo — apenas a borda inferior como indicador

**Itens do FermentaTrack (em ordem):**
1. Dashboard
2. Cervejas
3. Tanques
4. Parâmetros
5. Registros
6. Lotes

---

## Área de conteúdo

- Fundo: `brand-light` (`#EBEBEB`)
- Padding: `28px 24px`
- Ocupa o restante da altura disponível
- Cada tela renderiza seu conteúdo aqui — sem estrutura fixa imposta

---

## Cabeçalho de seção (dentro do conteúdo)

Padrão usado no topo de cada tela:

```
┌──────────────────────────────────────────────┐
│  Título da tela              [Botão de ação] │
└──────────────────────────────────────────────┘
```

- `display: flex`, `justify-content: space-between`, `align-items: center`
- `margin-bottom: 20px`
- Título: `16px`, `font-weight: 600`, cor `brand-dark`
- Botão de ação primária (quando houver): fundo `brand-yellow`, cor `brand-dark`

---

## Componentes reutilizáveis

### Botões

| Variante | Fundo | Cor do texto | Borda | Uso |
|---|---|---|---|---|
| Primário | `#FFC524` | `#1D1D2D` | nenhuma | Ação principal (salvar, novo) |
| Ghost | `#fff` | `#1D1D2D` | `0.5px solid #ccc` | Ação secundária (cancelar, editar) |
| Danger | `#FA9897` | `#7a1a1a` | nenhuma | Exclusão |

Todos: `border-radius: 6px`, `font-size: 12px`, `font-weight: 600`, `padding: 8px 16px`
Versão pequena (`btn-sm`): `padding: 5px 10px`, `font-size: 11px`, `border-radius: 5px`

### Badges de status

| Status API | Label exibido | Fundo | Cor do texto |
|---|---|---|---|
| `dentro_padrao` | Dentro do padrão | `#9CD497` | `#1e5c1a` |
| `atencao` | Atenção | `#FFC524` | `#6b4700` |
| `fora_padrao` | Fora do padrão | `#FA9897` | `#7a1a1a` |

Estilo: `border-radius: 20px`, `padding: 3px 10px`, `font-size: 10px`, `font-weight: 600`

### Tabela

- Card branco com `border-radius: 8px`, `border: 0.5px solid #e0e0e0`
- `thead`: fundo `#fafafa`, `border-bottom: 0.5px solid #eee`
- `th`: `10px`, uppercase, `letter-spacing: 0.05em`, cor `#A4A4A4`
- `td`: `12px`, cor `brand-dark`, `padding: 10px 14px`
- Separador entre linhas: `border-bottom: 0.5px solid #f5f5f5`
- Hover na linha: fundo `#fafafa`
- `table-layout: fixed` para evitar overflow

### Cards de métrica (Dashboard)

- Fundo branco, `border-radius: 8px`, `border: 0.5px solid #e0e0e0`
- Borda superior colorida de `3px` conforme o status representado
- Número: `30px`, `font-weight: 700`
- Label: `11px`, cor `#A4A4A4`, `margin-top: 6px`
- Grid de 4 colunas com `gap: 12px`

### Formulários

- Card branco com `border-radius: 8px`, `border: 0.5px solid #e0e0e0`, `padding: 22px`
- Campos em grid com `gap: 14px` e `margin-bottom: 14px`
- Layouts disponíveis: `col1` (1 coluna), `col2` (2 colunas), `col3` (3 colunas)
- Label: `11px`, `font-weight: 600`, cor `brand-dark`
- Input/Select: `padding: 8px 10px`, `border-radius: 6px`, `border: 0.5px solid #ccc`, fundo `brand-light`
- Área de ações: `border-top: 0.5px solid #eee`, `padding-top: 14px`, botões alinhados à direita

### Modais

- Overlay: `background: rgba(0,0,0,0.35)`, centralizado com `display: flex`
- Modal: fundo branco, `border-radius: 10px`, `border: 0.5px solid #ddd`, `padding: 22px`
- Largura padrão: `460px`; formulário maior: `520px`
- Cabeçalho com título (`14px`, `font-weight: 600`) e botão fechar (`ti-x`)
- Mesma estrutura de formulário interna descrita acima

---

## Telas por funcionalidade

### F5 — Dashboard (`/`)

Conteúdo:
1. Grid de 4 cards de métrica (total, dentro, atenção, fora)
2. Tabela de registros recentes com colunas: Lote, Cerveja, Tanque, Data/hora, Temp, pH, Status

Sem botão de ação no cabeçalho de seção.

---

### F1 — Cervejas (`/cervejas`)

Conteúdo:
1. Tabela com colunas: Nome, Estilo, Ações
2. Coluna Ações: botões "Editar" (ghost), "Parâmetros" (ghost), "Excluir" (danger)

Botão de ação no cabeçalho: "Nova cerveja" → abre modal.

**Modal — nova/editar cerveja:**
- Campo: Nome (obrigatório)
- Campo: Estilo (obrigatório)

---

### F2 — Tanques (`/tanques`)

Conteúdo:
1. Tabela com colunas: Nome, Capacidade, Ações
2. Coluna Ações: botões "Editar" (ghost), "Excluir" (danger)

Botão de ação no cabeçalho: "Novo tanque" → abre modal.

**Modal — novo/editar tanque:**
- Campo: Nome (obrigatório)
- Campo: Capacidade em litros (obrigatório, número)

---

### F3 — Parâmetros (`/parametros`)

Conteúdo:
1. Select de cerveja (largura máxima `300px`)
2. Grid de 3 blocos de parâmetros (temperatura, pH, extrato), cada um com campos mín/máx
3. Caixa informativa sobre as tolerâncias automáticas (fundo `#fffbea`, borda `#f0d060`)

Botão de ação no cabeçalho: "Salvar parâmetros".

**Blocos de parâmetro:**
- Fundo `brand-light`, `border-radius: 7px`, `border: 0.5px solid #ddd`
- Título em uppercase com ícone Tabler
- Inputs lado a lado com labels "Mín" e "Máx" (`width: 60px` cada)

---

### F4 — Registros (`/registros`)

Conteúdo:
1. Card de filtros (cerveja, tanque, status + botão "Filtrar")
2. Tabela com colunas: Lote, Cerveja, Tanque, Data/hora, Temp, pH, Extrato, Status, Excluir

Botão de ação no cabeçalho: "Novo registro" → abre modal.

**Modal — novo registro (largura `520px`):**
- Linha 1 (col2): Cerveja (select), Tanque (select)
- Linha 2 (col2): Número do lote, Data e hora
- Linha 3 (col3): Temperatura (°C), pH, Extrato (°P)
- Linha 4 (col1): Observações (textarea, opcional)

O status é retornado pela API após salvar — não é preenchido pelo usuário.

---

### F6 — Lotes (`/lotes`)

Conteúdo em dois painéis lado a lado (`grid-template-columns: 200px 1fr`):

**Painel esquerdo — lista de lotes:**
- Cards empilhados com número do lote e subtítulo (cerveja · n registros)
- Item ativo: `border-left: 3px solid brand-yellow`, `border-radius: 0 6px 6px 0`

**Painel direito — histórico do lote selecionado:**
- Cabeçalho com nome do lote e badge de contagem
- Tabela com colunas: Data, Temp (°C), pH, Extrato (°P), Status

---

## Paleta de cores

| Nome | Hex | Uso |
|---|---|---|
| `brand-dark` | `#1D1D2D` | Header, títulos, textos principais |
| `brand-navy` | `#063852` | Acento de card (total) |
| `brand-slate` | `#ACBBCD` | Avatar, bordas, textos secundários |
| `brand-gray` | `#A4A4A4` | Textos desabilitados, labels de tabela |
| `brand-light` | `#EBEBEB` | Fundo da área de conteúdo, inputs |
| `brand-yellow` | `#FFC524` | Ação primária, nav ativo, logo, lote ativo |
| `brand-green` | `#9CD497` | Status "Dentro do padrão" |
| `brand-red` | `#FA9897` | Status "Fora do padrão", botão excluir |

---

## Tipografia

- Fonte: **Montserrat** (Google Fonts), pesos 400, 500, 600, 700
- Tamanhos em uso: `10px` (labels uppercase), `11px` (labels de form), `12px` (corpo de tabela, botões), `13px` (subtítulos), `14px` (títulos de modal), `16px` (títulos de seção), `30px` (números de métrica)
- Caixa alta (`text-transform: uppercase`) apenas em: `th` de tabelas, títulos de bloco de parâmetro

---

## Ícones

Biblioteca: **Tabler Icons** (webfont outline)
Exemplos em uso: `ti-flask` (logo), `ti-user` (avatar), `ti-logout` (sair), `ti-plus` (novo), `ti-x` (fechar modal), `ti-temperature`, `ti-droplet`, `ti-chart-line`, `ti-info-circle`
