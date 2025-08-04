export interface UserPermissions {
    dashboard: boolean;
    watchManagement: boolean;
    multiplatformSales: boolean;
    batchManagement: boolean;
    promote: boolean;
    salesHistory: boolean;
    performanceTracking: boolean;
    wishList: boolean;
    agentsBalance: boolean;
    invoices: boolean;
    users: boolean;
    tools: boolean;
    fullDataView: boolean;
    settings: boolean;
    log: boolean;
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: "admin" | "manager" | "viewer" | "agent" | "seller";
    status: "active" | "inactive";
    country: string;
    currency: string;
    lastLogin: string;
    joinDate: string;
    permissions: UserPermissions;
}
