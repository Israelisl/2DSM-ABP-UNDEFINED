# Frontend

Interface web do sistema Secretaria Digital da FATEC Jacareí, desenvolvida em React com TypeScript.

## Responsabilidade

Esta pasta contém a aplicação frontend responsável pelo chatbot público, tela de login e painel administrativo usado por perfis internos.

## Tecnologias

- React 19
- TypeScript
- Vite
- CSS

## Organização

```txt
frontend/
|-- public/
|   |-- assets/
|   |   |-- pdf/    # Documentos oficiais em PDF
|   |   `-- png/    # Imagens públicas usadas pelo atendimento
|   |-- favicon.svg
|   `-- icons.svg
|-- src/
|   |-- components/ # Componentes de chat, login, layout e painel
|   |-- hooks/      # Hooks de autenticação e navegação do chat
|   |-- services/   # Comunicação com a API backend
|   |-- assets/     # Imagens importadas pela aplicação
|   |-- App.tsx
|   `-- main.tsx
|-- index.html
|-- vite.config.ts
|-- package.json
`-- tsconfig.json
```

## Como Rodar Localmente

> Recomendado: rodar via Docker Compose a partir da raiz do projeto.
> Veja as instruções completas no [README principal](../README.md).

```bash
docker compose up --build
```

Para rodar apenas o frontend de forma isolada:

```bash
npm install
npm run dev
```

Acesse em:

```txt
http://localhost:5173
```

## Integração com o Backend

O frontend consome rotas da API configurada por `VITE_API_URL`.

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/navigation/root` | Busca as opções iniciais do chatbot |
| `GET` | `/navigation/:slug/children` | Busca subopções de um nó de navegação |
| `GET` | `/navigation` | Lista perguntas/respostas no painel administrativo |
| `POST` | `/navigation` | Cria item de navegação no painel administrativo |
| `PUT` | `/navigation/:id` | Atualiza item de navegação |
| `DELETE` | `/navigation/:id` | Remove item de navegação |
| `POST` | `/auth/login` | Autentica usuário interno |
| `GET` | `/auth/me` | Retorna dados do usuário autenticado |
| `POST` | `/inquiries` | Envia dúvida para a secretaria |
| `GET` | `/inquiries` | Lista dúvidas no painel administrativo |
| `PUT` | `/inquiries/:id/status` | Atualiza status de uma dúvida |
| `POST` | `/logs` | Registra interação, dúvida ou feedback |
| `GET` | `/logs` | Lista logs para administradores |

## Variáveis de Ambiente

Para execução isolada do frontend, crie um arquivo `.env` dentro de `frontend/`:

```env
VITE_API_URL=http://localhost:3000
```

No Docker Compose, essa variável é definida a partir do `.env` da raiz do projeto.

## Perfis de Acesso

| Perfil | Acesso |
|---|---|
| Público | Chatbot de navegação e envio de dúvidas |
| SECRETARIA | Painel de acompanhamento de dúvidas e visualização de perguntas |
| ADMIN | Painel administrativo com gestão de perguntas, dúvidas e logs |