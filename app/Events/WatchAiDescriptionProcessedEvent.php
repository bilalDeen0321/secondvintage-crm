<?php

namespace App\Events;

use App\Http\Resources\WatchResource;
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

class WatchAiDescriptionProcessedEvent implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     */
    public function __construct(public Watch $watch)
    {
        //
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn()
    {
        return new Channel('watch.' . $this->watch->getRouteKey());
    }


    /**
     * Data to broadcast to frontend.
     */
    public function broadcastWith(): array
    {
        // return (new WatchResource($this->watch))->resolve();
        // return $this->watch->only(['id', 'status', 'ai_status', 'ai_message', 'description']);
        return $this->watch->only(['id', 'status', 'ai_status', 'ai_message']);
    }
}
