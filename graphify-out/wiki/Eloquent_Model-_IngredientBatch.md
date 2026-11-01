# Eloquent Model: IngredientBatch

> God node · 12 connections · `docs/Plan Backend/PLAN_02_MODELS_ELOQUENT.md`

**Community:** [FEFO Core Inventory & Business Logic](FEFO_Core_Inventory_&_Business_Logic.md)

## Connections by Relation

### calls
- IngredientBatchController Restock Handler `EXTRACTED`
- DeductStockAction Transaction Service `EXTRACTED`
- ApproveWasteAction Write-Off Execution Action `EXTRACTED`
- DashboardController Multi-Role Data Provider `EXTRACTED`

### conceptually_related_to
- Early Warning Traffic Light Expiration Logic `INFERRED`

### implements
- Database Migration: Ingredient Batches Table `EXTRACTED`
- Early Warning Expiration Calculation Task `EXTRACTED`

### references
- Backend Developer 1 Task Specification `EXTRACTED`
- Eloquent Model: Ingredient `EXTRACTED`
- Eloquent Model: StockUsage `EXTRACTED`
- Eloquent Model: WasteLog `EXTRACTED`

### shares_data_with
- Ingredient Batch Expiration Scenario Seeder `EXTRACTED`

---

*Part of the graphify knowledge wiki. See [index](index.md) to navigate.*