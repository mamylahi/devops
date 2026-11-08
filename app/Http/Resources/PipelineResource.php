<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PipelineResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'            => $this->id,
            'name'          => $this->name,
            'branch'        => $this->branch,
            'status'        => $this->status,
            'configuration' => $this->configuration,
            'project'       => new ProjectResource($this->whenLoaded('project')),
            'deployments'   => DeploymentResource::collection($this->whenLoaded('deployments')),
            'created_at'    => $this->created_at?->toISOString(),
            'updated_at'    => $this->updated_at?->toISOString(),
        ];
    }
}
