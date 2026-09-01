<?php

namespace App\Filament\Resources\EmployeeDetails\Pages;

use App\Filament\Resources\EmployeeDetails\EmployeeDetailResource;
use Filament\Resources\Pages\CreateRecord;

class CreateEmployeeDetail extends CreateRecord
{
    protected static string $resource = EmployeeDetailResource::class;
}
