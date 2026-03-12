# Troubleshooting Guide - Portfolio Project

This document covers common issues encountered during development and their solutions.

---

## Project Overview

**Tech Stack:**
- **Frontend/Backend**: Next.js 16.1.6 (App Router)
- **Database ORM**: Prisma 6.19.2
- **Database**: PostgreSQL 15
- **Containerization**: Docker & Docker Compose
- **CI/CD**: GitHub Actions

**Architecture:**
- **Local Development**: Docker Compose with local PostgreSQL container
- **CI/CD Testing**: GitHub Actions with test database + Docker verification
- **Production**: EC2 deployment with Neon PostgreSQL database

---

## Issue #1: Next.js 15+ Params Must Be Awaited

### Problem
Tests failed with these errors:
```
AssertionError: expected { message: 'Invalid id' } to have property "id"
AssertionError: expected 400 to be 404
```

### Root Cause
In Next.js 15+, the `params` prop in API routes and page components became **asynchronous** and must be awaited.

**Old Code (Next.js 14):**
```javascript
export async function GET(request, { params }) {
  const id = Number(params.id);  // ❌ params.id is undefined in Next.js 15+
}
```

**What was happening:**
- `params` is now a Promise, not a plain object
- `params.id` returned `undefined`
- `Number(undefined)` returned `NaN`
- The validation returned 400 (Invalid id) instead of fetching the project

### Solution
Always **await params** before accessing its properties:

```javascript
export async function GET(request, { params }) {
  const { id: paramId } = await params;  // ✅ Await the params Promise
  const id = Number(paramId);
}
```

### Files Modified
- [app/api/projects/[id]/route.js](app/api/projects/[id]/route.js) - All route handlers (GET, PUT, DELETE)
- [app/projects/[id]/page.js](app/projects/[id]/page.js) - Page component

### References
- [Next.js 15 Migration Guide - Params](https://nextjs.org/docs/messages/sync-dynamic-apis)

---

## Issue #2: GitHub Actions Port Conflicts

### Problem
Docker Compose failed to start in CI with these errors:

**Error 1 - Port 5432 (Database):**
```
Bind for 0.0.0.0:5432 failed: port is already allocated
```

**Error 2 - Port 3000 (App):**
```
failed to bind host port for 0.0.0.0:3000: address already in use
```

### Root Cause
The CI workflow runs multiple stages that compete for the same ports:

1. **GitHub Actions postgres service** runs on port `5432` for npm tests
2. **Next.js dev server** (`npm run dev &`) runs on port `3000` for npm tests
3. **Docker Compose** tries to start and needs both `5432` and `3000`

All three try to run simultaneously → Port conflicts!

### Failed Attempts (What Didn't Work)

❌ **Attempt 1**: Create `docker-compose.ci.yml` override with `ports: []`
- Docker Compose **merges** port arrays, doesn't replace them

❌ **Attempt 2**: Use `ports: ["5433:5432"]` to avoid conflict
- The override wasn't being applied correctly

❌ **Attempt 3**: Use `ports: !reset []` YAML tag
- Bash interpreted `!` as history expansion in commit messages

❌ **Attempt 4**: Use `deploy.replicas: 0` to stop database
- Docker still creates the container and tries to bind ports

❌ **Attempt 5**: Use `profiles` to exclude database, connect to host
- Created complex override file that broke dependencies

### Solution ✅
**Simple approach**: Kill the processes using ports 3000 and 5432 before starting Docker:

```yaml
- name: Stop dev server and postgres
  run: |
    pkill -f "next dev" || true                                          # Free port 3000
    docker stop $(docker ps -q --filter ancestor=postgres:15-alpine) || true  # Free port 5432
```

**Why this works:**
- Tests complete using GitHub Actions infrastructure
- Clean up processes to free ports
- Docker Compose starts fresh with no conflicts

### Files Modified
- [.github/workflows/ci.yml](.github/workflows/ci.yml) - Added cleanup step before Docker

### Key Lessons
- **Keep it simple**: Cleaning up processes is easier than complex overrides
- **`|| true`**: Prevents errors if process doesn't exist (makes commands idempotent)
- **pkill -f**: Matches full command line (finds "next dev" process)

---

## Issue #3: Docker Not Installed on EC2

### Problem
EC2 deployment failed with these errors:
```
bash: line 14: docker: command not found
bash: line 15: docker: command not found
bash: line 19: docker: command not found
Process exited with status 127
```

### Root Cause
Fresh EC2 instances don't come with Docker pre-installed. The deployment script tried to run `docker compose` commands on a system that didn't have Docker.

### Solution
Updated the deployment workflow to:
1. **Check if Docker exists** before running deployment commands
2. **Auto-install Docker** if missing using official Docker installation method
3. **Use `sudo`** for docker commands (required on fresh installs before user is added to docker group)

**The workflow now:**
```yaml
# Check if Docker is installed
if ! command -v docker &> /dev/null; then
  # Install Docker automatically
  sudo apt-get update
  sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
  # Configure Docker
  sudo usermod -aG docker $USER
  sudo systemctl start docker
fi

# Run deployment with sudo (works for all cases)
sudo docker compose up --build -d
```

### Files Modified
- [.github/workflows/ci.yml](.github/workflows/ci.yml) - Added Docker installation check and sudo commands

### Key Lessons
- **EC2 instances are minimal by default** - only essential packages are installed
- **Auto-installation in CI** makes deployment more robust (works on fresh servers)
- **`sudo` for docker** ensures commands work before user is added to docker group
- **`command -v docker`** is the standard way to check if a command exists

### Required EC2 Setup
**Operating System:** Ubuntu 20.04+ or Amazon Linux 2  
**Inbound Rules (Security Group):**
- SSH (port 22) - for deployment
- HTTP (port 80) or HTTPS (port 443) - for web access
- Custom TCP (port 3000) - if accessing app directly (optional)

**Environment Variables on EC2:**
Create `.env.docker` in your project directory with:
```env
DATABASE_URL=your_neon_database_url
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token
```

---

## CI/CD Workflow Sequence

Understanding the workflow helps debug issues:

```
1. Security Audit
   └─> npm audit (check for vulnerabilities)

2. Build & Test
   ├─> Install dependencies
   ├─> Run Prisma migrations (GitHub Actions postgres on :5432)
   ├─> Seed database
   ├─> Start Next.js dev server (on :3000) in background
   ├─> Run tests (hits localhost:3000)
   │
   ├─> 🧹 CLEANUP: Stop dev server & postgres
   │
   ├─> Build Docker images
   ├─> Start Docker services (fresh postgres on :5432, app on :3000)
   ├─> Run Prisma migrations in Docker
   ├─> Verify containers are running
   └─> Clean up Docker containers

3. Deploy (only on main branch)
   └─> SSH to EC2 and pull latest code
```

---

## Common Commands

### Local Development
```bash
# Start local environment
docker compose up -d

# View logs
docker compose logs -f

# Stop containers
docker compose down

# Reset everything (including data)
docker compose down -v
```

### Database
```bash
# Run migrations
npm run migrate

# Seed database
node prisma/seed.js

# Open Prisma Studio
npx prisma studio
```

### Testing
```bash
# Start dev server (for tests to hit)
npm run dev &

# Run tests
npm test

# Kill dev server
pkill -f "next dev"
```

---

## Environment Variables

### Local Development (`.env` or `.env.docker`)
```env
DATABASE_URL=postgresql://postgres:password@db:5432/mydb?schema=public
```

### GitHub Actions CI
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/portfolio_test?schema=public
```

### Production (EC2 with Neon)
```env
DATABASE_URL=postgresql://username:password@neon.tech/dbname?sslmode=require
```

**Key Differences:**
- **Local**: `@db` (Docker service name)
- **CI**: `@localhost` (GitHub Actions service)
- **Production**: `@neon.tech` (cloud database)

---

## Debugging Tips

### Check Port Usage
```bash
# Linux/Mac
lsof -i :3000
lsof -i :5432

# Windows
netstat -ano | findstr :3000
netstat -ano | findstr :5432
```

### Check Docker Containers
```bash
# List running containers
docker ps

# Check container logs
docker compose logs app
docker compose logs db

# Inspect container
docker inspect yar-portfolio-app-1
```

### GitHub Actions Debugging
- Check the "Actions" tab in your GitHub repository
- Click on a failed workflow run
- Expand failed steps to see full logs
- Use `docker compose logs` step to see container output

---

## Quick Reference

| Issue | Symptom | Solution |
|-------|---------|----------|
| Next.js params error | `expected { message: 'Invalid id' }` | `await params` before accessing |
| Port 5432 in use | `Bind for 0.0.0.0:5432 failed` | Stop postgres before Docker |
| Port 3000 in use | `address already in use` | Stop dev server before Docker |
| Docker not found on EC2 | `docker: command not found` | Workflow auto-installs Docker |
| Tests fail locally | `Unexpected token '<'` | Start dev server: `npm run dev` |
| Prisma errors | Connection refused | Check `DATABASE_URL` env var |

---

## Additional Resources

- [Next.js 15 Migration Guide](https://nextjs.org/docs/app/building-your-application/upgrading/version-15)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

---

**Last Updated**: March 12, 2026  
**Maintainer**: Yara Kemeh
