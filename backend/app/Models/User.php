<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use App\Http\Resources\UserResource;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\DB;
use Laravel\Sanctum\HasApiTokens;
// TOOD: Role based restrictions
class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    // Somehow not working without these 2 lines
    protected $table = 'users';
    protected $connection = 'mysql';
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'organization_id',
        'name',
        'dob',
        'position',
        'role',
        'email',
        'password',
        'status',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // Relationship with Organization
    public function organization()
    {
        return $this->belongsTo(Organization::class);
    }

    /* -------------------------------------------------------------------------- */
    /*                          Controller Logic Function                         */
    /* -------------------------------------------------------------------------- */
    public function getUsers($organization_id)
    {
        return $this->orderBy("id", "DESC")
            ->where('organization_id', $organization_id)
            ->get();
    }

    public function storeUser($request, $userData)
    {
        if ($request->organization_id !== $userData->organization_id) {
            return "not found";
        }
        // $users = User::create($request->validated());
        return $this->create($request->validated());
    }

    public function showUser($id)
    {
        $user = $this->where('id', $id)->first();
        return $user;
    }

    public function updateUser($request, $user, $userData)
    {
        // Validate org_id param AND payload
        if ($user->organization_id !== $userData->organization_id || $request->organization_id !== $userData->organization_id) {
            return "not found";
        }
        $updated = $user->update($request->validated());
        if (!$updated) {
            return null;
        }
        return $updated;
    }

    public function deleteUser($user, $userData)
    {
        if ($user->organization_id !== $userData->organization_id) {
            return "not found";
        }
        if (DB::table('task_assignees')->where('assignee_id', $user->id)->exists()) {
            return false;
        }
        if (!$user->delete()) {
            return null;
        }
        return true;
    }
}
