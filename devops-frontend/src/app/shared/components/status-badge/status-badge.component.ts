import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  template: `<span class="badge-status status-{{ status }}">{{ label || status }}</span>`
})
export class StatusBadgeComponent {
  @Input() status = '';
  @Input() label = '';
}
