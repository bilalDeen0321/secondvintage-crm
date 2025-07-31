# Second Vintage CRM Architecture

## 🧑 User Layer

- 👤 **Admin**: Full Access  
- 👤 **Manager**: Edit Access  
- 👤 **Finance**: View + Export  
- 👤 **Agent**: Limited Access  
- 👤 **Seller**: Own Watches Only  

## 💻 Frontend Application (Next.js)

### 📦 Core Modules
- 📊 Dashboard  
- ⌚ Watch Management  
- 🌐 Multi-platform Sales  
- 📦 Batch Management  
- 📈 Sales History  
- ❤️ Wish List  

### 👥 User Management
- 💰 Agent Balance  
- ⌚ Agent Watches  
- ⌚ Seller Watches  
- 👥 Users  

### ⚙️ System
- 🗂️ Full Data View  
- ⚙️ Settings  
- 📋 Log  

## 🛠 Backend Services

- 🔐 Authentication & Authorization  
- 🚪 API Gateway  
- 📁 File Management Service  
- 🏷️ SKU Generator Service  
- 💱 Currency Conversion  

## 🗃️ Database Layer

### 🧩 Core Tables
- ⌚ Watches: Core Dataset  
- 📦 Batches  
- 👥 Users  
- 💳 Transactions  

### 🏷️ Reference Tables
- 🏷️ Brands  
- 📍 Locations  
- 📊 Statuses  
- 📋 Stage Logs  

### ❤️ Separate API
- ❤️ Wish List (Separate API)  

## 🌍 External Integrations

### 🛒 Sales Platforms
- 🏺 Catawiki: CSV Export  
- 🛒 eBay: API Integration  
- 🇸🇪 Tradera: API Integration  
- ⏰ Chrono24: Future  

### 🤖 AI & Automation
- 🤖 Make.com: Webhooks  
- 🧠 AI Description Generation  

### 🚚 Logistics
- 📦 DHL: Tracking API  

## 🗄️ File Storage

- 🖼️ Watch Images: `WatchImages/SKU/001.jpg`, Public URLs  
- 🖼️ Thumbnails: 256x256px, `_s.jpg` suffix  

---

## 🔁 Key Connections

- Admin → Dashboard  
- Dashboard → API Gateway  
- API Gateway → Watches DB  
- Multi-platform Sales → Catawiki  
- Watch Management → Make.com  
- File Management Service → Watch Images  

