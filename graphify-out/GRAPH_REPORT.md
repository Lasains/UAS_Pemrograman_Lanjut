# Graph Report - projek  (2026-10-31)

## Corpus Check
- 125 files · ~86,625 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 20 file(s) not represented in the graph (top: (none) 16, .example 1, .xml 1)

## Summary
- 542 nodes · 855 edges · 54 communities (28 shown, 26 thin omitted)
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 50 edges (avg confidence: 0.89)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Auth & Session Controllers
- User Models & Seeder Orchestration
- React & Frontend UI Shell
- FEFO Core Inventory & Business Logic
- Frontend NPM Dependencies
- Auth Form Validation & Requests
- Database Migration Schema
- Build Tooling & DevDependencies
- TypeScript Compiler Configuration
- Inventory Data Contracts & Types
- PHP Composer Plugins & Config
- Composer Root Manifest
- Backend Dev Dependencies
- Eloquent Models & Restock Docs
- Backend Production Dependencies
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
- `Waste Write-Off Approval & No-Hard-Delete Policy` --rationale_for--> `ApproveWasteAction Write-Off Execution Action`  [EXTRACTED]
  AGENTS.md → docs/Plan Backend/PLAN_07_WASTE_DISPOSAL_CONTROLLER.md
- `Incoming Restock Batch Ingestion Workflow` --implements--> `IngredientBatchController Restock Handler`  [EXTRACTED]
  PRD.md → docs/Plan Backend/PLAN_05_BATCH_RESTOCK_CONTROLLER.md
- `ApproveWasteAction Write-Off Execution Action` --semantically_similar_to--> `Financial Loss & Waste Aggregation Kueri Eloquent`  [INFERRED] [semantically similar]
  docs/Plan Backend/PLAN_07_WASTE_DISPOSAL_CONTROLLER.md → docs/Plan Backend/PLAN_08_DASHBOARD_ANALYTICS_CONTROLLER.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **FEFO Stock Lifecycle Workflow: Restock, FEFO Usage, and Waste Disposal** — docs_plan_backend_plan_05_batch_restock_controller_ingredient_batch_controller, docs_plan_backend_plan_06_stock_usage_fefo_controller_stock_usage_controller, docs_plan_backend_plan_07_waste_disposal_controller_waste_log_controller, prd_fefo_usage_workflow [EXTRACTED 1.00]
- **Multi-Role RBAC Governance: Route Guarding, Navigation, and Seeding** — docs_plan_backend_plan_04_auth_rbac_middleware_role_middleware, docs_plan_backend_plan_04_auth_rbac_middleware_role_redirect_service, prd_rbac_roles_matrix, docs_panduan_panduan_frontend_1_app_shell_rbac_nav [EXTRACTED 1.00]
- **Damaged Stock Write-off and Financial Loss Analytics Governance** — agents_waste_write_off_policy, docs_plan_backend_plan_07_waste_disposal_controller_approve_waste_action, docs_plan_backend_plan_08_dashboard_analytics_controller_analytics_controller, docs_plan_backend_plan_01_migrations_schema_waste_logs_table [EXTRACTED 1.00]
- **FEFO Stock Consumption & Deviation Audit Workflow** — docs_plan_frontend_plan_03_barista_operasional_fefo_fefo_recommendation_engine, docs_plan_frontend_plan_03_barista_operasional_fefo_smart_warning_dialog, docs_explanations_06_stock_usage_fefo_controller_atomic_usage_decrement, docs_explanations_02_models_eloquent_fefo_query_scopes [INFERRED 0.85]
- **Two-Tier Waste Write-Off & Loss Settlement Architecture** — docs_plan_frontend_plan_06_waste_approval_center_no_hard_delete_waste_policy, docs_plan_frontend_plan_06_waste_approval_center_two_tier_waste_approval, docs_explanations_07_waste_disposal_controller_waste_ticket_analogy, docs_explanations_07_waste_disposal_controller_financial_loss_calculation [INFERRED 0.95]
- **Multi-Role RBAC Authorization & Dynamic Shell System** — docs_plan_frontend_plan_01_auth_login_one_click_demo_login, docs_plan_frontend_plan_02_app_layout_rbac_rbac_menu_matrix, docs_explanations_04_auth_rbac_middleware_role_middleware_routing, docs_explanations_08_dashboard_analytics_controller_three_perspective_lenses_analogy [INFERRED 0.85]

## Communities (54 total, 26 thin omitted)

### Community 0 - "Auth & Session Controllers"
Cohesion: 0.07
Nodes (12): AuthenticatedSessionController, ConfirmablePasswordController, EmailVerificationNotificationController, EmailVerificationPromptController, NewPasswordController, PasswordController, PasswordResetLinkController, RegisteredUserController (+4 more)

### Community 1 - "User Models & Seeder Orchestration"
Cohesion: 0.06
Nodes (11): User, DatabaseSeeder, AuthenticationTest, EmailVerificationTest, PasswordConfirmationTest, PasswordResetTest, PasswordUpdateTest, RegistrationTest (+3 more)

### Community 2 - "React & Frontend UI Shell"
Cohesion: 0.12
Nodes (27): @headlessui/react, @inertiajs/react, react, ApplicationLogo(), Checkbox(), DangerButton(), Dropdown(), DropDownContext (+19 more)

### Community 3 - "FEFO Core Inventory & Business Logic"
Cohesion: 0.05
Nodes (45): Early Warning Traffic Light Expiration Logic, FEFO Core Business Rules Specification, FEFO Recommendation Badge UI Component, Smart Warning FEFO Deviation Modal UI, Tailwind Cafe Color Palette & Status Tokens, Backend Developer 1 Task Specification, FEFO Stock Deduction Engine Backend Task, Backend Developer 2 Task Specification (+37 more)

### Community 4 - "Frontend NPM Dependencies"
Cohesion: 0.05
Nodes (31): dependencies, clsx, lucide-react, recharts, tailwind-merge, private, scripts, build (+23 more)

### Community 5 - "Auth Form Validation & Requests"
Cohesion: 0.10
Nodes (3): LoginRequest, ProfileUpdateRequest, UserFactory

### Community 6 - "Database Migration Schema"
Cohesion: 0.16
Nodes (8): {closure#1}(), {closure#2}(), {closure#3}(), {closure#1}(), {closure#2}(), {closure#1}(), {closure#2}(), {closure#3}()

### Community 7 - "Build Tooling & DevDependencies"
Cohesion: 0.11
Nodes (18): devDependencies, autoprefixer, axios, concurrently, @headlessui/react, @inertiajs/react, laravel-vite-plugin, postcss (+10 more)

### Community 8 - "TypeScript Compiler Configuration"
Cohesion: 0.12
Nodes (15): compilerOptions, allowJs, esModuleInterop, forceConsistentCasingInFileNames, isolatedModules, jsx, module, moduleResolution (+7 more)

### Community 9 - "Inventory Data Contracts & Types"
Cohesion: 0.17
Nodes (11): BatchStatus, Category, DashboardMetrics, Ingredient, IngredientBatch, Role, StockUsage, UrgencyStatus (+3 more)

### Community 10 - "PHP Composer Plugins & Config"
Cohesion: 0.20
Nodes (10): block, pestphp/pest-plugin, php-http/discovery, config, allow-plugins, optimize-autoloader, policy, preferred-install (+2 more)

### Community 11 - "Composer Root Manifest"
Cohesion: 0.22
Nodes (8): description, keywords, license, minimum-stability, name, prefer-stable, $schema, type

### Community 12 - "Backend Dev Dependencies"
Cohesion: 0.22
Nodes (9): require-dev, fakerphp/faker, laravel/breeze, laravel/pail, laravel/pint, laravel/sail, mockery/mockery, nunomaduro/collision (+1 more)

### Community 13 - "Eloquent Models & Restock Docs"
Cohesion: 0.22
Nodes (9): Penjelasan Modul 02: Eloquent Models & Relasi, Eloquent FEFO Active Batch Scopes, Eloquent Model as Archive Assistant Analogy, Penjelasan Modul 05: BatchController & Restock Workflow, Atomic Batch Creation in Restock, Controller as Warehouse Receiving Manager Analogy, Plan 05: Monitoring Inventaris & Early Warning System, Batch Restock Ingestion Workflow (+1 more)

### Community 14 - "Backend Production Dependencies"
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

## Knowledge Gaps
- **57 isolated node(s):** `@types/node`, `@types/react`, `@types/react-dom`, `autoprefixer`, `concurrently` (+52 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 237 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **26 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `User` connect `User Models & Seeder Orchestration` to `Auth & Session Controllers`, `Auth Form Validation & Requests`?**
  _High betweenness centrality (0.043) - this node is a cross-community bridge._
- **What connects `@types/node`, `@types/react`, `@types/react-dom` to the rest of the system?**
  _57 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Auth & Session Controllers` be split into smaller, more focused modules?**
  _Cohesion score 0.0670807453416149 - nodes in this community are weakly interconnected._
- **Why does `@inertiajs/react` connect `React & Frontend UI Shell` to `Frontend NPM Dependencies`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **Should `User Models & Seeder Orchestration` be split into smaller, more focused modules?**
  _Cohesion score 0.060655737704918035 - nodes in this community are weakly interconnected._
- **Why does `devDependencies` connect `Build Tooling & DevDependencies` to `Frontend NPM Dependencies`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **Should `React & Frontend UI Shell` be split into smaller, more focused modules?**
  _Cohesion score 0.11747516072472239 - nodes in this community are weakly interconnected._