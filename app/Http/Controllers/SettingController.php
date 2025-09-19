<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSettingRequest;
use App\Http\Requests\UpdateSettingRequest;
use Illuminate\Support\Facades\Hash;
use App\Models\Setting;
use App\Models\Currency; 
use App\Models\User;
use Inertia\Inertia;
use Auth;

class SettingController extends Controller
{
    /**
     * Create a new controller instance.
     */
    public function __construct()
    {
        $this->middleware('permission:settings');
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
         $user = auth()->user();
         $currencies = Currency::get(); 
        return Inertia::render('Settings',[
             'user' => $user,
             'currencies' => $currencies
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreSettingRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Setting $setting)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Setting $setting)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSettingRequest $request, User $user)
    { 
         $user = auth()->user(); 
        if ($request->form_type === 'password') {
         $request->validate([
        'current_password' => 'required',
        'password' => 'required|confirmed|min:4',
    ]); 
    if (! Hash::check($request->current_password, $user->password)) {
        return back()->withErrors([
            'current_password' => 'Your current password is incorrect.',
        ]);
    } 
    $user->password = Hash::make($request->password);
    $user->save();
        return back()->with('success', 'Password updated successfully.');
    }
      if ($request->form_type === 'general') {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'currency' => 'required|exists:currencies,code',
        ]);
       
        if (isset($data['name'])) {
            $user->name = $data['name'];
        }
        if (isset($data['currency'])) {
            $user->currency = $data['currency'];
        }
         $user->save();
        return back()->with('success', 'Profile updated successfully.');
    }
    
}

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Setting $setting)
    {
        //
    }
}
