<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Subscription extends Model
{
    protected $table = 'subscriptions';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'subscription_code',
        'hotel_id',
        'hotel_name',
        'plan_id',
        'plan_name',
        'tier_code',
        'amount',
        'currency',
        'billing_cycle',
        'status',
        'start_date',
        'end_date',
        'next_billing_date',
        'auto_renew',
    ];

    protected $casts = [
        'amount' => 'float',
        'auto_renew' => 'boolean',
        'start_date' => 'date',
        'end_date' => 'date',
        'next_billing_date' => 'date',
    ];
}

