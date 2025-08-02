import { Head } from '@inertiajs/react';
import { Plus, RotateCcw, Search, Settings, Trash2 } from 'lucide-react';
import { useState } from 'react';
import Layout from '../components/Layout';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Checkbox } from '../components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';

interface UserPermissions {
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

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'viewer' | 'agent' | 'seller';
  status: 'active' | 'inactive';
  country: string;
  currency: string;
  lastLogin: string;
  joinDate: string;
  permissions: UserPermissions;
}

const defaultPermissions: UserPermissions = {
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
  log: false
};

const permissionLabels = {
  dashboard: 'Dashboard',
  watchManagement: 'Watch Management',
  multiplatformSales: 'Multi-platform Sales',
  batchManagement: 'Batch Management',
  promote: 'Promote / Social Media',
  salesHistory: 'Sales History / Stats',
  performanceTracking: 'Performance Tracking',
  wishList: 'Wish List',
  agentsBalance: 'Agents Balance',
  invoices: 'Invoices',
  users: 'Users',
  tools: 'Tools',
  fullDataView: 'Full Data View',
  settings: 'Settings',
  log: 'Log'
};

const Users = ({ users: _users }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'viewer' as User['role'],
    country: '',
    currency: '',
    password: '',
    permissions: defaultPermissions
  });

  const countries = ['Vietnam', 'USA', 'Denmark', 'Japan'];
  const currencies = ['USD', 'EUR', 'VND', 'JPY', 'GBP', 'CAD', 'AUD'];

  const [users, setUsers] = useState<User[]>(_users);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'manager': return 'bg-blue-100 text-blue-800';
      case 'viewer': return 'bg-gray-100 text-gray-800';
      case 'agent': return 'bg-green-100 text-green-800';
      case 'seller': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAddUser = () => {
    const user: User = {
      id: `USR${String(users.length + 1).padStart(3, '0')}`,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      status: 'active',
      country: newUser.country,
      currency: newUser.currency,
      lastLogin: 'Never',
      joinDate: new Date().toISOString().split('T')[0],
      permissions: newUser.permissions
    };
    setUsers([...users, user]);
    setNewUser({
      name: '',
      email: '',
      role: 'viewer',
      country: '',
      currency: '',
      password: '',
      permissions: defaultPermissions
    });
    setIsAddDialogOpen(false);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setIsEditDialogOpen(true);
  };

  const handleUpdateUser = () => {
    if (editingUser) {
      setUsers(users.map(user =>
        user.id === editingUser.id ? editingUser : user
      ));
      setIsEditDialogOpen(false);
      setEditingUser(null);
    }
  };

  const handlePermissionChange = (permission: keyof UserPermissions, checked: boolean, isEdit: boolean = false) => {
    if (isEdit && editingUser) {
      setEditingUser({
        ...editingUser,
        permissions: {
          ...editingUser.permissions,
          [permission]: checked
        }
      });
    } else {
      setNewUser({
        ...newUser,
        permissions: {
          ...newUser.permissions,
          [permission]: checked
        }
      });
    }
  };

  const PermissionsSection = ({ permissions, onChange, isEdit = false }: {
    permissions: UserPermissions,
    onChange: (permission: keyof UserPermissions, checked: boolean) => void,
    isEdit?: boolean
  }) => (
    <div className="space-y-4">
      <Label className="text-base font-semibold">Menu Permissions</Label>
      <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto">
        {Object.entries(permissionLabels).map(([key, label]) => (
          <div key={key} className="flex items-center space-x-2">
            <Checkbox
              id={`${isEdit ? 'edit-' : ''}permission-${key}`}
              checked={permissions[key as keyof UserPermissions]}
              onCheckedChange={(checked) => onChange(key as keyof UserPermissions, checked as boolean)}
            />
            <Label
              htmlFor={`${isEdit ? 'edit-' : ''}permission-${key}`}
              className="text-sm font-normal cursor-pointer"
            >
              {label}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );

  const activeUsers = users.filter(u => u.status === 'active').length;
  const adminUsers = users.filter(u => u.role === 'admin').length;

  return (
    <Layout>
      <Head title="User Management" />
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">User Management</h1>
            <p className="text-muted-foreground">Manage system users and their permissions</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
                <DialogDescription>Create a new user account for the system.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-6 py-4">
                {/* Basic Information Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">Basic Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={newUser.name}
                        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                        placeholder="Enter full name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        placeholder="Enter email address"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        value={newUser.password}
                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                        placeholder="Enter password"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <select
                        id="country"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={newUser.country}
                        onChange={(e) => setNewUser({ ...newUser, country: e.target.value })}
                      >
                        <option value="">Select country...</option>
                        {countries.map((country) => (
                          <option key={country} value={country}>{country}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="currency">Currency</Label>
                      <select
                        id="currency"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={newUser.currency}
                        onChange={(e) => setNewUser({ ...newUser, currency: e.target.value })}
                      >
                        <option value="">Select currency...</option>
                        {currencies.map((currency) => (
                          <option key={currency} value={currency}>{currency}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Role & Access Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">Role & Access Level</h3>
                  <div className="space-y-2">
                    <Label htmlFor="role">User Role</Label>
                    <select
                      id="role"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={newUser.role}
                      onChange={(e) => setNewUser({ ...newUser, role: e.target.value as User['role'] })}
                    >
                      <option value="viewer">Viewer</option>
                      <option value="agent">Agent</option>
                      <option value="seller">Seller</option>
                      <option value="manager">Manager</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>

                {/* Permissions Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">Menu Access Permissions</h3>
                  <PermissionsSection
                    permissions={newUser.permissions}
                    onChange={(permission, checked) => handlePermissionChange(permission, checked, false)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleAddUser}>Create User</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
              <p className="text-sm text-muted-foreground">Registered users</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Active Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{activeUsers}</div>
              <p className="text-sm text-muted-foreground">Currently active</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Administrators</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{adminUsers}</div>
              <p className="text-sm text-muted-foreground">Admin access</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>New This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-sm text-muted-foreground">Recent signups</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>User Directory</CardTitle>
            <CardDescription>Manage user accounts and permissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
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
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge className={getRoleColor(user.role)}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(user.status)}>
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{user.country}</TableCell>
                    <TableCell>{user.lastLogin}</TableCell>
                    <TableCell>{user.joinDate}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" onClick={() => handleEditUser(user)}>
                          <Settings className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" title="Reset Password">
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
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
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>Update user information and permissions.</DialogDescription>
            </DialogHeader>
            {editingUser && (
              <div className="grid gap-6 py-4">
                {/* Basic Information Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">Basic Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-name">Full Name</Label>
                      <Input
                        id="edit-name"
                        value={editingUser.name}
                        onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-email">Email Address</Label>
                      <Input
                        id="edit-email"
                        type="email"
                        value={editingUser.email}
                        onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-country">Country</Label>
                      <select
                        id="edit-country"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={editingUser.country}
                        onChange={(e) => setEditingUser({ ...editingUser, country: e.target.value })}
                      >
                        <option value="">Select country...</option>
                        {countries.map((country) => (
                          <option key={country} value={country}>{country}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-currency">Currency</Label>
                      <select
                        id="edit-currency"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={editingUser.currency}
                        onChange={(e) => setEditingUser({ ...editingUser, currency: e.target.value })}
                      >
                        <option value="">Select currency...</option>
                        {currencies.map((currency) => (
                          <option key={currency} value={currency}>{currency}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Role & Status Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">Role & Status</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-role">User Role</Label>
                      <select
                        id="edit-role"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={editingUser.role}
                        onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as User['role'] })}
                      >
                        <option value="viewer">Viewer</option>
                        <option value="agent">Agent</option>
                        <option value="seller">Seller</option>
                        <option value="manager">Manager</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-status">Account Status</Label>
                      <select
                        id="edit-status"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={editingUser.status}
                        onChange={(e) => setEditingUser({ ...editingUser, status: e.target.value as User['status'] })}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Permissions Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">Menu Access Permissions</h3>
                  <PermissionsSection
                    permissions={editingUser.permissions}
                    onChange={(permission, checked) => handlePermissionChange(permission, checked, true)}
                    isEdit={true}
                  />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button type="submit" onClick={handleUpdateUser}>Update User</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Users;
