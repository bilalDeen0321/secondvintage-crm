import InputError from "@/components/InputError";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RolePermissions } from "@/types/auth";
import { useForm } from "@inertiajs/react";
import { Plus } from "lucide-react";
import { PermissionsSection } from "../PermissionsSection";

type Props = { role: RolePermissions, isDialog: boolean, setDialog: React.Dispatch<React.SetStateAction<boolean>> }

export default function UpdateRoleDialog({ role, isDialog, setDialog }: Props) {

    const { data, setData, put, processing, errors, reset } = useForm({
        name: role.name,
        permissions: role?.permissions || [],
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleAdd = (e: any) => {
        e.preventDefault();
        put(route("roles.update", role.id), {
            onSuccess: () => { setDialog(false); },
        });
    };

    return (
        <>
            <Dialog open={isDialog} onOpenChange={setDialog}>
                <DialogTrigger asChild>
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add New Role
                    </Button>
                </DialogTrigger>
                <DialogContent className="max-h-[80vh] max-w-3xl overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Add New Role</DialogTitle>
                        <DialogDescription>
                            Create a new role with permission for account
                            access.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-6 py-4">
                        {/* Basic Information Section */}
                        <div className="space-y-4">
                            <h3 className="border-b pb-2 text-lg font-semibold">
                                Basic Information
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Role Name</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        required
                                        value={data.name}
                                        onChange={(e) =>
                                            setData("name", e.target.value)
                                        }
                                        placeholder="Enter full name"
                                    />
                                    <InputError
                                        message={errors.name}
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
                            <InputError
                                message={errors.permissions}
                                className="mt-2"
                            />
                            <PermissionsSection
                                permissions={data.permissions}
                                onChange={(
                                    permission: string,
                                    checked: boolean,
                                ) => {
                                    const updated = checked
                                        ? [...data.permissions, permission]
                                        : data.permissions.filter(
                                            (perm) => perm !== permission,
                                        );

                                    setData("permissions", updated);
                                }}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            type="submit"
                            disabled={processing}
                            onClick={handleAdd}
                        >
                            {processing ? "Loading.." : "Update"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
