<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InventoryItem extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';
    protected $table = 'inventory_items';

    protected $fillable = [
        'id',
        'sku',
        'name',
        'category',
        'current_stock',
        'min_stock_level',
        'unit_price',
        'unit',
        'supplier',
        'status',
    ];

    protected $casts = [
        'current_stock' => 'integer',
        'min_stock_level' => 'integer',
        'unit_price' => 'float',
    ];
}

