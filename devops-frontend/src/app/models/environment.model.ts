import { Project } from './project.model';

export type EnvironmentName = 'development' | 'staging' | 'production';
export type EnvironmentStatus = 'active' | 'inactive' | 'deploying';

export interface Environment {
  id: number;
  project_id?: number;
  name: EnvironmentName;
  url?: string;
  status: EnvironmentStatus;
  variables?: Record<string, string>;
  project?: Project;
  created_at?: string;
  updated_at?: string;
}

export interface CreateEnvironmentDto {
  project_id: number;
  name: EnvironmentName;
  url?: string;
  status: EnvironmentStatus;
  variables?: Record<string, string>;
}

export interface UpdateEnvironmentDto {
  project_id?: number;
  name?: EnvironmentName;
  url?: string;
  status?: EnvironmentStatus;
  variables?: Record<string, string>;
}
