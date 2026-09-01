<?php

namespace App\Filament\Resources\ProductDetails;

use App\Filament\Resources\ProductDetails\Pages\CreateProductDetail;
use App\Filament\Resources\ProductDetails\Pages\EditProductDetail;
use App\Filament\Resources\ProductDetails\Pages\ListProductDetails;
use App\Filament\Resources\ProductDetails\Schemas\ProductDetailForm;
use App\Filament\Resources\ProductDetails\Tables\ProductDetailsTable;
use App\Models\ProductDetail;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class ProductDetailResource extends Resource
{
    protected static ?string $model = ProductDetail::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    public static function form(Schema $schema): Schema
    {
        return ProductDetailForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return ProductDetailsTable::configure($table);
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
            'index' => ListProductDetails::route('/'),
            'create' => CreateProductDetail::route('/create'),
            'edit' => EditProductDetail::route('/{record}/edit'),
        ];
    }
}
