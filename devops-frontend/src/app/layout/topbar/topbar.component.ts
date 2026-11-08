import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-topbar',
  standalone: true,
  template: `
    <header class="topbar">
      <h1 class="page-title">{{ title }}</h1>
      <div class="d-flex align-items-center gap-3">
        <span class="badge bg-primary-subtle text-primary fw-semibold" style="font-size:.75rem">
          <i class="bi bi-git me-1"></i>Phase 1 — CRUD
        </span>
        <div class="d-flex align-items-center gap-2">
          <div class="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
               style="width:32px;height:32px;font-size:.85rem;font-weight:600">
            DO
          </div>
        </div>
      </div>
    </header>
  `
})
export class TopbarComponent {
  @Input() title = 'Dashboard';
}
