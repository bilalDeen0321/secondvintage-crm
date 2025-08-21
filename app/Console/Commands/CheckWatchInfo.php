<?php

namespace App\Console\Commands;

use App\Models\Watch;
use App\Models\WatchImage;
use Illuminate\Console\Command;

class CheckWatchInfo extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:check-watch-info';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        dd(WatchImage::query()->first()->watch->toArray());
    }
}
