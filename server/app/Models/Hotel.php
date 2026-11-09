<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Hotel extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';
    protected $table = 'hotels';

    protected $fillable = [
        'id',
        'name',
        'legal_name',
        'code',
        'brand',
        'location',
        'address',
        'city',
        'state',
        'postal_code',
        'country',
        'phone',
        'email',
        'website',
        'rating',
        'hotel_category',
        'status',
        'rejection_reason',
        'image',
        'total_rooms',
        'subscription_plan',
        'currency_code',
        'timezone',
        'amenities',
    ];

    protected $casts = [
        'amenities' => 'array',
        'total_rooms' => 'integer',
    ];
}
