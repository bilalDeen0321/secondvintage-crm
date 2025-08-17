<?php

namespace App\Logging;

use Monolog\Handler\AbstractProcessingHandler;
use Monolog\LogRecord;
use App\Models\Log as LogModel;
use Illuminate\Support\Facades\Auth;

class DatabaseHandler extends AbstractProcessingHandler
{
    protected function write(LogRecord $record): void
    {
        LogModel::create([
            'level'    => $record->level->getName(),
            'message'  => $record->message,
            'context'  => $record->context,
            'category' => $record->context['category'] ?? 'default',
            'user_id'  => $record->context['user_id'] ?? Auth::id(),
        ]);
    }
}
