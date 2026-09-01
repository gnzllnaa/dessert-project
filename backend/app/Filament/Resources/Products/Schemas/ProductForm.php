<?php

namespace App\Filament\Resources\Products\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Select;
use Filament\Schemas\Schema;

class ProductForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('name')
                    ->required(),

                Select::make('category')
                    ->options([
                        'Cake' => 'Cake',
                        'Brownies' => 'Brownies',
                        'Dessert' => 'Dessert',
                    ]),

                TextInput::make('price')
                    ->required()
                    ->numeric()
                    ->prefix('Rp'),
            ]);
    }
}