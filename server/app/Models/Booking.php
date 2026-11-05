<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'booking_code',
        'guest_name',
        'guest_email',
        'guest_phone',
        'room_id',
        'room_number',
        'room_type',
        'check_in_date',
        'check_out_date',
        'adults',
        'children',
        'total_amount',
        'paid_amount',
        'status',
        'payment_status',
        'booking_source',
        'special_requests',
        'rate_plan',
        'created_by',
    ];

    protected $casts = [
        'check_in_date' => 'date',
        'check_out_date' => 'date',
        'total_amount' => 'float',
        'paid_amount' => 'float',
        'adults' => 'integer',
        'children' => 'integer',
    ];
}

