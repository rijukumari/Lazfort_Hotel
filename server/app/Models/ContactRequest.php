<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContactRequest extends Model
{
    protected $table = 'contact_requests';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'request_id',
        'name',
        'email',
        'phone',
        'company_or_hotel',
        'inquiry_type',
        'message',
        'status',
        'follow_up_notes',
    ];
}

