import { PlatformField } from "@/pages/sales/components/platform/_actions";

export type PlatformResource = {
    id: number;
    watch_id: string;
    name: string;
    data?: PlatformField[] | null;
    status?: string;
    message?: string | null;
    creted_at?: string;
    updated_at?: string;
};
