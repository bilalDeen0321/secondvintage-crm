<?php

/**
 * Web dashboard routes
 */

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', fn() => Inertia::render('Dashboard'))->name('home');
Route::get('/dashboard', fn() => Inertia::render('Dashboard'))->name('dashboard');
Route::get('/watches', fn() => Inertia::render('WatchManagement'))->name('watches');
Route::get('/sales', fn() => Inertia::render('SalesHistory'))->name('sales');
Route::get('/batch', fn() => Inertia::render('BatchManagement'))->name('batch');
Route::get('/promote', fn() => Inertia::render('Promote'))->name('promote');
Route::get('/history', fn() => Inertia::render('SalesHistory'))->name('history');
Route::get('/performance', fn() => Inertia::render('PerformanceTracking'))->name('performance');
Route::get('/wishlist', fn() => Inertia::render('WishList'))->name('wishlist');
Route::get('/payments', fn() => Inertia::render('VendorPayments'))->name('payments');
Route::get('/agent-watches', fn() => Inertia::render('AgentWatches'))->name('agent-watches');
Route::get('/sellers', fn() => Inertia::render('Sellers'))->name('sellers');
Route::get('/invoices', fn() => Inertia::render('Invoices'))->name('invoices');
Route::get('/users', fn() => Inertia::render('Users'))->name('users');
Route::get('/tools', fn() => Inertia::render('Tools'))->name('tools');
Route::get('/data', fn() => Inertia::render('FullDataView'))->name('data');
Route::get('/settings', fn() => Inertia::render('Settings'))->name('settings');
Route::get('/log', fn() => Inertia::render('Log'))->name('log');
