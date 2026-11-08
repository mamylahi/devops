import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (visible) {
      <div class="modal fade show d-block" tabindex="-1" style="background:rgba(0,0,0,.45)">
        <div class="modal-dialog modal-dialog-centered modal-confirm">
          <div class="modal-content border-0 shadow">
            <div class="modal-header border-0 pb-0">
              <button type="button" class="btn-close" (click)="cancel()"></button>
            </div>
            <div class="modal-body text-center px-4 pt-0 pb-3">
              <div class="modal-icon mb-3">
                <i class="bi bi-exclamation-triangle-fill text-danger" style="font-size:3rem"></i>
              </div>
              <h5 class="fw-bold">{{ title }}</h5>
              <p class="text-muted mb-0">{{ message }}</p>
            </div>
            <div class="modal-footer border-0 justify-content-center gap-2">
              <button class="btn btn-outline-secondary px-4" (click)="cancel()">Annuler</button>
              <button class="btn btn-danger px-4" (click)="confirm()">
                <i class="bi bi-trash3 me-1"></i> Supprimer
              </button>
            </div>
          </div>
        </div>
      </div>
    }
  `
})
export class ConfirmModalComponent {
  @Input() visible = false;
  @Input() title = 'Confirmer la suppression';
  @Input() message = 'Cette action est irréversible. Voulez-vous continuer ?';
  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  confirm(): void { this.confirmed.emit(); }
  cancel(): void  { this.cancelled.emit(); }
}
