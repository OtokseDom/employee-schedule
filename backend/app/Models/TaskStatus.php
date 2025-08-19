<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TaskStatus extends Model
{
    use HasFactory;

    protected $fillable = [
        'organization_id',
        'name',
        'description',
        'color',
    ];

    // Relationship with Organization
    public function organization()
    {
        return $this->belongsTo(Organization::class);
    }

    /* -------------------------------------------------------------------------- */
    /*                         Controller Logic Functions                         */
    /* -------------------------------------------------------------------------- */
    public function getTaskStatuses($organization_id)
    {
        return $this->orderBy("id", "DESC")->where('organization_id', $organization_id)->get();
    }

    public function storeTaskStatus($request)
    {
        return $this->create($request->validated());
    }

    public function showTaskStatus($organization_id, $status_id)
    {
        return $this->where('id', $status_id)
            ->where('organization_id', $organization_id)
            ->first();
    }

    public function updateTaskStatus($request, $status)
    {
        $status->update($request->validated());
        return $status;
    }

    public function deleteTaskStatus($status, $organization_id)
    {
        if (!$status->delete()) {
            return null;
        }
        return $this->where('organization_id', $organization_id)->orderBy("id", "DESC")->get();
    }
    // TODO: Status master page with status check
}
