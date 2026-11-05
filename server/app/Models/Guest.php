<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Guest extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'name',
        'email',
        'phone',
        'nationality',
        'id_proof',
        'id_number',
        'vip_tier',
        'status',
        'address',
        'current_room',
        'total_stays',
        'total_spent',
        'preferences',
    ];

    protected $casts = [
        'preferences' => 'array',
        'total_stays' => 'integer',
        'total_spent' => 'float',
    ];
}

