<?php

namespace App\Enums;

enum WatchAiStatus
{
    const draft = 'draft';
    const loading = 'loading';
    const success = 'success';
    const failed = 'failed';
    const canceled = 'canceled';
    const pending = 'pending';
    const queued = 'queued';
}
