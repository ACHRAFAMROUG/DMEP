<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Profil extends Model
{
    protected $table    = 'profils';  // ← minuscules
    public $timestamps  = true;

    protected $fillable = [
        'type',
        'status',
    ];
}