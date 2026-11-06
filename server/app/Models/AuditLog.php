<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AuditLog extends Model
{
    protected $table = 'audit_logs';

    protected $fillable = [
        'action',
        'module',
        'target_id',
        'description',
        'performed_by',
        'ip_address',
    ];
}

