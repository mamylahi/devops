<?php

namespace App\Http\Requests\Pipeline;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePipelineRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'project_id'    => ['sometimes', 'integer', 'exists:projects,id'],
            'name'          => ['sometimes', 'string', 'max:255'],
            'branch'        => ['sometimes', 'string', 'max:255'],
            'status'        => ['sometimes', 'string', 'in:idle,running,success,failed'],
            'configuration' => ['nullable', 'string'],
        ];
    }

    public function messages(): array
    {
        return [
            'project_id.exists' => 'Le projet spécifié n\'existe pas.',
            'status.in'         => 'Le statut doit être : idle, running, success ou failed.',
        ];
    }
}
