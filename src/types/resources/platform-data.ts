
export type PlatformResource = {
    id: number;
    watch_id: string;
    name: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?: Record<string, any> | null;
    status?: string;
    message?: string | null;
    creted_at?: string;
    updated_at?: string;
};
