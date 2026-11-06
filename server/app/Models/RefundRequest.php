<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RefundRequest extends Model
{
    protected $table = 'refund_requests';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'request_id',
        'original_tx_id',
        'guest_name',
        'hotel_id',
        'hotel_name',
        'booking_ref',
        'requested_amount',
        'currency',
        'reason',
        'request_date',
        'status',
        'reviewed_by',
        'reviewed_date',
    ];

    protected $casts = [
        'requested_amount' => 'float',
    ];
}

