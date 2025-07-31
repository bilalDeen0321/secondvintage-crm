# Laravel Architecture – Second Vintage CRM

A complete technical architecture and step-by-step order of implementation based on the project requirements.

---

## 1. Database Design

### 📦 Tables

- `users` – core user data (email, password, name, role_id, etc.)
- `roles` – predefined roles: Admin, Manager, Finance, Agent, Seller
- `watches` – all watches and metadata
- `batches` – group of watches by shipment or category
- `wishlist_items` – wish list data with images, brand, price
- `brands`, `locations`, `statuses`, `stages` – dropdown-related models
- `transactions` – deposits and payments, linked to users and watches
- `platform_data` – Catawiki, Tradera, eBay watch listing fields
- `watch_logs` – activity logs and AI errors
- `descriptions` – AI-generated descriptions per watch
- `settings` – system-wide config: appearance, integrations
- `job_statuses` – queue job tracking (optional)
- `agent_seller_profiles` – extra info for agents/sellers
- `watch_images` – storage references and thumbnails

📌 Use `foreign keys` and `indexed fields` for high-performance querying.

---

## 🔐 2. Authentication

- **Laravel Breeze** or **Laravel Jetstream** (for simple role integration)
- Auth via email/password
- Sanctum API tokens for AJAX/SPA compatibility
- `login`, `register`, `forgot/reset password` routes
- Role checking via `Policies` and `Middleware`

---

## 🧾 3. Role & Permission System

### Roles:
- Admin
- Manager
- Finance
- Agent
- Seller

Use `spatie/laravel-permission`:
```php
Role::create(['name' => 'Admin']);
Permission::create(['name' => 'view watches']);
$user->assignRole('Admin');
```

Control menu visibility and route access using:
```php
@can('edit watches') ... @endcan
```

---

## 🧩 4. Core Features by Module (Implementation Order)

### 1. Watch Management
- CRUD
- Image uploads (`SKU_001.jpg`, etc.)
- AI Webhook integration
- Description generator
- SKU generation
- Pagination + Search (Scout recommended)

### 2. Multi-platform Sales
- Platform selector
- Per-platform fields
- Catawiki CSV Export
- Tradera/eBay API integration
- “Fill out with AI” + Status change

### 3. Batch Management
- Create/Edit Batches
- Location auto-update for watches
- DHL tracking integration
- Grid/List toggle

### 4. Sales History
- Import Catawiki Excel
- Match on SKU
- Buyer info import
- Search/Pagination

### 5. Wish List
- Create/Edit/Delete
- Dropdowns: Brand, Price, Images
- Resize images to 1024x1024
- Grid/List toggle

### 6. Agent Balance
- Add Payment/Deposit
- Watch linkage
- Balance summary
- Status updates: Paid, Refunded, etc.

### 7. Agent/Seller Watches
- Access based on role
- Max 40 images
- Default currency auto-select

### 8. Full Data View
- Filter by all fields
- CSV Export
- Admin-only view

### 9. Logs
- Watch logs, AI errors, actions
- Indexed
- Linked to user/watch

### 10. Settings
- General config
- Integrations (Make.com, DHL)
- Dark mode color fix
- Notifications (future)

---

## 🌐 5. APIs & Webhooks

### Webhooks to Make.com
POST JSON with fields:
```json
{
  "Id": "123",
  "WatchName": "SEIKO LM",
  "SKU": "SEI-LMX-0001",
  "Thread_ID": "abc123",
  "AI_Instruction": "Describe watch"
}
```

### Receive AI response:
- Match with `watch_id` or `thread_id`
- Update description
- Mark job as complete

### DHL API (Batch Tracking)
- On batch status change → Send DHL webhook
- Poll for delivery status

### Tradera/eBay APIs
- Send watch data
- Get response status
- Update platform_data and log

---

## 📥 6. CSV Import / Export

- **Export**: Catawiki template
- **Import**: Sales data (Excel)
- Match fields to internal data (SKU, Buyer, etc.)
- Use Laravel Excel for import/export

---

## 🗂️ 7. File Storage Structure

- Store watch images in:
```
storage/app/public/WatchImages/SKU/001.jpg
```
- Auto-generate thumbnails:
```
001_s.jpg
```
- Public URL access enabled via symbolic link (`php artisan storage:link`)

---

## 🚀 8. Optimization & Scalability

- Queue jobs (AI, imports, API calls)
- Laravel Horizon for monitoring
- Full-text search with Meilisearch
- Index: `watch_id`, `user_id`, `status`, `sku`, etc.
- Pagination + Lazy Loading for big datasets

---

## 🧪 9. Testing & Validation

- PHPUnit for backend logic
- Jest or React Testing Library for frontend
- Form validation with Laravel Form Requests
- Faker seeder for 10K+ watches for stress tests

---

## ✅ 10. Deployment & Monitoring

- Use Laravel Forge or Docker
- MySQL + Redis setup
- Sentry + Telescope for error/log tracking
- Daily queue + log pruning