# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a GitHub Classroom assignment template for building a Portfolio API using Next.js 14 (App Router), Prisma ORM, and PostgreSQL. The project is aligned with competencies TS.3 (Web Server Services Framework) and TS.4 (Database Framework).

## Key Commands

### Setup
```bash
npm install                              # Install dependencies
cp .env.example .env                     # Copy environment variables (update with your DB credentials)
npx prisma migrate dev --name init       # Run database migrations
node prisma/seed.js                      # Seed database with sample data
```

### Development
```bash
npm run dev                              # Start development server (localhost:3000)
npm run build                            # Build for production
npm start                                # Start production server
npm test                                 # Run Vitest tests
```

## Architecture

### Database Layer (Prisma)
- **Database**: PostgreSQL
- **ORM**: Prisma Client (v5.22.0)
- **Schema Location**: `prisma/schema.prisma`
- **Seed Script**: `prisma/seed.js`
- **Environment Variables**: `DATABASE_URL` in `.env` (see `.env.example`)
- **Core Model**: `Project` with fields: id, title, description, image (optional), url (optional), createdAt

### API Routes (Next.js App Router)
- `GET /api/projects` - Returns all projects from database
- `GET /api/projects/[id]` - Returns single project by ID, 404 if not found
- All API routes use Prisma Client to query the database
- Routes return JSON responses using `Response.json()`

### Front-End Pages
- `/projects` - Lists all projects (fetches from `/api/projects`)
- `/projects/[id]` - Shows single project detail (fetches from `/api/projects/[id]`)
- Pages use Next.js 14 App Router conventions (Server Components by default)

### Testing (Vitest)
- `tests/api.test.js` - Tests API endpoint responses
- `tests/db.test.js` - Tests Prisma database schema and queries
- GitHub Classroom autograding configured in `.github/classroom/autograding.json`

## Expected Directory Structure

```
portfolio/
├── prisma/
│   ├── schema.prisma          # Database schema definition
│   └── seed.js                # Sample data seeding script
├── app/
│   ├── page.js                # Home page
│   ├── layout.js              # Root layout
│   ├── projects/
│   │   ├── page.js            # Projects list page
│   │   └── [id]/page.js       # Project detail page
│   └── api/
│       └── projects/
│           ├── route.js       # GET all projects
│           └── [id]/route.js  # GET project by ID
├── tests/
│   ├── api.test.js            # API integration tests
│   └── db.test.js             # Database schema tests
├── .github/classroom/
│   └── autograding.json       # GitHub Classroom test config
├── .env.example               # Environment variables template
└── package.json
```

## Important Implementation Notes

- Always instantiate `PrismaClient` in API routes: `const prisma = new PrismaClient()`
- Use `Response.json()` for API responses (Next.js 14 convention)
- Dynamic route params are accessed via `params` in App Router: `params.id`
- Convert string IDs to numbers when querying: `Number(params.id)`
- Return proper 404 responses when project not found
- Use async/await for all database operations
- Server Components can directly fetch data without `useEffect`
