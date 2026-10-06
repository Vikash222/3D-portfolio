<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Profile;
use Illuminate\Support\Facades\Hash;
class AdminSeeder extends Seeder {
    public function run() {
        $email = env('ADMIN_EMAIL', 'emails.vikash@gmail.com');
        $password = env('ADMIN_PASSWORD', 'A#IKGptu@2007');
        User::updateOrCreate(
            ['email' => $email],
            [
                'name' => 'Vikash Kumar',
                'password' => Hash::make($password),
                'role' => 'admin'
            ]
        );
        Profile::updateOrCreate(
            ['email' => 'connect@mrvikash.in'],
            [
                'name' => 'Vikash Kumar',
                'tagline' => 'B.Tech CSE Student · Full-Stack Developer',
                'bio' => 'Passionate software developer...',
                'github_url' => 'https://github.com/mrvikashkumar',
                'linkedin_url' => 'https://linkedin.com/in/mrvikash-kumar'
            ]
        );
    }
}
