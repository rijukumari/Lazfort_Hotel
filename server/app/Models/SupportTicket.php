<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SupportTicket extends Model
{
    protected $table = 'support_tickets';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'ticket_id',
        'subject',
        'client_name',
        'hotel_name',
        'category',
        'priority',
        'status',
        'assigned_agent',
        'replies_count',
        'description',
        'replies',
    ];

    protected $casts = [
        'replies_count' => 'integer',
        'replies' => 'array',
    ];
}

