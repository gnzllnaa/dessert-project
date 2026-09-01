<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    use HasFactory;

    protected $fillable = [
        'store_id',
        'name',
        'position',
    ];

    public function store()
    {
        return $this->belongsTo(Store::class);
    }

    public function detail()
    {
        return $this->hasOne(EmployeeDetail::class);
    }
}
