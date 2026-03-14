<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class AuthController extends Controller
{
    /* ════════ INSCRIPTION ════════ */
    public function register(Request $request)
    {
        $request->validate([
            'nom'           => 'required|string',
            'prenom'        => 'required|string',
            'email'         => 'required|email|unique:utilisateurs,email',
            'telephone'     => 'required|string',
            'mot_de_passe'  => 'required|min:6',
            'profil'        => 'required|string',
            'date_naissance'=> 'required',
        ], [
            'email.unique' => 'Cet email est déjà utilisé.',
        ]);

        /* ── Photo ── */
        $photo = null;
        if ($request->hasFile('photo')) {
            $photo = $request->file('photo')->store('photos', 'public');
        }

        /* ── Créer utilisateur ── */
        $userId = DB::table('utilisateurs')->insertGetId([
            'email'          => $request->email,
            'nom'            => $request->nom,
            'prenom'         => $request->prenom,
            'password'       => Hash::make($request->mot_de_passe),
            'date_naissance' => $request->date_naissance,
            'telephone'      => $request->telephone,
            'photo'          => $photo,
            'status'         => true,
            'created_at'     => now(),
            'updated_at'     => now(),
        ]);

        /* ── Lier le profil ── */
        $profil = DB::table('profils')
            ->where('type', $request->profil)
            ->first();

        if ($profil) {
            DB::table('utilisateur_profils')->insert([
                'utilisateur_id'   => $userId,
                'profil_id'        => $profil->id,
                'date_inscription' => now()->toDateString(),
                'created_at'       => now(),
                'updated_at'       => now(),
            ]);
        }

        /* ── Token ── */
        $token = base64_encode($userId . '.' . time() . '.' . $request->profil);

        return response()->json([
            'success' => true,
            'message' => 'Compte créé avec succès',
            'token'   => $token,
            'user'    => [
                'id'        => $userId,
                'email'     => $request->email,
                'nom'       => $request->nom,
                'prenom'    => $request->prenom,
                'telephone' => $request->telephone,
                'profile'   => $request->profil,
                'photo'     => $photo ? asset('storage/' . $photo) : null,
            ],
        ], 201);
    }

    /* ════════ CONNEXION ════════ */
    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required',
        ]);

        $user = DB::table('utilisateurs')
            ->where('email', $request->email)
            ->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Email ou mot de passe incorrect.',
            ], 401);
        }

        /* ── Profil ── */
        $profilUser = DB::table('utilisateur_profils')
            ->join('profils', 'utilisateur_profils.profil_id', '=', 'profils.id')
            ->where('utilisateur_profils.utilisateur_id', $user->id)
            ->first();

        $profile = $profilUser ? $profilUser->type : 'patient';
        $token   = base64_encode($user->id . '.' . time() . '.' . $profile);

        return response()->json([
            'success' => true,
            'message' => 'Connexion réussie',
            'token'   => $token,
            'user'    => [
                'id'        => $user->id,
                'email'     => $user->email,
                'nom'       => $user->nom    ?? '',
                'prenom'    => $user->prenom ?? '',
                'telephone' => $user->telephone ?? '',
                'profile'   => $profile,
                'photo'     => $user->photo ? asset('storage/' . $user->photo) : null,
            ],
        ]);
    }
}