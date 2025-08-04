/* eslint-disable @typescript-eslint/no-explicit-any */

import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import AddRoleDialog from "@/components/users/roles/AddRoleDialog";
import UpdateRoleDialog from "@/components/users/roles/UpdateRoleDialog";
import { RolePermissions } from "@/types/auth";
import { Head, router, useForm, usePage } from "@inertiajs/react";
import { Search, Settings, Trash2 } from "lucide-react";
import { useState } from "react";

const Roles = () => {
    const pageProps = usePage().props as any;
    const roles = pageProps.roles as Array<RolePermissions>;

    const [searchTerm, setSearchTerm] = useState(pageProps?.search || "");
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [role, setRole] = useState<RolePermissions | null>(null);

    const filteredRoles = roles.filter((role) =>
        role.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    const { delete: destroy, processing } = useForm({});

    const handleDelete = (role: RolePermissions) => {
        if (!confirm(`Are you sure you want to delete Role:${role.name}?`)) return;
        destroy(route("roles.destroy", role.id), { preserveScroll: true });
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);

        // Delay search (debounce)
        clearTimeout((window as any).searchTimer);
        (window as any).searchTimer = setTimeout(() => {
            router.get(
                route('roles.index'),
                { search: value },
                { preserveState: true },
            );
        }, 300);
    };

    return (
        <Layout>
            <Head title="User Role Management" />
            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">User Role Management</h1>
                        <p className="text-muted-foreground">
                            Manage system user role and their permissions
                        </p>
                    </div>
                    <AddRoleDialog />
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>All User Roles</CardTitle>
                        <CardDescription>
                            Manage user roles and permissions
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-4 flex items-center space-x-2">
                            <div className="relative flex-1">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search users..."
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    className="pl-8"
                                />
                            </div>
                        </div>

                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredRoles.map((role) => (
                                    <TableRow key={role.id}>
                                        <TableCell className="font-medium">
                                            {role.name}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex space-x-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => {
                                                        setRole(role);
                                                        setIsEditDialogOpen(true);
                                                    }
                                                    }
                                                >
                                                    <Settings className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleDelete(role)}
                                                    disabled={processing}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Edit User Dialog */}
                {isEditDialogOpen && (
                    <UpdateRoleDialog
                        role={role}
                        isDialog={isEditDialogOpen}
                        setDialog={setIsEditDialogOpen}
                    />
                )}
            </div>
        </Layout>
    );
};

export default Roles;
