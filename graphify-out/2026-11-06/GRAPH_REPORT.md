# Graph Report - projek  (2026-11-06)

## Corpus Check
- 125 files · ~91,026 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 20 file(s) not represented in the graph (top: (none) 16, .example 1, .xml 1)

## Summary
- 559 nodes · 871 edges · 56 communities (30 shown, 26 thin omitted)
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 50 edges (avg confidence: 0.89)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `17622048`
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
- Penjelasan Modul 02: Eloquent Models & Relasi
- require
- Plan 02: Shell Layout Utama & Navigasi RBAC
- AppServiceProvider
- bootstrap/app.php
- scripts
- Penjelasan Modul 03: Database Seeder & Data Demo
- Penjelasan Modul 06: StockUsageController & Algoritma FEFO
- Penjelasan Modul 07: WasteLogController & Approval Workflow
- Penjelasan Modul 08: Dashboard & Analytics Controller
- psr-4
- Master List Prompt Perencanaan Backend
- Custom RoleMiddleware RBAC Guard
- Master List Prompt Perencanaan Desain Frontend
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
- DeductStockAction Transaction Service

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
- `Eloquent FEFO Active Batch Scopes` --semantically_similar_to--> `FEFO Interactive Recommendation Engine`  [INFERRED] [semantically similar]
  docs/explanations/02_models_eloquent.md → docs/Plan Frontend/PLAN_03_BARISTA_OPERASIONAL_FEFO.md
- `FEFO Core Business Rules Specification` --implements--> `DeductStockAction Transaction Service`  [EXTRACTED]
  AGENTS.md → docs/Plan Backend/PLAN_06_STOCK_USAGE_FEFO_CONTROLLER.md
- `Incoming Restock Batch Ingestion Workflow` --implements--> `IngredientBatchController Restock Handler`  [EXTRACTED]
  PRD.md → docs/Plan Backend/PLAN_05_BATCH_RESTOCK_CONTROLLER.md
- `Waste Write-Off Approval & No-Hard-Delete Policy` --rationale_for--> `ApproveWasteAction Write-Off Execution Action`  [EXTRACTED]
  AGENTS.md → docs/Plan Backend/PLAN_07_WASTE_DISPOSAL_CONTROLLER.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **FEFO Stock Lifecycle Workflow: Restock, FEFO Usage, and Waste Disposal** — docs_plan_backend_plan_05_batch_restock_controller_ingredient_batch_controller, docs_plan_backend_plan_06_stock_usage_fefo_controller_stock_usage_controller, docs_plan_backend_plan_07_waste_disposal_controller_waste_log_controller, prd_fefo_usage_workflow [EXTRACTED 1.00]
- **Multi-Role RBAC Governance: Route Guarding, Navigation, and Seeding** — docs_plan_backend_plan_04_auth_rbac_middleware_role_middleware, docs_plan_backend_plan_04_auth_rbac_middleware_role_redirect_service, prd_rbac_roles_matrix, docs_panduan_panduan_frontend_1_app_shell_rbac_nav [EXTRACTED 1.00]
- **Damaged Stock Write-off and Financial Loss Analytics Governance** — agents_waste_write_off_policy, docs_plan_backend_plan_07_waste_disposal_controller_approve_waste_action, docs_plan_backend_plan_08_dashboard_analytics_controller_analytics_controller, docs_plan_backend_plan_01_migrations_schema_waste_logs_table [EXTRACTED 1.00]
- **FEFO Stock Consumption & Deviation Audit Workflow** — docs_plan_frontend_plan_03_barista_operasional_fefo_fefo_recommendation_engine, docs_plan_frontend_plan_03_barista_operasional_fefo_smart_warning_dialog, docs_explanations_06_stock_usage_fefo_controller_atomic_usage_decrement, docs_explanations_02_models_eloquent_fefo_query_scopes [INFERRED 0.85]
- **Multi-Role RBAC Authorization & Dynamic Shell System** — docs_plan_frontend_plan_01_auth_login_one_click_demo_login, docs_plan_frontend_plan_02_app_layout_rbac_rbac_menu_matrix, docs_explanations_04_auth_rbac_middleware_role_middleware_routing, docs_explanations_08_dashboard_analytics_controller_three_perspective_lenses_analogy [INFERRED 0.85]
- **Two-Tier Waste Write-Off & Loss Settlement Architecture** — docs_plan_frontend_plan_06_waste_approval_center_no_hard_delete_waste_policy, docs_plan_frontend_plan_06_waste_approval_center_two_tier_waste_approval, docs_explanations_07_waste_disposal_controller_waste_ticket_analogy, docs_explanations_07_waste_disposal_controller_financial_loss_calculation [INFERRED 0.95]

## Communities (56 total, 26 thin omitted)

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
Cohesion: 0.07
Nodes (33): Early Warning Traffic Light Expiration Logic, Tailwind Cafe Color Palette & Status Tokens, Backend Developer 1 Task Specification, Backend Developer 2 Task Specification, Early Warning Expiration Calculation Task, Waste Disposal & Financial Loss Backend Task, Inventory & Batch Monitoring Table View Task, Database Schema & ERD Architecture Specification (+25 more)

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

### Community 13 - "Penjelasan Modul 02: Eloquent Models & Relasi"
Cohesion: 0.22
Nodes (9): Penjelasan Modul 02: Eloquent Models & Relasi, Eloquent FEFO Active Batch Scopes, Eloquent Model as Archive Assistant Analogy, Penjelasan Modul 05: BatchController & Restock Workflow, Atomic Batch Creation in Restock, Controller as Warehouse Receiving Manager Analogy, Plan 05: Monitoring Inventaris & Early Warning System, Batch Restock Ingestion Workflow (+1 more)

### Community 14 - "require"
Cohesion: 0.29
Nodes (7): require, inertiajs/inertia-laravel, laravel/framework, laravel/sanctum, laravel/tinker, php, tightenco/ziggy

### Community 15 - "Plan 02: Shell Layout Utama & Navigasi RBAC"
Cohesion: 0.29
Nodes (6): Penjelasan Modul 04: Autentikasi & RBAC Middleware, Role-Based Route Protection, Three Security Guard Layers Analogy, Plan 02: Shell Layout Utama & Navigasi RBAC, RBAC Dynamic Navigation Matrix, Role Capsule Badge Indicator

### Community 18 - "scripts"
Cohesion: 0.33
Nodes (6): scripts, dev, post-autoload-dump, post-create-project-cmd, post-root-package-install, post-update-cmd

### Community 19 - "Penjelasan Modul 03: Database Seeder & Data Demo"
Cohesion: 0.33
Nodes (4): Penjelasan Modul 03: Database Seeder & Data Demo, Seeder as Opening Day Preparation Team Analogy, Plan 01: Autentikasi & Login Multi-Role, One-Click Quick Login Demo Cards

### Community 20 - "Penjelasan Modul 06: StockUsageController & Algoritma FEFO"
Cohesion: 0.40
Nodes (6): Penjelasan Modul 06: StockUsageController & Algoritma FEFO, Atomic Stock Decrement & Deviation Audit, Milk Bottle Chiller FEFO Selection Analogy, Plan 03: Dasbor Barista & Pemakaian Stok FEFO, FEFO Interactive Recommendation Engine, FEFO Smart Deviation Warning Dialog

### Community 21 - "Penjelasan Modul 07: WasteLogController & Approval Workflow"
Cohesion: 0.40
Nodes (5): Penjelasan Modul 07: WasteLogController & Approval Workflow, Financial Spoilage Loss Calculation Formula, Two-Stage Spoilage Incident Report Analogy, Plan 06: Waste Approval Center & Audit Spoilage, Two-Tier Waste Disposal Approval Workflow

### Community 22 - "Penjelasan Modul 08: Dashboard & Analytics Controller"
Cohesion: 0.33
Nodes (6): Penjelasan Modul 08: Dashboard & Analytics Controller, Multi-Role Metrics Aggregation Queries, Three Role Perspective Lenses Analogy, Plan 07: Dasbor Analitik & Finansial Eksekutif Owner, Owner Financial KPIs & Asset Evaluation, Usage vs Spoilage Loss Analytics

### Community 23 - "psr-4"
Cohesion: 0.40
Nodes (5): autoload, psr-4, App\\, Database\\Factories\\, Database\\Seeders\\

### Community 25 - "Master List Prompt Perencanaan Backend"
Cohesion: 0.40
Nodes (4): Penjelasan Modul 01: Database & Skema Tabel, Database Schema as Cafe Bookkeeping System, Core Schema Design (5 Core Tables), Master List Prompt Perencanaan Backend

### Community 26 - "Custom RoleMiddleware RBAC Guard"
Cohesion: 0.40
Nodes (5): App Shell Layout & RBAC Sidebar Navigation Task, Custom RoleMiddleware RBAC Guard, Post-Login RoleRedirectService, RBAC Route Protection & Middleware Matrix, RBAC User Personas and Permissions Matrix

### Community 27 - "Master List Prompt Perencanaan Desain Frontend"
Cohesion: 0.40
Nodes (3): Plan 04: Supervisor Master Data Bahan & Kategori, Ingredient & Category Catalog Architecture, Master List Prompt Perencanaan Desain Frontend

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
Nodes (16): Contoh Integrasi Komponen React, Gambaran Besar: "Warna Bukan Sekadar Estetika, tapi Panduan Mata Barista", Grup 1: `brand` — Biji Kopi Sangrai, Karamel, & Buah Ceri Kopi, Grup 2: `surface` — Meja Keramik & Piringan Bar Kafe, Grup 3: `content` — Tingkatan Teks & Tipografi, Grup 4: Status Peringatan Kedaluwarsa (Traffic Light System), Panduan Pemula — Sistem Desain Identitas Kafe, Penjelasan Modul 09: Palet Warna & Token Desain Kafe (Tailwind CSS) (+8 more)

### Community 55 - "DeductStockAction Transaction Service"
Cohesion: 0.17
Nodes (12): FEFO Core Business Rules Specification, FEFO Recommendation Badge UI Component, Smart Warning FEFO Deviation Modal UI, FEFO Stock Deduction Engine Backend Task, Barista FEFO Stock Usage Screen Task, FEFO Deviation Confirmation Modal Task, DeductStockAction Transaction Service, FEFO Enforcement & Verification Logic (+4 more)

## Knowledge Gaps
- **57 isolated node(s):** `@types/node`, `@types/react`, `@types/react-dom`, `autoprefixer`, `concurrently` (+52 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 250 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **26 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `User` connect `User` to `Illuminate\Http\Request`, `LoginRequest`?**
  _High betweenness centrality (0.041) - this node is a cross-community bridge._
- **What connects `@types/node`, `@types/react`, `@types/react-dom` to the rest of the system?**
  _57 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Illuminate\Http\Request` be split into smaller, more focused modules?**
  _Cohesion score 0.0670807453416149 - nodes in this community are weakly interconnected._
- **Why does `@inertiajs/react` connect `react` to `package.json`?**
  _High betweenness centrality (0.014) - this node is a cross-community bridge._
- **Should `User` be split into smaller, more focused modules?**
  _Cohesion score 0.060655737704918035 - nodes in this community are weakly interconnected._
- **Why does `devDependencies` connect `devDependencies` to `package.json`?**
  _High betweenness centrality (0.012) - this node is a cross-community bridge._
- **Should `react` be split into smaller, more focused modules?**
  _Cohesion score 0.11747516072472239 - nodes in this community are weakly interconnected._