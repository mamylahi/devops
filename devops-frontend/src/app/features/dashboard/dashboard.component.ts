import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { UserService } from '../../services/user.service';
import { ProjectService } from '../../services/project.service';
import { PipelineService } from '../../services/pipeline.service';
import { DeploymentService } from '../../services/deployment.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="mb-4">
      <h4 class="fw-bold mb-1">Tableau de bord</h4>
      <p class="text-muted mb-0" style="font-size:.9rem">Vue d'ensemble de la plateforme DevOps</p>
    </div>

    <!-- Stat cards -->
    <div class="row g-3 mb-4">
      @for (card of stats; track card.label) {
        <div class="col-6 col-md-3">
          <div class="stat-card">
            <div class="d-flex align-items-center justify-content-between mb-3">
              <div class="stat-icon" [style.background]="card.bg">
                <i [class]="card.icon" [style.color]="card.color"></i>
              </div>
              <span class="badge rounded-pill" [style.background]="card.bg" [style.color]="card.color"
                    style="font-size:.72rem">
                {{ card.trend }}
              </span>
            </div>
            <div class="stat-value">{{ loading ? '—' : card.value }}</div>
            <div class="stat-label">{{ card.label }}</div>
          </div>
        </div>
      }
    </div>

    <!-- Quick actions -->
    <div class="row g-3">
      <div class="col-12">
        <div class="data-table">
          <div class="table-header">
            <h5><i class="bi bi-lightning-charge me-2 text-warning"></i>Actions rapides</h5>
          </div>
          <div class="p-3">
            <div class="row g-2">
              @for (action of quickActions; track action.label) {
                <div class="col-6 col-md-4 col-lg-2">
                  <a [routerLink]="action.link"
                     class="btn btn-outline-secondary w-100 d-flex flex-column align-items-center gap-2 py-3"
                     style="border-radius:10px;font-size:.82rem">
                    <i [class]="action.icon" style="font-size:1.4rem"></i>
                    {{ action.label }}
                  </a>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  pageTitle = 'Dashboard';
  loading = true;

  stats = [
    { label: 'Utilisateurs', value: 0, icon: 'bi bi-people-fill', color: '#0d6efd', bg: '#e8f0fe', trend: 'Users' },
    { label: 'Projets',      value: 0, icon: 'bi bi-folder2-open', color: '#198754', bg: '#d1fae5', trend: 'Projects' },
    { label: 'Pipelines',    value: 0, icon: 'bi bi-diagram-3-fill', color: '#fd7e14', bg: '#fff3cd', trend: 'Pipelines' },
    { label: 'Déploiements', value: 0, icon: 'bi bi-rocket-takeoff-fill', color: '#6f42c1', bg: '#ede9fe', trend: 'Deploys' },
  ];

  quickActions = [
    { label: 'Utilisateurs', link: '/users',        icon: 'bi bi-people text-primary' },
    { label: 'Projets',      link: '/projects',     icon: 'bi bi-folder2-open text-success' },
    { label: 'Pipelines',    link: '/pipelines',    icon: 'bi bi-diagram-3 text-warning' },
    { label: 'Environnements', link: '/environments', icon: 'bi bi-layers text-info' },
    { label: 'Déploiements', link: '/deployments',  icon: 'bi bi-rocket-takeoff text-purple' },
  ];

  private userSvc       = inject(UserService);
  private projectSvc    = inject(ProjectService);
  private pipelineSvc   = inject(PipelineService);
  private deploymentSvc = inject(DeploymentService);

  ngOnInit(): void {
    forkJoin({
      users:       this.userSvc.getAll(),
      projects:    this.projectSvc.getAll(),
      pipelines:   this.pipelineSvc.getAll(),
      deployments: this.deploymentSvc.getAll(),
    }).subscribe({
      next: (res) => {
        this.stats[0].value = res.users.meta.total;
        this.stats[1].value = res.projects.meta.total;
        this.stats[2].value = res.pipelines.meta.total;
        this.stats[3].value = res.deployments.meta.total;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }
}
