<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreScheduleRequest;
use App\Http\Requests\UpdateScheduleRequest;
use App\Http\Resources\ScheduleResource;
use App\Http\Resources\ScheduleByEmployeeResource;
use App\Models\Schedule;

class ScheduleController extends Controller
{
    public function index()
    {
        // $schedules = Schedule::orderBy("id", "DESC")->paginate(10);
        $schedules = Schedule::with(['user:id,name,position,dob,role,email', 'event:id,name,description'])->orderBy("id", "DESC")->get();

        return response(compact('schedules'));
    }

    public function store(StoreScheduleRequest $request)
    {
        $data = $request->validated();

        // Check if there's already a schedule with the same date and user_id
        $existingSchedule = Schedule::where('date', $data['date'])
            ->where('user_id', $data['user_id'])
            ->first();

        if ($existingSchedule) {
            return response()->json([
                'message' => 'Schedule already exists for this date and user.'
            ], 400); // 400 Bad Request
        }

        $schedule = Schedule::create($data);
        // Fetch the schedule with its relations
        $schedules = Schedule::with(['user:id,name,position,dob,role,email', 'event:id,name,description'])
            ->findOrFail($schedule->id);

        // $data = [
        //     "action"=> "Added new schedule",
        //     "newSchedule"=>$schedule->id,
        //     "data"=>new ScheduleResource($schedules),
        // ];

        return response(new ScheduleResource($schedules), 201);
    }

    public function show(Schedule $schedule)
    {
        // Eager load relationships. This is retrieved from ScheduleResource.
        $schedule->load('user', 'event');
        return new ScheduleResource($schedule);
    }

    public function update(UpdateScheduleRequest $request, Schedule $schedule)
    {
        $data = $request->validated();
        $schedule->update($data);
        // Fetch the updated schedule again with the related models
        $updatedSchedule = Schedule::with(['user:id,name,position,dob,role,email', 'event:id,name,description'])
            ->findOrFail($schedule->id); // Get the schedule by id to include the relations

        return response(new ScheduleResource($updatedSchedule), 200);
    }

    public function destroy(Schedule $schedule)
    {
        $schedule->delete();
        // Fetch the updated schedule again with the related models. Select schedule of currently selected user

        $employeeId = $schedule->user_id; // Get the user ID before deleting
        $schedules = Schedule::where('user_id', $employeeId)
            ->with(['user:id,name,position,dob,role,email', 'event:id,name,description'])
            ->orderBy("id", "ASC")
            ->get();
        return response(ScheduleResource::collection($schedules), 200);
    }

    public function getScheduleByUser($userId)
    {
        $schedules = Schedule::where('user_id', $userId)
            ->with(['user:id,name,position,dob,role,email', 'event:id,name,description'])
            ->orderBy("id", "ASC")
            ->get();

        return ScheduleResource::collection($schedules);
    }
}