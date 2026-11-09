<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'transaction_ref',
        'booking_id',
        'guest_name',
        'room_number',
        'amount',
        'payment_method',
        'status',
        'hotel_id',
        'refund_request_id',
        'payment_date',
        'card_last4',
        'notes',
    ];

    protected $casts = [
        'amount' => 'float',
        'payment_date' => 'date',
    ];
}

