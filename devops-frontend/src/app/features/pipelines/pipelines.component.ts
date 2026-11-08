import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { PipelineService } from '../../services/pipeline.service';
import { ProjectService } from '../../services/project.service';
import { ToastService } from '../../core/services/toast.service';
import { Pipeline } from '../../models/pipeline.model';
import { Project } from '../../models/project.model';
import { PaginationMeta } from '../../models/api-response.model';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';
import { ConfirmModalComponent } from '../../shared/components/confirm-modal/confirm-modal.component';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';

@Component({
  selector: 'app-pipelines',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, StatusBadgeComponent, ConfirmModalComponent, PaginationComponent],
  template: `
    <div class="d-flex align-items-center justify-content-between mb-4">
      <div>
        <h4 class="fw-bold mb-1">Pipelines CI/CD</h4>
        <p class="text-muted mb-0" style="font-size:.9rem">Gérer les pipelines d'intégration continue</p>
      </div>
      <button class="btn btn-primary" (click)="openForm()">
        <i class="bi bi-plus-lg me-1"></i> Nouveau pipeline
      </button>
    </div>

    <div class="data-table">
      <div class="table-header">
        <h5><i class="bi bi-diagram-3 me-2"></i>Liste ({{ meta()?.total ?? 0 }})</h5>
      </div>

      @if (loading()) {
        <div class="loading-overlay"><div class="spinner-border text-primary"></div></div>
      } @else if (pipelines().length === 0) {
        <div class="empty-state">
          <i class="bi bi-diagram-3 d-block"></i>
          <p>Aucun pipeline trouvé.</p>
        </div>
      } @else {
        <div class="table-responsive">
          <table class="table table-hover mb-0">
            <thead>
              <tr><th>#</th><th>Nom</th><th>Projet</th><th>Branche</th><th>Statut</th><th>Créé le</th><th></th></tr>
            </thead>
            <tbody>
              @for (pl of pipelines(); track pl.id) {
                <tr>
                  <td class="text-muted">{{ pl.id }}</td>
                  <td class="fw-semibold">{{ pl.name }}</td>
                  <td><span class="badge bg-light text-dark border">{{ pl.project?.name ?? '—' }}</span></td>
                  <td><code class="text-primary" style="font-size:.82rem">{{ pl.branch }}</code></td>
                  <td><app-status-badge [status]="pl.status" /></td>
                  <td class="text-muted" style="font-size:.82rem">{{ pl.created_at | date:'dd/MM/yyyy' }}</td>
                  <td>
                    <div class="d-flex gap-1">
                      <button class="btn btn-outline-primary btn-action" (click)="openForm(pl)"><i class="bi bi-pencil"></i></button>
                      <button class="btn btn-outline-danger btn-action" (click)="askDelete(pl)"><i class="bi bi-trash3"></i></button>
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
              <h5 class="modal-title fw-bold">{{ editId() ? 'Modifier' : 'Créer' }} un pipeline</h5>
              <button type="button" class="btn-close" (click)="closeForm()"></button>
            </div>
            <div class="modal-body form-card shadow-none p-4">
              <form [formGroup]="form" (ngSubmit)="submit()">
                <div class="mb-3">
                  <label class="form-label">Nom <span class="text-danger">*</span></label>
                  <input formControlName="name" class="form-control" [class.is-invalid]="invalid('name')" placeholder="Ex: CI Pipeline Main">
                  <div class="invalid-feedback">{{ fieldError('name') }}</div>
                </div>
                <div class="mb-3">
                  <label class="form-label">Projet <span class="text-danger">*</span></label>
                  <select formControlName="project_id" class="form-select" [class.is-invalid]="invalid('project_id')">
                    <option value="">-- Choisir un projet --</option>
                    @for (p of projects(); track p.id) {
                      <option [value]="p.id">{{ p.name }}</option>
                    }
                  </select>
                  <div class="invalid-feedback">{{ fieldError('project_id') }}</div>
                </div>
                <div class="mb-3">
                  <label class="form-label">Branche <span class="text-danger">*</span></label>
                  <input formControlName="branch" class="form-control" [class.is-invalid]="invalid('branch')" placeholder="main, develop...">
                  <div class="invalid-feedback">{{ fieldError('branch') }}</div>
                </div>
                <div class="mb-3">
                  <label class="form-label">Statut <span class="text-danger">*</span></label>
                  <select formControlName="status" class="form-select">
                    <option value="idle">Idle</option>
                    <option value="running">Running</option>
                    <option value="success">Success</option>
                    <option value="failed">Failed</option>
                  </select>
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
      [message]="confirmMessage()"
      (confirmed)="confirmDelete()" (cancelled)="showConfirm.set(false)" />
  `
})
export class PipelinesComponent implements OnInit {
  pageTitle = 'Pipelines';
  private svc   = inject(PipelineService);
  private pSvc  = inject(ProjectService);
  private toast = inject(ToastService);
  private fb    = inject(FormBuilder);

  pipelines   = signal<Pipeline[]>([]);
  projects    = signal<Project[]>([]);
  meta        = signal<PaginationMeta | undefined>(undefined);
  loading     = signal(true);
  saving      = signal(false);
  showForm    = signal(false);
  showConfirm = signal(false);
  editId      = signal<number | null>(null);
  deleteTarget = signal<Pipeline | null>(null);
  serverErrors: Record<string, string[]> = {};

  form = this.fb.group({
    name:       ['', [Validators.required]],
    project_id: ['', Validators.required],
    branch:     ['', Validators.required],
    status:     ['idle', Validators.required],
    configuration: ['']
  });

  ngOnInit(): void {
    this.load(1);
    this.pSvc.getAll().subscribe(r => this.projects.set(r.data.data));
  }

  load(page: number): void {
    this.loading.set(true);
    this.svc.getAll(page).subscribe({
      next: (res) => { this.pipelines.set(res.data.data); this.meta.set(res.meta); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  openForm(pl?: Pipeline): void {
    this.serverErrors = {};
    this.editId.set(pl?.id ?? null);
    this.form.reset({ status: 'idle' });
    if (pl) this.form.patchValue({ ...pl, project_id: pl.project?.id ?? (pl as any).project_id });
    this.showForm.set(true);
  }

  closeForm(): void { this.showForm.set(false); }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving.set(true);
    const data = { ...this.form.value, project_id: Number(this.form.value.project_id) } as any;
    const req = this.editId() ? this.svc.update(this.editId()!, data) : this.svc.create(data);
    req.subscribe({
      next: () => { this.toast.success(this.editId() ? 'Pipeline mis à jour.' : 'Pipeline créé.'); this.closeForm(); this.load(1); this.saving.set(false); },
      error: (err) => { this.saving.set(false); if (err.status === 422) this.serverErrors = err.error.errors ?? {}; }
    });
  }

  askDelete(pl: Pipeline): void { this.deleteTarget.set(pl); this.showConfirm.set(true); }

  confirmMessage(): string {
    return `Supprimer le pipeline "${this.deleteTarget()?.name ?? ''}" ?`;
  }
  confirmDelete(): void {
    const id = this.deleteTarget()?.id;
    if (!id) return;
    this.svc.delete(id).subscribe({ next: () => { this.toast.success('Pipeline supprimé.'); this.showConfirm.set(false); this.load(1); }, error: () => this.showConfirm.set(false) });
  }

  invalid(f: string): boolean { const c = this.form.get(f); return (!!c?.invalid && c?.touched) || !!this.serverErrors[f]; }
  fieldError(f: string): string {
    if (this.serverErrors[f]) return this.serverErrors[f][0];
    const c = this.form.get(f);
    if (c?.hasError('required')) return 'Ce champ est obligatoire.';
    return '';
  }
}
