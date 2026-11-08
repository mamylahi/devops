import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { EnvironmentService } from '../../services/environment.service';
import { ProjectService } from '../../services/project.service';
import { ToastService } from '../../core/services/toast.service';
import { Environment } from '../../models/environment.model';
import { Project } from '../../models/project.model';
import { PaginationMeta } from '../../models/api-response.model';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';
import { ConfirmModalComponent } from '../../shared/components/confirm-modal/confirm-modal.component';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';

@Component({
  selector: 'app-environments',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, StatusBadgeComponent, ConfirmModalComponent, PaginationComponent],
  template: `
    <div class="d-flex align-items-center justify-content-between mb-4">
      <div>
        <h4 class="fw-bold mb-1">Environnements</h4>
        <p class="text-muted mb-0" style="font-size:.9rem">Gérer les environnements de déploiement</p>
      </div>
      <button class="btn btn-primary" (click)="openForm()">
        <i class="bi bi-plus-lg me-1"></i> Nouvel environnement
      </button>
    </div>

    <div class="data-table">
      <div class="table-header">
        <h5><i class="bi bi-layers me-2"></i>Liste ({{ meta()?.total ?? 0 }})</h5>
      </div>

      @if (loading()) {
        <div class="loading-overlay"><div class="spinner-border text-primary"></div></div>
      } @else if (envs().length === 0) {
        <div class="empty-state">
          <i class="bi bi-layers d-block"></i>
          <p>Aucun environnement trouvé.</p>
        </div>
      } @else {
        <div class="table-responsive">
          <table class="table table-hover mb-0">
            <thead>
              <tr><th>#</th><th>Nom</th><th>Projet</th><th>URL</th><th>Statut</th><th>Créé le</th><th></th></tr>
            </thead>
            <tbody>
              @for (e of envs(); track e.id) {
                <tr>
                  <td class="text-muted">{{ e.id }}</td>
                  <td>
                    <span class="badge fw-semibold" [class]="envBadge(e.name)">{{ e.name }}</span>
                  </td>
                  <td><span class="badge bg-light text-dark border">{{ e.project?.name ?? '—' }}</span></td>
                  <td>
                    @if (e.url) {
                      <a [href]="e.url" target="_blank" style="font-size:.82rem">{{ e.url }}</a>
                    } @else { <span class="text-muted">—</span> }
                  </td>
                  <td><app-status-badge [status]="e.status" /></td>
                  <td class="text-muted" style="font-size:.82rem">{{ e.created_at | date:'dd/MM/yyyy' }}</td>
                  <td>
                    <div class="d-flex gap-1">
                      <button class="btn btn-outline-primary btn-action" (click)="openForm(e)"><i class="bi bi-pencil"></i></button>
                      <button class="btn btn-outline-danger btn-action" (click)="askDelete(e)"><i class="bi bi-trash3"></i></button>
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
              <h5 class="modal-title fw-bold">{{ editId() ? 'Modifier' : 'Créer' }} un environnement</h5>
              <button type="button" class="btn-close" (click)="closeForm()"></button>
            </div>
            <div class="modal-body form-card shadow-none p-4">
              <form [formGroup]="form" (ngSubmit)="submit()">
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
                  <label class="form-label">Nom <span class="text-danger">*</span></label>
                  <select formControlName="name" class="form-select" [class.is-invalid]="invalid('name')">
                    <option value="development">Development</option>
                    <option value="staging">Staging</option>
                    <option value="production">Production</option>
                  </select>
                </div>
                <div class="mb-3">
                  <label class="form-label">URL</label>
                  <input formControlName="url" class="form-control" placeholder="https://...">
                </div>
                <div class="mb-3">
                  <label class="form-label">Statut <span class="text-danger">*</span></label>
                  <select formControlName="status" class="form-select">
                    <option value="active">Actif</option>
                    <option value="inactive">Inactif</option>
                    <option value="deploying">Déploiement</option>
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
export class EnvironmentsComponent implements OnInit {
  pageTitle = 'Environnements';
  private svc   = inject(EnvironmentService);
  private pSvc  = inject(ProjectService);
  private toast = inject(ToastService);
  private fb    = inject(FormBuilder);

  envs        = signal<Environment[]>([]);
  projects    = signal<Project[]>([]);
  meta        = signal<PaginationMeta | undefined>(undefined);
  loading     = signal(true);
  saving      = signal(false);
  showForm    = signal(false);
  showConfirm = signal(false);
  editId      = signal<number | null>(null);
  deleteTarget = signal<Environment | null>(null);
  serverErrors: Record<string, string[]> = {};

  form = this.fb.group({
    project_id: ['', Validators.required],
    name:       ['development', Validators.required],
    url:        [''],
    status:     ['active', Validators.required]
  });

  ngOnInit(): void {
    this.load(1);
    this.pSvc.getAll().subscribe(r => this.projects.set(r.data.data));
  }

  load(page: number): void {
    this.loading.set(true);
    this.svc.getAll(page).subscribe({
      next: (res) => { this.envs.set(res.data.data); this.meta.set(res.meta); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  openForm(e?: Environment): void {
    this.serverErrors = {};
    this.editId.set(e?.id ?? null);
    this.form.reset({ name: 'development', status: 'active' });
    if (e) this.form.patchValue({ ...e, project_id: e.project?.id ?? (e as any).project_id });
    this.showForm.set(true);
  }

  closeForm(): void { this.showForm.set(false); }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving.set(true);
    const data = { ...this.form.value, project_id: Number(this.form.value.project_id) } as any;
    const req = this.editId() ? this.svc.update(this.editId()!, data) : this.svc.create(data);
    req.subscribe({
      next: () => { this.toast.success(this.editId() ? 'Environnement mis à jour.' : 'Environnement créé.'); this.closeForm(); this.load(1); this.saving.set(false); },
      error: (err) => { this.saving.set(false); if (err.status === 422) this.serverErrors = err.error.errors ?? {}; }
    });
  }

  askDelete(e: Environment): void { this.deleteTarget.set(e); this.showConfirm.set(true); }

  confirmMessage(): string {
    return `Supprimer l'environnement "${this.deleteTarget()?.name ?? ''}" ?`;
  }
  confirmDelete(): void {
    const id = this.deleteTarget()?.id;
    if (!id) return;
    this.svc.delete(id).subscribe({ next: () => { this.toast.success('Environnement supprimé.'); this.showConfirm.set(false); this.load(1); }, error: () => this.showConfirm.set(false) });
  }

  envBadge(name: string): string {
    const m: Record<string, string> = { production: 'bg-danger-subtle text-danger', staging: 'bg-warning-subtle text-warning', development: 'bg-success-subtle text-success' };
    return m[name] ?? 'bg-secondary-subtle';
  }

  invalid(f: string): boolean { const c = this.form.get(f); return (!!c?.invalid && c?.touched) || !!this.serverErrors[f]; }
  fieldError(f: string): string {
    if (this.serverErrors[f]) return this.serverErrors[f][0];
    if (this.form.get(f)?.hasError('required')) return 'Ce champ est obligatoire.';
    return '';
  }
}
