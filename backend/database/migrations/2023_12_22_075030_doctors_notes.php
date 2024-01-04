<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        //
        Schema::create('doctors_notes', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger("patient_id");
            $table->unsignedBigInteger("doctor_id");
            $table->text('note');
            $table->softDeletes()->nullable();
            $table->timestamps(); 

            $table->foreign('patient_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('doctor_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
