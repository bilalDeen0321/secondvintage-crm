import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { countries, currencies } from "@/app/data";
import { useForm } from "@inertiajs/react";
import InputError from "../InputError";
import {
    defaultPermissions,
    handlePermissionChange,
    PermissionsSection,
} from "./PermissionsSection";

export default function EditUserDialog({
    isEditDialogOpen,
    setIsEditDialogOpen,
    user,
}) {
    const { data, setData, put, processing, errors } = useForm({
        name: user?.name ?? "",
        email: user?.email ?? "",
        role: user?.role ?? "",
        country: user?.country ?? "USA",
        currency: user?.currency ?? "USD",
        password: "",
        status: user?.status ?? "active",
    });

    const handleUpdateUser = (e: { preventDefault: () => void }) => {
        e.preventDefault();
        put(route("users.update", user.id), {
            preserveScroll: true,
            onSuccess: (response) => {
                setIsEditDialogOpen(false);
            },
        });
    };

    return (
        <>
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="max-h-[80vh] max-w-3xl overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit User</DialogTitle>
                        <DialogDescription>
                            Update user information and permissions.
                        </DialogDescription>
                    </DialogHeader>
                    {data && (
                        <div className="grid gap-6 py-4">
                            {/* Basic Information Section */}
                            <div className="space-y-4">
                                <h3 className="border-b pb-2 text-lg font-semibold">
                                    Basic Information
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="edit-name">
                                            Full Name
                                        </Label>
                                        <Input
                                            name="name"
                                            id="edit-name"
                                            value={data.name}
                                            onChange={(e) =>
                                                setData("name", e.target.value)
                                            }
                                        />
                                        <InputError
                                            message={errors.name}
                                            className="mt-2"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="edit-email">
                                            Email Address
                                        </Label>
                                        <Input
                                            name="email"
                                            id="edit-email"
                                            type="email"
                                            disabled
                                            value={data.email}
                                            onChange={(e) =>
                                                setData("email", e.target.value)
                                            }
                                        />
                                        <InputError
                                            message={errors.email}
                                            className="mt-2"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="edit-country">
                                            Country
                                        </Label>
                                        <select
                                            name="country"
                                            id="edit-country"
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                            value={data.country}
                                            onChange={(e) =>
                                                setData(
                                                    "country",
                                                    e.target.value,
                                                )
                                            }
                                        >
                                            <option value="">
                                                Select country...
                                            </option>
                                            {countries.map((country) => (
                                                <option
                                                    key={country}
                                                    value={country}
                                                >
                                                    {country}
                                                </option>
                                            ))}
                                        </select>
                                        <InputError
                                            message={errors.country}
                                            className="mt-2"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="edit-currency">
                                            Currency
                                        </Label>
                                        <select
                                            name="currency"
                                            id="edit-currency"
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                            value={data.currency}
                                            onChange={(e) =>
                                                setData(
                                                    "currency",
                                                    e.target.value,
                                                )
                                            }
                                        >
                                            <option value="">
                                                Select currency...
                                            </option>
                                            {currencies.map((currency) => (
                                                <option
                                                    key={currency}
                                                    value={currency}
                                                >
                                                    {currency}
                                                </option>
                                            ))}
                                        </select>
                                        <InputError
                                            message={errors.currency}
                                            className="mt-2"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Role & Status Section */}
                            <div className="space-y-4">
                                <h3 className="border-b pb-2 text-lg font-semibold">
                                    Role & Status
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="edit-role">
                                            User Role
                                        </Label>
                                        <select
                                            id="edit-role"
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                            value={data.role}
                                            name="role"
                                            onChange={(e) =>
                                                setData("role", e.target.value)
                                            }
                                        >
                                            <option value="viewer">
                                                Viewer
                                            </option>
                                            <option value="agent">Agent</option>
                                            <option value="seller">
                                                Seller
                                            </option>
                                            <option value="manager">
                                                Manager
                                            </option>
                                            <option value="admin">Admin</option>
                                        </select>
                                        <InputError
                                            message={errors.role}
                                            className="mt-2"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="edit-status">
                                            Account Status
                                        </Label>
                                        <select
                                            id="edit-status"
                                            name="status"
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                            value={data.status}
                                            onChange={(e) =>
                                                setData(
                                                    "status",
                                                    e.target.value,
                                                )
                                            }
                                        >
                                            <option value="active">
                                                Active
                                            </option>
                                            <option value="inactive">
                                                Inactive
                                            </option>
                                        </select>
                                        <InputError
                                            message={errors.status}
                                            className="mt-2"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Permissions Section */}
                            <div className="space-y-4">
                                <h3 className="border-b pb-2 text-lg font-semibold">
                                    Menu Access Permissions
                                </h3>
                                <PermissionsSection
                                    permissions={defaultPermissions}
                                    onChange={(permission, checked) =>
                                        handlePermissionChange(
                                            permission,
                                            checked,
                                            true,
                                        )
                                    }
                                    isEdit={true}
                                />
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button type="submit" onClick={handleUpdateUser}>
                            {processing ? "Loading..." : "Update User"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
