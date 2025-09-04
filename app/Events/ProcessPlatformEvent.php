<?php

namespace App\Events;

use App\Models\PlatformData;
use App\Models\Watch;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class ProcessPlatformEvent implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     */
    public function __construct(protected Watch $watch, public PlatformData $platform) {}

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn()
    {
        $routeKey = $this->watch->getRouteKey();

        return [
            new Channel("platform.{$routeKey}"),
            new Channel("platform.fill.{$routeKey}"),
        ];
    }


    /**
     * Data to broadcast to frontend.
     */
    public function broadcastWith(): array
    {
        return [
            'platform' => $this->platform->only(['id', 'name', 'status', 'message']),
        ];
    }
}
