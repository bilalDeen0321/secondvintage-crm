# Daily Task Plan – Watch Management System

The project daily tasks | Timeline: Aug 4 – Aug 29, 2025 (excluding Fri & Sat)

---

## ✅ Week 1

### [Aug 4 Sunday] – Auth & Role System (Part 1)
- Setup Spatie roles: Admin, Manager, Finance, Agent, Seller
- Middleware, guards, and route protection
- Role-based menu rendering (React)

### [Aug 5 Monday] – Auth & Role System (Part 2)
- User role assignment interface
- Permissions for modules/pages
- Access control tests for all user types

### [Aug 6 Tuesday] – Watches CRUD + SKU Generator
- Create Watch model, migration, controller
- SKU generation logic (Brand + Model + Serial)
- Basic Create/Edit form UI

### [Aug 7 Wednesday] – Watch Management UI (Part 1)
- Watch listing page with mockup layout
- Add/Edit Modal: Tabs, Image upload, Next/Previous
- Public image URL logic using SKU filenames

### [Aug 8 Thursday] – Watch Management UI (Part 2)
- Reset AI button → clears Thread ID
- Generate Description → Make.com webhook POST
- Async handler, loading state, local queue

---

## ✅ Week 2

### [Aug 10 Sunday] – Watch Management Finalization
- Pagination or “Load More” for 10k+ watches
- Dropdown editors: Brand, Batch, Location
- Error handling, cleanup, database connection

### [Aug 11 Monday] – Multi-platform Sales (Part 1)
- Setup platform-specific modal
- Start “Fill with AI” logic
- Connect platform fields to DB

### [Aug 12 Tuesday] – Multi-platform Sales (Part 2)
- “Approve → Go Next” logic
- Catawiki + Tradera fields structure
- Data save, update status on approve

### [Aug 13 Wednesday] – Multi-platform Sales (Part 3)
- Catawiki CSV export implementation
- Tradera API basic integration setup
- Connect platforms to Make.com AI

### [Aug 14 Thursday] – Batch Management (Part 1)
- Create/Edit Batch UI
- Location default by user country
- Watch location sync on batch status

---

## ✅ Week 3

### [Aug 17 Sunday] – Batch Management (Part 2)
- List/Grid toggle
- Pagination for large dataset
- DHL API integration placeholder

### [Aug 18 Monday] – Sales History & Stats (Part 1)
- Catawiki Sales CSV import form
- Match watches by SKU
- Buyer data mapping + preview

### [Aug 19 Tuesday] – Sales History & Stats (Part 2)
- Save sales records to DB
- Metrics section: top countries, buyers
- Pagination, cleanup, sample data removal

### [Aug 20 Wednesday] – Wish List
- Add/Edit UI + image upload resize (1024x1024)
- Price formatting (user currency + EUR)
- Pagination, grid/list toggle

### [Aug 21 Thursday] – Agent Balance (Part 1)
- Agent Balance table
- New Payment: dynamic type selector
- Auto-select agent if agent logged in

---

## ✅ Week 4

### [Aug 24 Sunday] – Agent Balance (Part 2)
- Handle “Watches” vs “Non-Watches” types
- Payment status rules
- Refunded logic, balance accuracy

### [Aug 25 Monday] – Agent & Seller Watches
- Agent dropdown visible only to Admin
- Limit max image upload (40) + counter
- Seller dropdown: default currency logic

### [Aug 26 Tuesday] – Users + Full Data View
- Admin-only User management (CRUD)
- Full Data View page
- Export CSV, header-based sorting

### [Aug 27 Wednesday] – Settings + Log Page
- General + Appearance + Integration tabs
- Fix dark theme issues (checkboxes, name, images)
- AI error log tracking, table layout

### [Aug 28 Thursday] – Login + Notification System
- Simple login UI (Lovable design)
- Notification badges for job status & errors
- Integration with AI queue status

---

## ✅ Final Week

### [Aug 29 Sunday] – Final Optimizations
- Performance: eager loading, search index
- UI cleanup, responsive testing
- Watch form edge cases, validations

### [Aug 31 Monday] – Testing & Deployment
- Final cross-role testing
- Production .env + cache clear + deploy
- Deliver build for client handover
