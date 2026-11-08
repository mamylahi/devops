import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      @for (toast of toastService.toasts(); track toast.id) {
        <div class="toast show align-items-center border-0 mb-2"
             [class]="toastClass(toast.type)"
             role="alert">
          <div class="d-flex">
            <div class="toast-body d-flex align-items-center gap-2">
              <i [class]="toastIcon(toast.type)"></i>
              {{ toast.message }}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto"
                    (click)="toastService.remove(toast.id)"></button>
          </div>
        </div>
      }
    </div>
  `
})
export class ToastComponent {
  toastService = inject(ToastService);

  toastClass(type: string): string {
    const map: Record<string, string> = {
      success: 'bg-success text-white',
      error:   'bg-danger text-white',
      warning: 'bg-warning text-dark',
      info:    'bg-info text-dark'
    };
    return map[type] ?? 'bg-secondary text-white';
  }

  toastIcon(type: string): string {
    const map: Record<string, string> = {
      success: 'bi bi-check-circle-fill',
      error:   'bi bi-x-circle-fill',
      warning: 'bi bi-exclamation-triangle-fill',
      info:    'bi bi-info-circle-fill'
    };
    return map[type] ?? 'bi bi-bell-fill';
  }
}
