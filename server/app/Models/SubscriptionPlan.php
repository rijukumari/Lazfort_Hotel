<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SubscriptionPlan extends Model
{
    protected $table = 'subscription_plans';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'name',
        'tier_code',
        'price',
        'currency',
        'billing_cycle',
        'max_rooms',
        'max_staff',
        'description',
        'features',
        'status',
    ];

    protected $casts = [
        'features' => 'array',
        'price' => 'float',
        'max_rooms' => 'integer',
        'max_staff' => 'integer',
    ];
}

