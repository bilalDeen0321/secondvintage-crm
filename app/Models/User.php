<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable,  HasRoles;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'status',
        'password',
        'currency',
        'country',
        'last_login_at',
        'last_login_ip',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'last_login_at' => 'datetime',
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }


    /**
     * Get the watches as agent that owns this user
     */
    public function watchesAsAgent()
    {
        return $this->hasMany(Watch::class, 'agent_id');
    }

    /**
     * Get the watches as seller that owns this user
     */
    public function watchesAsSeller()
    {
        return $this->hasMany(Watch::class, 'seller_id');
    }


    /**
     * Get the transactions that owns this user
     */
    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }

    /**
     * Get the wishlists that owns this user
     */
    public function wishlists()
    {
        return $this->hasMany(WishList::class);
    }

    /**
     * Get the created batches that owns this user
     */
    public function createdBatches()
    {
        return $this->hasMany(Batch::class, 'created_by');
    }

    /**
     * Get the logs that owns this user
     */
    public function logs()
    {
        return $this->hasMany(Log::class);
    }

    /**
     * Get permissions by grouded for the instance
     */
    public function getPermissionsGrouped(): array
    {
        $defaults = [
            'dashboard' => false,
            'watchManagement' => false,
            'multiplatformSales' => false,
            'batchManagement' => false,
            'promote' => false,
            'salesHistory' => false,
            'performanceTracking' => false,
            'wishList' => false,
            'agentsBalance' => false,
            'invoices' => false,
            'users' => false,
            'tools' => false,
            'fullDataView' => false,
            'settings' => false,
            'log' => false,
        ];

        foreach ($defaults as $key => &$value) {
            $value = $this->hasPermissionTo($key);
        }

        return $defaults;
    }
}
