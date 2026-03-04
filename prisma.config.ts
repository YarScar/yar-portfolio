import 'dotenv/config'
import { defineConfig } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'node --experimental-top-level-await prisma/seed.js',
  },
  datasource: {
    // Use process.env which works in both local (with .env) and CI (with env vars)
    url: process.env.DATABASE_URL || '',
  },
})