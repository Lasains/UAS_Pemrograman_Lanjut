export type Role = 'owner' | 'supervisor' | 'barista';

export interface User {
    id: number;
    name: string;
    email: string;
    role: Role;
    email_verified_at?: string;
}

export interface Category {
    id: number;
    name: string;
    slug: string;
    created_at?: string;
    updated_at?: string;
}

export interface Ingredient {
    id: number;
    category_id: number;
    name: string;
    unit: string; // 'ml' | 'gram' | 'pcs'
    minimum_stock: number;
    warning_days: number;
    total_current_stock?: number;
    category?: Category;
    batches?: IngredientBatch[];
    created_at?: string;
    updated_at?: string;
}

export type BatchStatus = 'active' | 'exhausted' | 'expired' | 'disposed';
export type UrgencyStatus = 'safe' | 'warning' | 'critical';

export interface IngredientBatch {
    id: number;
    ingredient_id: number;
    batch_code: string;
    initial_stock: number;
    current_stock: number;
    received_date: string;
    expiry_date: string;
    cost_per_unit: number;
    status: BatchStatus;
    days_until_expiry?: number;
    urgency_status?: UrgencyStatus;
    is_fefo_recommended?: boolean;
    ingredient?: Ingredient;
    created_at?: string;
    updated_at?: string;
}

export interface StockUsage {
    id: number;
    ingredient_batch_id: number;
    user_id: number;
    quantity_used: number;
    usage_date: string;
    is_fefo_compliant: boolean;
    deviation_reason?: string | null;
    notes?: string | null;
    batch?: IngredientBatch;
    user?: User;
    created_at?: string;
    updated_at?: string;
}

export type WasteStatus = 'pending' | 'approved' | 'rejected';

export interface WasteLog {
    id: number;
    ingredient_batch_id: number;
    reported_by: number;
    approved_by?: number | null;
    waste_quantity: number;
    financial_loss: number;
    reason: string;
    status: WasteStatus;
    batch?: IngredientBatch;
    reporter?: User;
    approver?: User | null;
    created_at?: string;
    updated_at?: string;
}

export interface DashboardMetrics {
    total_asset_value: number;
    critical_asset_value: number;
    monthly_waste_loss: number;
    active_batches_count: number;
}
