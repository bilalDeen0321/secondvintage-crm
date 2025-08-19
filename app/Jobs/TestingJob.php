<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;

class TestingJob implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(public $message = 'Testing job successfully dispatched.')
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        event(new \App\Events\TestingEvent($this->message));
        Log::info($this->message);
    }
}
