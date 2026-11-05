<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'invoice_number',
        'booking_id',
        'guest_name',
        'room_number',
        'issue_date',
        'due_date',
        'subtotal',
        'tax_amount',
        'total_amount',
        'amount_paid',
        'status',
        'items',
    ];

    protected $casts = [
        'items' => 'array',
        'subtotal' => 'float',
        'tax_amount' => 'float',
        'total_amount' => 'float',
        'amount_paid' => 'float',
        'issue_date' => 'date',
        'due_date' => 'date',
    ];
}

