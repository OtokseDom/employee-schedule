<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Support\Facades\DB;

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
        $userDetails = DB::table('users')->where('id', $user->id)->first();
        $assignedTasks = DB::table('tasks')->where('assignee_id', $user->id)->get();

        return response()->json([
            'user' => $userDetails,
            'assigned_tasks' => $assignedTasks
        ]);
    }

    public function update(UpdateUserRequest $request, User $user)
    {
        $data = $request->validated();
        $user->update($data);
        return new UserResource($user);
    }

    public function destroy(User $user)
    {
        // Check if the user has existing tasks assigned
        $hasTasks = DB::table('tasks')->where('assignee_id', $user->id)->exists();

        if ($hasTasks) {
            return response()->json(['message' => 'User cannot be deleted because they have assigned tasks.'], 400);
        }

        $user->delete();
        // Fetch the updated user again
        $users = User::orderBy("id", "DESC")->get();
        return response(UserResource::collection($users), 200);
    }
}

// TODO: Reports

// 📊 Dashboard Widgets (Real-time Overview)
// For Managers:
// 🔹 Task Completion % (per employee & team) – Progress bars
// 🔹 Top 5 Employees This Week – Based on speed & accuracy
// 🔹 Overdue Tasks Heatmap – By project/team
// 🔹 Active vs Completed Tasks Pie Chart
// 🔹 Daily Task Activity Timeline – See peaks and idle periods
// 🔹 Tasks per Department – Stacked bar chart

// For Employees:
// ✅ My Completed Tasks (Weekly)
// 🧠 Upcoming Deadlines (Next 7 Days)
// ⏰ Avg Time I Spend on Tasks
// 🚥 My Pending / Overdue Tasks

// 📁 Exportable Reports (Weekly/Monthly)
// 📌 Employee Performance Summary
// 📌 Department Task Distribution & Efficiency
// 📌 Late Tasks Log (with reasons if tagged)
// 📌 Time Tracking Report (Per Task, Employee, Project)
// 📌 Workload Forecast Report – Helps plan upcoming weeks
// 📌 Productivity Trends Over Time