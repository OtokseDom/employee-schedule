<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePerformanceReportRequest;
use App\Http\Requests\UpdatePerformanceReportRequest;
use App\Http\Resources\PerformanceReportResource;
use App\Models\PerformanceReport;

class PerformanceReportController extends Controller
{
    public function index()
    {
        $performanceReports = PerformanceReport::with(['user:id,name,email'])->orderBy('id', 'DESC')->get();
        return PerformanceReportResource::collection($performanceReports);
    }

    public function store(StorePerformanceReportRequest $request)
    {
        $performanceReport = PerformanceReport::create($request->validated());
        $performanceReport->load(['user:id,name,email']);
        return new PerformanceReportResource($performanceReport);
    }

    public function show(PerformanceReport $performanceReport)
    {
        $performanceReport->load(['user:id,name,email']);
        return new PerformanceReportResource($performanceReport);
    }

    public function update(UpdatePerformanceReportRequest $request, PerformanceReport $performanceReport)
    {
        $performanceReport->update($request->validated());
        $performanceReport->load(['user:id,name,email']);
        return new PerformanceReportResource($performanceReport);
    }

    public function destroy(PerformanceReport $performanceReport)
    {
        $performanceReport->delete();
        return response()->json(['message' => 'Performance Report successfully deleted'], 200);
    }
}