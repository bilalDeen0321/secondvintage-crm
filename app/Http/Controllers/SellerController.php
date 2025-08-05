<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSellerRequest;
use App\Http\Requests\UpdateSellerRequest;
use App\Models\Seller;
use App\Models\User;
use Inertia\Inertia;

class SellerController extends Controller
{
    /**
     * Create a new controller instance.
     */
    public function __construct()
    {
        $this->middleware('permission:dashboard');
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Sellers');
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
    public function store(StoreSellerRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(User $seller)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $seller)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSellerRequest $request, User $seller)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $seller)
    {
        //
    }
}
