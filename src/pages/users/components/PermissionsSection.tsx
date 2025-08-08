/* eslint-disable react-refresh/only-export-components */
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { CheckedState } from "@radix-ui/react-checkbox";
import { UserPermissions } from "./types";

export const defaultPermissions = {
    dashboard: true,
    watchManagement: false,
    multiplatformSales: false,
    batchManagement: false,
    promote: false,
    salesHistory: false,
    performanceTracking: false,
    wishList: false,
    agentsBalance: false,
    invoices: false,
    users: false,
    tools: false,
    fullDataView: false,
    settings: false,
    log: false,
};

export const permissionLabels = {
    dashboard: "Dashboard",
    watchManagement: "Watch Management",
    multiplatformSales: "Multi-platform Sales",
    batchManagement: "Batch Management",
    promote: "Promote / Social Media",
    salesHistory: "Sales History / Stats",
    performanceTracking: "Performance Tracking",
    wishList: "Wish List",
    agentsBalance: "Agents Balance",
    invoices: "Invoices",
    users: "Users",
    tools: "Tools",
    fullDataView: "Full Data View",
    settings: "Settings",
    log: "Log",
};

type Props = { permissions: string[], onChange: (key: string, checked: CheckedState) => void, isEdit?: boolean };

export function PermissionsSection({ permissions, onChange, isEdit = false }: Props) {

    console.log(permissions);

    return (
        <div className="space-y-4">
            <Label className="text-base font-semibold">Menu Permissions</Label>
            <div className="grid max-h-60 grid-cols-2 gap-3 overflow-y-auto">
                {Object.entries(permissionLabels).map(([key, label]) => (
                    <div key={key} className="flex items-center space-x-2">
                        <Checkbox
                            id={`${isEdit ? "edit-" : ""}permission-${key}`}
                            checked={permissions.includes(key)}
                            onCheckedChange={(checked) =>
                                onChange(key, checked)
                            }
                        />
                        <Label
                            htmlFor={`${isEdit ? "edit-" : ""}permission-${key}`}
                            className="cursor-pointer text-sm font-normal"
                        >
                            {label}
                        </Label>
                    </div>
                ))}
            </div>
        </div>
    );
}

export const handlePermissionChange = (
    permission: keyof UserPermissions,
    checked: boolean,
    isEdit: boolean = false,
) => {
    // if (isEdit && editingUser) {
    //   setEditingUser({
    //     ...editingUser,
    //     permissions: {
    //       ...editingUser.permissions,
    //       [permission]: checked
    //     }
    //   });
    // } else {
    //   setNewUser({
    //     ...newUser,
    //     permissions: {
    //       ...newUser.permissions,
    //       [permission]: checked
    //     }
    //   });
    // }
};
