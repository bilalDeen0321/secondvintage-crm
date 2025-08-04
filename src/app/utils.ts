export const getRoleColor = (role: string) => {
    switch (role) {
        case "admin":
            return "bg-purple-100 text-purple-800";
        case "manager":
            return "bg-blue-100 text-blue-800";
        case "viewer":
            return "bg-gray-100 text-gray-800";
        case "agent":
            return "bg-green-100 text-green-800";
        case "seller":
            return "bg-orange-100 text-orange-800";
        default:
            return "bg-gray-100 text-gray-800";
    }
};

export const getStatusColor = (status: string) => {
    switch (status) {
        case "active":
            return "bg-green-100 text-green-800";
        case "inactive":
            return "bg-red-100 text-red-800";
        default:
            return "bg-gray-100 text-gray-800";
    }
};
