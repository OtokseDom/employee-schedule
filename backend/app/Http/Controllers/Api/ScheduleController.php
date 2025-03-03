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
        $schedules = Schedule::with(['employee:id,name,position,dob', 'event:id,name,description'])->orderBy("id", "DESC")->get();

        return response(compact('schedules'));
    }

    public function store(StoreScheduleRequest $request)
    {
        $data = $request->validated();

        // Check if there's already a schedule with the same date and employee_id
        $existingSchedule = Schedule::where('date', $data['date'])
            ->where('employee_id', $data['employee_id'])
            ->first();

        if ($existingSchedule) {
            return response()->json([
                'message' => 'Schedule already exists for this date and employee.'
            ], 400); // 400 Bad Request
        }

        $schedule = Schedule::create($data);
        // Fetch the schedule with its relations
        $schedules = Schedule::with(['employee:id,name,position,dob', 'event:id,name,description'])
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
        $schedule->load('employee', 'event');
        return new ScheduleResource($schedule);
    }

    public function update(UpdateScheduleRequest $request, Schedule $schedule)
    {
        $data = $request->validated();
        $schedule->update($data);
        // Fetch the updated schedule again with the related models
        $updatedSchedule = Schedule::with(['employee:id,name,position,dob', 'event:id,name,description'])
            ->findOrFail($schedule->id); // Get the schedule by id to include the relations

        return response(new ScheduleResource($updatedSchedule), 200);
    }

    public function destroy(Schedule $schedule)
    {
        $schedule->delete();
        // Fetch the updated schedule again with the related models
        $schedules = Schedule::with(['employee:id,name,position,dob', 'event:id,name,description'])->get(); // Get the schedule by id to include the relations
        return response(ScheduleResource::collection($schedules), 200);
    }

    public function getScheduleByEmployee($employeeId)
    {
        $schedules = Schedule::where('employee_id', $employeeId)
            ->with(['employee:id,name,position,dob', 'event:id,name,description'])
            ->orderBy("id", "ASC")
            ->get();

        return ScheduleResource::collection($schedules);
    }
}