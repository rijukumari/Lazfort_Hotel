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
        'brand',
        'location',
        'address',
        'city',
        'country',
        'phone',
        'email',
        'rating',
        'status',
        'image',
        'total_rooms',
        'subscription_plan',
        'currency_code',
        'amenities',
    ];

    protected $casts = [
        'amenities' => 'array',
        'total_rooms' => 'integer',
    ];
}
