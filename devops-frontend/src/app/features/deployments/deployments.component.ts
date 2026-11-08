import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { DeploymentService } from '../../services/deployment.service';
import { PipelineService } from '../../services/pipeline.service';
import { EnvironmentService } from '../../services/environment.service';
import { ToastService } from '../../core/services/toast.service';
import { Deployment } from '../../models/deployment.model';
import { Pipeline } from '../../models/pipeline.model';
import { Environment } from '../../models/environment.model';
import { PaginationMeta } from '../../models/api-response.model';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';
import { ConfirmModalComponent } from '../../shared/components/confirm-modal/confirm-modal.component';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';

@Component({
  selector: 'app-deployments',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, StatusBadgeComponent, ConfirmModalComponent, PaginationComponent],
  template: `
    <div class="d-flex align-items-center justify-content-between mb-4">
      <div>
        <h4 class="fw-bold mb-1">Déploiements</h4>
        <p class="text-muted mb-0" style="font-size:.9rem">Historique et gestion des déploiements</p>
      </div>
      <button class="btn btn-primary" (click)="openForm()">
        <i class="bi bi-plus-lg me-1"></i> Nouveau déploiement
      </button>
    </div>

    <div class="data-table">
      <div class="table-header">
        <h5><i class="bi bi-rocket-takeoff me-2"></i>Liste ({{ meta()?.total ?? 0 }})</h5>
      </div>

      @if (loading()) {
        <div class="loading-overlay"><div class="spinner-border text-primary"></div></div>
      } @else if (deployments().length === 0) {
        <div class="empty-state">
          <i class="bi bi-rocket-takeoff d-block"></i>
          <p>Aucun déploiement trouvé.</p>
        </div>
      } @else {
        <div class="table-responsive">
          <table class="table table-hover mb-0">
            <thead>
              <tr><th>#</th><th>Pipeline</th><th>Environnement</th><th>Commit</th><th>Déclenché par</th><th>Statut</th><th>Créé le</th><th></th></tr>
            </thead>
            <tbody>
              @for (d of deployments(); track d.id) {
                <tr>
                  <td class="text-muted">{{ d.id }}</td>
                  <td class="fw-semibold">{{ d.pipeline?.name ?? '—' }}</td>
                  <td><span class="badge bg-light text-dark border">{{ d.environment?.name ?? '—' }}</span></td>
                  <td>
                    @if (d.commit_hash) {
                      <code style="font-size:.78rem">{{ d.commit_hash | slice:0:8 }}</code>
                    } @else { <span class="text-muted">—</span> }
                  </td>
                  <td>{{ d.triggered_by ?? '—' }}</td>
                  <td><app-status-badge [status]="d.status" /></td>
                  <td class="text-muted" style="font-size:.82rem">{{ d.created_at | date:'dd/MM/yyyy HH:mm' }}</td>
                  <td>
                    <div class="d-flex gap-1">
                      <button class="btn btn-outline-primary btn-action" (click)="openForm(d)"><i class="bi bi-pencil"></i></button>
                      <button class="btn btn-outline-danger btn-action" (click)="askDelete(d)"><i class="bi bi-trash3"></i></button>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
        <app-pagination [meta]="meta()" (pageChange)="load($event)" />
      }
    </div>

    @if (showForm()) {
      <div class="modal fade show d-block" tabindex="-1" style="background:rgba(0,0,0,.45)">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content border-0 shadow">
            <div class="modal-header">
              <h5 class="modal-title fw-bold">{{ editId() ? 'Modifier' : 'Créer' }} un déploiement</h5>
              <button type="button" class="btn-close" (click)="closeForm()"></button>
            </div>
            <div class="modal-body form-card shadow-none p-4">
              <form [formGroup]="form" (ngSubmit)="submit()">
                <div class="row g-3">
                  <div class="col-12">
                    <label class="form-label">Pipeline <span class="text-danger">*</span></label>
                    <select formControlName="pipeline_id" class="form-select" [class.is-invalid]="invalid('pipeline_id')">
                      <option value="">-- Choisir --</option>
                      @for (p of pipelines(); track p.id) {
                        <option [value]="p.id">{{ p.name }} ({{ p.branch }})</option>
                      }
                    </select>
                    <div class="invalid-feedback">{{ fieldError('pipeline_id') }}</div>
                  </div>
                  <div class="col-12">
                    <label class="form-label">Environnement <span class="text-danger">*</span></label>
                    <select formControlName="environment_id" class="form-select" [class.is-invalid]="invalid('environment_id')">
                      <option value="">-- Choisir --</option>
                      @for (e of environments(); track e.id) {
                        <option [value]="e.id">{{ e.name }} — {{ e.project?.name }}</option>
                      }
                    </select>
                    <div class="invalid-feedback">{{ fieldError('environment_id') }}</div>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Statut <span class="text-danger">*</span></label>
                    <select formControlName="status" class="form-select">
                      <option value="pending">Pending</option>
                      <option value="running">Running</option>
                      <option value="success">Success</option>
                      <option value="failed">Failed</option>
                      <option value="rolled_back">Rolled back</option>
                    </select>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Hash du commit</label>
                    <input formControlName="commit_hash" class="form-control" placeholder="abc123...">
                  </div>
                  <div class="col-12">
                    <label class="form-label">Déclenché par</label>
                    <input formControlName="triggered_by" class="form-control" placeholder="ci-bot, alice...">
                  </div>
                </div>
                <div class="d-flex justify-content-end gap-2 mt-4">
                  <button type="button" class="btn btn-outline-secondary" (click)="closeForm()">Annuler</button>
                  <button type="submit" class="btn btn-primary" [disabled]="saving()">
                    @if (saving()) { <span class="spinner-border spinner-border-sm me-1"></span> }
                    {{ editId() ? 'Enregistrer' : 'Créer' }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    }

    <app-confirm-modal [visible]="showConfirm()"
      message="Supprimer ce déploiement ?"
      (confirmed)="confirmDelete()" (cancelled)="showConfirm.set(false)" />
  `
})
export class DeploymentsComponent implements OnInit {
  pageTitle = 'Déploiements';
  private svc   = inject(DeploymentService);
  private plSvc = inject(PipelineService);
  private envSvc = inject(EnvironmentService);
  private toast = inject(ToastService);
  private fb    = inject(FormBuilder);

  deployments  = signal<Deployment[]>([]);
  pipelines    = signal<Pipeline[]>([]);
  environments = signal<Environment[]>([]);
  meta         = signal<PaginationMeta | undefined>(undefined);
  loading      = signal(true);
  saving       = signal(false);
  showForm     = signal(false);
  showConfirm  = signal(false);
  editId       = signal<number | null>(null);
  deleteTarget = signal<Deployment | null>(null);
  serverErrors: Record<string, string[]> = {};

  form = this.fb.group({
    pipeline_id:    ['', Validators.required],
    environment_id: ['', Validators.required],
    status:         ['pending', Validators.required],
    commit_hash:    [''],
    triggered_by:   ['']
  });

  ngOnInit(): void {
    this.load(1);
    this.plSvc.getAll().subscribe(r => this.pipelines.set(r.data.data));
    this.envSvc.getAll().subscribe(r => this.environments.set(r.data.data));
  }

  load(page: number): void {
    this.loading.set(true);
    this.svc.getAll(page).subscribe({
      next: (res) => { this.deployments.set(res.data.data); this.meta.set(res.meta); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  openForm(d?: Deployment): void {
    this.serverErrors = {};
    this.editId.set(d?.id ?? null);
    this.form.reset({ status: 'pending' });
    if (d) this.form.patchValue({
      ...d,
      pipeline_id: d.pipeline?.id ?? (d as any).pipeline_id,
      environment_id: d.environment?.id ?? (d as any).environment_id
    });
    this.showForm.set(true);
  }

  closeForm(): void { this.showForm.set(false); }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving.set(true);
    const data = {
      ...this.form.value,
      pipeline_id: Number(this.form.value.pipeline_id),
      environment_id: Number(this.form.value.environment_id)
    } as any;
    const req = this.editId() ? this.svc.update(this.editId()!, data) : this.svc.create(data);
    req.subscribe({
      next: () => { this.toast.success(this.editId() ? 'Déploiement mis à jour.' : 'Déploiement créé.'); this.closeForm(); this.load(1); this.saving.set(false); },
      error: (err) => { this.saving.set(false); if (err.status === 422) this.serverErrors = err.error.errors ?? {}; }
    });
  }

  askDelete(d: Deployment): void { this.deleteTarget.set(d); this.showConfirm.set(true); }
  confirmDelete(): void {
    const id = this.deleteTarget()?.id;
    if (!id) return;
    this.svc.delete(id).subscribe({ next: () => { this.toast.success('Déploiement supprimé.'); this.showConfirm.set(false); this.load(1); }, error: () => this.showConfirm.set(false) });
  }

  invalid(f: string): boolean { const c = this.form.get(f); return (!!c?.invalid && c?.touched) || !!this.serverErrors[f]; }
  fieldError(f: string): string {
    if (this.serverErrors[f]) return this.serverErrors[f][0];
    if (this.form.get(f)?.hasError('required')) return 'Ce champ est obligatoire.';
    return '';
  }
}
