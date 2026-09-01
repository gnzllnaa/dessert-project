<?php

namespace App\Filament\Resources\OrderDetails\Pages;

use App\Filament\Resources\OrderDetails\OrderDetailResource;
use Filament\Resources\Pages\CreateRecord;

class CreateOrderDetail extends CreateRecord
{
    protected static string $resource = OrderDetailResource::class;
}
