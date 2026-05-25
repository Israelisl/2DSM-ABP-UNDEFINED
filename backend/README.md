# Backend

API do sistema Secretaria Digital, responsável por autenticação, controle de acesso, navegação do chatbot, registro de dúvidas e logs de interação.

## Responsabilidade

Esta pasta contém a aplicação backend desenvolvida em Node.js com TypeScript. Ela expõe rotas REST consumidas pelo frontend e faz a persistência dos dados no PostgreSQL.

## Organização

```txt
backend/
├── db/                 # Scripts SQL, seed e documentação do banco
├── src/
│   ├── controllers/    # Entrada das requisições e respostas HTTP
│   ├── middlewares/    # Autenticação JWT e autorização por perfil
│   ├── repositories/   # Consultas e operações com o banco
│   ├── routes/         # Definição das rotas da API
│   ├── services/       # Regras de negócio
│   ├── utils/          # Funções auxiliares, como JWT e senha
│   ├── database.ts     # Configuração da conexão PostgreSQL
│   └── server.ts       # Inicialização do servidor Express
├── Dockerfile
├── package.json
└── tsconfig.json
```

## Principais Recursos

- Autenticação com JWT.
- Envio de token pelo header `Authorization: Bearer <token>`.
- Hash de senhas com `bcrypt`.
- Controle de acesso por papéis (`ADMIN` e `SECRETARIA`).
- Rotas públicas para navegação do chatbot.
- Cadastro público de dúvidas enviadas pelos usuários à Secretaria Acadêmica.
- Listagem administrativa das dúvidas recebidas.
- Atualização do status das dúvidas como `ABERTA` ou `RESPONDIDA`.
- Registro do usuário interno que marcou uma dúvida como respondida.
- Rotas administrativas para criação, edição e remoção de perguntas/respostas do chatbot.
- Registro de logs de navegação, dúvidas enviadas, feedbacks e comentários.

## Módulos do Backend

### Autenticação (`auth`)

Responsável por login, emissão de token JWT, consulta do usuário autenticado e cadastro de usuários internos por administradores.

### Navegação (`navigation`)

Responsável pela árvore de navegação do chatbot. Permite listar opções públicas do atendimento e, no painel administrativo, criar, editar, desativar ou remover perguntas e respostas.

### Dúvidas (`inquiries`)

Responsável pelo envio e acompanhamento das dúvidas encaminhadas à Secretaria Acadêmica.

Usuários públicos podem enviar uma dúvida informando nome, e-mail e pergunta. Usuários autenticados com perfil `ADMIN` ou `SECRETARIA` podem listar as dúvidas recebidas e atualizar o status para `ABERTA` ou `RESPONDIDA`.

Quando uma dúvida é marcada como `RESPONDIDA`, o backend registra qual usuário interno realizou a ação.

### Logs (`logs`)

Responsável por registrar interações do chatbot, fluxo de navegação, dúvidas associadas, feedbacks de satisfação e comentários enviados pelos usuários.

## Variáveis de Ambiente

As variáveis são configuradas pelo `.env` na raiz do projeto e repassadas pelo Docker Compose.

Principais variáveis usadas pelo backend:

```env
PORT=3000
DATABASE_URL=postgres://usuario:senha@postgres:5432/secretaria_db
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=8h
CORS_ORIGIN=http://localhost:5173
```

O valor de `JWT_SECRET` deve ser alterado para uma chave longa e segura antes de qualquer uso fora do ambiente local.

## Rotas Principais

| Método | Rota | Acesso | Descrição |
|---|---|---|---|
| `POST` | `/auth/login` | Público | Autentica usuário interno |
| `GET` | `/auth/me` | Autenticado | Retorna dados do usuário logado |
| `POST` | `/auth/register` | ADMIN | Cadastra usuário interno |
| `GET` | `/navigation/root` | Público | Lista opções iniciais do chatbot |
| `GET` | `/navigation/:slug/children` | Público | Lista subopções de um nó |
| `GET` | `/navigation` | ADMIN/SECRETARIA | Lista nós para o painel |
| `POST` | `/navigation` | ADMIN | Cria item de navegação |
| `PUT` | `/navigation/:id` | ADMIN | Atualiza item de navegação |
| `DELETE` | `/navigation/:id` | ADMIN | Remove item de navegação |
| `POST` | `/inquiries` | Público | Envia dúvida para a secretaria |
| `GET` | `/inquiries` | ADMIN/SECRETARIA | Lista dúvidas recebidas |
| `PUT` | `/inquiries/:id/status` | ADMIN/SECRETARIA | Atualiza status da dúvida |
| `POST` | `/logs` | Público | Registra interação/feedback |
| `GET` | `/logs` | ADMIN | Lista logs de atendimento |

## Execução

A forma recomendada de execução é pelo Docker Compose na raiz do projeto:

```bash
docker compose up --build
```

Para validação local do TypeScript:

```bash
cd backend
.\node_modules\.bin\tsc.cmd --noEmit
```