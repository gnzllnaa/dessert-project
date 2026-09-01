<?php

namespace App\Filament\Resources\OrderDetails\Pages;

use App\Filament\Resources\OrderDetails\OrderDetailResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditOrderDetail extends EditRecord
{
    protected static string $resource = OrderDetailResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
