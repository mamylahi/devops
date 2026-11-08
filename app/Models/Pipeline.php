<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Représente un pipeline CI/CD associé à un projet.
 *
 * @property int    $id
 * @property int    $project_id
 * @property string $name
 * @property string $branch        Branche Git cible (ex: main, develop)
 * @property string $status        (idle | running | success | failed)
 * @property string|null $configuration  Configuration YAML/JSON du pipeline
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 */
class Pipeline extends Model
{
    use HasFactory;

    protected $fillable = [
        'project_id',
        'name',
        'branch',
        'status',
        'configuration',
    ];

    // ─── Relations ────────────────────────────────────────────────────────────

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function deployments(): HasMany
    {
        return $this->hasMany(Deployment::class);
    }
}
