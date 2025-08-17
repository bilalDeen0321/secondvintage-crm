import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}


export function formatRichText(str?: string) {
    return String(str).replace(/\n/g, "<br>");
}