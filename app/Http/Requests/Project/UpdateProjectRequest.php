<?php

namespace App\Http\Requests\Project;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProjectRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'user_id'        => ['sometimes', 'integer', 'exists:users,id'],
            'name'           => ['sometimes', 'string', 'max:255'],
            'description'    => ['nullable', 'string'],
            'status'         => ['sometimes', 'string', 'in:active,archived,pending'],
            'repository_url' => ['nullable', 'url', 'max:500'],
        ];
    }

    public function messages(): array
    {
        return [
            'user_id.exists'     => 'L\'utilisateur spécifié n\'existe pas.',
            'status.in'          => 'Le statut doit être : active, archived ou pending.',
            'repository_url.url' => 'L\'URL du dépôt doit être une URL valide.',
        ];
    }
}
