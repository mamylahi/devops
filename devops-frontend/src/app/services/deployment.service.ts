import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse, PaginatedResponse } from '../models/api-response.model';
import { Deployment, CreateDeploymentDto, UpdateDeploymentDto } from '../models/deployment.model';

@Injectable({ providedIn: 'root' })
export class DeploymentService {
  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/deployments`;

  getAll(page = 1): Observable<PaginatedResponse<Deployment>> {
    return this.http.get<PaginatedResponse<Deployment>>(`${this.url}?page=${page}`);
  }

  getById(id: number): Observable<ApiResponse<Deployment>> {
    return this.http.get<ApiResponse<Deployment>>(`${this.url}/${id}`);
  }

  create(data: CreateDeploymentDto): Observable<ApiResponse<Deployment>> {
    return this.http.post<ApiResponse<Deployment>>(this.url, data);
  }

  update(id: number, data: UpdateDeploymentDto): Observable<ApiResponse<Deployment>> {
    return this.http.put<ApiResponse<Deployment>>(`${this.url}/${id}`, data);
  }

  delete(id: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.url}/${id}`);
  }
}
