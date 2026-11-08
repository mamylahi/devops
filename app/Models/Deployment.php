<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Représente un déploiement effectué via un pipeline sur un environnement.
 *
 * @property int    $id
 * @property int    $pipeline_id
 * @property int    $environment_id
 * @property string $status         (pending | running | success | failed | rolled_back)
 * @property string|null $commit_hash  Hash du commit déployé
 * @property string|null $triggered_by Identifiant de l'entité ayant déclenché le déploiement
 * @property \Carbon\Carbon|null $started_at
 * @property \Carbon\Carbon|null $finished_at
 * @property string|null $logs        Logs d'exécution
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 */
class Deployment extends Model
{
    use HasFactory;

    protected $fillable = [
        'pipeline_id',
        'environment_id',
        'status',
        'commit_hash',
        'triggered_by',
        'started_at',
        'finished_at',
        'logs',
    ];

    protected $casts = [
        'started_at'  => 'datetime',
        'finished_at' => 'datetime',
    ];

    // ─── Relations ────────────────────────────────────────────────────────────

    public function pipeline(): BelongsTo
    {
        return $this->belongsTo(Pipeline::class);
    }

    public function environment(): BelongsTo
    {
        return $this->belongsTo(Environment::class);
    }
}
