<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;

class CreateAdminCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'make:admin 
                            {email? : Admin email address} 
                            {password? : Admin password (min 6 characters)} 
                            {name? : Admin full name}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create or reset an Admin account for the Portfolio CMS';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('==========================================');
        $this->info('   PORTFOLIO CMS - ADMIN ACCOUNT SETUP    ');
        $this->info('==========================================');

        $email = $this->argument('email');
        if (!$email) {
            $email = $this->ask('Enter Admin Email Address', 'admin@portfolio.local');
        }

        $user = User::where('email', $email)->first();

        $name = $this->argument('name');
        if (!$name) {
            $name = $user ? $user->name : $this->ask('Enter Admin Full Name', 'Vikash Kumar');
        }

        $password = $this->argument('password');
        if (!$password) {
            $password = $this->secret('Enter Admin Password (min 6 characters)');
            if (!$password || strlen($password) < 6) {
                $this->error('Password must be at least 6 characters long.');
                return 1;
            }
        }

        if ($user) {
            $user->update([
                'name' => $name,
                'password' => Hash::make($password),
                'role' => 'admin',
            ]);
            $this->info("✓ Existing user [{$email}] was updated and assigned the 'admin' role!");
        } else {
            $user = User::create([
                'name' => $name,
                'email' => $email,
                'password' => Hash::make($password),
                'role' => 'admin',
            ]);
            $this->info("✓ New Admin account [{$email}] created successfully!");
        }

        $this->newLine();
        $this->table(
            ['Field', 'Value'],
            [
                ['Name', $user->name],
                ['Email (Login ID)', $user->email],
                ['Role', $user->role],
                ['2FA Enabled', $user->hasEnabledTwoFactor() ? 'YES (TOTP)' : 'NO (Go to 2FA & Security in CMS to enable)'],
            ]
        );

        $this->info('You can now log in at: http://localhost:5173/admin (or /login)');
        return 0;
    }
}
