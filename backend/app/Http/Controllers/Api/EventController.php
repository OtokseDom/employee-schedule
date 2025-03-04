<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreEventRequest;
use App\Http\Requests\UpdateEventRequest;
use App\Http\Resources\EventResource;
use App\Models\Event;

class EventController extends Controller
{
    public function index()
    {
        // $events = Event::orderBy("id", "DESC")->paginate(10);
        $events = Event::orderBy("name", "ASC")->get();

        return response(compact('events'));
    }

    public function store(StoreEventRequest $request)
    {
        $data = $request->validated();
        $events = Event::create($data);
        return response(new EventResource($events), 201);
    }

    public function show(Event $event)
    {
        return new EventResource($event);
    }

    public function update(UpdateEventRequest $request, Event $event)
    {
        $data = $request->validated();
        $event->update($data);

        return new EventResource($event);
    }

    public function destroy(Event $event)
    {
        $event->delete();
        // Fetch the updated event again
        $events = Event::orderBy("name", "ASC")->get();
        return response(EventResource::collection($events), 200);
    }
}
