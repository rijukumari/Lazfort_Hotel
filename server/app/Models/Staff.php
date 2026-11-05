<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Staff extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';
    protected $table = 'staff';

    protected $fillable = [
        'id',
        'employee_code',
        'name',
        'email',
        'phone',
        'role',
        'department',
        'shift',
        'status',
        'salary',
        'joining_date',
        'avatar',
    ];

    protected $casts = [
        'salary' => 'float',
        'joining_date' => 'date',
    ];
}

