<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DeploymentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'             => $this->id,
            'status'         => $this->status,
            'commit_hash'    => $this->commit_hash,
            'triggered_by'   => $this->triggered_by,
            'started_at'     => $this->started_at?->toISOString(),
            'finished_at'    => $this->finished_at?->toISOString(),
            'logs'           => $this->logs,
            'pipeline'       => new PipelineResource($this->whenLoaded('pipeline')),
            'environment'    => new EnvironmentResource($this->whenLoaded('environment')),
            'created_at'     => $this->created_at?->toISOString(),
            'updated_at'     => $this->updated_at?->toISOString(),
        ];
    }
}
