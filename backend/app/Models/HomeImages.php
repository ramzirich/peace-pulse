<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HomeImages extends Model
{
    use HasFactory;
    public $timestamps = false;
    protected $fillable=['url', 'text', 'author'];
}
