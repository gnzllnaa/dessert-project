<?php

namespace App\Filament\Resources\EmployeeDetails\Pages;

use App\Filament\Resources\EmployeeDetails\EmployeeDetailResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditEmployeeDetail extends EditRecord
{
    protected static string $resource = EmployeeDetailResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
