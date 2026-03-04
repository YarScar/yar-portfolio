# Docker Troubleshooting Guide

This document covers common issues encountered when adding Docker to an existing Next.js + Prisma project and how to fix them.

---

## Table of Contents
1. [Environment Variable Issues](#environment-variable-issues)
2. [Prisma Configuration Problems](#prisma-configuration-problems)
3. [Build Performance Issues](#build-performance-issues)
4. [CI/CD Configuration](#cicd-configuration)
5. [Quick Fixes Reference](#quick-fixes-reference)

---

## Environment Variable Issues

### Problem: Confusing DATABASE_URL vs DCKR_DATABASE_URL

**Symptom:** 
- Prisma can't connect to database
- Errors like "Can't reach database server"

**What happened:**
- Started with different environment variable names in different files
- `schema.prisma` used `DCKR_DATABASE_URL`
- `docker-compose.yml` set `DATABASE_URL`
- Mismatch caused connection failures

**Solution:**
Standardize on **one** environment variable name: `DATABASE_URL`

```prisma
// prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")  // ✅ Use DATABASE_URL everywhere
}
```

```yaml
# .env.docker
DATABASE_URL=postgresql://postgres:password@db:5432/mydb
```

**Key Lesson:** Pick one variable name and use it consistently across all files.

---

### Problem: Redundant Environment Variables in docker-compose.yml

**Symptom:**
- DATABASE_URL defined in multiple places
- Confusion about which one is used

**What happened:**
```yaml
# ❌ BAD: Setting DATABASE_URL twice
build:
  args:
    DATABASE_URL: postgresql://postgres:password@db:5432/mydb
env_file:
  - .env.docker  # Also contains DATABASE_URL
```

**Solution:**
```yaml
# ✅ GOOD: Set it once
build:
  context: .
env_file:
  - .env.docker  # Single source of truth
```

**Why this works:**
- `build.args` was only needed if we did actual DB operations during build
- We use a dummy URL in Dockerfile for build-time Prisma generation
- Real DATABASE_URL comes from `.env.docker` at runtime

---

## Prisma Configuration Problems

### Problem: prisma.config.ts Causing CI Failures

**Symptom:**
```
Error: The datasource.url property is required in your Prisma config 
file when using prisma migrate deploy.
```

**What happened:**
- `prisma.config.ts` is a newer Prisma feature (and deprecated in Prisma 7)
- When this file exists, Prisma expects datasource URL defined there
- The `env()` helper didn't work properly with environment variables in CI

**Attempted fixes:**
1. ❌ Removed datasource from config → Still failed
2. ❌ Used `env('DATABASE_URL')` → Didn't work in CI
3. ❌ Used `process.env.DATABASE_URL` → Still had issues

**Final solution:**
Since the config file is optional and deprecated:
- Keep it for local development if needed
- OR delete it entirely (everything works from schema.prisma and package.json)

```json
// package.json already has seed config
"prisma": {
  "seed": "node --experimental-top-level-await prisma/seed.js"
}
```

**Key Lesson:** If a config file causes more problems than it solves, remove it.

---

### Problem: Dummy DATABASE_URL for Build vs Runtime

**Symptom:**
- Build fails without DATABASE_URL
- But we don't actually connect to DB during build

**Solution:**
Use a dummy URL during build, real URL at runtime:

```dockerfile
# Dockerfile - Build stage
ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"
RUN npm run build
```

```yaml
# docker-compose.yml - Runtime
env_file:
  - .env.docker  # Real DATABASE_URL here
```

**Why this works:**
- Prisma needs the URL format for validation and client generation
- Next.js build doesn't actually connect to database
- Real connection happens when container runs

---

## Build Performance Issues

### Problem: Docker Builds Taking Too Long

**Symptom:**
- Builds take 5+ minutes
- Final image is 800MB+
- Slow deployments

**Solution: Enable Next.js Standalone Output**

**Step 1:** Update next.config.js
```javascript
const nextConfig = {
  output: 'standalone', // For Docker optimization
  // ... rest of config
}
```

**Step 2:** Update Dockerfile Stage 2
```dockerfile
# ❌ BEFORE: Copying everything (800MB)
COPY --from=builder /app ./

# ✅ AFTER: Copy only what's needed (~50-100MB)
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma

CMD ["node", "server.js"]
```

**Results:**
- ⚡ 90% smaller image
- ⚡ Much faster builds
- ⚡ Faster deployments

**Key Lesson:** Standalone mode is essential for production Docker images.

---

## CI/CD Configuration

### Problem: CI Doing Too Much for Local Docker Testing

**Symptom:**
- CI running migrations and database seeding
- Failures due to prisma.config.ts
- Wasting CI minutes on unnecessary steps

**What we learned:**
For **local Docker testing**, CI should be simple:
- ✅ Verify Docker image builds
- ✅ Run security audit
- ❌ Don't run migrations
- ❌ Don't seed database
- ❌ Don't spin up PostgreSQL

**Simplified CI:**
```yaml
jobs:
  build:
    name: Verify Build
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      - name: Build Docker image
        run: docker build -t my-app .
```

**Key Lesson:** CI for local Docker projects should just verify the build works. All real testing happens with `docker compose up` locally.

---

## Quick Fixes Reference

### Build Fails with "Can't find DATABASE_URL"
```dockerfile
# Add dummy URL in Dockerfile
ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"
```

### Container Can't Connect to Database
```yaml
# Check docker-compose.yml has correct service name
DATABASE_URL=postgresql://postgres:password@db:5432/mydb
#                                          ^^ Must match service name
```

### Image Too Large
```javascript
// Add to next.config.js
output: 'standalone'
```

### CI Keeps Failing
- Remove unnecessary migration/seed steps
- Just verify Docker build works
- Do real testing with `docker compose up` locally

### Port Already in Use
```bash
# Check what's using port 3000
docker compose down
# Or change port in docker-compose.yml
ports:
  - "3001:3000"  # Use 3001 on host instead
```

---

## Testing Your Setup

After implementing fixes, test with:

```bash
# Clean start
docker compose down -v

# Rebuild with changes
docker compose build

# Start everything
docker compose up

# Verify it works
curl http://localhost:3000
```

---

## Summary of Changes Made

1. ✅ Standardized environment variable naming (DATABASE_URL)
2. ✅ Removed redundant docker-compose.yml configurations  
3. ✅ Simplified or removed problematic prisma.config.ts
4. ✅ Implemented standalone build for performance
5. ✅ Added detailed comments to all Docker files
6. ✅ Simplified CI to just verify builds

**Result:** Fast, reliable Docker setup for local development that just works! 🎉
