<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HousekeepingTask extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';
    protected $table = 'housekeeping_tasks';

    protected $fillable = [
        'id',
        'room_number',
        'assigned_to',
        'task_type',
        'priority',
        'status',
        'notes',
        'scheduled_time',
        'completed_at',
    ];

    protected $casts = [
        'scheduled_time' => 'datetime',
        'completed_at' => 'datetime',
    ];
}

