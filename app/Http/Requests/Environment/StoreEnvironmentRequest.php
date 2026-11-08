<?php

namespace App\Http\Requests\Environment;

use Illuminate\Foundation\Http\FormRequest;

class StoreEnvironmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'project_id' => ['required', 'integer', 'exists:projects,id'],
            'name'       => ['required', 'string', 'in:development,staging,production'],
            'url'        => ['nullable', 'url', 'max:500'],
            'status'     => ['required', 'string', 'in:active,inactive,deploying'],
            'variables'  => ['nullable', 'array'],
        ];
    }

    public function messages(): array
    {
        return [
            'project_id.required' => 'L\'identifiant du projet est obligatoire.',
            'project_id.exists'   => 'Le projet spécifié n\'existe pas.',
            'name.required'       => 'Le nom de l\'environnement est obligatoire.',
            'name.in'             => 'L\'environnement doit être : development, staging ou production.',
            'url.url'             => 'L\'URL doit être valide.',
            'status.required'     => 'Le statut est obligatoire.',
            'status.in'           => 'Le statut doit être : active, inactive ou deploying.',
        ];
    }
}
