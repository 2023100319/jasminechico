# 🍽️ ERICAHLICIOUS Management System — System Blueprint

> **Version:** 1.0
> **Date:** 2026-08-28
> **Stack:** TypeScript · Next.js 16 · Tailwind CSS · shadcn/ui · MySQL (Aiven) · Uploadthing · Vercel

---

## 📋 Table of Contents

1. [System Overview](#1-system-overview)
2. [User Roles & Permissions](#2-user-roles--permissions)
3. [Tech Stack](#3-tech-stack)
4. [Project Structure](#4-project-structure)
5. [Database Schema](#5-database-schema)
6. [Module Architecture](#6-module-architecture)
7. [API Routes](#7-api-routes)
8. [Authentication Flow](#8-authentication-flow)
9. [UI/UX Component Plan](#9-uiux-component-plan)
10. [Page Map (Route Architecture)](#10-page-map-route-architecture)
11. [Deployment Architecture](#11-deployment-architecture)
12. [Security Considerations](#12-security-considerations)
13. [Key Data Flows](#13-key-data-flows)

---

## 1. System Overview

The **ERICAHLICIOUS Management System** is a full-stack, role-based restaurant management platform for **ERICAHLICIOUS Food Inc.** It covers the full operational lifecycle of a food & beverage business — from customer ordering on the web to real-time kitchen/bar displays, cashiering, inventory management, and owner-level analytics.

### System Modules

| Module | Description |
|---|---|
| **Authentication** | Role-based login with per-role credential gating |
| **Cashier Dashboard** | POS-style order management, payment processing, daily sales view |
| **Kitchen Display** | Real-time order queue for kitchen staff |
| **Bar Display** | Real-time beverage order queue for bar staff |
| **Menu Management** | CRUD for menu items with photo upload and ingredient mapping |
| **Inventory** | Ingredient stock tracking with category filters and status alerts |
| **User Management** | Admin CRUD for staff accounts with role assignments and archiving |
| **Reports** | Sales analytics with revenue, profit, and top-selling items |
| **Customer Web** | Public-facing ordering portal (Customer Side — separate app) |

---

## 2. User Roles & Permissions

The system supports **3 distinct roles**, each with a scoped dashboard and feature access.

| Role | Dashboard | Modules Accessible |
|---|---|---|
| **Owner** | Owner Dashboard | Dashboard, Orders, Users, Menu, Inventory, Reports |
| **Admin/Management** | Admin Dashboard | Dashboard, Users, Menu, Reports |
| **Supervisor** | Supervisor Dashboard | Dashboard, Orders, Users, Menu, Inventory, Reports |

### Role Permission Matrix

| Feature | Owner | Admin | Supervisor |
|---|:---:|:---:|:---:|
| View Dashboard/Analytics | ✅ | ✅ | ✅  |
| Manage Menu | ✅ | ✅ | ✅  |
| Manage Users | ✅ | ✅ | ✅  |
| Manage Inventory | ✅ | ❌ | ✅  |
| View Reports | ✅ | ✅ | ✅  |
| Process Payments | ✅ | ❌ | ✅  |
| Add Transactions (CSV) | ✅ | ❌ | ✅ | ✅ | ❌ | ❌ |
| View Order Queue | ✅ | ✅ | ✅  |
| Mark Orders as Ready | ❌ | ❌ | ❌  |
| Archive/Restore Users | ✅ | ✅ | ❌  |

---

## 3. Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| **Next.js 16** | App Router, SSR, RSC, API Routes |
| **TypeScript** | Type safety across the entire codebase |
| **Tailwind CSS** | Utility-first styling |
| **shadcn/ui** | Accessible, composable UI components |
| **Recharts** | Revenue vs Expenses & Profit Trend charts |
| **React Hook Form** | Form handling with validation |
| **Zod** | Schema-based validation (shared TS types) |
| **NextAuth.js v5** | Authentication with credential provider |
| **Tanstack Query** | Data fetching, caching, and mutations |
| **Lucide React** | Icon library |

### Backend

| Technology | Purpose |
|---|---|
| **Next.js API Routes** | RESTful endpoints within the same project |
| **Prisma ORM** | Type-safe database access for MySQL |
| **MySQL via Aiven** | Cloud-hosted relational database |
| **Uploadthing** | Menu item image uploads (cloud storage) |
| **bcryptjs** | Password hashing |
| **jsonwebtoken** | Session token management (via NextAuth) |

### Infrastructure & Deployment

| Technology | Purpose |
|---|---|
| **Vercel** | Hosting, Edge Functions, CI/CD via GitHub |
| **Aiven MySQL** | Cloud MySQL database (auto-backups, SSL) |
| **Uploadthing** | S3-compatible file storage for menu images |
| **GitHub** | Source control & Vercel deploy triggers |

---

## 4. Project Structure

```
ericahlicious-ms/
├── app/
│   ├── (auth)/
│   │   ├── page.tsx                    # Role Selection Screen
│   │   └── login/[role]/page.tsx       # Role-specific Login
│   │
│   ├── (dashboard)/
│   │   ├── layout.tsx                  # Sidebar + Header layout
│   │   │   └── payment/page.tsx       # Payment & Transactions
│   │   ├── admin/
│   │   │   ├── page.tsx               # Admin Dashboard
│   │   │   ├── users/page.tsx         # User Management (Active)
│   │   │   ├── users/archived/page.tsx
│   │   │   ├── menu/page.tsx          # Menu Management
│   │   │   └── reports/page.tsx       # Reports
│   │   ├── supervisor/
│   │   │   ├── page.tsx
│   │   │   ├── orders/page.tsx
│   │   │   ├── users/page.tsx
│   │   │   ├── menu/page.tsx
│   │   │   ├── inventory/page.tsx
│   │   │   └── reports/page.tsx
│   │   └── owner/
│   │       ├── page.tsx               # Full Overview Dashboard
│   │       ├── orders/page.tsx
│   │       ├── users/page.tsx
│   │       ├── users/archived/page.tsx
│   │       ├── menu/page.tsx
│   │       ├── inventory/page.tsx
│   │       └── reports/page.tsx
│   │
│   └── api/
│       ├── auth/[...nextauth]/route.ts
│       ├── users/route.ts
│       ├── orders/route.ts
│       ├── menu/route.ts
│       ├── inventory/route.ts
│       ├── reports/route.ts
│       └── uploadthing/route.ts
│
├── components/
│   ├── ui/                            # shadcn/ui components
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   └── Header.tsx
│   ├── dashboard/
│   │   ├── StatCard.tsx
│   │   ├── RevenueChart.tsx
│   │   ├── ProfitTrendChart.tsx
│   │   ├── TopMenuItems.tsx
│   │   ├── InventoryStatus.tsx
│   │   └── DecisionInsights.tsx
│   ├── orders/
│   │   ├── OrderTable.tsx
│   │   ├── OrderQueueCard.tsx
│   │   └── OrderStatusBadge.tsx
│   ├── menu/
│   │   ├── MenuItemCard.tsx
│   │   ├── MenuCategoryTabs.tsx
│   │   └── AddMenuItemForm.tsx
│   ├── inventory/
│   │   ├── InventoryTable.tsx
│   │   └── AddStockForm.tsx
│   ├── users/
│   │   ├── UserTable.tsx
│   │   ├── UserRoleBadge.tsx
│   │   └── AddUserForm.tsx
│   └── reports/
│       ├── ReportFilterBar.tsx
│       └── TopItemsList.tsx
│
├── lib/
│   ├── prisma.ts
│   ├── auth.ts
│   ├── utils.ts
│   └── uploadthing.ts
│
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
│
├── types/index.ts
├── middleware.ts
├── next.config.ts
├── tailwind.config.ts
└── .env.local
```

---

## 5. Database Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

enum Role {
  OWNER
  ADMIN
  SUPERVISOR
}

enum OrderStatus {
  PENDING
  PREPARING
  READY
  COMPLETED
  CANCELLED
}

enum OrderType {
  DINE_IN
  TAKE_OUT
}

enum StockStatus {
  GOOD
  LOW
  OUT_OF_STOCK
}

enum UserStatus {
  ACTIVE
  ARCHIVED
}

model User {
  id          Int        @id @default(autoincrement())
  name        String
  username    String     @unique
  password    String
  role        Role
  status      UserStatus @default(ACTIVE)
  lastActive  DateTime?
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt

  orders           Order[]
  transactions     Transaction[]
  inventoryUpdates InventoryItem[] @relation("UpdatedBy")
}

model MenuCategory {
  id        Int        @id @default(autoincrement())
  name      String     @unique
  menuItems MenuItem[]
}

model MenuItem {
  id         Int          @id @default(autoincrement())
  name       String
  price      Decimal      @db.Decimal(10, 2)
  imageUrl   String?
  isArchived Boolean      @default(false)
  categoryId Int
  category   MenuCategory @relation(fields: [categoryId], references: [id])
  orderItems OrderItem[]
  ingredients MenuIngredient[]
  createdAt  DateTime     @default(now())
  updatedAt  DateTime     @updatedAt
}

model MenuIngredient {
  id         Int      @id @default(autoincrement())
  menuItemId Int
  menuItem   MenuItem @relation(fields: [menuItemId], references: [id])
  name       String
}

model InventoryCategory {
  id    Int             @id @default(autoincrement())
  name  String          @unique
  items InventoryItem[]
}

model InventoryItem {
  id          Int               @id @default(autoincrement())
  name        String
  stock       String
  supplier    String?
  expiry      DateTime?
  status      StockStatus       @default(GOOD)
  categoryId  Int
  category    InventoryCategory @relation(fields: [categoryId], references: [id])
  updatedById Int?
  updatedBy   User?             @relation("UpdatedBy", fields: [updatedById], references: [id])
  createdAt   DateTime          @default(now())
  updatedAt   DateTime          @updatedAt
}

model Order {
  id          Int         @id @default(autoincrement())
  orderCode   String      @unique
  tableNum    String?
  type        OrderType   @default(DINE_IN)
  status      OrderStatus @default(PENDING)
  total       Decimal     @db.Decimal(10, 2)
  isPaid      Boolean     @default(false)
  createdById Int?
  createdBy   User?       @relation(fields: [createdById], references: [id])
  items       OrderItem[]
  payment     Payment?
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
}

model OrderItem {
  id         Int      @id @default(autoincrement())
  orderId    Int
  order      Order    @relation(fields: [orderId], references: [id])
  menuItemId Int
  menuItem   MenuItem @relation(fields: [menuItemId], references: [id])
  quantity   Int      @default(1)
}

model Payment {
  id      Int      @id @default(autoincrement())
  orderId Int      @unique
  order   Order    @relation(fields: [orderId], references: [id])
  amount  Decimal  @db.Decimal(10, 2)
  paidAt  DateTime @default(now())
}

model Transaction {
  id            Int      @id @default(autoincrement())
  filename      String
  generatedAt   DateTime @default(now())
  generatedById Int?
  generatedBy   User?    @relation(fields: [generatedById], references: [id])
}

model DailyExpense {
  id        Int      @id @default(autoincrement())
  amount    Decimal  @db.Decimal(10, 2)
  date      DateTime
  note      String?
  createdAt DateTime @default(now())
}
```

---

## 6. Module Architecture

### 6.1 Authentication Module

```
Role Selection Screen
  └──> Role Login Modal (Supervisor / Admin / Owner)
            |
            v
      NextAuth CredentialsProvider
            |
      1. Find user by username
      2. Verify bcrypt password
      3. Check status === ACTIVE
      4. Check role matches selected role
      5. Return JWT { id, name, role }
            |
      middleware.ts redirects to role dashboard
```

### 6.2 Cashier Module

- **Daily Sales Dashboard** — Revenue, Total Orders, Paid Orders, Avg Order Value stat cards + Recent Orders
- **All Orders View** — Table: Order ID, Table, Items, Total, Status, Time
- **Transactions** — list of CSV exports + "Add Transaction" button

### 6.4 Menu Management Module

- Category tabs: Pasta | Rice Meals | Pica-Pica/Snacks | Cakes | Coffee/Iced Drinks | Sweet Drinks
- Item cards: Uploadthing photo, name, price, category badge, edit/archive icons, ingredient list
- Add Category and Add Items header actions
- Archived tab for soft-deleted items (restore available)

### 6.3 Inventory Module

- Category filter tabs: Pasta | Diary | Syrups | Powders | Baking | Sweetners | Meat
- Table: Ingredient · Category · Stock · Supplier · Expiry · Status · Updated By
- Status badges: **Good** (green) · **Low** (yellow) · **Out of Stock** (orange)
- Add Category and Add Stock buttons
- Dashboard strip shows critical item alerts

### 6.4 User Management Module

- Searchable table: Name · Role · Status · Last Active · Action
- Role badges color-coded: Admin (purple), Supervisor (light purple)
- Actions: View, Archive, Restore
- Toggle between Active and Archived views
- Add User form with role dropdown

### 6.5 Reports Module

- Time filter toggle: **Day | Week | Month | Year**
- Stat cards: Total Revenue · Total Expenses · Net Profit · Total Orders
- **Revenue vs Expenses** — grouped bar chart
- **Profit Trend** — line chart
- **Top Menu Items** — ranked list with revenue per item
- Print and Download CSV exports

### 6.6 Owner Dashboard (Smart Overview)

- Inventory alert strip: Low Stock / In Stock / Out of Stock color cards
- Top Selling Items bar chart
- Decision Support Insights panel:
  - Restock Recommendation
  - Consumption Trend
  - Fast-Moving Items
  - Stock Prediction
- Total Ingredients, Low Stock count, Expiring Soon (7 days) stats
- Most Used Ingredients horizontal bar chart
- Stock Level Distribution donut chart (Good vs Low)
- Usage Insights and Inventory Restocking text recommendations

---

## 7. API Routes

| Method | Endpoint | Role Access | Description |
|---|---|---|---|
| GET | `/api/users` | Owner, Admin, Supervisor | List all users |
| POST | `/api/users` | Owner, Admin | Create user |
| PATCH | `/api/users/[id]` | Owner, Admin | Update user |
| PATCH | `/api/users/[id]/archive` | Owner, Admin | Archive/restore user |
| GET | `/api/orders` | All | Get orders (role-scoped) |
| POST | `/api/orders` | Supervisor, Owner | Create order |
| PATCH | `/api/orders/[id]/status` | Owner, Supervisor | Update order status |
| GET | `/api/menu` | All | Get menu items by category |
| POST | `/api/menu` | Owner, Admin, Supervisor | Add menu item |
| PATCH | `/api/menu/[id]` | Owner, Admin, Supervisor | Edit menu item |
| PATCH | `/api/menu/[id]/archive` | Owner, Admin, Supervisor | Archive/restore item |
| POST | `/api/menu/category` | Owner, Admin | Add menu category |
| GET | `/api/inventory` | Owner, Supervisor | Get inventory |
| POST | `/api/inventory` | Owner, Supervisor | Add stock |
| PATCH | `/api/inventory/[id]` | Owner, Supervisor | Update stock |
| POST | `/api/inventory/category` | Owner | Add inventory category |
| GET | `/api/reports` | Owner, Admin, Supervisor | Report data |
| GET | `/api/transactions` | Supervisor, Owner | List CSV exports |
| POST | `/api/transactions` | Supervisor, Owner | Log new transaction |
| POST | `/api/uploadthing` | Owner, Admin, Supervisor | File upload handler |

---

## 8. Authentication Flow

```
1. User visits "/" — Role Selection page (public)
2. User clicks role: Supervisor / Admin / Owner
3. Role-specific Login Modal opens
4. User enters username + password
5. NextAuth CredentialsProvider runs:
   a. Query DB: find user by username
   b. Compare bcrypt hash
   c. Assert user.status === ACTIVE
   d. Assert user.role === selected role
   e. Return session object { id, name, role }
6. JWT stored in httpOnly cookie (secure)
7. middleware.ts guards all /(dashboard)/* routes
8. User redirected by role:
     SUPERVISOR → /supervisor
     ADMIN      → /admin
     OWNER      → /owner
9. Wrong role access → redirect to /unauthorized
```

### Session Token Shape

```typescript
interface SessionUser {
  id: number;
  name: string;
  role: "OWNER" | "ADMIN" | "SUPERVISOR";
  username: string;
}
```

---

## 9. UI/UX Component Plan

| Component | shadcn/ui Base | Notes |
|---|---|---|
| Navigation Sidebar | custom | Dark navy bg (#1C2333), white icons/text |
| Top Header Bar | custom | Role label + username + Logout |
| Stat Cards | `Card` | Revenue/Orders/Profit metric tiles |
| Data Tables | `Table` | Sortable, with badge + action columns |
| Forms | `Form`, `Input` | React Hook Form + Zod |
| Modals | `Dialog` | Add user, add menu item, login |
| Buttons | `Button` | Primary (blue), Ghost, Destructive |
| Status Badges | `Badge` | Color-coded per role/status |
| Category Tabs | `Tabs` | Menu and Inventory category switching |
| Charts | Recharts | Bar, Line, Donut wrapped as components |
| Image Upload | custom + Uploadthing | Drag-and-drop with preview |
| Alert Strips | custom | Red/Green/Orange inventory status |
| Search Input | `Input` + Lucide icon | Filters users and menu tables |
| Time Filter | `ToggleGroup` | Day / Week / Month / Year |

---

## 10. Page Map (Route Architecture)

```
/ ................................................ Role Selection (public)
/login/supervisor ................................ Supervisor Login
/login/admin ..................................... Admin Login
/login/owner ..................................... Owner Login

/supervisor ...................................... Supervisor Dashboard
/supervisor/orders ............................... Orders
/supervisor/users ................................ User Management
/supervisor/menu ................................. Menu Management
/supervisor/inventory ............................ Inventory Monitoring
/supervisor/reports .............................. Reports

/admin ........................................... Admin Dashboard
/admin/users ..................................... User Management (Active)
/admin/users/archived ............................ Archived Users
/admin/menu ...................................... Menu Management
/admin/reports ................................... Reports

/owner ........................................... Full Dashboard Overview
/owner/orders .................................... All Orders
/owner/users ..................................... User Management (Active)
/owner/users/archived ............................ Archived Users
/owner/menu ...................................... Menu Management
/owner/inventory ................................. Inventory Monitoring
/owner/reports ................................... Reports
```

---

## 11. Deployment Architecture

```
┌────────────────────────────────────────────────────────┐
│                        VERCEL                          │
│                                                        │
│  ┌─────────────────────────────────────────────────┐  │
│  │           Next.js 16 Application                 │  │
│  │  ┌──────────────┐    ┌────────────────────────┐ │  │
│  │  │  Frontend    │    │   API Routes (Edge)    │ │  │
│  │  │  App Router  │    │   /api/*  NextAuth     │ │  │
│  │  │  RSC + SSR   │    │   Prisma queries       │ │  │
│  │  └──────────────┘    └────────────────────────┘ │  │
│  └─────────────────────────────────────────────────┘  │
│                    │               │                   │
└────────────────────┼───────────────┼───────────────────┘
                     │               │
         ┌───────────▼──┐   ┌────────▼────────┐
         │  Aiven MySQL  │   │   Uploadthing   │
         │  (Cloud DB)   │   │  (File Storage) │
         │  SSL/TLS      │   │  Menu Images    │
         └──────────────┘   └─────────────────┘

CI/CD Pipeline:
  GitHub Push → Vercel Auto-Build → npx prisma generate → Deploy
```

### Environment Variables (.env.local)

```env
# Aiven MySQL
DATABASE_URL="mysql://user:pass@host.aiven.io:PORT/ericahlicious?ssl=true"

# NextAuth
NEXTAUTH_SECRET="your-32-char-secret"
NEXTAUTH_URL="https://your-app.vercel.app"

# Uploadthing
UPLOADTHING_SECRET="sk_live_..."
UPLOADTHING_APP_ID="your-app-id"
```

---

## 12. Security Considerations

| Concern | Mitigation |
|---|---|
| **Authentication** | NextAuth.js v5, JWT, httpOnly cookies |
| **Password Storage** | bcryptjs, salt rounds >= 12 |
| **Route Protection** | middleware.ts checks session + role on every protected route |
| **API Authorization** | Server-side session validation in every API handler |
| **SQL Injection** | Prisma ORM — parameterized queries, no raw SQL |
| **CSRF** | NextAuth handles CSRF tokens automatically |
| **File Uploads** | Uploadthing enforces file type + size limits server-side |
| **Database** | Aiven MySQL with SSL/TLS enforced |
| **Secrets** | .env.local never committed; injected via Vercel project settings |
| **Archived Users** | Archived users rejected at NextAuth authorize callback |
| **Role Mismatch** | Login verifies DB role matches selected role — cross-role blocked |
| **Sensitive Data** | Passwords never included in API responses |

---

## 13. Key Data Flows

### Order Lifecycle

```
Customer places order (Customer Web)
         |
         v
   Order created → status: PENDING
         |
         v
   Supervisor/Owner processes order
   → PREPARING → READY → COMPLETED
   → Transaction CSV generated
```

### Inventory Alert Flow

```
Owner/Supervisor Dashboard loads
         |
         v
   Fetch all InventoryItems
         |
   ┌─────┼──────┐
   v     v      v
  LOW   GOOD  OUT_OF_STOCK
  Red  Green   Orange
  card  card    card
         |
         v
   Decision Support Insights computed:
   - Restock items where status = LOW or OUT_OF_STOCK
   - Consumption trend from order frequency
   - Fast-moving items from top ordered MenuItems
   - Stock prediction: estimated days until depletion
```

### Menu to Inventory Linkage

```
Menu Item (e.g., Chicken Alfredo Pasta)
   └── MenuIngredient list:
       Pasta (100g), Chicken breast (150g), Garlic (10g), Milk (80ml)...
   
When order is completed:
   → (Future feature) Deduct ingredient quantities from InventoryItem stock
   → Trigger LOW/OUT_OF_STOCK status if threshold reached
```

---

*Blueprint prepared for the ERICAHLICIOUS Management System — ERICAHLICIOUS Food Inc.*
