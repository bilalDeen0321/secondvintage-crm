/* eslint-disable @typescript-eslint/no-explicit-any */
import { Config } from "ziggy-js";
import { Auth } from "./auth";

export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: Auth;
    ziggy: Config & { location: string };
    flash: {
        success: string | null;
        error: string | null;
        status?: 'success' | 'error' | null | 'info' | 'warning';
        message?: string | null;
        data: any | null;
    };
};
