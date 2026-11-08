import { Environment } from './environment.model';
import { Pipeline } from './pipeline.model';

export type DeploymentStatus = 'pending' | 'running' | 'success' | 'failed' | 'rolled_back';

export interface Deployment {
  id: number;
  pipeline_id?: number;
  environment_id?: number;
  status: DeploymentStatus;
  commit_hash?: string;
  triggered_by?: string;
  started_at?: string;
  finished_at?: string;
  logs?: string;
  pipeline?: Pipeline;
  environment?: Environment;
  created_at?: string;
  updated_at?: string;
}

export interface CreateDeploymentDto {
  pipeline_id: number;
  environment_id: number;
  status: DeploymentStatus;
  commit_hash?: string;
  triggered_by?: string;
  started_at?: string;
  finished_at?: string;
  logs?: string;
}

export interface UpdateDeploymentDto {
  pipeline_id?: number;
  environment_id?: number;
  status?: DeploymentStatus;
  commit_hash?: string;
  triggered_by?: string;
  started_at?: string;
  finished_at?: string;
  logs?: string;
}
