<?php
namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    protected $table = 'utilisateurs';

    protected $fillable = [
        'nom', 'prenom', 'date_naissance',
        'email', 'telephone', 'photo',
        'profile', 'mot_de_passe',
    ];

    protected $hidden = ['mot_de_passe'];

    protected $casts = ['date_naissance' => 'date'];
}