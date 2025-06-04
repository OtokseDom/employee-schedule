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
        $schedules = Schedule::with(['assignee:id,name,position,dob,role,email'])
            ->orderBy("id", "DESC")->get();
        return response(compact('schedules'));
    }

    public function store(StoreScheduleRequest $request)
    {
        $data = $request->validated();
        // Check for duplicate schedule (title, start_date, assignee)
        $existingSchedule = Schedule::where('title', $data['title'])
            ->where('start_date', $data['start_date'])
            ->where('assignee', $data['assignee'])
            ->first();
        if ($existingSchedule) {
            return response()->json([
                'message' => 'Schedule already exists for this title, start date, and assignee.'
            ], 400);
        }
        $schedule = Schedule::create($data);
        $schedules = Schedule::with(['assignee:id,name,position,dob,role,email'])
            ->findOrFail($schedule->id);
        return response(new ScheduleResource($schedules), 201);
    }

    public function show(Schedule $schedule)
    {
        $schedule->load('assignee');
        return new ScheduleResource($schedule);
    }

    public function update(UpdateScheduleRequest $request, Schedule $schedule)
    {
        $data = $request->validated();
        $schedule->update($data);
        $updatedSchedule = Schedule::with(['assignee:id,name,position,dob,role,email'])
            ->findOrFail($schedule->id);
        return response(new ScheduleResource($updatedSchedule), 200);
    }

    public function destroy(Schedule $schedule)
    {
        $assigneeId = $schedule->assignee;
        $schedule->delete();
        $schedules = Schedule::where('assignee', $assigneeId)
            ->with(['assignee:id,name,position,dob,role,email'])
            ->orderBy("id", "ASC")
            ->get();
        return response(ScheduleResource::collection($schedules), 200);
    }

    public function getScheduleByUser($userId)
    {
        $schedules = Schedule::where('assignee', $userId)
            ->with(['assignee:id,name,position,dob,role,email'])
            ->orderBy("id", "ASC")
            ->get();
        return response(compact('schedules'));
    }
}