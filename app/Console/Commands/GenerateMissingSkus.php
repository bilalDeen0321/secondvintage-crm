<?php

namespace App\Console\Commands;

use App\Models\Watch;
use App\Support\Sku;
use Illuminate\Console\Command;

class GenerateMissingSkus extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:generate-missing-skus';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate SKUs for all watches that are missing it';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        /** @var \Illuminate\Database\Eloquent\Collection<int, \App\Models\Watch> $watches */
        $watches = Watch::whereNull('sku')->orWhere('sku', '')->get();

        if ($watches->isEmpty()) {
            $this->info('All watches already have SKUs.');
            return;
        }

        $this->info("Generating SKUs for {$watches->count()} watches...");

        foreach ($watches as $watch) {

            if (!$watch->brand->name || !$watch->name) {
                $this->warn("Skipping watch ID {$watch->id}: missing brand or model.");
                continue;
            }

            $sku = Sku::generate($watch->brand->name, $watch->name);

            $watch->sku = $sku;
            $watch->save();

            $this->line("Generated SKU {$sku} for watch ID {$watch->id}");
        }

        $this->info('Done generating missing SKUs.');
    }
}
