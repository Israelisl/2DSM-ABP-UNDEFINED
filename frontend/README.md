# Frontend — FATEC Jacareí - 2DSM ABP Undefined

Interface web do sistema de autoatendimento da Secretaria Acadêmica da FATEC Jacareí, desenvolvida em React com TypeScript.

## 🛠️ Tecnologias

- React 18
- TypeScript
- Vite
- CSS

## 📁 Estrutura de Pastas

```
frontend/
├── public/
│   └── assets/
│       ├── pdf/        # Documentos oficiais (regulamentos, calendário, PPCs)
│       └── png/        # Imagens de horários de aula
├── src/
│   ├── components/     # Componentes reutilizáveis (ChatContainer, Message, OptionButton)
│   ├── services/       # Comunicação com o backend (API)
│   ├── pages/          # Páginas da aplicação (Chat, Login, Admin)
│   └── main.tsx        # Ponto de entrada da aplicação
├── index.html
└── vite.config.ts
```

## 🚀 Como rodar localmente

> Recomendado: rodar via Docker Compose a partir da raiz do projeto.
> Veja as instruções completas no [README principal](../../README.md).

Para rodar apenas o frontend de forma isolada:

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev
```

Acesse em: `http://localhost:5173`

## 🔗 Integração com o Backend

O frontend consome as seguintes rotas do backend:

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/navigation/menus` | Busca os menus iniciais do chatbot |
| GET | `/navigation/submenus/:slug` | Busca os submenus de um nó |
| POST | `/auth/login` | Autenticação de usuários |
| GET | `/auth/me` | Retorna dados do usuário logado |
| POST | `/inquiries` | Envia uma dúvida para a secretaria |

## 🌐 Variáveis de Ambiente

Crie um arquivo `.env` na raiz do `frontend/` com:

```env
VITE_API_URL=http://localhost:3000
```

## 👥 Perfis de Acesso

| Perfil | Acesso |
|--------|--------|
| Público (aluno) | Chatbot de navegação e envio de dúvidas |
| SECRETARIA | Painel de gerenciamento de dúvidas |
| ADMIN | Painel administrativo completo |