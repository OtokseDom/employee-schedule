<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Http\Requests\StoreCustomerRequest;
use App\Http\Requests\UpdateCustomerRequest;
use App\Http\Resources\CustomerResource;

class CustomerController extends Controller
{
    public function index()
    {
        // $customers = Customer::orderBy("id", "DESC")->paginate(10);
        $customers = Customer::orderBy("id", "DESC")->get();

        return response(compact('customers'));
    }

    public function store(StoreCustomerRequest $request)
    {
        $data = $request->validated();

        $customers = Customer::create($data);
        return response(new CustomerResource($customers), 201);
    }

    public function show(Customer $customer)
    {
        return response(new CustomerResource($customer), 200);
    }

    public function update(UpdateCustomerRequest $request, Customer $customer)
    {
        $data = $request->validated();
        $customer->update($data);

        return new CustomerResource($customer);
    }

    public function destroy(Customer $customer)
    {
        // TODO::validate if used
        $customer->delete();
        return response()->json(['message' => 'Customer successfully deleted'], 200);
    }
}
