# 📦 Second Vintage CRM – Project Architecture

## 🏗️ High-Level Architecture Overview

```
               +-------------------+       +------------------+
               |  Frontend (SPA)   | <-->  |  Backend (API)   |
               |  (React.js)  |       |  (Laravel 11)     |
               +-------------------+       +------------------+
                         |                          |
              +----------+----------+      +--------+--------+
              |                     |      |                 |
      +---------------+    +--------------------+   +-----------------+
      | AI Webhook/API|    | External Platforms |   | Background Jobs |
      |  (Make.com)    |    | Catawiki, Tradera |   |  (Laravel Queues)|
      +---------------+    +--------------------+   +-----------------+
                               |
                     +------------------+
                     | Third-Party APIs |
                     |  (DHL, etc.)     |
                     +------------------+

                +---------------------------+
                |     MySQL Database        |
                | (10K+ entries optimized)  |
                +---------------------------+
```

---

## 📁 Project Modules

| Module               | Frontend (React)             | Backend (Laravel)                        | Special Notes                                    |
| -------------------- | ---------------------------- | ---------------------------------------- | ------------------------------------------------ |
| Dashboard            | Visual overview, stats       | Authenticated API, stats endpoints       | Role-based metrics                               |
| Watch Management     | List/Edit/Add/Delete watches | CRUD + AI generation + validation        | Async AI + image naming + SKU gen                |
| Multi-platform Sales | Per-platform interface       | Platform-specific schema/API integration | CSV/Excel, API triggers, status handling         |
| Batch Management     | List/Edit/Add batches        | CRUD + DHL webhook                       | Updates location of all watches in batch         |
| Sales History        | Sales records + stats        | Import + Map from CSV                    | 10K+ record performance                          |
| Wish List            | List/Create/Edit wishes      | CRUD                                     | Image resize + price conversion                  |
| Agent/Seller Views   | Filtered views based on role | Filtered queries                         | Access control, image counters, default currency |
| Users & Roles        | Admin management panel       | CRUD + RBAC                              | Laravel Policies/Gates + role-specific menus     |
| Logs                 | Activity/Error logs          | Laravel logs + custom events             | Include AI error responses                       |
| Settings             | App config UI                | CRUD + JSON configs                      | Appearance, Webhook URLs, currency               |

---

## 🧠 Key Features & Techniques

### 🔄 Async AI Description Generation

- **Frontend:**
    - Queue jobs with a `pendingJobs` map.
    - Use `watchId` or `threadId` to track.
    - Show loading indicators per watch.
- **Backend (Optional):**
    - Laravel Job Dispatch with `pending_jobs` table.
    - Store status/result per watch entry.
- **Make.com:**
    - Handles AI text creation.
    - Sends POST response to webhook or waits for polling.

### 🔐 Role-Based Access (RBAC)

- **Laravel Gates/Policies**
- User roles: Admin, Manager, Finance, Agent, Seller
- Permission-based menu + endpoint access

---

## 🧱 Database Schema (Simplified ERD)

```
[Users] <---- [Transactions] ----> [Watches] <--- [Batches]
   |                                         \
[Roles]                                     [WatchLogs]
   |
[WishLists]
   |
[Sellers / Agents] <---> [Balances]

[Brands], [Locations], [Statuses], [Stages]
[PlatformData] --> Tradera, Catawiki, eBay, etc.
```

---

## 📦 Folder Structure Example (Laravel)

```
app/
  └── Http/
      ├── Controllers/
      ├── Middleware/
      └── Requests/
  └── Models/
  └── Services/
      ├── AI/
      └── PlatformSync/
  └── Jobs/
  └── Policies/

routes/
  └── api.php
  └── web.php

resources/
  └── js/ (React frontend)
  └── views/

database/
  └── migrations/
  └── seeders/

storage/
  └── app/public/WatchImages/
```

---

## 🔌 Third-party Integrations

| Service  | Use Case                      | Method           |
| -------- | ----------------------------- | ---------------- |
| Make.com | AI Description generation     | Webhook (POST)   |
| Catawiki | CSV export/import             | Manual/Automated |
| Tradera  | Listing via API               | API POST         |
| DHL      | Batch location tracking       | Webhook/API      |
| Chrono24 | (Optional) Listing (deferred) | TBD              |

---

## 🚀 Performance & Scalability

- ✅ Pagination + Lazy Loading for 10K+ records
- ✅ Full-text search via Laravel Scout (Meilisearch or Algolia)
- ✅ Queued jobs for async AI and API calls
- ✅ Chunked import for large CSVs
- ✅ Image optimization and public storage

---

## ✅ Tech Stack Summary

| Layer      | Technology                |
| ---------- | ------------------------- |
| Frontend   | React + TailwindCSS       |
| Backend    | Laravel 11                |
| Auth       | Laravel Sanctum           |
| Database   | MySQL / MariaDB           |
| File Store | Laravel Storage (public)  |
| Queue      | Laravel Horizon + Redis   |
| AI         | Make.com Webhooks         |
| Hosting    | Laravel Forge / Docker    |
| Monitoring | Sentry, Laravel Telescope |
