# Sprint 2

Documentação dos artefatos e entregas da Sprint 2 do projeto Secretaria Digital.

## Objetivo da Sprint

A Sprint 2 teve como foco evoluir o sistema com autenticação, controle de acesso, painel administrativo, dúvidas enviadas à secretaria, logs de atendimento e melhorias de integração entre frontend, backend e banco de dados.

## Entregas Principais

- Autenticação de usuários internos com JWT.
- Envio de token via `Authorization: Bearer <token>`.
- Controle de acesso por papéis (`ADMIN` e `SECRETARIA`).
- Proteção de rotas administrativas no backend.
- Painel administrativo para acompanhamento de dúvidas.
- Gestão de perguntas e respostas do chatbot por usuários administradores.
- Registro de logs de navegação, dúvidas enviadas e feedbacks.
- Integração do frontend com rotas reais do backend.
- Persistência em PostgreSQL para usuários, navegação, dúvidas e logs.
- Execução integrada por Docker Compose.

## Backlog e Acompanhamento

O acompanhamento da sprint está representado pelo arquivo:

```txt
docs/backlog/backlog_sprint2.csv
```

Esse arquivo contém os pontos restantes ao longo da sprint e serve como base para o gráfico de burndown.

## Burndown

O gráfico da Sprint 2 está disponível em:

```txt
docs/sprint2/burndown.png
```

Para gerar novamente o gráfico:

```bash
python docs/burndown.py
```

## Modelagem

A organização dos diagramas do projeto segue a divisão definida para as sprints:

- Sprint 1: diagrama de casos de uso.
- Sprint 2: diagrama de classes.
- Sprint 3: diagramas de sequência e componentes.

## Relação com a Rúbrica

A Sprint 2 é avaliada pelos seguintes critérios da rúbrica:

- Engenharia de Software II: backlog, DoD, documentação, UML, branches e colaboração.
- Desenvolvimento Web II: React, TypeScript, Node.js, TypeScript, JWT, Bearer Token, RBAC, rotas e Docker.
- Banco de Dados Relacional: PostgreSQL, modelagem relacional, PK, FK, constraints, índices e persistência.
- Técnicas de Programação I: modularização, tipagem TypeScript, tratamento de erros e organização do código.

## Observações de Coerência

O MVP atual persiste nós de navegação, perguntas, respostas, evidências textuais, links de fonte, dúvidas e logs.

Gestão completa de documentos, chunks e usuários administrativos avançados não faz parte do escopo implementado nesta sprint e deve ser documentada como evolução futura, caso permaneça no backlog.