import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationMeta } from '../../../models/api-response.model';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (meta && meta.last_page > 1) {
      <div class="pagination-wrapper">
        <span>
          {{ (meta.current_page - 1) * meta.per_page + 1 }}–{{ rangeEnd() }}
          sur {{ meta.total }}
        </span>
        <nav>
          <ul class="pagination pagination-sm mb-0">
            <li class="page-item" [class.disabled]="meta.current_page === 1">
              <button class="page-link" (click)="go(meta.current_page - 1)">
                <i class="bi bi-chevron-left"></i>
              </button>
            </li>
            @for (p of pages(); track p) {
              <li class="page-item" [class.active]="p === meta.current_page">
                <button class="page-link" (click)="go(p)">{{ p }}</button>
              </li>
            }
            <li class="page-item" [class.disabled]="meta.current_page === meta.last_page">
              <button class="page-link" (click)="go(meta.current_page + 1)">
                <i class="bi bi-chevron-right"></i>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    }
  `
})
export class PaginationComponent {
  @Input() meta?: PaginationMeta;
  @Output() pageChange = new EventEmitter<number>();

  rangeEnd(): number {
    if (!this.meta) return 0;
    return Math.min(this.meta.current_page * this.meta.per_page, this.meta.total);
  }

  go(page: number): void {
    if (!this.meta) return;
    if (page < 1 || page > this.meta.last_page) return;
    this.pageChange.emit(page);
  }

  pages(): number[] {
    if (!this.meta) return [];
    const total = this.meta.last_page;
    const cur   = this.meta.current_page;
    const range: number[] = [];
    for (let i = Math.max(1, cur - 2); i <= Math.min(total, cur + 2); i++) {
      range.push(i);
    }
    return range;
  }
}
