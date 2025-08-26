<?php

namespace App\Console\Commands\Helpers;

use Illuminate\Console\Command;

class PutEnv extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'putenv {pair : The environment variable in KEY=VALUE format}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Put (set or update) an environment variable in the .env file.';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $pair = $this->argument('pair'); // e.g. APP_NAME=My App

        if (!str_contains($pair, '=')) {
            $this->error('❌ Invalid format. Use KEY=VALUE.');
            $this->alert('Example: php artisan putenv APP_NAME="My App"');
            return self::INVALID;
        }

        [$key, $value] = explode('=', $pair, 2);

        $this->putenv($key, $value);

        $this->info("✅ Environment variable put: {$key}=\"{$value}\"");

        return self::SUCCESS;
    }

    /**
     * Update the .env file with the given key and value.
     *
     * @param  string  $key
     * @param  string|null  $value
     * @return void
     */
    protected function putenv(string $key, ?string $value = null): void
    {
        envWrite($key, $value);
    }
}
