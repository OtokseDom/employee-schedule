<?php

namespace App\Providers;

use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        if ($this->app->environment('production')) {
            URL::forceScheme('https');
        }

        // Validation for tasks to prevent grandchildren subtasks
        Validator::extend('no_grandchildren', function ($attribute, $value, $parameters, $validator) {
            if (!$value) return true;

            $data = $validator->getData();
            $taskId = $data['id'];

            if ($taskId) {
                $task = \App\Models\Task::find($taskId);

                if ($task instanceof \App\Models\Task && $task->children()->exists()) {
                    return false;
                }
            }

            $parent = \App\Models\Task::find($value);
            if ($parent instanceof \App\Models\Task && $parent->parent_id !== null) {
                return false;
            }

            return true;
        });
    }
}
