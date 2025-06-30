<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Models\Task;
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
      $assignedTasks = Task::with(['assignee:id,name,email,role,position', 'category'])->orderBy('id', 'DESC')->where('assignee_id', $user->id)->get();

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

/*
🔹 Per User Insights (User Profile Page)

1. ✅ Task Status Breakdown
   - Completed / Cancelled / In Progress, etc.
   - Visualization: Pie chart or donut chart

2. ✅ Performance Over Time
   - Track performance_rating weekly/monthly
   - Visualization: Line graph (x: date, y: rating)

3. Time Estimate vs Time Taken
   - Compare estimated vs actual time
   - Visualization: Bar graph (2 bars per task)

4. Tasks with Delays
   - % of delayed tasks, total delay hours
   - Visualization: KPI cards + delay reason table

5. ✅ Task Volume Over Time
   - Task count per month
   - Visualization: Bar chart or area chart

6. ✅ Average Rating Per Category
   - Performance by task type (e.g. Bug, Feature)
   - Visualization: Radar chart or grouped bar chart


🔸 Overall Dashboard Insights

1. Team-Wide Task Status Distribution
   - All tasks by status
   - Visualization: Pie chart or stacked bar by user

2. Top Performers
   - Average performance_rating (ranked)
   - Visualization: Leaderboard table

3. Avg. Delay Per Category
   - Visualization: Horizontal bar chart

4. Task Load Distribution
   - Tasks assigned per user
   - Visualization: Horizontal bar chart

5. Time Estimate vs Time Taken (Overall)
   - Spot over/underestimations
   - Visualization: Line or bar graph (averages)

6. Daily/Weekly Task Activity
   - Number of tasks worked on per day
   - Visualization: Heatmap or bar chart

7. Performance Trends (All Users)
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