Contexto: Durante o processo de fermentação, cervejarias realizam o
acompanhamento periódico de parâmetros como temperatura, pH e extrato. Esses
registros são fundamentais para garantir a qualidade do produto, a padronização dos
processos produtivos e o atendimento às exigências regulatórias do MAPA
(Ministério da Agricultura e Pecuária).
Objetivo: Desenvolver uma aplicação web simplificada para registro e
acompanhamento de dados fermentativos, simulando uma funcionalidade presente
em sistemas de gestão para cervejarias. Não esperamos uma aplicação pronta para
produção. Queremos avaliar sua forma de pensar, organização do código,
entendimento de requisitos e tomada de decisões.
Regras de Negócio: Ao salvar um registro fermentativo, o sistema deverá comparar
os valores informados com os parâmetros definidos para a cerveja correspondente.
Com base nessa validação, o sistema deverá classificar automaticamente o registro
em uma das categorias: Dentro do Padrão, Atenção e Fora do Padrão.
Os critérios utilizados para essa classificação podem ser definidos pelo candidato e
devem ser documentados.
Funcionalidades:
1. Cadastro de Cervejas: Permitir o cadastro de cervejas contendo: Nome e Estilo
2. Cadastro de Tanques: Permitir o cadastro de tanques contendo: Nome e
Capacidade (Litros)
3. Cadastro de Parâmetros Aceitáveis: Cada cerveja deverá possuir parâmetros
fermentativos aceitáveis: Temperatura mínima e máxima, pH mínimo e máximo e
Extrato mínimo e máximo
4. Registro de Fermentação: Permitir registrar apontamentos fermentativos
contendo: Data e hora do registro, Cerveja, Tanque, Número do lote, Temperatura,
pH, Extrato e Observações
5. Dashboard Inicial: Criar uma tela inicial contendo indicadores simples, tais como:
Total de registros fermentativos
Registros dentro do padrão
Registros que requerematenção
Registros fora do padrão
6. Histórico de Lotes: Ao selecionar um lote, o sistema deverá exibir todos os
apontamentos fermentativos já realizados para ele, permitindo acompanhar sua
evolução ao longo do tempo.
Exemplo: Lote IPA001
01/06 -10°C - pH 5,2
02/06 -10,5°C - pH 5,1
