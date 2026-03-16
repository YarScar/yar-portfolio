# Yara Portfolio

A polished, full-stack portfolio showcasing projects, interactive UI, and a production-ready API backed by PostgreSQL, now fully containerized with Docker for easy local setup.

## Overview
- Modern Next.js App Router application with a clean, responsive UI.
- Fully functional CRUD API for projects with Prisma + PostgreSQL.
- File uploads pipeline storing assets to `public/uploads` for immediate use.
- Contact form persistence for inbound messages and lead tracking.
- **Dockerized environment:** app and database run in isolated containers for consistent builds.
- **Future-ready for hosted DB:** can connect to a Neon PostgreSQL instance.

## Features
- **Public pages:** `/about`, `/projects`, `/projects/[id]`, and `/contact`, with `/` redirecting to `/about`.
- **Project showcase UI:** interactive 3D-style project cards, detailed project pages, tags, and optional live links.
- **Admin mode workflow:** hidden cat-sprite trigger opens a secret modal; verified access enables add/edit/delete project controls in the projects UI.
- **Project creation/editing:** modal forms support title, description, long description, tags, URL, and image upload.
- **Image upload pipeline:** `POST /api/upload` saves to local `public/uploads` in development and can use Vercel Blob in production.
- **Contact capture:** contact form submits to `POST /api/contact` and persists messages to the `Message` table.
- **Project API:** full CRUD via `/api/projects` and `/api/projects/[id]` with validation and proper status responses.
- **Dev utility endpoint:** `GET /api/dev/projects` returns debug project payload in development (safe empty response in production).

## Highlights
- Robust project management: create, update, delete, and view project details.
- Employer-friendly UX: interactive 3D-inspired cards and refined visual design.
- Production-focused data layer: Prisma 6 with `@prisma/adapter-pg` via `DATABASE_URL`.
- **Containerized development:** Dockerfile, docker-compose.yml, and .dockerignore included.
- Fast tests with Vitest; scripts for development, build, and start are ready.
- **Supports hosted databases:** ready for Neon or other PostgreSQL providers.

## Tech Stack
- Frontend: Next.js 16, React 18
- Data: Prisma ORM, PostgreSQL (via `@prisma/adapter-pg`)
- Testing: Vitest
- UI/3D: CSS transforms with optional three.js utilities in components
- Containerization: Docker + Docker Compose

## Architecture
- Pages: About (primary landing), Projects list, Project detail, Contact.
- Components: Admin overlays and modals for inline project management.
- API: Next.js Route Handlers under `app/api/*`.
- Data Layer: Prisma client configured with `DATABASE_URL` (Postgres).
- Assets: `public/uploads` for user-uploaded files.
- **Docker Setup:**
  - `Dockerfile` builds the Next.js app using a multistage build.
  - `docker-compose.yml` orchestrates app + database, with restart policies and healthchecks.
  - `.dockerignore` reduces build context and speeds up container builds.

## Data Model
`Project`
- `id` (Int, PK, auto)
- `title` (String)
- `description` (String)
- `long` (String?)
- `image` (String?)
- `url` (String?)
- `tags` (String[], default [])
- `createdAt` (DateTime, default now)

`Message`
- `id` (Int, PK, auto)
- `name` (String?)
- `email` (String?)
- `message` (String)
- `createdAt` (DateTime, default now)

## API Endpoints
- `GET /api/projects` — list projects (newest first)
- `POST /api/projects` — create project `{ title, description, url?, image?, tags?, long? }`
- `GET /api/projects/[id]` — fetch single project
- `PUT /api/projects/[id]` — update project (requires `title` and `description`)
- `DELETE /api/projects/[id]` — delete project
- `POST /api/contact` — accept contact messages `{ name?, email?, message }`
- `GET /api/contact` — contact endpoint availability check
- `POST /api/upload` — multipart upload; returns uploaded file URL
- `GET /api/dev/projects` — dev utility returning `{ ok, count, projects }`

## Running Locally with Docker

1. Build and start all services (app + database):

```bash
docker compose up -d --build
```

2. Run migrations:

```bash
docker compose exec app npm run migrate
```

3. (Optional) Seed sample data:

```bash
docker compose exec app node prisma/seed.js
```

4. Open the app:
- `http://localhost`
