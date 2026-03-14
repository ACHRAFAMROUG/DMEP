<?php
namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;

class Utilisateur extends Authenticatable
{
    protected $table      = 'utilisateurs';  // ← minuscules
    protected $primaryKey = 'id';
    public    $timestamps = true;

    protected $fillable = [
        'email',
        'password',
        'date_naissance',
        'etat_civil',
        'photo',
        'status',
        'telephone',
        'ville_id',
    ];

    protected $hidden = [
        'password',
    ];
}