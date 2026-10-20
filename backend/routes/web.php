
<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\StoreController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\AdminHandoffController;

Route::get('/', function () {
    return view('welcome');
});

// Penghubung sesi login React ke Filament
Route::get('/admin/handoff', [
    AdminHandoffController::class,
    'consume',
])->name('admin.handoff');

Route::resource('stores', StoreController::class);
Route::resource('employees', EmployeeController::class);
Route::resource('products', ProductController::class);
Route::resource('orders', OrderController::class);
Route::resource('payments', PaymentController::class);
