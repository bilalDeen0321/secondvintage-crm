/* eslint-disable @typescript-eslint/no-explicit-any */
export type WatchImageResource = {
    id: string;
    url?: string | null;
    file?: File | null;
    order_index?: number;
    useForAI?: boolean; // could also be boolean if you normalize it
};

export type WatchResource = {
    id: number;
    sku: string;
    name: string;
    description: string;
    serial_number: string | null;
    reference: string | null;
    case_size: string | null;
    caliber: string | null;
    timegrapher: string | null;
    original_cost: string;
    current_cost: string;
    currency: string;
    ai_instructions: string | null;
    ai_thread_id: string | null;
    ai_selected_images: string | null;
    status: string;
    notes: string | null;
    stage: string;
    location: string | null;
    user_id: number | null;
    batch_id: number | null;
    brand_id: number | null;
    agent_id: number | null;
    seller_id: number | null;
    created_at: string; // ISO datetime
    updated_at: string; // ISO datetime
    image_urls: string[];
    images: WatchImageResource[];
    routeKey: number | string;
    brand: string | null;
    batch: any; // adjust to actual batch type if available
};
