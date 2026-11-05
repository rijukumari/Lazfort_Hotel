<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RoomCategory extends Model
{
    protected $table = 'room_categories';

    protected $fillable = [
        'code',
        'name',
        'base_price',
        'max_occupancy',
        'description',
        'amenities',
        'status',
    ];

    protected $casts = [
        'base_price' => 'float',
        'max_occupancy' => 'integer',
        'amenities' => 'array',
    ];
}

