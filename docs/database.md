# 📦 Laravel Database Design & Migration Plan for Second Vintage CRM

---

## 1. Tables to Define

- `users`
- `roles`
- `role_user` (pivot)
- `brands`
- `locations`
- `statuses`
- `stages`
- `watches`
- `watch_images`
- `batches`
- `wish_lists`
- `transactions` (payments/deposits)
- `logs`
- `agents` (optional, can be a user role)
- `sellers` (optional, can be a user role)
- `platform_data` (for multi-platform sales data)
- `watch_logs` (activity logs per watch)

---

## 2. Table Designs & Relationships (Simplified)

### users

| Column     | Type       | Notes  |
| ---------- | ---------- | ------ |
| id         | PK         |        |
| name       | string     |        |
| email      | string     | unique |
| password   | string     |        |
| role_id    | FK → roles |        |
| currency   | string     |        |
| created_at | timestamp  |        |
| updated_at | timestamp  |        |

**Relationships:**

- belongsToMany `roles` (many-to-many)
- hasMany `watches` (as agent/seller)
- hasMany `transactions`

---

### roles

| Column     | Type      | Notes                  |
| ---------- | --------- | ---------------------- |
| id         | PK        |                        |
| name       | string    | (Admin, Manager, etc.) |
| created_at | timestamp |                        |
| updated_at | timestamp |                        |

---

### brands

| Column     | Type      | Notes         |
| ---------- | --------- | ------------- |
| id         | PK        |               |
| name       | string    | unique        |
| brand_code | string    | 3-letter code |
| created_at | timestamp |               |
| updated_at | timestamp |               |

---

### locations

| Column     | Type      | Notes  |
| ---------- | --------- | ------ |
| id         | PK        |        |
| name       | string    | unique |
| country    | string    |        |
| created_at | timestamp |        |
| updated_at | timestamp |        |

---

### statuses

| Column     | Type      | Notes                                  |
| ---------- | --------- | -------------------------------------- |
| id         | PK        |                                        |
| name       | string    | e.g. Unpaid, Paid, Refunded, Delivered |
| created_at | timestamp |                                        |
| updated_at | timestamp |                                        |

---

### stages

| Column     | Type      | Notes                        |
| ---------- | --------- | ---------------------------- |
| id         | PK        |                              |
| name       | string    | e.g. Watch Management, Sales |
| created_at | timestamp |                              |
| updated_at | timestamp |                              |

---

### watches

| Column        | Type                    | Notes        |
| ------------- | ----------------------- | ------------ |
| id            | PK                      |              |
| sku           | string                  | unique       |
| name          | string                  |              |
| brand_id      | FK → brands             |              |
| serial_number | string                  |              |
| reference     | string                  |              |
| case_size     | string                  |              |
| caliber       | string                  |              |
| timegrapher   | string                  |              |
| original_cost | decimal                 |              |
| current_cost  | decimal                 |              |
| status_id     | FK → statuses           |              |
| stage_id      | FK → stages             |              |
| batch_id      | FK → batches (nullable) |
| location_id   | FK → locations          |
| agent_id      | FK → users (nullable)   |
| seller_id     | FK → users (nullable)   |
| description   | text                    |              |
| ai_thread_id  | string                  | AI thread ID |
| created_at    | timestamp               |              |
| updated_at    | timestamp               |              |

**Relationships:**

- belongsTo: `brand`, `status`, `stage`, `batch`, `location`, `agent`, `seller`
- hasMany: `watch_images`, `watch_logs`, `platform_data`

---

### watch_images

| Column     | Type         | Notes                   |
| ---------- | ------------ | ----------------------- |
| id         | PK           |                         |
| watch_id   | FK → watches |                         |
| filename   | string       |                         |
| public_url | string       |                         |
| order      | int          | To maintain image order |
| created_at | timestamp    |                         |
| updated_at | timestamp    |                         |

---

### batches

| Column              | Type           | Notes              |
| ------------------- | -------------- | ------------------ |
| id                  | PK             |                    |
| name                | string         |                    |
| location_id         | FK → locations |                    |
| status_id           | FK → statuses  |                    |
| created_by          | FK → users     |                    |
| default_destination | string         | Default: 'Denmark' |
| created_at          | timestamp      |                    |
| updated_at          | timestamp      |                    |

**Note:** On status change to “In Transit” or “Delivered”, update locations of all watches in the batch.

---

### wish_lists

| Column          | Type        | Notes |
| --------------- | ----------- | ----- |
| id              | PK          |       |
| user_id         | FK → users  |       |
| brand_id        | FK → brands |       |
| name            | string      |       |
| price_range_min | decimal     |       |
| price_range_max | decimal     |       |
| currency        | string      |       |
| image_url       | string      |       |
| created_at      | timestamp   |       |
| updated_at      | timestamp   |       |

---

### transactions

| Column       | Type                    | Notes                                     |
| ------------ | ----------------------- | ----------------------------------------- |
| id           | PK                      |                                           |
| user_id      | FK → users              |                                           |
| type         | enum                    | payment, deposit                          |
| payment_type | enum                    | watches, shipping, watchmaker, fee, bonus |
| status       | enum                    | unpaid, paid_not_received, refunded       |
| amount       | decimal                 |                                           |
| currency     | string                  |                                           |
| watch_id     | FK → watches (nullable) |                                           |
| created_at   | timestamp               |                                           |
| updated_at   | timestamp               |                                           |

---

### logs (system-wide)

| Column     | Type                  | Notes                       |
| ---------- | --------------------- | --------------------------- |
| id         | PK                    |                             |
| type       | string                | info, error, ai_error, etc. |
| message    | text                  |                             |
| user_id    | FK → users (nullable) |                             |
| created_at | timestamp             |                             |
| updated_at | timestamp             |                             |

---

### watch_logs

| Column     | Type         | Notes |
| ---------- | ------------ | ----- |
| id         | PK           |       |
| watch_id   | FK → watches |       |
| action     | string       |       |
| details    | text         |       |
| created_at | timestamp    |       |
| updated_at | timestamp    |       |

---

### platform_data

| Column     | Type         | Notes                             |
| ---------- | ------------ | --------------------------------- |
| id         | PK           |                                   |
| watch_id   | FK → watches |                                   |
| platform   | enum         | Catawiki, Tradera, eBay, Chrono24 |
| data       | JSON         | Platform-specific fields          |
| status     | string       |                                   |
| created_at | timestamp    |                                   |
| updated_at | timestamp    |                                   |
