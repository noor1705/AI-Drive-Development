# FlowSpace — Requirements

> The developer-first connected productivity workspace.  
> Gmail · GitHub · Voice · AI

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Technology Stack](#2-technology-stack)
3. [Feature Requirements](#3-feature-requirements)
4. [Non-Functional Requirements](#4-non-functional-requirements)
5. [Data Models](#5-data-models)
6. [Development Phases](#6-development-phases)
7. [API Integrations](#7-api-integrations)
8. [Folder Structure](#8-folder-structure)
9. [Environment Variables](#9-environment-variables)
10. [Open Questions](#10-open-questions)

---

## 1. Project Overview

FlowSpace is a developer-first connected productivity workspace that unifies note-taking, task management, code snippet storage, email, and voice input into a single application. Unlike Notion — which requires third-party integrations for everything — FlowSpace is built with Gmail, GitHub, and AI as first-class citizens of the platform.

### 1.1 Problem Statement

Developers, freelancers, and business users context-switch between 5–7 different tools daily: a notes app, a task manager, an email client, a code snippet tool, a voice recorder, and a dashboard. This fragmentation kills focus and creates information silos. Notion comes closest to solving this but lacks native integrations, real developer tooling, and any voice capability.

### 1.2 Solution

FlowSpace provides a block-based workspace that natively integrates with Gmail and GitHub, includes a voice-to-note assistant powered by Whisper, stores code snippets directly in the user's own GitHub repository (zero cloud storage cost on our end), and wraps an optional AI layer for summarization, smart compose, and workspace search. It ships with three user modes — Developer, Business, and Personal — each with a tailored dashboard.

### 1.3 Target Users

- Developers managing projects, snippets, and client communications
- Freelancers and solo founders running client pipelines
- Small business owners who need a CRM-lite + email command center
- Power users who live in Gmail and GitHub and want one workspace around them

### 1.4 User Modes

| Mode | Primary Use Case | Key Features |
|---|---|---|
| 👨‍💻 Developer | Code, repos, snippets, project notes | GitHub sync, snippet vault, repo linker, commit feed |
| 💼 Business | Gmail campaigns, mail merge, client tracking | Mail merge, campaign dashboard, email-to-task, contacts |
| 🧘 Personal | Daily notes, habits, voice journaling, tasks | Voice notes, habit tracker, daily digest, personal dashboard |

---

## 2. Technology Stack

| Layer | Technology | Justification |
|---|---|---|
| Frontend | React 18 + Vite | Fast HMR, component ecosystem, familiar stack |
| Styling | Tailwind CSS | Utility-first, consistent design system, no CSS bloat |
| Animations | Framer Motion | Micro-interactions, drag-and-drop transitions |
| Block Editor | TipTap | Extensible, headless, Notion-like blocks without ProseMirror complexity |
| Backend | Node.js + Express | REST API, OAuth handlers, Gmail/GitHub proxies |
| Database | MongoDB + Mongoose | Flexible schema for pages, tasks, campaigns, users |
| Gmail Integration | Gmail API + Google OAuth 2.0 | Read, send, label threads; mail merge via batch send |
| GitHub Integration | GitHub REST API + Octokit SDK | Snippet commits, repo metadata, gist creation |
| Voice / STT | OpenAI Whisper API | High-accuracy English transcription |
| AI Layer | Claude API (Anthropic) | Summarization, smart compose, workspace Q&A |
| Auth | Google OAuth 2.0 + JWT | Single sign-on via Google; JWT for session management |
| Deployment | Vercel (FE) + Render (BE) | Simple CI/CD, free tier sufficient for initial launch |

---

## 3. Feature Requirements

Priority labels:
- `MVP` — Core product, must ship
- `SHOULD` — High value, build after core
- `NICE` — Enhances experience, build if capacity allows

---

### 3.1 Authentication & User Management

| ID | Requirement | Priority | Acceptance Criteria |
|---|---|---|---|
| FR-01 | Sign in with Google OAuth 2.0 | MVP | User clicks Connect, hits Google consent screen, returns authenticated with session |
| FR-02 | JWT session management (30-day expiry) | MVP | Token stored in httpOnly cookie; auto-refreshed on expiry |
| FR-03 | User profile page (name, avatar, mode selection) | MVP | Profile saved in DB; mode toggle persists across sessions |
| FR-04 | Connect / disconnect Gmail account | MVP | OAuth tokens stored encrypted server-side; disconnect clears tokens |
| FR-05 | Connect / disconnect GitHub account | MVP | GitHub OAuth token stored; disconnect revokes access |
| FR-06 | Multi-account Gmail support (2+ accounts) | SHOULD | User can add a second Gmail; unified inbox merges both |
| FR-07 | Team workspace (invite collaborators by email) | NICE | Invite flow sends email; collaborator can view/edit shared pages |

---

### 3.2 Workspace & Block Editor

| ID | Requirement | Priority | Acceptance Criteria |
|---|---|---|---|
| FR-08 | Create, rename, delete pages | MVP | Full CRUD on pages; sidebar reflects changes instantly |
| FR-09 | Nested pages (unlimited depth) | MVP | Page can contain child pages; breadcrumb nav shown |
| FR-10 | Block-based editor: text, heading, bullet, numbered list | MVP | TipTap renders all block types; keyboard shortcuts work |
| FR-11 | Code block with syntax highlighting | MVP | Language selector dropdown; highlight via highlight.js |
| FR-12 | Table block | SHOULD | Insert table; add/remove rows and columns inline |
| FR-13 | Image upload block | SHOULD | Upload image; stored in Cloudinary or as base64 in DB |
| FR-14 | Drag-and-drop block reordering | SHOULD | Blocks can be dragged to a new position within a page |
| FR-15 | Sidebar folder organization | MVP | Sidebar tree with collapsible folders; drag pages between folders |
| FR-16 | Page search (full-text across workspace) | MVP | Search bar returns matching pages ranked by relevance |
| FR-17 | Markdown export of any page | SHOULD | Export button downloads `.md` file with full page content |
| FR-18 | Page share via public link (read-only) | NICE | Toggle share → generates unique URL; anyone with link can view |

---

### 3.3 Tasks & Project Management

| ID | Requirement | Priority | Acceptance Criteria |
|---|---|---|---|
| FR-19 | Create tasks with title, due date, priority, status | MVP | Task modal with all fields; saved to DB |
| FR-20 | Kanban board view (To Do / In Progress / Done) | MVP | Three columns; drag cards between columns |
| FR-21 | List view with sort and filter | MVP | Sort by due date, priority; filter by status or label |
| FR-22 | Link task to a page or email thread | SHOULD | Task detail has a linked source field; click opens source |
| FR-23 | Recurring tasks | SHOULD | Set daily/weekly recurrence; auto-creates next instance on completion |
| FR-24 | Due date reminders (in-app notification) | SHOULD | Notification badge appears when a task is due or overdue |

---

### 3.4 GitHub Integration (Developer Mode)

| ID | Requirement | Priority | Acceptance Criteria |
|---|---|---|---|
| FR-25 | Connect GitHub via OAuth | MVP | GitHub OAuth flow completes; token stored; user sees connected status |
| FR-26 | Snippet Vault — save code snippets with tags and language | MVP | Snippet form: title, language, code, tags; saved to DB and GitHub |
| FR-27 | Snippets synced to user's GitHub repo (`flowspace-snippets`) | MVP | On save, Octokit commits file to user's private repo; auto-creates repo if absent |
| FR-28 | One-click copy snippet | MVP | Copy button copies raw code to clipboard |
| FR-29 | Search snippets by tag, language, or keyword | MVP | Search filters snippets client-side or via DB query |
| FR-30 | Share snippet as GitHub Gist | SHOULD | Share button creates a public or secret Gist; copies Gist URL |
| FR-31 | Repo linker — attach a GitHub repo to a page or project | SHOULD | Link input on page; sidebar shows recent commits and open PRs |
| FR-32 | Developer dashboard — commit streak, open PRs, snippet count | SHOULD | Dashboard calls GitHub API on load; renders activity stats |
| FR-33 | Import existing Gists into Snippet Vault | NICE | Connect GitHub → auto-imports all existing Gists as snippets |

---

### 3.5 Gmail Integration (Business & Developer Mode)

| ID | Requirement | Priority | Acceptance Criteria |
|---|---|---|---|
| FR-34 | Unified inbox view — threads, sender, subject, timestamp | MVP | Paginated inbox list fetched via Gmail API; click to open thread |
| FR-35 | Reply to email threads from within FlowSpace | MVP | Reply compose box in thread view; sends via Gmail API as threaded reply |
| FR-36 | Compose and send new emails | MVP | Compose modal with To, Subject, Body; sends via Gmail API |
| FR-37 | Email-to-task conversion | MVP | Button on any email → creates linked task with email subject as title |
| FR-38 | Ongoing reply tracker (threads awaiting reply) | MVP | Auto-flags sent emails with no reply after 48h; surfaced in sidebar |
| FR-39 | Mail merge — template with variables + CSV recipient upload | SHOULD | User writes template with `{{name}}`, uploads CSV, previews, sends batch |
| FR-40 | Campaign tracker — sent count, reply rate, status | SHOULD | Each campaign stored in DB; reply rate computed by polling Gmail API |
| FR-41 | Gmail search from within FlowSpace | SHOULD | Search bar queries Gmail API and returns matching threads |
| FR-42 | AI triage — auto-label emails (Urgent / FYI / Action Required) | SHOULD | On inbox load, Claude classifies unread emails; label shown as badge |
| FR-43 | Business dashboard — pending replies, campaign stats, contacts | SHOULD | Dashboard aggregates Gmail and campaign data into KPI cards |
| FR-44 | Unsubscribe suggestions for high-frequency senders | NICE | Detects senders with 10+ emails/month; suggests unsubscribe action |

---

### 3.6 Voice Notes

| ID | Requirement | Priority | Acceptance Criteria |
|---|---|---|---|
| FR-45 | Record voice note via microphone in-browser | MVP | Record button starts MediaRecorder; waveform animation shown while recording |
| FR-46 | Transcribe recording via Whisper API | MVP | On stop, audio sent to backend → Whisper → transcribed text returned |
| FR-47 | Auto-save transcript as a new page in workspace | MVP | Transcript inserted as a new page titled with date and timestamp |
| FR-48 | AI cleanup of transcript (remove filler words, structure into paragraphs) | SHOULD | Claude post-processes raw transcript; cleaned version shown alongside original |
| FR-49 | Convert transcript to task list on request | SHOULD | "Make tasks from this" button → Claude extracts action items → creates tasks |
| FR-50 | Voice note history with playback | SHOULD | List of past recordings; click to replay audio or view transcript |
| FR-51 | Offline recording with sync on reconnect | NICE | Audio captured offline; queued and uploaded when network is restored |

---

### 3.7 AI Layer (All Modes — Opt-In)

| ID | Requirement | Priority | Acceptance Criteria |
|---|---|---|---|
| FR-52 | Summarize any page into 3–5 bullet points | SHOULD | Summarize button → Claude returns bullet summary shown in sidebar panel |
| FR-53 | AI reply drafting for email threads | SHOULD | "Draft Reply" in thread view → Claude reads thread → draft appears in compose box |
| FR-54 | Tone selector for AI drafts (formal / friendly / concise) | SHOULD | Dropdown before generation; tone affects Claude system prompt |
| FR-55 | Smart compose — describe intent → AI writes it | SHOULD | User types natural language intent; Claude produces full email or note |
| FR-56 | Ask your workspace (semantic search via AI) | NICE | Natural language query → Claude searches pages, tasks, snippets → returns answer |
| FR-57 | Daily digest — morning summary of inbox and tasks | NICE | Scheduled job at 8am → Claude summarizes top emails and due tasks → shown on dashboard |
| FR-58 | Mail merge content generator | NICE | User describes campaign goal → Claude writes the template with variable slots |

---

## 4. Non-Functional Requirements

| ID | Requirement | Target |
|---|---|---|
| NFR-01 | Page load time | Initial load < 2s on standard broadband |
| NFR-02 | API response time | 95% of API calls resolve in < 800ms |
| NFR-03 | Whisper transcription turnaround | < 10s for a 2-minute recording |
| NFR-04 | OAuth token security | Tokens AES-256 encrypted at rest in MongoDB; never exposed to client |
| NFR-05 | HTTPS only | All traffic over TLS; HTTP requests redirected |
| NFR-06 | Mobile responsive | Workspace, inbox, and snippet vault usable on 375px viewport |
| NFR-07 | Graceful degradation | If Gmail/GitHub API is down, app loads with cached data and shows status banner |
| NFR-08 | Data isolation | Users can only access their own pages, tasks, snippets, and emails |
| NFR-09 | Rate limit handling | Gmail API quota errors caught and surfaced to user with retry guidance |
| NFR-10 | Environment variable management | All secrets in `.env`; never committed; `.env.example` provided |

---

## 5. Data Models

All collections include `createdAt` and `updatedAt` timestamps managed by Mongoose.

### 5.1 User

```js
{
  _id:              ObjectId,
  name:             String,          // from Google profile
  email:            String,          // unique index
  avatar:           String,          // Google profile photo URL
  mode:             Enum,            // "developer" | "business" | "personal"
  googleId:         String,          // Google OAuth subject ID
  gmailTokens:      Object,          // { access_token, refresh_token } — AES-256 encrypted
  githubToken:      String,          // GitHub OAuth token — AES-256 encrypted
  githubUsername:   String,
  snippetRepoName:  String,          // default: "flowspace-snippets"
  preferences:      Object,          // theme, notifications, default dashboard view
}
```

### 5.2 Page

```js
{
  _id:        ObjectId,
  userId:     ObjectId,    // ref: User
  parentId:   ObjectId,    // ref: Page — null for root pages
  title:      String,
  content:    Object,      // TipTap JSON document
  folderId:   ObjectId,    // ref: Folder — optional
  isPublic:   Boolean,
  shareSlug:  String,      // unique slug for public URL
  linkedTask: ObjectId,    // ref: Task — optional
  linkedRepo: String,      // GitHub full name e.g. "owner/repo"
}
```

### 5.3 Task

```js
{
  _id:         ObjectId,
  userId:      ObjectId,    // ref: User
  title:       String,
  status:      Enum,        // "todo" | "in_progress" | "done"
  priority:    Enum,        // "low" | "medium" | "high" | "urgent"
  dueDate:     Date,
  linkedPage:  ObjectId,    // ref: Page — optional
  linkedEmail: String,      // Gmail thread ID — optional
  recurrence:  Object,      // { type: "daily"|"weekly", nextDate: Date }
  labels:      [String],
}
```

### 5.4 Snippet

```js
{
  _id:        ObjectId,
  userId:     ObjectId,    // ref: User
  title:      String,
  language:   String,      // e.g. "javascript", "python", "bash"
  code:       String,      // raw code content
  tags:       [String],
  githubPath: String,      // file path in flowspace-snippets repo
  gistUrl:    String,      // GitHub Gist URL if shared
  commitSha:  String,      // last commit SHA from GitHub
}
```

### 5.5 Campaign

```js
{
  _id:            ObjectId,
  userId:         ObjectId,    // ref: User
  name:           String,
  template:       String,      // email body with {{variable}} slots
  subject:        String,      // can contain variables
  recipients:     [Object],    // [{ email, name, ...customFields }]
  sentAt:         Date,
  status:         Enum,        // "draft" | "sending" | "sent" | "failed"
  stats:          Object,      // { total, sent, replied, failed }
  gmailThreadIds: [String],    // for reply tracking
}
```

### 5.6 VoiceNote

```js
{
  _id:          ObjectId,
  userId:       ObjectId,    // ref: User
  audioUrl:     String,      // Cloudinary URL or base64 for small files
  transcript:   String,      // raw Whisper output
  cleanedText:  String,      // Claude-cleaned transcript — optional
  linkedPageId: ObjectId,    // page auto-created from transcript
  duration:     Number,      // seconds
}
```

---

## 6. Development Phases

| Phase | Name | Key Deliverables |
|---|---|---|
| 1 | Core Workspace | Google OAuth, user model, page CRUD, TipTap block editor, sidebar nav, task board (Kanban + List) |
| 2 | GitHub Integration | GitHub OAuth, Snippet Vault UI, GitHub commit sync (`flowspace-snippets`), repo linker, developer dashboard |
| 3 | Gmail Integration | Gmail OAuth, inbox view, read/reply/compose, email-to-task, follow-up tracker |
| 4 | Voice Notes | In-browser recording via MediaRecorder, Whisper transcription, auto-save to page, voice note history |
| 5 | Dashboards & Campaigns | Mail merge with CSV upload, campaign tracker, Business and Personal dashboards, AI triage labels |
| 6 | AI Polish | AI reply drafting, page summarization, smart compose, transcript cleanup, daily digest |

---

## 7. API Integrations

### 7.1 Google OAuth 2.0 + Gmail API

- **Scopes:** `gmail.readonly`, `gmail.send`, `gmail.labels`, `gmail.modify`
- **Token storage:** Access and refresh tokens AES-256 encrypted in MongoDB; never sent to the frontend
- **Quota awareness:** Gmail API has a daily quota ceiling; batch operations used where possible
- **Mail merge:** Implemented via individual Gmail API send calls with per-recipient delay to avoid spam flags

### 7.2 GitHub REST API + OAuth

- **Scopes:** `repo` (private repo creation and commits), `gist` (Gist creation), `read:user`
- **Snippet storage:** Each snippet = one file committed to the user's `flowspace-snippets` repo via Octokit's `createOrUpdateFileContents`
- **Repo creation:** If `flowspace-snippets` does not exist, it is auto-created on first snippet save
- **Rate limits:** 5,000 requests/hour for authenticated users; surfaced in the Developer dashboard

### 7.3 OpenAI Whisper API

- **Endpoint:** `POST /v1/audio/transcriptions` — multipart/form-data with audio file
- **Format:** Audio recorded as `.webm` via MediaRecorder; converted to `.mp3` server-side before sending
- **Language:** Hardcoded to English (`en`) for optimal accuracy
- **Max file size:** 25MB per request; recordings capped at 10 minutes in the UI

### 7.4 Claude API (Anthropic)

- **Model:** `claude-sonnet-4-20250514`
- **Use cases:** Email triage classification, reply drafting, transcript cleanup, page summarization, smart compose
- **Context management:** Each Claude call receives only the relevant context slice (thread, page content, transcript) — no full workspace dumps per call
- **User control:** All AI features are opt-in; no Claude call is made without explicit user action

---

## 8. Folder Structure

```
flowspace/
├── client/                        # React + Vite frontend
│   ├── public/
│   └── src/
│       ├── assets/
│       ├── components/
│       │   ├── editor/            # TipTap block editor components
│       │   ├── gmail/             # Inbox, thread, compose
│       │   ├── github/            # Snippet vault, repo linker
│       │   ├── voice/             # Recorder, transcript viewer
│       │   ├── tasks/             # Kanban board, list view
│       │   ├── dashboard/         # Developer, Business, Personal dashboards
│       │   └── ui/                # Shared UI primitives (Button, Modal, etc.)
│       ├── pages/                 # Route-level components
│       ├── hooks/                 # Custom React hooks
│       ├── store/                 # Zustand global state slices
│       ├── lib/                   # API client, auth helpers, constants
│       └── styles/                # Global CSS files (per component)
│
├── server/                        # Node.js + Express backend
│   ├── routes/
│   │   ├── auth.js                # Google + GitHub OAuth
│   │   ├── pages.js               # Workspace page CRUD
│   │   ├── tasks.js               # Task management
│   │   ├── snippets.js            # Snippet vault + GitHub sync
│   │   ├── gmail.js               # Gmail proxy + mail merge
│   │   ├── voice.js               # Whisper transcription
│   │   └── ai.js                  # Claude API calls
│   ├── models/                    # Mongoose schemas
│   ├── middleware/                 # Auth guard, error handler, rate limiter
│   ├── services/                  # Gmail, GitHub, Whisper, Claude service classes
│   ├── utils/                     # Encryption, token refresh, validators
│   └── index.js                   # Express app entry point
│
├── .env.example
├── REQUIREMENTS.md
├── WORKFLOW.md
├── AGENT_PLAN.md
└── STACK.md
```

---

## 9. Environment Variables

```env
# Server
PORT=5000
NODE_ENV=development
JWT_SECRET=
ENCRYPTION_KEY=                      # 32-byte key for AES-256

# MongoDB
MONGO_URI=

# Google OAuth + Gmail API
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=http://localhost:5000/api/auth/google/callback

# GitHub OAuth
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
GITHUB_REDIRECT_URI=http://localhost:5000/api/auth/github/callback

# OpenAI (Whisper)
OPENAI_API_KEY=

# Anthropic (Claude)
ANTHROPIC_API_KEY=

# Frontend URL (for CORS)
CLIENT_URL=http://localhost:5173
```

---

## 10. Open Questions

| # | Question | Options | Current Decision |
|---|---|---|---|
| Q1 | Audio storage for voice notes | MongoDB base64 (< 5MB) vs Cloudinary free tier | Base64 for MVP; migrate to Cloudinary if storage grows |
| Q2 | Mail merge open tracking | Gmail API reply polling vs third-party open pixel | Reply polling only — simpler, no external dependency |
| Q3 | Block editor choice | TipTap vs BlockNote vs Slate | TipTap — most mature, best docs, easiest to extend |
| Q4 | Client state management | Zustand vs Redux vs React Context | Zustand — lightweight API, sufficient for this scale |
| Q5 | Snippet repo visibility | Private vs public | Private by default; user can change per snippet |
| Q6 | Multi-account inbox merging | Single unified list vs tabbed per account | Tabbed per account for Phase 1; unified toggle in Phase 2 |

---

*FlowSpace · REQUIREMENTS.md · v1.0.0*  
*SynqBite · Muhammad*
