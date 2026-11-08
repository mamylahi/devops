<?php

namespace App\Http\Requests\Deployment;

use Illuminate\Foundation\Http\FormRequest;

class UpdateDeploymentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'pipeline_id'    => ['sometimes', 'integer', 'exists:pipelines,id'],
            'environment_id' => ['sometimes', 'integer', 'exists:environments,id'],
            'status'         => ['sometimes', 'string', 'in:pending,running,success,failed,rolled_back'],
            'commit_hash'    => ['nullable', 'string', 'max:40'],
            'triggered_by'   => ['nullable', 'string', 'max:255'],
            'started_at'     => ['nullable', 'date'],
            'finished_at'    => ['nullable', 'date', 'after_or_equal:started_at'],
            'logs'           => ['nullable', 'string'],
        ];
    }

    public function messages(): array
    {
        return [
            'pipeline_id.exists'      => 'Le pipeline spécifié n\'existe pas.',
            'environment_id.exists'   => 'L\'environnement spécifié n\'existe pas.',
            'status.in'               => 'Le statut doit être : pending, running, success, failed ou rolled_back.',
            'finished_at.after_or_equal' => 'La date de fin doit être après ou égale à la date de début.',
        ];
    }
}
