import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { ToastService } from '../../core/services/toast.service';
import { User } from '../../models/user.model';
import { PaginationMeta } from '../../models/api-response.model';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';
import { ConfirmModalComponent } from '../../shared/components/confirm-modal/confirm-modal.component';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, StatusBadgeComponent, ConfirmModalComponent, PaginationComponent],
  template: `
    <div class="d-flex align-items-center justify-content-between mb-4">
      <div>
        <h4 class="fw-bold mb-1">Utilisateurs</h4>
        <p class="text-muted mb-0" style="font-size:.9rem">Gérer les membres de la plateforme</p>
      </div>
      <button class="btn btn-primary" (click)="openForm()">
        <i class="bi bi-plus-lg me-1"></i> Nouvel utilisateur
      </button>
    </div>

    <!-- Table -->
    <div class="data-table">
      <div class="table-header">
        <h5><i class="bi bi-people me-2"></i>Liste ({{ meta()?.total ?? 0 }})</h5>
      </div>

      @if (loading()) {
        <div class="loading-overlay"><div class="spinner-border text-primary"></div></div>
      } @else if (users().length === 0) {
        <div class="empty-state">
          <i class="bi bi-people d-block"></i>
          <p>Aucun utilisateur trouvé.</p>
        </div>
      } @else {
        <div class="table-responsive">
          <table class="table table-hover mb-0">
            <thead>
              <tr>
                <th>#</th><th>Nom</th><th>Email</th><th>Rôle</th><th>Statut</th><th>Créé le</th><th></th>
              </tr>
            </thead>
            <tbody>
              @for (user of users(); track user.id) {
                <tr>
                  <td class="text-muted">{{ user.id }}</td>
                  <td class="fw-semibold">{{ user.name }}</td>
                  <td>{{ user.email }}</td>
                  <td><span class="badge bg-light text-dark border">{{ user.role }}</span></td>
                  <td>
                    <app-status-badge [status]="user.is_active ? 'active' : 'inactive'"
                                      [label]="user.is_active ? 'Actif' : 'Inactif'" />
                  </td>
                  <td class="text-muted" style="font-size:.82rem">{{ user.created_at | date:'dd/MM/yyyy' }}</td>
                  <td>
                    <div class="d-flex gap-1">
                      <button class="btn btn-outline-primary btn-action" title="Modifier" (click)="openForm(user)">
                        <i class="bi bi-pencil"></i>
                      </button>
                      <button class="btn btn-outline-danger btn-action" title="Supprimer" (click)="askDelete(user)">
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

    <!-- Modal formulaire -->
    @if (showForm()) {
      <div class="modal fade show d-block" tabindex="-1" style="background:rgba(0,0,0,.45)">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content border-0 shadow">
            <div class="modal-header">
              <h5 class="modal-title fw-bold">
                {{ editId() ? 'Modifier' : 'Créer' }} un utilisateur
              </h5>
              <button type="button" class="btn-close" (click)="closeForm()"></button>
            </div>
            <div class="modal-body form-card shadow-none p-4">
              <form [formGroup]="form" (ngSubmit)="submit()">
                <div class="mb-3">
                  <label class="form-label">Nom <span class="text-danger">*</span></label>
                  <input formControlName="name" class="form-control"
                         [class.is-invalid]="invalid('name')" placeholder="Nom complet">
                  <div class="invalid-feedback">{{ fieldError('name') }}</div>
                </div>
                <div class="mb-3">
                  <label class="form-label">Email <span class="text-danger">*</span></label>
                  <input formControlName="email" type="email" class="form-control"
                         [class.is-invalid]="invalid('email')" placeholder="adresse@email.com">
                  <div class="invalid-feedback">{{ fieldError('email') }}</div>
                </div>
                <div class="mb-3">
                  <label class="form-label">Rôle <span class="text-danger">*</span></label>
                  <select formControlName="role" class="form-select" [class.is-invalid]="invalid('role')">
                    <option value="">-- Choisir --</option>
                    <option value="admin">Admin</option>
                    <option value="developer">Developer</option>
                    <option value="viewer">Viewer</option>
                  </select>
                  <div class="invalid-feedback">{{ fieldError('role') }}</div>
                </div>
                <div class="form-check form-switch mb-3">
                  <input formControlName="is_active" class="form-check-input" type="checkbox" id="isActive">
                  <label class="form-check-label" for="isActive">Utilisateur actif</label>
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
export class UsersComponent implements OnInit {
  pageTitle = 'Utilisateurs';

  private svc   = inject(UserService);
  private toast = inject(ToastService);
  private fb    = inject(FormBuilder);

  users       = signal<User[]>([]);
  meta        = signal<PaginationMeta | undefined>(undefined);
  loading     = signal(true);
  saving      = signal(false);
  showForm    = signal(false);
  showConfirm = signal(false);
  editId      = signal<number | null>(null);
  deleteTarget = signal<User | null>(null);
  serverErrors: Record<string, string[]> = {};

  form = this.fb.group({
    name:      ['', [Validators.required, Validators.maxLength(255)]],
    email:     ['', [Validators.required, Validators.email]],
    role:      ['', Validators.required],
    is_active: [true]
  });

  ngOnInit(): void { this.load(1); }

  load(page: number): void {
    this.loading.set(true);
    this.svc.getAll(page).subscribe({
      next: (res) => {
        this.users.set(res.data.data);
        this.meta.set(res.meta);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  openForm(user?: User): void {
    this.serverErrors = {};
    this.editId.set(user?.id ?? null);
    this.form.reset({ is_active: true });
    if (user) this.form.patchValue(user);
    this.showForm.set(true);
  }

  closeForm(): void { this.showForm.set(false); }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving.set(true);
    const data = this.form.value as any;
    const req = this.editId()
      ? this.svc.update(this.editId()!, data)
      : this.svc.create(data);

    req.subscribe({
      next: () => {
        this.toast.success(this.editId() ? 'Utilisateur mis à jour.' : 'Utilisateur créé.');
        this.closeForm();
        this.load(1);
        this.saving.set(false);
      },
      error: (err) => {
        this.saving.set(false);
        if (err.status === 422) {
          this.serverErrors = err.error.errors ?? {};
        }
      }
    });
  }

  askDelete(user: User): void {
    this.deleteTarget.set(user);
    this.showConfirm.set(true);
  }

  confirmMessage(): string {
    return `Supprimer l'utilisateur "${this.deleteTarget()?.name ?? ''}" ?`;
  }

  confirmDelete(): void {
    const id = this.deleteTarget()?.id;
    if (!id) return;
    this.svc.delete(id).subscribe({
      next: () => {
        this.toast.success('Utilisateur supprimé.');
        this.showConfirm.set(false);
        this.load(1);
      },
      error: () => this.showConfirm.set(false)
    });
  }

  invalid(field: string): boolean {
    const ctrl = this.form.get(field);
    return (!!ctrl?.invalid && ctrl?.touched) || !!this.serverErrors[field];
  }

  fieldError(field: string): string {
    if (this.serverErrors[field]) return this.serverErrors[field][0];
    const ctrl = this.form.get(field);
    if (ctrl?.hasError('required'))   return 'Ce champ est obligatoire.';
    if (ctrl?.hasError('email'))      return 'Email invalide.';
    if (ctrl?.hasError('maxlength'))  return 'Trop long.';
    return '';
  }
}
