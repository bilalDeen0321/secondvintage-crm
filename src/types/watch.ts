// types/watch.ts

export interface Watch {
    id: string;
    sku: string;
    name: string;
    currency?: string;
    brand_id: number;
    serial_number: string | null;
    reference: string | null;
    case_size: string | null;
    caliber: string | null;
    timegrapher: string | null;
    original_cost: string | number;
    current_cost: string | null | number;
    status_id: number | string | null;
    stage_id: number | string | null;
    batch_id: number | string | null;
    location_id: number | string | null;
    agent_id: number | string | null;
    seller_id: number | string | null;
    description: string;
    ai_instructions: string;
    description_thread_id: number | string | null;
    notes: string | null;
    created_at: string;
    updated_at: string;
}

// Nested interfaces
export interface Brand {
    id: number;
    name: string;
    brand_code: string;
    created_at: string;
    updated_at: string;
}

export interface Status {
    id: number;
    name:
    "Draft"
    | "Review"
    | "Approved"
    | "Platform Review"
    | "Ready for listing"
    | "Listed"
    | "Reserved"
    | "Sold"
    | "Defect/Problem"
    | "Standby";
    created_at: string;
    updated_at: string;
}

export interface Location {
    id: number;
    name: string;
    country: string | null;
    created_at: string;
    updated_at: string;
}

export interface WatchImage {
    id: number;
    watch_id: number;
    filename: string;
    public_url: string;
    use_for_ai: boolean;
    order: number;
    created_at: string;
    updated_at: string;
}

// Map of possible relations
type WatchRelations = {
    brand: Brand;
    status: Status;
    location: Location;
    images: WatchImage[];
};

// Generic type to include selected relations
// FIXED - accepts multiple keys like 'brand' | 'location'
export type WatchWith<With extends keyof WatchRelations = never> = Watch &
    Partial<Pick<WatchRelations, With>>;

