<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreEmployeeRequest;
use App\Http\Requests\UpdateEmployeeRequest;
use App\Http\Resources\EmployeeResource;
use App\Models\Employee;

class EmployeeController extends Controller
{
    public function index()
    {
        // $employees = Employee::orderBy("id", "DESC")->paginate(10);
        $employees = Employee::orderBy("id", "DESC")->get();

        return response(compact('employees'));
    }

    public function store(StoreEmployeeRequest $request)
    {
        $data = $request->validated();
        $employees = Employee::create($data);
        return response(new EmployeeResource($employees), 201);
    }

    public function show(Employee $employee)
    {
        return new EmployeeResource($employee);
    }

    public function update(UpdateEmployeeRequest $request, Employee $employee)
    {
        $data = $request->validated();
        $employee->update($data);

        return new EmployeeResource($employee);
    }

    public function destroy(Employee $employee)
    {
        $employee->delete();
        return response()->json(['message' => 'Employee successfully deleted'], 200);
    }
}
