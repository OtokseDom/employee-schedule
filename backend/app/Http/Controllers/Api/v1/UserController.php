<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
   protected User $user;
   protected $userData;
   public function __construct(User $user)
   {
      $this->user = $user;
      $this->userData = Auth::user();
   }
   public function index()
   {
      $users = $this->user->getUsers($this->userData->organization_id);
      return apiResponse($users, 'Users fetched successfully');
   }

   public function store(StoreUserRequest $request)
   {
      $user = $this->user->storeUser($request);
      return apiResponse($user, 'User created successfully', true, 201);
   }

   public function show($id) //changed User $user to $id to prevent laravel from throwing 404 when no user found instantly after the query
   {
      $user = $this->user->showUser($id);
      if (!$user || $user->organization_id !== $this->userData->organization_id)
         return apiResponse(null, 'User not found within your organization', false, 404);
      return apiResponse($user, 'User details fetched successfully');
   }

   public function update(UpdateUserRequest $request, User $user)
   {
      $details = $this->user->updateUser($request, $user);
      return apiResponse($details, 'User updated successfully');
   }

   public function destroy(User $user)
   {
      $users = $this->user->deleteUser($user, $this->userData->organization_id);
      if (!$users)
         return apiResponse('', 'User cannot be deleted because they have assigned tasks.', false, 400);
      return apiResponse(UserResource::collection($users), 'User deleted successfully');
   }
}
