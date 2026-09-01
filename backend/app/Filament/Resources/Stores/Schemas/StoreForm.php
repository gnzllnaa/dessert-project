<?php

namespace App\Filament\Resources\Stores\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Schema;

class StoreForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('user_id')
                    ->required()
                    ->numeric(),
                TextInput::make('name')
                    ->required(),
                Textarea::make('address')
                    ->required()
                    ->columnSpanFull(),
            ]);
    }
}
