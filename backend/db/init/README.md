# Scripts de Inicialização

Os arquivos desta pasta são executados em ordem alfabética quando o container PostgreSQL é inicializado com um volume vazio.

## Arquivos

### `01_schema.sql`

Responsável pela estrutura do banco.

Principais ações:

- Cria a extensão `pgcrypto`.
- Cria os tipos `user_role`, `inquiry_status` e `satisfaction_flag`.
- Cria as tabelas `users`, `navigation_nodes`, `inquiries` e `interaction_logs`.
- Cria índices usados pelas principais consultas.
- Cria triggers para atualização automática de `updated_at`.
- Executa ajustes de compatibilidade para estruturas antigas que não fazem parte do MVP atual.

### `02_seed.sql`

Responsável pela carga inicial de dados.

Principais ações:

- Cria ou atualiza usuários internos padrão para ambiente local.
- Cadastra a árvore inicial de navegação do chatbot.
- Cadastra respostas, evidências textuais e fontes usadas no atendimento.

## Execução no Docker

Os scripts são montados no container PostgreSQL pelo Docker Compose:

```txt
./backend/db/init:/docker-entrypoint-initdb.d:ro
```

Eles são executados automaticamente apenas quando o volume do PostgreSQL está vazio.

## Reaplicar os Scripts

Para recriar o banco do zero em ambiente local:

```bash
docker compose down -v
docker compose up --build
```

## Observações

- Os scripts usam `IF EXISTS`, `IF NOT EXISTS` e `ON CONFLICT` para reduzir erros em execuções repetidas.
- Alterações nos scripts não afetam automaticamente um banco já inicializado.
- O uso de credenciais padrão no seed é exclusivo para desenvolvimento local.