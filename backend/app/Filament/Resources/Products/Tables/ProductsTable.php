<?php

namespace App\Filament\Resources\Products\Tables;

use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class ProductsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name')
                    ->searchable(),

                TextColumn::make('category'),

                TextColumn::make('price')
                    ->money('IDR')
                    ->sortable(),
            ])
            ->filters([
                SelectFilter::make('category')
                    ->options([
                        'Cake' => 'Cake',
                        'Brownies' => 'Brownies',
                        'Dessert' => 'Dessert',
                    ]),
            ]);
    }
}
