<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Models\Task;
use App\Models\User;
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

      $assignedTasks = Task::with(['assignee:id,name,email,role,position', 'category'])->orderBy('id', 'DESC')->where('assignee_id', $id)->get();

      $data = [
         'user' => $userDetails,
         'assigned_tasks' => $assignedTasks
      ];
      return apiResponse($data, 'User details fetched successfully');
      // return response()->json([
      //    'user' => $userDetails,
      //    'assigned_tasks' => $assignedTasks
      // ]);
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

// TODO: Reports

/*
🔹 Per User Insights (User Profile Page)

1. ✅ Task Status Breakdown
   - Completed / Cancelled / In Progress, etc.
   - Visualization: Pie chart or donut chart

2. ✅ Performance Over Time
   - Track performance_rating weekly/monthly
   - Visualization: Line graph (x: date, y: rating)

3. ✅ Time Estimate vs Time Taken
   - Compare estimated vs actual time
   - Visualization: Bar graph (2 bars per task)

4. ❌ Tasks with Delays
   - % of delayed tasks, total delay hours
   - Visualization: KPI cards + delay reason table

5. ✅ Task Volume Over Time
   - Task count per month
   - Visualization: Bar chart or area chart

6. ✅ Average Rating Per Category
   - Performance by task type (e.g. Bug, Feature)
   - Visualization: Radar chart or grouped bar chart


🔸 Overall Dashboard Insights

1. ✅ Team-Wide Task Status Distribution
   - All tasks by status
   - Visualization: Pie chart or stacked bar by user

2. ✅ Top Performers
   - Average performance_rating (ranked)
   - Visualization: Leaderboard table

3. ❌ Avg. Delay Per Category
   - Visualization: Horizontal bar chart

4. ✅ Task Load Distribution
   - Tasks assigned per user
   - Visualization: Horizontal bar chart

5. ✅ Task overruns and underruns (Overall)
   - Spot over/underestimations
   - Visualization: Line or bar graph (averages)

6. ❌ Daily/Weekly Task Activity
   - Number of tasks worked on per day
   - Visualization: Heatmap or bar chart

7. Performance Trends (All Users)x
   - Average performance over time
   - Visualization: Line chart


Bonus Ideas:
- Add filters (user, category, status, date)
- Add CSV export options

📁 Exportable Reports (Filter by User, Date, Category, Status)
📌 Employee Performance Summary
📌 Overall Report
📌 Workload Forecast Report – Helps plan upcoming weeks
*/