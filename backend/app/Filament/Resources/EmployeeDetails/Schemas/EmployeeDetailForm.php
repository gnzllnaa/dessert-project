<?php

namespace App\Filament\Resources\EmployeeDetails\Schemas;

use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class EmployeeDetailForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('employee_id')
                    ->required()
                    ->numeric(),
                TextInput::make('employee_number')
                    ->required(),
                DatePicker::make('date_of_joining')
                    ->required(),
            ]);
    }
}
