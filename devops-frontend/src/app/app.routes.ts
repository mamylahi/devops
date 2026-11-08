import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'users',
        loadComponent: () => import('./features/users/users.component').then(m => m.UsersComponent)
      },
      {
        path: 'projects',
        loadComponent: () => import('./features/projects/projects.component').then(m => m.ProjectsComponent)
      },
      {
        path: 'pipelines',
        loadComponent: () => import('./features/pipelines/pipelines.component').then(m => m.PipelinesComponent)
      },
      {
        path: 'environments',
        loadComponent: () => import('./features/environments/environments.component').then(m => m.EnvironmentsComponent)
      },
      {
        path: 'deployments',
        loadComponent: () => import('./features/deployments/deployments.component').then(m => m.DeploymentsComponent)
      },
    ]
  },
  { path: '**', redirectTo: 'dashboard' }
];
