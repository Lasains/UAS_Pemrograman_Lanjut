# Graph Report - projek  (2026-11-26)

## Corpus Check
- 161 files · ~588,448 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 20 file(s) not represented in the graph (top: (none) 16, .example 1, .xml 1)

## Summary
- 799 nodes · 1219 edges · 64 communities (38 shown, 26 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 66 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `3957196e`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Illuminate\Http\Request
- User
- react
- Eloquent Model: IngredientBatch
- package.json
- LoginRequest
- Illuminate\Database\Schema\Blueprint
- devDependencies
- compilerOptions
- inventory.d.ts
- config
- composer.json
- require-dev
- 09_design_system_color_tokens.md
- require
- 2. Penjelasan Per Komponen Arsitektur Baru
- AppServiceProvider
- bootstrap/app.php
- scripts
- Penjelasan: 4 Halaman Tersendiri untuk Barista BeanFlow
- Penjelasan: 3 Halaman Eksekutif untuk Owner BeanFlow
- Penjelasan: Halaman Operasional & Pengawasan Supervisor BeanFlow
- IngredientBatch
- psr-4
- 2. Penjelasan Per Komponen Utama Hasil Sinkronisasi
- Custom RoleMiddleware RBAC Guard
- Barista/Dashboard.tsx
- ExampleTest
- index.d.ts
- autoload-dev
- extra
- PRD Executive Summary & Problem Scope
- Warm Cafe Modern Design Contract
- Git Branching Strategy & Develop Integration SOP
- Local Stack Environment Setup Instructions
- Project Manager Coordination SOP & Timeline
- Database Migration: Categories Table
- Database Migration: Users Table with Role Enum
- Robots.txt Crawler Directives
- Frontend Developer 2 Task Specification
- Penjelasan Modul 09: Palet Warna & Token Desain Kafe (Tailwind CSS)
- AuthenticatedLayout.tsx
- Penjelasan Modul 15: Penerimaan Batch Baru (Restock Multi-Batch)
- Penjelasan Modul 11: Antarmuka Autentikasi & Login Multi-Peran (BeanFlow)
- Penjelasan Modul 12: Layout Kerangka Utama & Navigasi RBAC (BeanFlow App Shell)
- Penjelasan Modul 14: Pencatatan Pemakaian Bahan & Smart Warning Deviasi FEFO
- AuthenticatedLayout
- Penjelasan Modul 16: Pelaporan Bahan Rusak & Pemusnahan (Waste Write-Off)
- Batches/Create.tsx
- Waste/Create.tsx

## God Nodes (most connected - your core abstractions)
1. `User` - 45 edges
2. `react` - 26 edges
3. `@inertiajs/react` - 23 edges
4. `Controller` - 20 edges
5. `IngredientBatch` - 20 edges
6. `TestCase` - 18 edges
7. `AuthenticatedLayout()` - 16 edges
8. `InputError()` - 15 edges
9. `PrimaryButton()` - 15 edges
10. `GuestLayout()` - 15 edges

## Surprising Connections (you probably didn't know these)
- `Token: `surface.canvas` (`#FAF7F2`) — Warm Steamed Milk & Porcelain` --references--> `AuthenticatedLayout()`  [INFERRED]
  docs/explanations/09_design_system_color_tokens.md → resources/js/Layouts/AuthenticatedLayout.tsx
- `1. Komponen: `BaristaDashboard()`` --references--> `AuthenticatedLayout()`  [INFERRED]
  docs/explanations/13_ui_barista_dashboard.md → resources/js/Layouts/AuthenticatedLayout.tsx
- `Token: `surface.canvas` (`#FAF7F2`) — Warm Steamed Milk & Porcelain` --references--> `GuestLayout()`  [INFERRED]
  docs/explanations/09_design_system_color_tokens.md → resources/js/Layouts/GuestLayout.tsx
- `1. Komponen Utama: `UsageIndex()`` --references--> `AuthenticatedLayout()`  [INFERRED]
  docs/explanations/14_ui_fefo_usage.md → resources/js/Layouts/AuthenticatedLayout.tsx
- `1. Komponen Utama: `WasteCreate()`` --references--> `AuthenticatedLayout()`  [INFERRED]
  docs/explanations/16_ui_waste_reporting.md → resources/js/Layouts/AuthenticatedLayout.tsx

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **FEFO Stock Lifecycle Workflow: Restock, FEFO Usage, and Waste Disposal** — docs_plan_backend_plan_05_batch_restock_controller_ingredient_batch_controller, docs_plan_backend_plan_06_stock_usage_fefo_controller_stock_usage_controller, docs_plan_backend_plan_07_waste_disposal_controller_waste_log_controller, prd_fefo_usage_workflow [EXTRACTED 1.00]
- **Multi-Role RBAC Governance: Route Guarding, Navigation, and Seeding** — docs_plan_backend_plan_04_auth_rbac_middleware_role_middleware, docs_plan_backend_plan_04_auth_rbac_middleware_role_redirect_service, prd_rbac_roles_matrix, docs_panduan_panduan_frontend_1_app_shell_rbac_nav [EXTRACTED 1.00]
- **Damaged Stock Write-off and Financial Loss Analytics Governance** — agents_waste_write_off_policy, docs_plan_backend_plan_07_waste_disposal_controller_approve_waste_action, docs_plan_backend_plan_08_dashboard_analytics_controller_analytics_controller, docs_plan_backend_plan_01_migrations_schema_waste_logs_table [EXTRACTED 1.00]
- **FEFO Stock Consumption & Deviation Audit Workflow** — docs_plan_frontend_plan_03_barista_operasional_fefo_fefo_recommendation_engine, docs_plan_frontend_plan_03_barista_operasional_fefo_smart_warning_dialog, docs_explanations_06_stock_usage_fefo_controller_atomic_usage_decrement, docs_explanations_02_models_eloquent_fefo_query_scopes [INFERRED 0.85]
- **Multi-Role RBAC Authorization & Dynamic Shell System** — docs_plan_frontend_plan_01_auth_login_one_click_demo_login, docs_plan_frontend_plan_02_app_layout_rbac_rbac_menu_matrix, docs_explanations_04_auth_rbac_middleware_role_middleware_routing, docs_explanations_08_dashboard_analytics_controller_three_perspective_lenses_analogy [INFERRED 0.85]
- **Two-Tier Waste Write-Off & Loss Settlement Architecture** — docs_plan_frontend_plan_06_waste_approval_center_no_hard_delete_waste_policy, docs_plan_frontend_plan_06_waste_approval_center_two_tier_waste_approval, docs_explanations_07_waste_disposal_controller_waste_ticket_analogy, docs_explanations_07_waste_disposal_controller_financial_loss_calculation [INFERRED 0.95]

## Communities (64 total, 26 thin omitted)

### Community 0 - "Illuminate\Http\Request"
Cohesion: 0.07
Nodes (12): AuthenticatedSessionController, ConfirmablePasswordController, EmailVerificationNotificationController, EmailVerificationPromptController, NewPasswordController, PasswordController, PasswordResetLinkController, RegisteredUserController (+4 more)

### Community 1 - "User"
Cohesion: 0.06
Nodes (10): User, AuthenticationTest, EmailVerificationTest, PasswordConfirmationTest, PasswordResetTest, PasswordUpdateTest, RegistrationTest, ExampleTest (+2 more)

### Community 2 - "react"
Cohesion: 0.10
Nodes (27): @headlessui/react, @inertiajs/react, lucide-react, react, ApplicationLogo(), DangerButton(), DropDownContext, InputError() (+19 more)

### Community 3 - "Eloquent Model: IngredientBatch"
Cohesion: 0.05
Nodes (45): Early Warning Traffic Light Expiration Logic, FEFO Core Business Rules Specification, FEFO Recommendation Badge UI Component, Smart Warning FEFO Deviation Modal UI, Tailwind Cafe Color Palette & Status Tokens, Backend Developer 1 Task Specification, FEFO Stock Deduction Engine Backend Task, Backend Developer 2 Task Specification (+37 more)

### Community 4 - "package.json"
Cohesion: 0.05
Nodes (30): dependencies, clsx, lucide-react, recharts, tailwind-merge, private, scripts, build (+22 more)

### Community 5 - "LoginRequest"
Cohesion: 0.10
Nodes (3): LoginRequest, ProfileUpdateRequest, UserFactory

### Community 6 - "Illuminate\Database\Schema\Blueprint"
Cohesion: 0.08
Nodes (15): {closure#1}(), {closure#2}(), {closure#3}(), {closure#1}(), {closure#2}(), {closure#1}(), {closure#2}(), {closure#3}() (+7 more)

### Community 7 - "devDependencies"
Cohesion: 0.11
Nodes (18): devDependencies, autoprefixer, axios, concurrently, @headlessui/react, @inertiajs/react, laravel-vite-plugin, postcss (+10 more)

### Community 8 - "compilerOptions"
Cohesion: 0.12
Nodes (15): compilerOptions, allowJs, esModuleInterop, forceConsistentCasingInFileNames, isolatedModules, jsx, module, moduleResolution (+7 more)

### Community 9 - "inventory.d.ts"
Cohesion: 0.15
Nodes (12): 3. Logika Bisnis: Lampu Lalu Lintas Status Bahan (`UrgencyStatus`), BatchStatus, Category, DashboardMetrics, Ingredient, IngredientBatch, Role, StockUsage (+4 more)

### Community 10 - "config"
Cohesion: 0.20
Nodes (10): block, pestphp/pest-plugin, php-http/discovery, config, allow-plugins, optimize-autoloader, policy, preferred-install (+2 more)

### Community 11 - "composer.json"
Cohesion: 0.22
Nodes (8): description, keywords, license, minimum-stability, name, prefer-stable, $schema, type

### Community 12 - "require-dev"
Cohesion: 0.22
Nodes (9): require-dev, fakerphp/faker, laravel/breeze, laravel/pail, laravel/pint, laravel/sail, mockery/mockery, nunomaduro/collision (+1 more)

### Community 13 - "09_design_system_color_tokens.md"
Cohesion: 0.05
Nodes (43): Penjelasan Modul 01: Database & Skema Tabel, Database Schema as Cafe Bookkeeping System, Core Schema Design (5 Core Tables), Penjelasan Modul 02: Eloquent Models & Relasi, Eloquent FEFO Active Batch Scopes, Eloquent Model as Archive Assistant Analogy, Penjelasan Modul 03: Database Seeder & Data Demo, Seeder as Opening Day Preparation Team Analogy (+35 more)

### Community 14 - "require"
Cohesion: 0.29
Nodes (7): require, inertiajs/inertia-laravel, laravel/framework, laravel/sanctum, laravel/tinker, php, tightenco/ziggy

### Community 15 - "2. Penjelasan Per Komponen Arsitektur Baru"
Cohesion: 0.18
Nodes (9): 1. Analogi Dunia Nyata Kafe: Kenapa Desain Sebelumnya "Berantakan"?, 2. Penjelasan Per Komponen Arsitektur Baru, 3. Rangkuman Standarisasi Token Warna (Anti-UI Slop), Komponen: `FefoUsageSlideOverDrawer` (Panel Geser Aksi FEFO), Komponen: `InShellContentView` (Pola Kanvas Konten Isi), Komponen: `UniversalAppShell` (`AppLayout.tsx`), Komponen: `WasteReviewSlideOverDrawer` (Panel Verifikasi Kerugian Bahan Rusak), Masalah Desain Sebelumnya di Google Stitch: (+1 more)

### Community 18 - "scripts"
Cohesion: 0.33
Nodes (6): scripts, dev, post-autoload-dump, post-create-project-cmd, post-root-package-install, post-update-cmd

### Community 19 - "Penjelasan: 4 Halaman Tersendiri untuk Barista BeanFlow"
Cohesion: 0.10
Nodes (20): Halaman A: Dasbor Barista (`Pages/Barista/Dashboard.tsx`), Halaman B: Catat Pemakaian & Riwayat FEFO (`Pages/Usage/Index.tsx`), Halaman C: Penerimaan Batch Baru (`Pages/Batches/Create.tsx`), Halaman D: Lapor Bahan Rusak & Status Tiket (`Pages/Waste/Create.tsx`), Komponen: `BatchCodeInput` + Auto-Generate, Komponen: `BatchSelectorWithInfo`, Komponen: `DeviationInlineWarning`, Komponen: `ExpiryDatePickerWithPreview` (+12 more)

### Community 20 - "Penjelasan: 3 Halaman Eksekutif untuk Owner BeanFlow"
Cohesion: 0.14
Nodes (13): Halaman A: Dasbor Analitik & Finansial Eksekutif (`Pages/Dashboard/OwnerDashboard.tsx`), Halaman B: Laporan Waste & Biaya Limbah (`Pages/Reports/WasteReport.tsx`), Halaman C: Evaluasi Pembelian & Valuasi Aset (`Pages/Reports/InventoryValuation.tsx`), Komponen: `CategoryLossBreakdown` (Kolom Kiri), Komponen: `ExecutiveMetricCards`, Komponen: `ProcurementHealthCards`, Komponen: `ProcurementRecommendationTable`, Komponen: `TopWasteTable` (+5 more)

### Community 21 - "Penjelasan: Halaman Operasional & Pengawasan Supervisor BeanFlow"
Cohesion: 0.14
Nodes (13): 1. Modul Monitoring Inventaris & Kedaluwarsa (`Pages/Inventory/Index.tsx`), 2. Modul Master Bahan Baku (`Pages/Master/Ingredients/Index.tsx`), 3. Modul Manajemen Kategori (`Pages/Master/Categories/Index.tsx`), 4. Modul Approval Pemusnahan Limbah (`Pages/Waste/Index.tsx`), 5. Modul Riwayat Audit & Deviasi FEFO (`Pages/Audit/FefoLog.tsx`), Komponen: `CategoryCardGrid` & `CategoryFormCard`, Komponen: `ExpandableBatchRow`, Komponen: `ExpiryFilterTabs` (+5 more)

### Community 22 - "IngredientBatch"
Cohesion: 0.06
Nodes (13): Category, Ingredient, IngredientBatch, StockUsage, WasteLog, CategorySeeder, DatabaseSeeder, IngredientBatchSeeder (+5 more)

### Community 23 - "psr-4"
Cohesion: 0.40
Nodes (5): autoload, psr-4, App\\, Database\\Factories\\, Database\\Seeders\\

### Community 25 - "2. Penjelasan Per Komponen Utama Hasil Sinkronisasi"
Cohesion: 0.25
Nodes (7): 1. Analogi Dunia Nyata Kafe: Mengapa Plan Harus Disinkronkan dengan Mockup Stitch?, 2. Penjelasan Per Komponen Utama Hasil Sinkronisasi, Komponen: `DeviationWarningCard` (Peringatan Cerdas Deviasi FEFO), Komponen: `ExpandableBatchTable` (Tabel Monitoring Chiller Bertingkat), Komponen: `UsageVsWasteChart` & Visualisasi Recharts Owner, Komponen: `WasteMasterDetailWorkspace` (Pusat Approval Pemusnahan Bahan), PANDUAN PENJELASAN SINKRONISASI PLAN FRONTEND & MOCKUP STITCH (UNTUK PEMULA)

### Community 26 - "Custom RoleMiddleware RBAC Guard"
Cohesion: 0.40
Nodes (5): App Shell Layout & RBAC Sidebar Navigation Task, Custom RoleMiddleware RBAC Guard, Post-Login RoleRedirectService, RBAC Route Protection & Middleware Matrix, RBAC User Personas and Permissions Matrix

### Community 27 - "Barista/Dashboard.tsx"
Cohesion: 0.19
Nodes (11): 1. Komponen: `BaristaDashboard()`, 2. Komponen: `Dashboard()`, 4. Logika Bisnis: Riwayat Audit & Lencana Kepatuhan FEFO, Panduan Pemula — Monitor Speedometer Barista di Stasiun Espresso, Penjelasan Modul 13: Dasbor Operasional Barista & Kesehatan Meja Bar, ActivityItem, BarHealthItem, BaristaDashboard() (+3 more)

### Community 31 - "autoload-dev"
Cohesion: 0.67
Nodes (3): autoload-dev, psr-4, Tests\\

### Community 32 - "extra"
Cohesion: 0.67
Nodes (3): extra, laravel, dont-discover

### Community 33 - "PRD Executive Summary & Problem Scope"
Cohesion: 0.67
Nodes (3): Academic Project Objectives & Scope, PRD Executive Summary & Problem Scope, Cafe Inventory System Project Overview

### Community 54 - "Penjelasan Modul 09: Palet Warna & Token Desain Kafe (Tailwind CSS)"
Cohesion: 0.12
Nodes (17): Contoh Integrasi Komponen React, Gambaran Besar: "Warna Bukan Sekadar Estetika, tapi Panduan Mata Barista", Grup 1: `brand` — Biji Kopi Sangrai, Karamel, & Buah Ceri Kopi, Grup 2: `surface` — Meja Keramik & Piringan Bar Kafe, Grup 3: `content` — Tingkatan Teks & Tipografi, Grup 4: Status Peringatan Kedaluwarsa (Traffic Light System), Integrasi di Seluruh Dokumen Perencanaan Frontend (`docs/Plan Frontend/`), Panduan Pemula — Sistem Desain Identitas Kafe (+9 more)

### Community 55 - "AuthenticatedLayout.tsx"
Cohesion: 0.15
Nodes (9): AuthenticatedLayoutProps, NavGroup, NAVIGATION_GROUPS, NavItem, DEMO_BATCHES, DEMO_INGREDIENTS, INITIAL_HISTORY, MockBatch (+1 more)

### Community 56 - "Penjelasan Modul 15: Penerimaan Batch Baru (Restock Multi-Batch)"
Cohesion: 0.22
Nodes (7): 1. Komponen Utama: `BatchesCreate()`, 2. Fungsi: `generateBatchCode()` & `handleAutoGenerateCode()`, 3. Fungsi: `calculateDefaultExpiry(days)` & `handleIngredientChange(ingredient)`, 4. Fungsi: `submit(e)` & Validasi Tanggal Kedaluwarsa, Panduan Pemula — Menata Kiriman Bahan dari Pemasok, Penjelasan Modul 15: Penerimaan Batch Baru (Restock Multi-Batch), BatchesCreate()

### Community 57 - "Penjelasan Modul 11: Antarmuka Autentikasi & Login Multi-Peran (BeanFlow)"
Cohesion: 0.25
Nodes (7): 1. Komponen: `GuestLayout({ children, fullWidth })`, 2. Komponen Utama: `Login({ status, canResetPassword })`, 3. Fungsi: `submit(e)`, 4. Fungsi: `handleQuickLogin(account)`, 5. Fungsi: `setShowPassword(!showPassword)`, Panduan Pemula — Pintu Masuk Kedai Kopi Modern, Penjelasan Modul 11: Antarmuka Autentikasi & Login Multi-Peran (BeanFlow)

### Community 58 - "Penjelasan Modul 12: Layout Kerangka Utama & Navigasi RBAC (BeanFlow App Shell)"
Cohesion: 0.25
Nodes (7): 1. Komponen: `AuthenticatedLayout({ header, children })`, 2. Fungsi: `getRoleMeta(role)`, 3. Fungsi: `resolveHref(item)`, 4. Fungsi: `checkActive(item)`, 5. Fungsi: `handleClickOutside(event)`, Panduan Pemula — Denah Rumah & Jalur Navigasi Kafe, Penjelasan Modul 12: Layout Kerangka Utama & Navigasi RBAC (BeanFlow App Shell)

### Community 59 - "Penjelasan Modul 14: Pencatatan Pemakaian Bahan & Smart Warning Deviasi FEFO"
Cohesion: 0.33
Nodes (5): 2. Fungsi: `handleSelectBatch(batch)`, 3. Fungsi: `handleQuickQty(qty)`, 4. Fungsi: `submit(e)` & Validasi Deviasi Smart Warning, Panduan Pemula — Menghabiskan Susu Sesuai Urutan Kedaluwarsa, Penjelasan Modul 14: Pencatatan Pemakaian Bahan & Smart Warning Deviasi FEFO

### Community 60 - "AuthenticatedLayout"
Cohesion: 0.47
Nodes (5): 1. Komponen Utama: `UsageIndex()`, 1. Komponen Utama: `WasteCreate()`, AuthenticatedLayout(), UsageIndex(), WasteCreate()

### Community 61 - "Penjelasan Modul 16: Pelaporan Bahan Rusak & Pemusnahan (Waste Write-Off)"
Cohesion: 0.33
Nodes (5): 2. Logika Bisnis: Aturan Dilarang Hard Delete (*No Hard Delete Rule*), 3. Logika Bisnis: Estimasi Beban Kerugian Finansial Realtime, 4. Fungsi: `submit(e)` & Validasi Kuantitas, Panduan Pemula — Menangani Susu Basi & Bahan Tumpah Secara Akuntabel, Penjelasan Modul 16: Pelaporan Bahan Rusak & Pemusnahan (Waste Write-Off)

### Community 62 - "Batches/Create.tsx"
Cohesion: 0.33
Nodes (4): INGREDIENTS_CATALOG, INITIAL_INTAKE_HISTORY, IntakeRecord, MockIngredient

### Community 63 - "Waste/Create.tsx"
Cohesion: 0.33
Nodes (4): AVAILABLE_BATCHES, INITIAL_TICKETS, MockBatch, WasteTicket

## Knowledge Gaps
- **56 isolated node(s):** `@types/node`, `@types/react`, `@types/react-dom`, `autoprefixer`, `concurrently` (+51 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 382 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **26 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `BatchesCreate()` connect `Penjelasan Modul 15: Penerimaan Batch Baru (Restock Multi-Batch)` to `AuthenticatedLayout`, `Batches/Create.tsx`?**
  _High betweenness centrality (0.207) - this node is a cross-community bridge._
- **What connects `@types/node`, `@types/react`, `@types/react-dom` to the rest of the system?**
  _56 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Illuminate\Http\Request` be split into smaller, more focused modules?**
  _Cohesion score 0.06666666666666667 - nodes in this community are weakly interconnected._
- **Why does `User` connect `User` to `Illuminate\Http\Request`, `LoginRequest`, `IngredientBatch`?**
  _High betweenness centrality (0.194) - this node is a cross-community bridge._
- **Should `User` be split into smaller, more focused modules?**
  _Cohesion score 0.06352087114337568 - nodes in this community are weakly interconnected._
- **Should `react` be split into smaller, more focused modules?**
  _Cohesion score 0.10056497175141244 - nodes in this community are weakly interconnected._
- **Should `Eloquent Model: IngredientBatch` be split into smaller, more focused modules?**
  _Cohesion score 0.04810360777058279 - nodes in this community are weakly interconnected._