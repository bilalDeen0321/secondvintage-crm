/* eslint-disable @typescript-eslint/no-explicit-any */

import { getRoleColor, getStatusColor } from "@/app/utils";
import Layout from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
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
import TablePaginate from "@/components/ui/table/TablePaginate";
import AddNewUser from "@/pages/users/components/AddUserDialog";
import EditUserDialog from "@/pages/users/components/EditUserDialog";
import { User } from "@/pages/users/components/types";
import { PaginateData } from "@/types/laravel";
import { Head, Link, router, useForm, usePage } from "@inertiajs/react";
import { Plus, RotateCcw, Search, Settings, Trash2 } from "lucide-react";
import { useState } from "react";

const Users = () => {
    const pageProps = usePage().props as any;
    const data = pageProps.users as PaginateData<User>;

    const [searchTerm, setSearchTerm] = useState(pageProps?.search || "");
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);

    const handleEditUser = (user: User) => {
        setEditingUser(user);
        setIsEditDialogOpen(true);
    };

    const filteredUsers = data.data.filter(
        (user) =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    const { delete: destroy, processing } = useForm({});

    const handleDeleteUser = (user: User) => {
        if (!confirm(`Are you sure you want to delete ${user.name}?`)) return;

        destroy(route("users.destroy", user.id), {
            preserveScroll: true,
            onSuccess(response) { },
        });
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);

        // Delay search (debounce)
        clearTimeout((window as any).searchTimer);
        (window as any).searchTimer = setTimeout(() => {
            router.get(
                route("users.index"),
                { search: value },
                { preserveState: true },
            );
        }, 300);
    };

    return (
        <Layout>
            <Head title="SV - User Management" />
            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">User Management</h1>
                        <p className="text-muted-foreground">
                            Manage system users and their permissions
                        </p>
                    </div>
                   <div className="flex items-center space-x-3">
                         <Button variant="outline" asChild>
                        <Link href={route("roles.index")} className="flex">
                            <Plus className="mr-2 h-4" />
                            Manage roles
                        </Link>
                    </Button>
                    <AddNewUser
                        show={isAddDialogOpen}
                        setShow={setIsAddDialogOpen}
                    />
                </div></div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Total Users</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {pageProps?.total_users}
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Registered users
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Active Users</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">
                                {pageProps?.active_users}
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Currently active
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Administrators</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {pageProps?.admin_users}
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Admin access
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>New This Month</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {pageProps?.monthly_users}
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Recent signups
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>User Directory</CardTitle>
                        <CardDescription>
                            Manage user accounts and permissions
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-4 flex items-center space-x-2">
                            <div className="relative flex-1">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search users@."
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
                                    <TableHead>Email</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Country</TableHead>
                                    <TableHead>Last Login</TableHead>
                                    <TableHead>Join Date</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredUsers.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell className="font-medium">
                                            {user.name}
                                        </TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>
                                            <Badge
                                                className={getRoleColor(
                                                    user.role,
                                                )}
                                            >
                                                {user.role}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                className={getStatusColor(
                                                    user.status,
                                                )}
                                            >
                                                {user.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{user.country}</TableCell>
                                        <TableCell>{user.lastLogin}</TableCell>
                                        <TableCell>{user.joinDate}</TableCell>
                                        <TableCell>
                                            <div className="flex space-x-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() =>
                                                        handleEditUser(user)
                                                    }
                                                >
                                                    <Settings className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    title="Reset Password"
                                                >
                                                    <RotateCcw className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() =>
                                                        handleDeleteUser(user)
                                                    }
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
                        {/* Laravel Pagination */}
                        <TablePaginate links={data.meta.links} />
                    </CardContent>
                </Card>

                {/* Edit User Dialog */}
                {isEditDialogOpen && (
                    <EditUserDialog
                        user={editingUser}
                        isEditDialogOpen={isEditDialogOpen}
                        setIsEditDialogOpen={setIsEditDialogOpen}
                    />
                )}
            </div>
        </Layout>
    );
};

export default Users;
