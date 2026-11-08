<?php

namespace App\Http\Requests\Pipeline;

use Illuminate\Foundation\Http\FormRequest;

class StorePipelineRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'project_id'    => ['required', 'integer', 'exists:projects,id'],
            'name'          => ['required', 'string', 'max:255'],
            'branch'        => ['required', 'string', 'max:255'],
            'status'        => ['required', 'string', 'in:idle,running,success,failed'],
            'configuration' => ['nullable', 'string'],
        ];
    }

    public function messages(): array
    {
        return [
            'project_id.required' => 'L\'identifiant du projet est obligatoire.',
            'project_id.exists'   => 'Le projet spécifié n\'existe pas.',
            'name.required'       => 'Le nom du pipeline est obligatoire.',
            'branch.required'     => 'La branche est obligatoire.',
            'status.required'     => 'Le statut est obligatoire.',
            'status.in'           => 'Le statut doit être : idle, running, success ou failed.',
        ];
    }
}
