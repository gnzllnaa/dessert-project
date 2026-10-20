<?php

namespace App\Http\Controllers;

use App\Models\User;
use Filament\Facades\Filament;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

class AdminHandoffController extends Controller
{
    public function create(Request $request)
    {
        $user = $request->user();

        if (! $user || $user->role !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Akses hanya untuk admin.',
            ], 403);
        }

        $code = Str::random(64);

        Cache::put(
            'admin_handoff:' . hash('sha256', $code),
            $user->id,
            now()->addSeconds(60)
        );

        return response()->json([
            'success' => true,
            'code' => $code,
        ]);
    }

    public function consume(Request $request)
    {
        $code = $request->query('code');

        if (! is_string($code) || strlen($code) !== 64) {
            abort(403, 'Kode login tidak valid atau kedaluwarsa.');
        }

        $userId = Cache::pull(
            'admin_handoff:' . hash('sha256', $code)
        );

        if (! $userId) {
            abort(403, 'Kode login tidak valid atau sudah digunakan.');
        }

        $user = User::find($userId);
        $panel = Filament::getPanel('admin');

        if (
            ! $user ||
            ! $panel ||
            ! $user->canAccessPanel($panel)
        ) {
            abort(403, 'Akun tidak memiliki akses ke panel admin.');
        }

        Auth::guard('web')->login($user);

        $request->session()->regenerate();

        return redirect('/admin');
    }
}
