import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse, PaginatedResponse } from '../models/api-response.model';
import { Environment, CreateEnvironmentDto, UpdateEnvironmentDto } from '../models/environment.model';

@Injectable({ providedIn: 'root' })
export class EnvironmentService {
  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/environments`;

  getAll(page = 1): Observable<PaginatedResponse<Environment>> {
    return this.http.get<PaginatedResponse<Environment>>(`${this.url}?page=${page}`);
  }

  getById(id: number): Observable<ApiResponse<Environment>> {
    return this.http.get<ApiResponse<Environment>>(`${this.url}/${id}`);
  }

  create(data: CreateEnvironmentDto): Observable<ApiResponse<Environment>> {
    return this.http.post<ApiResponse<Environment>>(this.url, data);
  }

  update(id: number, data: UpdateEnvironmentDto): Observable<ApiResponse<Environment>> {
    return this.http.put<ApiResponse<Environment>>(`${this.url}/${id}`, data);
  }

  delete(id: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.url}/${id}`);
  }
}
