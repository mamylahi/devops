<?php

namespace App\Http\Requests\Project;

use Illuminate\Foundation\Http\FormRequest;

class StoreProjectRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'user_id'        => ['required', 'integer', 'exists:users,id'],
            'name'           => ['required', 'string', 'max:255'],
            'description'    => ['nullable', 'string'],
            'status'         => ['required', 'string', 'in:active,archived,pending'],
            'repository_url' => ['nullable', 'url', 'max:500'],
        ];
    }

    public function messages(): array
    {
        return [
            'user_id.required' => 'L\'identifiant utilisateur est obligatoire.',
            'user_id.exists'   => 'L\'utilisateur spécifié n\'existe pas.',
            'name.required'    => 'Le nom du projet est obligatoire.',
            'status.required'  => 'Le statut est obligatoire.',
            'status.in'        => 'Le statut doit être : active, archived ou pending.',
            'repository_url.url' => 'L\'URL du dépôt doit être une URL valide.',
        ];
    }
}
