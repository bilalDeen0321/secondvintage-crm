<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use App\Models\User;
use Error;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $users = User::with('roles', 'permissions')->get();

        return Inertia::render('Users', [
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
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
