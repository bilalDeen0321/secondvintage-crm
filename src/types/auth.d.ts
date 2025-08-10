export type Permission = {
    id: number;
    name: string;
    guard_name: string;
    created_at: string;
    updated_at: string;
};

type Permissions = [
    "dashboard",
    "watchManagement",
    "multiplatformSales",
    "batchManagement",
    "promote",
    "salesHistory",
    "performanceTracking",
    "wishList",
    "agentsBalance",
    "invoices",
    "users",
    "tools",
    "fullDataView",
    "settings",
    "log",
];

export type User = {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    status: string;
    country: string;
    currency: string;
    last_login_at: string | null;
    last_login_ip: string | null;
    created_at: string;
    updated_at: string;
};

export type Auth = {
    user: User;
    permissions: string[];
};


export type Role = {
    created_at: string;
    updated_at: string;
    guard_name: "web" | 'api';
    id: 2;
    name: string;
}
export type RolePermissions = Role & { permissions: string[] }