<?php

namespace App\Http\Requests\Environment;

use Illuminate\Foundation\Http\FormRequest;

class UpdateEnvironmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'project_id' => ['sometimes', 'integer', 'exists:projects,id'],
            'name'       => ['sometimes', 'string', 'in:development,staging,production'],
            'url'        => ['nullable', 'url', 'max:500'],
            'status'     => ['sometimes', 'string', 'in:active,inactive,deploying'],
            'variables'  => ['nullable', 'array'],
        ];
    }

    public function messages(): array
    {
        return [
            'project_id.exists' => 'Le projet spécifié n\'existe pas.',
            'name.in'           => 'L\'environnement doit être : development, staging ou production.',
            'url.url'           => 'L\'URL doit être valide.',
            'status.in'         => 'Le statut doit être : active, inactive ou deploying.',
        ];
    }
}
