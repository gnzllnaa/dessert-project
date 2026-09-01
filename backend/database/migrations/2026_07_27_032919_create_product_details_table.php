<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('product_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->unique()->constrained()->onDelete('cascade');
            $table->text('description');
            $table->string('weight');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_details');
    }
};