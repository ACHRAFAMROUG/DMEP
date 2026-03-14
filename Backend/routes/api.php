<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);

use App\Http\Controllers\ConsultationController;

Route::get   ('consultations',        [ConsultationController::class, 'index']);
Route::post  ('consultations',        [ConsultationController::class, 'store']);
Route::put   ('consultations/{id}',   [ConsultationController::class, 'update']);
Route::delete('consultations/{id}',   [ConsultationController::class, 'destroy']);