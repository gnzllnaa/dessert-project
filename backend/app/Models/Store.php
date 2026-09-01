<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Store extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'address',
    ];

    // Store dimiliki oleh satu User
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Store memiliki banyak Employee
    public function employees()
    {
        return $this->hasMany(Employee::class);
    }

    // Store memiliki banyak Product
    public function products()
    {
        return $this->hasMany(Product::class);
    }
}