import { Project } from './project.model';

export type PipelineStatus = 'idle' | 'running' | 'success' | 'failed';

export interface Pipeline {
  id: number;
  project_id?: number;
  name: string;
  branch: string;
  status: PipelineStatus;
  configuration?: string;
  project?: Project;
  created_at?: string;
  updated_at?: string;
}

export interface CreatePipelineDto {
  project_id: number;
  name: string;
  branch: string;
  status: PipelineStatus;
  configuration?: string;
}

export interface UpdatePipelineDto {
  project_id?: number;
  name?: string;
  branch?: string;
  status?: PipelineStatus;
  configuration?: string;
}
