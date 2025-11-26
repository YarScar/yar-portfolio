[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/NZiYxe3K)
# 🎒 **README.md — Showcase Express (Next.js Routing + Database Project)**

# 🚀 Showcase Express

Build a Portfolio API with Next.js Routes + a Real Database

## 📘 Simple Explanation (5th Grade Reading Level)

Imagine you have a **binder** full of your school projects.
Each page is a **route** (like `/projects` or `/about`).

Your projects are stored in a **filing cabinet** (a database).
When someone asks for a project, a **librarian** (API route) goes to the cabinet, grabs it, and hands it over.

In this project, you will build:

* The **binder** → Next.js pages + routes
* The **filing cabinet** → Prisma + SQLite/Postgres
* The **librarian** → API routes that return JSON

This will help you practice real developer skills in **TS.3 Web Server Services** and **TS.4 Databases**.

# 🎯 Project Goals

By the end of this assignment you will:

* ✔ Build API routes using Next.js (TS.3.1 + TS.3.2)
* ✔ Create a database with Prisma (TS.3.3 + TS.4.1)
* ✔ Write queries to get project data (TS.4.2)
* ✔ Build dynamic routes like `/projects/[id]`
* ✔ Power your portfolio pages using real data

# 🛠️ Tech Stack

* **Next.js 14**
* **App Router**
* **Prisma**
* **PostgreSQL**
* **Vitest** (for testing) -

# Setup Instructions

### 1️⃣ Install dependencies

```bash
npm install
```

### 2️⃣ Run the database migration

```bash
npx prisma migrate dev --name init
```

### 3️⃣ Seed the database

```bash
node prisma/seed.js
```

### 4️⃣ Start the server

```bash
npm run dev
```

Your app will run at:

`http://localhost:3000`



# 🧠 What You Need to Build

### ✅ 1. **Database (Prisma)**

Create a model called `Project` with:

| Field       | Type                |
| ----------- | ------------------- |
| id          | Int (autoincrement) |
| title       | String              |
| description | String              |
| image       | String?             |
| url         | String?             |
| createdAt   | DateTime            |

### ✅ 2. **Seed Script**

Add 3–5 sample projects.

### ✅ 3. **API Routes**

You must create:

#### `/api/projects`

Returns **all** projects.

#### `/api/projects/[id]`

Returns **one** project by ID.
Should return 404 if missing.

### ✅ 4. **Front-End Pages**

* `/projects` → list all projects
* `/projects/[id]` → show a single project

These pages should **fetch from your API**, not hard-coded data.

# Project Requirements Checklist

### 🟢 Must Have

* [ ] Next.js project runs
* [ ] Prisma installed and configured
* [ ] `Project` model created
* [ ] Database seeded with sample data
* [ ] API route: `/api/projects`
* [ ] API route: `/api/projects/[id]`
* [ ] Dynamic route: `/projects/[id]`
* [ ] List page uses API data
* [ ] Detail page uses API data
* [ ] All tests pass

### 🟡 Optional (Bonus)

* [ ] Add tags or categories
* [ ] Add project images
* [ ] Add search or filter queries
* [ ] Add loading states

---

# 🧪 Testing

This project includes automated tests for:

* ✔ API responses
* ✔ Dynamic ID route
* ✔ Database schema

Run tests:

```bash
npm test
```

If all tests pass, you’re good to go! 🎉

# 📊 TS.3 + TS.4 Aligned Rubric

Aligned using your uploaded frameworks:

* TS.3 Web Server Services Framework 
* TS.4 Database Framework 

# 🎉 Final Notes

When you're done:

* Commit and push your work
* Make sure all tests pass
* Submit your GitHub Classroom link

If you get stuck, follow the micro-milestones from class and build one tiny step at a time.