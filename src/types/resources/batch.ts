import { WatchResource } from "./watch";

export type BatchResource = {
    id: number;
    name: string;
    trackingNumber: string;
    origin: string;
    destination: string;
    status: string;
    watches?: WatchResource[];
};
