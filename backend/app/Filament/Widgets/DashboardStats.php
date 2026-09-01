<?php

namespace App\Filament\Widgets;

use App\Models\Product;
use App\Models\Order;
use App\Models\Payment;
use App\Models\User;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class DashboardStats extends BaseWidget
{
    protected function getStats(): array
    {
        return [
            Stat::make('Products', Product::count())
                ->description('Total produk')
                ->color('info'),

            Stat::make('Orders', Order::count())
                ->description('Total pesanan')
                ->color('warning'),

            Stat::make('Customers', User::count())
                ->description('Total pelanggan')
                ->color('success'),

            Stat::make('Payments', Payment::count())
                ->description('Total pembayaran')
                ->color('primary'),

            Stat::make(
                'Revenue',
                'Rp ' . number_format(Payment::sum('amount'), 0, ',', '.')
            )
                ->description('Total pendapatan')
                ->color('success'),
        ];
    }
}