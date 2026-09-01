<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

   protected $fillable = [
    'name',
    'category',
    'price',
];

    public function store()
    {
        return $this->belongsTo(Store::class);
    }

    public function detail()
    {
        return $this->hasOne(ProductDetail::class);
    }

    public function orderDetails()
    {
        return $this->hasMany(OrderDetail::class);
    }
}