<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;

class UserController extends Controller
{
    public function index()
    {
        // $users = User::orderBy("id", "DESC")->paginate(10);
        $users = User::orderBy("id", "DESC")->get();

        return response(compact('users'));
    }

    public function store(StoreUserRequest $request)
    {
        $data = $request->validated();
        $users = User::create($data);
        return response(new UserResource($users), 201);
    }

    public function show(User $user)
    {
        return new UserResource($user);
    }

    public function update(UpdateUserRequest $request, User $user)
    {
        $data = $request->validated();
        $user->update($data);

        return new UserResource($user);
    }

    public function destroy(User $user)
    {
        // TODO: validate delete user
        $user->delete();
        // Fetch the updated user again
        $users = User::orderBy("id", "DESC")->get();
        return response(UserResource::collection($users), 200);
    }
}