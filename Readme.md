# Yara Portfolio

A polished, full-stack portfolio showcasing projects, interactive UI, and a production-ready API backed by PostgreSQL.

## Overview
- Modern Next.js 14 App Router application with a clean, responsive UI.
- Fully functional CRUD API for projects with Prisma + PostgreSQL.
- File uploads pipeline storing assets to `public/uploads` for immediate use.
- Contact form persistence for inbound messages and lead tracking.

## Highlights
- Robust project management: create, update, delete, and view project details.
- Employer-friendly UX: interactive 3D-inspired cards and refined visual design.
- Production-focused data layer: Prisma 7 on `@prisma/adapter-pg` via `DATABASE_URL`.
- Fast tests with Vitest; scripts for development, build, and start are ready.

## Tech Stack
- Frontend: Next.js 14, React 18
- Data: Prisma ORM, PostgreSQL (via `@prisma/adapter-pg`)
- Testing: Vitest
- UI/3D: CSS transforms with optional three.js utilities in components

## Architecture
- Pages: About (primary landing), Projects list, Project detail, Contact.
- Components: Admin overlays and modals for inline project management.
- API: Next.js Route Handlers under `app/api/*`.
- Data Layer: Prisma client configured with `DATABASE_URL` (Postgres).
- Assets: `public/uploads` for user-uploaded files.

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
- `POST /api/upload` — multipart upload; returns `{ url: "/uploads/<file>" }`
- `GET /api/dev/projects` — dev utility returning `{ ok, count, projects }`

## Environment
- Required: `DATABASE_URL` in `.env` (PostgreSQL connection string)
- `.gitignore` excludes env and build artifacts

## Development & Testing
- Scripts: `dev`, `build`, `start`, `test`
- ORM: Prisma 7 with Postgres; seed and health-check scripts in `scripts/`
- Testing: Vitest suite for API/DB behavior in `tests/`

## Security & Reliability
- Validation on API inputs; safe handling of optional fields.
- Uploads stored under `public/uploads` with unique filenames.
- Environment-configured DB; no secrets committed.

## License
MIT — see `LICENSE`.

## Contact
Author: Yara Kemeh — yarascarlet45@gmail.com
Portfolio projects and case studies available in the Projects section.