<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ConsultationController extends Controller
{
    /* ── Lister les consultations d'un utilisateur ── */
    public function index(Request $request)
    {
        $userId = $request->header('X-User-Id');
        $consultations = DB::table('consultations')
            ->where('utilisateur_id', $userId)
            ->orderBy('date_consultation', 'desc')
            ->get();

        return response()->json(['success' => true, 'data' => $consultations]);
    }

    /* ── Créer une consultation ── */
    public function store(Request $request)
    {
        $userId = $request->header('X-User-Id');

        $request->validate([
            'date_consultation' => 'required|date',
            'heure'             => 'required',
        ]);

        $id = DB::table('consultations')->insertGetId([
            'utilisateur_id'    => $userId,
            'medecin'           => $request->medecin,
            'specialite'        => $request->specialite,
            'date_consultation' => $request->date_consultation,
            'heure'             => $request->heure,
            'type'              => $request->type,
            'description'       => $request->description,
            'medicaments'       => json_encode($request->medicaments ?? []),
            'analyses'          => json_encode($request->analyses    ?? []),
            'radiologie'        => json_encode($request->radiologie  ?? []),
            'statut'            => 'en_attente',
            'created_at'        => now(),
            'updated_at'        => now(),
        ]);

        $consultation = DB::table('consultations')->find($id);
        return response()->json(['success' => true, 'data' => $consultation], 201);
    }

    /* ── Modifier une consultation ── */
    public function update(Request $request, $id)
    {
        $userId = $request->header('X-User-Id');

        DB::table('consultations')
            ->where('id', $id)
            ->where('utilisateur_id', $userId)
            ->update([
                'medecin'           => $request->medecin,
                'specialite'        => $request->specialite,
                'date_consultation' => $request->date_consultation,
                'heure'             => $request->heure,
                'type'              => $request->type,
                'description'       => $request->description,
                'medicaments'       => json_encode($request->medicaments ?? []),
                'analyses'          => json_encode($request->analyses    ?? []),
                'radiologie'        => json_encode($request->radiologie  ?? []),
                'updated_at'        => now(),
            ]);

        $consultation = DB::table('consultations')->find($id);
        return response()->json(['success' => true, 'data' => $consultation]);
    }

    /* ── Supprimer une consultation ── */
    public function destroy(Request $request, $id)
    {
        $userId = $request->header('X-User-Id');

        DB::table('consultations')
            ->where('id', $id)
            ->where('utilisateur_id', $userId)
            ->delete();

        return response()->json(['success' => true, 'message' => 'Supprimée']);
    }
}