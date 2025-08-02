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
        $permissions = [
            'view dashboard',
            'view watch management',
            'view multi-platform sales',
            'view batch management',
            'view promote',
            'view sales history',
            'view performance tracking',
            'view wish list',
            'view agent balance',
            'view invoices',
            'view users',
            'view tools',
            'view full data view',
            'view settings',
            'view log',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // Create Roles
        $admin = Role::firstOrCreate(['name' => 'Admin']);
        $manager = Role::firstOrCreate(['name' => 'Manager']);
        $finance = Role::firstOrCreate(['name' => 'Finance']);
        $agent = Role::firstOrCreate(['name' => 'Agent']);
        $seller = Role::firstOrCreate(['name' => 'Seller']);

        // Assign Permissions
        $admin->syncPermissions(Permission::all());

        $manager->syncPermissions(Permission::whereNotIn('name', [
            'view users',
            'view settings',
            'view log'
        ])->get());

        $finance->syncPermissions([
            'view dashboard',
            'view watch management',
            'view multi-platform sales',
            'view batch management',
            'view promote',
            'view sales history',
            'view performance tracking',
            'view wish list',
            'view agent balance',
            'view invoices',
            'view tools',
            'view full data view',
        ]);

        $agent->syncPermissions([
            'view wish list',
            'view agent balance',
            'view tools',
            'view watch management',
        ]);

        $seller->syncPermissions([
            'view wish list',
            'view tools',
            'view watch management',
        ]);

        // Create Users for Each Role
        $users = [
            [
                'name' => 'Admin User',
                'email' => 'admin@example.com',
                'password' => Hash::make('password'),
                'role' => $admin,
            ],
            [
                'name' => 'Manager User',
                'email' => 'manager@example.com',
                'password' => Hash::make('password'),
                'role' => $manager,
            ],
            [
                'name' => 'Finance User',
                'email' => 'finance@example.com',
                'password' => Hash::make('password'),
                'role' => $finance,
            ],
            [
                'name' => 'Agent User',
                'email' => 'agent@example.com',
                'password' => Hash::make('password'),
                'role' => $agent,
            ],
            [
                'name' => 'Seller User',
                'email' => 'seller@example.com',
                'password' => Hash::make('password'),
                'role' => $seller,
            ],
        ];

        foreach ($users as $data) {
            $user = User::updateOrCreate([
                'email' => $data['email'],
            ], [
                'name' => $data['name'],
                'password' => $data['password'],
            ]);

            $user->syncRoles($data['role']);
        }
    }
}
