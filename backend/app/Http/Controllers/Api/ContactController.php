<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use App\Http\Requests\StoreContactRequest;
use App\Http\Requests\UpdateContactRequest;
use App\Http\Resources\ContactResource;

class ContactController extends Controller
{
    public function index()
    {
        // $contacts = Contact::orderBy("id", "DESC")->paginate(10);
        $contacts = Contact::orderBy("id", "DESC")->get();
        return response(compact('contacts'));
    }

    public function store(StoreContactRequest $request)
    {
        $data = $request->validated();
        $contacts = Contact::create($data);
        return response(new ContactResource($contacts), 201);
    }

    public function show(Contact $contact)
    {
        return new ContactResource($contact);
    }

    public function update(UpdateContactRequest $request, Contact $contact)
    {
        $data = $request->validated();
        $contact->update($data);
        return new ContactResource($contact);
    }

    public function destroy(Contact $contact)
    {
        // TODO::validate if used
        $contact->delete();
        return response()->json(['message' => 'Contact successfully deleted'], 200);
    }
}
