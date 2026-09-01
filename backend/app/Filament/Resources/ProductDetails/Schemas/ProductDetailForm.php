<?php

namespace App\Filament\Resources\ProductDetails\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Schema;

class ProductDetailForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('product_id')
                    ->required()
                    ->numeric(),
                Textarea::make('description')
                    ->required()
                    ->columnSpanFull(),
                TextInput::make('weight')
                    ->required(),
            ]);
    }
}
