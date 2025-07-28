<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Models\Task;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class UserController extends Controller
{
   public function index()
   {
      // $users = User::orderBy("id", "DESC")->paginate(10);
      $users = User::orderBy("id", "DESC")
         ->where('organization_id', Auth::user()->organization_id)
         ->get();

      return apiResponse($users, 'Users fetched successfully');
      // return response(compact('users'));
   }

   public function store(StoreUserRequest $request)
   {
      $data = $request->validated();

      $users = User::create($data);

      return apiResponse(new UserResource($users), 'User created successfully', true, 201);
      // return response(new UserResource($users), 201);
   }

   public function show($id) //changed User $user to $id to prevent laravel from throwing 404 when no user found instantly after the query
   {
      $userDetails = DB::table('users')->where('id', $id)->first();
      // Return API response when no user found
      if (!$userDetails || $userDetails->organization_id !== Auth::user()->organization_id)
         return apiResponse(null, 'User not found within your organization', false, 404);

      $data = [
         'user' => $userDetails,
      ];
      return apiResponse($data, 'User details fetched successfully');
   }

   public function update(UpdateUserRequest $request, User $user)
   {
      $data = $request->validated();
      $user->update($data);
      return apiResponse(new UserResource($user), 'User updated successfully');
      // return new UserResource($user);
   }

   public function destroy(User $user)
   {
      // Check if the user has existing tasks assigned
      $hasTasks = DB::table('tasks')->where('assignee_id', $user->id)->exists();

      if ($hasTasks) {
         return apiResponse('', 'User cannot be deleted because they have assigned tasks.', false, 400);
      }

      $user->delete();
      // Fetch the updated user again
      $users = User::orderBy("id", "DESC")->get();
      return apiResponse(UserResource::collection($users), 'User deleted successfully');
      // return response(UserResource::collection($users), 200);
   }
}
