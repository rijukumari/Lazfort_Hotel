<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Room extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'room_number',
        'type',
        'floor',
        'price',
        'status',
        'capacity',
        'bed_type',
        'view',
        'image',
        'amenities',
        'images',
        'description',
        'hotel_id',
    ];

    protected $casts = [
        'amenities' => 'array',
        'images' => 'array',
        'price' => 'float',
        'capacity' => 'integer',
    ];
}

