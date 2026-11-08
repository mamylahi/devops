<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'             => $this->id,
            'name'           => $this->name,
            'description'    => $this->description,
            'status'         => $this->status,
            'repository_url' => $this->repository_url,
            'owner'          => new UserResource($this->whenLoaded('user')),
            'pipelines'      => PipelineResource::collection($this->whenLoaded('pipelines')),
            'environments'   => EnvironmentResource::collection($this->whenLoaded('environments')),
            'created_at'     => $this->created_at?->toISOString(),
            'updated_at'     => $this->updated_at?->toISOString(),
        ];
    }
}
