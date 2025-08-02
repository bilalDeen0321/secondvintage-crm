<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = [
            [
                "id" => "USR001",
                "name" => "John Admin",
                "email" => "admin@secondvintage.com",
                "role" => "admin",
                "password" => 'password',
                "permissions" => [
                    "dashboard" => true,
                    "watchManagement" => true,
                    "multiplatformSales" => true,
                    "batchManagement" => true,
                    "promote" => true,
                    "salesHistory" => true,
                    "performanceTracking" => true,
                    "wishList" => true,
                    "agentsBalance" => true,
                    "invoices" => true,
                    "users" => true,
                    "tools" => true,
                    "fullDataView" => true,
                    "settings" => true,
                    "log" => true
                ]
            ],
            [
                "id" => "USR002",
                "name" => "Sarah Manager",
                "email" => "sarah@secondvintage.com",
                "role" => "manager",
                "password" => 'password',
                "permissions" => [
                    "dashboard" => true,
                    "watchManagement" => true,
                    "multiplatformSales" => false,
                    "batchManagement" => false,
                    "promote" => false,
                    "salesHistory" => true,
                    "performanceTracking" => false,
                    "wishList" => false,
                    "agentsBalance" => false,
                    "invoices" => false,
                    "users" => false,
                    "tools" => false,
                    "fullDataView" => false,
                    "settings" => false,
                    "log" => false
                ]
            ],
            [
                "id" => "USR003",
                "name" => "Mike Viewer",
                "email" => "mike@secondvintage.com",
                "role" => "viewer",
                "password" => 'password',
                "permissions" => [
                    "dashboard" => true,
                    "watchManagement" => false,
                    "multiplatformSales" => false,
                    "batchManagement" => false,
                    "promote" => false,
                    "salesHistory" => false,
                    "performanceTracking" => false,
                    "wishList" => false,
                    "agentsBalance" => false,
                    "invoices" => false,
                    "users" => false,
                    "tools" => false,
                    "fullDataView" => false,
                    "settings" => false,
                    "log" => false
                ]
            ],
            [
                "id" => "USR004",
                "name" => "Lisa Smith",
                "email" => "lisa@secondvintage.com",
                "role" => "manager",
                "password" => 'password',
                "permissions" => [
                    "dashboard" => true,
                    "watchManagement" => true,
                    "multiplatformSales" => false,
                    "batchManagement" => false,
                    "promote" => false,
                    "salesHistory" => true,
                    "performanceTracking" => false,
                    "wishList" => false,
                    "agentsBalance" => false,
                    "invoices" => false,
                    "users" => false,
                    "tools" => false,
                    "fullDataView" => false,
                    "settings" => false,
                    "log" => false
                ]
            ],
            [
                "id" => "USR005",
                "name" => "Tom Agent",
                "email" => "tom@secondvintage.com",
                "role" => "agent",
                "password" => 'password',
                "permissions" => [
                    "dashboard" => true,
                    "watchManagement" => false,
                    "multiplatformSales" => true,
                    "batchManagement" => false,
                    "promote" => false,
                    "salesHistory" => false,
                    "performanceTracking" => false,
                    "wishList" => false,
                    "agentsBalance" => true,
                    "invoices" => false,
                    "users" => false,
                    "tools" => false,
                    "fullDataView" => false,
                    "settings" => false,
                    "log" => false
                ]
            ]
        ];

        // Collect all unique permission names
        $allPermissions = collect($users)
            ->flatMap(fn($user) => array_keys($user['permissions']))
            ->unique()
            ->values();

        // Create permissions
        foreach ($allPermissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // Create roles and attach relevant permissions
        $grouped = collect($users)->groupBy('role');

        foreach ($grouped as $roleName => $groupedUsers) {
            $role = Role::firstOrCreate(['name' => $roleName]);

            // Merge permissions from all users under the role
            $rolePermissions = $groupedUsers->reduce(function ($carry, $user) {
                foreach ($user['permissions'] as $perm => $hasAccess) {
                    if ($hasAccess) {
                        $carry[$perm] = true;
                    }
                }
                return $carry;
            }, []);

            $permissionModels = Permission::whereIn('name', array_keys($rolePermissions))->get();
            $role->syncPermissions($permissionModels);
        }

        // Create users and assign roles
        foreach ($users as $userData) {
            $user = User::updateOrCreate([
                'email' => $userData['email']
            ], [
                'name' => $userData['name'],
                'password' => Hash::make($userData['password'])
            ]);

            $user->assignRole($userData['role']);
        }
    }
}
