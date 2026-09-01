<?php

namespace App\Filament\Resources\OrderDetails;

use App\Filament\Resources\OrderDetails\Pages\CreateOrderDetail;
use App\Filament\Resources\OrderDetails\Pages\EditOrderDetail;
use App\Filament\Resources\OrderDetails\Pages\ListOrderDetails;
use App\Filament\Resources\OrderDetails\Schemas\OrderDetailForm;
use App\Filament\Resources\OrderDetails\Tables\OrderDetailsTable;
use App\Models\OrderDetail;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class OrderDetailResource extends Resource
{
    protected static ?string $model = OrderDetail::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    public static function form(Schema $schema): Schema
    {
        return OrderDetailForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return OrderDetailsTable::configure($table);
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
            'index' => ListOrderDetails::route('/'),
            'create' => CreateOrderDetail::route('/create'),
            'edit' => EditOrderDetail::route('/{record}/edit'),
        ];
    }
}
