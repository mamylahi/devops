<?php

namespace App\Http\Requests\Deployment;

use Illuminate\Foundation\Http\FormRequest;

class StoreDeploymentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'pipeline_id'    => ['required', 'integer', 'exists:pipelines,id'],
            'environment_id' => ['required', 'integer', 'exists:environments,id'],
            'status'         => ['required', 'string', 'in:pending,running,success,failed,rolled_back'],
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
            'pipeline_id.required'    => 'L\'identifiant du pipeline est obligatoire.',
            'pipeline_id.exists'      => 'Le pipeline spécifié n\'existe pas.',
            'environment_id.required' => 'L\'identifiant de l\'environnement est obligatoire.',
            'environment_id.exists'   => 'L\'environnement spécifié n\'existe pas.',
            'status.required'         => 'Le statut est obligatoire.',
            'status.in'               => 'Le statut doit être : pending, running, success, failed ou rolled_back.',
            'finished_at.after_or_equal' => 'La date de fin doit être après ou égale à la date de début.',
        ];
    }
}
