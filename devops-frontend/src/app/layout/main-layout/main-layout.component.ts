import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { TopbarComponent } from '../topbar/topbar.component';
import { ToastComponent } from '../../shared/components/toast/toast.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, TopbarComponent, ToastComponent],
  template: `
    <div class="app-wrapper">
      <app-sidebar />
      <div class="main-content">
        <app-topbar [title]="pageTitle" />
        <main class="page-content">
          <router-outlet (activate)="onActivate($event)" />
        </main>
      </div>
    </div>
    <app-toast />
  `
})
export class MainLayoutComponent {
  pageTitle = 'Dashboard';

  onActivate(component: any): void {
    this.pageTitle = component?.pageTitle ?? 'DevOps Platform';
  }
}
