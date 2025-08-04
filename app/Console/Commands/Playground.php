<?php

namespace App\Console\Commands;

use Database\Factories\RoleFactory;
use Illuminate\Console\Command;
use Spatie\Permission\Models\Role;

class Playground extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'play';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Play test and demo code';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $roles = ['test:admin', 'test:manager', 'test:finance', 'test:agent', 'test:seller'];

        foreach ($roles as $role) {
            Role::firstOrCreate(['name' => $role]);
        }
    }
}
