<?php

namespace App\Traits\Services;

trait HasMakeAIHookDemoData
{
    /**
     * Get the success response demo data
     */
    public function getSuccessResponseDemoData()
    {
        return collect([
            'Status' => 'success',
            'Message' => 'Description generated successfully with demo test',
            'Watch_ID' => '',
            'Description' => 'No images of a Longines HydroConquest were detected. The provided images feature a vintage Bulova watch. Please upload images of the Longines HydroConquest if you would like an analysis and sales listing for that model. If you would like a sales listing for the Bulova shown, please confirm or provide the required details.',
            'Status_Selected' => 'Review',
            'Thread_ID' => 'thread_B9wce7fVauF2EX7IOklUySWk'
        ]);
    }
}
