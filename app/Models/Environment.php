<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Représente un environnement de déploiement (dev, staging, production…).
 *
 * @property int    $id
 * @property int    $project_id
 * @property string $name          (development | staging | production)
 * @property string $url           URL de l'environnement
 * @property string $status        (active | inactive | deploying)
 * @property array|null $variables Variables d'environnement (stockées en JSON)
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 */
class Environment extends Model
{
    use HasFactory;

    protected $fillable = [
        'project_id',
        'name',
        'url',
        'status',
        'variables',
    ];

    protected $casts = [
        'variables' => 'array',
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
