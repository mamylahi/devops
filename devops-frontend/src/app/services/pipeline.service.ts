import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse, PaginatedResponse } from '../models/api-response.model';
import { Pipeline, CreatePipelineDto, UpdatePipelineDto } from '../models/pipeline.model';

@Injectable({ providedIn: 'root' })
export class PipelineService {
  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/pipelines`;

  getAll(page = 1): Observable<PaginatedResponse<Pipeline>> {
    return this.http.get<PaginatedResponse<Pipeline>>(`${this.url}?page=${page}`);
  }

  getById(id: number): Observable<ApiResponse<Pipeline>> {
    return this.http.get<ApiResponse<Pipeline>>(`${this.url}/${id}`);
  }

  create(data: CreatePipelineDto): Observable<ApiResponse<Pipeline>> {
    return this.http.post<ApiResponse<Pipeline>>(this.url, data);
  }

  update(id: number, data: UpdatePipelineDto): Observable<ApiResponse<Pipeline>> {
    return this.http.put<ApiResponse<Pipeline>>(`${this.url}/${id}`, data);
  }

  delete(id: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.url}/${id}`);
  }
}
