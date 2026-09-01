<?php

namespace App\Filament\Resources\EmployeeDetails\Pages;

use App\Filament\Resources\EmployeeDetails\EmployeeDetailResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListEmployeeDetails extends ListRecords
{
    protected static string $resource = EmployeeDetailResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
