import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ProjectService } from '../../services/project.service';
import { UserService } from '../../services/user.service';
import { ToastService } from '../../core/services/toast.service';
import { Project } from '../../models/project.model';
import { User } from '../../models/user.model';
import { PaginationMeta } from '../../models/api-response.model';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';
import { ConfirmModalComponent } from '../../shared/components/confirm-modal/confirm-modal.component';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, StatusBadgeComponent, ConfirmModalComponent, PaginationComponent],
  template: `
    <div class="d-flex align-items-center justify-content-between mb-4">
      <div>
        <h4 class="fw-bold mb-1">Projets</h4>
        <p class="text-muted mb-0" style="font-size:.9rem">Gérer les projets de la plateforme</p>
      </div>
      <button class="btn btn-primary" (click)="openForm()">
        <i class="bi bi-plus-lg me-1"></i> Nouveau projet
      </button>
    </div>

    <div class="data-table">
      <div class="table-header">
        <h5><i class="bi bi-folder2-open me-2"></i>Liste ({{ meta()?.total ?? 0 }})</h5>
      </div>

      @if (loading()) {
        <div class="loading-overlay"><div class="spinner-border text-primary"></div></div>
      } @else if (projects().length === 0) {
        <div class="empty-state">
          <i class="bi bi-folder2 d-block"></i>
          <p>Aucun projet trouvé.</p>
        </div>
      } @else {
        <div class="table-responsive">
          <table class="table table-hover mb-0">
            <thead>
              <tr>
                <th>#</th><th>Nom</th><th>Propriétaire</th><th>Statut</th><th>Dépôt</th><th>Créé le</th><th></th>
              </tr>
            </thead>
            <tbody>
              @for (p of projects(); track p.id) {
                <tr>
                  <td class="text-muted">{{ p.id }}</td>
                  <td class="fw-semibold">{{ p.name }}</td>
                  <td>{{ p.owner?.name ?? '—' }}</td>
                  <td><app-status-badge [status]="p.status" /></td>
                  <td>
                    @if (p.repository_url) {
                      <a [href]="p.repository_url" target="_blank" class="text-truncate d-block"
                         style="max-width:180px;font-size:.82rem">
                        <i class="bi bi-github me-1"></i>{{ p.repository_url }}
                      </a>
                    } @else { <span class="text-muted">—</span> }
                  </td>
                  <td class="text-muted" style="font-size:.82rem">{{ p.created_at | date:'dd/MM/yyyy' }}</td>
                  <td>
                    <div class="d-flex gap-1">
                      <button class="btn btn-outline-primary btn-action" (click)="openForm(p)">
                        <i class="bi bi-pencil"></i>
                      </button>
                      <button class="btn btn-outline-danger btn-action" (click)="askDelete(p)">
                        <i class="bi bi-trash3"></i>
                      </button>
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
              <h5 class="modal-title fw-bold">{{ editId() ? 'Modifier' : 'Créer' }} un projet</h5>
              <button type="button" class="btn-close" (click)="closeForm()"></button>
            </div>
            <div class="modal-body form-card shadow-none p-4">
              <form [formGroup]="form" (ngSubmit)="submit()">
                <div class="mb-3">
                  <label class="form-label">Nom <span class="text-danger">*</span></label>
                  <input formControlName="name" class="form-control" [class.is-invalid]="invalid('name')" placeholder="Nom du projet">
                  <div class="invalid-feedback">{{ fieldError('name') }}</div>
                </div>
                <div class="mb-3">
                  <label class="form-label">Propriétaire <span class="text-danger">*</span></label>
                  <select formControlName="user_id" class="form-select" [class.is-invalid]="invalid('user_id')">
                    <option value="">-- Choisir un utilisateur --</option>
                    @for (u of users(); track u.id) {
                      <option [value]="u.id">{{ u.name }}</option>
                    }
                  </select>
                  <div class="invalid-feedback">{{ fieldError('user_id') }}</div>
                </div>
                <div class="mb-3">
                  <label class="form-label">Description</label>
                  <textarea formControlName="description" class="form-control" rows="3" placeholder="Description..."></textarea>
                </div>
                <div class="mb-3">
                  <label class="form-label">Statut <span class="text-danger">*</span></label>
                  <select formControlName="status" class="form-select" [class.is-invalid]="invalid('status')">
                    <option value="active">Actif</option>
                    <option value="pending">En attente</option>
                    <option value="archived">Archivé</option>
                  </select>
                </div>
                <div class="mb-3">
                  <label class="form-label">URL du dépôt</label>
                  <input formControlName="repository_url" class="form-control"
                         [class.is-invalid]="invalid('repository_url')" placeholder="https://github.com/...">
                  <div class="invalid-feedback">{{ fieldError('repository_url') }}</div>
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

    <app-confirm-modal
      [visible]="showConfirm()"
      [message]="confirmMessage()"
      (confirmed)="confirmDelete()"
      (cancelled)="showConfirm.set(false)" />
  `
})
export class ProjectsComponent implements OnInit {
  pageTitle = 'Projets';
  private svc   = inject(ProjectService);
  private uSvc  = inject(UserService);
  private toast = inject(ToastService);
  private fb    = inject(FormBuilder);

  projects    = signal<Project[]>([]);
  users       = signal<User[]>([]);
  meta        = signal<PaginationMeta | undefined>(undefined);
  loading     = signal(true);
  saving      = signal(false);
  showForm    = signal(false);
  showConfirm = signal(false);
  editId      = signal<number | null>(null);
  deleteTarget = signal<Project | null>(null);
  serverErrors: Record<string, string[]> = {};

  form = this.fb.group({
    name:           ['', [Validators.required, Validators.maxLength(255)]],
    user_id:        ['', Validators.required],
    description:    [''],
    status:         ['active', Validators.required],
    repository_url: ['']
  });

  ngOnInit(): void {
    this.load(1);
    this.uSvc.getAll().subscribe(r => this.users.set(r.data.data));
  }

  load(page: number): void {
    this.loading.set(true);
    this.svc.getAll(page).subscribe({
      next: (res) => { this.projects.set(res.data.data); this.meta.set(res.meta); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  openForm(p?: Project): void {
    this.serverErrors = {};
    this.editId.set(p?.id ?? null);
    this.form.reset({ status: 'active' });
    if (p) this.form.patchValue({ ...p, user_id: p.owner?.id ?? (p as any).user_id });
    this.showForm.set(true);
  }

  closeForm(): void { this.showForm.set(false); }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving.set(true);
    const data = { ...this.form.value, user_id: Number(this.form.value.user_id) } as any;
    const req = this.editId() ? this.svc.update(this.editId()!, data) : this.svc.create(data);
    req.subscribe({
      next: () => { this.toast.success(this.editId() ? 'Projet mis à jour.' : 'Projet créé.'); this.closeForm(); this.load(1); this.saving.set(false); },
      error: (err) => { this.saving.set(false); if (err.status === 422) this.serverErrors = err.error.errors ?? {}; }
    });
  }

  askDelete(p: Project): void { this.deleteTarget.set(p); this.showConfirm.set(true); }

  confirmMessage(): string {
    return `Supprimer le projet "${this.deleteTarget()?.name ?? ''}" ?`;
  }

  confirmDelete(): void {
    const id = this.deleteTarget()?.id;
    if (!id) return;
    this.svc.delete(id).subscribe({ next: () => { this.toast.success('Projet supprimé.'); this.showConfirm.set(false); this.load(1); }, error: () => this.showConfirm.set(false) });
  }

  invalid(field: string): boolean {
    const ctrl = this.form.get(field);
    return (!!ctrl?.invalid && ctrl?.touched) || !!this.serverErrors[field];
  }

  fieldError(field: string): string {
    if (this.serverErrors[field]) return this.serverErrors[field][0];
    const ctrl = this.form.get(field);
    if (ctrl?.hasError('required')) return 'Ce champ est obligatoire.';
    return '';
  }
}
