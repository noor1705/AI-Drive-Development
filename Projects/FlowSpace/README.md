# FlowSpace MVP

Fast local MVP for FlowSpace with a React frontend and Express backend.

## Included in this MVP

- Workspace pages (create + list)
- Task management with quick status changes
- Snippet vault (create + list)
- Inbox mock (compose + mark replied)
- Voice transcript to page workflow (MVP simulation)
- Gmail and GitHub connection state toggles

## Stack

- Client: React + Vite
- Server: Node.js + Express
- Data: In-memory store for rapid iteration

## Run Commands

From the project root:

```bash
npm install
npm run dev
```

App URLs:

- Frontend: http://localhost:5173
- API: http://localhost:5000/api/health

## Other Scripts

```bash
npm run dev:server
npm run dev:client
npm run build
npm start
```

## Notes

- This is intentionally optimized for speed and demoability.
- Data resets when the server restarts.
- OAuth, Gmail API, GitHub API, Whisper, and Claude are represented as MVP-compatible local flows and can be replaced with real integrations in Phase 2.
