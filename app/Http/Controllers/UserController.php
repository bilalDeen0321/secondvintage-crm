<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use App\Models\User;
use Error;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class UserController extends Controller
{

    /**
     * Create a new controller instance.
     */
    public function __construct()
    {
        $this->middleware('permission:users');
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->input('search');

        $query = User::query();

        $users = $query->with('roles', 'permissions')
            ->when($search, function ($q) use ($search) {
                $q->where('name', 'like', "%$search%")
                    ->orWhere('email', 'like', "%$search%");
            })
            ->paginate($request->input('per_page', 10));

        return Inertia::render('Users', [
            'search' => $request->input('search'),
            'total_users' => $query->count(),
            'active_users' => (clone $query)->where('status', 'active')->count(),
            'admin_users' => (clone $query)->whereRelation('roles', 'name', 'admin')->count(),
            'monthly_users' => (clone $query)->where('created_at', '>=', now()->startOfMonth())->count(),
            'users' => UserResource::collection($users),
        ]);
    }

    /**
     * Create a new user.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'             => ['required', 'string', 'max:255'],
            'email'            => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            // 'status'           => ['required', 'in:active,inactive'],
            'password'         => ['required', 'string', 'min:6'], // expects password_confirmation
            'currency'         => ['nullable', 'string', 'max:10'],
            'country'          => ['nullable', 'string', 'max:100'],
        ]);

        $user = User::create([
            'name'             => $validated['name'],
            'email'            => $validated['email'],
            'status'           => 'active',
            'password'         => Hash::make($validated['password']),
            'currency'         => $validated['currency'] ?? null,
            'country'          => $validated['country'] ?? null,
        ]);

        return redirect()
            ->back()
            ->with('success', 'User created successfully.')
            ->with('data', $user);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name'     => ['required', 'string', 'max:255'],
            'email'    => ['required', 'email', 'max:255', 'unique:users,email,' . $user->id],
            'status'   => ['required', 'in:active,inactive'],
            'role'     => ['required', 'string'], // Only if role changes from frontend
            'password' => ['nullable', 'string', 'min:6'], // Optional password change
            'country'  => ['nullable', 'string', 'max:100'],
            'currency' => ['nullable', 'string', 'max:10'],
        ]);

        $user->update(Arr::except($validated, ['password']));

        // Update password if provided
        if (!empty($validated['password'])) {
            $user->update([
                'password' => Hash::make($validated['password']),
            ]);
        }

        // Update role (if using Spatie)
        if (!empty($validated['role'])) {
            $user->syncRoles([$validated['role']]);
        }

        return redirect()
            ->back()
            ->with('success', 'User updated successfully.')
            ->with('user', $user);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        if ($user->id === Auth::id()) {
            return redirect()->back()->with('error', 'You cannot delete yourself.');
        }

        $user->delete();

        return redirect()->back()->with('success', 'User deleted successfully.');
    }
}
