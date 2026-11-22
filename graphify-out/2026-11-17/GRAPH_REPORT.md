# Graph Report - projek  (2026-11-12)

## Corpus Check
- 129 files · ~211,525 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 20 file(s) not represented in the graph (top: (none) 16, .example 1, .xml 1)

## Summary
- 619 nodes · 935 edges · 52 communities (26 shown, 26 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 50 edges (avg confidence: 0.89)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `1f6b3038`
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
- psr-4
- Custom RoleMiddleware RBAC Guard
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

## God Nodes (most connected - your core abstractions)
1. `User` - 35 edges
2. `react` - 22 edges
3. `Controller` - 20 edges
4. `@inertiajs/react` - 19 edges
5. `TestCase` - 18 edges
6. `InputError()` - 17 edges
7. `PrimaryButton()` - 17 edges
8. `InputLabel()` - 15 edges
9. `compilerOptions` - 13 edges
10. `Eloquent Model: IngredientBatch` - 12 edges

## Surprising Connections (you probably didn't know these)
- `Eloquent Model: IngredientBatch` --conceptually_related_to--> `Early Warning Traffic Light Expiration Logic`  [INFERRED]
  docs/Plan Backend/PLAN_02_MODELS_ELOQUENT.md → AGENTS.md
- `FEFO Core Business Rules Specification` --implements--> `DeductStockAction Transaction Service`  [EXTRACTED]
  AGENTS.md → docs/Plan Backend/PLAN_06_STOCK_USAGE_FEFO_CONTROLLER.md
- `Incoming Restock Batch Ingestion Workflow` --implements--> `IngredientBatchController Restock Handler`  [EXTRACTED]
  PRD.md → docs/Plan Backend/PLAN_05_BATCH_RESTOCK_CONTROLLER.md
- `Waste Write-Off Approval & No-Hard-Delete Policy` --rationale_for--> `ApproveWasteAction Write-Off Execution Action`  [EXTRACTED]
  AGENTS.md → docs/Plan Backend/PLAN_07_WASTE_DISPOSAL_CONTROLLER.md
- `ApproveWasteAction Write-Off Execution Action` --semantically_similar_to--> `Financial Loss & Waste Aggregation Kueri Eloquent`  [INFERRED] [semantically similar]
  docs/Plan Backend/PLAN_07_WASTE_DISPOSAL_CONTROLLER.md → docs/Plan Backend/PLAN_08_DASHBOARD_ANALYTICS_CONTROLLER.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **FEFO Stock Lifecycle Workflow: Restock, FEFO Usage, and Waste Disposal** — docs_plan_backend_plan_05_batch_restock_controller_ingredient_batch_controller, docs_plan_backend_plan_06_stock_usage_fefo_controller_stock_usage_controller, docs_plan_backend_plan_07_waste_disposal_controller_waste_log_controller, prd_fefo_usage_workflow [EXTRACTED 1.00]
- **Multi-Role RBAC Governance: Route Guarding, Navigation, and Seeding** — docs_plan_backend_plan_04_auth_rbac_middleware_role_middleware, docs_plan_backend_plan_04_auth_rbac_middleware_role_redirect_service, prd_rbac_roles_matrix, docs_panduan_panduan_frontend_1_app_shell_rbac_nav [EXTRACTED 1.00]
- **Damaged Stock Write-off and Financial Loss Analytics Governance** — agents_waste_write_off_policy, docs_plan_backend_plan_07_waste_disposal_controller_approve_waste_action, docs_plan_backend_plan_08_dashboard_analytics_controller_analytics_controller, docs_plan_backend_plan_01_migrations_schema_waste_logs_table [EXTRACTED 1.00]
- **FEFO Stock Consumption & Deviation Audit Workflow** — docs_plan_frontend_plan_03_barista_operasional_fefo_fefo_recommendation_engine, docs_plan_frontend_plan_03_barista_operasional_fefo_smart_warning_dialog, docs_explanations_06_stock_usage_fefo_controller_atomic_usage_decrement, docs_explanations_02_models_eloquent_fefo_query_scopes [INFERRED 0.85]
- **Multi-Role RBAC Authorization & Dynamic Shell System** — docs_plan_frontend_plan_01_auth_login_one_click_demo_login, docs_plan_frontend_plan_02_app_layout_rbac_rbac_menu_matrix, docs_explanations_04_auth_rbac_middleware_role_middleware_routing, docs_explanations_08_dashboard_analytics_controller_three_perspective_lenses_analogy [INFERRED 0.85]
- **Two-Tier Waste Write-Off & Loss Settlement Architecture** — docs_plan_frontend_plan_06_waste_approval_center_no_hard_delete_waste_policy, docs_plan_frontend_plan_06_waste_approval_center_two_tier_waste_approval, docs_explanations_07_waste_disposal_controller_waste_ticket_analogy, docs_explanations_07_waste_disposal_controller_financial_loss_calculation [INFERRED 0.95]

## Communities (52 total, 26 thin omitted)

### Community 0 - "Illuminate\Http\Request"
Cohesion: 0.07
Nodes (12): AuthenticatedSessionController, ConfirmablePasswordController, EmailVerificationNotificationController, EmailVerificationPromptController, NewPasswordController, PasswordController, PasswordResetLinkController, RegisteredUserController (+4 more)

### Community 1 - "User"
Cohesion: 0.06
Nodes (11): User, DatabaseSeeder, AuthenticationTest, EmailVerificationTest, PasswordConfirmationTest, PasswordResetTest, PasswordUpdateTest, RegistrationTest (+3 more)

### Community 2 - "react"
Cohesion: 0.12
Nodes (27): @headlessui/react, @inertiajs/react, react, ApplicationLogo(), Checkbox(), DangerButton(), Dropdown(), DropDownContext (+19 more)

### Community 3 - "Eloquent Model: IngredientBatch"
Cohesion: 0.05
Nodes (45): Early Warning Traffic Light Expiration Logic, FEFO Core Business Rules Specification, FEFO Recommendation Badge UI Component, Smart Warning FEFO Deviation Modal UI, Tailwind Cafe Color Palette & Status Tokens, Backend Developer 1 Task Specification, FEFO Stock Deduction Engine Backend Task, Backend Developer 2 Task Specification (+37 more)

### Community 4 - "package.json"
Cohesion: 0.05
Nodes (31): dependencies, clsx, lucide-react, recharts, tailwind-merge, private, scripts, build (+23 more)

### Community 5 - "LoginRequest"
Cohesion: 0.10
Nodes (3): LoginRequest, ProfileUpdateRequest, UserFactory

### Community 6 - "Illuminate\Database\Schema\Blueprint"
Cohesion: 0.16
Nodes (8): {closure#1}(), {closure#2}(), {closure#3}(), {closure#1}(), {closure#2}(), {closure#1}(), {closure#2}(), {closure#3}()

### Community 7 - "devDependencies"
Cohesion: 0.11
Nodes (18): devDependencies, autoprefixer, axios, concurrently, @headlessui/react, @inertiajs/react, laravel-vite-plugin, postcss (+10 more)

### Community 8 - "compilerOptions"
Cohesion: 0.12
Nodes (15): compilerOptions, allowJs, esModuleInterop, forceConsistentCasingInFileNames, isolatedModules, jsx, module, moduleResolution (+7 more)

### Community 9 - "inventory.d.ts"
Cohesion: 0.17
Nodes (11): BatchStatus, Category, DashboardMetrics, Ingredient, IngredientBatch, Role, StockUsage, UrgencyStatus (+3 more)

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
Cohesion: 0.20
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

### Community 23 - "psr-4"
Cohesion: 0.40
Nodes (5): autoload, psr-4, App\\, Database\\Factories\\, Database\\Seeders\\

### Community 26 - "Custom RoleMiddleware RBAC Guard"
Cohesion: 0.40
Nodes (5): App Shell Layout & RBAC Sidebar Navigation Task, Custom RoleMiddleware RBAC Guard, Post-Login RoleRedirectService, RBAC Route Protection & Middleware Matrix, RBAC User Personas and Permissions Matrix

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

## Knowledge Gaps
- **57 isolated node(s):** `@types/node`, `@types/react`, `@types/react-dom`, `autoprefixer`, `concurrently` (+52 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 291 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **26 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `User` connect `User` to `Illuminate\Http\Request`, `LoginRequest`?**
  _High betweenness centrality (0.033) - this node is a cross-community bridge._
- **What connects `@types/node`, `@types/react`, `@types/react-dom` to the rest of the system?**
  _57 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Illuminate\Http\Request` be split into smaller, more focused modules?**
  _Cohesion score 0.0670807453416149 - nodes in this community are weakly interconnected._
- **Why does `@inertiajs/react` connect `react` to `package.json`?**
  _High betweenness centrality (0.012) - this node is a cross-community bridge._
- **Should `User` be split into smaller, more focused modules?**
  _Cohesion score 0.060655737704918035 - nodes in this community are weakly interconnected._
- **Why does `devDependencies` connect `devDependencies` to `package.json`?**
  _High betweenness centrality (0.010) - this node is a cross-community bridge._
- **Should `react` be split into smaller, more focused modules?**
  _Cohesion score 0.11747516072472239 - nodes in this community are weakly interconnected._