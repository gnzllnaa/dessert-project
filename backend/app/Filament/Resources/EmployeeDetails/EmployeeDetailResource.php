<?php

namespace App\Filament\Resources\EmployeeDetails;

use App\Filament\Resources\EmployeeDetails\Pages\CreateEmployeeDetail;
use App\Filament\Resources\EmployeeDetails\Pages\EditEmployeeDetail;
use App\Filament\Resources\EmployeeDetails\Pages\ListEmployeeDetails;
use App\Filament\Resources\EmployeeDetails\Schemas\EmployeeDetailForm;
use App\Filament\Resources\EmployeeDetails\Tables\EmployeeDetailsTable;
use App\Models\EmployeeDetail;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class EmployeeDetailResource extends Resource
{
    protected static ?string $model = EmployeeDetail::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    public static function form(Schema $schema): Schema
    {
        return EmployeeDetailForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return EmployeeDetailsTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListEmployeeDetails::route('/'),
            'create' => CreateEmployeeDetail::route('/create'),
            'edit' => EditEmployeeDetail::route('/{record}/edit'),
        ];
    }
}
