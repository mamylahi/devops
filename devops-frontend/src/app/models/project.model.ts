import { User } from './user.model';

export type ProjectStatus = 'active' | 'archived' | 'pending';

export interface Project {
  id: number;
  name: string;
  description?: string;
  status: ProjectStatus;
  repository_url?: string;
  user_id?: number;
  owner?: User;
  created_at?: string;
  updated_at?: string;
}

export interface CreateProjectDto {
  user_id: number;
  name: string;
  description?: string;
  status: ProjectStatus;
  repository_url?: string;
}

export interface UpdateProjectDto {
  user_id?: number;
  name?: string;
  description?: string;
  status?: ProjectStatus;
  repository_url?: string;
}
