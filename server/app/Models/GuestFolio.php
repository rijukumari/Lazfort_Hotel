<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GuestFolio extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';
    protected $table = 'guest_folios';

    protected $fillable = [
        'id',
        'booking_id',
        'guest_name',
        'room_number',
        'total_charges',
        'total_payments',
        'balance',
        'status',
        'transactions',
    ];

    protected $casts = [
        'total_charges' => 'float',
        'total_payments' => 'float',
        'balance' => 'float',
        'transactions' => 'array',
    ];
}

