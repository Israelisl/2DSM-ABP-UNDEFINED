# Documentação

Esta pasta reúne os artefatos de planejamento, acompanhamento e modelagem usados no desenvolvimento do projeto Secretaria Digital.

## Responsabilidade

A pasta `docs/` centraliza documentos complementares ao README principal, incluindo materiais de sprint, backlog, burndown e modelagem do sistema.

## Organização

```txt
docs/
|-- backlog/       # Arquivos CSV usados para gerar burndown
|-- sprint1/       # Artefatos da Sprint 1
|-- sprint2/       # Artefatos da Sprint 2
|-- burndown.py    # Script para geração dos gráficos de burndown
`-- README.md      # Esta documentação
```

## Artefatos Disponíveis

- `docs/backlog/backlog_sprint1.csv`: dados usados para o burndown da Sprint 1.
- `docs/backlog/backlog_sprint2.csv`: dados usados para o burndown da Sprint 2.
- `docs/sprint1/CasosDeUso.png`: diagrama de casos de uso da Sprint 1.
- `docs/sprint1/burndown.png`: gráfico de burndown da Sprint 1.
- `docs/sprint2/burndown.png`: gráfico de burndown da Sprint 2.
- `docs/burndown.py`: script Python que gera os gráficos a partir dos CSVs.

## Burndown

Os gráficos de burndown são gerados a partir dos arquivos em `docs/backlog/`.

Para gerar novamente:

```bash
python docs/burndown.py
```

## Modelagem

A modelagem técnica do projeto é organizada por sprint.

- Sprint 1: diagrama de casos de uso.
- Sprint 2: diagrama de classes.
- Sprint 3: diagramas de sequência e componentes.

O modelo relacional do banco está documentado em `backend/db/README.md`.

## Observações

A documentação desta pasta deve permanecer alinhada ao que foi realmente implementado no sistema. Funcionalidades ainda não entregues não devem ser descritas como concluídas.