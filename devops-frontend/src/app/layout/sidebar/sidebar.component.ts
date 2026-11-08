import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <aside class="sidebar">
      <a class="sidebar-brand" routerLink="/dashboard">
        <i class="bi bi-cpu-fill brand-icon"></i>
        <span>DevOps Platform</span>
      </a>

      <ul class="nav flex-column mt-2 px-0">
        <li class="sidebar-section">Navigation</li>

        <li class="nav-item">
          <a class="nav-link" routerLink="/dashboard" routerLinkActive="active">
            <i class="bi bi-speedometer2"></i> Dashboard
          </a>
        </li>

        <li class="sidebar-section mt-2">Entités</li>

        <li class="nav-item">
          <a class="nav-link" routerLink="/users" routerLinkActive="active">
            <i class="bi bi-people"></i> Utilisateurs
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link" routerLink="/projects" routerLinkActive="active">
            <i class="bi bi-folder2-open"></i> Projets
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link" routerLink="/pipelines" routerLinkActive="active">
            <i class="bi bi-diagram-3"></i> Pipelines
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link" routerLink="/environments" routerLinkActive="active">
            <i class="bi bi-layers"></i> Environnements
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link" routerLink="/deployments" routerLinkActive="active">
            <i class="bi bi-rocket-takeoff"></i> Déploiements
          </a>
        </li>
      </ul>

      <div class="mt-auto p-3" style="border-top:1px solid rgba(255,255,255,.08)">
        <div class="d-flex align-items-center gap-2" style="font-size:.8rem;color:rgba(255,255,255,.4)">
          <i class="bi bi-circle-fill text-success" style="font-size:.5rem"></i>
          API connectée
        </div>
      </div>
    </aside>
  `
})
export class SidebarComponent {}
