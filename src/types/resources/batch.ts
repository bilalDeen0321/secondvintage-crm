import { WatchResource } from "./watch";

export type BatchResource = {
    id: number;
    name: string;
    trackingNumber: string;
    origin: string;
    destination: string;
    status: string;
    notes: string;
    shippedDate: string | null;
    estimatedDelivery: string | null;
    actualDelivery: string | null;
    watches?: WatchResource[];
    created_at: string;
    updated_at: string;
};
